import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_NAMES,
  dirOf,
  isLocale,
  localeFromCookieHeader,
  otherLocale,
  parseLocale,
  serializeLocaleCookie,
} from "../../../src/i18n/config";

describe("i18n config — اللغة والاتجاه والـcookie", () => {
  it("العربية RTL والإنجليزية LTR (D-24)", () => {
    expect(dirOf("ar")).toBe("rtl");
    expect(dirOf("en")).toBe("ltr");
    expect(otherLocale("ar")).toBe("en");
    expect(otherLocale("en")).toBe("ar");
  });

  it("لكل لغة اسم أصلي", () => {
    expect(LOCALE_NAMES.ar).toMatch(/[؀-ۿ]/);
    expect(LOCALE_NAMES.en).toBe("English");
  });

  it("parseLocale يقبل ar/en فقط ويعود للافتراضي", () => {
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(parseLocale("en")).toBe("en");
    expect(parseLocale("EN")).toBe(DEFAULT_LOCALE);
    expect(parseLocale(undefined)).toBe(DEFAULT_LOCALE);
  });

  it("يقرأ اللغة من header الـcookie ويتجاهل غير الصالح", () => {
    expect(localeFromCookieHeader(`a=1; ${LOCALE_COOKIE}=en; b=2`)).toBe("en");
    expect(localeFromCookieHeader(`${LOCALE_COOKIE}=xx`)).toBe(DEFAULT_LOCALE);
    expect(localeFromCookieHeader("")).toBe(DEFAULT_LOCALE);
    expect(localeFromCookieHeader(null)).toBe(DEFAULT_LOCALE);
  });

  it("يسلسل cookie صالحة لسنة على كل المسارات", () => {
    const cookie = serializeLocaleCookie("en");
    expect(cookie).toContain(`${LOCALE_COOKIE}=en`);
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Max-Age=31536000");
    expect(cookie).toContain("SameSite=Lax");
    expect(localeFromCookieHeader(cookie.split(";")[0])).toBe("en");
  });
});
