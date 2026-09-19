import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, parseLocale, type Locale } from "./config";

/** يقرأ لغة المستخدم من الـcookie في مكوّنات الخادم (root layout) قبل أول رسم. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return parseLocale(store.get(LOCALE_COOKIE)?.value ?? DEFAULT_LOCALE);
}
