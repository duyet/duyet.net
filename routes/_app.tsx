import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { kv } from "@/libs/kv.ts";
import { LiveSessionManager, LiveStats } from "@/libs/live-sessions.ts";
import LiveUsersBadge from "@/islands/LiveUsersBadge.tsx";

interface AppData {
  liveStats: LiveStats;
}

export const handler: Handlers<AppData> = {
  async GET(_req: Request, ctx: FreshContext) {
    const sessionManager = new LiveSessionManager(kv);

    try {
      const liveStats = await sessionManager.getLiveStats();
      return ctx.render({ liveStats });
    } catch (error) {
      console.error("Failed to get live stats in app:", error);
      return ctx.render({
        liveStats: {
          total: 0,
          byType: { human: 0, bot: 0, llm: 0 },
          byLocation: {},
          trend: [],
        },
      });
    }
  },
};

export default function App({ Component, data }: PageProps<AppData>) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>duyet</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://cdn.seline.so/seline.js" async></script>
        <script src="https://j.duyet.net/p.js" async></script>
      </head>
      <body>
        <Component />
        <LiveUsersBadge
          initialStats={data?.liveStats ||
            {
              total: 0,
              byType: { human: 0, bot: 0, llm: 0 },
              byLocation: {},
              trend: [],
            }}
        />
      </body>
    </html>
  );
}
