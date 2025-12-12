import { NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var __deployEvents: { receivedAt: string; payload: any }[] | undefined;
}

export async function GET() {
  const events = global.__deployEvents ?? [];
  return NextResponse.json(events);
}
