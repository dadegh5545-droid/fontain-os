"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Placeholder } from "@/components/layout/Placeholder";
import { useT } from "@/i18n/provider";

/** بوابة العميل: هيكل فقط. الأقسام الثلاثة من Screen Map تظهر كعناوين مؤقتة. */
export default function PortalPage() {
  const t = useT();
  const sections = ["portal.myProject", "portal.approvals", "portal.filesAndInvoices"] as const;
  return (
    <>
      <PageHeader title={t("portal.title")} description={t("pages.portal")} />
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {sections.map((key) => (
          <li key={key} className="rounded-lg border border-foreground/10 p-4 font-medium">
            {t(key)}
          </li>
        ))}
      </ul>
      <Placeholder />
    </>
  );
}
