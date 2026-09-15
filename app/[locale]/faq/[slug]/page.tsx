import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getFaqBySlug } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/seo/metadata";
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; if (!isLocale(locale)) return {}; const faq = await getFaqBySlug(slug, locale); return createMetadata(faq?.seo, { title: faq?.question ?? "FAQ" }); }
export default async function FaqDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const faq = await getFaqBySlug(slug, locale); if (!faq) notFound(); return <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8"><Link href={localizedHref(locale, "/faq")} className="brand-link inline-flex items-center gap-2 text-sm"><ArrowLeft size={16} />{locale === "zh" ? "返回常见问题" : "Back to FAQs"}</Link><header className="mt-12"><p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-teal">FAQ</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">{faq.question}</h1></header><div className="prose prose-slate mt-10 max-w-none leading-8"><ReactMarkdown remarkPlugins={[remarkGfm]}>{faq.answer}</ReactMarkdown></div></article>; }
