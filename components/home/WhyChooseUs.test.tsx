import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhyChooseUs } from "./WhyChooseUs";

const section = {
  title: "Why choose us?",
  subtitle: "Complete service capabilities for customers around the world.",
  image: { url: "/uploads/why-us.jpg", alternativeText: "Packaging automation team" },
  advantages: [
    { id: 1, title: "Complete product range", description: "One-stop packaging solutions.", icon: { url: "/uploads/products.svg", alternativeText: "Product cube" } },
    { id: 2, title: "Lifecycle support", description: "Reliable technical support.", icon: { url: "/uploads/support.svg", alternativeText: "Support agent" } },
    { id: 3, title: "Fair pricing", description: "Clear and sustainable pricing.", icon: { url: "/uploads/pricing.svg", alternativeText: "Pricing" } },
    { id: 4, title: "Long-term partnership", description: "Trusted customer relationships.", icon: { url: "/uploads/partner.svg", alternativeText: "Handshake" } },
  ],
};

describe("WhyChooseUs", () => {
  it("renders the configured image, copy and four advantages", () => {
    render(<WhyChooseUs section={section} />);

    expect(screen.getByRole("heading", { name: "Why choose us?" })).toBeInTheDocument();
    expect(screen.getByText(section.subtitle)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Packaging automation team" })).toHaveClass("object-cover");
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Lifecycle support" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Handshake" })).toHaveClass("object-contain");
  });
});
