import { getClickHouse } from "./utils.ts";

export interface Row {
  day: string;
  hour: string;
  value: number;
}

export interface Data {
  meta: Array<Record<string, string>>;
  data: Array<Row>;
}

export const getTempByDay = async (sensor: string): Promise<Data> => {
  const ch = getClickHouse();
  const query = `
    SELECT
        toDate(created_at) AS day,
        toHour(created_at) AS hour,
        avg(${sensor}) AS value
    FROM duyet_analytics.homelab_ubuntu_sensors
    WHERE (toDateTime(created_at) >= toStartOfDay(now() - toIntervalDay(7)))
    GROUP BY 1, 2
    ORDER BY 1 DESC, 2 ASC WITH FILL
    SETTINGS use_query_cache = 1,
      query_cache_nondeterministic_function_handling = 'save',
      query_cache_ttl = 3600
    Format JSON`;

  const resp = await fetch(ch.url, {
    method: "POST",
    headers: ch.headers,
    body: query,
  });

  const text = await resp.text();
  console.log(query, text);

  return JSON.parse(text) || [];
};
