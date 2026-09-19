/**
 * Fontain OS — Shared enums (FOS-001).
 *
 * المصدر الوحيد لقيم الـEnums، يُستورد من الواجهة (`src/`) والخلفية (`amplify/`) معًا.
 * القيم مطابقة حرفيًا لـ `docs/data-schema.md` القسم 3. أي إضافة تكون إضافية فقط (D-32):
 * لا حذف ولا إعادة تسمية قيمة في نفس الإصدار.
 *
 * في Amplify (FOS-004) تُستخدم هكذا: `a.enum([...LEAD_STAGES])`.
 * الترجمات العربية/الإنجليزية لكل قيمة في `./enum-labels.ts`.
 */

export const ROLES = ["OWNER", "MANAGER", "STAFF", "CLIENT"] as const;
export type Role = (typeof ROLES)[number];

export const LEAD_STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_SOURCES = [
  "INSTAGRAM",
  "TIKTOK",
  "WHATSAPP",
  "REFERRAL",
  "VIDEO_AD",
  "GOOGLE",
  "WALK_IN",
  "OTHER",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

/** `OTHER` يستلزم نصًا توضيحيًا (`lostNote`). */
export const LOST_REASONS = [
  "NO_RESPONSE",
  "NO_BUDGET",
  "CHOSE_COMPETITOR",
  "NOT_NOW",
  "NOT_A_FIT",
  "OTHER",
] as const;
export type LostReason = (typeof LOST_REASONS)[number];

export const INTERACTION_CHANNELS = ["WHATSAPP", "CALL", "MEETING", "EMAIL", "OTHER"] as const;
export type InteractionChannel = (typeof INTERACTION_CHANNELS)[number];

export const INTERACTION_DIRECTIONS = ["INBOUND", "OUTBOUND"] as const;
export type InteractionDirection = (typeof INTERACTION_DIRECTIONS)[number];

export const CLIENT_STATUSES = ["ACTIVE", "ARCHIVED"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const PROJECT_STATUSES = ["ACTIVE", "ON_HOLD", "DELIVERED", "CLOSED", "CANCELLED"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const APP_STAGES = [
  "IDEA",
  "REQUIREMENTS",
  "SPEC",
  "DESIGN",
  "DEVELOPMENT",
  "TESTING",
  "PREVIEW",
  "CLIENT_APPROVAL",
  "DEPLOYED",
] as const;
export type AppStage = (typeof APP_STAGES)[number];

export const BUILD_STATUSES = ["UNKNOWN", "PASSED", "FAILED"] as const;
export type BuildStatus = (typeof BUILD_STATUSES)[number];

export const TASK_STATUSES = [
  "NEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "WAITING",
  "REVIEW",
  "APPROVED",
  "DONE",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const PROPOSAL_STATUSES = [
  "DRAFT",
  "PENDING_APPROVAL",
  "SENT",
  "CHANGES_REQUESTED",
  "ACCEPTED",
  "DECLINED",
] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export const INVOICE_STATUSES = ["ISSUED", "PARTIALLY_PAID", "PAID", "VOID"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const PAYMENT_METHODS = ["BANK_TRANSFER", "CASH", "CARD", "OTHER"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const EXPENSE_CATEGORIES = ["DOMAIN", "HOSTING", "CONTRACTOR", "ADS", "OTHER"] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const APPROVAL_TYPES = ["PROPOSAL", "DELIVERABLE"] as const;
export type ApprovalType = (typeof APPROVAL_TYPES)[number];

export const APPROVAL_STATUSES = ["PENDING", "APPROVED", "CHANGES_REQUESTED"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const RENEWAL_TYPES = ["DOMAIN", "HOSTING", "MAINTENANCE", "OTHER"] as const;
export type RenewalType = (typeof RENEWAL_TYPES)[number];

export const RENEWAL_STATUSES = ["UPCOMING", "RENEWED", "CANCELLED"] as const;
export type RenewalStatus = (typeof RENEWAL_STATUSES)[number];

export const DECISION_TYPES = [
  "SUGGESTION",
  "TASK_REVIEW",
  "PROPOSAL_APPROVAL",
  "CLIENT_CHANGE_REQUEST",
  "RENEWAL_DUE",
  "NEW_CLIENT",
] as const;
export type DecisionType = (typeof DECISION_TYPES)[number];

export const DECISION_STATUSES = ["OPEN", "APPROVED", "REJECTED"] as const;
export type DecisionStatus = (typeof DECISION_STATUSES)[number];

export const SUGGESTION_TYPES = ["LEAD_REPLY", "PROPOSAL_DRAFT", "CLIENT_SUMMARY"] as const;
export type SuggestionType = (typeof SUGGESTION_TYPES)[number];

export const SUGGESTION_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type SuggestionStatus = (typeof SUGGESTION_STATUSES)[number];

/**
 * سجل كل الـEnums باسمها كما في المواصفة. يُستخدم في الاختبارات وفي بناء schema الـAmplify.
 */
export const ENUMS = {
  Role: ROLES,
  LeadStage: LEAD_STAGES,
  LeadSource: LEAD_SOURCES,
  LostReason: LOST_REASONS,
  InteractionChannel: INTERACTION_CHANNELS,
  InteractionDirection: INTERACTION_DIRECTIONS,
  ClientStatus: CLIENT_STATUSES,
  ProjectStatus: PROJECT_STATUSES,
  AppStage: APP_STAGES,
  BuildStatus: BUILD_STATUSES,
  TaskStatus: TASK_STATUSES,
  TaskPriority: TASK_PRIORITIES,
  ProposalStatus: PROPOSAL_STATUSES,
  InvoiceStatus: INVOICE_STATUSES,
  PaymentMethod: PAYMENT_METHODS,
  ExpenseCategory: EXPENSE_CATEGORIES,
  ApprovalType: APPROVAL_TYPES,
  ApprovalStatus: APPROVAL_STATUSES,
  RenewalType: RENEWAL_TYPES,
  RenewalStatus: RENEWAL_STATUSES,
  DecisionType: DECISION_TYPES,
  DecisionStatus: DECISION_STATUSES,
  SuggestionType: SUGGESTION_TYPES,
  SuggestionStatus: SUGGESTION_STATUSES,
} as const;

export type EnumName = keyof typeof ENUMS;
export type EnumValue<N extends EnumName> = (typeof ENUMS)[N][number];

/** يتحقق أن القيمة تنتمي إلى الـEnum المحدد (Type guard). */
export function isEnumValue<N extends EnumName>(name: N, value: unknown): value is EnumValue<N> {
  return typeof value === "string" && (ENUMS[name] as readonly string[]).includes(value);
}
