export interface TempByDay {
  day: string;
  hour: string;
  value: number;
}

export const tempCPUByDayQuery = `
  SELECT
      toDate(created_at) AS day,
      toHour(created_at) AS hour,
      avg(cpu_temp) AS value
  FROM duyet_analytics.homelab_ubuntu_sensors
  WHERE (toDateTime(created_at) >= toStartOfDay(now() - toIntervalDay(7)))
  GROUP BY 1, 2
  ORDER BY 1 DESC, 2 ASC WITH FILL
  SETTINGS use_query_cache = 1,
    query_cache_nondeterministic_function_handling = 'save',
    query_cache_ttl = 3600
  `;

export const tempSSDByDayQuery = `
    SELECT
        toDate(created_at) AS day,
        toHour(created_at) AS hour,
        avg(ssd_temp) AS value
    FROM duyet_analytics.homelab_ubuntu_sensors
    WHERE (toDateTime(created_at) >= toStartOfDay(now() - toIntervalDay(7)))
    GROUP BY 1, 2
    ORDER BY 1 DESC, 2 ASC WITH FILL
    SETTINGS use_query_cache = 1,
      query_cache_nondeterministic_function_handling = 'save',
      query_cache_ttl = 3600
    `;

export const tempHDDByDayQuery = `
    SELECT
        toDate(created_at) AS day,
        toHour(created_at) AS hour,
        avg(hdd_temp) AS value
    FROM duyet_analytics.homelab_ubuntu_sensors
    WHERE (toDateTime(created_at) >= toStartOfDay(now() - toIntervalDay(7)))
    GROUP BY 1, 2
    ORDER BY 1 DESC, 2 ASC WITH FILL
    SETTINGS use_query_cache = 1,
      query_cache_nondeterministic_function_handling = 'save',
      query_cache_ttl = 3600
    `;
