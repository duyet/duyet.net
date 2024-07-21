import {
  assertEquals,
  assertExists,
  assertGreaterOrEqual,
} from "jsr:@std/assert";
import { urls } from "./urls.ts";
import { handler, initKv } from "./main.ts";

Deno.test("e2e", async (t) => {
  const ac = new AbortController();
  const kv = await initKv(":memory:");
  const testHandler = handler(kv);

  assertExists(kv);

  const server = Deno.serve({
    async onListen(e) {
      const baseUrl = new URL(`http://${e.hostname}:${e.port}`);

      await t.step("Test /ping endpoint", async () => {
        const res = await fetch(new URL("/ping", baseUrl));

        assertEquals(res.status, 200);
        assertEquals(await res.text(), "pong");
      });

      await t.step("Test /favicon.ico endpoint", async () => {
        const res = await fetch(new URL("/favicon.ico", baseUrl));

        assertEquals(res.status, 404);
        res.body?.cancel();
      });

      await t.step("Test /_ls endpoint", async () => {
        const res = await fetch(new URL("/_ls", baseUrl));

        assertEquals(res.status, 200);
        assertEquals(await res.json(), urls);
      });

      await t.step("Test redirect", async () => {
        const slug = "/blog";
        const expected = urls[slug];

        const res = await fetch(new URL(slug, baseUrl), {
          redirect: "manual",
        });

        assertEquals(res.status, 301);
        assertGreaterOrEqual(res.headers.get("Location"), expected);
        res.body?.cancel();
      });

      // Done
      ac.abort();
      kv.close();
    },
    signal: ac.signal,
    handler: testHandler,
    port: 3001,
  });

  await server.finished;

  // "Gracefully close the server."
  await server.shutdown();
});
