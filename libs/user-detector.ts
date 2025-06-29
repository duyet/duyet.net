export enum UserType {
  HUMAN = "human",
  BOT = "bot",
  LLM = "llm",
}

export interface LocationData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface DeviceInfo {
  os: string;
  browser: string;
  deviceType: "desktop" | "mobile" | "tablet";
  userAgent: string;
}

const LLM_USER_AGENTS = [
  "gptbot",
  "claudebot",
  "perplexitybot",
  "bingbot",
  "anthropic-ai",
  "openai",
  "chatgpt",
  "claude",
  "gemini",
  "bard",
  "meta-ai",
  "ai2bot",
  "cohere",
  "replicate",
  "huggingface",
];

const BOT_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "slackbot",
  "discordbot",
  "crawler",
  "spider",
  "scraper",
  "robot",
  "wget",
  "curl",
  "python-requests",
  "node-fetch",
  "axios",
  "okhttp",
  "lighthouse",
  "pagespeed",
  "pingdom",
  "uptime",
  "monitor",
];

export function detectUserType(userAgent: string): UserType {
  const ua = userAgent.toLowerCase();

  // Check for LLM agents first
  for (const llmAgent of LLM_USER_AGENTS) {
    if (ua.includes(llmAgent)) {
      return UserType.LLM;
    }
  }

  // Check for general bots
  for (const botAgent of BOT_USER_AGENTS) {
    if (ua.includes(botAgent)) {
      return UserType.BOT;
    }
  }

  // Additional heuristics for bots
  if (
    ua.includes("bot") ||
    ua.includes("crawler") ||
    ua.includes("spider") ||
    ua.includes("scraper") ||
    ua.includes("monitor") ||
    ua.includes("check") ||
    !ua.includes("mozilla") // Most legitimate browsers include mozilla
  ) {
    return UserType.BOT;
  }

  return UserType.HUMAN;
}

export function getDeviceInfo(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();

  // Detect OS
  let os = "unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os x") || ua.includes("macos")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

  // Detect browser
  let browser = "unknown";
  if (ua.includes("chrome") && !ua.includes("edge")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera")) browser = "Opera";

  // Detect device type
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  if (
    ua.includes("mobile") || ua.includes("android") && !ua.includes("tablet")
  ) {
    deviceType = "mobile";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    deviceType = "tablet";
  }

  return {
    os,
    browser,
    deviceType,
    userAgent,
  };
}

export function getLocationFromRequest(
  request: Request,
): Promise<LocationData> {
  // Try to get location from headers (CloudFlare, etc.)
  const headers = request.headers;

  const cfCountry = headers.get("cf-ipcountry");
  const cfRegion = headers.get("cf-region");
  const cfCity = headers.get("cf-city");

  if (cfCountry) {
    return {
      country: cfCountry,
      region: cfRegion || undefined,
      city: cfCity || undefined,
    };
  }

  // Try other common headers
  const xCountry = headers.get("x-country-code") || headers.get("x-country");
  const xRegion = headers.get("x-region-code") || headers.get("x-region");
  const xCity = headers.get("x-city");

  if (xCountry) {
    return {
      country: xCountry,
      region: xRegion || undefined,
      city: xCity || undefined,
    };
  }

  // For now, return empty location data
  // In production, you could integrate with a GeoIP service
  return {};
}
