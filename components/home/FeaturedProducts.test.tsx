import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("switches to the products configured for the selected category", async () => {
    const user = userEvent.setup();
    render(<FeaturedProducts locale="zh" products={[]} categories={[
      { id: 1, label: "设备", products: [{ id: 11, name: "设备产品", slug: "equipment", featured: false }] },
      { id: 2, label: "材料", products: [{ id: 12, name: "材料产品", slug: "material", featured: false }] },
    ]} />);

    expect(screen.getByText("设备产品")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "材料" }));
    expect(screen.getByText("材料产品")).toBeInTheDocument();
    expect(screen.queryByText("设备产品")).not.toBeInTheDocument();
  });
});
