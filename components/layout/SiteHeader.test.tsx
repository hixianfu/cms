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
});

afterEach(() => cleanup());

describe("SiteHeader", () => {
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
