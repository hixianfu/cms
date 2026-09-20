import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureCards } from "./FeatureCards";

describe("FeatureCards", () => {
  it("keeps all cards in one carousel and preserves links", () => {
    const cards = Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      title: `Feature ${index + 1}`,
      targetType: "product" as const,
      product: { slug: `product-${index + 1}` },
    }));

    render(<FeatureCards locale="en" title="Our features" cards={cards} />);

    expect(screen.getAllByRole("group")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /Feature 6/ })).toHaveAttribute("href", "/en/products/product-6");
  });
});
