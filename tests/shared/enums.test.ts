import { describe, expect, it } from "vitest";
import { ENUMS, isEnumValue, type EnumName } from "../../shared/enums";

/** القائمة المعتمدة حرفيًا من docs/data-schema.md القسم 3. */
const SPEC: Record<EnumName, readonly string[]> = {
  Role: ["OWNER", "MANAGER", "STAFF", "CLIENT"],
  LeadStage: ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"],
  LeadSource: [
    "INSTAGRAM",
    "TIKTOK",
    "WHATSAPP",
    "REFERRAL",
    "VIDEO_AD",
    "GOOGLE",
    "WALK_IN",
    "OTHER",
  ],
  LostReason: ["NO_RESPONSE", "NO_BUDGET", "CHOSE_COMPETITOR", "NOT_NOW", "NOT_A_FIT", "OTHER"],
  InteractionChannel: ["WHATSAPP", "CALL", "MEETING", "EMAIL", "OTHER"],
  InteractionDirection: ["INBOUND", "OUTBOUND"],
  ClientStatus: ["ACTIVE", "ARCHIVED"],
  ProjectStatus: ["ACTIVE", "ON_HOLD", "DELIVERED", "CLOSED", "CANCELLED"],
  AppStage: [
    "IDEA",
    "REQUIREMENTS",
    "SPEC",
    "DESIGN",
    "DEVELOPMENT",
    "TESTING",
    "PREVIEW",
    "CLIENT_APPROVAL",
    "DEPLOYED",
  ],
  BuildStatus: ["UNKNOWN", "PASSED", "FAILED"],
  TaskStatus: ["NEW", "ASSIGNED", "IN_PROGRESS", "WAITING", "REVIEW", "APPROVED", "DONE"],
  TaskPriority: ["LOW", "NORMAL", "HIGH", "URGENT"],
  ProposalStatus: [
    "DRAFT",
    "PENDING_APPROVAL",
    "SENT",
    "CHANGES_REQUESTED",
    "ACCEPTED",
    "DECLINED",
  ],
  InvoiceStatus: ["ISSUED", "PARTIALLY_PAID", "PAID", "VOID"],
  PaymentMethod: ["BANK_TRANSFER", "CASH", "CARD", "OTHER"],
  ExpenseCategory: ["DOMAIN", "HOSTING", "CONTRACTOR", "ADS", "OTHER"],
  ApprovalType: ["PROPOSAL", "DELIVERABLE"],
  ApprovalStatus: ["PENDING", "APPROVED", "CHANGES_REQUESTED"],
  RenewalType: ["DOMAIN", "HOSTING", "MAINTENANCE", "OTHER"],
  RenewalStatus: ["UPCOMING", "RENEWED", "CANCELLED"],
  DecisionType: [
    "SUGGESTION",
    "TASK_REVIEW",
    "PROPOSAL_APPROVAL",
    "CLIENT_CHANGE_REQUEST",
    "RENEWAL_DUE",
    "NEW_CLIENT",
  ],
  DecisionStatus: ["OPEN", "APPROVED", "REJECTED"],
  SuggestionType: ["LEAD_REPLY", "PROPOSAL_DRAFT", "CLIENT_SUMMARY"],
  SuggestionStatus: ["PENDING", "APPROVED", "REJECTED"],
};

const enumNames = Object.keys(ENUMS) as EnumName[];

describe("shared/enums — مطابقة المواصفة", () => {
  it("يحتوي كل الـEnums الأربعة والعشرين المعتمدة ولا شيء غيرها", () => {
    expect(enumNames.sort()).toEqual(Object.keys(SPEC).sort());
  });

  it.each(enumNames)("%s يطابق docs/data-schema.md بنفس القيم والترتيب", (name) => {
    expect([...ENUMS[name]]).toEqual([...SPEC[name]]);
  });

  it.each(enumNames)("%s قيمه فريدة وبصيغة UPPER_SNAKE_CASE", (name) => {
    const values = [...ENUMS[name]];
    expect(new Set(values).size).toBe(values.length);
    for (const value of values) expect(value).toMatch(/^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/);
  });
});

describe("isEnumValue", () => {
  it("يقبل القيم الصحيحة ويرفض غيرها", () => {
    expect(isEnumValue("LeadStage", "NEW")).toBe(true);
    expect(isEnumValue("LeadStage", "new")).toBe(false);
    expect(isEnumValue("LeadStage", "ACTIVE")).toBe(false);
    expect(isEnumValue("Role", undefined)).toBe(false);
    expect(isEnumValue("Role", 1)).toBe(false);
  });
});
