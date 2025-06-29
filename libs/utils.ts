// Legacy exports for backward compatibility
// TODO: Migrate to use service layer directly

export { RedirectService } from "@/src/domains/redirect/redirect.service.ts";
export { AnalyticsService } from "@/src/domains/analytics/analytics.service.ts";
export { getSlug, isBot } from "@/src/shared/utils/validation.ts";

import type { FreshContext } from "$fresh/server.ts";
import { RedirectService } from "@/src/domains/redirect/redirect.service.ts";
import { AnalyticsService } from "@/src/domains/analytics/analytics.service.ts";

// Legacy function - use RedirectService.getTargetUrl instead
export const getTargetUrl = (slug: string): string => {
  return RedirectService.getTargetUrl(slug);
};

// Legacy function - use AnalyticsService instead
export const getLogger =
  (req: Request, ctx: FreshContext, kv: Deno.Kv) =>
  async (
    ...msg: string[]
  ) => {
    const service = new AnalyticsService(kv);
    await service.log(req, ctx, ...msg);
  };
