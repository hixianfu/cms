import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompanyShowcase } from "./CompanyShowcase";

const section = {
  title: "Ameson Packaging",
  subtitle: "Protective packaging expertise built for global teams",
  description: "We combine equipment, materials and service to make every shipment safer.",
  buttonLabel: "Learn more",
  backgroundImage: { url: "/uploads/company-building.jpg", alternativeText: "Ameson office building" },
  article: { id: 12, title: "About Ameson", slug: "about-ameson" },
  highlights: [
    { id: 1, text: "Technology: global perspective and independent research" },
    { id: 2, text: "Experience: proven engineering practice" },
    { id: 3, text: "Service: reliable support and distinct advantages" },
  ],
};

describe("CompanyShowcase", () => {
  it("renders configurable copy, background image, highlights and localized article link", () => {
    render(<CompanyShowcase locale="en" section={section} />);

    expect(screen.getByRole("heading", { name: "Ameson Packaging" })).toBeInTheDocument();
    expect(screen.getByText(section.subtitle)).toBeInTheDocument();
    expect(screen.getByText(section.description)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ameson office building" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ameson office building" })).toHaveClass("object-cover");
    expect(screen.getByTestId("company-showcase")).toHaveClass("w-screen");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Learn more/i })).toHaveAttribute("href", "/en/blog/about-ameson");
  });

  it("does not render a detail button when no article is configured", () => {
    const { container } = render(<CompanyShowcase locale="zh" section={{ ...section, article: null }} />);

    expect(within(container).queryByRole("link", { name: /Learn more/i })).not.toBeInTheDocument();
  });
});
