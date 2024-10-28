export interface WattByDay {
  day: string;
  hour: string;
  value: number;
}

export const query = `
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
  `;
