import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingEmptyState } from "@/components/listing/ListingEmptyState";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingPageShell, ListingSection } from "@/components/listing/ListingPageShell";
import { ListingResultHeader } from "@/components/listing/ListingResultHeader";
import { ListingSearchBar } from "@/components/listing/ListingSearchBar";
import { ListingSidebar } from "@/components/listing/ListingSidebar";
import { ProductListingCard } from "@/components/products/ProductListingCard";
import { categoryFilterQuery, selectedCategorySlugs } from "@/lib/i18n/category-filter";
import { categoryLabel } from "@/lib/i18n/category-labels";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/seo/metadata";
import { getGlobal, getProductCategories, getProducts } from "@/lib/strapi/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const global = await getGlobal(locale);
  return createMetadata(null, {
    title: locale === "zh" ? "产品" : "Products",
    description: global?.siteDescription ?? undefined,
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { category, search } = await searchParams;
  const searchTerm = search?.trim() ?? "";
  const categories = await getProductCategories(locale);
  const slugs = category ? selectedCategorySlugs(categories, category) : [];
  const filters = [
    slugs.length ? categoryFilterQuery(slugs) : "",
    searchTerm
      ? `filters[$or][0][name][$containsi]=${encodeURIComponent(searchTerm)}&filters[$or][1][summary][$containsi]=${encodeURIComponent(searchTerm)}`
      : "",
  ]
    .filter(Boolean)
    .join("&");
  const products = await getProducts(locale, filters);
  const categoryName = category
    ? categories.find((item) => item.slug === category)?.name
    : locale === "zh"
      ? "全部产品"
      : "All products";
  const featuredProduct = products.length <= 2 ? products[0] : undefined;
  const remainingProducts = featuredProduct ? products.slice(1) : products;

  return (
    <ListingPageShell>
      <ListingHero
        locale={locale}
        variant="immersive"
        motif="product"
        eyebrow={locale === "zh" ? "产品目录" : "Product catalogue"}
        title={locale === "zh" ? "为真实业务打造的产品" : "Products built for the real world"}
        description={
          locale === "zh"
            ? "从缓冲包装到自动化设备，为每一次运输提供可靠保护。"
            : "From protective packaging to automation equipment, reliable solutions for every shipment."
        }
      />
      <ListingSection>
        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          <ListingSidebar
            locale={locale}
            label={locale === "zh" ? "产品分类" : "Product categories"}
            allItem={{
              href: "/products",
              label: locale === "zh" ? "全部产品" : "All products",
              active: !category,
            }}
            items={categories.map((item) => ({
              href: `/products?category=${item.slug}`,
              label: categoryLabel(item.name, locale),
              active: category === item.slug,
              children: item.children?.map((child) => ({
                href: `/products?category=${child.slug}`,
                label: categoryLabel(child.name, locale),
                active: category === child.slug,
              })),
            }))}
          />
          <div className="min-w-0 space-y-8">
            <ListingSearchBar
              locale={locale}
              name="search"
              value={searchTerm}
              label={locale === "zh" ? "搜索产品" : "Search products"}
              placeholder={
                locale === "zh"
                  ? "搜索产品名称或简介..."
                  : "Search by product name or summary..."
              }
              preserved={{ category }}
              clearHref={
                searchTerm
                  ? category
                    ? `/products?category=${category}`
                    : "/products"
                  : undefined
              }
            />
            <ListingResultHeader
              eyebrow={categoryName ?? ""}
              title={
                searchTerm
                  ? locale === "zh"
                    ? `搜索“${searchTerm}”`
                    : `Results for “${searchTerm}”`
                  : locale === "zh"
                    ? "探索我们的产品"
                    : "Explore our solutions"
              }
              count={products.length}
              countLabel={locale === "zh" ? "个产品" : "products"}
            />
            {products.length ? (
              <div>
                {featuredProduct ? (
                  <ProductListingCard
                    locale={locale}
                    product={featuredProduct}
                    featured
                  />
                ) : null}
                {remainingProducts.length ? (
                  <div
                    className={`grid gap-7 sm:grid-cols-2 ${featuredProduct ? "mt-7" : ""}`}
                  >
                    {remainingProducts.map((product) => (
                      <ProductListingCard
                        key={product.id}
                        locale={locale}
                        product={product}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <ListingEmptyState
                message={
                  searchTerm
                    ? locale === "zh"
                      ? `没有找到与“${searchTerm}”匹配的产品`
                      : `No products matched “${searchTerm}”`
                    : locale === "zh"
                      ? "该分类暂无产品"
                      : "No products in this category yet"
                }
                resetHref={localizedHref(
                  locale,
                  category ? `/products?category=${category}` : "/products",
                )}
                resetLabel={
                  searchTerm
                    ? locale === "zh"
                      ? "清除搜索"
                      : "Clear search"
                    : locale === "zh"
                      ? "查看全部产品"
                      : "View all products"
                }
              />
            )}
          </div>
        </div>
      </ListingSection>
    </ListingPageShell>
  );
}
