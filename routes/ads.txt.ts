import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req: Request, _ctx: FreshContext) {
    return new Response(
      "google.com, pub-4044047400859099, DIRECT, f08c47fec0942fa0",
    );
  },
};
