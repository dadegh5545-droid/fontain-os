"use client";

import { useEffect, type ReactNode } from "react";

/**
 * لوحة منزلقة من جهة البداية (start) تحترم RTL/LTR بالخصائص المنطقية.
 * بلا منطق أعمال: فتح/إغلاق فقط، وتُغلق بـEscape أو بالنقر خارجها.
 */
export function Drawer({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <aside className="absolute inset-y-0 start-0 flex w-72 max-w-[85vw] flex-col bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
          <span className="font-semibold">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="rounded-md p-1.5 hover:bg-foreground/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}
