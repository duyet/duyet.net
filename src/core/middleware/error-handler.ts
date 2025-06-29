import type { FreshContext } from "$fresh/server.ts";

export interface ErrorHandlerOptions {
  includeStack?: boolean;
  logErrors?: boolean;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (options: ErrorHandlerOptions = {}) => {
  return async (_req: Request, ctx: FreshContext) => {
    try {
      return await ctx.next();
    } catch (error) {
      if (options.logErrors) {
        console.error("Request error:", error);
      }

      if (error instanceof AppError) {
        return new Response(
          JSON.stringify({
            error: error.message,
            code: error.code,
            ...(options.includeStack && { stack: error.stack }),
          }),
          {
            status: error.statusCode,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Generic error response
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          ...(options.includeStack && {
            stack: error instanceof Error ? error.stack : String(error),
          }),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  };
};
