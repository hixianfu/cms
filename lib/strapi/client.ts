type StrapiFetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | null;
  next?: { revalidate?: number; tags?: string[] };
  timeoutMs?: number;
};

const baseUrl = (process.env.STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
const defaultRevalidate = Number(process.env.STRAPI_REVALIDATE_SECONDS ?? 60);
const defaultTimeout = Number(process.env.STRAPI_FETCH_TIMEOUT_MS ?? 10000);

export class StrapiError extends Error {
  constructor(public readonly status: number, message: string, public readonly details?: unknown) {
    super(message);
    this.name = "StrapiError";
  }
}

export async function strapiFetch<T>(path: string, options: StrapiFetchOptions = {}): Promise<T> {
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? defaultTimeout);
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (process.env.STRAPI_API_TOKEN) headers.set("Authorization", `Bearer ${process.env.STRAPI_API_TOKEN}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
      next: options.next ?? { revalidate: defaultRevalidate },
    });
    const text = await response.text();
    let payload: unknown;
    try { payload = text ? JSON.parse(text) : undefined; } catch { payload = text; }
    if (!response.ok) {
      const message = typeof payload === "object" && payload && "error" in payload
        ? String((payload as { error?: { message?: string } }).error?.message ?? response.statusText)
        : response.statusText;
      throw new StrapiError(response.status, message, payload);
    }
    return payload as T;
  } catch (error) {
    if (error instanceof StrapiError) throw error;
    if (error instanceof Error && error.name === "AbortError") throw new StrapiError(408, "Strapi request timed out");
    throw new StrapiError(503, "Unable to reach Strapi", error);
  } finally {
    clearTimeout(timeout);
  }
}
