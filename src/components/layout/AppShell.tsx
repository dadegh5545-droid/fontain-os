"use client";

import { useCallback, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { useT } from "@/i18n/provider";
import { AppNav } from "./AppNav";
import { APP_NAV } from "./nav";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/** هيكل منطقة الفريق `/app`: Sidebar (md+) أو Drawer (جوال) + Topbar + المحتوى. */
export function AppShell({ children }: { children: ReactNode }) {
  const t = useT();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const current = APP_NAV.find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));
  const title = current ? t(current.labelKey) : "Fontain OS";

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />
      <Drawer
        open={menuOpen}
        onClose={closeMenu}
        title="Fontain OS"
        closeLabel={t("shell.closeMenu")}
      >
        <AppNav onNavigate={closeMenu} />
      </Drawer>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
