export interface UrlConfig {
  target: string;
  system?: boolean;
  description?: string;
}

export interface LogPayload {
  method: string;
  ip: string;
  ua: string | null;
  msg: string[];
}

export interface ClickHouseQuery {
  query: string;
  format?: string;
}

export interface AnalyticsData {
  source: string;
  count: number;
}

export interface MiniPCStats {
  timestamp: string;
  temperature?: number;
  power?: number;
  memory?: number;
}

export type UrlMapping = Record<string, string | UrlConfig>;
