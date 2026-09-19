import type { ReactNode } from "react";
import { PortalTopbar } from "@/components/layout/PortalTopbar";

/** تخطيط بوابة العميل: شريط علوي بسيط بلا قائمة جانبية. */
export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PortalTopbar />
      <main className="mx-auto w-full max-w-3xl flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
