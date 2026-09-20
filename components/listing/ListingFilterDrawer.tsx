"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";

export function ListingFilterDrawer({
  locale,
  title,
  children,
}: {
  locale: Locale;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const isChinese = locale === "zh";

  const closeDrawer = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeDrawer();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeDrawer, open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={isChinese ? "打开筛选" : "Open filters"}
        onClick={() => setOpen(true)}
        className="brand-button inline-flex min-h-11 w-full items-center justify-center gap-2 border border-brand-border bg-white px-4 py-2.5 font-semibold text-brand-ink shadow-sm"
      >
        <SlidersHorizontal aria-hidden="true" size={18} />
        {title}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div
            aria-hidden="true"
            className="fixed inset-0 bg-brand-ink/55"
            onClick={closeDrawer}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-x-0 bottom-0 max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-brand-border pb-4">
              <h2 id={titleId} className="text-lg font-semibold text-brand-ink">
                {title}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={isChinese ? "关闭筛选" : "Close filters"}
                onClick={closeDrawer}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-slate-50"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>
            {children}
          </section>
        </div>
      ) : null}
    </div>
  );
}
