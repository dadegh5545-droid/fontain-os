import { describe, expect, it } from "vitest";
import {
  decideAuthChallenge,
  type ChallengeAttempt,
} from "../../../../amplify/shared/otp/challenge-policy";
import { OTP_MAX_ATTEMPTS } from "../../../../amplify/shared/otp/config";

const custom = (challengeResult: boolean): ChallengeAttempt => ({
  challengeName: "CUSTOM_CHALLENGE",
  challengeResult,
});

describe("decideAuthChallenge", () => {
  it("يطلب تحديًا مخصّصًا في بداية الجلسة", () => {
    expect(decideAuthChallenge([])).toEqual({
      challengeName: "CUSTOM_CHALLENGE",
      issueTokens: false,
      failAuthentication: false,
    });
  });

  it("يتعامل مع جلسة غير معرَّفة كبداية", () => {
    expect(decideAuthChallenge(undefined).challengeName).toBe("CUSTOM_CHALLENGE");
  });

  it("يُصدر الرموز بعد تحدٍ صحيح", () => {
    expect(decideAuthChallenge([custom(true)])).toEqual({
      issueTokens: true,
      failAuthentication: false,
    });
  });

  it("يعيد التحدي بعد محاولة خاطئة واحدة", () => {
    const decision = decideAuthChallenge([custom(false)]);
    expect(decision.challengeName).toBe("CUSTOM_CHALLENGE");
    expect(decision.issueTokens).toBe(false);
    expect(decision.failAuthentication).toBe(false);
  });

  it("يرفض نهائيًا عند استهلاك سقف المحاولات", () => {
    const session = Array.from({ length: OTP_MAX_ATTEMPTS }, () => custom(false));
    expect(decideAuthChallenge(session)).toEqual({
      issueTokens: false,
      failAuthentication: true,
    });
  });

  it("لا يُصدر رموزًا أبدًا قبل تحدٍ ناجح", () => {
    for (let count = 0; count <= OTP_MAX_ATTEMPTS + 2; count += 1) {
      const session = Array.from({ length: count }, () => custom(false));
      expect(decideAuthChallenge(session).issueTokens).toBe(false);
    }
  });

  it("يرفض أي مسار غير CUSTOM_CHALLENGE", () => {
    expect(decideAuthChallenge([{ challengeName: "SRP_A", challengeResult: true }])).toEqual({
      issueTokens: false,
      failAuthentication: true,
    });
    expect(
      decideAuthChallenge([{ challengeName: "PASSWORD_VERIFIER", challengeResult: true }]),
    ).toEqual({
      issueTokens: false,
      failAuthentication: true,
    });
  });

  it("يرفض جلسة مختلطة فيها مسار آخر ولو نجح التحدي المخصّص", () => {
    const session = [
      custom(false),
      { challengeName: "SRP_A", challengeResult: true },
      custom(true),
    ];
    expect(decideAuthChallenge(session)).toEqual({
      issueTokens: false,
      failAuthentication: true,
    });
  });

  it("يحترم سقف محاولات مخصّصًا", () => {
    expect(decideAuthChallenge([custom(false)], 1).failAuthentication).toBe(true);
  });
});
