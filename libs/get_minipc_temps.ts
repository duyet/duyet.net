import { getClickHouse } from "./utils.ts";

export interface Row {
  created_at: string;
  iwlwifi_temp?: number;
  nvme_composite_temp?: number;
  cpu_temp?: number;
}

export interface Data {
  meta: Array<Record<string, string>>;
  data: Array<Row>;
}

export const getTemps = async (): Promise<Required<Data>> => {
  const ch = getClickHouse();
  const query = `
      SELECT
          toStartOfHour(created_at) AS created_at,
          avg(nvme_composite_temp) AS nvme_composite_temp,
          avg(iwlwifi_temp) AS iwlwifi_temp,
          avg(cpu_temp) AS cpu_temp
      FROM duyet_analytics.homelab_ubuntu_sensors
      WHERE (toDateTime(created_at) >= toDateTime(now() - toIntervalDay(7))) AND (toDateTime(created_at) <= toDateTime(now()))
      GROUP BY 1
      ORDER BY 1 DESC
      Format JSON`;
  console.log(query);

  const resp = await fetch(ch.url, {
    method: "POST",
    headers: ch.headers,
    body: query,
  });

  const text = await resp.text();

  return JSON.parse(text) || [];
};
