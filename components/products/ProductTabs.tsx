"use client";
import { useState } from "react";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";
import { ProductVideos } from "@/components/products/ProductVideos";
import type { Product } from "@/types/content";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TabKey = "details" | "video" | "blog";

export function ProductTabs({ product, locale, blogs }: { product: Product; locale: string; blogs: { title: string; slug: string }[] }) {
  const [tab, setTab] = useState<TabKey>("details");
  const zh = locale === "zh";
  const tabs: Array<[TabKey, string]> = [
    ["details", zh ? "产品详情" : "Product details"],
    ["video", zh ? "产品视频" : "Product videos"],
    ["blog", zh ? "相关博客" : "Related blog"],
  ];

  return (
    <section className="mt-16">
      <div role="tablist" aria-label={zh ? "产品内容" : "Product content"} className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            id={`product-tab-${key}`}
            type="button"
            role="tab"
            aria-selected={tab === key}
            aria-controls={`product-panel-${key}`}
            onClick={() => setTab(key)}
            className={`shrink-0 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${tab === key ? "border-brand-teal text-brand-blue" : "border-transparent text-slate-500 hover:text-slate-900"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div id={`product-panel-${tab}`} role="tabpanel" aria-labelledby={`product-tab-${tab}`} className="mt-8">
        {tab === "details" ? (
          product.details ? <div className="prose prose-slate max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{product.details}</ReactMarkdown></div> : <RichTextRenderer blocks={product.blocks} />
        ) : tab === "video" ? (
          <ProductVideos items={product.productVideos} legacyVideos={product.videos} locale={locale} />
        ) : blogs.length ? (
          <div className="grid gap-4 md:grid-cols-2">{blogs.map((blog) => <a key={blog.slug} href={`/${locale}/blog/${blog.slug}`} className="rounded-xl border p-5 font-semibold hover:border-brand-teal">{blog.title}</a>)}</div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">{zh ? "暂无相关文章" : "No related articles yet"}</p>
        )}
      </div>
    </section>
  );
}
