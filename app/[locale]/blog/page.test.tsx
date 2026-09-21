import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getArticleCategories, getArticles } from "@/lib/strapi/queries";
import BlogPage from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("not found");
  }),
}));

vi.mock("@/lib/strapi/queries", () => ({
  getArticleCategories: vi.fn(),
  getArticles: vi.fn(),
  getGlobal: vi.fn(),
}));

const articles = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  slug: `article-${index + 1}`,
  title: `Article ${index + 1}`,
}));

describe("BlogPage listing composition", () => {
  beforeEach(() => {
    vi.mocked(getArticleCategories).mockResolvedValue([
      { id: 1, slug: "company-news", name: "Company News" },
    ]);
    vi.mocked(getArticles).mockResolvedValue(articles);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("features the first unfiltered article and keeps the rest in two columns", async () => {
    const view = render(
      await BlogPage({
        params: Promise.resolve({ locale: "en" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByTestId("listing-hero")).toHaveAttribute(
      "data-variant",
      "compact",
    );
    expect(
      view.container.querySelectorAll('[data-featured="true"]'),
    ).toHaveLength(1);
    expect(view.container.querySelector("article")).toHaveAttribute(
      "data-featured",
      "true",
    );
    const grid = screen.getByTestId("article-listing-grid");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(within(grid).getAllByRole("article")).toHaveLength(2);
  });

  it.each([
    { label: "category", searchParams: { category: "company-news" } },
    { label: "search", searchParams: { search: "packaging" } },
  ])("does not feature an article when the $label filter is active", async ({
    searchParams,
  }) => {
    const view = render(
      await BlogPage({
        params: Promise.resolve({ locale: "en" }),
        searchParams: Promise.resolve(searchParams),
      }),
    );

    expect(
      view.container.querySelectorAll('[data-featured="true"]'),
    ).toHaveLength(0);
    expect(within(screen.getByTestId("article-listing-grid")).getAllByRole("article"))
      .toHaveLength(3);
  });
});
