import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductTabs } from "@/components/products/ProductTabs";
import { ProductSpecifications } from "@/components/products/ProductSpecifications";
import { RelatedProductsCarousel } from "@/components/products/RelatedProductsCarousel";
import { getArticles, getProductBySlug, getRelatedProducts } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { createMetadata } from "@/lib/seo/metadata";
import { localizedHref } from "@/lib/i18n/routing";

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

  const zh = locale === "zh";
  const categoryHref = product.category?.slug ? localizedHref(locale, `/products?category=${encodeURIComponent(product.category.slug)}`) : localizedHref(locale, "/products");
  const categoryName = product.category?.name ?? (zh ? "产品中心" : "Product centre");
  const hasSpecifications = product.specifications?.some((specification) => specification?.label?.trim() && specification?.value?.trim());

  return <article className="relative max-w-full overflow-x-clip bg-[linear-gradient(180deg,#eef5f7_0%,#f7fafb_30rem,#f7fafb_100%)]">
    <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-brand-teal/10 blur-3xl" />
    <div className="relative mx-auto min-w-0 max-w-[1720px] px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-28">
      <nav aria-label={zh ? "面包屑导航" : "Breadcrumb navigation"} className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-brand-muted">
        <Link href={localizedHref(locale, "/")} className="shrink-0 transition hover:text-brand-blue">{zh ? "首页" : "Home"}</Link>
        <ArrowRight size={14} className="shrink-0 text-brand-teal" aria-hidden="true" />
        <Link href={localizedHref(locale, "/products")} className="shrink-0 transition hover:text-brand-blue">{zh ? "产品中心" : "Products"}</Link>
        {product.category?.name ? <><ArrowRight size={14} className="shrink-0 text-brand-teal" aria-hidden="true" /><Link href={categoryHref} className="shrink-0 transition hover:text-brand-blue">{categoryName}</Link></> : null}
        <ArrowRight size={14} className="shrink-0 text-brand-teal" aria-hidden="true" />
        <span className="min-w-0 truncate font-semibold text-brand-ink" aria-current="page">{product.name}</span>
      </nav>

      <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal"><span className="h-px w-10 bg-brand-teal" aria-hidden="true" /><Link href={categoryHref} className="transition hover:text-brand-blue">{categoryName}</Link>{product.featured ? <span className="inline-flex items-center gap-1 rounded-full bg-brand-lime/20 px-3 py-1 text-[11px] tracking-[0.12em] text-brand-blue"><CheckCircle2 size={13} />{zh ? "精选产品" : "Featured"}</span> : null}</div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-brand-ink sm:text-5xl lg:text-6xl">{product.name}</h1>
          {product.summary ? <p className="mt-7 max-w-3xl text-lg leading-8 text-brand-muted sm:text-xl sm:leading-9">{product.summary}</p> : null}
          {hasSpecifications ? <div className="mt-8 rounded-2xl border border-brand-border/80 bg-white/85 p-4 shadow-sm sm:p-5"><ProductSpecifications specifications={product.specifications} locale={locale} /></div> : null}
        </div>
        <div className="relative min-w-0 max-w-full"><div aria-hidden="true" className="absolute -inset-2 rounded-[2rem] bg-white/55 shadow-[0_24px_80px_rgba(18,50,74,0.08)] sm:-inset-4" /><div className="relative min-w-0 max-w-full"><ProductImageGallery cover={product.cover} gallery={product.gallery} locale={locale} productName={product.name} /></div></div>
      </div>

      <div className="mt-16 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-12">
        <div className="min-w-0 rounded-[1.75rem] border border-brand-border/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(18,50,74,0.06)] sm:p-8 lg:p-10"><ProductTabs product={product} locale={locale} blogs={blogs} /></div>
        <aside className="space-y-5 lg:sticky lg:top-24"><div className="rounded-[1.5rem] bg-brand-ink p-6 text-white shadow-[0_18px_44px_rgba(18,50,74,0.16)]"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">{zh ? "专业支持" : "Expert support"}</p><h2 className="mt-3 text-xl font-semibold">{zh ? "需要产品建议？" : "Need product advice?"}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{zh ? "告诉我们你的应用场景，我们会为你推荐合适的产品组合。" : "Share your application and we will recommend the right product combination."}</p><Link href={localizedHref(locale, "/contact")} className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand-lime px-4 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-white">{zh ? "立即咨询" : "Start a conversation"}<ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></div></aside>
      </div>
      <RelatedProductsCarousel products={related} locale={locale} />
    </div>
  </article>;
}
