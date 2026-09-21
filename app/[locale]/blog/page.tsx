import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleListingCard,
  articleCategoryName,
  isKnownArticleCategory,
} from "@/components/blog/ArticleListingCard";
import { ListingEmptyState } from "@/components/listing/ListingEmptyState";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingPageShell, ListingSection } from "@/components/listing/ListingPageShell";
import { ListingResultHeader } from "@/components/listing/ListingResultHeader";
import { ListingSearchBar } from "@/components/listing/ListingSearchBar";
import { ListingSidebar } from "@/components/listing/ListingSidebar";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/seo/metadata";
import { getArticleCategories, getArticles, getGlobal } from "@/lib/strapi/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const global = await getGlobal(locale);
  return createMetadata(null, {
    title: locale === "zh" ? "博客" : "Blog",
    description: global?.siteDescription ?? undefined,
  });
}

export default async function BlogPage({
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
  const categories = (await getArticleCategories(locale)).filter((item) =>
    isKnownArticleCategory(item.slug),
  );
  const filters = [
    category ? `filters[category][slug][$eq]=${encodeURIComponent(category)}` : "",
    searchTerm ? `filters[title][$containsi]=${encodeURIComponent(searchTerm)}` : "",
  ]
    .filter(Boolean)
    .join("&");
  const articles = await getArticles(locale, filters);
  const selectedCategory = categories.find((item) => item.slug === category);
  const categoryTitle = selectedCategory
    ? articleCategoryName(selectedCategory.slug, selectedCategory.name, locale)
    : locale === "zh"
      ? "全部文章"
      : "All articles";
  const featuredArticle = !category && !searchTerm ? articles[0] : undefined;
  const remainingArticles = featuredArticle ? articles.slice(1) : articles;

  return (
    <ListingPageShell>
      <ListingHero
        locale={locale}
        variant="compact"
        motif="article"
        eyebrow={locale === "zh" ? "知识与洞察" : "Knowledge & insight"}
        title={locale === "zh" ? "来自现场的洞察" : "Insights from the field"}
        description={
          locale === "zh"
            ? "了解包装创新、运营效率以及帮助团队持续前进的实践。"
            : "Explore packaging innovation, operational efficiency, and the practices that keep teams moving."
        }
      />
      <ListingSection>
        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          <ListingSidebar
            locale={locale}
            label={locale === "zh" ? "文章分类" : "Article categories"}
            allItem={{
              href: "/blog",
              label: locale === "zh" ? "全部文章" : "All articles",
              active: !category,
            }}
            items={categories.map((item) => ({
              href: `/blog?category=${item.slug}`,
              label: articleCategoryName(item.slug, item.name, locale),
              active: category === item.slug,
            }))}
          />
          <div className="min-w-0 space-y-8">
            <ListingSearchBar
              locale={locale}
              name="search"
              value={searchTerm}
              label={locale === "zh" ? "搜索文章标题" : "Search article titles"}
              placeholder={
                locale === "zh" ? "搜索文章标题..." : "Search article titles..."
              }
              preserved={{ category }}
              clearHref={
                searchTerm
                  ? category
                    ? `/blog?category=${category}`
                    : "/blog"
                  : undefined
              }
            />
            <ListingResultHeader
              eyebrow={categoryTitle}
              title={
                searchTerm
                  ? locale === "zh"
                    ? `搜索“${searchTerm}”`
                    : `Results for “${searchTerm}”`
                  : locale === "zh"
                    ? "最新文章"
                    : "Latest articles"
              }
              count={articles.length}
              countLabel={locale === "zh" ? "篇文章" : "articles"}
            />
            {articles.length ? (
              <div>
                {featuredArticle ? (
                  <ArticleListingCard
                    locale={locale}
                    article={featuredArticle}
                    featured
                  />
                ) : null}
                {remainingArticles.length ? (
                  <div
                    data-testid="article-listing-grid"
                    className={`grid gap-7 md:grid-cols-2 ${featuredArticle ? "mt-7" : ""}`}
                  >
                    {remainingArticles.map((article) => (
                      <ArticleListingCard
                        key={article.id}
                        locale={locale}
                        article={article}
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
                      ? `没有找到标题包含“${searchTerm}”的文章`
                      : `No article titles matched “${searchTerm}”`
                    : locale === "zh"
                      ? "该条件下暂无文章"
                      : "No articles found"
                }
                resetHref={localizedHref(
                  locale,
                  category ? `/blog?category=${category}` : "/blog",
                )}
                resetLabel={locale === "zh" ? "查看全部文章" : "View all articles"}
              />
            )}
          </div>
        </div>
      </ListingSection>
    </ListingPageShell>
  );
}
