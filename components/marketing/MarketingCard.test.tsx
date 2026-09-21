import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarketingCard } from "./MarketingCard";

afterEach(() => cleanup());

describe("MarketingCard", () => {
  it("renders solution labels, localized detail URL, and the solution CTA", () => {
    render(
      <MarketingCard
        locale="en"
        path="solutions"
        item={{
          id: 1,
          slug: "protective-wrap",
          title: "Protective wrap",
          summary: "Keep shipments secure.",
          category: { id: 2, slug: "automation", name: "Automation" },
          industry: "Logistics",
          customerPain: "Damage during long-distance delivery",
          packagingNeeds: "Fast void fill at the packing station",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: /Protective wrap/ })).toHaveAttribute(
      "href",
      "/en/solutions/protective-wrap",
    );
    expect(screen.getByText("Automation")).toBeInTheDocument();
    expect(screen.getByText("Logistics")).toBeInTheDocument();
    expect(screen.getByText("Damage during long-distance delivery")).toBeInTheDocument();
    expect(screen.getByText("Fast void fill at the packing station")).toBeInTheDocument();
    expect(screen.getByText("View solution")).toBeInTheDocument();
  });

  it("renders at most two related products for scenarios", () => {
    render(
      <MarketingCard
        locale="en"
        path="scenarios"
        item={{
          id: 3,
          slug: "warehouse-packing",
          title: "Warehouse packing",
          summary: "Speed up fulfillment.",
          products: [
            { id: 1, slug: "air", name: "Air cushion system" },
            { id: 2, slug: "paper", title: "Paper converter" },
            { id: 3, slug: "film", name: "Film dispenser" },
          ],
        }}
      />,
    );

    expect(screen.getByText("Air cushion system")).toBeInTheDocument();
    expect(screen.getByText("Paper converter")).toBeInTheDocument();
    expect(screen.queryByText("Film dispenser")).not.toBeInTheDocument();
    expect(screen.getByText("View scenario")).toBeInTheDocument();
  });

  it("uses the shared placeholder and omits empty metadata rows", () => {
    const { container } = render(
      <MarketingCard
        locale="en"
        path="scenarios"
        item={{
          id: 4,
          slug: "packing-bench",
          title: "Packing bench",
          summary: "A focused workstation.",
          products: [{ slug: "unnamed" }],
        }}
      />,
    );

    const card = within(container);
    expect(card.getByTestId("listing-media-placeholder")).toHaveAttribute(
      "data-motif",
      "scenario",
    );
    expect(card.queryByTestId("marketing-card-taxonomy")).not.toBeInTheDocument();
    expect(card.queryByTestId("marketing-card-metadata")).not.toBeInTheDocument();
  });
});
