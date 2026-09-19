import Link from "next/link";
import { localizedHref } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/config";

export function LocaleSwitcher({ locale, inverse = false }: { locale: Locale; inverse?: boolean }) {
  const other = locale === "zh" ? "en" : "zh";
  const className = inverse
    ? "rounded px-2 py-1 text-sm font-medium text-white underline-offset-4 hover:text-white/80 hover:underline focus-visible:outline-2 focus-visible:outline-white"
    : "rounded px-2 py-1 text-sm font-medium text-slate-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600";

  return <Link className={className} href={localizedHref(other, "/")}>{other === "en" ? "EN" : "中文"}</Link>;
}
