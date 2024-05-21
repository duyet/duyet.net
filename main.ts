function getUrl(slug: string): string {
  const urls: Record<string, string> = {
    "/": "https://blog.duyet.net",
    "/blog": "https://blog.duyet.net",
    "/about": "https://blog.duyet.net/about",
    "/i": "https://insights.duyet.net",
    "/clickhouse": "https://blog.duyet.net/tag/clickhouse",
    "/tiktok": "https://www.tiktok.com/@duyet.net",
    "/x": "https://x.com/_duyet",
  };

  return urls[slug] || urls["/"];
}

const kv = await Deno.openKv();

// Create a queue listener that will process enqueued messages
kv.listenQueue(async (msg) => {
  console.log(`[${msg.method}] [${msg.ip}]:`, ...msg.msg);
});

const getLogger =
  (req: Request, conn: Deno.ServeHandlerInfo) => async (...msg: string) => {
    const method = req.method;
    const ip = conn.remoteAddr.hostname;

    const payload = {
      method,
      ip,
      msg,
    };

    await kv.enqueue(payload);

    console.log(...msg);
  };

Deno.serve(async (req: Request, conn: Deno.ServeHandlerInfo) => {
  const logger = getLogger(req, conn);

  const slug = "/" + (req.url.split("/").pop() || "");
  const url = getUrl(slug);

  await logger(slug, "==> redirecting to", url);

  return Response.redirect(url, 301);
});
