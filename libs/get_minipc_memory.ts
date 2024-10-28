export interface Memory {
  event_time: string;
  avg_memory?: number;
  readable_avg_memory?: number;
}

export const query = `
  SELECT toStartOfTenMinutes(event_time) AS event_time,
        avg(CurrentMetric_MemoryTracking) AS avg_memory,
        formatReadableSize(avg_memory) AS readable_avg_memory
  FROM merge(system, '^metric_log')
  WHERE event_time >= (now() - INTERVAL 24 HOUR)
  GROUP BY 1
  ORDER BY 1 ASC
  `;
