import { useState } from "preact/hooks";
import { type RedirectionStats } from "@/libs/get_stats.ts";
import { EChart } from "@/islands/EChart.tsx";
import { type Urls } from "@/urls.ts";

interface StatsChartProps {
  validatedUrls: Urls;
  data: Array<RedirectionStats>;
}

export function StatsChart({ validatedUrls, data }: StatsChartProps) {
  const [showOnlyValidated, setShowOnlyValidated] = useState(true);

  const filteredData = showOnlyValidated
    ? (data || []).filter((row) =>
      Object.keys(validatedUrls).includes(row.source)
    )
    : (data || []);

  const rows = filteredData.sort((a, b) => b.count - a.count);

  const option = {
    color: ["#3b82f6"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "#ffffff",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      textStyle: {
        color: "#334155",
      },
    },
    grid: {
      left: "2%",
      right: "3%",
      bottom: "2%",
      top: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "log",
      name: "Count",
      nameTextStyle: {
        color: "#64748b",
      },
      axisLine: {
        lineStyle: {
          color: "#e2e8f0",
        },
      },
      axisLabel: {
        color: "#64748b",
      },
      splitLine: {
        lineStyle: {
          color: "#f1f5f9",
        },
      },
    },
    yAxis: {
      type: "category",
      data: rows.map((row) => row.source),
      inverse: true,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#475569",
        fontSize: 11,
        margin: 4,
      },
    },
    series: [
      {
        name: "Count",
        type: "bar",
        barWidth: "90%",
        barCategoryGap: "0%",
        data: rows.map((row) => {
          if (!Object.keys(validatedUrls).includes(row.source)) {
            return {
              value: row.count,
              itemStyle: {
                color: "#e2e8f0",
                borderColor: "#94a3b8",
                borderType: "dashed",
                borderWidth: 1,
              },
              label: {
                show: true,
                position: "right",
                color: "#64748b",
                fontSize: 11,
              },
            };
          }

          return {
            value: row.count,
            itemStyle: {
              color: "#3b82f6",
            },
          };
        }),
        label: {
          show: true,
          position: "right",
          formatter: "{b} ({c} clicks)",
          color: "#334155",
          fontSize: 11,
        },
      },
    ],
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">
            Showing {rows.length} of {data?.length || 0} URLs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOnlyValidated}
              onChange={(e) => setShowOnlyValidated(e.currentTarget.checked)}
              className="rounded border-slate-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-slate-700">Show only validated URLs</span>
          </label>
        </div>
      </div>
      <EChart
        key={`chart-${showOnlyValidated}-${rows.length}`}
        option={option}
        className="w-full"
        style={{ height: `${Math.max(250, rows.length * 22 + 60)}px` }}
      />
    </div>
  );
}
