import { describe, expect, it } from "vitest";
import { categorySlugsWithChildren, findCategory } from "./category-filter";
describe("categorySlugsWithChildren", () => { it("includes descendant slugs", () => { expect(categorySlugsWithChildren({ slug: "mini-air", children: [{ slug: "pa-2", children: [] }] } as never)).toEqual(["mini-air", "pa-2"]); }); });
describe("findCategory", () => { it("finds nested child categories", () => { expect(findCategory([{ slug: "mini-air", children: [{ slug: "pa-2", children: [] }] }] as never, "pa-2")?.slug).toBe("pa-2"); }); });
