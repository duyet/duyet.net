import { EChart } from "@/islands/EChart.tsx";
import { type Memory } from "@/libs/get_minipc_memory.ts";
import type { ClickHouseResponse } from "@/libs/clickhouse.ts";

export function MemoryChart(
  { mem, title }: { mem: ClickHouseResponse<Memory>; title: string },
) {
  const { data } = mem;
  const labels = data.map((row) => row.event_time);
  const series = [
    {
      name: "avg_memory",
      type: "line",
      areaStyle: {},
      data: data.map((row) => Math.trunc(row.avg_memory || 0)),
      markPoint: {
        data: [
          { type: "max", name: "max_avg_memory" },
        ],
      },
    },
  ];

  return (
    <div className="min-h-[400px]">
      <EChart
        option={{
          title: { text: title },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: labels,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: "dataMin",
            max: "dataMax",
            offset: 50,
          },
          yAxis: {
            scale: true,
            type: "value",
          },
          series,
        }}
        className="w-full h-[400px]"
      />
    </div>
  );
}
