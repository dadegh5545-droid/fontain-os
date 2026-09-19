"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ICONS } from "@/components/ui/icons";
import { useT } from "@/i18n/provider";
import { APP_NAV } from "./nav";

/** قائمة العناصر الستة؛ تُستخدم في Sidebar (سطح المكتب) وDrawer (الجوال). */
export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  const t = useT();
  const pathname = usePathname();
  return (
    <nav aria-label={t("shell.teamArea")} className="flex flex-col gap-1 p-2">
      {APP_NAV.map((item) => {
        const Icon = NAV_ICONS[item.key];
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            <Icon className="size-5 shrink-0" />
            <span className="truncate">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
