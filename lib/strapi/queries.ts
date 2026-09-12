import { strapiFetch } from "./client";
import { cacheTags } from "./revalidate";
import type { About, Article, ContactPage, Global, HomePage, Locale, Product, ProductCategory } from "@/types/content";

type Entity<T> = { id?: number | string; documentId?: string; attributes?: T } & T;
type Response<T> = { data: Entity<T> | Entity<T>[] | null };
const unwrap = <T>(entity: Entity<T>): T & { id?: number | string } => {
  const value = entity.attributes ? { ...entity.attributes } : { ...entity };
  return { ...value, id: entity.id ?? (value as { id?: number | string }).id } as T & { id?: number | string };
};
const mapNavigation = <T extends { navigation?: unknown; footerLinks?: unknown; socialLinks?: unknown }>(value: T) => {
  const mapItems = (items: unknown) => Array.isArray(items)
    ? items.map((item) => {
        if (!item || typeof item !== "object") return item;
        const entry = item as Record<string, unknown>;
        return {
          ...entry,
          href: typeof entry.href === "string" ? entry.href : entry.url,
          external: typeof entry.external === "boolean" ? entry.external : entry.openInNewTab,
        };
      })
    : items;
  return {
    ...value,
    navigation: mapItems(value.navigation),
    footerLinks: mapItems(value.footerLinks),
    socialLinks: mapItems(value.socialLinks),
  } as T;
};
const params = (locale?: Locale, extra = "") => `?populate=*${locale ? `&locale=${encodeURIComponent(locale)}` : ""}${extra}`;
const collectionParams = (locale?: Locale, extra = "") => `?populate=*${locale ? `&filters[contentLocale][$eq]=${encodeURIComponent(locale)}` : ""}${extra}`;

const tagLocale = (locale?: Locale) => locale ?? "zh";
export async function getGlobal(locale?: Locale) { const r = await strapiFetch<Response<Global>>(`/api/global${params(locale)}`, { next: { revalidate: 300, tags: [cacheTags.global(tagLocale(locale))] } }); return r.data ? mapNavigation(unwrap(r.data as Entity<Global>)) : null; }
// Strapi does not recursively populate media nested inside repeatable
// components with `populate=*`. Explicitly populate the hero slide image
// (and other homepage media) so the carousel receives a usable URL.
const homePageParams = (locale?: Locale) => `?populate[heroSlides][populate]=image&populate[cta][populate]=image&populate[seo][populate]=shareImage${locale ? `&locale=${encodeURIComponent(locale)}` : ""}`;
export async function getHomePage(locale?: Locale) { const r = await strapiFetch<Response<HomePage>>(`/api/home-page${homePageParams(locale)}`, { next: { revalidate: 120, tags: [cacheTags.homePage(tagLocale(locale))] } }); return r.data ? unwrap(r.data as Entity<HomePage>) : null; }
export async function getProducts(locale?: Locale, query = "") { const r = await strapiFetch<Response<Product>>(`/api/products${collectionParams(locale, query ? `&${query.replace(/^\?/, "")}` : "")}&sort=sortOrder:asc,createdAt:desc`, { next: { revalidate: 60, tags: [cacheTags.products(tagLocale(locale))] } }); return Array.isArray(r.data) ? r.data.map((x) => unwrap(x)) : []; }
export async function getProductCategories(locale?: Locale) {
  const options = { next: { revalidate: 300, tags: [cacheTags.products(tagLocale(locale))] } };
  const categoryPopulate = `?populate[children]=true&${locale ? `filters[contentLocale][$eq]=${encodeURIComponent(locale)}&` : ""}sort=sortOrder:asc,name:asc`;
  const r = await strapiFetch<Response<ProductCategory>>(`/api/product-categories${categoryPopulate}`, options);
  const localized = Array.isArray(r.data) ? r.data.map((x) => unwrap(x)) : [];
  if (localized.length || !locale) return localized;
  const fallback = await strapiFetch<Response<ProductCategory>>(`/api/product-categories?populate[children]=true&sort=sortOrder:asc,name:asc`, options);
  return Array.isArray(fallback.data) ? fallback.data.map((x) => unwrap(x)) : [];
}
export async function getProductBySlug(slug: string, locale?: Locale) { const q = `&filters[slug][$eq]=${encodeURIComponent(slug)}`; const r = await strapiFetch<Response<Product>>(`/api/products${collectionParams(locale, q)}`, { next: { revalidate: 60, tags: [cacheTags.products(tagLocale(locale)), cacheTags.product(tagLocale(locale), slug)] } }); const item = Array.isArray(r.data) ? r.data[0] : r.data; return item ? unwrap(item) : null; }
export async function getRelatedProducts(categorySlug?: string, locale?: Locale, excludeSlug?: string) { const q = categorySlug ? `&filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}${excludeSlug ? `&filters[slug][$ne]=${encodeURIComponent(excludeSlug)}` : ""}` : ""; const r = await strapiFetch<Response<Product>>(`/api/products${collectionParams(locale, q)}&pagination[pageSize]=8&sort=sortOrder:asc`, { next: { revalidate: 120, tags: [cacheTags.products(tagLocale(locale))] } }); return Array.isArray(r.data) ? r.data.map((x) => unwrap(x)) : []; }
export async function getArticles(locale?: Locale, query = "") { const r = await strapiFetch<Response<Article>>(`/api/articles${collectionParams(locale, query ? `&${query.replace(/^\?/, "")}` : "")}&sort=publishedAt:desc`, { next: { revalidate: 60, tags: [cacheTags.articles(tagLocale(locale))] } }); return Array.isArray(r.data) ? r.data.map((x) => unwrap(x)) : []; }
export async function getArticleBySlug(slug: string, locale?: Locale) { const query = `?filters[slug][$eq]=${encodeURIComponent(slug)}${locale ? `&filters[contentLocale][$eq]=${encodeURIComponent(locale)}` : ""}&populate[cover]=true&populate[author]=true&populate[category]=true&populate[blocks][populate]=*`; const r = await strapiFetch<Response<Article>>(`/api/articles${query}`, { next: { revalidate: 60, tags: [cacheTags.articles(tagLocale(locale)), cacheTags.article(tagLocale(locale), slug)] } }); const item = Array.isArray(r.data) ? r.data[0] : r.data; return item ? unwrap(item) : null; }
export async function getAbout(locale?: Locale) { const r = await strapiFetch<Response<About>>(`/api/abouts${collectionParams(locale)}`, { next: { revalidate: 300, tags: [cacheTags.about(tagLocale(locale))] } }); const item = Array.isArray(r.data) ? r.data[0] : r.data; return item ? unwrap(item) : null; }
export async function getContactPage(locale?: Locale) { const r = await strapiFetch<Response<ContactPage>>(`/api/contact-pages${collectionParams(locale)}`, { next: { revalidate: 300, tags: [cacheTags.contactPage(tagLocale(locale))] } }); const item = Array.isArray(r.data) ? r.data[0] : r.data; return item ? unwrap(item) : null; }
