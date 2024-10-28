import type { FreshContext } from "$fresh/server.ts";
import { urls } from "../urls.ts";

export const getUrl = (slug: string): string => {
  return urls[slug] || urls["/"];
};

export const getSlug = (url: string): string => {
  try {
    const normalizedUrl = ("" + url).replace(/^\/+/, ""); // Remove leading slashe
    const parsedUrl = new URL(normalizedUrl, "http://localhost"); // Use localhost as the base for relative URLs
    const pathname = parsedUrl.pathname;
    // Return the pathname, ensuring it starts with a single slash and handles empty paths correctly
    return pathname === "/" ? "/" : pathname.replace(/\/+$/, ""); // Return "/" for empty path
  } catch {
    return "/"; // Return root if URL parsing fails
  }
};

export const getLogger =
  (req: Request, ctx: FreshContext, kv: Deno.Kv) =>
  async (
    ...msg: string[]
  ) => {
    const method = req.method;
    const ip = ctx.remoteAddr.hostname || "";
    const ua = req.headers.get("user-agent");

    const payload = {
      method,
      ip,
      ua,
      msg,
    };

    if (isBot(ua)) {
      console.log("Bot detected, skip logging to ClickHouse", ua);
      return;
    }

    console.log("Enqueue", payload);
    await kv.enqueue(payload);
  };

export const isBot = (ua?: string | null): boolean => {
  const pattern = /bot|crawl|http|lighthouse|scan|search|spider|upptime/i;

  return Boolean(ua) && pattern.test(ua || "");
};
