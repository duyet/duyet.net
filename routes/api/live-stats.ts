import { FreshContext, Handlers } from "$fresh/server.ts";
import { kv } from "@/libs/kv.ts";
import { LiveSessionManager } from "@/libs/live-sessions.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext) {
    const sessionManager = new LiveSessionManager(kv);

    try {
      const stats = await sessionManager.getLiveStats();

      return new Response(JSON.stringify(stats), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Failed to get live stats:", error);

      const fallbackStats = {
        total: 0,
        byType: { human: 0, bot: 0, llm: 0 },
        byLocation: {},
        trend: [],
      };

      return new Response(JSON.stringify(fallbackStats), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
