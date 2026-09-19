"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Placeholder } from "@/components/layout/Placeholder";
import { useT } from "@/i18n/provider";

export default function SettingsPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t("nav.settings")} description={t("pages.settings")} />
      <Placeholder />
    </>
  );
}
