import { FreshContext, Handlers, RouteConfig } from "$fresh/server.ts";
import { urls } from "../urls.ts";

export const config: RouteConfig = {
  routeOverride: "/_ls",
};

export const handler: Handlers = {
  GET(_req: Request, _ctx: FreshContext) {
    return new Response(JSON.stringify(urls));
  },
};
