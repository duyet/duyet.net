import { UserAgent } from "./deps.ts";
import { getClickHouse, getLogger, getSlug, getUrl } from "./libs.ts";
import { urls } from "./urls.ts";

export const initKv = async (path?: string) => {
  const kv = await Deno.openKv(path);

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

  return kv;
};

export const handler =
  (kv: Deno.Kv) => async (req: Request, conn: Deno.ServeHandlerInfo) => {
    const logger = getLogger(req, conn, kv);
    const slug = getSlug(req.url);

    if (slug === "/ping" || slug === "/health") {
      return new Response("pong");
    }

    if (slug === "/favicon.ico") {
      return new Response(null, { status: 404 });
    }

    if (slug === "/_ls") {
      return new Response(JSON.stringify(urls));
    }

    // Redirect to the target URL
    const url = getUrl(slug);
    await logger(req.url, "==> redirecting to", url);

    // Forwards the parameters to the target URL
    const targetUrl = new URL(url);
    const params = new URL(req.url).searchParams;
    for (const [key, value] of params) {
      targetUrl.searchParams.append(key, value);
    }

    return Response.redirect(targetUrl, 301);
  };

Deno.serve(handler(await initKv()));
