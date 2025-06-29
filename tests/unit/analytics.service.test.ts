import { AnalyticsService } from "@/src/domains/analytics/analytics.service.ts";
import type { FreshContext } from "$fresh/server.ts";

// Mock KV store
const mockKv = {
  enqueue: (payload: unknown) => {
    console.log("Mock enqueue:", payload);
  },
} as unknown as Deno.Kv;

const mockRequest = new Request("http://localhost/test");
const mockContext = {
  remoteAddr: { hostname: "127.0.0.1" },
} as unknown as FreshContext;

Deno.test("AnalyticsService", async (t) => {
  const service = new AnalyticsService(mockKv);

  await t.step("should log regular user agents", async () => {
    const req = new Request("http://localhost/test", {
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    // Should not throw
    await service.log(req, mockContext, "test message");
  });

  await t.step("should skip logging for bots", async () => {
    const req = new Request("http://localhost/test", {
      headers: { "user-agent": "Googlebot" },
    });

    // Should not throw and should skip enqueue
    await service.log(req, mockContext, "test message");
  });

  await t.step("should log redirects", async () => {
    await service.logRedirect(
      mockRequest,
      mockContext,
      "test",
      "https://example.com",
    );
  });

  await t.step("should log errors", async () => {
    await service.logError(mockRequest, mockContext, "test error");
  });
});
