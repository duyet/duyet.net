import { assertEquals, assertExists } from "jsr:@std/assert";

import { query, type RedirectionStats } from "./get_stats.ts";
import type { ClickHouseResponse } from "@/libs/clickhouse.ts";
import { clickhouseQuery } from "@/libs/clickhouse.ts";

// Mock environment variables
const mockEnv = {
  CLICKHOUSE_URL: "http://localhost:8123",
  CLICKHOUSE_USER: "default",
  CLICKHOUSE_PASSWORD: "password",
};

// Mock fetch
const originalFetch = globalThis.fetch;

function mockFetch(responseData: ClickHouseResponse<RedirectionStats>) {
  // deno-lint-ignore require-await
  globalThis.fetch = async (): Promise<Response> => {
    return {
      ok: true,
      // deno-lint-ignore require-await
      text: async () => JSON.stringify(responseData),
    } as Response;
  };
}

// Setup and teardown helpers
function setupEnv() {
  for (const [key, value] of Object.entries(mockEnv)) {
    Deno.env.set(key, value);
  }
}

function teardownEnv() {
  for (const key of Object.keys(mockEnv)) {
    Deno.env.delete(key);
  }
}

// Restore original fetch after tests
function restoreFetch() {
  globalThis.fetch = originalFetch;
}

Deno.test("getStats", async () => {
  setupEnv();

  const mockData: ClickHouseResponse<RedirectionStats> = {
    meta: [
      { name: "source", type: "String" },
      { name: "count", type: "UInt64" },
    ],
    data: [
      { source: "google.com", count: 100 },
      { source: "github.com", count: 50 },
    ],
  };

  mockFetch(mockData);

  try {
    const result = await clickhouseQuery<RedirectionStats>(query);

    assertExists(result);
    assertEquals(result.meta, mockData.meta);
    assertEquals(result.data, mockData.data);
    assertEquals(result.data.length, 2);
    assertEquals(result.data[0].source, "google.com");
    assertEquals(result.data[0].count, 100);
  } finally {
    restoreFetch();
    teardownEnv();
  }
});

Deno.test("getStats - should handle empty response", async () => {
  setupEnv();

  const mockData: ClickHouseResponse<RedirectionStats> = {
    meta: [],
    data: [],
  };

  mockFetch(mockData);

  try {
    const result = await clickhouseQuery<RedirectionStats>(query);

    assertExists(result);
    assertEquals(result.meta, []);
    assertEquals(result.data, []);
  } finally {
    restoreFetch();
    teardownEnv();
  }
});

Deno.test(
  "getStats - should handle fetch error",
  async () => {
    setupEnv();

    globalThis.fetch = () => {
      throw new Error("Network error");
    };

    try {
      await clickhouseQuery<RedirectionStats>(query);

      throw new Error("Should have thrown an error");
    } catch (error) {
      assertEquals((error as Error).message, "Network error");
    } finally {
      restoreFetch();
      teardownEnv();
    }
  },
);
