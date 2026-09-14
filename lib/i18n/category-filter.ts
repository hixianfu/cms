import type { ProductCategory } from "@/types/content";
export function categorySlugsWithChildren(category: ProductCategory): string[] { return [category.slug, ...(category.children ?? []).flatMap(categorySlugsWithChildren)]; }
