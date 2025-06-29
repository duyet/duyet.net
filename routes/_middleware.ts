import { FreshContext } from "$fresh/server.ts";
import { kv } from "@/libs/kv.ts";
import { generateSessionId, LiveSessionManager } from "@/libs/live-sessions.ts";
import {
  detectUserType,
  getDeviceInfo,
  getLocationFromRequest,
} from "@/libs/user-detector.ts";

const SESSION_COOKIE_NAME = "duyet_session_id";
const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes

export async function handler(req: Request, ctx: FreshContext) {
  const url = new URL(req.url);

  // Skip tracking for API routes and assets
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_fresh/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.includes(".")
  ) {
    return await ctx.next();
  }

  // Get or create session ID
  const cookies = req.headers.get("cookie") || "";
  const sessionCookie = cookies.split(";")
    .find((c) => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`));

  let sessionId = sessionCookie?.split("=")[1]?.trim();
  let isNewSession = false;

  if (!sessionId) {
    sessionId = generateSessionId();
    isNewSession = true;
  }

  const sessionManager = new LiveSessionManager(kv);
  const userAgent = req.headers.get("user-agent") || "";

  try {
    if (isNewSession) {
      // Create new session
      await sessionManager.createSession({
        id: sessionId,
        timestamp: Date.now(),
        userType: detectUserType(userAgent),
        location: await getLocationFromRequest(req),
        device: getDeviceInfo(userAgent),
        pages: [url.pathname],
        lastActivity: Date.now(),
      });
    } else {
      // Update existing session activity
      await sessionManager.updateSessionActivity(sessionId, url.pathname);
    }
  } catch (error) {
    console.error("Failed to track session:", error);
  }

  // Continue with the request
  const response = await ctx.next();

  // Set session cookie if new
  if (isNewSession && response) {
    response.headers.set(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${
        SESSION_DURATION / 1000
      }; SameSite=Lax`,
    );
  }

  return response;
}
