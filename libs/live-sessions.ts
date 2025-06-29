import { DeviceInfo, LocationData, UserType } from "./user-detector.ts";

export interface LiveSession {
  id: string;
  timestamp: number;
  userType: UserType;
  location: LocationData;
  device: DeviceInfo;
  pages: string[];
  lastActivity: number;
}

export interface LiveStats {
  total: number;
  byType: Record<UserType, number>;
  byLocation: Record<string, number>;
  trend: { timestamp: number; count: number }[];
}

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes
const ACTIVITY_TTL_MS = 60 * 60 * 1000; // 1 hour

export class LiveSessionManager {
  private kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.kv = kv;
  }

  private async updateCounters(
    session: LiveSession,
    increment: number,
  ): Promise<void> {
    try {
      // Get current counters
      const [totalEntry, typeEntry, locationEntry] = await Promise.all([
        this.kv.get<number>(["live_count", "total"]),
        this.kv.get<number>(["live_count", "by_type", session.userType]),
        session.location.country
          ? this.kv.get<number>([
            "live_count",
            "by_location",
            session.location.country,
          ])
          : Promise.resolve({ value: 0 }),
      ]);

      // Update counters
      const newTotal = Math.max(0, (totalEntry.value || 0) + increment);
      const newTypeCount = Math.max(0, (typeEntry.value || 0) + increment);

      await Promise.all([
        this.kv.set(["live_count", "total"], newTotal),
        this.kv.set(["live_count", "by_type", session.userType], newTypeCount),
      ]);

      if (session.location.country) {
        const newLocationCount = Math.max(
          0,
          (locationEntry.value || 0) + increment,
        );
        await this.kv.set([
          "live_count",
          "by_location",
          session.location.country,
        ], newLocationCount);
      }
    } catch (error) {
      console.error("Failed to update counters:", error);
    }
  }

  async createSession(session: LiveSession): Promise<void> {
    try {
      // Store the session with TTL
      await this.kv.set(["live_sessions", session.id], session, {
        expireIn: SESSION_TTL_MS,
      });

      // Update counters separately (Deno Deploy doesn't support atomic.sum)
      await this.updateCounters(session, 1);

      // Track activity for cleanup
      const activityKey = [
        "live_activity",
        Math.floor(session.timestamp / 60000),
      ];
      const existingActivity = await this.kv.get<string[]>(activityKey);
      const sessionIds = existingActivity.value || [];
      sessionIds.push(session.id);
      await this.kv.set(activityKey, sessionIds, { expireIn: ACTIVITY_TTL_MS });
    } catch (error) {
      // Silently handle errors in production to avoid breaking the site
      console.error("Failed to create session:", error);
    }
  }

  async updateSessionActivity(sessionId: string, page: string): Promise<void> {
    const sessionEntry = await this.kv.get<LiveSession>([
      "live_sessions",
      sessionId,
    ]);
    if (!sessionEntry.value) return;

    const session = sessionEntry.value;
    session.lastActivity = Date.now();

    if (!session.pages.includes(page)) {
      session.pages.push(page);
    }

    await this.kv.set(["live_sessions", sessionId], session, {
      expireIn: SESSION_TTL_MS,
    });
  }

  async removeSession(sessionId: string): Promise<void> {
    try {
      const sessionEntry = await this.kv.get<LiveSession>([
        "live_sessions",
        sessionId,
      ]);
      if (!sessionEntry.value) return;

      const session = sessionEntry.value;

      // Remove the session
      await this.kv.delete(["live_sessions", sessionId]);

      // Update counters separately
      await this.updateCounters(session, -1);
    } catch (error) {
      console.error("Failed to remove session:", error);
    }
  }

  async getLiveStats(): Promise<LiveStats> {
    try {
      // Get all counters in parallel
      const [totalEntry, humanEntry, botEntry, llmEntry] = await Promise.all([
        this.kv.get<number>(["live_count", "total"]),
        this.kv.get<number>(["live_count", "by_type", UserType.HUMAN]),
        this.kv.get<number>(["live_count", "by_type", UserType.BOT]),
        this.kv.get<number>(["live_count", "by_type", UserType.LLM]),
      ]);

      // Get location data
      const locationEntries = this.kv.list<number>({
        prefix: ["live_count", "by_location"],
      });
      const byLocation: Record<string, number> = {};

      for await (const entry of locationEntries) {
        const country = entry.key[2] as string;
        byLocation[country] = entry.value || 0;
      }

      // Get trend data (last hour in 5-minute buckets)
      const now = Date.now();
      const trend: { timestamp: number; count: number }[] = [];

      for (let i = 0; i < 12; i++) {
        const timestamp = now - (i * 5 * 60 * 1000);
        const bucketKey = [
          "live_trend",
          Math.floor(timestamp / (5 * 60 * 1000)),
        ];
        const entry = await this.kv.get<number>(bucketKey);
        trend.unshift({ timestamp, count: entry.value || 0 });
      }

      return {
        total: Math.max(0, totalEntry.value || 0),
        byType: {
          [UserType.HUMAN]: Math.max(0, humanEntry.value || 0),
          [UserType.BOT]: Math.max(0, botEntry.value || 0),
          [UserType.LLM]: Math.max(0, llmEntry.value || 0),
        },
        byLocation,
        trend,
      };
    } catch (error) {
      console.error("Failed to get live stats:", error);
      // Return empty stats on error
      return {
        total: 0,
        byType: {
          [UserType.HUMAN]: 0,
          [UserType.BOT]: 0,
          [UserType.LLM]: 0,
        },
        byLocation: {},
        trend: [],
      };
    }
  }

  async getAllSessions(): Promise<LiveSession[]> {
    const sessions: LiveSession[] = [];
    const entries = this.kv.list<LiveSession>({ prefix: ["live_sessions"] });

    for await (const entry of entries) {
      sessions.push(entry.value);
    }

    return sessions;
  }

  async syncCounters(): Promise<void> {
    // Get all current sessions
    const sessions = await this.getAllSessions();

    // Count by type and location
    const counts = {
      total: sessions.length,
      byType: {
        [UserType.HUMAN]: 0,
        [UserType.BOT]: 0,
        [UserType.LLM]: 0,
      },
      byLocation: {} as Record<string, number>,
    };

    for (const session of sessions) {
      counts.byType[session.userType]++;
      if (session.location.country) {
        counts.byLocation[session.location.country] =
          (counts.byLocation[session.location.country] || 0) + 1;
      }
    }

    // Update all counters atomically
    const atomic = this.kv.atomic();

    atomic.set(["live_count", "total"], counts.total);
    atomic.set(
      ["live_count", "by_type", UserType.HUMAN],
      counts.byType[UserType.HUMAN],
    );
    atomic.set(
      ["live_count", "by_type", UserType.BOT],
      counts.byType[UserType.BOT],
    );
    atomic.set(
      ["live_count", "by_type", UserType.LLM],
      counts.byType[UserType.LLM],
    );

    // Clear old location counters
    const locationEntries = this.kv.list({
      prefix: ["live_count", "by_location"],
    });
    for await (const entry of locationEntries) {
      atomic.delete(entry.key);
    }

    // Set new location counters
    for (const [country, count] of Object.entries(counts.byLocation)) {
      atomic.set(["live_count", "by_location", country], count);
    }

    await atomic.commit();
  }

  async cleanup(): Promise<void> {
    // Get all sessions and check for expired ones
    const sessions = await this.getAllSessions();
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const session of sessions) {
      if (now - session.lastActivity > SESSION_TTL_MS) {
        expiredSessions.push(session.id);
      }
    }

    // Remove expired sessions
    for (const sessionId of expiredSessions) {
      await this.removeSession(sessionId);
    }

    // Sync counters to ensure accuracy
    await this.syncCounters();
  }

  async recordTrendData(): Promise<void> {
    const stats = await this.getLiveStats();
    const bucket = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute buckets

    await this.kv.set(
      ["live_trend", bucket],
      stats.total,
      { expireIn: 24 * 60 * 60 * 1000 }, // Keep for 24 hours
    );
  }
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}
