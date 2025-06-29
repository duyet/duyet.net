import type { FreshContext } from "$fresh/server.ts";
import { getSlug, getTargetUrl } from "./utils.ts";
import { getLogger } from "./utils.ts";
import { isBot } from "./utils.ts";
import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

Deno.test("getUrl should return value", () => {
  assert(getTargetUrl("/").length > 0);
});

Deno.test("getUrl should return root path with with invalid path", () => {
  // This test now properly throws for invalid slug format
  assertThrows(
    () => {
      getTargetUrl("*&&&^%%$$$#");
    },
    Error,
    "Invalid slug format",
  );
});

Deno.test("getUrl should throw for invalid slug format", () => {
  assertThrows(
    () => {
      getTargetUrl("<script>");
    },
    Error,
    "Invalid slug format",
  );
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

Deno.test("getLogger", async () => {
  const mockRequest = new Request("https://example.com");
  const mockCtx = { remoteAddr: { hostname: "127.0.0.1" } };
  const mockKv = { enqueue: spy(async () => {}) };

  const logger = getLogger(
    mockRequest as Request,
    mockCtx as FreshContext,
    mockKv as unknown as Deno.Kv,
  );
  await logger("test message");

  assertSpyCalls(mockKv.enqueue, 1);
});

Deno.test("getLogger should skip bots", async () => {
  const mockRequest = new Request("https://example.com", {
    headers: { "user-agent": "Googlebot" },
  });
  const mockCtx = { remoteAddr: { hostname: "127.0.0.1" } };
  const mockKv = { enqueue: spy(async () => {}) };

  const logger = getLogger(
    mockRequest as Request,
    mockCtx as FreshContext,
    mockKv as unknown as Deno.Kv,
  );
  await logger("test message");

  // Should not enqueue for bots
  assertSpyCalls(mockKv.enqueue, 0);
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
