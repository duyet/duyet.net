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

  async createSession(session: LiveSession): Promise<void> {
    const atomic = this.kv.atomic();

    // Store the session with TTL
    atomic.set(["live_sessions", session.id], session, {
      expireIn: SESSION_TTL_MS,
    });

    // Update counters atomically
    atomic.sum(["live_count", "total"], 1n);
    atomic.sum(["live_count", "by_type", session.userType], 1n);

    if (session.location.country) {
      atomic.sum(["live_count", "by_location", session.location.country], 1n);
    }

    // Track activity for cleanup
    const activityKey = [
      "live_activity",
      Math.floor(session.timestamp / 60000),
    ];
    const existingActivity = await this.kv.get<string[]>(activityKey);
    const sessionIds = existingActivity.value || [];
    sessionIds.push(session.id);
    atomic.set(activityKey, sessionIds, { expireIn: ACTIVITY_TTL_MS });

    const result = await atomic.commit();
    if (!result.ok) {
      throw new Error("Failed to create session");
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
    const sessionEntry = await this.kv.get<LiveSession>([
      "live_sessions",
      sessionId,
    ]);
    if (!sessionEntry.value) return;

    const session = sessionEntry.value;
    const atomic = this.kv.atomic();

    // Remove the session
    atomic.delete(["live_sessions", sessionId]);

    // Update counters atomically
    atomic.sum(["live_count", "total"], -1n);
    atomic.sum(["live_count", "by_type", session.userType], -1n);

    if (session.location.country) {
      atomic.sum(["live_count", "by_location", session.location.country], -1n);
    }

    const result = await atomic.commit();
    if (!result.ok) {
      throw new Error("Failed to remove session");
    }
  }

  async getLiveStats(): Promise<LiveStats> {
    // Get all counters in parallel
    const [totalEntry, humanEntry, botEntry, llmEntry] = await Promise.all([
      this.kv.get<bigint>(["live_count", "total"]),
      this.kv.get<bigint>(["live_count", "by_type", UserType.HUMAN]),
      this.kv.get<bigint>(["live_count", "by_type", UserType.BOT]),
      this.kv.get<bigint>(["live_count", "by_type", UserType.LLM]),
    ]);

    // Get location data
    const locationEntries = this.kv.list<bigint>({
      prefix: ["live_count", "by_location"],
    });
    const byLocation: Record<string, number> = {};

    for await (const entry of locationEntries) {
      const country = entry.key[2] as string;
      byLocation[country] = Number(entry.value);
    }

    // Get trend data (last hour in 5-minute buckets)
    const now = Date.now();
    const trend: { timestamp: number; count: number }[] = [];

    for (let i = 0; i < 12; i++) {
      const timestamp = now - (i * 5 * 60 * 1000);
      const bucketKey = ["live_trend", Math.floor(timestamp / (5 * 60 * 1000))];
      const entry = await this.kv.get<number>(bucketKey);
      trend.unshift({ timestamp, count: entry.value || 0 });
    }

    return {
      total: Math.max(0, Number(totalEntry.value || 0n)),
      byType: {
        [UserType.HUMAN]: Math.max(0, Number(humanEntry.value || 0n)),
        [UserType.BOT]: Math.max(0, Number(botEntry.value || 0n)),
        [UserType.LLM]: Math.max(0, Number(llmEntry.value || 0n)),
      },
      byLocation,
      trend,
    };
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
