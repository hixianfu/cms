import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MegaMenu } from "./MegaMenu";

describe("MegaMenu", () => {
  it("renders product parents and children", () => {
    render(<MegaMenu locale="zh" menu={{ kind: "products", categories: [{ id: 1, name: "设备", slug: "machines", children: [{ id: 2, name: "气垫机", slug: "air-machines" }] }] }} />);
    expect(screen.getByRole("link", { name: "全部产品" })).toHaveAttribute("href", "/zh/products");
    expect(screen.getByRole("link", { name: "设备" })).toHaveAttribute("href", "/zh/products?category=machines");
    expect(screen.getByRole("link", { name: "气垫机" })).toHaveAttribute("href", "/zh/products?category=air-machines");
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
});
