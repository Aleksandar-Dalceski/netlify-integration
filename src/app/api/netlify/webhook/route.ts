import { NextResponse } from "next/server";

type DeployEvent = {
  receivedAt: string;
  payload: any;
};

declare global {
  // eslint-disable-next-line no-var
  var __deployEvents: DeployEvent[] | undefined;
}

function getStore() {
  if (!global.__deployEvents) global.__deployEvents = [];
  return global.__deployEvents;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();

  const store = getStore();
  store.unshift({ receivedAt: new Date().toISOString(), payload });
  store.splice(50); // чувај последни 50

  return NextResponse.json({ received: true });
}
