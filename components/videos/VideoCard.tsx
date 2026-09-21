import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Video } from "@/types/content";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { ListingMediaPlaceholder } from "@/components/listing/ListingMediaPlaceholder";

const labels = {
  zh: { promotional: "产品宣传", introduction: "产品介绍", operation: "产品操作", installation: "安装教程", tutorial: "使用教程", commissioning: "设备调试", maintenance: "维护保养", application: "行业应用", factory: "工厂展示", company: "企业宣传" },
  en: { promotional: "Promotional", introduction: "Product introduction", operation: "Operation", installation: "Installation", tutorial: "Tutorial", commissioning: "Commissioning", maintenance: "Maintenance", application: "Industry application", factory: "Factory tour", company: "Company" },
} as const;

export const videoCategoryLabel = (category: string, locale: Locale) =>
  (labels[locale === "zh" ? "zh" : "en"] as Record<string, string>)[category] ?? category;

export function VideoCard({ video, locale }: { video: Video; locale: Locale }) {
  const image = resolveMediaUrl(video.cover);
  const playLabel = locale === "zh" ? "观看视频" : "Watch video";

  return (
    <article className="listing-card group h-full">
      <Link href={localizedHref(locale, `/videos/${video.slug}`)} className="block h-full">
        <div data-testid="video-card-media" className="relative aspect-video overflow-hidden bg-brand-ink">
          {image ? (
            <Image
              src={image}
              alt={video.cover?.alternativeText ?? video.title}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <ListingMediaPlaceholder motif="video" />
          )}
          <button
            type="button"
            aria-label={playLabel}
            tabIndex={-1}
            className="absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-ink shadow-lg transition group-hover:scale-105"
          >
            <Play aria-hidden="true" fill="currentColor" size={22} />
          </button>
          <span className="absolute bottom-3 left-3 rounded-full bg-brand-ink/85 px-3 py-1 text-xs font-semibold text-white">
            {videoCategoryLabel(video.category, locale)}
          </span>
        </div>
        <div className="flex min-h-48 flex-col p-6 sm:p-7">
          <h2 className="text-xl font-semibold text-brand-ink">{video.title}</h2>
          {video.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{video.description}</p> : null}
          <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue">
            {playLabel}
            <ArrowUpRight aria-hidden="true" size={16} />
          </span>
        </div>
      </Link>
    </article>
  );
}
