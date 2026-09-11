import type { Media } from "@/types/content";

const strapiUrl = (process.env.STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
export function resolveMediaUrl(media?: Media | null): string | null {
  if (!media?.url) return null;
  try { return new URL(media.url, `${strapiUrl}/`).toString(); } catch { return null; }
}
