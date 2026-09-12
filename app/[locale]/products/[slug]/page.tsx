import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/content/MediaGallery";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";
import { getProductBySlug } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { createMetadata } from "@/lib/seo/metadata";
import { resolveMediaUrl } from "@/lib/strapi/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = await getProductBySlug(slug, locale);
  return createMetadata(product?.seo, { title: product?.name ?? (locale === "zh" ? "产品" : "Product"), description: product?.summary ?? undefined });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();
  const cover = resolveMediaUrl(product.cover);
  return <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-12 lg:grid-cols-2 lg:items-start"><div>{cover ? <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"><Image src={cover} alt={product.cover?.alternativeText ?? product.name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div> : null}<MediaGallery media={product.gallery} label={locale === "zh" ? "产品图片" : "Product gallery"} /></div><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{product.category?.name ?? (locale === "zh" ? "产品" : "Product")}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{product.name}</h1>{product.summary ? <p className="mt-6 text-lg leading-8 text-slate-600">{product.summary}</p> : null}{product.specifications?.length ? <dl className="mt-10 divide-y divide-slate-200 border-y border-slate-200">{product.specifications.map((spec) => <div key={`${spec.label}-${spec.value}`} className="grid grid-cols-2 gap-4 py-4 text-sm"><dt className="font-medium text-slate-600">{spec.label}</dt><dd className="text-right text-slate-950">{spec.value}</dd></div>)}</dl> : null}</div></div>{product.blocks?.length ? <div className="mt-16 max-w-3xl"><RichTextRenderer blocks={product.blocks} /></div> : null}</article>;
}
