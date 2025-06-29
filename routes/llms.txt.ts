import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext) {
    try {
      const llmsContent = await Deno.readTextFile("./llms.txt");
      return new Response(llmsContent, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (_error) {
      return new Response("llms.txt not found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }
  },
};
