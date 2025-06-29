import { FreshContext, Handlers } from "$fresh/server.ts";
import { kv } from "@/libs/kv.ts";
import { LiveSessionManager } from "@/libs/live-sessions.ts";

export const handler: Handlers = {
  GET(_req: Request, _ctx: FreshContext) {
    const sessionManager = new LiveSessionManager(kv);

    // Track stream state
    let isClosed = false;

    // Create a Server-Sent Events response
    const stream = new ReadableStream({
      start(controller) {
        // Send initial data
        const sendUpdate = async () => {
          try {
            if (isClosed) return;

            const stats = await sessionManager.getLiveStats();
            const data = JSON.stringify({
              type: "stats_update",
              data: stats,
              timestamp: Date.now(),
            });

            // Double-check before enqueuing and wrap in try-catch
            if (!isClosed) {
              try {
                controller.enqueue(`data: ${data}\n\n`);
              } catch (enqueueError) {
                // Stream was closed after our check - mark as closed and stop
                isClosed = true;
                console.error("Stream closed during enqueue:", enqueueError);
              }
            }
          } catch (error) {
            console.error("Failed to send live update:", error);
            // Don't rethrow to avoid breaking the stream
          }
        };

        // Send initial update
        sendUpdate().catch(console.error);

        // Set up interval for periodic updates
        const interval = setInterval(() => {
          if (!isClosed) {
            sendUpdate().catch(console.error);
          }
        }, 10000); // Every 10 seconds

        // Clean up when the connection is closed
        return () => {
          isClosed = true;
          clearInterval(interval);
        };
      },
      cancel() {
        // Client disconnected - mark as closed
        isClosed = true;
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
