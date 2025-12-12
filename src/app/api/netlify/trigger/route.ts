import { NextResponse } from "next/server";

export async function POST() {
  const hook = process.env.NETLIFY_BUILD_HOOK_URL;

  if (!hook) {
    return NextResponse.json(
      { error: "Missing NETLIFY_BUILD_HOOK_URL" },
      { status: 500 }
    );
  }

  const res = await fetch(hook, { method: "POST" });

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json(
      { error: "Hook trigger failed", details: body },
      { status: res.status }
    );
  }

  return NextResponse.json({ ok: true });
}
