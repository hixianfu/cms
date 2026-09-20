import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedArticles } from "./FeaturedArticles";

const articles = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: `Article ${index + 1}`,
  slug: `article-${index + 1}`,
}));

describe("FeaturedArticles", () => {
  it("keeps every configured article available in the carousel", () => {
    render(<FeaturedArticles locale="en" articles={articles} />);
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(screen.getByText("Article 5")).toBeInTheDocument();
  });

  it("does not render when there are no articles", () => {
    const { container } = render(<FeaturedArticles locale="en" articles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
