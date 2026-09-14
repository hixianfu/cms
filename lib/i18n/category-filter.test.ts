import { describe, expect, it } from "vitest";
import { categorySlugsWithChildren, findCategory, categoryFilterQuery } from "./category-filter";
describe("categorySlugsWithChildren", () => { it("includes descendant slugs", () => { expect(categorySlugsWithChildren({ slug: "mini-air", children: [{ slug: "pa-2", children: [] }] } as never)).toEqual(["mini-air", "pa-2"]); }); });
describe("findCategory", () => { it("finds nested child categories", () => { expect(findCategory([{ slug: "mini-air", children: [{ slug: "pa-2", children: [] }] }] as never, "pa-2")?.slug).toBe("pa-2"); }); });
describe("categoryFilterQuery", () => { it("uses indexed Strapi $in parameters", () => { expect(categoryFilterQuery(["mini-air", "pa-2"])).toBe("filters[category][slug][$in][0]=mini-air&filters[category][slug][$in][1]=pa-2"); }); });
