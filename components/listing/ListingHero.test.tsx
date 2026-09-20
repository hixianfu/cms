import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ListingHero } from "./ListingHero";

afterEach(() => cleanup());

describe("ListingHero", () => {
  it("renders an immersive product hero with localized breadcrumb", () => {
    render(
      <ListingHero
        locale="en"
        variant="immersive"
        motif="product"
        eyebrow="Catalogue"
        title="Products"
        description="Built for the real world"
        stat={{ value: 2, label: "products" }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Products" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
      "Home",
    );
    expect(screen.getByTestId("listing-hero")).toHaveAttribute(
      "data-variant",
      "immersive",
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("marks the compact decorative motif as hidden", () => {
    render(
      <ListingHero
        locale="zh"
        variant="compact"
        motif="faq"
        eyebrow="FAQ"
        title="\u5e38\u89c1\u95ee\u9898"
        description="\u5feb\u901f\u627e\u5230\u7b54\u6848"
      />,
    );

    expect(screen.getByTestId("listing-hero-motif")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
