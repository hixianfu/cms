import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarketingListing } from "./MarketingListing";

const categories = [{ id: 10, slug: "automation", name: "Automation" }];

afterEach(() => cleanup());

describe("MarketingListing", () => {
  it("renders solutions with an immersive hero, result stat, and solution CTA", () => {
    render(
      <MarketingListing
        locale="en"
        kind="solutions"
        items={[
          {
            id: 1,
            slug: "protective-wrap",
            title: "Protective wrap",
            summary: "Keep shipments secure.",
          },
        ]}
        allItems={[
          {
            id: 1,
            slug: "protective-wrap",
            title: "Protective wrap",
            summary: "Keep shipments secure.",
          },
        ]}
        categories={categories}
      />,
    );

    expect(screen.getByRole("main")).toHaveClass("listing-page");
    expect(screen.getByTestId("listing-hero")).toHaveAttribute("data-variant", "immersive");
    expect(screen.getByTestId("listing-hero")).toHaveAttribute("data-motif", "solution");
    const hero = within(screen.getByTestId("listing-hero"));
    expect(hero.getByText("1")).toBeInTheDocument();
    expect(hero.getByText("items")).toBeInTheDocument();
    expect(screen.getByText("View solution")).toBeInTheDocument();
    expect(screen.getByTestId("marketing-listing-grid")).toHaveAttribute(
      "data-sparse",
      "true",
    );
  });

  it("renders scenarios with a compact hero and scenario CTA", () => {
    render(
      <MarketingListing
        locale="en"
        kind="scenarios"
        items={[
          {
            id: 2,
            slug: "warehouse-packing",
            title: "Warehouse packing",
            summary: "Speed up fulfillment.",
          },
          {
            id: 3,
            slug: "production-line",
            title: "Production line",
            summary: "Protect items in motion.",
          },
        ]}
        allItems={[]}
        categories={categories}
      />,
    );

    expect(screen.getByTestId("listing-hero")).toHaveAttribute("data-variant", "compact");
    expect(screen.getByTestId("listing-hero")).toHaveAttribute("data-motif", "scenario");
    expect(screen.getByTestId("listing-hero")).not.toHaveTextContent("2 items");
    expect(screen.getAllByText("View scenario")).toHaveLength(2);
    expect(screen.getByTestId("marketing-listing-grid")).toHaveAttribute(
      "data-sparse",
      "true",
    );
  });

  it("uses the localized unfiltered route for empty results", () => {
    render(
      <MarketingListing
        locale="zh"
        kind="scenarios"
        items={[]}
        allItems={[]}
        categories={[]}
        q="仓储"
        category="warehouse"
        industry="物流"
      />,
    );

    expect(screen.getByRole("link", { name: "查看全部" })).toHaveAttribute(
      "href",
      "/zh/scenarios",
    );
  });
});
