"use client";

import Link from "next/link";
import { APP_HOME } from "@/components/layout/nav";
import { LanguageSwitcher } from "@/i18n/language-switcher";
import { useT } from "@/i18n/provider";

/** صفحة البداية المؤقتة. التوجيه حسب المجموعة (`/` → inbox/tasks/portal) يأتي في FOS-008. */
export default function HomePage() {
  const t = useT();
  const links = [
    { href: "/login", label: t("home.login") },
    { href: APP_HOME, label: t("home.enterApp") },
    { href: "/portal", label: t("home.enterPortal") },
  ];
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4 text-center">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Fontain OS</h1>
        <p className="mt-2 max-w-md text-foreground/70">{t("common.tagline")}</p>
      </div>
      <nav className="flex w-full max-w-xs flex-col gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-md border border-foreground/20 px-4 py-2 font-medium hover:bg-foreground/5"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <LanguageSwitcher />
    </main>
  );
}
