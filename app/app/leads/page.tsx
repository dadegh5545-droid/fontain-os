"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Placeholder } from "@/components/layout/Placeholder";
import { useT } from "@/i18n/provider";

export default function LeadsPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t("nav.leads")} description={t("pages.leads")} />
      <Placeholder />
    </>
  );
}
