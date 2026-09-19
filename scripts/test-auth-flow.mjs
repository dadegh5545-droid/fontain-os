#!/usr/bin/env node
/**
 * Fontain OS — اختبار تكامل تدفّق الدخول بالهاتف وOTP (FOS-005).
 *
 * يعمل على sandbox المطوّر، على الخلفية المنشورة فعلًا، بلا أي محاكاة:
 * ينشئ مستخدم اختبار، يمر بتدفّق `CUSTOM_AUTH` الحقيقي، يقرأ الرمز من CloudWatch
 * (وضع التسليم `log` في sandbox)، ثم يتحقق من القبول والرفض، ويحذف المستخدم.
 *
 * التشغيل:
 *   $env:AWS_REGION='ap-south-1'; $env:AWS_DEFAULT_REGION='ap-south-1'
 *   node scripts/test-auth-flow.mjs --profile lis
 *
 * الخيارات: `--profile <name>`، `--region <region>`، `--phone <+974...>`.
 *
 * ما يتحقق منه:
 *   1. الدخول بالرمز الصحيح يُصدر رموز جلسة تحمل رقم الهاتف.
 *   2. الرمز يُستهلك مرة واحدة: إعادة استخدامه في جلسة جديدة تُرفض.
 *   3. الرموز الخاطئة تُرفض، وتُستهلك المحاولات ثم تُرفض المصادقة نهائيًا.
 *   4. رقم غير مسجّل لا يكشف عدم وجوده (بحسب إعداد PreventUserExistenceErrors).
 */

import { readFileSync } from "node:fs";
import { argv, env, exit } from "node:process";
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  DescribeUserPoolClientCommand,
  DescribeUserPoolCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CloudWatchLogsClient, FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

/** الحدث الذي يكتبه `amplify/shared/otp/sender.ts` في وضع `log`. */
const OTP_DEV_LOG_EVENT = "otp.issued.dev";
/** سقف المحاولات في `amplify/shared/otp/config.ts`. */
const OTP_MAX_ATTEMPTS = 3;
const CODE_LOOKUP_TIMEOUT_MS = 60_000;
const CODE_LOOKUP_INTERVAL_MS = 2_000;

// ── الوسائط ─────────────────────────────────────────────────────────────────

function readArg(name) {
  const index = argv.indexOf(`--${name}`);
  return index !== -1 && argv[index + 1] ? argv[index + 1] : undefined;
}

const profile = readArg("profile");
if (profile) env.AWS_PROFILE = profile;

const region = readArg("region") ?? env.AWS_REGION ?? env.AWS_DEFAULT_REGION;

// ── مخرجات الـsandbox ────────────────────────────────────────────────────────

function loadAuthOutputs() {
  let raw;
  try {
    raw = readFileSync("amplify_outputs.json", "utf8");
  } catch {
    fail(
      "amplify_outputs.json غير موجود. شغّل `npx ampx sandbox --identifier dev-a --profile lis` أولًا.",
    );
  }
  const outputs = JSON.parse(raw);
  const auth = outputs.auth ?? {};
  const userPoolId = auth.user_pool_id ?? auth.userPoolId;
  const clientId = auth.user_pool_client_id ?? auth.userPoolClientId;
  const outputsRegion = auth.aws_region ?? auth.awsRegion;
  if (!userPoolId || !clientId) {
    fail("amplify_outputs.json لا يحتوي إعداد auth. تأكد أن `auth` منشور في الـsandbox.");
  }
  return { userPoolId, clientId, region: region ?? outputsRegion };
}

// ── أدوات الطباعة ────────────────────────────────────────────────────────────

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true });
  console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}

