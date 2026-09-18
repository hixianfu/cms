import { describe, expect, it } from "vitest";
import { featureCardHref } from "./home-feature-links";

describe("featureCardHref", () => {
  it("builds localized links for every supported content target", () => {
    expect(featureCardHref("zh", "product", "air-machine")).toBe("/zh/products/air-machine");
    expect(featureCardHref("en", "article", "packing-guide")).toBe("/en/blog/packing-guide");
    expect(featureCardHref("zh", "solution", "retail")).toBe("/zh/solutions/retail");
    expect(featureCardHref("en", "scenario", "warehouse")).toBe("/en/scenarios/warehouse");
    expect(featureCardHref("zh", "case", "factory")).toBe("/zh/cases/factory");
  });
});
