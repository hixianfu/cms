import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGlobal, getProducts } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const global = await getGlobal(locale);
  return createMetadata(null, { title: locale === "zh" ? "产品" : "Products", description: global?.siteDescription ?? undefined });
}

export default async function ProductsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { category } = await searchParams;
  const products = await getProducts(locale, category ? `filters[category][slug][$eq]=${encodeURIComponent(category)}` : "");
  return <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><header className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{locale === "zh" ? "产品" : "Products"}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{locale === "zh" ? "为真实业务而生的产品" : "Products built for the real world"}</h1></header>{products.length ? <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => { const image = resolveMediaUrl(product.cover); return <article key={product.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><Link href={localizedHref(locale, `/products/${product.slug}`)} className="block"><>{image ? <div className="relative aspect-[4/3] bg-slate-100"><Image src={image} alt={product.cover?.alternativeText ?? product.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /></div> : null}<div className="p-6"><h2 className="text-xl font-semibold text-slate-950">{product.name}</h2>{product.summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{product.summary}</p> : null}</div></></Link></article>; })}</div> : <p className="mt-12 rounded-lg border border-dashed border-slate-300 p-8 text-slate-500">{locale === "zh" ? "暂无产品" : "No products yet"}</p>}</section>;
}
