import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProductImageGallery } from "./ProductImageGallery";

const cover = { url: "/uploads/cover.jpg", alternativeText: "Cover image" };
const gallery = [
  { url: "/uploads/detail-1.jpg", alternativeText: "Detail one" },
  { url: "/uploads/detail-2.jpg", alternativeText: "Detail two" },
];

describe("ProductImageGallery", () => {
  it("renders all product images and switches the active image", async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery cover={cover} gallery={gallery} locale="en" productName="Air machine" />);

    expect(screen.getAllByRole("button", { name: /Image [1-3]/ })).toHaveLength(3);
    expect(within(screen.getByRole("button", { name: "View larger image" })).getByRole("img", { name: "Cover image" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Image 3" }));
    expect(within(screen.getByRole("button", { name: "View larger image" })).getByRole("img", { name: "Detail two" })).toBeInTheDocument();
  });

  it("opens a preview and navigates between images", async () => {
    const user = userEvent.setup();
    render(<ProductImageGallery cover={cover} gallery={gallery} locale="zh" productName="气垫机" />);

    await user.click(screen.getByRole("button", { name: "查看大图" }));
    expect(screen.getByRole("dialog", { name: "产品图片预览" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "下一张" }));
    expect(screen.getByRole("dialog").querySelector('img[alt="Detail one"]')).toBeInTheDocument();
  });
});
