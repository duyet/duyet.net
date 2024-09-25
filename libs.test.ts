import { getSlug, getUrl } from "./libs.ts";
import { getClickHouse, getLogger } from "./libs.ts";
import { isBot } from "./libs.ts";
import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

Deno.test("getUrl should return value", () => {
  assert(getUrl("/").length > 0);
});

Deno.test("getUrl should return root path with with invalid path", () => {
  assertEquals(getUrl("*&&&^%%$$$#"), getUrl("/"));
});

Deno.test("getSlug should return valid value", () => {
  assertEquals(getSlug(""), "/");
  assertEquals(getSlug("/"), "/");
  assertEquals(getSlug("/abc"), "/abc");
  assertEquals(getSlug("/abc/"), "/abc");
  assertEquals(getSlug("//abc"), "/abc");
  assertEquals(getSlug("//abc"), "/abc");
  assertEquals(getSlug("//abc//"), "/abc");
  assertEquals(getSlug("/a/b"), "/a/b");
  assertEquals(getSlug("/a/b/"), "/a/b");
  assertEquals(getSlug("/a/b/c"), "/a/b/c");
});

Deno.test("getSlug should return valid with params", () => {
  assertEquals(getSlug("?"), "/");
  assertEquals(getSlug("/?"), "/");
  assertEquals(getSlug("/?a=b"), "/");
  assertEquals(getSlug("/abc?a=b"), "/abc");
});

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

Deno.test("getLogger", async () => {
  const mockRequest = new Request("https://example.com");
  const mockConn = { remoteAddr: { hostname: "127.0.0.1" } };
  const mockKv = { enqueue: spy(async () => {}) };

  const logger = getLogger(
    mockRequest as Request,
    mockConn as Deno.ServeHandlerInfo,
    mockKv as unknown as Deno.Kv,
  );
  await logger("test message");

  assertSpyCalls(mockKv.enqueue, 1);
});

Deno.test("isBot", () => {
  const botUA = [
    "Googlebot",
    "upptime.js.org",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Ada Chat Bot/1.0 Request Block",
    "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
    "Mozilla/5.0+(compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)",
  ];

  for (const ua of botUA) {
    assert(isBot(ua));
  }
});

Deno.test("not isBot", () => {
  const botUA = [
    "",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  ];

  for (const ua of botUA) {
    assert(false === isBot(ua));
  }
});
