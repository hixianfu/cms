import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

let pathname = "/zh";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

const megaMenu = { solutions: [], scenarios: [], cases: [], articles: [] };

afterEach(() => cleanup());

describe("SiteHeader", () => {
  it("overlays the localized homepage hero with inverse controls", () => {
    pathname = "/zh";

    render(<SiteHeader locale="zh" global={null} megaMenu={megaMenu} />);

    expect(screen.getByRole("banner")).toHaveClass("absolute", "text-white");
    screen.getAllByRole("link", { name: "EN" }).forEach((link) => {
      expect(link).toHaveClass("text-white");
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
