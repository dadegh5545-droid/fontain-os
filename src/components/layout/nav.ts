import type { MessageKey } from "@/i18n/messages";

export type AppNavItem = {
  key: "inbox" | "leads" | "clients" | "tasks" | "finance" | "settings";
  href: `/app/${string}`;
  labelKey: MessageKey;
};

/** عناصر القائمة الجانبية الستة لمنطقة الفريق (`/app`) بالترتيب المعتمد في Blueprint. */
export const APP_NAV: readonly AppNavItem[] = [
  { key: "inbox", href: "/app/inbox", labelKey: "nav.inbox" },
  { key: "leads", href: "/app/leads", labelKey: "nav.leads" },
  { key: "clients", href: "/app/clients", labelKey: "nav.clients" },
  { key: "tasks", href: "/app/tasks", labelKey: "nav.myTasks" },
  { key: "finance", href: "/app/finance", labelKey: "nav.finance" },
  { key: "settings", href: "/app/settings", labelKey: "nav.settings" },
];

export const APP_HOME = "/app/inbox";
