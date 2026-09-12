import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { locales, isLocale } from "@/lib/i18n/config";
import { cacheTags } from "@/lib/strapi/revalidate";

function validSignature(raw: string, signature: string | null) {
  const secret = process.env.REVALIDATE_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const actual = signature.replace(/^sha256=/, "");
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-strapi-signature"))) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  const event = JSON.parse(raw) as { model?: string; entry?: { slug?: string; contentLocale?: string; locale?: string } };
  const locale = isLocale(event.entry?.contentLocale ?? event.entry?.locale ?? "") ? (event.entry?.contentLocale ?? event.entry?.locale) : null;
  const targetLocales = locale ? [locale] : locales;
  for (const target of targetLocales) {
    if (event.model === "product") { revalidateTag(cacheTags.products(target), "max"); if (event.entry?.slug) revalidateTag(cacheTags.product(target, event.entry.slug), "max"); }
    else if (event.model === "article") { revalidateTag(cacheTags.articles(target), "max"); if (event.entry?.slug) revalidateTag(cacheTags.article(target, event.entry.slug), "max"); }
    else if (event.model === "global") revalidateTag(cacheTags.global(target), "max");
    else if (event.model === "home-page") revalidateTag(cacheTags.homePage(target), "max");
    else if (event.model === "about") revalidateTag(cacheTags.about(target), "max");
    else if (event.model === "contact-page") revalidateTag(cacheTags.contactPage(target), "max");
  }
  return NextResponse.json({ revalidated: true, locales: targetLocales });
}
