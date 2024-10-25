import { FreshContext, Handlers, RouteConfig } from "$fresh/server.ts";
import { getStats } from "../../libs/get_stats.ts";

export const config: RouteConfig = {
  routeOverride: "/_stats",
};

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext) {
    const resp = await getStats();
    return new Response(JSON.stringify(resp));
  },
};
