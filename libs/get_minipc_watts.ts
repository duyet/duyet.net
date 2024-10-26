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

export const getWatts = async (): Promise<Data> => {
  const ch = getClickHouse();
  const query = `
    WITH data AS (
        SELECT toStartOfMinute(event_ts) as minute, AVG(watts) AS watts
        FROM duyet_analytics.power_usage
        WHERE toDateTime(event_ts) >= toDateTime(now() - toIntervalDay(14))
        GROUP BY 1
        ORDER BY 1 WITH FILL STEP toIntervalMinute(1) INTERPOLATE (watts)
    )

    SELECT toDate(minute) as day,
           toHour(minute) as hour,
           ((SUM(watts) as Wh) / 1000) as value
    FROM data
    GROUP BY 1, 2
    ORDER BY 1 DESC, 2 ASC
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
