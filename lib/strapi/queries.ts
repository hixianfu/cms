import { strapiFetch } from "./client";
import { cacheTags } from "./revalidate";
import type { About, Article, ContactPage, Global, HomePage, Locale, Product } from "@/types/content";

type Entity<T> = { id?: number | string; documentId?: string; attributes?: T } & T;
type Response<T> = { data: Entity<T> | Entity<T>[] | null };
const unwrap = <T>(entity: Entity<T>): T & { id?: number | string } => {
  const value = entity.attributes ? { ...entity.attributes } : { ...entity };
  return { ...value, id: entity.id ?? (value as { id?: number | string }).id } as T & { id?: number | string };
};
const params = (locale?: Locale, extra = "") => `?populate=*${locale ? `&locale=${encodeURIComponent(locale)}` : ""}${extra}`;

export async function getGlobal(locale?: Locale) { const r = await strapiFetch<Response<Global>>(`/api/global${params(locale)}`, { next: { revalidate: 300, tags: [cacheTags.global] } }); return r.data ? unwrap(r.data as Entity<Global>) : null; }
export async function getHomePage(locale?: Locale) { const r = await strapiFetch<Response<HomePage>>(`/api/home-page${params(locale)}`, { next: { revalidate: 120, tags: [cacheTags.homePage] } }); return r.data ? unwrap(r.data as Entity<HomePage>) : null; }
export async function getProducts(locale?: Locale, query = "") { const r = await strapiFetch<Response<Product>>(`/api/products${params(locale, query ? `&${query.replace(/^\?/, "")}` : "")}&sort=sortOrder:asc,createdAt:desc`, { next: { revalidate: 60, tags: [cacheTags.products] } }); return Array.isArray(r.data) ? r.data.map((x) => unwrap(x)) : []; }
export async function getProductBySlug(slug: string, locale?: Locale) { const q = `&filters[slug][$eq]=${encodeURIComponent(slug)}`; const r = await strapiFetch<Response<Product>>(`/api/products${params(locale, q)}`, { next: { revalidate: 60, tags: [cacheTags.products, cacheTags.product(slug)] } }); const item = Array.isArray(r.data) ? r.data[0] : r.data; return item ? unwrap(item) : null; }
export async function getArticles(locale?: Locale, query = "") { const r = await strapiFetch<Response<Article>>(`/api/articles${params(locale, query ? `&${query.replace(/^\?/, "")}` : "")}&sort=publishedAt:desc`, { next: { revalidate: 60, tags: [cacheTags.articles] } }); return Array.isArray(r.data) ? r.data.map((x) => unwrap(x)) : []; }
export async function getArticleBySlug(slug: string, locale?: Locale) { const r = await strapiFetch<Response<Article>>(`/api/articles${params(locale, `&filters[slug][$eq]=${encodeURIComponent(slug)}`)}`, { next: { revalidate: 60, tags: [cacheTags.articles, cacheTags.article(slug)] } }); const item = Array.isArray(r.data) ? r.data[0] : r.data; return item ? unwrap(item) : null; }
export async function getAbout(locale?: Locale) { const r = await strapiFetch<Response<About>>(`/api/about${params(locale)}`, { next: { revalidate: 300, tags: [cacheTags.about] } }); return r.data ? unwrap(r.data as Entity<About>) : null; }
export async function getContactPage(locale?: Locale) { const r = await strapiFetch<Response<ContactPage>>(`/api/contact-page${params(locale)}`, { next: { revalidate: 300, tags: [cacheTags.contactPage] } }); return r.data ? unwrap(r.data as Entity<ContactPage>) : null; }
