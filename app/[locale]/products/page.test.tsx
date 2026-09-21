import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getProductCategories, getProducts } from "@/lib/strapi/queries";
import ProductsPage from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("not found");
  }),
}));

vi.mock("@/lib/strapi/queries", () => ({
  getGlobal: vi.fn(),
  getProductCategories: vi.fn(),
  getProducts: vi.fn(),
}));

const product = (index: number) => ({
  id: index,
  slug: `product-${index}`,
  name: `Product ${index}`,
});

describe("ProductsPage listing composition", () => {
  beforeEach(() => {
    vi.mocked(getProductCategories).mockResolvedValue([]);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it.each([
    { count: 1, featuredCount: 1 },
    { count: 2, featuredCount: 1 },
    { count: 3, featuredCount: 0 },
  ])("features only the first product for a $count-item result set", async ({
    count,
    featuredCount,
  }) => {
    vi.mocked(getProducts).mockResolvedValue(
      Array.from({ length: count }, (_, index) => product(index + 1)),
    );

    const view = render(
      await ProductsPage({
        params: Promise.resolve({ locale: "en" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByTestId("listing-hero")).toHaveAttribute(
      "data-variant",
      "immersive",
    );
    expect(view.container.querySelectorAll("article")).toHaveLength(count);
    expect(
      view.container.querySelectorAll('[data-featured="true"]'),
    ).toHaveLength(featuredCount);
    if (featuredCount) {
      expect(view.container.querySelector("article")).toHaveAttribute(
        "data-featured",
        "true",
      );
    }
  });
});
