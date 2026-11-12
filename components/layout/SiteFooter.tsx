import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Globe, Mail, MapPin, MessageCircle, Phone, PlayCircle } from "lucide-react";
import type { Global, HeaderMegaMenuData, NavigationItem, ProductCategory } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { isLocalizedHomePath, localizedHref } from "@/lib/i18n/routing";
import { localizedCategoryName, messages } from "@/lib/i18n/messages";
import { resolveMediaUrl } from "@/lib/strapi/image";

const fallbackProducts = ["Air Cushion Machine", "Air Cushion Film", "Paper Cushion", "Foam in Place", "Padded Mailer", "Gummed Paper Tape", "Air Column Bag", "Dunnage Bags"];
const zhProducts: Record<string, string> = { "Air Cushion Machine": "气垫机", "Air Cushion Film": "气垫膜", "Paper Cushion": "纸垫", "Foam in Place": "现场发泡", "Padded Mailer": "缓冲信封", "Gummed Paper Tape": "湿水牛皮纸胶带", "Air Column Bag": "气柱袋", "Dunnage Bags": "集装箱充气袋" };
const defaultSocials = [{ label: "Facebook", href: "https://www.facebook.com/amesonpak", icon: Globe }, { label: "YouTube", href: "https://www.youtube.com/@amesonpak", icon: PlayCircle }];
type FooterCategoryLink = { id: string | number; name: string; href: string };
type CategorySectionProps = { title: string; allLabel: string; href: string; categories: FooterCategoryLink[]; locale: Locale };

function CategorySection({ title, allLabel, href, categories, locale }: CategorySectionProps) {
  const uniqueCategories = Array.from(new Map(categories.map((item) => [item.href, item])).values());
  return <div>
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
      <h2 className="flex min-w-0 items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white"><span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" /><span className="[overflow-wrap:anywhere]">{title}</span></h2>
      <Link href={localizedHref(locale, href)} aria-label={allLabel} className="group/all rounded-full border border-white/15 p-1.5 text-slate-300 transition hover:border-brand-teal hover:bg-brand-teal hover:text-white"><ArrowUpRight size={14} /></Link>
    </div>
    {uniqueCategories.length ? <div className="mt-4 grid gap-2">{uniqueCategories.map((item) => <Link key={item.id} href={localizedHref(locale, item.href)} className="group flex items-center justify-between gap-2 text-[13px] leading-6 text-slate-300 transition hover:text-brand-lime"><span>{item.name}</span><ArrowUpRight size={13} className="shrink-0 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" /></Link>)}</div> : <Link href={localizedHref(locale, href)} className="mt-4 inline-flex text-[13px] font-semibold text-brand-lime transition hover:text-white">{allLabel}<ArrowUpRight size={14} className="ml-1" /></Link>}
  </div>;
}

function productCategoryLinks(categories: ProductCategory[], locale: Locale): FooterCategoryLink[] {
  return categories.map((category) => ({ id: category.id, name: localizedCategoryName(category.name, locale), href: `/products?category=${encodeURIComponent(category.slug)}` }));
}

function contentCategoryLinks(items: HeaderMegaMenuData["solutions"], path: string, locale: Locale): FooterCategoryLink[] {
  const groups = new Map<string, FooterCategoryLink>();
  for (const item of items) {
    const category = item.category;
    const name = (typeof category === "string" ? category : category?.name) || item.industry?.trim() || (locale === "zh" ? "其他" : "Other");
    const slug = typeof category === "string" ? category : category?.slug;
    const href = `/${path}?${slug ? `category=${encodeURIComponent(slug)}` : `industry=${encodeURIComponent(name)}`}`;
    const key = slug ?? `industry:${name}`;
    if (!groups.has(key)) groups.set(key, { id: key, name, href });
  }
  return Array.from(groups.values());
}

