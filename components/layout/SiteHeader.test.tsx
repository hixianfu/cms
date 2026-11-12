import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

let pathname = "/zh";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

const megaMenu = { solutions: [], scenarios: [], cases: [], articles: [] };

beforeEach(() => {
  pathname = "/zh";
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("SiteHeader", () => {
  it("shows configured empty video and FAQ categories on desktop and mobile", () => {
    const videoCategory = { id: 101, name: "安装指导", slug: "installation" };
    const faqCategory = { id: 102, name: "售后支持", slug: "support" };
    render(<SiteHeader locale="zh" global={{ siteName: "Ameson", navigation: [
      { label: "视频中心", href: "/videos" },
      { label: "答疑解惑", href: "/faq" },
    ] }} megaMenu={{ ...megaMenu, videos: [], faqs: [], videoCategories: [videoCategory], faqCategories: [faqCategory] }} />);
    fireEvent.focus(screen.getByRole("link", { name: "视频中心" }));
    expect(screen.getByRole("link", { name: "安装指导" })).toHaveAttribute("href", "/zh/videos?category=installation");
    fireEvent.focus(screen.getByRole("link", { name: "答疑解惑" }));
    expect(screen.getByRole("link", { name: "售后支持" })).toHaveAttribute("href", "/zh/faq?category=support");
    fireEvent.click(screen.getByRole("button", { name: "菜单" }));
    expect(screen.getByRole("navigation", { name: "菜单" }).querySelector('a[href="/zh/videos?category=installation"]')).toHaveTextContent("安装指导");
    expect(screen.getByRole("navigation", { name: "菜单" }).querySelector('a[href="/zh/faq?category=support"]')).toHaveTextContent("售后支持");
  });

  it("overlays the localized homepage hero with inverse controls", () => {
    pathname = "/zh";

    render(<SiteHeader locale="zh" global={null} megaMenu={megaMenu} />);

    expect(screen.getByRole("banner")).toHaveClass("fixed", "text-white");
    screen.getAllByRole("link", { name: "EN" }).forEach((link) => {
      expect(link).toHaveClass("text-white");
    });
  });

  it("keeps the homepage header visible and switches to a light theme after scrolling", () => {
    render(<SiteHeader locale="zh" global={null} megaMenu={megaMenu} />);

    Object.defineProperty(window, "scrollY", { configurable: true, value: 120 });
    fireEvent.scroll(window);

    expect(screen.getByRole("banner")).toHaveClass("fixed", "bg-white/95", "text-brand-ink");
    expect(screen.getByRole("banner")).not.toHaveClass("absolute", "bg-transparent");
    screen.getAllByRole("link", { name: "EN" }).forEach((link) => {
      expect(link).toHaveClass("text-slate-600");
    });
  });

  it("keeps the sticky light header on inner pages", () => {
    pathname = "/zh/products";

    render(<SiteHeader locale="zh" global={null} megaMenu={megaMenu} />);

    expect(screen.getByRole("banner")).toHaveClass("sticky", "bg-white/95");
    expect(screen.getByRole("banner")).not.toHaveClass("absolute");
    screen.getAllByRole("link", { name: "EN" }).forEach((link) => {
      expect(link).toHaveClass("text-slate-600");
    });
  });
});
