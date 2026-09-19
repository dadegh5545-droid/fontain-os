"use client";

import { useT } from "@/i18n/provider";

/** هيكل شاشة الدخول (هاتف + OTP). لا إرسال ولا Cognito: يُربط في FOS-008. */
export default function LoginPage() {
  const t = useT();
  return (
    <form className="flex flex-col gap-4 text-start" onSubmit={(e) => e.preventDefault()}>
      <div>
        <h1 className="text-xl font-semibold">{t("auth.login")}</h1>
        <p className="mt-1 text-sm text-foreground/70">{t("pages.login")}</p>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span>{t("auth.phone")}</span>
        <input
          type="tel"
          inputMode="tel"
          dir="ltr"
          placeholder="+974 5xxx xxxx"
          className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-start"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>{t("auth.otp")}</span>
        <input
          type="text"
          inputMode="numeric"
          dir="ltr"
          maxLength={6}
          className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-start"
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
      >
        {t("auth.verify")}
      </button>
    </form>
  );
}
