import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoCard } from "./VideoCard";

describe("video listing", () => {
  it("renders a 16:9 media region, centered accessible play control, category badge, and localized route", () => {
    render(
      <VideoCard
        locale="en"
        video={{
          id: 1,
          slug: "machine-introduction",
          title: "Machine introduction",
          description: "See the machine in action.",
          category: "introduction",
          cover: { url: "/video.jpg", alternativeText: "Machine" },
        }}
      />,
    );

    const article = screen.getByRole("article");
    expect(screen.getByRole("link", { name: /Machine introduction/ })).toHaveAttribute(
      "href",
      "/en/videos/machine-introduction",
    );
    expect(screen.getByRole("img", { name: "Machine" })).toBeInTheDocument();
    expect(within(article).getByText("Product introduction")).toBeInTheDocument();
    expect(within(article).getByRole("button", { name: "Watch video" })).toBeInTheDocument();
    expect(within(article).getByRole("button", { name: "Watch video" })).toHaveClass(
      "absolute",
      "left-1/2",
      "top-1/2",
    );
    expect(within(article).getByText("See the machine in action.")).toBeInTheDocument();
    expect(screen.getByTestId("video-card-media")).toHaveClass("aspect-video");
  });

  it("uses the shared missing-media placeholder while preserving the play label", () => {
    render(
      <VideoCard
        locale="zh"
        video={{ id: 2, slug: "notice", title: "Notice", category: "company" }}
      />,
    );

    expect(screen.getByRole("link", { name: /Notice/ })).toHaveAttribute(
      "href",
      "/zh/videos/notice",
    );
    expect(screen.getByTestId("listing-media-placeholder")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "观看视频" })).toBeInTheDocument();
  });
});
