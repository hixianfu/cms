import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ArticleCategoryShowcase } from "./ArticleCategoryShowcase";

const article = (id: number, title: string) => ({
  id,
  title,
  slug: `article-${id}`,
  description: `${title} description`,
  cover: { url: `/uploads/article-${id}.jpg`, alternativeText: `${title} cover` },
  author: { name: "Ameson Editor" },
  publishedAt: "2026-09-20T00:00:00.000Z",
});

const section = {
  title: "News & insights",
  groups: [
    {
      id: 1,
      label: "Company news",
      category: { id: 11, name: "News", slug: "news" },
      articles: [article(1, "Main company story"), article(2, "Company story two"), article(3, "Company story three"), article(4, "Company story four"), article(5, "Hidden fifth story")],
    },
    {
      id: 2,
      category: { id: 12, name: "Industry insights", slug: "insights" },
      articles: [article(6, "Industry main story"), article(7, "Industry story two")],
    },
  ],
};

describe("ArticleCategoryShowcase", () => {
  it("shows one primary and three secondary configured articles, then switches category", async () => {
    const user = userEvent.setup();
    render(<ArticleCategoryShowcase locale="en" section={section} />);

    expect(screen.getByRole("heading", { name: "News & insights" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(within(screen.getByTestId("primary-article")).getByRole("heading", { name: "Main company story" })).toBeInTheDocument();
    expect(screen.getAllByText("Ameson Editor")).toHaveLength(4);
    expect(screen.queryByText("Hidden fifth story")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Industry insights" }));

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(within(screen.getByTestId("primary-article")).getByRole("heading", { name: "Industry main story" })).toBeInTheDocument();
    expect(screen.queryByText("Main company story")).not.toBeInTheDocument();
  });

  it("does not render without configured category groups", () => {
    const { container } = render(<ArticleCategoryShowcase locale="zh" section={{ title: "新闻资讯", groups: [] }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
