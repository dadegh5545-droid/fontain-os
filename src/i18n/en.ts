/**
 * English messages — المصدر الذي يُشتق منه شكل (type) كل اللغات.
 * كل مفتاح هنا يجب أن يوجد في `ar.ts` وإلا يفشل `typecheck` واختبار المفاتيح.
 * المتغيرات بصيغة `{name}`.
 */
export const en = {
  common: {
    appName: "Fontain OS",
    tagline: "The internal operating system of Fontain Digital Solutions",
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    back: "Back",
    search: "Search",
    notFound: "Page not found",
  },
  language: {
    label: "Language",
    switchTo: "Switch to {language}",
  },
  nav: {
    inbox: "Inbox",
    leads: "Leads",
    clients: "Clients",
    myTasks: "My Tasks",
    finance: "Finance",
    settings: "Settings",
  },
  auth: {
    login: "Sign in",
    logout: "Sign out",
    phone: "Phone number",
    otp: "Verification code",
    sendCode: "Send code",
    verify: "Verify",
  },
  portal: {
    title: "Client Portal",
    myProject: "My project",
    approvals: "Approvals",
    filesAndInvoices: "Files & invoices",
  },
} as const;
