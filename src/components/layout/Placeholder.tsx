"use client";

import { useT } from "@/i18n/provider";

/** بطاقة مؤقتة لكل شاشة لم تُبنَ بعد (لا منطق أعمال). */
export function Placeholder() {
  const t = useT();
  return (
    <section className="mt-6 rounded-lg border border-dashed border-foreground/20 p-6 text-start">
      <h2 className="font-medium">{t("shell.placeholderTitle")}</h2>
      <p className="mt-1 text-sm text-foreground/70">{t("shell.placeholderBody")}</p>
    </section>
  );
}
