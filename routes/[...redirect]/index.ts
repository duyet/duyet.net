import { FreshContext, Handlers } from "$fresh/server.ts";

import { kv } from "@/libs/kv.ts";
import { getLogger, getSlug, getTargetUrl } from "@/libs/utils.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const logger = getLogger(req, ctx, kv);
    const slug = getSlug(ctx.params.redirect);

    // Redirect to the target URL
    const target = getTargetUrl(slug);
    await logger(slug, "==> redirecting to", target);

    // Forwards the parameters to the target URL
    const targetUrl = new URL(target);
    const params = new URL(req.url).searchParams;
    for (const [key, value] of params) {
      targetUrl.searchParams.append(key, value);
    }

    return new Response("", {
      status: 301,
      headers: {
        "Location": targetUrl.toString(),
        "Cache-Control": "no-store",
      },
    });
  },
};
