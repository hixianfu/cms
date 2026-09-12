import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const baseUrl = (process.env.STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api/contact-submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ data: body }),
    cache: "no-store",
  });
  const text = await response.text();
  let payload: unknown;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = { error: text }; }
  return NextResponse.json(payload, { status: response.status });
}
