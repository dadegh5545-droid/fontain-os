import { describe, expect, it } from "vitest";
import { APP_HOME, APP_NAV } from "../../../../src/components/layout/nav";
import { en } from "../../../../src/i18n/en";
import { ar } from "../../../../src/i18n/ar";
import { lookup } from "../../../../src/i18n/messages";

describe("app shell — القائمة الجانبية", () => {
  it("تحتوي العناصر الستة بالترتيب المعتمد: Inbox · Leads · Clients · My Tasks · Finance · Settings", () => {
    expect(APP_NAV.map((i) => i.key)).toEqual([
      "inbox",
      "leads",
      "clients",
      "tasks",
      "finance",
      "settings",
    ]);
    expect(APP_NAV.map((i) => lookup(en, i.labelKey))).toEqual([
      "Inbox",
      "Leads",
      "Clients",
      "My Tasks",
      "Finance",
      "Settings",
    ]);
  });

  it("كل عنصر له مسار فريد تحت /app وترجمة عربية وإنجليزية", () => {
    const hrefs = APP_NAV.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const item of APP_NAV) {
      expect(item.href).toMatch(/^\/app\/[a-z]+$/);
      expect(lookup(en, item.labelKey)).not.toBe(item.labelKey);
      expect(lookup(ar, item.labelKey)).toMatch(/[؀-ۿ]/);
    }
  });

  it("/app يوجّه إلى Inbox", () => {
    expect(APP_HOME).toBe("/app/inbox");
    expect(APP_NAV[0].href).toBe(APP_HOME);
  });
});
