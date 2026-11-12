import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFaqs, getGlobal, getHeaderMegaMenu, getProductPage, getVideos } from "./queries";
import { strapiFetch } from "./client";

vi.mock("./client", () => ({ strapiFetch: vi.fn() }));

beforeEach(() => { vi.mocked(strapiFetch).mockReset(); });

describe("product pagination", () => {
  it("sends page and page size together with filters and preserves the API count", async () => {
    const pagination = { page: 2, pageSize: 12, pageCount: 4, total: 41 };
    vi.mocked(strapiFetch).mockResolvedValue({ data: [{ id: 13, name: "气垫机", slug: "machine" }], meta: { pagination } });
    const result = await getProductPage("zh", "filters[category][slug][$in][0]=machines&filters[name][$containsi]=air", 2);
    const query = new URLSearchParams(vi.mocked(strapiFetch).mock.lastCall![0].split("?")[1]);
    expect(query.get("pagination[page]")).toBe("2");
    expect(query.get("pagination[pageSize]")).toBe("12");
    expect(query.get("pagination[withCount]")).toBe("true");
    expect(query.get("filters[contentLocale][$eq]")).toBe("zh");
    expect(query.get("filters[category][slug][$in][0]")).toBe("machines");
    expect(query.get("filters[name][$containsi]")).toBe("air");
    expect(query.get("sort")).toBe("sortOrder:asc,createdAt:desc,id:asc");
    expect(result.products).toHaveLength(1);
    expect(result.pagination).toEqual(pagination);
  });

  it.each([[0, 0, "1", "12"], [-1, 150, "1", "100"], [NaN, -1, "1", "12"]])("normalizes invalid page %s and pageSize %s", async (page, size, expectedPage, expectedSize) => {
    vi.mocked(strapiFetch).mockResolvedValue({ data: [], meta: { pagination: { page: 1, pageSize: 12, pageCount: 0, total: 0 } } });
    await getProductPage("en", "", page, size);
    const query = new URLSearchParams(vi.mocked(strapiFetch).mock.lastCall![0].split("?")[1]);
    expect(query.get("pagination[page]")).toBe(expectedPage);
    expect(query.get("pagination[pageSize]")).toBe(expectedSize);
  });
});

describe("managed video and FAQ categories", () => {
  it("loads categories directly without the removed global navigation fields", async () => {
    const category = { id: 1, name: "安装指导", slug: "installation" };
    vi.mocked(strapiFetch).mockImplementation(async (path) => ({
      data: path.startsWith("/api/video-categories?") ? [category] : [],
    }));
    const menu = await getHeaderMegaMenu("zh");
    expect(menu.videoCategories).toEqual([category]);
    expect(menu.videos).toEqual([]);
    const categoryPath = vi.mocked(strapiFetch).mock.calls.find(([path]) => path.startsWith("/api/video-categories?"))![0];
    expect(new URLSearchParams(categoryPath.split("?")[1]).get("filters[contentLocale][$eq]")).toBe("zh");
    expect(new URLSearchParams(categoryPath.split("?")[1]).get("sort")).toBe("sortOrder:asc,name:asc");
    await getGlobal("zh");
    const globalPath = vi.mocked(strapiFetch).mock.lastCall![0];
    expect(globalPath).not.toContain("videoCategories");
    expect(globalPath).not.toContain("faqCategories");
  });

  it("populates category relations without requesting relations as scalar fields or sorting FAQ by title", async () => {
    vi.mocked(strapiFetch).mockResolvedValue({ data: [] });
    await getHeaderMegaMenu("zh");
    const paths = vi.mocked(strapiFetch).mock.calls.map(([path]) => path);
    for (const collection of ["videos", "faqs"]) {
      const path = paths.find((value) => value.startsWith(`/api/${collection}?`))!;
      const params = new URLSearchParams(path.split("?")[1]);
      expect(params.get("populate[category][fields][0]")).toBe("name");
      expect(params.get("fields[2]")).toBeNull();
      if (collection === "faqs") {
        expect(params.get("fields[0]")).toBe("question");
        expect(params.get("sort")).not.toContain("title");
      }
    }
  });

  it("fetches categories for listings and filters by the related category slug", async () => {
    const category = { id: 1, name: "自定义分类", slug: "custom" };
    vi.mocked(strapiFetch).mockResolvedValue({ data: [{ id: 2, category }] });
    for (const getItems of [getVideos, getFaqs]) {
      const items = await getItems("zh", "filters[category][slug][$eq]=custom");
      expect(items[0].category).toEqual(category);
      const path = vi.mocked(strapiFetch).mock.lastCall![0];
      const params = new URLSearchParams(path.split("?")[1]);
      expect(params.get("populate[category]")).toBe("true");
      expect(params.get("filters[category][slug][$eq]")).toBe("custom");
    }
  });
});
