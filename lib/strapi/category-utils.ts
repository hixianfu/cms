import type { ProductCategory } from "@/types/content";
export function topLevelCategories(categories: ProductCategory[]): ProductCategory[] {
  return categories.filter((category) => !category.parent);
}
