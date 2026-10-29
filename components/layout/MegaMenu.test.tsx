import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MegaMenu } from "./MegaMenu";

describe("MegaMenu", () => {
  it("reveals product levels progressively on hover", () => {
    render(<MegaMenu locale="zh" menu={{ kind: "products", categories: [{ id: 1, name: "设备", slug: "machines", children: [{ id: 2, name: "气垫机", slug: "air-machines", children: [{ id: 3, name: "Pro 气垫机", slug: "pro-air-machines" }] }] }] }} />);
    expect(screen.getByRole("link", { name: "全部产品" })).toHaveAttribute("href", "/zh/products");
    expect(screen.getByRole("link", { name: "设备" })).toHaveAttribute("href", "/zh/products?category=machines");
    expect(screen.queryByRole("link", { name: "气垫机" })).not.toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByRole("link", { name: "设备" }));
    expect(screen.getByRole("link", { name: "气垫机" })).toHaveAttribute("href", "/zh/products?category=air-machines");
    expect(screen.queryByRole("link", { name: "Pro 气垫机" })).not.toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByRole("link", { name: "气垫机" }));
    expect(screen.getByRole("link", { name: "Pro 气垫机" })).toHaveAttribute("href", "/zh/products?category=pro-air-machines");
  });

  it("groups content by industry and links every entry", () => {
    render(<MegaMenu locale="zh" menu={{ kind: "content", path: "solutions", items: [
      { id: 1, title: "电商包装", slug: "ecommerce", category: { id: 10, name: "电商", slug: "ecommerce-solutions" } },
      { id: 2, title: "仓储包装", slug: "warehouse", industry: "物流" },
    ] }} />);
    expect(screen.getByRole("link", { name: "电商" })).toHaveAttribute("href", "/zh/solutions?category=ecommerce-solutions");
    expect(screen.getByRole("link", { name: "电商包装" })).toHaveAttribute("href", "/zh/solutions/ecommerce");
    expect(screen.getByRole("link", { name: "仓储包装" })).toHaveAttribute("href", "/zh/solutions/warehouse");
  });

  it("renders article categories and article links", () => {
    render(<MegaMenu locale="en" menu={{ kind: "content", path: "blog", items: [
      { id: 3, title: "Packaging guide", slug: "packaging-guide", category: { id: 11, name: "Packaging knowledge", slug: "packaging-knowledge" } },
    ] }} />);
    expect(screen.getByRole("link", { name: "Packaging knowledge" })).toHaveAttribute("href", "/en/blog?category=packaging-knowledge");
    expect(screen.getByRole("link", { name: "Packaging guide" })).toHaveAttribute("href", "/en/blog/packaging-guide");
  });
});
