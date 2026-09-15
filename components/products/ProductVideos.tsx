import { BookOpen, Megaphone, Play, Video, Wrench } from "lucide-react";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Media, ProductVideo } from "@/types/content";

type VideoItem = ProductVideo & { video: Media };

const kindIcons = {
  promotional: Megaphone,
  operation: BookOpen,
  maintenance: Wrench,
  other: Video,
};

const kindLabels = {
  zh: { promotional: "宣传视频", operation: "操作视频", maintenance: "维修视频", other: "其他视频" },
  en: { promotional: "Promotional", operation: "Operation", maintenance: "Maintenance", other: "Other" },
};

export function ProductVideos({ items, legacyVideos, locale }: { items?: ProductVideo[]; legacyVideos?: Media[]; locale: string }) {
  const zh = locale === "zh";
  const configured = (items ?? []).filter((item): item is VideoItem => Boolean(item.video?.url));
  const legacy = (legacyVideos ?? []).map((video, index): VideoItem => ({
    title: zh ? `产品视频 ${index + 1}` : `Product video ${index + 1}`,
    kind: "other",
    video,
  }));
  const videos = configured.length ? configured : legacy;

  if (!videos.length) {
    return <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">{zh ? "暂无产品视频" : "No product videos yet"}</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Video library</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-950">{zh ? "产品视频" : "Product videos"}</h3>
        </div>
        <span className="text-sm text-slate-500">{videos.length} {zh ? "个视频" : videos.length === 1 ? "video" : "videos"}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {videos.map((item, index) => {
          const url = resolveMediaUrl(item.video);
          if (!url) return null;
          const kind = item.kind ?? "other";
          const Icon = kindIcons[kind];
          const labels = zh ? kindLabels.zh : kindLabels.en;

          return (
            <article key={item.id ?? `${url}-${index}`} className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
              <div className="relative aspect-video bg-slate-950">
                <video controls preload="metadata" className="h-full w-full object-contain" src={url}>
                  {zh ? "你的浏览器不支持视频播放。" : "Your browser does not support video playback."}
                </video>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{labels[kind]}</span>
                    <h4 className="mt-1 text-lg font-semibold leading-6 text-slate-950">{item.title}</h4>
                    {item.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p> : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <Play size={14} aria-hidden="true" />
        {zh ? "点击播放器即可观看，视频将按后台配置顺序显示。" : "Select a player to watch. Videos follow the order configured in the CMS."}
      </p>
    </div>
  );
}
