import { type RedirectionStats } from "@/libs/get_stats.ts";
import { EChart } from "@/islands/EChart.tsx";
import { type Urls } from "@/urls.ts";

export function StatsChart(
  { validatedUrls, data }: {
    validatedUrls: Urls;
    data: Array<RedirectionStats>;
  },
) {
  const rows = (data || []).sort((a, b) => b.count - a.count);

  const option = {
    color: ["#f6dc7d"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      bottom: "3%",
      containLabel: false,
      height: rows.length * 100,
    },
    xAxis: {
      type: "log",
      name: "Count",
    },
    yAxis: {
      show: false,
      type: "category",
      data: rows.map((row) => row.source),
      inverse: true,
    },
    series: [
      {
        name: "Count",
        type: "bar",
        data: rows.map((row) => {
          if (!Object.keys(validatedUrls).includes(row.source)) {
            return {
              value: row.count,
              itemStyle: {
                color: "#DDD",
                borderColor: "#7c7c7c",
                borderType: "dashed",
                opacity: 0.8,
              },
              label: {
                show: true,
                position: "right",
              },
            };
          }

          return row.count;
        }),
        label: {
          show: true,
          position: "insideRight",
          formatter: "{b} ({c} open)",
        },
      },
    ],
  };

  return (
    <EChart
      option={option}
      theme="macarons"
      className={`w-full min-h-screen`}
    />
  );
}
