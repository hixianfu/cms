import type { Media } from "@/types/content";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { ImageLightbox } from "@/components/content/ImageLightbox";

export function MediaGallery({ media, label = "Gallery" }: { media?: Media[] | null; label?: string }) {
  const items = (media ?? []).map((m) => ({ m, url: resolveMediaUrl(m) })).filter((x): x is { m: Media; url: string } => Boolean(x.url));
  if (!items.length) return null;
  const images = items.map(({ m, url }) => ({ src: url, alt: m.alternativeText ?? "" }));
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-3" aria-label={label}>{items.map(({ url }, index) => <figure key={`${url}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"><ImageLightbox images={images} initialIndex={index} className="h-full" /></figure>)}</div>;
}
