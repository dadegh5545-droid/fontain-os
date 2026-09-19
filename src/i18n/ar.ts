import type { MessageTree } from "./messages";

/**
 * الرسائل العربية — مُطبَّعة على شكل `en.ts`: أي مفتاح ناقص أو زائد يفشل في `typecheck`.
 */
export const ar: MessageTree = {
  common: {
    appName: "Fontain OS",
    tagline: "نظام التشغيل الداخلي لـFontain Digital Solutions",
    loading: "جارٍ التحميل…",
    save: "حفظ",
    cancel: "إلغاء",
    close: "إغلاق",
    back: "رجوع",
    search: "بحث",
    notFound: "الصفحة غير موجودة",
  },
  language: {
    label: "اللغة",
    switchTo: "التبديل إلى {language}",
  },
  nav: {
    inbox: "صندوق القرارات",
    leads: "العملاء المحتملون",
    clients: "العملاء",
    myTasks: "مهامي",
    finance: "المالية",
    settings: "الإعدادات",
  },
  auth: {
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    phone: "رقم الهاتف",
    otp: "رمز التحقق",
    sendCode: "إرسال الرمز",
    verify: "تحقق",
  },
  portal: {
    title: "بوابة العميل",
    myProject: "مشروعي",
    approvals: "الاعتمادات",
    filesAndInvoices: "الملفات والفواتير",
  },
  home: {
    login: "تسجيل الدخول",
    enterApp: "مساحة الفريق",
    enterPortal: "بوابة العميل",
  },
  shell: {
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    teamArea: "الفريق",
    placeholderTitle: "شاشة مؤقتة",
    placeholderBody: "تُبنى هذه الشاشة في Sprint لاحق. الهيكل والتنقل واتجاه RTL/LTR جاهزة.",
  },
  pages: {
    inbox: "كل ما يحتاج قرار إنسان يظهر هنا.",
    leads: "لوحة العملاء المحتملين: جديد، تم التواصل، مؤهل، أُرسل العرض.",
    clients: "كل العملاء ومساحة عمل كل عميل.",
    tasks: "المهام المُسندة إليك وما ينتظر المراجعة.",
    finance: "الفواتير والدفعات والمصاريف والتجديدات.",
    settings: "المؤسسة والخدمات وPlaybooks والفريق والذكاء الاصطناعي.",
    login: "أدخل رقم هاتفك لاستلام رمز التحقق.",
    portal: "مشروعك واعتماداتك وملفاتك وفواتيرك.",
  },
};
