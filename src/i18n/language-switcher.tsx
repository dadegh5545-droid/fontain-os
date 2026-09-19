"use client";

import { LOCALE_NAMES, otherLocale } from "./config";
import { useLocale } from "./provider";

/** زر تبديل اللغة بلا إعادة تحميل؛ يعرض اسم اللغة الأخرى بلغتها الأصلية. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const target = otherLocale(locale);
  return (
    <button
      type="button"
      lang={target}
      onClick={() => setLocale(target)}
      aria-label={t("language.switchTo", { language: LOCALE_NAMES[target] })}
      className={`rounded-md border border-current/20 px-3 py-1.5 text-sm font-medium hover:bg-foreground/5 ${className}`}
    >
      {LOCALE_NAMES[target]}
    </button>
  );
}
