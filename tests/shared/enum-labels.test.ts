import { describe, expect, it } from "vitest";
import { ENUMS, type EnumName } from "../../shared/enums";
import { ENUM_LABELS, LOCALES, enumLabel } from "../../shared/enum-labels";

const enumNames = Object.keys(ENUMS) as EnumName[];
const ARABIC = /[؀-ۿ]/;

describe("shared/enum-labels — اكتمال الترجمة (ar/en)", () => {
  it("لكل Enum سجل ترجمات، ولا سجل بلا Enum", () => {
    expect(Object.keys(ENUM_LABELS).sort()).toEqual([...enumNames].sort());
  });

  it("اللغتان المعتمدتان هما ar و en فقط (D-24)", () => {
    expect([...LOCALES]).toEqual(["ar", "en"]);
  });

  it.each(enumNames)("%s: كل قيمة لها ترجمة ar و en غير فارغة، ولا قيم زائدة", (name) => {
    const values = [...ENUMS[name]];
    const labels = ENUM_LABELS[name] as Record<string, Record<string, string>>;

    expect(Object.keys(labels).sort()).toEqual([...values].sort());

    for (const value of values) {
      const label = labels[value];
      expect(Object.keys(label).sort()).toEqual([...LOCALES].sort());
      for (const locale of LOCALES) {
        expect(label[locale], `${name}.${value}.${locale}`).toBeTypeOf("string");
        expect(label[locale].trim().length, `${name}.${value}.${locale}`).toBeGreaterThan(0);
      }
      expect(label.ar, `${name}.${value}.ar يجب أن يكون عربيًا`).toMatch(ARABIC);
      expect(label.en, `${name}.${value}.en يجب ألا يحتوي حروفًا عربية`).not.toMatch(ARABIC);
    }
  });

  it("تسميات LeadStage تطابق أعمدة Sprint 1", () => {
    expect(enumLabel("LeadStage", "NEW", "ar")).toBe("جديد");
    expect(enumLabel("LeadStage", "CONTACTED", "ar")).toBe("تم التواصل");
    expect(enumLabel("LeadStage", "QUALIFIED", "ar")).toBe("مؤهل");
    expect(enumLabel("LeadStage", "PROPOSAL_SENT", "ar")).toBe("أُرسل العرض");
    expect(enumLabel("LeadStage", "PROPOSAL_SENT", "en")).toBe("Proposal sent");
  });
});
