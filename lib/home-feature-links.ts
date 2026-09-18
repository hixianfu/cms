import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";

export type FeatureCardTarget = "product" | "article" | "solution" | "scenario" | "case";
const paths: Record<FeatureCardTarget, string> = { product: "/products", article: "/blog", solution: "/solutions", scenario: "/scenarios", case: "/cases" };
export function featureCardHref(locale: Locale, targetType: FeatureCardTarget, slug: string) { return localizedHref(locale, `${paths[targetType]}/${slug}`); }
