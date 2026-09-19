import { describe, expect, it } from "vitest";
import {
  DEFAULT_COUNTRY_CODE,
  isE164,
  isQatarMobile,
  maskPhone,
  normalizePhone,
  toAsciiDigits,
} from "../../shared/phone";

const QATAR = "+97433001122";

describe("toAsciiDigits", () => {
  it("يحوّل الأرقام العربية‑الهندية", () => {
    expect(toAsciiDigits("٣٣٠٠١١٢٢")).toBe("33001122");
  });

  it("يحوّل الأرقام الفارسية", () => {
    expect(toAsciiDigits("۳۳۰۰۱۱۲۲")).toBe("33001122");
  });

  it("يُبقي ASCII وغير الأرقام كما هي", () => {
    expect(toAsciiDigits("+974 33-00")).toBe("+974 33-00");
  });
});

describe("isE164", () => {
  it("يقبل صيغة صحيحة", () => {
    expect(isE164(QATAR)).toBe(true);
  });

  it("يرفض ما لا يبدأ بـ+", () => {
    expect(isE164("97433001122")).toBe(false);
  });

  it("يرفض صفرًا بادئًا بعد +", () => {
    expect(isE164("+0433001122")).toBe(false);
  });

  it("يرفض الأقصر من 8 والأطول من 15 خانة", () => {
    expect(isE164("+9741234")).toBe(false);
    expect(isE164(`+9${"1".repeat(15)}`)).toBe(false);
  });

  it("يرفض غير الأرقام", () => {
    expect(isE164("+974abcdefgh")).toBe(false);
  });
});

describe("normalizePhone", () => {
  it("يطبّع الصيغة الدولية بمسافات وشرطات", () => {
    expect(normalizePhone("+974 3300-1122")).toBe(QATAR);
  });

  it("يطبّع الأرقام العربية", () => {
    expect(normalizePhone("٣٣٠٠١١٢٢")).toBe(QATAR);
  });

  it("يطبّع الرقم المحلي بلا رمز دولة", () => {
    expect(normalizePhone("33001122")).toBe(QATAR);
  });

  it("يطبّع الرقم المحلي بصفر بادئ", () => {
    expect(normalizePhone("033001122")).toBe(QATAR);
  });

  it("يطبّع صيغة 00 الدولية", () => {
    expect(normalizePhone("0097433001122")).toBe(QATAR);
  });

  it("يطبّع رمز الدولة بلا +", () => {
    expect(normalizePhone("97433001122")).toBe(QATAR);
  });

  it("يتجاهل محدّدات الاتجاه الملتصقة بالنسخ", () => {
    expect(normalizePhone("‏+974 33001122‎")).toBe(QATAR);
  });

  it("يعيد null لمدخل فارغ أو غير رقمي", () => {
    expect(normalizePhone("")).toBeNull();
    expect(normalizePhone("   ")).toBeNull();
    expect(normalizePhone("hello")).toBeNull();
  });

  it("يعيد null للأقصر من الحد الأدنى", () => {
    expect(normalizePhone("١٢٣")).toBeNull();
  });

  it("يحترم رمز دولة افتراضيًا آخر", () => {
    expect(normalizePhone("512345678", "966")).toBe("+966512345678");
  });

  it("النتيجة ثابتة عند إعادة التطبيع", () => {
    const once = normalizePhone("33001122");
    expect(once).not.toBeNull();
    expect(normalizePhone(once as string)).toBe(once);
  });

  it("الافتراضي هو قطر", () => {
    expect(DEFAULT_COUNTRY_CODE).toBe("974");
  });
});

describe("isQatarMobile", () => {
  it("يقبل بادئات الجوال المعروفة", () => {
    for (const prefix of ["3", "5", "6", "7"]) {
      expect(isQatarMobile(`+974${prefix}3001122`)).toBe(true);
    }
  });

  it("يرفض بادئة غير معروفة أو طولًا خاطئًا", () => {
    expect(isQatarMobile("+97413001122")).toBe(false);
    expect(isQatarMobile("+9743300112")).toBe(false);
  });

  it("يرفض رقمًا غير قطري", () => {
    expect(isQatarMobile("+966512345678")).toBe(false);
  });
});

describe("maskPhone", () => {
  it("يُبقي رمز الدولة وآخر أربع خانات فقط", () => {
    expect(maskPhone(QATAR)).toBe("+974****1122");
  });

  it("لا يطبع شيئًا لمدخل غير صالح", () => {
    expect(maskPhone("nope")).toBe("****");
  });

  it("لا يحتوي الناتج الخانات الوسطى", () => {
    expect(maskPhone(QATAR)).not.toContain("3300");
  });
});
