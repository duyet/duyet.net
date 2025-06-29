import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { kv } from "@/libs/kv.ts";
import {
  LiveSession,
  LiveSessionManager,
  LiveStats,
} from "@/libs/live-sessions.ts";

interface LivePageData {
  stats: LiveStats;
  sessions: LiveSession[];
}

export const handler: Handlers<LivePageData> = {
  async GET(_req: Request, ctx: FreshContext) {
    const sessionManager = new LiveSessionManager(kv);

    try {
      const [stats, sessions] = await Promise.all([
        sessionManager.getLiveStats(),
        sessionManager.getAllSessions(),
      ]);

      return ctx.render({ stats, sessions });
    } catch (error) {
      console.error("Failed to get live data:", error);
      return ctx.render({
        stats: {
          total: 0,
          byType: { human: 0, bot: 0, llm: 0 },
          byLocation: {},
          trend: [],
        },
        sessions: [],
      });
    }
  },
};

export default function LivePage({ data }: PageProps<LivePageData>) {
  const { stats, sessions } = data;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLocationDisplay = (session: LiveSession) => {
    const { location } = session;
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }
    if (location.country) {
      return location.country;
    }
    return "Unknown";
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "human":
        return "👤";
      case "bot":
        return "🤖";
      case "llm":
        return "🧠";
      default:
        return "❓";
    }
  };

  const getUserTypeBadge = (type: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (type) {
      case "human":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "bot":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "llm":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div class="min-h-screen bg-gray-50 py-6 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Live Visitors</h1>
          <p class="text-gray-600">
            Real-time analytics of current website visitors
          </p>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3">
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Live</p>
                <p class="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <span class="text-2xl mr-3">👤</span>
              <div>
                <p class="text-sm font-medium text-gray-600">Humans</p>
                <p class="text-2xl font-bold text-green-600">
                  {stats.byType.human}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🤖</span>
              <div>
                <p class="text-sm font-medium text-gray-600">Bots</p>
                <p class="text-2xl font-bold text-blue-600">
                  {stats.byType.bot}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🧠</span>
              <div>
                <p class="text-sm font-medium text-gray-600">LLMs</p>
                <p class="text-2xl font-bold text-purple-600">
                  {stats.byType.llm}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Distribution */}
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Locations</h2>
            </div>
            <div class="p-6">
              {Object.keys(stats.byLocation).length > 0
                ? (
                  <div class="space-y-3">
                    {Object.entries(stats.byLocation)
                      .sort(([, a], [, b]) => b - a)
                      .map(([country, count]) => (
                        <div
                          key={country}
                          class="flex justify-between items-center"
                        >
                          <span class="text-sm text-gray-600">{country}</span>
                          <div class="flex items-center">
                            <div class="w-16 bg-gray-200 rounded-full h-2 mr-3">
                              <div
                                class="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${(count / stats.total) * 100}%`,
                                }}
                              >
                              </div>
                            </div>
                            <span class="text-sm font-semibold text-gray-900 min-w-[2rem]">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )
                : (
                  <p class="text-gray-500 text-center py-4">
                    No location data available
                  </p>
                )}
            </div>
          </div>

          {/* Recent Activity Trend */}
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">
                Activity Trend
              </h2>
            </div>
            <div class="p-6">
              {stats.trend.length > 0
                ? (
                  <div class="space-y-2">
                    {stats.trend.slice(-6).map((point, index) => (
                      <div
                        key={index}
                        class="flex justify-between items-center text-sm"
                      >
                        <span class="text-gray-600">
                          {formatTime(point.timestamp)}
                        </span>
                        <span class="font-semibold text-gray-900">
                          {point.count} visitors
                        </span>
                      </div>
                    ))}
                  </div>
                )
                : (
                  <p class="text-gray-500 text-center py-4">
                    No trend data available
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Live Sessions Table */}
        <div class="mt-8 bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">
              Current Sessions
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pages
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {sessions.length > 0
                  ? sessions.map((session) => (
                    <tr key={session.id}>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class={getUserTypeBadge(session.userType)}>
                          {getUserTypeIcon(session.userType)} {session.userType}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getLocationDisplay(session)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>
                            {session.device.os} - {session.device.browser}
                          </div>
                          <div class="text-xs text-gray-500">
                            {session.device.deviceType}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-900">
                        <div class="max-w-xs">
                          {session.pages.slice(0, 3).map((page, idx) => (
                            <span
                              key={idx}
                              class="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1 mb-1"
                            >
                              {page}
                            </span>
                          ))}
                          {session.pages.length > 3 && (
                            <span class="text-xs text-gray-500">
                              +{session.pages.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(session.lastActivity)}
                      </td>
                    </tr>
                  ))
                  : (
                    <tr>
                      <td
                        colSpan={5}
                        class="px-6 py-12 text-center text-gray-500"
                      >
                        No active sessions
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Explanation */}
        <div class="mt-8 bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <span class="text-xl mr-2">⚙️</span>
              How It Works
            </h2>
          </div>
          <div class="p-6">
            <div class="prose prose-sm max-w-none text-gray-600">
              <p class="mb-4">
                This real-time analytics system tracks website visitors using
                modern web technologies and provides privacy-compliant insights
                without storing personal information.
              </p>

              <h3 class="text-base font-semibold text-gray-900 mb-2">
                Technical Architecture
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">
                    🔧 Storage & Performance
                  </h4>
                  <ul class="space-y-1 text-sm">
                    <li>
                      <strong>Deno KV:</strong>{" "}
                      Edge-distributed key-value database
                    </li>
                    <li>
                      <strong>TTL:</strong>{" "}
                      5-minute session expiration for accurate counts
                    </li>
                    <li>
                      <strong>Atomic Operations:</strong>{" "}
                      Consistent counters with race condition protection
                    </li>
                    <li>
                      <strong>Background Cleanup:</strong>{" "}
                      Automatic expired session removal
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 mb-2">
                    🔄 Real-time Updates
                  </h4>
                  <ul class="space-y-1 text-sm">
                    <li>
                      <strong>Server-Sent Events:</strong>{" "}
                      Live data streaming to browsers
                    </li>
                    <li>
                      <strong>10-second intervals:</strong>{" "}
                      Balanced between accuracy and performance
                    </li>
                    <li>
                      <strong>Auto-reconnection:</strong>{" "}
                      Resilient connection handling
                    </li>
                    <li>
                      <strong>Middleware tracking:</strong>{" "}
                      Seamless session management
                    </li>
                  </ul>
                </div>
              </div>

              <h3 class="text-base font-semibold text-gray-900 mb-2">
                User Classification
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div class="font-medium text-green-700 mb-1">👤 Humans</div>
                    <p>
                      Real visitors using browsers with typical user-agent
                      patterns and JavaScript capabilities.
                    </p>
                  </div>
                  <div>
                    <div class="font-medium text-blue-700 mb-1">🤖 Bots</div>
                    <p>
                      Search crawlers, monitoring tools, API clients, and
                      automated browsers.
                    </p>
                  </div>
                  <div>
                    <div class="font-medium text-purple-700 mb-1">🧠 LLMs</div>
                    <p>
                      AI language models like GPTBot, ClaudeBot, PerplexityBot,
                      and other LLM crawlers.
                    </p>
                  </div>
                </div>
              </div>

              <h3 class="text-base font-semibold text-gray-900 mb-2">
                Privacy & Data
              </h3>
              <div class="bg-blue-50 rounded-lg p-4 mb-4">
                <ul class="space-y-1 text-sm">
                  <li>
                    ✅ <strong>No personal data:</strong>{" "}
                    Only aggregate anonymous metrics
                  </li>
                  <li>
                    ✅ <strong>Location headers only:</strong>{" "}
                    Country/region from CDN headers (no IP storage)
                  </li>
                  <li>
                    ✅ <strong>GDPR compliant:</strong>{" "}
                    No tracking cookies, session-based identification
                  </li>
                  <li>
                    ✅ <strong>Automatic cleanup:</strong>{" "}
                    All data expires automatically via TTL
                  </li>
                </ul>
              </div>

              <h3 class="text-base font-semibold text-gray-900 mb-2">
                Technical Details
              </h3>
              <div class="text-sm">
                <div class="mb-2">
                  <strong>Session Management:</strong>{" "}
                  Each visitor gets a temporary session ID (5-minute TTL) to
                  track page visits and activity without persistent
                  identification.
                </div>
                <div class="mb-2">
                  <strong>Data Structure:</strong> Sessions stored as{" "}
                  <code class="bg-gray-100 px-1 rounded">
                    ["live_sessions", sessionId]
                  </code>
                  with atomic counters at{" "}
                  <code class="bg-gray-100 px-1 rounded">
                    ["live_count", "total"]
                  </code>{" "}
                  for consistency.
                </div>
                <div class="mb-2">
                  <strong>Trend Analysis:</strong>{" "}
                  Activity aggregated in 5-minute buckets at{" "}
                  <code class="bg-gray-100 px-1 rounded">
                    ["live_trend", timestamp]
                  </code>{" "}
                  for historical insights.
                </div>
                <div>
                  <strong>Scalability:</strong>{" "}
                  Distributed KV storage with edge caching enables global
                  deployment while maintaining real-time performance.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div class="mt-8 text-center">
          <a
            href="/"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
