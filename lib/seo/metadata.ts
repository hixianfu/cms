import type { Metadata } from "next";
import type { Seo } from "@/types/content";
import { resolveMediaUrl } from "@/lib/strapi/image";

export function createMetadata(seo?: Seo | null, fallback?: { title?: string; description?: string }): Metadata {
  const title = seo?.metaTitle ?? fallback?.title;
  const description = seo?.metaDescription ?? fallback?.description;
  const image = resolveMediaUrl(seo?.shareImage);
  return { title, description, alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined, openGraph: { title, description, images: image ? [{ url: image }] : undefined } };
}
