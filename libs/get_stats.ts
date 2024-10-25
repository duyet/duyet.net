import { getClickHouse } from "./utils.ts";

export const getStats = async () => {
  const clickhouse = getClickHouse();

  const resp = await fetch(clickhouse.url, {
    method: "POST",
    headers: clickhouse.headers,
    body: `SELECT
                 source,
                 count()
             FROM duyet_analytics.duyet_redirect
             GROUP BY 1
             ORDER BY 2 DESC
             LIMIT 50
             Format JSON`,
  });

  const text = await resp.text();
  return JSON.parse(text) || [];
};
