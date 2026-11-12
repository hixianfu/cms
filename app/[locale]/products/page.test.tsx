import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import ProductsPage from "./page";
import { getGlobal, getProductCategories, getProductPage } from "@/lib/strapi/queries";

vi.mock("@/lib/strapi/queries", () => ({ getGlobal: vi.fn(), getProductCategories: vi.fn(), getProductPage: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("not found"); }, redirect: vi.fn(() => { throw new Error("redirect"); }) }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getGlobal).mockResolvedValue(null);
  vi.mocked(getProductCategories).mockResolvedValue([{ id: 1, name: "设备", slug: "machines", children: [{ id: 2, name: "气垫机", slug: "air-machines" }] }]);
  vi.mocked(getProductPage).mockResolvedValue({ products: [{ id: 13, name: "第十三个产品", slug: "machine-13" }], pagination: { page: 2, pageSize: 12, pageCount: 4, total: 41 } });
});
afterEach(() => cleanup());

describe("ProductsPage pagination", () => {
  it("requests page two with descendant category and search filters and displays the total count", async () => {
    render(await ProductsPage({ params: Promise.resolve({ locale: "zh" }), searchParams: Promise.resolve({ category: "machines", search: " 气垫 ", page: "2" }) }));
    const [locale, filters, page] = vi.mocked(getProductPage).mock.lastCall!;
    const query = new URLSearchParams(filters);
    expect(locale).toBe("zh");
    expect(page).toBe(2);
    expect(query.get("filters[category][slug][$in][1]")).toBe("air-machines");
    expect(query.get("filters[$or][0][name][$containsi]")).toBe("气垫");
    expect(screen.getByText("41 个产品")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "下一页" })).toHaveAttribute("href", "/zh/products?category=machines&search=%E6%B0%94%E5%9E%AB&page=3");
    expect(screen.getByRole("search").querySelector('input[name="page"]')).toBeNull();
  });

  it.each(["0", "-2", "1.5", "oops", "999999999999999999999"]) ("uses page one for invalid page %s", async (page) => {
    await ProductsPage({ params: Promise.resolve({ locale: "zh" }), searchParams: Promise.resolve({ page }) });
    expect(vi.mocked(getProductPage).mock.lastCall![2]).toBe(1);
  });

  it("redirects an out-of-range page to the final page with filters intact", async () => {
    await expect(ProductsPage({ params: Promise.resolve({ locale: "en" }), searchParams: Promise.resolve({ category: "machines", search: "air", page: "99" }) })).rejects.toThrow("redirect");
    expect(redirect).toHaveBeenCalledWith("/en/products?category=machines&search=air&page=4");
  });

  it("returns to page one if all matching products were removed", async () => {
    vi.mocked(getProductPage).mockResolvedValue({ products: [], pagination: { page: 2, pageSize: 12, pageCount: 0, total: 0 } });
    await expect(ProductsPage({ params: Promise.resolve({ locale: "zh" }), searchParams: Promise.resolve({ page: "2" }) })).rejects.toThrow("redirect");
    expect(redirect).toHaveBeenCalledWith("/zh/products");
  });
});
