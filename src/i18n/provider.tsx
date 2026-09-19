"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { dirOf, serializeLocaleCookie, type Direction, type Locale } from "./config";
import { createTranslator, type Translator } from "./translate";

type LocaleContextValue = {
  locale: Locale;
  dir: Direction;
  /** يبدّل اللغة بلا إعادة تحميل: يحدّث الحالة، `<html lang dir>`، والـcookie. */
  setLocale: (locale: Locale) => void;
  t: Translator;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
      document.documentElement.dir = dirOf(next);
      document.cookie = serializeLocaleCookie(next);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir: dirOf(locale), setLocale, t: createTranslator(locale) }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

/** دالة الترجمة باللغة الحالية: `const t = useT(); t("nav.inbox")`. */
export function useT(): Translator {
  return useLocale().t;
}
