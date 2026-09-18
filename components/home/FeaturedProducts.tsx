import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Product } from "@/types/content";

export function FeaturedProducts({ locale, products, title }: { locale: Locale; products: Product[]; title?: string | null }) {
  const items = products.filter((product) => product.featured !== false).slice(0, 6);
  if (!items.length) return null;
  return <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="mb-8 flex items-end justify-between gap-4"><h2 className="text-3xl font-semibold tracking-tight text-brand-ink">{title ?? (locale === "zh" ? "精选产品" : "Featured products")}</h2><Link href={localizedHref(locale, "/products")} className="brand-link text-sm">{locale === "zh" ? "查看全部" : "View all"}</Link></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((product) => { const image = resolveMediaUrl(product.cover); return <article key={product.id} className="brand-card overflow-hidden"><Link href={localizedHref(locale, `/products/${product.slug}`)} className="block focus-visible:outline-2 focus-visible:outline-brand-teal">{image ? <div className="relative aspect-[4/3] overflow-hidden bg-slate-100"><Image src={image} alt={product.cover?.alternativeText ?? product.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-300 hover:scale-105" /></div> : null}<div className="p-5"><h3 className="text-lg font-semibold text-brand-ink">{product.name}</h3>{product.summary ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-brand-muted">{product.summary}</p> : null}</div></Link></article>; })}</div></section>;
}
