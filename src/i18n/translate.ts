import { ar } from "./ar";
import { en } from "./en";
import type { Locale } from "./config";
import {
  interpolate,
  lookup,
  type MessageKey,
  type MessageParams,
  type Messages,
} from "./messages";

export const MESSAGES: Messages = { ar, en };

export type Translator = (key: MessageKey, params?: MessageParams) => string;

/** دالة الترجمة النقية؛ `useT()` تلفّها باللغة الحالية. */
export function translate(locale: Locale, key: MessageKey, params?: MessageParams): string {
  return interpolate(lookup(MESSAGES[locale], key), params);
}

export function createTranslator(locale: Locale): Translator {
  return (key, params) => translate(locale, key, params);
}
