/**
 * Fontain OS — i18n config (FOS-002).
 * اللغتان المعتمدتان (D-24): عربي RTL وإنجليزي LTR. لا منطق واجهة هنا؛ دوال نقية فقط.
 */

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export type Direction = "rtl" | "ltr";

export const DEFAULT_LOCALE: Locale = "ar";

/** اسم الـcookie التي تحفظ اللغة المختارة (تُقرأ في الخادم والمتصفح). */
export const LOCALE_COOKIE = "fos_locale";
/** سنة واحدة بالثواني. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** الاسم الأصلي لكل لغة (لا يُترجم). */
export const LOCALE_NAMES: Readonly<Record<Locale, string>> = {
  ar: "العربية",
  en: "English",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** يحوّل أي قيمة (cookie، header، query) إلى Locale صالحة أو الافتراضية. */
export function parseLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function dirOf(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/** يقرأ اللغة من نص header `Cookie` خام. */
export function localeFromCookieHeader(cookieHeader: string | null | undefined): Locale {
  if (!cookieHeader) return DEFAULT_LOCALE;
  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rest] = part.split("=");
    if (rawName?.trim() === LOCALE_COOKIE) return parseLocale(rest.join("=").trim());
  }
  return DEFAULT_LOCALE;
}

/** نص `Set-Cookie` / `document.cookie` لحفظ اللغة سنة كاملة على كل المسارات. */
export function serializeLocaleCookie(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
}
