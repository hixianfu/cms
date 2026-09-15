import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Faq, Locale } from "@/types/content";

const labels: Record<string, { zh: string; en: string }> = { product: { zh: "产品", en: "Product" }, solution: { zh: "解决方案", en: "Solution" }, usage: { zh: "使用方法", en: "Usage" }, service: { zh: "服务", en: "Service" }, other: { zh: "其他", en: "Other" } };
export function FaqList({ items, locale }: { items: Faq[]; locale: Locale }) {
  return <div className="space-y-3">{items.map((faq) => <details key={faq.id} className="group rounded-xl border border-brand-border bg-white px-5 py-4 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-ink marker:hidden"><span>{faq.question}</span><span className="text-2xl font-light text-brand-teal transition group-open:rotate-45" aria-hidden="true">+</span></summary><div className="mt-4 border-t border-brand-border pt-4 text-sm leading-7 text-brand-muted"><span className="mb-3 inline-flex rounded-full bg-brand-teal/10 px-2.5 py-1 text-xs font-semibold text-brand-blue">{labels[faq.category]?.[locale === "zh" ? "zh" : "en"] ?? faq.category}</span><ReactMarkdown remarkPlugins={[remarkGfm]}>{faq.answer}</ReactMarkdown></div></details>)}</div>;
}
