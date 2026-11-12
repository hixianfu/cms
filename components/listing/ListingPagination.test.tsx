import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ListingPagination } from "./ListingPagination";

afterEach(() => cleanup());

describe("ListingPagination", () => {
  it("keeps category and search filters when navigating pages", () => {
    render(<ListingPagination locale="zh" path="/products" pagination={{ page: 2, pageSize: 12, pageCount: 4, total: 41 }} filters={{ category: "air-machines", search: "气垫 & 设备" }} />);
    const next = new URL(screen.getByRole("link", { name: "下一页" }).getAttribute("href")!, "https://example.com");
    expect(next.pathname).toBe("/zh/products");
    expect(next.searchParams.get("page")).toBe("3");
    expect(next.searchParams.get("category")).toBe("air-machines");
    expect(next.searchParams.get("search")).toBe("气垫 & 设备");
    expect(screen.getByLabelText("第 2 页")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("共 41 个产品，显示第 13–24 个，第 2 / 4 页")).toBeInTheDocument();
    expect(new URL(screen.getByRole("link", { name: "上一页" }).getAttribute("href")!, "https://example.com").searchParams.has("page")).toBe(false);
  });

  it.each([0, 1])("hides pagination when there are %s pages", (pageCount) => {
    render(<ListingPagination locale="zh" path="/products" pagination={{ page: 1, pageSize: 12, pageCount, total: pageCount }} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("disables previous at the first page", () => {
    render(<ListingPagination locale="zh" path="/products" pagination={{ page: 1, pageSize: 12, pageCount: 4, total: 41 }} />);
    expect(screen.queryByRole("link", { name: "上一页" })).not.toBeInTheDocument();
    expect(screen.getByText("上一页")).toHaveAttribute("aria-disabled", "true");
  });

  it("disables next at the final page and shows the correct final range", () => {
    render(<ListingPagination locale="en" path="/products" pagination={{ page: 4, pageSize: 12, pageCount: 4, total: 41 }} />);
    expect(screen.queryByRole("link", { name: "Next" })).not.toBeInTheDocument();
    expect(screen.getByText("Next")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("41 products, showing 37–41, page 4 of 4")).toBeInTheDocument();
  });

  it("limits page links for large catalogues while keeping first and last pages", () => {
    render(<ListingPagination locale="zh" path="/products" pagination={{ page: 50, pageSize: 12, pageCount: 100, total: 1200 }} />);
    expect(screen.getByRole("link", { name: "第 1 页" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "第 100 页" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(8);
  });
});
