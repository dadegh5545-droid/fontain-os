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
  home: {
    login: "Sign in",
    enterApp: "Team workspace",
    enterPortal: "Client portal",
  },
  shell: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    teamArea: "Team",
    placeholderTitle: "Placeholder",
    placeholderBody:
      "This screen is built in a later sprint. The shell, navigation and RTL/LTR layout are in place.",
  },
  pages: {
    inbox: "Everything that needs a human decision appears here.",
    leads: "Leads board: New, Contacted, Qualified, Proposal sent.",
    clients: "Every client and their workspace.",
    tasks: "Tasks assigned to you and awaiting review.",
    finance: "Invoices, payments, expenses and renewals.",
    settings: "Organization, services, playbooks, team and AI.",
    login: "Enter your phone number to receive a verification code.",
    portal: "Your project, approvals, files and invoices.",
  },
} as const;
