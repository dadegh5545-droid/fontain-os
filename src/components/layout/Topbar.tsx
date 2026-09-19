"use client";

import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/i18n/language-switcher";
import { useT } from "@/i18n/provider";
import { MenuIcon } from "@/components/ui/icons";

/** الشريط العلوي: زر القائمة (جوال)، العنوان، ومبدّل اللغة. */
export function Topbar({
  title,
  onOpenMenu,
  trailing,
}: {
  title: string;
  onOpenMenu?: () => void;
  trailing?: ReactNode;
}) {
  const t = useT();
  return (
    <header className="flex h-14 items-center gap-3 border-b border-foreground/10 bg-background px-4">
      {onOpenMenu && (
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={t("shell.openMenu")}
          className="-ms-1 rounded-md p-1.5 hover:bg-foreground/5 md:hidden"
        >
          <MenuIcon className="size-6" />
        </button>
      )}
      <div className="min-w-0 flex-1 truncate font-semibold">{title}</div>
      {trailing}
      <LanguageSwitcher />
    </header>
  );
}
