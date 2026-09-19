"use client";

import { useT } from "@/i18n/provider";
import { Topbar } from "./Topbar";

export function PortalTopbar() {
  const t = useT();
  return <Topbar title={t("portal.title")} />;
}
