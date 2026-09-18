import type { Media } from "@/types/content";

const strapiUrl = (
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ??
  process.env.STRAPI_URL ??
  "http://localhost:1337"
).replace(/\/$/, "");

const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);

export function resolveStrapiAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const publicOrigin = new URL(`${strapiUrl}/`);
    const resolved = new URL(url, publicOrigin);
    if (resolved.pathname.startsWith("/uploads/") && localHostnames.has(resolved.hostname)) {
      return new URL(`${resolved.pathname}${resolved.search}${resolved.hash}`, publicOrigin).toString();
    }
    return resolved.toString();
  } catch {
    return null;
  }
}

export function resolveMediaUrl(media?: Media | null): string | null {
  return resolveStrapiAssetUrl(media?.url);
}
