/**
 * Fontain OS — Enum labels (FOS-001).
 *
 * ترجمة عربية وإنجليزية لكل قيمة في `./enums.ts` (D-24). كل Enum يُطبَّع كـ
 * `Record<Value, EnumLabel>` فيفشل `typecheck` عند نقص أي قيمة، ويؤكد اختبار
 * `tests/shared/enum-labels.test.ts` اكتمال الترجمة وعدم وجود قيم زائدة.
 */

import type {
  AppStage,
  ApprovalStatus,
  ApprovalType,
  BuildStatus,
  ClientStatus,
  DecisionStatus,
  DecisionType,
  EnumName,
  EnumValue,
  ExpenseCategory,
  InteractionChannel,
  InteractionDirection,
  InvoiceStatus,
  LeadSource,
  LeadStage,
  LostReason,
  PaymentMethod,
  ProjectStatus,
  ProposalStatus,
  RenewalStatus,
  RenewalType,
  Role,
  SuggestionStatus,
  SuggestionType,
  TaskPriority,
  TaskStatus,
} from "./enums";

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export type EnumLabel = Readonly<Record<Locale, string>>;
type Labels<V extends string> = Readonly<Record<V, EnumLabel>>;

export const ROLE_LABELS: Labels<Role> = {
  OWNER: { ar: "مالك", en: "Owner" },
  MANAGER: { ar: "مدير", en: "Manager" },
  STAFF: { ar: "موظف", en: "Staff" },
  CLIENT: { ar: "عميل", en: "Client" },
};

export const LEAD_STAGE_LABELS: Labels<LeadStage> = {
  NEW: { ar: "جديد", en: "New" },
  CONTACTED: { ar: "تم التواصل", en: "Contacted" },
  QUALIFIED: { ar: "مؤهل", en: "Qualified" },
  PROPOSAL_SENT: { ar: "أُرسل العرض", en: "Proposal sent" },
  WON: { ar: "فاز", en: "Won" },
  LOST: { ar: "خسر", en: "Lost" },
};

export const LEAD_SOURCE_LABELS: Labels<LeadSource> = {
  INSTAGRAM: { ar: "إنستغرام", en: "Instagram" },
  TIKTOK: { ar: "تيك توك", en: "TikTok" },
  WHATSAPP: { ar: "واتساب", en: "WhatsApp" },
  REFERRAL: { ar: "إحالة", en: "Referral" },
  VIDEO_AD: { ar: "إعلان فيديو", en: "Video ad" },
  GOOGLE: { ar: "جوجل", en: "Google" },
  WALK_IN: { ar: "زيارة مباشرة", en: "Walk-in" },
  OTHER: { ar: "أخرى", en: "Other" },
};

export const LOST_REASON_LABELS: Labels<LostReason> = {
  NO_RESPONSE: { ar: "لا استجابة", en: "No response" },
  NO_BUDGET: { ar: "لا ميزانية", en: "No budget" },
  CHOSE_COMPETITOR: { ar: "اختار منافسًا", en: "Chose a competitor" },
  NOT_NOW: { ar: "ليس الآن", en: "Not now" },
  NOT_A_FIT: { ar: "غير مناسب", en: "Not a fit" },
  OTHER: { ar: "أخرى", en: "Other" },
};

export const INTERACTION_CHANNEL_LABELS: Labels<InteractionChannel> = {
  WHATSAPP: { ar: "واتساب", en: "WhatsApp" },
  CALL: { ar: "مكالمة", en: "Call" },
  MEETING: { ar: "اجتماع", en: "Meeting" },
  EMAIL: { ar: "بريد إلكتروني", en: "Email" },
  OTHER: { ar: "أخرى", en: "Other" },
};

export const INTERACTION_DIRECTION_LABELS: Labels<InteractionDirection> = {
  INBOUND: { ar: "وارد", en: "Inbound" },
  OUTBOUND: { ar: "صادر", en: "Outbound" },
};

export const CLIENT_STATUS_LABELS: Labels<ClientStatus> = {
  ACTIVE: { ar: "نشط", en: "Active" },
  ARCHIVED: { ar: "مؤرشف", en: "Archived" },
};

export const PROJECT_STATUS_LABELS: Labels<ProjectStatus> = {
  ACTIVE: { ar: "نشط", en: "Active" },
  ON_HOLD: { ar: "متوقف مؤقتًا", en: "On hold" },
  DELIVERED: { ar: "تم التسليم", en: "Delivered" },
  CLOSED: { ar: "مغلق", en: "Closed" },
  CANCELLED: { ar: "ملغى", en: "Cancelled" },
};

