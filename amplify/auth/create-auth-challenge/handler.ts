/**
 * Fontain OS — محفّز `createAuthChallenge` (FOS-005).
 *
 * يُصدر رمز OTP ويسلّمه، ويكتب هاشه فقط في جدول التحديات.
 *
 * ثابت مهم: هذا المحفّز يُرجع تحديًا في كل الحالات — مستخدم غير موجود، حد إرسال
 * مُستهلك، أو إعادة محاولة — بنفس `publicChallengeParameters`. فلا يستدل العميل
 * من الاستجابة على وجود الرقم في النظام ولا على حالة حد الإرسال.
 */

import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { normalizePhone } from "../../../shared/phone";
import { generateOtpCode, generateOtpSalt, hashOtpCode, nowInSeconds } from "../../shared/otp/code";
import { CUSTOM_CHALLENGE_NAME, OTP_CODE_LENGTH } from "../../shared/otp/config";
import { planOtpIssue } from "../../shared/otp/issue-policy";
import { deliverOtp, readDeliveryMode } from "../../shared/otp/sender";
import { getChallenge, putChallenge } from "../../shared/otp/store";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  if (event.request.challengeName !== CUSTOM_CHALLENGE_NAME) {
    return event;
  }

  // لا شيء سري هنا: طول الرمز فقط، ليعرف العميل شكل الحقل المطلوب.
  event.response.publicChallengeParameters = { codeLength: String(OTP_CODE_LENGTH) };
  event.response.privateChallengeParameters = {};
  event.response.challengeMetadata = "PHONE_OTP";

  // مستخدم غير موجود: تحدٍ صوري بلا إصدار ولا إرسال. التحقق سيفشل لعدم وجود سجل.
  if (event.request.userNotFound) {
    return event;
  }

  const userKey = event.userName;
  const phone = normalizePhone(event.request.userAttributes.phone_number ?? "");
  if (!phone) {
    console.warn(JSON.stringify({ event: "otp.skipped", reason: "no-valid-phone", userKey }));
    return event;
  }

  const now = nowInSeconds();
  const isRetry = (event.request.session ?? []).some(
    (attempt) => attempt.challengeName === CUSTOM_CHALLENGE_NAME,
  );

  const existing = await getChallenge(userKey);
  const plan = planOtpIssue({ existing, isRetry, now });

  if (plan.action !== "issue") {
    console.log(JSON.stringify({ event: "otp.not_issued", action: plan.action, userKey }));
    return event;
  }

  const code = generateOtpCode();
  const salt = generateOtpSalt();

  await putChallenge({
    userKey,
    codeHash: hashOtpCode(code, salt),
    salt,
    expiresAt: plan.expiresAt,
    attempts: 0,
    sendCount: plan.sendCount,
    windowStartedAt: plan.windowStartedAt,
  });

  await deliverOtp(userKey, phone, code, readDeliveryMode());

  return event;
};
