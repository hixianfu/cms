"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/content";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";

export function RelatedProductsCarousel({ products, locale }: { products: Product[]; locale: string }) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(4);
  const zh = locale === "zh";

  useEffect(() => {
    const updatePerPage = () => setPerPage(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
    updatePerPage();
    window.addEventListener("resize", updatePerPage, { passive: true });
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const pageCount = Math.max(1, Math.ceil(products.length / perPage));
  const activePage = Math.min(page, pageCount - 1);
  const visibleProducts = products.slice(activePage * perPage, (activePage + 1) * perPage);
  const previous = useCallback(() => setPage((value) => (value - 1 + pageCount) % pageCount), [pageCount]);
  const next = useCallback(() => setPage((value) => (value + 1) % pageCount), [pageCount]);

  if (!products.length) return null;

  return <section className="mt-20 border-t border-brand-border/80 pt-14 sm:mt-24 sm:pt-16" aria-labelledby="related-products-title">
    <div className="flex items-end justify-between gap-5"><div><p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal sm:text-sm"><span aria-hidden="true" className="h-px w-9 bg-brand-teal" />{zh ? "推荐产品" : "Recommended"}</p><h2 id="related-products-title" className="text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">{zh ? "相关产品" : "Related products"}</h2></div>{pageCount > 1 ? <div className="flex items-center gap-2"><span className="mr-2 text-xs font-semibold tabular-nums text-brand-muted">{String(activePage + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</span><button type="button" onClick={previous} aria-label={zh ? "上一组相关产品" : "Previous related products"} className="grid h-10 w-10 place-items-center rounded-full border border-brand-border bg-white text-brand-ink transition hover:border-brand-teal hover:bg-brand-teal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"><ArrowLeft size={17} /></button><button type="button" onClick={next} aria-label={zh ? "下一组相关产品" : "Next related products"} className="grid h-10 w-10 place-items-center rounded-full border border-brand-border bg-white text-brand-ink transition hover:border-brand-teal hover:bg-brand-teal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"><ArrowRight size={17} /></button></div> : null}</div>
    <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">{visibleProducts.map((product) => { const image = resolveMediaUrl(product.cover); return <Link key={product.id} href={localizedHref(locale, `/products/${product.slug}`)} className="group min-w-0 overflow-hidden rounded-2xl border border-brand-border/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-teal/45 hover:shadow-[0_18px_38px_rgba(18,50,74,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"><div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#edf5f6,#f8fbfc)]">{image ? <Image src={image} alt={product.cover?.alternativeText ?? product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-contain p-5 transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center p-5 text-sm text-brand-muted">{zh ? "暂无图片" : "No image"}</div>}</div><div className="flex min-h-36 flex-col p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal">{product.category?.name ?? (zh ? "产品" : "Product")}</p><h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-7 text-brand-ink transition group-hover:text-brand-blue">{product.name}</h3><span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-brand-blue">{zh ? "查看产品" : "View product"}<ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div></Link>; })}</div>
    {pageCount > 1 ? <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label={zh ? "相关产品分页" : "Related product pages"}>{Array.from({ length: pageCount }, (_, index) => <button key={index} type="button" role="tab" aria-selected={index === activePage} aria-label={`${zh ? "第" : "Page "}${index + 1}${zh ? "组" : ""}`} onClick={() => setPage(index)} className={`h-1.5 rounded-full transition-all ${index === activePage ? "w-8 bg-brand-blue" : "w-1.5 bg-brand-border hover:bg-brand-teal"}`} />)}</div> : null}
  </section>;
}
