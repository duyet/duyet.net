import { FreshContext, Handlers } from "$fresh/server.ts";
import { kv } from "@/libs/kv.ts";
import { LiveSessionManager } from "@/libs/live-sessions.ts";

export const handler: Handlers = {
  GET(_req: Request, _ctx: FreshContext) {
    const sessionManager = new LiveSessionManager(kv);

    // Create a Server-Sent Events response
    const stream = new ReadableStream({
      start(controller) {
        // Send initial data
        const sendUpdate = async () => {
          try {
            const stats = await sessionManager.getLiveStats();
            const data = JSON.stringify({
              type: "stats_update",
              data: stats,
              timestamp: Date.now(),
            });

            controller.enqueue(`data: ${data}\n\n`);
          } catch (error) {
            console.error("Failed to send live update:", error);
          }
        };

        // Send initial update
        sendUpdate();

        // Set up interval for periodic updates
        const interval = setInterval(sendUpdate, 10000); // Every 10 seconds

        // Clean up when the connection is closed
        return () => {
          clearInterval(interval);
        };
      },
      cancel() {
        // Client disconnected
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      },
    });
  },
};
