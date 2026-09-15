import Link from "next/link";
import { Globe, Mail, MapPin, Phone, PlayCircle, Send } from "lucide-react";
import type { Global, ProductCategory } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";

const fallbackProducts = ["Air Cushion Machine", "Air Cushion Film", "Paper Cushion", "Foam in Place", "Padded Mailer", "Gummed Paper Tape", "Air Column Bag", "Dunnage Bags"];
const zhProducts: Record<string, string> = { "Air Cushion Machine": "气垫机", "Air Cushion Film": "气垫膜", "Paper Cushion": "纸垫", "Foam in Place": "现场发泡", "Padded Mailer": "缓冲信封", "Gummed Paper Tape": "湿水牛皮纸胶带", "Air Column Bag": "气柱袋", "Dunnage Bags": "集装箱充气袋" };
const defaultSocials = [{ label: "LinkedIn", href: "https://www.linkedin.com/company/ameson-pak", icon: Send }, { label: "Facebook", href: "https://www.facebook.com/amesonpak", icon: Globe }, { label: "YouTube", href: "https://www.youtube.com/@amesonpak", icon: PlayCircle }];

export function SiteFooter({ locale, global, categories = [] }: { locale: Locale; global: Global | null; categories?: ProductCategory[] }) {
  const t = messages[locale];
  const productItems = categories.length ? categories : fallbackProducts.map((name) => ({ id: name, name, slug: name.toLowerCase().replaceAll(" ", "-") }));
  const footerLinks = global?.footerLinks?.length ? global.footerLinks : [{ label: t.about, href: "/about" }, { label: t.blog, href: "/blog" }, { label: t.contact, href: "/contact" }];
  const socials = global?.socialLinks?.length ? global.socialLinks : defaultSocials;
  return (
    <footer className="mt-20 bg-brand-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div><p className="text-xl font-bold text-brand-lime">{global?.siteName ?? "Ameson Packaging"}</p><p className="mt-4 text-sm leading-6 text-slate-300">{global?.footerText ?? (locale === "zh" ? "专业的包装解决方案，让运输更高效。" : "Professional packaging solutions for a more efficient world.")}</p><div className="mt-6 flex gap-3">{socials.map((social, index) => { const Icon = defaultSocials.find((item) => item.label === social.label)?.icon ?? Globe; const external = "external" in social ? social.external : true; return <a key={`${social.label || "social"}-${social.href || index}`} href={social.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label={social.label || "Social link"} className="rounded-full bg-white/10 p-2.5 hover:bg-brand-teal"><Icon size={17} /></a>; })}</div></div>
        <div><h2 className="font-semibold">{t.products}</h2><div className="mt-4 grid gap-2">{productItems.map((item, index) => <Link key={`${item.id || item.slug || "product"}-${index}`} href={localizedHref(locale, `/products?category=${item.slug}`)} className="text-sm text-slate-300 hover:text-brand-lime">{locale === "zh" ? zhProducts[item.name] ?? item.name : item.name}</Link>)}</div></div>
        <div><h2 className="font-semibold">{t.about}</h2><div className="mt-4 grid gap-2">{footerLinks.map((item, index) => <a key={`${item.label || "footer"}-${item.href || index}`} href={item.external ? item.href : localizedHref(locale, item.href)} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} className="text-sm text-slate-300 hover:text-brand-lime">{item.label}</a>)}</div></div>
        <div><h2 className="font-semibold">{t.contact}</h2><div className="mt-4 grid gap-3 text-sm text-slate-300"><a className="flex gap-2 hover:text-brand-lime" href="mailto:sales@amesonpak.com"><Mail size={17} />sales@amesonpak.com</a><a className="flex gap-2 hover:text-brand-lime" href="tel:+865925538744"><Phone size={17} />+86 592 5538744 (CN)</a><a className="flex gap-2 hover:text-brand-lime" href="tel:+12146942210"><Phone size={17} />+1 214 694 2210 (US)</a><p className="flex gap-2"><MapPin size={17} className="shrink-0" />Xiamen Ameson New Material Inc.<br />No. 66 Kengping Road, Xiamen, China</p><p className="flex gap-2"><MapPin size={17} className="shrink-0" />Ameson (USA) Packaging Inc.<br />10482 Brockwood Rd, Dallas, TX</p></div></div>
      </div><div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-400">Copyright © 2006 - 2026 Ameson Packaging. All rights reserved.</div>
    </footer>
  );
}
