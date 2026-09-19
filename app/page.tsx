"use client";

import { LanguageSwitcher } from "@/i18n/language-switcher";
import { useT } from "@/i18n/provider";

export default function HomePage() {
  const t = useT();
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Fontain OS</h1>
      <p className="max-w-md text-foreground/70">{t("common.tagline")}</p>
      <LanguageSwitcher />
    </main>
  );
}