export const APP_STAGE_LABELS: Labels<AppStage> = {
  IDEA: { ar: "فكرة", en: "Idea" },
  REQUIREMENTS: { ar: "المتطلبات", en: "Requirements" },
  SPEC: { ar: "المواصفة", en: "Specification" },
  DESIGN: { ar: "التصميم", en: "Design" },
  DEVELOPMENT: { ar: "التطوير", en: "Development" },
  TESTING: { ar: "الاختبار", en: "Testing" },
  PREVIEW: { ar: "المعاينة", en: "Preview" },
  CLIENT_APPROVAL: { ar: "اعتماد العميل", en: "Client approval" },
  DEPLOYED: { ar: "منشور", en: "Deployed" },
};

export const BUILD_STATUS_LABELS: Labels<BuildStatus> = {
  UNKNOWN: { ar: "غير معروف", en: "Unknown" },
  PASSED: { ar: "ناجح", en: "Passed" },
  FAILED: { ar: "فاشل", en: "Failed" },
};

export const TASK_STATUS_LABELS: Labels<TaskStatus> = {
  NEW: { ar: "جديدة", en: "New" },
  ASSIGNED: { ar: "مُسندة", en: "Assigned" },
  IN_PROGRESS: { ar: "قيد التنفيذ", en: "In progress" },
  WAITING: { ar: "بانتظار", en: "Waiting" },
  REVIEW: { ar: "مراجعة", en: "Review" },
  APPROVED: { ar: "معتمدة", en: "Approved" },
  DONE: { ar: "منجزة", en: "Done" },
};

export const TASK_PRIORITY_LABELS: Labels<TaskPriority> = {
  LOW: { ar: "منخفضة", en: "Low" },
  NORMAL: { ar: "عادية", en: "Normal" },
  HIGH: { ar: "عالية", en: "High" },
  URGENT: { ar: "عاجلة", en: "Urgent" },
};

export const PROPOSAL_STATUS_LABELS: Labels<ProposalStatus> = {
  DRAFT: { ar: "مسودة", en: "Draft" },
  PENDING_APPROVAL: { ar: "بانتظار الاعتماد", en: "Pending approval" },
  SENT: { ar: "مُرسل", en: "Sent" },
  CHANGES_REQUESTED: { ar: "طُلبت تعديلات", en: "Changes requested" },
  ACCEPTED: { ar: "مقبول", en: "Accepted" },
  DECLINED: { ar: "مرفوض", en: "Declined" },
};

export const INVOICE_STATUS_LABELS: Labels<InvoiceStatus> = {
  ISSUED: { ar: "صادرة", en: "Issued" },
  PARTIALLY_PAID: { ar: "مدفوعة جزئيًا", en: "Partially paid" },
  PAID: { ar: "مدفوعة", en: "Paid" },
  VOID: { ar: "ملغاة", en: "Void" },
};

export const PAYMENT_METHOD_LABELS: Labels<PaymentMethod> = {
  BANK_TRANSFER: { ar: "تحويل بنكي", en: "Bank transfer" },
  CASH: { ar: "نقدًا", en: "Cash" },
  CARD: { ar: "بطاقة", en: "Card" },
  OTHER: { ar: "أخرى", en: "Other" },
};

export const EXPENSE_CATEGORY_LABELS: Labels<ExpenseCategory> = {
  DOMAIN: { ar: "نطاق", en: "Domain" },
  HOSTING: { ar: "استضافة", en: "Hosting" },
  CONTRACTOR: { ar: "متعاقد", en: "Contractor" },
  ADS: { ar: "إعلانات", en: "Ads" },
  OTHER: { ar: "أخرى", en: "Other" },
};

export const APPROVAL_TYPE_LABELS: Labels<ApprovalType> = {
  PROPOSAL: { ar: "عرض", en: "Proposal" },
  DELIVERABLE: { ar: "تسليم", en: "Deliverable" },
};

export const APPROVAL_STATUS_LABELS: Labels<ApprovalStatus> = {
  PENDING: { ar: "معلّق", en: "Pending" },
  APPROVED: { ar: "معتمد", en: "Approved" },
  CHANGES_REQUESTED: { ar: "طُلبت تعديلات", en: "Changes requested" },
};

