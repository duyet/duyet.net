import { useEffect, useState } from "preact/hooks";
import { LiveStats } from "@/libs/live-sessions.ts";

interface LiveUpdatesProps {
  initialStats?: LiveStats;
  onUpdate?: (stats: LiveStats) => void;
}

const defaultStats: LiveStats = {
  total: 0,
  byType: { human: 0, bot: 0, llm: 0 },
  byLocation: {},
  trend: [],
};

export default function LiveUpdates(
  { initialStats = defaultStats, onUpdate }: LiveUpdatesProps,
) {
  const [stats, setStats] = useState<LiveStats>(initialStats);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: number | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource("/api/live-updates");

        eventSource.onopen = () => {
          setConnected(true);
          setError(null);
          console.log("Live updates connected");
        };

        eventSource.onmessage = (event) => {
          try {
            const update = JSON.parse(event.data);
            if (update.type === "stats_update" && update.data) {
              setStats(update.data);
              onUpdate?.(update.data);
            }
          } catch (err) {
            console.error("Failed to parse live update:", err);
          }
        };

        eventSource.onerror = (err) => {
          console.error("Live updates error:", err);
          setConnected(false);
          setError("Connection error");

          // Attempt to reconnect after 5 seconds
          if (eventSource?.readyState === EventSource.CLOSED) {
            reconnectTimeout = setTimeout(connect, 5000);
          }
        };
      } catch (err) {
        console.error("Failed to create EventSource:", err);
        setError("Failed to connect");
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [onUpdate]);

  // This component doesn't render anything visible,
  // it just manages the live updates in the background
  return (
    <div className="hidden">
      {/* Optional: Debug info */}
      {globalThis.location?.hostname === "localhost" && (
        <div className="fixed top-4 left-4 bg-black text-white text-xs p-2 rounded opacity-50">
          Live: {connected ? "🟢" : "🔴"}
          {error && ` (${error})`}
          <br />
          Total: {stats.total}
        </div>
      )}
    </div>
  );
}
