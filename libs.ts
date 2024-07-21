import { urls } from "./urls.ts";

export const getUrl = (slug: string): string => {
  return urls[slug] || urls["/"];
};

export const getSlug = (url: string): string => {
  if (!url || url === "/" || url.startsWith("/?")) return "/";
  const parts = url.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  const lastPart = parts[parts.length - 1];
  return "/" + lastPart.split("?")[0];
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

    await kv.enqueue(payload);
  };
