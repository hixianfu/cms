"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { HomeProductCategory, Product } from "@/types/content";
import { ContentCarousel } from "./ContentCarousel";

type FeaturedProductsProps = {
  locale: Locale;
  products: Product[];
  categories?: HomeProductCategory[];
  title?: string | null;
};

export function FeaturedProducts({ locale, products, categories = [], title }: FeaturedProductsProps) {
  const configuredCategories = categories;
  const hasCategories = configuredCategories.length > 0;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fallbackProducts = products.filter((product) => product.featured !== false);
  const activeCategory = configuredCategories[selectedIndex] ?? configuredCategories[0];
  const items = hasCategories ? activeCategory.products ?? [] : fallbackProducts;

  if (!items.length && !hasCategories) return null;

  const heading = title ?? (locale === "zh" ? "精选产品" : "Featured products");
  const categoryLabel = (item: HomeProductCategory) => item.label || item.category?.name || "";

  return <section className="relative mx-auto max-w-[1720px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
    <div className="text-center mb-8">
      <h2 className="text-3xl text-center font-semibold tracking-tight text-brand-ink sm:text-4xl">{heading}</h2>
    </div>

    {hasCategories ? <div className="mb-10 rounded-2xl border border-brand-border/80 bg-slate-50/75 p-3 shadow-sm sm:p-4">
      <ContentCarousel columns="productCategories" locale={locale} label={locale === "zh" ? "产品分类" : "Product categories"}>
        {configuredCategories.map((category, index) => {
          const selected = index === selectedIndex;
          return <button key={category.id ?? category.category?.id ?? `${categoryLabel(category)}-${index}`} type="button" aria-pressed={selected} onClick={() => setSelectedIndex(index)} className={`group relative flex min-h-16 w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-center text-sm font-semibold leading-5 transition duration-300 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:min-h-20 sm:px-4 sm:text-base ${selected ? "bg-brand-blue text-white shadow-[0_10px_25px_rgba(20,73,163,0.22)]" : "text-brand-muted hover:bg-white hover:text-brand-blue hover:shadow-sm"}`}>
            {selected ? <Check size={15} aria-hidden="true" className="shrink-0" /> : null}
            <span className="line-clamp-2">{categoryLabel(category)}</span>
          </button>;
        })}
      </ContentCarousel>
    </div> : null}

    {items.length ? <ContentCarousel columns="products" locale={locale} label={activeCategory ? categoryLabel(activeCategory) : heading}>
      {items.map((product) => {
        const image = resolveMediaUrl(product.cover);
        return <article key={product.id} className="group h-full overflow-hidden rounded-2xl border border-brand-border/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-teal/40 hover:shadow-[0_18px_40px_rgba(15,45,70,0.12)]"><Link href={localizedHref(locale, `/products/${product.slug}`)} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
          {image ? <div className="relative aspect-[4/3] overflow-hidden bg-slate-100"><Image src={image} alt={product.cover?.alternativeText ?? product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /></div> : <div className="aspect-[4/3] bg-slate-100" />}
          <div className="p-5 sm:p-6"><h3 className="text-lg font-semibold text-brand-ink transition group-hover:text-brand-blue">{product.name}</h3>{product.summary ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-brand-muted">{product.summary}</p> : null}<span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">{locale === "zh" ? "查看产品" : "View product"}<ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div>
        </Link></article>;
      })}
    </ContentCarousel> : <div className="rounded-2xl border border-dashed border-brand-border p-10 text-center text-sm text-brand-muted">{locale === "zh" ? "该分类暂未配置产品" : "No products configured for this category yet."}</div>}

    <Link href={localizedHref(locale, "/products")} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition hover:text-brand-teal sm:hidden">{locale === "zh" ? "查看全部产品" : "View all products"}<ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
  </section>;
}
