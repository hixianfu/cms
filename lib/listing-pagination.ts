export type Pagination = { page: number; pageSize: number; pageCount: number; total: number };

export function parsePage(value: unknown): number {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function listingPageHref(path: string, page: number, filters: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  return params.size ? `${path}?${params.toString()}` : path;
}
