/**
 * Fontain OS — محفّز `verifyAuthChallengeResponse` (FOS-005).
 *
 * يبدأ بالرفض ويُثبته إلى `true` في مسار واحد فقط: سجل موجود، غير منتهٍ، لم يستهلك
 * سقف المحاولات، وهاش الرمز المُدخَل يطابق المخزَّن بمقارنة ثابتة الزمن.
 * الرمز يُستهلك مرة واحدة: السجل يُحذف عند النجاح.
 */

import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";
import {
  hashOtpCode,
  isOtpExpired,
  normalizeSubmittedCode,
  nowInSeconds,
  safeCompareHex,
} from "../../shared/otp/code";
import { OTP_CODE_LENGTH, OTP_MAX_ATTEMPTS } from "../../shared/otp/config";
import { deleteChallenge, getChallenge, registerFailedAttempt } from "../../shared/otp/store";

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event) => {
  event.response.answerCorrect = false;

  if (event.request.userNotFound) {
    return event;
  }

  const submitted = normalizeSubmittedCode(event.request.challengeAnswer);
  if (submitted.length !== OTP_CODE_LENGTH) {
    return event;
  }

  const userKey = event.userName;
  const record = await getChallenge(userKey);
  if (!record) {
    return event;
  }

  if (isOtpExpired(record.expiresAt, nowInSeconds())) {
    await deleteChallenge(userKey);
    return event;
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return event;
  }

  const matches = safeCompareHex(hashOtpCode(submitted, record.salt), record.codeHash);
  if (!matches) {
    await registerFailedAttempt(userKey);
    return event;
  }

  await deleteChallenge(userKey);
  event.response.answerCorrect = true;
  return event;
};
