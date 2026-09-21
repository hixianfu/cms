import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductListingCard } from "./ProductListingCard";

describe("ProductListingCard", () => {
  it("renders localized product details with media metadata", () => {
    render(
      <ProductListingCard
        locale="en"
        product={{
          id: 1,
          slug: "air",
          name: "Air system",
          summary: "Protective packaging",
          category: { name: "Air Cushion Machine", slug: "air-machines" },
          cover: { url: "/air.jpg", alternativeText: "Air system equipment" },
        }}
      />,
    );

    expect(screen.getByRole("link", { name: /Air system/ })).toHaveAttribute(
      "href",
      "/en/products/air",
    );
    expect(screen.getByRole("img", { name: "Air system equipment" })).toBeInTheDocument();
    expect(screen.getByText("Air Cushion Machine")).toBeInTheDocument();
    expect(screen.getByText("Protective packaging")).toBeInTheDocument();
    expect(screen.getByText("View details")).toBeInTheDocument();
  });

  it("renders featured treatment and a stable missing-media fallback", () => {
    const { container, rerender } = render(
      <ProductListingCard
        locale="en"
        featured
        product={{ id: 1, slug: "air", name: "Air system" }}
      />,
    );

    const card = within(container);
    expect(card.getByRole("article")).toHaveAttribute("data-featured", "true");
    expect(card.getByRole("link", { name: /Air system/ })).toHaveClass(
      "md:grid-cols-2",
    );
    expect(card.getByTestId("listing-media-placeholder")).toBeInTheDocument();

    rerender(
      <ProductListingCard
        locale="zh"
        product={{ id: 2, slug: "paper", name: "Paper system" }}
      />,
    );

    expect(card.getByRole("link", { name: /Paper system/ })).toHaveAttribute(
      "href",
      "/zh/products/paper",
    );
    expect(card.getByTestId("listing-media-placeholder")).toBeInTheDocument();
  });
});
