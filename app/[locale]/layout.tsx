import { notFound } from "next/navigation";
import { getGlobal } from "@/lib/strapi/queries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const global = await getGlobal(locale); return <><SiteHeader locale={locale as Locale} global={global} /><main className="flex-1">{children}</main><SiteFooter locale={locale as Locale} global={global} /></>; }
