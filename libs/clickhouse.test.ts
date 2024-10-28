import {
  clickhouseQuery,
  type ClickHouseResponse,
  getClickHouse,
} from "./clickhouse.ts";
import { assertEquals, assertExists, assertThrows } from "jsr:@std/assert";

Deno.test("getClickHouse", () => {
  const originalEnv = Deno.env.toObject();

  Deno.env.set("CLICKHOUSE_URL", "http://example.com");
  Deno.env.set("CLICKHOUSE_USER", "user");
  Deno.env.set("CLICKHOUSE_PASSWORD", "password");

  const result = getClickHouse();
  assertEquals(result.url, "http://example.com");
  assertEquals(result.headers["X-ClickHouse-User"], "user");
  assertEquals(result.headers["X-ClickHouse-Key"], "password");

  Deno.env.delete("CLICKHOUSE_URL");
  assertThrows(
    () => getClickHouse(),
    Error,
    "Missing CLICKHOUSE_URL, CLICKHOUSE_USER or CLICKHOUSE_PASSWORD",
  );

  // Restore original environment
  for (const [key, value] of Object.entries(originalEnv)) {
    Deno.env.set(key, value);
  }
});

interface SampleData {
  source: string;
  count: number;
}

// Mock environment variables
const mockEnv = {
  CLICKHOUSE_URL: "http://localhost:8123",
  CLICKHOUSE_USER: "default",
  CLICKHOUSE_PASSWORD: "password",
};

// Mock fetch
const originalFetch = globalThis.fetch;

function mockFetch(responseData: ClickHouseResponse<SampleData>) {
  // deno-lint-ignore require-await
  globalThis.fetch = async () => {
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

Deno.test("query", async () => {
  setupEnv();

  const mockData: ClickHouseResponse<SampleData> = {
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
    const result = await clickhouseQuery<SampleData>(
      "SELECT source, COUNT() as count FROM test",
    );

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
