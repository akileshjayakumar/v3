import { NextResponse } from "next/server";

// POST issues a token request for Ably Realtime. This route runs on Vercel
// and keeps the API key secret server-side.
// Lightweight capability check that avoids importing heavy SDKs
export async function GET() {
  const enabled = Boolean(process.env.ABLY_API_KEY);
  return NextResponse.json({ enabled });
}

export async function POST() {
  const key = process.env.ABLY_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "ABLY_API_KEY not configured" },
      { status: 503 }
    );
  }
  const { default: Ably } = await import("ably");
  const rest = new Ably.Rest(key);
  // Restrict token to 1 minute and only subscribe/publish on cursors channels
  const tokenRequest = await rest.auth.createTokenRequest({
    ttl: 60 * 1000,
    capability: { "cursors:*": ["publish", "subscribe", "presence"] },
  });
  return NextResponse.json(tokenRequest);
}
