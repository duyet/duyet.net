import type { FreshContext } from "$fresh/server.ts";
import type { LogPayload } from "@/src/shared/types/index.ts";
import { isBot } from "@/src/shared/utils/validation.ts";

export class AnalyticsService {
  constructor(private kv: Deno.Kv) {}

  async log(req: Request, ctx: FreshContext, ...msg: string[]): Promise<void> {
    const method = req.method;
    const ip = ctx.remoteAddr.hostname || "";
    const ua = req.headers.get("user-agent");

    const payload: LogPayload = {
      method,
      ip,
      ua,
      msg,
    };

    if (isBot(ua)) {
      console.log("Bot detected, skip logging to ClickHouse", ua);
      return;
    }

    console.log("Enqueue", payload);
    await this.kv.enqueue(payload);
  }

  async logRedirect(
    req: Request,
    ctx: FreshContext,
    slug: string,
    target: string,
  ): Promise<void> {
    await this.log(req, ctx, `redirect:${slug}:${target}`);
  }

  async logError(
    req: Request,
    ctx: FreshContext,
    error: string,
  ): Promise<void> {
    await this.log(req, ctx, `error:${error}`);
  }
}
