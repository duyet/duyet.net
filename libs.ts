import { urls } from "./urls.ts";

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

export const getClickHouse = (): {
  url: string;
  headers: Record<string, string>;
} => {
  if (
    !Deno.env.get("CLICKHOUSE_URL") ||
    !Deno.env.get("CLICKHOUSE_USER") ||
    !Deno.env.get("CLICKHOUSE_PASSWORD")
  ) {
    throw new Error(
      "Missing CLICKHOUSE_URL, CLICKHOUSE_USER or CLICKHOUSE_PASSWORD",
    );
  }

  return {
    url: Deno.env.get("CLICKHOUSE_URL")!,
    headers: {
      "X-ClickHouse-User": Deno.env.get("CLICKHOUSE_USER")!,
      "X-ClickHouse-Key": Deno.env.get("CLICKHOUSE_PASSWORD")!,
    },
  };
};

export const getStats = async () => {
  const clickhouse = getClickHouse();

  const resp = await fetch(clickhouse.url, {
    method: "POST",
    headers: clickhouse.headers,
    body: `SELECT
               source,
               count()
           FROM duyet_analytics.duyet_redirect
           GROUP BY 1
           ORDER BY 2 DESC
           LIMIT 50
           Format JSON`,
  });

  const text = await resp.text();
  return JSON.parse(text);
};

export const getLogger =
  (req: Request, conn: Deno.ServeHandlerInfo, kv: Deno.Kv) =>
  async (...msg: string[]) => {
    const method = req.method;
    const ip = conn.remoteAddr.hostname;
    const ua = req.headers.get("user-agent");

    const payload = {
      method,
      ip,
      ua,
      msg,
    };

    console.log(payload);

    if (isBot(ua)) {
      console.log("Bot detected, skip logging to ClickHouse", ua);
      return;
    }

    console.log("Enqueue", payload);
    await kv.enqueue(payload);
  };

export const isBot = (ua?: string | null): boolean => {
  const pattern = /bot|crawl|http|lighthouse|scan|search|spider/i;

  return Boolean(ua) && pattern.test(ua || "");
};
