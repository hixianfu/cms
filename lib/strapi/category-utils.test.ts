import { describe, expect, it } from "vitest";
import { topLevelCategories } from "./category-utils";

describe("topLevelCategories", () => {
  it("removes child categories while preserving children nested under parents", () => {
    const parent = { id: 1, name: "MINI AIR", slug: "mini-air", parent: null, children: [{ id: 2, name: "PA2", slug: "pa-2", parent: { id: 1 } }] } as never;
    const child = { id: 2, name: "PA2", slug: "pa-2", parent: { id: 1 } } as never;
    expect(topLevelCategories([parent, child])).toEqual([parent]);
  });
});
