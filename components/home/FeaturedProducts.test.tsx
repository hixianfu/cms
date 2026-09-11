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
  it("shows at most six featured products", () => {
    render(<FeaturedProducts locale="zh" products={products} />);
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.queryByText("产品 7")).not.toBeInTheDocument();
  });

  it("shows a localized empty state", () => {
    render(<FeaturedProducts locale="zh" products={[]} />);
    expect(screen.getByText("暂无推荐产品")).toBeInTheDocument();
  });
});
