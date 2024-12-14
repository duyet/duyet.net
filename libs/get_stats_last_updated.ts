export interface RedirectionLastUpdatedStats {
  event_time: string;
  source: string;
  target: string;
  browser: string;
  os_name: string;
  os_version: string;
  device_type: string;
}

export const query = `
    SELECT
        event_time,
        source,
        target,
        browser,
        os_name,
        os_version,
        device_type
    FROM duyet_analytics.duyet_redirect
    ORDER BY event_time DESC
    LIMIT 1
`;
