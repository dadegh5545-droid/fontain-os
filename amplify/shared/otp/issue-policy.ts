/**
 * Fontain OS — قرار إصدار رمز الـOTP كمنطق نقي (FOS-005).
 *
 * مفصول عن DynamoDB ليُختبر بـvitest. يجيب على سؤال واحد: عند كل استدعاء
 * لـ`createAuthChallenge`، هل نُصدر رمزًا جديدًا ونرسله، أم نُعيد استخدام الرمز
 * القائم بلا إرسال، أم نمتنع تمامًا؟
 *
 * الضمانات:
 *   - إعادة المحاولة داخل نفس الجلسة لا تُصدر رمزًا جديدًا ولا ترسل رسالة ثانية،
 *     فالمستخدم الذي أخطأ في خانة يُكمل بنفس الرمز حتى سقف المحاولات.
 *   - حد إرسال لكل مستخدم داخل نافذة زمنية يمنع إغراقه برسائل (تكلفة وإزعاج).
 *   - عند بلوغ الحد بلا رمز صالح: امتناع صامت. لا خطأ مختلف ولا تسريب
 *     لوجود المستخدم أو لحالة الحد.
 */

import { isOtpExpired } from "./code";
import { OTP_MAX_SENDS_PER_WINDOW, OTP_SEND_WINDOW_SECONDS, OTP_TTL_SECONDS } from "./config";

/** سجل التحدي المخزَّن (نفس شكل عنصر DynamoDB). */
export type OtpChallengeRecord = {
  userKey: string;
  codeHash: string;
  salt: string;
  expiresAt: number;
  attempts: number;
  sendCount: number;
  windowStartedAt: number;
  ttl: number;
};

export type OtpIssuePlan =
  /** أصدر رمزًا جديدًا وأرسله، واكتب السجل بهذه القيم. */
  | { action: "issue"; sendCount: number; windowStartedAt: number; expiresAt: number }
  /** رمز صالح قائم: لا إصدار ولا إرسال. */
  | { action: "reuse" }
  /** بلغ حد الإرسال ولا رمز صالح: لا إصدار ولا إرسال. */
  | { action: "suppress"; reason: "rate-limited" };

export type OtpIssueInput = {
  /** السجل الحالي إن وُجد. */
  existing: OtpChallengeRecord | undefined;
  /** هل هذا استدعاء إعادة داخل نفس جلسة المصادقة (أي سبقته محاولة خاطئة)؟ */
  isRetry: boolean;
  /** الآن بالثواني. */
  now: number;
};

/** يحسب الخطة. لا تأثيرات جانبية: كل الإدخال صريح والناتج بيانات فقط. */
export function planOtpIssue({ existing, isRetry, now }: OtpIssueInput): OtpIssuePlan {
  const hasLiveCode = existing !== undefined && !isOtpExpired(existing.expiresAt, now);

  // إعادة المحاولة على رمز ما زال صالحًا: أكمل به.
  if (isRetry && hasLiveCode) {
    return { action: "reuse" };
  }

  const windowIsOpen =
    existing !== undefined && now - existing.windowStartedAt < OTP_SEND_WINDOW_SECONDS;

  const sendCount = windowIsOpen ? existing.sendCount : 0;
  const windowStartedAt = windowIsOpen ? existing.windowStartedAt : now;

  if (sendCount >= OTP_MAX_SENDS_PER_WINDOW) {
    // بلغ الحد: إن كان لديه رمز صالح فليُكمل به، وإلا فامتناع صامت.
    return hasLiveCode ? { action: "reuse" } : { action: "suppress", reason: "rate-limited" };
  }

  return {
    action: "issue",
    sendCount: sendCount + 1,
    windowStartedAt,
    expiresAt: now + OTP_TTL_SECONDS,
  };
}
