import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileNav } from "./MobileNav";

const props = {
  locale: "zh" as const, open: true, onClose: vi.fn(),
  items: [{ label: "产品中心", href: "/products" }, { label: "联系我们", href: "/contact" }],
  categories: [{ id: 1, name: "设备", slug: "machines", children: [{ id: 2, name: "气垫机", slug: "air-machines", children: [{ id: 3, name: "迷你气垫机", slug: "mini" }] }] }],
  megaMenu: { solutions: [], scenarios: [], cases: [], articles: [] },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Object.defineProperty(window, "scrollY", { configurable: true, value: 360 });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); document.body.removeAttribute("style"); document.documentElement.removeAttribute("style"); });

describe("MobileNav", () => {
  it("collapses category descendants by default and expands each level independently", () => {
    render(<MobileNav {...props} />);
    expect(screen.getByRole("link", { name: "设备" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "气垫机" })).not.toBeInTheDocument();
    const expand = screen.getByRole("button", { name: "展开设备" });
    expect(expand).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(expand);
    expect(props.onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "气垫机" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "迷你气垫机" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "展开气垫机" }));
    expect(screen.getByRole("link", { name: "迷你气垫机" })).toHaveAttribute("href", "/zh/products?category=mini");
    fireEvent.click(screen.getByRole("button", { name: "收起设备" }));
    expect(screen.queryByRole("link", { name: "气垫机" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "展开设备" }));
    expect(screen.queryByRole("link", { name: "迷你气垫机" })).not.toBeInTheDocument();
  });

  it("locks the background at its current position and restores styles, scroll and focus on close", () => {
    document.body.style.position = "relative";
    document.documentElement.style.scrollBehavior = "smooth";
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const { rerender } = render(<MobileNav {...props} />);
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-360px");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(screen.getByRole("button", { name: "关闭菜单" })).toHaveFocus();
    const nav = screen.getByRole("navigation", { name: "菜单" });
    expect(nav).toHaveClass("overflow-y-auto", "overscroll-contain", "min-h-0");
    expect(screen.getByRole("dialog").parentElement).toHaveClass("h-dvh", "overflow-hidden");
    expect(screen.getByRole("dialog").parentElement?.parentElement).toBe(document.body);
    rerender(<MobileNav {...props} open={false} />);
    expect(document.body.style.position).toBe("relative");
    expect(document.body.style.top).toBe("");
    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.documentElement.style.scrollBehavior).toBe("smooth");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 360);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it("closes on Escape, backdrop and category navigation", () => {
    render(<MobileNav {...props} />);
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("dialog").parentElement!);
    const category = screen.getByRole("link", { name: "设备" });
    category.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(category);
    expect(props.onClose).toHaveBeenCalledTimes(3);
  });

  it("keeps keyboard focus inside the open menu", () => {
    render(<MobileNav {...props} />);
    const close = screen.getByRole("button", { name: "关闭菜单" });
    const last = screen.getByRole("link", { name: "联系我们" });
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();
  });

  it("closes when resized to desktop and releases the lock on unmount", () => {
    const { unmount } = render(<MobileNav {...props} />);
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1280 });
    fireEvent(window, new Event("resize"));
    expect(props.onClose).toHaveBeenCalled();
    unmount();
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });
});