export function SiteFooter({ locale, global, categories = [], megaMenu, }: { locale: Locale; global: Global | null; categories?: ProductCategory[]; megaMenu: HeaderMegaMenuData }) {
  const t = messages[locale];
  const fallbackNavigation: NavigationItem[] = [
    { label: locale === "zh" ? "产品中心" : "Product center", href: "/products" },
    { label: locale === "zh" ? "解决方案" : "Solutions", href: "/solutions" },
    { label: locale === "zh" ? "视频中心" : "Video center", href: "/videos" },
    { label: locale === "zh" ? "新闻资讯" : "News", href: "/blog" },
    { label: locale === "zh" ? "答疑解惑" : "FAQs", href: "/faq" },
    { label: t.contact, href: "/contact" },
    { label: locale === "zh" ? "关心我们" : "About us", href: "/about" },
  ];
  const navigation = (global?.navigation?.length ? global.navigation : fallbackNavigation).filter((item) => {
    const label = item.label.normalize("NFKC").replace(/[\s\u200B-\u200D\uFEFF]/g, "").toLowerCase();
    if (["首页", "home", "homepage"].includes(label)) return false;
    const path = item.href.trim().split(/[?#]/, 1)[0];
    return !isLocalizedHomePath(localizedHref(locale, path), locale);
  });
  const socials = (global?.socialLinks?.length ? global.socialLinks : defaultSocials).filter((social) => !/linkedin/i.test(social.label) && !/(^|\.)linkedin\.com$/i.test((() => { try { return new URL(social.href).hostname; } catch { return ""; } })()));
  const footerQrCode = resolveMediaUrl(global?.footerQrCode);
  const contact = {
    businessPhone: global?.footerBusinessPhone ?? "0592-5744644",
    productPhone: global?.footerProductPhone ?? "18159282692",
    afterSalesPhone: global?.footerAfterSalesPhone ?? "0592-5538644",
    wechat: global?.footerWechat ?? "AMSON-89",
    email: global?.footerEmail ?? "Marketing@amesonpak.com",
  };
  return (
    <footer className="relative mt-20 overflow-hidden bg-brand-ink text-[15px] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-8rem] top-20 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1720px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-14 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-teal">{locale === "zh" ? "艾美森包装" : "Ameson Packaging"}</p><h2 className="mt-2 text-[19px] font-semibold text-white sm:text-[23px]">{locale === "zh" ? "让每一次运输都更安心" : "Make every shipment safer"}</h2></div><Link href={localizedHref(locale, "/contact")} className="group inline-flex w-fit items-center gap-3 rounded-full bg-brand-lime px-5 py-3 text-[13px] font-bold text-brand-ink transition hover:-translate-y-0.5 hover:bg-white">{locale === "zh" ? "联系我们" : "Get in touch"}<ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></div>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-8">
          <nav aria-label={locale === "zh" ? "底部栏目导航" : "Footer navigation"} className="grid min-w-0 grid-cols-2 content-start gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {navigation.map((item, index) => {
            const path = item.href.split(/[?#]/, 1)[0].replace(/\/$/, "");
            const configs: Record<string, { allLabel: string; categories: FooterCategoryLink[] }> = {
              "/products": { allLabel: locale === "zh" ? "全部产品" : "All products", categories: categories.length ? productCategoryLinks(categories, locale) : fallbackProducts.map((name) => ({ id: name, name: locale === "zh" ? zhProducts[name] ?? name : name, href: `/products?category=${name.toLowerCase().replaceAll(" ", "-")}` })) },
              "/solutions": { allLabel: locale === "zh" ? "全部方案" : "All solutions", categories: contentCategoryLinks(megaMenu.solutions, "solutions", locale) },
              "/scenarios": { allLabel: locale === "zh" ? "全部场景" : "All scenarios", categories: contentCategoryLinks(megaMenu.scenarios, "scenarios", locale) },
              "/cases": { allLabel: locale === "zh" ? "全部案例" : "All case studies", categories: contentCategoryLinks(megaMenu.cases, "cases", locale) },
              "/blog": { allLabel: locale === "zh" ? "全部文章" : "All articles", categories: contentCategoryLinks(megaMenu.articles, "blog", locale) },
            };
            const config = configs[path];
            return <CategorySection key={`${item.href}-${index}`} locale={locale} title={item.label} allLabel={config?.allLabel ?? item.label} href={item.href} categories={config?.categories ?? []} />;
          })}
          </nav>
          <div className="min-w-0"><p className="text-[20px] font-bold tracking-tight text-brand-lime">{global?.siteName ?? "Ameson Packaging"}</p><p className="mt-4 max-w-sm text-[13px] leading-7 text-slate-300">{global?.footerText ?? (locale === "zh" ? "专业的包装解决方案，让运输更高效。" : "Professional packaging solutions for a more efficient world.")}</p><div className="mt-7 flex gap-3">{socials.map((social, index) => { const Icon = defaultSocials.find((item) => item.label === social.label)?.icon ?? Globe; const external = "external" in social ? social.external : true; return <a key={`${social.label || "social"}-${social.href || index}`} href={social.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label={social.label || "Social link"} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-slate-300 transition hover:-translate-y-0.5 hover:border-brand-teal hover:bg-brand-teal hover:text-white"><Icon size={17} /></a>; })}</div><div className="mt-1 flex flex-wrap items-start gap-6">{footerQrCode ? <div className="w-32 shrink-0 rounded-xl bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"><Image src={footerQrCode} alt={global?.footerQrCodeAlt ?? (locale === "zh" ? "扫码关注我们" : "Scan to connect with us")} width={112} height={112} className="h-auto w-full" /><p className="mt-1 text-center text-[10px] font-semibold leading-4 text-brand-ink">{global?.footerQrCodeLabel ?? (locale === "zh" ? "扫码关注我们" : "Scan to connect")}</p></div> : null}<div className="grid min-w-0 gap-3 text-[13px] text-slate-300"><a className="flex items-center gap-2 transition hover:text-brand-lime" href={`mailto:${contact.email}`}><Mail size={17} className="text-brand-teal" />{locale === "zh" ? "企业邮箱：" : "Email: "}{contact.email}</a><a className="flex items-center gap-2 transition hover:text-brand-lime" href={`tel:${contact.businessPhone}`}><Phone size={17} className="text-brand-teal" />{locale === "zh" ? "企业前台：" : "Reception: "}{contact.businessPhone}</a><a className="flex items-center gap-2 transition hover:text-brand-lime" href={`tel:${contact.productPhone}`}><Phone size={17} className="text-brand-teal" />{locale === "zh" ? "产品咨询：" : "Product: "}{contact.productPhone}</a><a className="flex items-center gap-2 transition hover:text-brand-lime" href={`tel:${contact.afterSalesPhone}`}><Phone size={17} className="text-brand-teal" />{locale === "zh" ? "售后服务：" : "After-sales: "}{contact.afterSalesPhone}</a><p className="flex items-center gap-2"><MessageCircle size={17} className="text-brand-teal" />{locale === "zh" ? "咨询微信：" : "WeChat: "}{contact.wechat}</p></div></div>
            <div className="mt-6 border-t border-white/10 pt-5 text-[13px] leading-6 text-slate-300"><p className="flex gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-brand-teal" /><span>厦门市集美区灌口镇坑坪路66号</span></p></div>
          </div>
        </div>
      </div><div className="border-t border-white/10 bg-black/10 px-4 py-5 text-center text-[11px] text-slate-400">Copyright © 2006 - 2026 Ameson Packaging. All rights reserved.</div>
    </footer>
  );
}
