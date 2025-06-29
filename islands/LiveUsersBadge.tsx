import { useState } from "preact/hooks";
import { LiveStats } from "@/libs/live-sessions.ts";
import LiveUpdates from "@/islands/LiveUpdates.tsx";

interface LiveUsersBadgeProps {
  initialStats: LiveStats;
}

export default function LiveUsersBadge({ initialStats }: LiveUsersBadgeProps) {
  const [stats, setStats] = useState<LiveStats>(initialStats);

  return (
    <>
      <LiveUpdates
        initialStats={initialStats}
        onUpdate={setStats}
      />
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/live"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 shadow-lg flex items-center gap-2 text-sm group hover:shadow-xl transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              stats.total > 0 ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          >
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {stats.total} live
          </span>

          {/* Tooltip on hover */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
              <div className="text-center mb-1 font-medium">Live Visitors</div>
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span>👤 Humans:</span>
                  <span>{stats.byType.human}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>🤖 Bots:</span>
                  <span>{stats.byType.bot}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>🧠 LLMs:</span>
                  <span>{stats.byType.llm}</span>
                </div>
              </div>
              <div className="text-center mt-2 text-blue-300 text-xs">
                Click to view details
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="border-4 border-transparent border-t-gray-900">
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </>
  );
}
