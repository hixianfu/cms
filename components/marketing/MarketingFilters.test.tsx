import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarketingFilters } from "./MarketingFilters";

afterEach(() => cleanup());

describe("MarketingFilters", () => {
  it("renders active category and industry chips that preserve the other query values", () => {
    render(
      <MarketingFilters
        locale="en"
        path="solutions"
        q="wrap line"
        category="automation"
        industry="Logistics"
        categories={[{ value: "automation", label: "Automation" }]}
        industries={["Logistics"]}
      />,
    );

    const desktop = screen.getByTestId("listing-filter-panel-desktop");

    expect(within(desktop).getByRole("searchbox", { name: "Search solutions" })).toHaveAttribute(
      "name",
      "q",
    );
    expect(within(desktop).getByRole("combobox", { name: "Category" })).toHaveAttribute(
      "name",
      "category",
    );
    expect(within(desktop).getByRole("combobox", { name: "Industry" })).toHaveAttribute(
      "name",
      "industry",
    );
    expect(within(desktop).getByRole("link", { name: "Remove Automation filter" })).toHaveAttribute(
      "href",
      "/en/solutions?q=wrap+line&industry=Logistics",
    );
    expect(within(desktop).getByRole("link", { name: "Remove Logistics filter" })).toHaveAttribute(
      "href",
      "/en/solutions?q=wrap+line&category=automation",
    );
    expect(within(desktop).getByRole("link", { name: "Clear all filters" })).toHaveAttribute(
      "href",
      "/en/solutions",
    );
  });

  it("keeps category and industry as primary scenario filters", () => {
    render(
      <MarketingFilters
        locale="en"
        path="scenarios"
        categories={[{ value: "warehouse", label: "Warehouse" }]}
        industries={["E-commerce"]}
      />,
    );

    const desktop = screen.getByTestId("listing-filter-panel-desktop");
    expect(within(desktop).getByRole("searchbox", { name: "Search scenarios" })).toHaveAttribute(
      "placeholder",
      "Search by title",
    );
    expect(within(desktop).getByRole("combobox", { name: "Category" })).toBeVisible();
    expect(within(desktop).getByRole("combobox", { name: "Industry" })).toBeVisible();
    expect(within(desktop).queryByText("More filters")).not.toBeInTheDocument();
  });
});
