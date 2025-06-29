import { assertEquals } from "std/assert/mod.ts";
import { AppError, errorHandler } from "@/src/core/middleware/error-handler.ts";
import type { FreshContext } from "$fresh/server.ts";

Deno.test("Error Handler", async (t) => {
  await t.step("should create AppError with default status", () => {
    const error = new AppError("Test error");
    assertEquals(error.message, "Test error");
    assertEquals(error.statusCode, 500);
    assertEquals(error.name, "AppError");
  });

  await t.step("should create AppError with custom status and code", () => {
    const error = new AppError("Not found", 404, "NOT_FOUND");
    assertEquals(error.statusCode, 404);
    assertEquals(error.code, "NOT_FOUND");
  });

  await t.step("should handle AppError in middleware", async () => {
    const middleware = errorHandler({ logErrors: false });
    const mockContext = {
      next: () => {
        throw new AppError("Test error", 400, "TEST_ERROR");
      },
    } as unknown as FreshContext;

    const response = await middleware(
      new Request("http://localhost"),
      mockContext,
    );
    assertEquals(response.status, 400);

    const body = await response.json();
    assertEquals(body.error, "Test error");
    assertEquals(body.code, "TEST_ERROR");
  });

  await t.step("should handle generic errors", async () => {
    const middleware = errorHandler({ logErrors: false });
    const mockContext = {
      next: () => {
        throw new Error("Generic error");
      },
    } as unknown as FreshContext;

    const response = await middleware(
      new Request("http://localhost"),
      mockContext,
    );
    assertEquals(response.status, 500);

    const body = await response.json();
    assertEquals(body.error, "Internal Server Error");
  });

  await t.step("should pass through successful requests", async () => {
    const middleware = errorHandler();
    const mockResponse = new Response("OK");
    const mockContext = {
      next: () => mockResponse,
    } as unknown as FreshContext;

    const response = await middleware(
      new Request("http://localhost"),
      mockContext,
    );
    assertEquals(response, mockResponse);
  });
});
