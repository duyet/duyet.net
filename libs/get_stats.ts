import { getClickHouse } from "./utils.ts";

export interface Data {
  meta: Array<Record<string, string>>;
  data: Array<{ source: string; count: string }>;
}

export const getStats = async (): Promise<Data> => {
  const ch = getClickHouse();
  console.log(ch);

  const resp = await fetch(ch.url, {
    method: "POST",
    headers: ch.headers,
    body: `SELECT
               source,
               count() as count
           FROM duyet_analytics.duyet_redirect
           GROUP BY 1
           ORDER BY 2 DESC
           LIMIT 50
           Format JSON`,
  });

  const text = await resp.text();
  console.log("text", text);

  return JSON.parse(text) || [];
};
