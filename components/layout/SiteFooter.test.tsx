import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteFooter } from "./SiteFooter";

vi.mock("next/link", () => ({
  default: ({ href, ...props }: React.ComponentProps<"a">) => <a href={href} {...props} />,
}));

afterEach(() => cleanup());

describe("SiteFooter navigation", () => {
  it.each([
    { label: "首页", href: "https://www.example.com/" },
    { label: "首页", href: "/home" },
    { label: " 首 页\u200B ", href: "/index.html" },
    { label: "Home", href: "https://www.example.com/en" },
    { label: "Home Page", href: "/home" },
    { label: "网站入口", href: "/" },
    { label: "网站入口", href: "/zh/?source=nav#top" },
    { label: "网站入口", href: " /en/ " },
  ])("excludes homepage navigation $label ($href) without changing shared navigation", (home) => {
    const navigation = [home, { label: "产品中心", href: "/products" }];
    render(<SiteFooter locale="zh" global={{ siteName: "示例", navigation }} megaMenu={{ solutions: [], scenarios: [], cases: [], articles: [] }} />);
    expect(screen.queryByRole("heading", { name: home.label })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: home.label })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "产品中心" })).toBeInTheDocument();
    expect(navigation).toEqual([home, { label: "产品中心", href: "/products" }]);
  });

  it("renders all default navigation sections and only top-level product categories", () => {
    render(
      <SiteFooter
        locale="zh"
        global={null}
        categories={[
          {
            id: 1,
            name: "缓冲包装",
            slug: "cushioning",
            children: [{
              id: 2,
              name: "缓冲气垫机",
              slug: "air-machines",
              children: [{ id: 3, name: "EA2S 迷你型缓冲气垫机", slug: "ea2s" }],
            }],
          },
        ]}
        megaMenu={{
          solutions: [{ id: 10, title: "仓储缓冲方案", slug: "warehouse", category: { id: 11, name: "物流包装", slug: "logistics" } }],
          scenarios: [],
          cases: [],
          articles: [],
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "缓冲包装" })).toHaveAttribute("href", "/zh/products?category=cushioning");
    expect(screen.queryByRole("link", { name: "缓冲气垫机" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "EA2S 迷你型缓冲气垫机" })).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: "物流包装" })).toHaveAttribute(
      "href",
      "/zh/solutions?category=logistics",
    );
    for (const label of ["产品中心", "解决方案", "视频中心", "新闻资讯", "答疑解惑", "联系我们", "关心我们"]) {
      expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    }
  });

  it("uses the configured header navigation in the footer", () => {
    render(<SiteFooter locale="zh" global={{ siteName: "示例", navigation: [{ label: "视频中心", href: "/videos" }, { label: "新闻", href: "/blog" }] }} categories={[]} megaMenu={{ solutions: [], scenarios: [], cases: [], articles: [] }} />);
    expect(screen.getByRole("heading", { name: "视频中心" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "新闻" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "答疑解惑" })).not.toBeInTheDocument();
  });
});
