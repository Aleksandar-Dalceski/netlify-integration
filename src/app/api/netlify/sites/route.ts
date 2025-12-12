import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.NETLIFY_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing NETLIFY_TOKEN" },
      { status: 500 }
    );
  }

  const res = await fetch("https://api.netlify.com/api/v1/sites", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
