import { en } from "./en";
import type { Locale } from "./config";

/** يحوّل شجرة `en` إلى شكل عام كل أوراقه `string` لتطبيع اللغات الأخرى عليه. */
type Shape<T> = { readonly [K in keyof T]: T[K] extends string ? string : Shape<T[K]> };
export type MessageTree = Shape<typeof en>;

/** كل المسارات المنقوطة الصالحة، مثل `nav.inbox`. */
type Paths<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Paths<T[K], `${P}${K}.`>;
}[keyof T & string];
export type MessageKey = Paths<typeof en>;

export type MessageParams = Readonly<Record<string, string | number>>;

/** يجلب نص الرسالة من شجرة اللغة؛ يرجع المفتاح نفسه إن لم يوجد (لا يرمي خطأ في الإنتاج). */
export function lookup(tree: MessageTree, key: string): string {
  let node: unknown = tree;
  for (const part of key.split(".")) {
    if (node === null || typeof node !== "object") return key;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : key;
}

/** يستبدل `{name}` بقيم `params`؛ المتغيرات غير المعروفة تبقى كما هي. */
export function interpolate(text: string, params?: MessageParams): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** يسطّح الشجرة إلى مفاتيح منقوطة (للاختبارات وأدوات الفحص). */
export function flattenKeys(tree: object, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    value !== null && typeof value === "object"
      ? flattenKeys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

export type Messages = Readonly<Record<Locale, MessageTree>>;
