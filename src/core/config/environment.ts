export interface Environment {
  CLICKHOUSE_URL: string;
  CLICKHOUSE_USER: string;
  CLICKHOUSE_PASSWORD: string;
  DENO_ENV?: string;
}

export const getEnvironment = (): Environment => {
  const required = [
    "CLICKHOUSE_URL",
    "CLICKHOUSE_USER",
    "CLICKHOUSE_PASSWORD",
  ] as const;

  for (const key of required) {
    if (!Deno.env.get(key)) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    CLICKHOUSE_URL: Deno.env.get("CLICKHOUSE_URL")!,
    CLICKHOUSE_USER: Deno.env.get("CLICKHOUSE_USER")!,
    CLICKHOUSE_PASSWORD: Deno.env.get("CLICKHOUSE_PASSWORD")!,
    DENO_ENV: Deno.env.get("DENO_ENV"),
  };
};

export const isDevelopment = () => getEnvironment().DENO_ENV !== "production";
export const isProduction = () => getEnvironment().DENO_ENV === "production";
