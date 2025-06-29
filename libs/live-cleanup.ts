import { kv } from "@/libs/kv.ts";
import { LiveSessionManager } from "@/libs/live-sessions.ts";

export class LiveCleanupService {
  private sessionManager: LiveSessionManager;
  private cleanupInterval: number | null = null;
  private trendInterval: number | null = null;

  constructor() {
    this.sessionManager = new LiveSessionManager(kv);
  }

  start() {
    console.log("Starting live cleanup service...");

    // Cleanup expired sessions every minute
    this.cleanupInterval = setInterval(async () => {
      try {
        await this.sessionManager.cleanup();
        console.log("Live sessions cleanup completed");
      } catch (error) {
        console.error("Live sessions cleanup failed:", error);
      }
    }, 60 * 1000); // 1 minute

    // Record trend data every 5 minutes
    this.trendInterval = setInterval(async () => {
      try {
        await this.sessionManager.recordTrendData();
        console.log("Trend data recorded");
      } catch (error) {
        console.error("Trend data recording failed:", error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Initial cleanup and trend recording
    this.sessionManager.cleanup().catch(console.error);
    this.sessionManager.recordTrendData().catch(console.error);
  }

  stop() {
    console.log("Stopping live cleanup service...");

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    if (this.trendInterval) {
      clearInterval(this.trendInterval);
      this.trendInterval = null;
    }
  }
}

// Global cleanup service instance
let cleanupService: LiveCleanupService | null = null;

export function startCleanupService() {
  if (!cleanupService) {
    cleanupService = new LiveCleanupService();
    cleanupService.start();
  }
}

export function stopCleanupService() {
  if (cleanupService) {
    cleanupService.stop();
    cleanupService = null;
  }
}
