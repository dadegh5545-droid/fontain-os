import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function AppAreaLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
