import { getUrl } from "./libs.ts";
import { assert, assertEquals } from "jsr:@std/assert";

Deno.test("getUrl should return value", () => {
  assert(getUrl("/").length > 0);
});

Deno.test("getUrl should return root path with with invalid path", () => {
  assertEquals(getUrl("*&&&^%%$$$#"), getUrl("/"));
});
