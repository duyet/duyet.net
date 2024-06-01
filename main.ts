import { UserAgent } from "https://deno.land/std@0.224.0/http/user_agent.ts";

import { urls } from "./urls.ts";

function getUrl(slug: string): string {
  return urls[slug] || urls["/"];
}

const kv = await Deno.openKv();

const getClickHouse = () => {
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
    url: Deno.env.get("CLICKHOUSE_URL"),
    headers: {
      "X-ClickHouse-User": Deno.env.get("CLICKHOUSE_USER"),
      "X-ClickHouse-Key": Deno.env.get("CLICKHOUSE_PASSWORD"),
    },
  };
};

// Create a queue listener that will process enqueued messages
kv.listenQueue(async (msg) => {
  console.log(`[${msg.method}] [${msg.ip}]:`, ...msg.msg);

  const ua = new UserAgent(msg.ua);

  const source = msg.msg[0];
  const target = msg.msg[2];

  const clickhouse = getClickHouse();
  const resp = await fetch(clickhouse.url, {
    method: "POST",
    headers: clickhouse.headers,
    body:
      `INSERT INTO duyet_analytics.duyet_redirect (source, target, ip, user_agent, browser, os_name, os_version, device_type)
           VALUES ('${source}', '${target}', '${msg.ip}', '${msg.ua}', '${ua.browser.name}', '${ua.os.name}', '${ua.os.version}', '${ua.device.type}')`,
  });

  console.log("Clickhouse response:", await resp.text());
});

const getLogger =
  (req: Request, conn: Deno.ServeHandlerInfo) => async (...msg: string) => {
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

Deno.serve(async (req: Request, conn: Deno.ServeHandlerInfo) => {
  const logger = getLogger(req, conn);

  const slug = "/" + (req.url.split("/").pop() || "");

  if (slug === "/ping") {
    return new Response("pong");
  }

  if (slug === "/favicon.ico") {
    return new Response(null, { status: 404 });
  }

  // Redirect to the target URL
  const url = getUrl(slug);
  await logger(req.url, "==> redirecting to", url);

  return Response.redirect(url, 301);
});
