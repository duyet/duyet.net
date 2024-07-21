import { getSlug, getUrl } from "./libs.ts";
import { assert, assertEquals } from "jsr:@std/assert";

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
  assertEquals(getSlug("/a/b/"), "/b");
});

Deno.test("getSlug should return valid with params", () => {
  assertEquals(getSlug("?"), "/");
  assertEquals(getSlug("/?"), "/");
  assertEquals(getSlug("/?a=b"), "/");
});
