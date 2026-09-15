import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductTabs } from "@/components/products/ProductTabs";
import { ProductSpecifications } from "@/components/products/ProductSpecifications";
import { RelatedProductsCarousel } from "@/components/products/RelatedProductsCarousel";
import { getArticles, getProductBySlug, getRelatedProducts } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = await getProductBySlug(slug, locale);
  return createMetadata(product?.seo, { title: product?.name ?? "Product", description: product?.summary ?? undefined });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();
  const [related, articles] = await Promise.all([
    getRelatedProducts(product.category?.slug, locale, product.slug),
    getArticles(locale),
  ]);
  const blogs = articles.filter((article) => article.products?.some((item) => item.slug === product.slug)).slice(0, 6).map((article) => ({ title: article.title, slug: article.slug }));

  return <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
      <ProductImageGallery cover={product.cover} gallery={product.gallery} locale={locale} productName={product.name} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{product.category?.name ?? (locale === "zh" ? "产品" : "Product")}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{product.name}</h1>
        {product.summary ? <p className="mt-6 text-lg leading-8 text-slate-600">{product.summary}</p> : null}
        <ProductSpecifications specifications={product.specifications} locale={locale} />
      </div>
    </div>
    <ProductTabs product={product} locale={locale} blogs={blogs} />
    <RelatedProductsCarousel products={related} locale={locale} />
  </article>;
}
