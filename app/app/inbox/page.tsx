"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Placeholder } from "@/components/layout/Placeholder";
import { useT } from "@/i18n/provider";

export default function InboxPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t("nav.inbox")} description={t("pages.inbox")} />
      <Placeholder />
    </>
  );
}
