import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PartnersShowcase } from "./PartnersShowcase";

const section = {
  title: "Our partners",
  partners: [
    { id: 1, name: "Amazon", image: { url: "/uploads/amazon.png" }, href: "https://amazon.com", openInNewTab: true },
    { id: 2, name: "Google", image: { url: "/uploads/google.png", alternativeText: "Google partner" }, href: "/about", openInNewTab: false },
    { id: 3, name: "Toyota", image: { url: "/uploads/toyota.png" }, href: "https://toyota.com", openInNewTab: true },
    { id: 4, name: "Slack", image: { url: "/uploads/slack.png" }, href: "https://slack.com", openInNewTab: true },
    { id: 5, name: "Nikkei", image: { url: "/uploads/nikkei.png" }, href: "https://nikkei.com", openInNewTab: true },
    { id: 6, name: "OpenAI", image: { url: "/uploads/openai.png" }, href: "https://openai.com", openInNewTab: true },
  ],
};

describe("PartnersShowcase", () => {
  it("renders configured links in a five-column desktop grid", () => {
    const { container } = render(<PartnersShowcase locale="en" section={section} />);

    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Amazon" })).toHaveAttribute("href", "https://amazon.com");
    expect(screen.getByRole("link", { name: "Amazon" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Google partner" })).toHaveAttribute("href", "/en/about");
    expect(container.querySelector(".lg\\:grid-cols-5")).toBeInTheDocument();
  });

  it("dims the other partners while one partner is hovered", async () => {
    const user = userEvent.setup();
    const { container } = render(<PartnersShowcase locale="zh" section={section} />);
    const amazon = within(container).getByRole("link", { name: "Amazon" });
    const google = within(container).getByRole("link", { name: "Google partner" });

    await user.hover(amazon);

    expect(amazon).toHaveClass("scale-[1.04]", "opacity-100");
    expect(google).toHaveClass("grayscale", "opacity-30");

    await user.unhover(amazon);
    expect(google).not.toHaveClass("grayscale", "opacity-30");
  });
});
