import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Globe, Mail, MapPin, MessageCircle, Phone, PlayCircle, Send } from "lucide-react";
import type { ArticleCategory, ContentCategory, Global, ProductCategory } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";
import { resolveMediaUrl } from "@/lib/strapi/image";

const fallbackProducts = ["Air Cushion Machine", "Air Cushion Film", "Paper Cushion", "Foam in Place", "Padded Mailer", "Gummed Paper Tape", "Air Column Bag", "Dunnage Bags"];
const zhProducts: Record<string, string> = { "Air Cushion Machine": "气垫机", "Air Cushion Film": "气垫膜", "Paper Cushion": "纸垫", "Foam in Place": "现场发泡", "Padded Mailer": "缓冲信封", "Gummed Paper Tape": "湿水牛皮纸胶带", "Air Column Bag": "气柱袋", "Dunnage Bags": "集装箱充气袋" };
const defaultSocials = [{ label: "LinkedIn", href: "https://www.linkedin.com/company/ameson-pak", icon: Send }, { label: "Facebook", href: "https://www.facebook.com/amesonpak", icon: Globe }, { label: "YouTube", href: "https://www.youtube.com/@amesonpak", icon: PlayCircle }];
type FooterCategory = ContentCategory | ArticleCategory;
type CategorySectionProps = { title: string; allLabel: string; href: string; categories: FooterCategory[]; locale: Locale };

function CategorySection({ title, allLabel, href, categories, locale }: CategorySectionProps) {
  const uniqueCategories = Array.from(new Map(categories.filter((item) => item.slug).map((item) => [item.slug, item])).values());
  return <div>
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
      <h2 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-teal" />{title}</h2>
      <Link href={localizedHref(locale, href)} aria-label={allLabel} className="group/all rounded-full border border-white/15 p-1.5 text-slate-300 transition hover:border-brand-teal hover:bg-brand-teal hover:text-white"><ArrowUpRight size={14} /></Link>
    </div>
    {uniqueCategories.length ? <div className="mt-4 grid gap-2">{uniqueCategories.map((item) => <Link key={item.id} href={localizedHref(locale, `${href}?category=${encodeURIComponent(item.slug)}`)} className="group flex items-center justify-between gap-2 text-sm leading-6 text-slate-300 transition hover:text-brand-lime"><span>{item.name}</span><ArrowUpRight size={13} className="shrink-0 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" /></Link>)}</div> : <Link href={localizedHref(locale, href)} className="mt-4 inline-flex text-sm font-semibold text-brand-lime transition hover:text-white">{allLabel}<ArrowUpRight size={14} className="ml-1" /></Link>}
  </div>;
}

