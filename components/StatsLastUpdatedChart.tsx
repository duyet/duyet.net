import { type RedirectionLastUpdatedStats } from "@/libs/get_stats_last_updated.ts";

export function StatsLastUpdatedChart(
  { data }: {
    data: Array<RedirectionLastUpdatedStats>;
  },
) {
  if (!data.length) {
    return null;
  }

  const row = data[0];

  return (
    <div className={"text-gray-600 text-sm"}>
      <p>
        Last event:
        <code>{row.source}</code> → <code>{row.target}</code>{" "}
        <code className="bg-gray-100 p-1 rounded">{row.event_time}</code>
        {" "}
      </p>
      <p>
        {[row.browser, row.os_name, row.os_version, row.device_type].filter(
          (v) => v && v !== "",
        ).map((v) => ` | ${v}`)}
      </p>
    </div>
  );
}
