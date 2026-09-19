"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Placeholder } from "@/components/layout/Placeholder";
import { useT } from "@/i18n/provider";

export default function ClientsPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t("nav.clients")} description={t("pages.clients")} />
      <Placeholder />
    </>
  );
}