export function SiteFooter({ locale, global, categories = [], solutionCategories = [], scenarioCategories = [], caseCategories = [], articleCategories = [] }: { locale: Locale; global: Global | null; categories?: ProductCategory[]; solutionCategories?: ContentCategory[]; scenarioCategories?: ContentCategory[]; caseCategories?: ContentCategory[]; articleCategories?: ArticleCategory[] }) {
  const t = messages[locale];
  const productItems = categories.length ? categories : fallbackProducts.map((name) => ({ id: name, name: locale === "zh" ? zhProducts[name] ?? name : name, slug: name.toLowerCase().replaceAll(" ", "-") }));
  const footerLinks = global?.footerLinks?.length ? global.footerLinks : [{ label: t.about, href: "/about" }, { label: t.blog, href: "/blog" }, { label: t.contact, href: "/contact" }];
  const socials = global?.socialLinks?.length ? global.socialLinks : defaultSocials;
  const footerQrCode = resolveMediaUrl(global?.footerQrCode);
  const contact = {
    businessPhone: global?.footerBusinessPhone ?? "0592-5744644",
    productPhone: global?.footerProductPhone ?? "18159282692",
    afterSalesPhone: global?.footerAfterSalesPhone ?? "0592-5538644",
    wechat: global?.footerWechat ?? "AMSON-89",
    email: global?.footerEmail ?? "Marketing@amesonpak.com",
  };
  return (
    <footer className="relative mt-20 overflow-hidden bg-brand-ink text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-8rem] top-20 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1720px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-14 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal">{locale === "zh" ? "艾美森包装" : "Ameson Packaging"}</p><h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{locale === "zh" ? "让每一次运输都更安心" : "Make every shipment safer"}</h2></div><Link href={localizedHref(locale, "/contact")} className="group inline-flex w-fit items-center gap-3 rounded-full bg-brand-lime px-5 py-3 text-sm font-bold text-brand-ink transition hover:-translate-y-0.5 hover:bg-white">{locale === "zh" ? "联系我们" : "Get in touch"}<ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></div>
        <div className="grid gap-12 lg:grid-cols-2 xl:grid-cols-7 xl:gap-8">
          <div className="xl:col-span-2"><p className="text-2xl font-bold tracking-tight text-brand-lime">{global?.siteName ?? "Ameson Packaging"}</p><p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">{global?.footerText ?? (locale === "zh" ? "专业的包装解决方案，让运输更高效。" : "Professional packaging solutions for a more efficient world.")}</p><div className="mt-7 flex gap-3">{socials.map((social, index) => { const Icon = defaultSocials.find((item) => item.label === social.label)?.icon ?? Globe; const external = "external" in social ? social.external : true; return <a key={`${social.label || "social"}-${social.href || index}`} href={social.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label={social.label || "Social link"} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-slate-300 transition hover:-translate-y-0.5 hover:border-brand-teal hover:bg-brand-teal hover:text-white"><Icon size={17} /></a>; })}</div><div className="mt-8 flex flex-wrap items-start gap-6">{footerQrCode ? <div className="w-32 shrink-0 rounded-xl bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"><Image src={footerQrCode} alt={global?.footerQrCodeAlt ?? (locale === "zh" ? "扫码关注我们" : "Scan to connect with us")} width={112} height={112} className="h-auto w-full" /><p className="mt-2 text-center text-[11px] font-semibold leading-4 text-brand-ink">{global?.footerQrCodeLabel ?? (locale === "zh" ? "扫码关注我们" : "Scan to connect")}</p></div> : null}<div className="grid gap-3 text-sm text-slate-300"><a className="flex items-center gap-2 transition hover:text-brand-lime" href={`mailto:${contact.email}`}><Mail size={17} className="text-brand-teal" />{locale === "zh" ? "企业邮箱：" : "Email: "}{contact.email}</a><a className="flex items-center gap-2 transition hover:text-brand-lime" href={`tel:${contact.businessPhone}`}><Phone size={17} className="text-brand-teal" />{locale === "zh" ? "企业前台：" : "Reception: "}{contact.businessPhone}</a><a className="flex items-center gap-2 transition hover:text-brand-lime" href={`tel:${contact.productPhone}`}><Phone size={17} className="text-brand-teal" />{locale === "zh" ? "产品咨询：" : "Product: "}{contact.productPhone}</a><a className="flex items-center gap-2 transition hover:text-brand-lime" href={`tel:${contact.afterSalesPhone}`}><Phone size={17} className="text-brand-teal" />{locale === "zh" ? "售后服务：" : "After-sales: "}{contact.afterSalesPhone}</a><p className="flex items-center gap-2"><MessageCircle size={17} className="text-brand-teal" />{locale === "zh" ? "咨询微信：" : "WeChat: "}{contact.wechat}</p></div></div></div>
          <CategorySection locale={locale} title={t.products} allLabel={locale === "zh" ? "全部产品" : "All products"} href="/products" categories={productItems} />
          <CategorySection locale={locale} title={locale === "zh" ? "解决方案" : "Solutions"} allLabel={locale === "zh" ? "全部方案" : "All solutions"} href="/solutions" categories={solutionCategories} />
          <CategorySection locale={locale} title={locale === "zh" ? "应用场景" : "Application scenarios"} allLabel={locale === "zh" ? "全部场景" : "All scenarios"} href="/scenarios" categories={scenarioCategories} />
          <CategorySection locale={locale} title={locale === "zh" ? "客户案例" : "Case studies"} allLabel={locale === "zh" ? "全部案例" : "All cases"} href="/cases" categories={caseCategories} />
          <CategorySection locale={locale} title={t.blog} allLabel={locale === "zh" ? "全部文章" : "All articles"} href="/blog" categories={articleCategories} />
          <div className="border-t border-white/10 pt-8 lg:col-span-2 xl:col-span-7"><div className="mt-7 grid gap-4 text-sm leading-6 text-slate-300 sm:grid-cols-2"><p className="flex gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-brand-teal" /><span>厦门市集美区灌口镇坑坪路66号</span></p><p className="flex gap-2"></p></div></div>
        </div>
      </div><div className="border-t border-white/10 bg-black/10 px-4 py-5 text-center text-xs text-slate-400">Copyright © 2006 - 2026 Ameson Packaging. All rights reserved.</div>
    </footer>
  );
}
