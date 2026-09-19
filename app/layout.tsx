import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dirOf } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/provider";
import { getLocale } from "@/i18n/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fontain OS",
  description: "Fontain OS — internal operating system for Fontain Digital Solutions",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={dirOf(locale)} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
