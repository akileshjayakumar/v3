import { NextResponse } from "next/server";
import Ably from "ably";

// POST issues a token request for Ably Realtime. This route runs on Vercel
// and keeps the API key secret server-side.
export async function POST() {
  const key = process.env.ABLY_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "ABLY_API_KEY not configured" },
      { status: 503 }
    );
  }
  const rest = new Ably.Rest(key);
  // Restrict token to 1 minute and only subscribe/publish on cursors channels
  const tokenRequest = await rest.auth.createTokenRequest({
    ttl: 60 * 1000,
    capability: { "cursors:*": ["publish", "subscribe", "presence"] },
  });
  return NextResponse.json(tokenRequest);
}
