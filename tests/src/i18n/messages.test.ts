import { describe, expect, it } from "vitest";
import { ar } from "../../../src/i18n/ar";
import { en } from "../../../src/i18n/en";
import { LOCALES } from "../../../src/i18n/config";
import { flattenKeys, interpolate, lookup } from "../../../src/i18n/messages";
import { MESSAGES, translate } from "../../../src/i18n/translate";

const ARABIC = /[؀-ۿ]/;
const PLACEHOLDER = /\{(\w+)\}/g;
const enKeys = flattenKeys(en).sort();

describe("i18n — اكتمال مفاتيح الترجمة (ar/en)", () => {
  it("MESSAGES يغطي اللغتين المعتمدتين فقط", () => {
    expect(Object.keys(MESSAGES).sort()).toEqual([...LOCALES].sort());
  });

  it("لكل مفتاح في en مفتاح مطابق في ar، ولا مفاتيح زائدة", () => {
    expect(flattenKeys(ar).sort()).toEqual(enKeys);
  });

  it("لا مفتاح فارغًا في أي لغة", () => {
    for (const locale of LOCALES) {
      for (const key of enKeys) {
        expect(lookup(MESSAGES[locale], key).trim().length, `${locale}:${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("النص العربي عربي فعلًا والإنجليزي بلا حروف عربية (عدا الأسماء المشتركة)", () => {
    for (const key of enKeys) {
      const arText = lookup(ar, key);
      const enText = lookup(en, key);
      if (arText === enText) continue; // اسم علم مشترك مثل "Fontain OS"
      expect(arText, `ar:${key}`).toMatch(ARABIC);
      expect(enText, `en:${key}`).not.toMatch(ARABIC);
    }
  });

  it("المتغيرات {name} متطابقة بين اللغتين لكل مفتاح", () => {
    for (const key of enKeys) {
      const vars = (text: string) => [...text.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
      expect(vars(lookup(ar, key)), key).toEqual(vars(lookup(en, key)));
    }
  });
});

describe("i18n — lookup / interpolate / translate", () => {
  it("يجلب النصوص بالمسار المنقوط ويرجع المفتاح عند الفقد", () => {
    expect(lookup(en, "nav.inbox")).toBe("Inbox");
    expect(lookup(ar, "nav.inbox")).toBe("صندوق القرارات");
    expect(lookup(en, "nav.missing")).toBe("nav.missing");
    expect(lookup(en, "nav")).toBe("nav");
  });

  it("يستبدل المتغيرات ويترك غير المعروف كما هو", () => {
    expect(interpolate("Switch to {language}", { language: "English" })).toBe("Switch to English");
    expect(interpolate("{a} + {b}", { a: 1 })).toBe("1 + {b}");
    expect(interpolate("plain")).toBe("plain");
  });

  it("translate يجمع اللغة والمفتاح والمتغيرات", () => {
    expect(translate("ar", "language.switchTo", { language: "English" })).toBe(
      "التبديل إلى English",
    );
    expect(translate("en", "common.appName")).toBe("Fontain OS");
  });
});
