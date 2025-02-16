export interface WattByDayHourMatrix {
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

export interface KWattByDay {
  day: string;
  total_wh: number;
  total_kwh: number;
}

export const queryKWattByDay = `
WITH daily AS
    (
        SELECT
            event_minute,
            watts
        FROM duyet_analytics.power_usage
        WHERE host = hostName()
          AND toDateTime(event_ts) >= toDateTime(now() - toIntervalDay(30))
        ORDER BY event_minute ASC WITH FILL STEP toIntervalMinute(1)
        INTERPOLATE ( watts AS watts )
    )
SELECT
    toStartOfDay(event_minute) AS day,
    count() AS measurements,
    1440 AS expected_measurements,
    -- Calculate daily Wh (watts * 1/60 hour/minute)
    round(sum((watts) / 60), 3) AS total_wh,
    -- Calculate daily kWh (watts * 0.001 kW/W * 1/60 hour/minute)
    round(sum((watts * 0.001) / 60), 3) AS total_kwh,
    round(avg(watts), 2) AS avg_watts,
    min(watts) AS min_watts,
    max(watts) AS max_watts,
    round((count() / 1440) * 100, 2) AS coverage_percent,
    multiIf(toStartOfDay(event_minute) = toDate(now()), 'Today', toStartOfDay(event_minute) = (toDate(now()) - 1), 'Yesterday', '') AS note
FROM daily
GROUP BY day
ORDER BY day ASC
  SETTINGS use_query_cache = 1,
    query_cache_nondeterministic_function_handling = 'save',
    query_cache_ttl = 3600
  `;
