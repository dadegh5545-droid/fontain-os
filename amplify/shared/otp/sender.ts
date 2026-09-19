/**
 * Fontain OS — قناة تسليم رمز الـOTP (FOS-005).
 *
 * الوضع يُحدَّد بمتغيّر البيئة `OTP_DELIVERY_MODE` المصرَّح به في resource الدالة:
 *
 *   `log` — sandbox المطوّر فقط: الرمز يُكتب في CloudWatch ولا يُرسل SMS.
 *           بهذا ينجح `scripts/test-auth-flow.mjs` بلا تكلفة رسائل وبلا أي ثغرة
 *           في مسار المصادقة نفسه: قراءة الرمز تتطلب صلاحية AWS على السجلات،
 *           فليس هناك باب خلفي يصل إليه العميل.
 *
 *   `sms`  — الإنتاج: مزوّد الرسائل يُوصَل في مهمة مستقلة (انظر `amplify/README.md`).
 *           حتى ذلك الحين يفشل الوضع بصوت عالٍ ولا يسقط صامتًا إلى `log`،
 *           فلا يُنشر إنتاج يطبع رموزه في السجلات.
 */

import { maskPhone } from "../../../shared/phone";

/** أوضاع التسليم المسموحة. */
export const OTP_DELIVERY_MODES = ["log", "sms"] as const;
export type OtpDeliveryMode = (typeof OTP_DELIVERY_MODES)[number];

/** الحدث الذي يبحث عنه `scripts/test-auth-flow.mjs` في CloudWatch. */
export const OTP_DEV_LOG_EVENT = "otp.issued.dev";

/** يُرفع عندما يكون الوضع `sms` ومزوّد الرسائل غير موصَّل بعد. */
export class OtpDeliveryNotConfiguredError extends Error {
  constructor(mode: string) {
    super(
      `OTP delivery mode "${mode}" is not wired yet. ` +
        `Sandbox uses OTP_DELIVERY_MODE=log; production SMS is wired in a later task.`,
    );
    this.name = "OtpDeliveryNotConfiguredError";
  }
}

/** يُرفع عندما تكون قيمة `OTP_DELIVERY_MODE` مفقودة أو غير معروفة. */
export class OtpDeliveryModeError extends Error {
  constructor(value: string | undefined) {
    super(
      `OTP_DELIVERY_MODE must be one of ${OTP_DELIVERY_MODES.join(", ")} (received: ${value ?? "undefined"}).`,
    );
    this.name = "OtpDeliveryModeError";
  }
}

/** يقرأ الوضع من البيئة ويتحقق منه. لا قيمة افتراضية: الوضع مصرَّح به في resource الدالة. */
export function readDeliveryMode(env: NodeJS.ProcessEnv = process.env): OtpDeliveryMode {
  const value = env.OTP_DELIVERY_MODE;
  if (value === "log" || value === "sms") return value;
  throw new OtpDeliveryModeError(value);
}

/**
 * يسلّم الرمز عبر القناة المطلوبة.
 *
 * @param userKey مفتاح المستخدم في Cognito (يُستخدم لربط السجل بالاختبار).
 * @param phone الرقم بصيغة E.164.
 * @param code الرمز الصريح — لا يُخزَّن في أي مكان آخر ولا يعود إلى العميل.
 */
export async function deliverOtp(
  userKey: string,
  phone: string,
  code: string,
  mode: OtpDeliveryMode,
): Promise<void> {
  if (mode === "sms") {
    throw new OtpDeliveryNotConfiguredError(mode);
  }

  // وضع sandbox: الرقم مُخفّى جزئيًا، والرمز صريح لأن قراءة السجل تحتاج صلاحية AWS.
  console.log(
    JSON.stringify({
      event: OTP_DEV_LOG_EVENT,
      userKey,
      phone: maskPhone(phone),
      code,
    }),
  );
  return Promise.resolve();
}