export const RENEWAL_TYPE_LABELS: Labels<RenewalType> = {
  DOMAIN: { ar: "نطاق", en: "Domain" },
  HOSTING: { ar: "استضافة", en: "Hosting" },
  MAINTENANCE: { ar: "صيانة", en: "Maintenance" },
  OTHER: { ar: "أخرى", en: "Other" },
};

export const RENEWAL_STATUS_LABELS: Labels<RenewalStatus> = {
  UPCOMING: { ar: "قادم", en: "Upcoming" },
  RENEWED: { ar: "تم التجديد", en: "Renewed" },
  CANCELLED: { ar: "ملغى", en: "Cancelled" },
};

export const DECISION_TYPE_LABELS: Labels<DecisionType> = {
  SUGGESTION: { ar: "اقتراح", en: "Suggestion" },
  TASK_REVIEW: { ar: "مراجعة مهمة", en: "Task review" },
  PROPOSAL_APPROVAL: { ar: "اعتماد عرض", en: "Proposal approval" },
  CLIENT_CHANGE_REQUEST: { ar: "طلب تعديل من العميل", en: "Client change request" },
  RENEWAL_DUE: { ar: "تجديد مستحق", en: "Renewal due" },
  NEW_CLIENT: { ar: "عميل جديد", en: "New client" },
};

export const DECISION_STATUS_LABELS: Labels<DecisionStatus> = {
  OPEN: { ar: "مفتوح", en: "Open" },
  APPROVED: { ar: "معتمد", en: "Approved" },
  REJECTED: { ar: "مرفوض", en: "Rejected" },
};

export const SUGGESTION_TYPE_LABELS: Labels<SuggestionType> = {
  LEAD_REPLY: { ar: "رد على عميل محتمل", en: "Lead reply" },
  PROPOSAL_DRAFT: { ar: "مسودة عرض", en: "Proposal draft" },
  CLIENT_SUMMARY: { ar: "ملخص عميل", en: "Client summary" },
};

export const SUGGESTION_STATUS_LABELS: Labels<SuggestionStatus> = {
  PENDING: { ar: "معلّق", en: "Pending" },
  APPROVED: { ar: "معتمد", en: "Approved" },
  REJECTED: { ar: "مرفوض", en: "Rejected" },
};

/** سجل الترجمات بنفس مفاتيح `ENUMS`؛ إضافة Enum جديد بلا ترجمة تفشل في `typecheck`. */
export const ENUM_LABELS: { readonly [N in EnumName]: Labels<EnumValue<N>> } = {
  Role: ROLE_LABELS,
  LeadStage: LEAD_STAGE_LABELS,
  LeadSource: LEAD_SOURCE_LABELS,
  LostReason: LOST_REASON_LABELS,
  InteractionChannel: INTERACTION_CHANNEL_LABELS,
  InteractionDirection: INTERACTION_DIRECTION_LABELS,
  ClientStatus: CLIENT_STATUS_LABELS,
  ProjectStatus: PROJECT_STATUS_LABELS,
  AppStage: APP_STAGE_LABELS,
  BuildStatus: BUILD_STATUS_LABELS,
  TaskStatus: TASK_STATUS_LABELS,
  TaskPriority: TASK_PRIORITY_LABELS,
  ProposalStatus: PROPOSAL_STATUS_LABELS,
  InvoiceStatus: INVOICE_STATUS_LABELS,
  PaymentMethod: PAYMENT_METHOD_LABELS,
  ExpenseCategory: EXPENSE_CATEGORY_LABELS,
  ApprovalType: APPROVAL_TYPE_LABELS,
  ApprovalStatus: APPROVAL_STATUS_LABELS,
  RenewalType: RENEWAL_TYPE_LABELS,
  RenewalStatus: RENEWAL_STATUS_LABELS,
  DecisionType: DECISION_TYPE_LABELS,
  DecisionStatus: DECISION_STATUS_LABELS,
  SuggestionType: SUGGESTION_TYPE_LABELS,
  SuggestionStatus: SUGGESTION_STATUS_LABELS,
};

/** يرجع ترجمة قيمة Enum باللغة المطلوبة. */
export function enumLabel<N extends EnumName>(
  name: N,
  value: EnumValue<N>,
  locale: Locale,
): string {
  return (ENUM_LABELS[name] as Labels<EnumValue<N>>)[value][locale];
}
