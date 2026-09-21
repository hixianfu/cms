import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleListingCard } from "./ArticleListingCard";

describe("ArticleListingCard", () => {
  it("renders formatted article metadata and a localized detail URL", () => {
    render(
      <ArticleListingCard
        locale="en"
        article={{
          id: 1,
          slug: "packing-insights",
          title: "Packing insights",
          description: "A practical field guide.",
          publishedAt: "2026-09-20T00:00:00.000Z",
          category: { id: 2, slug: "company-news", name: "News" },
          cover: { url: "/article.jpg", alternativeText: "Packing line" },
        }}
      />,
    );

    expect(screen.getByRole("link", { name: /Packing insights/ })).toHaveAttribute(
      "href",
      "/en/blog/packing-insights",
    );
    expect(screen.getByRole("img", { name: "Packing line" })).toBeInTheDocument();
    expect(screen.getByText("Company News")).toBeInTheDocument();
    expect(screen.getByText("Sep 20, 2026")).toBeInTheDocument();
    expect(screen.getByText("A practical field guide.")).toBeInTheDocument();
    expect(screen.getByText("Read article")).toBeInTheDocument();
  });

  it("renders featured treatment and a stable missing-media fallback", () => {
    const { container } = render(
      <ArticleListingCard
        locale="zh"
        featured
        article={{ id: 3, slug: "notice", title: "Notice" }}
      />,
    );

    const card = within(container);
    expect(card.getByRole("article")).toHaveAttribute("data-featured", "true");
    expect(card.getByRole("link", { name: /Notice/ })).toHaveClass(
      "md:grid",
      "md:grid-cols-2",
    );
    expect(card.getByRole("link", { name: /Notice/ })).toHaveAttribute(
      "href",
      "/zh/blog/notice",
    );
    expect(card.getByText("最新文章")).toBeInTheDocument();
    expect(card.getByTestId("listing-media-placeholder").parentElement).toHaveClass(
      "aspect-video",
    );
  });
});
