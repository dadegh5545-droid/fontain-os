import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/i18n/language-switcher";

/** تخطيط صفحات الدخول: بطاقة متمركزة بلا قائمة جانبية. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-14 items-center justify-between px-4">
        <span className="font-semibold">Fontain OS</span>
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg border border-foreground/10 p-6">{children}</div>
      </main>
    </div>
  );
}
