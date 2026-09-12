import type { MetadataRoute } from "next";
import { getArticles, getProducts } from "@/lib/strapi/queries";
import { locales, type Locale } from "@/lib/i18n/config";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${siteUrl}/${locale}`, alternates: { languages: { "zh-CN": `${siteUrl}/zh`, "en-US": `${siteUrl}/en`, "x-default": `${siteUrl}/zh` } } },
    { url: `${siteUrl}/${locale}/about` },
    { url: `${siteUrl}/${locale}/contact` },
    { url: `${siteUrl}/${locale}/products` },
    { url: `${siteUrl}/${locale}/blog` },
  ]);

  for (const locale of locales as readonly Locale[]) {
    const [products, articles] = await Promise.all([getProducts(locale), getArticles(locale)]);
    entries.push(...products.filter((item) => item.slug).map((item) => ({ url: `${siteUrl}/${locale}/products/${item.slug}` })));
    entries.push(...articles.filter((item) => item.slug).map((item) => ({ url: `${siteUrl}/${locale}/blog/${item.slug}` })));
  }
  return entries;
}
