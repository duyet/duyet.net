import { urls } from "./urls.ts";

export const getUrl = (slug: string): string => {
  return urls[slug] || urls["/"];
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
