import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContactPage, getGlobal } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { createMetadata } from "@/lib/seo/metadata";
import { ContactForm } from "@/components/contact/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [contact, global] = await Promise.all([getContactPage(locale), getGlobal(locale)]);
  return createMetadata(contact?.seo, { title: contact?.title ?? (locale === "zh" ? "联系我们" : "Contact us"), description: global?.siteDescription ?? undefined });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const contact = await getContactPage(locale);
  if (!contact) return <section className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-semibold">{locale === "zh" ? "联系我们" : "Contact us"}</h1><p className="mt-4 text-slate-600">{locale === "zh" ? "内容暂不可用" : "Content unavailable"}</p></section>;
  const zh = locale === "zh";
  return <article className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8"><section><p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-teal">{zh ? "联系我们" : "Contact us"}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">{contact.title}</h1>{contact.intro ? <p className="mt-6 max-w-xl text-lg leading-8 text-brand-muted">{contact.intro}</p> : null}<dl className="mt-10 space-y-5 text-brand-ink">{contact.address ? <div><dt className="font-semibold">{zh ? "地址" : "Address"}</dt><dd className="mt-1">{contact.address}</dd></div> : null}{contact.phone ? <div><dt className="font-semibold">{zh ? "电话" : "Phone"}</dt><dd className="mt-1">{contact.phone}</dd></div> : null}{contact.email ? <div><dt className="font-semibold">Email</dt><dd className="mt-1">{contact.email}</dd></div> : null}{contact.officeHours ? <div><dt className="font-semibold">{zh ? "办公时间" : "Office hours"}</dt><dd className="mt-1 whitespace-pre-line">{contact.officeHours}</dd></div> : null}</dl></section><section className="brand-panel p-6 sm:p-8"><h2 className="text-2xl font-semibold text-brand-ink">{contact.formTitle ?? (zh ? "与我们联系" : "Start a conversation")}</h2>{contact.formIntro ? <p className="mt-3 text-brand-muted">{contact.formIntro}</p> : null}<ContactForm locale={locale} /></section></article>;
}
