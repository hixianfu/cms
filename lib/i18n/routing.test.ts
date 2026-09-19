import { describe, expect, it } from "vitest";
import { isLocalizedHomePath } from "./routing";

describe("isLocalizedHomePath", () => {
  it.each([
    ["/zh", "zh", true],
    ["/zh/", "zh", true],
    ["/en", "en", true],
    ["/zh/products", "zh", false],
    ["/en/blog/article", "en", false],
  ])("matches only the localized homepage", (pathname, locale, expected) => {
    expect(isLocalizedHomePath(pathname, locale)).toBe(expected);
  });
});
