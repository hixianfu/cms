import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseCard } from "./CaseCard";
import { CaseFilters } from "./CaseFilters";

describe("case listing", () => {
  it("renders category and industry metadata, an optional results excerpt, and a localized route", () => {
    render(
      <CaseCard
        locale="en"
        featured
        caseStudy={{
          id: 1,
          slug: "retail-packaging",
          title: "Retail packaging",
          summary: "A case summary.",
          results: "Reduced packing time by 30%.",
          industry: "Retail",
          category: { id: 2, slug: "automation", name: "Automation" },
          cover: { url: "/case.jpg", alternativeText: "Packaging line" },
        }}
      />,
    );

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("data-featured", "true");
    expect(screen.getByRole("link", { name: /Retail packaging/ })).toHaveAttribute(
      "href",
      "/en/cases/retail-packaging",
    );
    expect(screen.getByRole("img", { name: "Packaging line" })).toBeInTheDocument();
    expect(within(article).getByText("Automation")).toBeInTheDocument();
    expect(within(article).getByText("Retail")).toBeInTheDocument();
    expect(within(article).getByText("Reduced packing time by 30%.")).toBeInTheDocument();
  });

  it("omits the results excerpt and uses the shared missing-media placeholder", () => {
    render(
      <CaseCard
        locale="zh"
        caseStudy={{ id: 2, slug: "notice", title: "Notice", summary: "Summary" }}
      />,
    );

    expect(screen.getByRole("link", { name: /Notice/ })).toHaveAttribute(
      "href",
      "/zh/cases/notice",
    );
    expect(screen.queryByText("Summary")).not.toBeInTheDocument();
    expect(screen.getByTestId("listing-media-placeholder").parentElement).toHaveClass(
      "aspect-video",
    );
  });

  it("keeps product and scenario fields in the secondary filter disclosure", () => {
    render(
      <CaseFilters
        locale="en"
        q="wrap"
        category="automation"
        industry="retail"
        product="air"
        scenario="fulfillment"
        categories={[{ value: "automation", label: "Automation" }]}
        industries={[{ value: "retail", label: "Retail" }]}
        products={[{ value: "air", label: "Air system" }]}
        scenarios={[{ value: "fulfillment", label: "Fulfillment" }]}
      />,
    );

    const desktop = screen.getByTestId("listing-filter-panel-desktop");
    expect(within(desktop).getByRole("combobox", { name: "Category" })).toHaveAttribute(
      "name",
      "category",
    );
    expect(within(desktop).getByRole("combobox", { name: "Industry" })).toHaveAttribute(
      "name",
      "industry",
    );
    expect(within(desktop).getByText("More filters")).toBeInTheDocument();
    expect(within(desktop).getByRole("combobox", { name: "Product" })).toHaveAttribute(
      "name",
      "product",
    );
    expect(within(desktop).getByRole("combobox", { name: "Scenario" })).toHaveAttribute(
      "name",
      "scenario",
    );
    expect(within(desktop).getByRole("link", { name: "Remove Retail filter" })).toHaveAttribute(
      "href",
      "/en/cases?q=wrap&category=automation&product=air&scenario=fulfillment",
    );
  });
});
