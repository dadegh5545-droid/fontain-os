/**
 * Fontain OS — قرار `defineAuthChallenge` كمنطق نقي (FOS-005).
 *
 * مفصول عن المحفّز نفسه ليُختبر بـvitest: هذا القرار هو ما يمنع تجاوز الـOTP،
 * فأي خطأ فيه يعني مصادقة بلا رمز. الضمانات:
 *   - المسار الوحيد المقبول هو CUSTOM_CHALLENGE (لا SRP ولا كلمة مرور).
 *   - لا تُصدر رموز جلسة إلا بعد تحدٍ مخصّص ناجح.
 *   - الرفض النهائي عند استهلاك سقف المحاولات.
 */

import { CUSTOM_CHALLENGE_NAME, OTP_MAX_ATTEMPTS } from "./config";

/** عنصر واحد من سجل جلسة Cognito، بالقدر الذي يهم القرار. */
export type ChallengeAttempt = {
  challengeName?: string;
  challengeResult?: boolean;
};

/** ما يجب أن يُكتب في `event.response`. */
export type ChallengeDecision = {
  challengeName?: typeof CUSTOM_CHALLENGE_NAME;
  issueTokens: boolean;
  failAuthentication: boolean;
};

/**
 * يقرّر الخطوة التالية من سجل الجلسة.
 *
 * @param session سجل المحاولات كما يرسله Cognito (الأقدم أولًا).
 * @param maxAttempts سقف المحاولات؛ قابل للتمرير للاختبار فقط.
 */
export function decideAuthChallenge(
  session: readonly ChallengeAttempt[] | undefined,
  maxAttempts: number = OTP_MAX_ATTEMPTS,
): ChallengeDecision {
  const attempts = session ?? [];

  // بداية جلسة: اطلب التحدي المخصّص.
  if (attempts.length === 0) {
    return { challengeName: CUSTOM_CHALLENGE_NAME, issueTokens: false, failAuthentication: false };
  }

  // أي محاولة بمسار آخر (SRP، كلمة مرور، تحدٍ غير متوقع) ترفض فورًا.
  if (attempts.some((attempt) => attempt.challengeName !== CUSTOM_CHALLENGE_NAME)) {
    return { issueTokens: false, failAuthentication: true };
  }

  const last = attempts[attempts.length - 1];
  if (last.challengeResult === true) {
    return { issueTokens: true, failAuthentication: false };
  }

  if (attempts.length >= maxAttempts) {
    return { issueTokens: false, failAuthentication: true };
  }

  return { challengeName: CUSTOM_CHALLENGE_NAME, issueTokens: false, failAuthentication: false };
}
