import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketingContentGrid } from "./MarketingContentGrid";

describe("MarketingContentGrid", () => {
  it("shows solution and scenario covers with their image descriptions", () => {
    render(<>
      <MarketingContentGrid locale="zh" kind="solutions" title="解决方案" items={[{ id: 1, slug: "packing", title: "包装方案", summary: "方案简介", cover: { url: "/uploads/solution.jpg", alternativeText: "包装方案封面" } }]} />
      <MarketingContentGrid locale="zh" kind="scenarios" title="应用场景" items={[{ id: 2, slug: "warehouse", title: "仓库场景", summary: "场景简介", cover: { url: "/uploads/scenario.jpg" } }]} />
    </>);

    expect(screen.getByRole("img", { name: "包装方案封面" })).toHaveClass("object-cover");
    expect(screen.getByRole("img", { name: "仓库场景" })).toHaveClass("object-cover");
    expect(screen.getByRole("link", { name: /包装方案/ })).toHaveAttribute("href", "/zh/solutions/packing");
    expect(screen.getByRole("link", { name: /仓库场景/ })).toHaveAttribute("href", "/zh/scenarios/warehouse");
  });

  it("keeps text-only cards when an item has no cover", () => {
    const { container } = render(<MarketingContentGrid locale="en" kind="faq" title="FAQ" items={[{ id: 3, slug: "shipping", question: "How to ship?", answer: "Pack carefully.", category: "shipping" }]} />);

    expect(within(container).queryByRole("img")).not.toBeInTheDocument();
    expect(within(container).getByRole("link", { name: /How to ship?/ })).toHaveAttribute("href", "/en/faq/shipping");
  });
});
