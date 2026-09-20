import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingEmptyState } from "./ListingEmptyState";
import { ListingMediaPlaceholder } from "./ListingMediaPlaceholder";
import { ListingPageShell } from "./ListingPageShell";
import { ListingPageSkeleton } from "./ListingPageSkeleton";
import { ListingResultHeader } from "./ListingResultHeader";
import { formatListingCount } from "./listing-copy";

describe("listing foundations", () => {
  it("renders a shared page shell and result heading", () => {
    render(
      <ListingPageShell>
        <ListingResultHeader
          eyebrow="All products"
          title="Explore products"
          count={2}
          countLabel="products"
        />
      </ListingPageShell>,
    );

    expect(screen.getByRole("main")).toHaveClass("listing-page");
    expect(
      screen.getByRole("heading", { level: 2, name: "Explore products" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 products")).toBeInTheDocument();
  });

  it("renders a reset action and hides decorative media from assistive technology", () => {
    render(
      <>
        <ListingEmptyState
          message="No matches"
          resetHref="/en/products"
          resetLabel="View all"
        />
        <ListingMediaPlaceholder motif="product" />
      </>,
    );

    expect(screen.getByRole("link", { name: "View all" })).toHaveAttribute(
      "href",
      "/en/products",
    );
    expect(screen.getByTestId("listing-media-placeholder")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps loading layout dimensions stable", () => {
    render(<ListingPageSkeleton variant="compact" sidebar />);

    expect(screen.getByTestId("listing-page-skeleton")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getAllByTestId("listing-card-skeleton")).toHaveLength(4);
  });

  it("formats singular, plural, and Chinese listing counts", () => {
    expect(formatListingCount("en", 1, "product", "products")).toBe(
      "1 product",
    );
    expect(formatListingCount("en", 2, "product", "products")).toBe(
      "2 products",
    );
    expect(formatListingCount("zh", 2, "个产品")).toBe("2个产品");
  });
});
