import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichTextRenderer } from "./RichTextRenderer";

describe("RichTextRenderer", () => {
  it("renders markdown headings instead of showing the markdown markers", () => {
    render(<RichTextRenderer blocks={[{ __component: "shared.rich-text", body: "## Probant\n\n正文内容" }]} />);
    expect(screen.getByRole("heading", { level: 2, name: "Probant" })).toBeInTheDocument();
    expect(screen.queryByText("## Probant")).not.toBeInTheDocument();
  });

  it("renders Strapi media and slider blocks without unsupported placeholders", () => {
    render(<RichTextRenderer blocks={[
      { __component: "shared.media", file: { url: "/uploads/one.jpg", alternativeText: "One" } },
      { __component: "shared.slider", files: [{ url: "/uploads/two.jpg", alternativeText: "Two" }] },
    ]} />);
    expect(screen.getByAltText("One")).toBeInTheDocument();
    expect(screen.getByAltText("Two")).toBeInTheDocument();
    expect(screen.queryByText("Unsupported content block")).not.toBeInTheDocument();
  });
});
