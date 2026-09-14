import { describe, expect, it } from "vitest";
import { categorySlugsWithChildren } from "./category-filter";
describe("categorySlugsWithChildren", () => { it("includes descendant slugs", () => { expect(categorySlugsWithChildren({ slug: "mini-air", children: [{ slug: "pa-2", children: [] }] } as never)).toEqual(["mini-air", "pa-2"]); }); });
