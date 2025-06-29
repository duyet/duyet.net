import { assertEquals, assertThrows } from "std/assert/mod.ts";
import { RedirectService } from "@/src/domains/redirect/redirect.service.ts";

Deno.test("RedirectService", async (t) => {
  await t.step("should return target URL for valid slug", () => {
    // Assuming urls.ts has a mapping for this test
    const target = RedirectService.getTargetUrl("/");
    assertEquals(typeof target, "string");
  });

  await t.step("should throw error for invalid slug format", () => {
    assertThrows(
      () => {
        RedirectService.getTargetUrl("<script>");
      },
      Error,
      "Invalid slug format",
    );
  });

  await t.step("should detect system routes", () => {
    const isSystem = RedirectService.isSystemRoute("ls");
    assertEquals(typeof isSystem, "boolean");
  });

  await t.step("should return all URLs", () => {
    const urls = RedirectService.getAllUrls();
    assertEquals(typeof urls, "object");
  });
});
