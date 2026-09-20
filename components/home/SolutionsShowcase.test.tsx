import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SolutionsShowcase } from "./SolutionsShowcase";

const section = {
  title: "Solutions",
  buttonLabel: "Explore category",
  entries: [
    {
      id: 1,
      category: { id: 11, name: "Offshore engineering", slug: "offshore", description: "Offshore category description." },
      title: "Offshore engineering solutions",
      description: "Monitor offshore wind assets.",
      backgroundImage: { url: "/uploads/offshore.jpg", alternativeText: "Offshore wind farm" },
      solutions: [
        { id: 101, title: "Turbine inspection", slug: "inspection", summary: "Inspection summary" },
        { id: 102, title: "Cable inspection", slug: "cable", summary: "Cable summary" },
      ],
    },
    {
      id: 2,
      category: { id: 12, name: "Water engineering", slug: "water", description: "Inspect water infrastructure." },
      backgroundImage: { url: "/uploads/water.jpg", alternativeText: "Water engineering site" },
      solutions: [{ id: 201, title: "Reservoir monitoring", slug: "reservoir", summary: "Reservoir summary" }],
    },
  ],
};

describe("SolutionsShowcase", () => {
  it("switches the active category and its configured solutions when hovered", async () => {
    const user = userEvent.setup();
    render(<SolutionsShowcase locale="en" section={section} />);

    let active = screen.getByTestId("active-solution-category");
    expect(within(active).getByRole("heading", { name: "Offshore engineering solutions" })).toBeInTheDocument();
    expect(within(active).getByRole("link", { name: /Turbine inspection/ })).toHaveAttribute("href", "/en/solutions/inspection");
    expect(within(active).getByRole("link", { name: /Cable inspection/ })).toHaveAttribute("href", "/en/solutions/cable");
    expect(within(active).getByRole("link", { name: /Explore category/ })).toHaveAttribute("href", "/en/solutions?category=offshore");
    expect(screen.getByTestId("solution-category-background")).toHaveAttribute("alt", "Offshore wind farm");

    await user.hover(screen.getByRole("button", { name: /Water engineering/ }));

    active = screen.getByTestId("active-solution-category");
    expect(within(active).getByRole("heading", { name: "Water engineering" })).toBeInTheDocument();
    expect(within(active).getByRole("link", { name: /Reservoir monitoring/ })).toHaveAttribute("href", "/en/solutions/reservoir");
    expect(within(active).getByRole("link", { name: /Explore category/ })).toHaveAttribute("href", "/en/solutions?category=water");
    expect(within(active).queryByRole("link", { name: /Turbine inspection/ })).not.toBeInTheDocument();
    expect(screen.getByTestId("solution-category-background")).toHaveAttribute("alt", "Water engineering site");
  });

  it("falls back to the legacy solutions relation", () => {
    render(<SolutionsShowcase locale="zh" section={{ solutions: [{ id: 1, title: "包装方案", slug: "packing", summary: "包装方案简介", category: { id: 2, name: "物流包装", slug: "logistics", description: "物流包装分类" } }] }} />);

    expect(screen.getByRole("heading", { name: "物流包装" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "包装方案" })).toHaveAttribute("href", "/zh/solutions/packing");
    expect(screen.getByRole("link", { name: /了解详情/ })).toHaveAttribute("href", "/zh/solutions?category=logistics");
  });
});
