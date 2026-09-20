import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedProducts } from "./FeaturedProducts";

const products = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `产品 ${index + 1}`,
  slug: `product-${index + 1}`,
  featured: true,
}));

describe("FeaturedProducts", () => {
  it("keeps every configured featured product available in the carousel", () => {
    render(<FeaturedProducts locale="zh" products={products} />);
    expect(screen.getAllByRole("article")).toHaveLength(8);
    expect(screen.getByText("产品 8")).toBeInTheDocument();
  });

  it("does not render when there are no products", () => {
    const { container } = render(<FeaturedProducts locale="zh" products={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