function reject(name, detail = "") {
  results.push({ name, ok: false });
  console.error(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function note(message) {
  console.log(`  ..    ${message}`);
}

function fail(message) {
  console.error(`\nخطأ: ${message}`);
  exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── مساعدات ─────────────────────────────────────────────────────────────────

/** رقم قطري عشوائي للاختبار: بادئة جوال صحيحة وسبع خانات عشوائية. */
function randomTestPhone() {
  let local = "3";
  for (let i = 0; i < 7; i += 1) local += String(Math.floor(Math.random() * 10));
  return `+974${local}`;
}

/** كلمة مرور قوية تُضبط مرة ثم لا تُستخدم: الدخول كله بالـOTP. */
function randomPassword() {
  const bytes = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return `Aa1!${bytes.slice(0, 20)}`;
}

function decodeJwtPayload(token) {
  const payload = token.split(".")[1];
  const normalized = payload.replaceAll("-", "+").replaceAll("_", "/");
  return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
}

function functionNameFromArn(arn) {
  return arn.split(":function:")[1]?.split(":")[0];
}

/** يقرأ رمز الـOTP من سجل الدالة. القراءة تحتاج صلاحية AWS، فليست بابًا خلفيًا للعميل. */
async function readOtpFromLogs(logs, logGroupName, userKey, startTime) {
  const deadline = Date.now() + CODE_LOOKUP_TIMEOUT_MS;
  let lastSeen;
  while (Date.now() < deadline) {
    let response;
    try {
      response = await logs.send(
        new FilterLogEventsCommand({
          logGroupName,
          startTime,
          filterPattern: `"${OTP_DEV_LOG_EVENT}"`,
        }),
      );
    } catch (error) {
      // مجموعة السجلات تُنشأ عند أول استدعاء وقد تتأخر ثوانٍ في الانتشار.
      if (error.name !== "ResourceNotFoundException") throw error;
      await sleep(CODE_LOOKUP_INTERVAL_MS);
      continue;
    }
    for (const logEvent of response.events ?? []) {
      const start = logEvent.message?.indexOf("{");
      if (start === undefined || start < 0) continue;
      let parsed;
      try {
        parsed = JSON.parse(logEvent.message.slice(start).trim());
      } catch {
        continue;
      }
      if (parsed.event === OTP_DEV_LOG_EVENT && parsed.userKey === userKey) {
        lastSeen = parsed.code;
      }
    }
    if (lastSeen) return lastSeen;
    await sleep(CODE_LOOKUP_INTERVAL_MS);
  }
  return undefined;
}

async function startCustomAuth(cognito, clientId, phone) {
  return cognito.send(
    new InitiateAuthCommand({
      AuthFlow: "CUSTOM_AUTH",
      ClientId: clientId,
      AuthParameters: { USERNAME: phone },
    }),
  );
}

async function answerChallenge(cognito, clientId, phone, session, answer) {
  return cognito.send(
    new RespondToAuthChallengeCommand({
      ClientId: clientId,
      ChallengeName: "CUSTOM_CHALLENGE",
      Session: session,
      ChallengeResponses: { USERNAME: phone, ANSWER: answer },
    }),
  );
}

// ── التدفّق ──────────────────────────────────────────────────────────────────

async function main() {
  const { userPoolId, clientId, region: resolvedRegion } = loadAuthOutputs();
  if (!resolvedRegion) {
    fail("المنطقة غير محددة. اضبط AWS_REGION أو مرّر --region.");
  }

  const cognito = new CognitoIdentityProviderClient({ region: resolvedRegion });
  const logs = new CloudWatchLogsClient({ region: resolvedRegion });

  console.log("Fontain OS — test-auth-flow (FOS-005)");
  console.log(`  user pool: ${userPoolId}`);
  console.log(`  region:    ${resolvedRegion}`);
  console.log(`  profile:   ${env.AWS_PROFILE ?? "(default chain)"}`);

  const pool = await cognito.send(new DescribeUserPoolCommand({ UserPoolId: userPoolId }));
  const triggers = pool.UserPool?.LambdaConfig ?? {};
  for (const trigger of [
    "DefineAuthChallenge",
    "CreateAuthChallenge",
    "VerifyAuthChallengeResponse",
    "PreSignUp",
  ]) {
    if (triggers[trigger]) {
      pass(`محفّز ${trigger} مربوط`);
    } else {
      reject(`محفّز ${trigger} مربوط`, "غير موجود في LambdaConfig");
    }
  }

  const createFunctionName = functionNameFromArn(triggers.CreateAuthChallenge ?? "");
  if (!createFunctionName) {
    fail("لم أستطع استخراج اسم دالة createAuthChallenge من إعداد الـuser pool.");
  }
  const logGroupName = `/aws/lambda/${createFunctionName}`;

  const client = await cognito.send(
    new DescribeUserPoolClientCommand({ UserPoolId: userPoolId, ClientId: clientId }),
  );
  const existenceErrors = client.UserPoolClient?.PreventUserExistenceErrors ?? "LEGACY";
  const authFlows = client.UserPoolClient?.ExplicitAuthFlows ?? [];
  if (authFlows.includes("ALLOW_CUSTOM_AUTH")) {
    pass("ALLOW_CUSTOM_AUTH مُمكَّن على app client");
  } else {
    reject("ALLOW_CUSTOM_AUTH مُمكَّن على app client", authFlows.join(", "));
  }
  note(`PreventUserExistenceErrors = ${existenceErrors}`);

  const phone = readArg("phone") ?? randomTestPhone();
  let created = false;

  try {
    await cognito.send(
      new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: phone,
        MessageAction: "SUPPRESS",
        UserAttributes: [
          { Name: "phone_number", Value: phone },
          { Name: "phone_number_verified", Value: "true" },
        ],
      }),
    );
    created = true;
    // كلمة مرور دائمة عشوائية: تُخرج المستخدم من FORCE_CHANGE_PASSWORD فيعمل CUSTOM_AUTH.
    await cognito.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: userPoolId,
        Username: phone,
        Password: randomPassword(),
        Permanent: true,
      }),
    );
    pass("إنشاء مستخدم اختبار بلا رسالة تحقق", phone);

    /*
     * `loginWith.phone` يجعل الرقم alias للدخول، واسم المستخدم الفعلي الذي تراه
     * المحفزات (`event.userName`) هو الـsub. وهو أيضًا مفتاح سجل التحدي في الجدول.
     */
    const user = await cognito.send(
      new AdminGetUserCommand({ UserPoolId: userPoolId, Username: phone }),
    );
    const userKey = user.UserAttributes?.find((attribute) => attribute.Name === "sub")?.Value;
    if (!userKey) {
      throw new Error("لم أجد سمة sub لمستخدم الاختبار.");
    }
    note(`sub المستخدم: ${userKey}`);

    // 1) المسار الناجح.
    const startTime = Date.now() - 10_000;
    const first = await startCustomAuth(cognito, clientId, phone);
    if (first.ChallengeName === "CUSTOM_CHALLENGE" && first.Session) {
      pass("بدء الدخول يعيد تحديًا مخصّصًا");
    } else {
      reject("بدء الدخول يعيد تحديًا مخصّصًا", first.ChallengeName ?? "(بلا تحدٍ)");
    }
    if (first.ChallengeParameters?.codeLength === "6") {
      pass("معاملات التحدي العامة تحمل طول الرمز فقط");
    } else {
      reject("معاملات التحدي العامة تحمل طول الرمز فقط", JSON.stringify(first.ChallengeParameters));
    }

    note("قراءة الرمز من CloudWatch…");
    const code = await readOtpFromLogs(logs, logGroupName, userKey, startTime);
    if (!code) {
      throw new Error(
        `لم أجد رمزًا في ${logGroupName}. تأكد أن OTP_DELIVERY_MODE=log على دالة createAuthChallenge.`,
      );
    }
    pass("الرمز سُلّم عبر السجل (وضع sandbox)", `${code.length} خانات`);

    const success = await answerChallenge(cognito, clientId, phone, first.Session, code);
    const idToken = success.AuthenticationResult?.IdToken;
    if (idToken) {
      pass("الرمز الصحيح يُصدر رموز جلسة");
      const claims = decodeJwtPayload(idToken);
      if (claims.phone_number === phone) {
        pass("رمز الهوية يحمل رقم الهاتف", claims.phone_number);
      } else {
        reject("رمز الهوية يحمل رقم الهاتف", String(claims.phone_number));
      }
      if (claims.phone_number_verified === true) {
        pass("الرقم معتمد في رمز الهوية");
      } else {
        reject("الرقم معتمد في رمز الهوية", String(claims.phone_number_verified));
      }
    } else {
      reject("الرمز الصحيح يُصدر رموز جلسة", success.ChallengeName ?? "(بلا رموز)");
    }

    // 2) الرمز يُستهلك مرة واحدة.
    const replay = await startCustomAuth(cognito, clientId, phone);
    try {
      const replayResult = await answerChallenge(cognito, clientId, phone, replay.Session, code);
      if (replayResult.AuthenticationResult?.IdToken) {
        reject("إعادة استخدام الرمز مرفوضة", "أُصدرت رموز جلسة!");
      } else {
        pass("إعادة استخدام الرمز مرفوضة", "لم تُصدر رموز");
      }
    } catch (error) {
      pass("إعادة استخدام الرمز مرفوضة", error.name);
    }

    // 3) الرموز الخاطئة تُرفض ثم تُستهلك المحاولات.
    const attemptsRun = await startCustomAuth(cognito, clientId, phone);
    let session = attemptsRun.Session;
    let rejectedFinally = false;
    let wrongAnswersAccepted = 0;
    for (let attempt = 1; attempt <= OTP_MAX_ATTEMPTS + 1; attempt += 1) {
      const wrongCode = String(attempt).padStart(6, "9");
      try {
        const response = await answerChallenge(cognito, clientId, phone, session, wrongCode);
        if (response.AuthenticationResult?.IdToken) {
          wrongAnswersAccepted += 1;
          break;
        }
        session = response.Session;
      } catch (error) {
        if (error.name === "NotAuthorizedException") {
          rejectedFinally = true;
          note(`رُفضت المصادقة نهائيًا بعد ${attempt} محاولة خاطئة`);
          break;
        }
        throw error;
      }
    }
    if (wrongAnswersAccepted > 0) {
      reject("الرمز الخاطئ مرفوض", "قُبل رمز خاطئ!");
    } else {
      pass("الرمز الخاطئ مرفوض");
    }
    if (rejectedFinally) {
      pass("سقف المحاولات يرفض المصادقة نهائيًا");
    } else {
      reject("سقف المحاولات يرفض المصادقة نهائيًا", "لم يُرفع NotAuthorizedException");
    }

    // 4) رقم غير مسجّل.
    const unknownPhone = randomTestPhone();
    try {
      const unknown = await startCustomAuth(cognito, clientId, unknownPhone);
      if (unknown.ChallengeName === "CUSTOM_CHALLENGE") {
        pass("رقم غير مسجّل لا يكشف عدم وجوده");
        /*
         * السلوك الصحيح هو ألّا تُصدر رموز جلسة. Cognito يُعيد تحديًا آخر تمامًا كما
         * يفعل مع مستخدم حقيقي أدخل رمزًا خاطئًا — وهذا هو المقصود: لا فرق يُستدل منه
         * على وجود الرقم. الرفض النهائي يأتي عند استهلاك سقف المحاولات.
         */
        try {
          const unknownAnswer = await answerChallenge(
            cognito,
            clientId,
            unknownPhone,
            unknown.Session,
            "123456",
          );
          if (unknownAnswer.AuthenticationResult?.IdToken) {
            reject("رقم غير مسجّل لا يُصادَق", "أُصدرت رموز جلسة!");
          } else {
            pass(
              "رقم غير مسجّل لا يُصادَق",
              `لم تُصدر رموز (${unknownAnswer.ChallengeName ?? "بلا تحدٍ"})`,
            );
          }
        } catch (error) {
          pass("رقم غير مسجّل لا يُصادَق", error.name);
        }
      } else {
        reject("رقم غير مسجّل لا يكشف عدم وجوده", unknown.ChallengeName ?? "(بلا تحدٍ)");
      }
    } catch (error) {
      if (error.name === "UserNotFoundException" && existenceErrors !== "ENABLED") {
        note(
          `رقم غير مسجّل يرفع UserNotFoundException لأن PreventUserExistenceErrors=${existenceErrors} على app client`,
        );
        pass("رقم غير مسجّل لا يُصادَق", error.name);
      } else {
        reject("رقم غير مسجّل لا يكشف عدم وجوده", error.name);
      }
    }
  } finally {
    if (created) {
      await cognito.send(new AdminDeleteUserCommand({ UserPoolId: userPoolId, Username: phone }));
      console.log(`  ..    حُذف مستخدم الاختبار ${phone}`);
    }
  }

  const failed = results.filter((result) => !result.ok);
  console.log(`\n${results.length - failed.length}/${results.length} فحصًا ناجحًا`);
  if (failed.length > 0) {
    console.error("فشل:");
    for (const result of failed) console.error(`  - ${result.name}`);
    exit(1);
  }
  console.log("test-auth-flow: نجح");
}

main().catch((error) => {
  console.error(error);
  exit(1);
});
