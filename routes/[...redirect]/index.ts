import { FreshContext, Handlers } from "$fresh/server.ts";
import { db } from "../../libs/db.ts";
import { getLogger, getSlug, getUrl } from "@/libs/utils.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const logger = getLogger(req, ctx, db);
    const slug = getSlug(ctx.params.redirect);

    console.log("Got", slug);

    // Redirect to the target URL
    const url = getUrl(slug);
    await logger(slug, "==> redirecting to", url);

    // Forwards the parameters to the target URL
    const targetUrl = new URL(url);
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
