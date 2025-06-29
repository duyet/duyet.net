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
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600 font-medium">Latest activity:</span>
          <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono">
            {row.source}
          </code>
          <span className="text-slate-400">→</span>
          <code className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-mono">
            {row.target}
          </code>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">At:</span>
          <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-mono">
            {row.event_time}
          </code>
        </div>
        {[row.browser, row.os_name, row.os_version, row.device_type].filter(
              (v) => v && v !== "",
            ).length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Device:</span>
            <span className="text-slate-600 text-xs">
              {[row.browser, row.os_name, row.os_version, row.device_type]
                .filter((v) => v && v !== "")
                .join(" • ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
