import { describe, expect, it } from "vitest";
import {
  OTP_MAX_SENDS_PER_WINDOW,
  OTP_SEND_WINDOW_SECONDS,
  OTP_TTL_SECONDS,
} from "../../../../amplify/shared/otp/config";
import { planOtpIssue, type OtpChallengeRecord } from "../../../../amplify/shared/otp/issue-policy";

const NOW = 1_800_000_000;

function record(overrides: Partial<OtpChallengeRecord> = {}): OtpChallengeRecord {
  return {
    userKey: "+97433001122",
    codeHash: "a".repeat(64),
    salt: "b".repeat(32),
    expiresAt: NOW + 60,
    attempts: 0,
    sendCount: 1,
    windowStartedAt: NOW - 60,
    ttl: NOW + 3600,
    ...overrides,
  };
}

describe("planOtpIssue — أول طلب", () => {
  it("يُصدر رمزًا جديدًا بلا سجل سابق", () => {
    expect(planOtpIssue({ existing: undefined, isRetry: false, now: NOW })).toEqual({
      action: "issue",
      sendCount: 1,
      windowStartedAt: NOW,
      expiresAt: NOW + OTP_TTL_SECONDS,
    });
  });

  it("لا يُعيد استخدام شيء عند غياب السجل ولو كانت إعادة محاولة", () => {
    expect(planOtpIssue({ existing: undefined, isRetry: true, now: NOW }).action).toBe("issue");
  });
});

describe("planOtpIssue — إعادة المحاولة", () => {
  it("يُعيد استخدام رمز صالح بلا إرسال جديد", () => {
    expect(planOtpIssue({ existing: record(), isRetry: true, now: NOW })).toEqual({
      action: "reuse",
    });
  });

  it("يُصدر رمزًا جديدًا إذا انتهى القائم", () => {
    const plan = planOtpIssue({
      existing: record({ expiresAt: NOW - 1 }),
      isRetry: true,
      now: NOW,
    });
    expect(plan.action).toBe("issue");
  });
});

describe("planOtpIssue — طلب جديد مع رمز قائم", () => {
  it("يُصدر رمزًا جديدًا ويزيد العدّاد داخل النافذة", () => {
    const plan = planOtpIssue({ existing: record({ sendCount: 2 }), isRetry: false, now: NOW });
    expect(plan).toEqual({
      action: "issue",
      sendCount: 3,
      windowStartedAt: NOW - 60,
      expiresAt: NOW + OTP_TTL_SECONDS,
    });
  });
});

describe("planOtpIssue — حد الإرسال", () => {
  it("يمتنع صامتًا عند بلوغ الحد بلا رمز صالح", () => {
    const existing = record({
      sendCount: OTP_MAX_SENDS_PER_WINDOW,
      expiresAt: NOW - 1,
    });
    expect(planOtpIssue({ existing, isRetry: false, now: NOW })).toEqual({
      action: "suppress",
      reason: "rate-limited",
    });
  });

  it("يُعيد استخدام الرمز الصالح عند بلوغ الحد بدل الامتناع", () => {
    const existing = record({ sendCount: OTP_MAX_SENDS_PER_WINDOW });
    expect(planOtpIssue({ existing, isRetry: false, now: NOW })).toEqual({ action: "reuse" });
  });

  it("يصفّر العدّاد بعد انتهاء النافذة", () => {
    const existing = record({
      sendCount: OTP_MAX_SENDS_PER_WINDOW,
      windowStartedAt: NOW - OTP_SEND_WINDOW_SECONDS - 1,
      expiresAt: NOW - 1,
    });
    expect(planOtpIssue({ existing, isRetry: false, now: NOW })).toEqual({
      action: "issue",
      sendCount: 1,
      windowStartedAt: NOW,
      expiresAt: NOW + OTP_TTL_SECONDS,
    });
  });

  it("لا يتجاوز الحد أبدًا بإعادة الطلب داخل النافذة", () => {
    let existing = record({ sendCount: 0, windowStartedAt: NOW, expiresAt: NOW - 1 });
    let issued = 0;
    for (let i = 0; i < OTP_MAX_SENDS_PER_WINDOW + 3; i += 1) {
      const plan = planOtpIssue({ existing, isRetry: false, now: NOW });
      if (plan.action === "issue") {
        issued += 1;
        existing = record({
          sendCount: plan.sendCount,
          windowStartedAt: plan.windowStartedAt,
          expiresAt: NOW - 1,
        });
      }
    }
    expect(issued).toBe(OTP_MAX_SENDS_PER_WINDOW);
  });
});
