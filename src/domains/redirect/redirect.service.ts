import { urls } from "@/urls.ts";
import type { UrlConfig } from "@/src/shared/types/index.ts";
import { validateSlug } from "@/src/shared/utils/validation.ts";

export class RedirectService {
  static getTargetUrl(slug: string): string {
    if (!validateSlug(slug)) {
      throw new Error(`Invalid slug format: ${slug}`);
    }

    const target = urls[slug] || urls["/"];

    if (typeof target === "object") return target.target;
    if (typeof target === "string") return target;

    throw new Error(`Invalid target: ${slug}, ${target}`);
  }

  static isSystemRoute(slug: string): boolean {
    const target = urls[slug];
    return typeof target === "object" && target.system === true;
  }

  static getUrlConfig(slug: string): UrlConfig | string | undefined {
    return urls[slug];
  }

  static getAllUrls(): Record<string, string | UrlConfig> {
    return urls;
  }
}
