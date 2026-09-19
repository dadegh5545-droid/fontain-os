export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_NAMES,
  dirOf,
  isLocale,
  otherLocale,
  parseLocale,
  type Direction,
  type Locale,
} from "./config";
export type { MessageKey, MessageParams, MessageTree } from "./messages";
export { MESSAGES, createTranslator, translate, type Translator } from "./translate";
export { LocaleProvider, useLocale, useT } from "./provider";
export { LanguageSwitcher } from "./language-switcher";
