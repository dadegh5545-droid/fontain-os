import { describe, expect, it } from "vitest";
import {
  generateOtpCode,
  generateOtpSalt,
  hashOtpCode,
  isOtpExpired,
  normalizeSubmittedCode,
  nowInSeconds,
  safeCompareHex,
} from "../../../../amplify/shared/otp/code";
import { OTP_CODE_LENGTH } from "../../../../amplify/shared/otp/config";

describe("generateOtpCode", () => {
  it("يولّد الطول المطلوب بأرقام فقط", () => {
    for (let i = 0; i < 200; i += 1) {
      const code = generateOtpCode();
      expect(code).toHaveLength(OTP_CODE_LENGTH);
      expect(code).toMatch(/^[0-9]+$/);
    }
  });

  it("يحترم طولًا مخصّصًا", () => {
    expect(generateOtpCode(4)).toHaveLength(4);
  });

  it("لا يكرّر نفس الرمز في كل مرة", () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateOtpCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("generateOtpSalt", () => {
  it("يولّد ملحًا سداسي‑عشريًا مختلفًا كل مرة", () => {
    const first = generateOtpSalt();
    const second = generateOtpSalt();
    expect(first).toMatch(/^[0-9a-f]{32}$/);
    expect(first).not.toBe(second);
  });
});

describe("hashOtpCode", () => {
  it("حتمي لنفس الرمز والملح", () => {
    expect(hashOtpCode("123456", "abc")).toBe(hashOtpCode("123456", "abc"));
  });

  it("يختلف باختلاف الملح", () => {
    expect(hashOtpCode("123456", "abc")).not.toBe(hashOtpCode("123456", "abd"));
  });

  it("يختلف باختلاف الرمز", () => {
    expect(hashOtpCode("123456", "abc")).not.toBe(hashOtpCode("123457", "abc"));
  });

  it("لا يحتوي الناتج الرمز نفسه", () => {
    expect(hashOtpCode("123456", "abc")).not.toContain("123456");
  });
});

describe("safeCompareHex", () => {
  it("يطابق المتساويين", () => {
    const hash = hashOtpCode("123456", "salt");
    expect(safeCompareHex(hash, hash)).toBe(true);
  });

  it("يرفض المختلفين بنفس الطول", () => {
    expect(safeCompareHex(hashOtpCode("111111", "s"), hashOtpCode("222222", "s"))).toBe(false);
  });

  it("يرفض اختلاف الطول", () => {
    expect(safeCompareHex("abcd", "abcdef")).toBe(false);
  });

  it("يرفض الفراغ وغير الـhex بلا استثناء", () => {
    expect(safeCompareHex("", "")).toBe(false);
    expect(safeCompareHex("zzzz", "zzzz")).toBe(false);
  });
});

describe("normalizeSubmittedCode", () => {
  it("يحوّل الأرقام العربية", () => {
    expect(normalizeSubmittedCode("١٢٣٤٥٦")).toBe("123456");
  });

  it("يزيل المسافات والشرطات ومحدّدات الاتجاه", () => {
    expect(normalizeSubmittedCode(" 123-456 ")).toBe("123456");
    expect(normalizeSubmittedCode("‏123456")).toBe("123456");
  });

  it("يعيد فراغًا لغير النص", () => {
    expect(normalizeSubmittedCode(undefined)).toBe("");
    expect(normalizeSubmittedCode(null)).toBe("");
    expect(normalizeSubmittedCode(123456)).toBe("");
  });
});

describe("isOtpExpired", () => {
  it("غير منتهٍ قبل لحظة الانتهاء", () => {
    expect(isOtpExpired(1_000, 999)).toBe(false);
  });

  it("منتهٍ عند لحظة الانتهاء وبعدها", () => {
    expect(isOtpExpired(1_000, 1_000)).toBe(true);
    expect(isOtpExpired(1_000, 1_001)).toBe(true);
  });

  it("يعتبر القيمة غير الرقمية منتهية (يفشل مغلقًا)", () => {
    expect(isOtpExpired(Number.NaN, 1_000)).toBe(true);
  });
});

describe("nowInSeconds", () => {
  it("يعيد ثوانٍ صحيحة", () => {
    const now = nowInSeconds();
    expect(Number.isInteger(now)).toBe(true);
    expect(now).toBeGreaterThan(1_600_000_000);
  });
});
