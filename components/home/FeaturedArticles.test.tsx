import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedArticles } from "./FeaturedArticles";

const articles = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: `Article ${index + 1}`,
  slug: `article-${index + 1}`,
}));

describe("FeaturedArticles", () => {
  it("shows at most three articles", () => {
    render(<FeaturedArticles locale="en" articles={articles} />);
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.queryByText("Article 4")).not.toBeInTheDocument();
  });

  it("shows a localized empty state", () => {
    render(<FeaturedArticles locale="en" articles={[]} />);
    expect(screen.getByText("No featured articles yet")).toBeInTheDocument();
  });
});
