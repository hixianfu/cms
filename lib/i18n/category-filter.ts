import type { ProductCategory } from "@/types/content";
export function categorySlugsWithChildren(category: ProductCategory): string[] { return [category.slug, ...(category.children ?? []).flatMap(categorySlugsWithChildren)]; }
export function findCategory(categories: ProductCategory[], slug: string): ProductCategory | null { for (const category of categories) { if (category.slug === slug) return category; const found = findCategory(category.children ?? [], slug); if (found) return found; } return null; }
export function categoryFilterQuery(slugs: string[]): string { return slugs.map((slug, index) => `filters[category][slug][$in][${index}]=${encodeURIComponent(slug)}`).join("&"); }
