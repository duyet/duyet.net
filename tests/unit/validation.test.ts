import { assertEquals } from "std/assert/mod.ts";
import {
  getSlug,
  isBot,
  sanitizeInput,
  validateSlug,
} from "@/src/shared/utils/validation.ts";

Deno.test("validation utils", async (t) => {
  await t.step("getSlug should handle various URL formats", () => {
    assertEquals(getSlug("test"), "/test");
    assertEquals(getSlug("/test"), "/test");
    assertEquals(getSlug("//test"), "/test");
    assertEquals(getSlug(""), "/");
    assertEquals(getSlug("invalid-url"), "/invalid-url");
  });

  await t.step("isBot should detect bots correctly", () => {
    assertEquals(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
    assertEquals(isBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), false);
    assertEquals(isBot("lighthouse"), true);
    assertEquals(isBot(null), false);
    assertEquals(isBot(""), false);
  });

  await t.step("validateSlug should validate slug format", () => {
    assertEquals(validateSlug("valid-slug"), true);
    assertEquals(validateSlug("valid_slug"), true);
    assertEquals(validateSlug("valid.slug"), true);
    assertEquals(validateSlug("valid/slug"), true);
    assertEquals(validateSlug("123"), true);
    assertEquals(validateSlug("<script>"), false);
    assertEquals(validateSlug("slug with spaces"), false);
  });

  await t.step("sanitizeInput should clean input", () => {
    assertEquals(sanitizeInput("  hello  "), "hello");
    assertEquals(
      sanitizeInput("<script>alert('xss')</script>"),
      "scriptalert('xss')/script",
    );
    assertEquals(sanitizeInput("normal text"), "normal text");
  });
});
