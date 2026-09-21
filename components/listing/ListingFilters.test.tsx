import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ListingFilterDrawer } from "./ListingFilterDrawer";
import { ListingFilterPanel } from "./ListingFilterPanel";
import { ListingSearchBar } from "./ListingSearchBar";
import { ListingSidebar } from "./ListingSidebar";

afterEach(() => cleanup());

describe("listing filters", () => {
  it("opens and closes the mobile filter drawer", async () => {
    const user = userEvent.setup();

    render(
      <ListingFilterDrawer locale="en" title="Filters">
        <label>
          Category
          <select>
            <option>All</option>
          </select>
        </label>
      </ListingFilterDrawer>,
    );

    const trigger = screen.getByRole("button", { name: "Open filters" });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Filters" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Close filters" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Filters" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("renders exact active-filter clear links and the complete GET form", async () => {
    const user = userEvent.setup();

    render(
      <ListingFilterPanel
        locale="en"
        search={{
          name: "q",
          value: "wrap",
          label: "Search cases",
          placeholder: "Search by title",
        }}
        primaryFields={[
          {
            name: "category",
            label: "Category",
            value: "machines",
            allLabel: "All categories",
            options: [{ value: "machines", label: "Machines" }],
          },
        ]}
        secondaryFields={[
          {
            name: "product",
            label: "Product",
            value: "air",
            allLabel: "All products",
            options: [{ value: "air", label: "Air system" }],
          },
        ]}
        activeFilters={[
          {
            name: "category",
            label: "Machines",
            clearHref: "/cases?q=wrap&product=air",
          },
        ]}
        resetHref="/cases"
      />,
    );

    const desktop = screen.getByTestId("listing-filter-panel-desktop");
    expect(within(desktop).getByRole("searchbox", { name: "Search cases" })).toHaveAttribute(
      "name",
      "q",
    );
    expect(within(desktop).getByRole("combobox", { name: "Category" })).toHaveAttribute(
      "name",
      "category",
    );
    expect(within(desktop).getByRole("combobox", { name: "Product" })).toHaveAttribute(
      "name",
      "product",
    );
    expect(within(desktop).getByRole("button", { name: "Apply filters" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(within(desktop).getByRole("link", { name: "Remove Machines filter" })).toHaveAttribute(
      "href",
      "/en/cases?q=wrap&product=air",
    );
    expect(within(desktop).getByRole("link", { name: "Remove Machines filter" })).toHaveClass(
      "min-h-11",
    );
    expect(within(desktop).getByRole("link", { name: "Clear all filters" })).toHaveAttribute(
      "href",
      "/en/cases",
    );
    expect(within(desktop).getByRole("link", { name: "Clear all filters" })).toHaveClass(
      "min-h-11",
    );

    await user.click(screen.getByRole("button", { name: "Open filters" }));
    expect(screen.getAllByRole("searchbox", { name: "Search cases" })).toHaveLength(2);
  });

  it("marks active sidebar links in desktop and mobile navigation", async () => {
    const user = userEvent.setup();

    render(
      <ListingSidebar
        locale="en"
        label="Product categories"
        allItem={{ href: "/products", label: "All products", active: false }}
        items={[
          {
            href: "/products?category=machines",
            label: "Machines",
            active: true,
            children: [
              {
                href: "/products?category=air",
                label: "Air systems",
                active: false,
              },
            ],
          },
        ]}
      />,
    );

    const desktop = screen.getByTestId("listing-sidebar-desktop");
    expect(within(desktop).getByRole("link", { name: "Machines" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(desktop).getByRole("link", { name: "Air systems" })).toHaveAttribute(
      "href",
      "/en/products?category=air",
    );

    await user.click(screen.getByRole("button", { name: "Open filters" }));
    const dialog = screen.getByRole("dialog", { name: "Product categories" });
    expect(within(dialog).getByRole("link", { name: "Machines" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("preserves route-owned GET parameters in the standalone search form", () => {
    render(
      <ListingSearchBar
        locale="en"
        name="search"
        value="paper"
        label="Search products"
        placeholder="Search by name"
        preserved={{ category: "protective", empty: undefined }}
        clearHref="/products?category=protective"
      />,
    );

    expect(screen.getByRole("searchbox", { name: "Search products" })).toHaveAttribute(
      "name",
      "search",
    );
    expect(screen.getByDisplayValue("protective")).toHaveAttribute("name", "category");
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute("type", "submit");
    expect(screen.getByRole("link", { name: "Clear search" })).toHaveAttribute(
      "href",
      "/en/products?category=protective",
    );
  });
});
