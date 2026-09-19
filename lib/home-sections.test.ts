import { describe, expect, it } from "vitest";
import type { HomeSection } from "@/types/content";
import { splitHomeSections } from "./home-sections";

describe("splitHomeSections", () => {
  it("places hero sections before intro content without reordering other sections", () => {
    const products = { __component: "shared.home-products", title: "Products" } as HomeSection;
    const hero = { __component: "shared.home-hero", slides: [{ title: "Hero" }] } as HomeSection;
    const articles = { __component: "shared.home-articles", title: "Articles" } as HomeSection;

    expect(splitHomeSections([products, hero, articles])).toEqual({
      heroSections: [hero],
      contentSections: [products, articles],
    });
  });
});
