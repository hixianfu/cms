import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoCard, videoCategoryLabel } from "@/components/videos/VideoCard";
import { VideoFilters } from "@/components/videos/VideoFilters";
import { ListingEmptyState } from "@/components/listing/ListingEmptyState";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingPageShell, ListingSection } from "@/components/listing/ListingPageShell";
import { ListingResultHeader } from "@/components/listing/ListingResultHeader";
import { getGlobal, getVideos } from "@/lib/strapi/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";

type Search = { q?: string; category?: string; product?: string };
const productOptions = (items: Array<{ slug: string; name?: string; title?: string }>) => Array.from(new Map(items.filter((item) => item.slug).map((item) => [item.slug, { value: item.slug, label: item.name ?? item.title ?? item.slug }])).values());
const categoryValues = ["promotional", "introduction", "operation", "installation", "tutorial", "commissioning", "maintenance", "application", "factory", "company"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const global = await getGlobal(locale);
  return createMetadata(null, { title: locale === "zh" ? "视频中心" : "Video center", description: global?.siteDescription ?? undefined });
}

export default async function VideosPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Search> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const currentLocale = locale as Locale;
  const { q, category, product } = await searchParams;
  const query = [q?.trim() ? `filters[title][$containsi]=${encodeURIComponent(q.trim())}` : "", category ? `filters[category][$eq]=${encodeURIComponent(category)}` : "", product ? `filters[products][slug][$eq]=${encodeURIComponent(product)}` : ""].filter(Boolean).join("&");
  const [videos, allVideos] = await Promise.all([getVideos(currentLocale, query), getVideos(currentLocale)]);
  const products = productOptions(allVideos.flatMap((video) => video.products ?? []));
  const categories = categoryValues.map((value) => ({ value, label: videoCategoryLabel(value, currentLocale) }));

  return (
    <ListingPageShell>
      <ListingHero locale={currentLocale} variant="compact" motif="video" eyebrow={locale === "zh" ? "视频中心" : "Video center"} title={locale === "zh" ? "观看包装设备如何运转" : "See packaging equipment in action"} description={locale === "zh" ? "浏览产品介绍、操作教程、工厂展示和行业应用视频。" : "Browse product introductions, tutorials, factory tours, and industry applications."} />
      <ListingSection>
        <div className="space-y-8">
          <VideoFilters locale={currentLocale} q={q} category={category} product={product} categories={categories} products={products} />
          <ListingResultHeader eyebrow={category ? videoCategoryLabel(category, currentLocale) : locale === "zh" ? "全部视频" : "All videos"} title={q ? locale === "zh" ? `搜索结果：“${q}”` : `Results for “${q}”` : locale === "zh" ? "精选视频" : "Featured videos"} count={videos.length} countLabel={locale === "zh" ? "个视频" : "videos"} />
          {videos.length ? <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{videos.map((video) => <VideoCard key={video.id} video={video} locale={currentLocale} />)}</div> : <ListingEmptyState message={q ? locale === "zh" ? `没有找到与“${q}”匹配的视频` : `No videos matched “${q}”` : locale === "zh" ? "没有找到匹配的视频。" : "No videos matched your filters."} resetHref={localizedHref(currentLocale, "/videos")} resetLabel={locale === "zh" ? "查看全部视频" : "View all videos"} />}
        </div>
      </ListingSection>
    </ListingPageShell>
  );
}
