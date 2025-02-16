export interface Temp {
  created_at: string;
  ssd_temp?: number;
  hdd_temp?: number;
  wifi_temp?: number;
  cpu_temp?: number;
}

export const query = `
  SELECT
      toStartOfHour(created_at) AS created_at,
      avg(ssd_temp) AS ssd_temp,
      avg(hdd_temp) AS hdd_temp,
      avg(wifi_temp) AS wifi_temp,
      avg(cpu_temp) AS cpu_temp
  FROM duyet_analytics.homelab_ubuntu_sensors
  WHERE (toDateTime(created_at) >= toDateTime(now() - toIntervalDay(7))) AND (toDateTime(created_at) <= toDateTime(now()))
  GROUP BY 1
  ORDER BY 1 ASC
  SETTINGS use_query_cache = 1,
    query_cache_nondeterministic_function_handling = 'save',
    query_cache_ttl = 3600
  `;
