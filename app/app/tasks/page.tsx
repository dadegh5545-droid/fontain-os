"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Placeholder } from "@/components/layout/Placeholder";
import { useT } from "@/i18n/provider";

export default function TasksPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t("nav.myTasks")} description={t("pages.tasks")} />
      <Placeholder />
    </>
  );
}
