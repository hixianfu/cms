import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HeroCarousel } from "./HeroCarousel";

const slides = [
  { title: "第一张", description: "第一张描述" },
  { title: "第二张", description: "第二张描述" },
];

describe("HeroCarousel", () => {
  it("supports button and keyboard controls", async () => {
    const user = userEvent.setup();
    render(<HeroCarousel slides={slides} locale="zh" />);

    expect(screen.getByRole("heading", { name: "第一张" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "下一张" }));
    expect(screen.getByRole("heading", { name: "第二张" })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("heading", { name: "第一张" })).toBeInTheDocument();
  });
});
