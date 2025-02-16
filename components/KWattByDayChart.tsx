import { EChart } from "@/islands/EChart.tsx";
import type { ClickHouseResponse } from "@/libs/clickhouse.ts";
import type { KWattByDay } from "@/libs/get_minipc_watt.ts";

export function KWattByDayChart(
  { wattByHour, title }: {
    wattByHour: ClickHouseResponse<KWattByDay>;
    title: string;
  },
) {
  const { data } = wattByHour;
  const labels = data.map((row) => row.day);
  const series = [
    {
      name: "Wh",
      type: "bar",
      data: data.map((row) => Math.trunc(row.total_wh || 0)),
      markPoint: {
        data: [
          { type: "max", name: "max_Wh" },
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
            axisLabel: {
              formatter: (value: string) => {
                const date = new Date(value);
                return `${date.getHours()}:${date.getMinutes()}`;
              },
            },
          },
          yAxis: {
            scale: true,
            type: "value",
            axisLabel: {
              formatter: "{value} kWh",
            },
          },
          series,
        }}
        className="w-full h-[400px]"
      />
    </div>
  );
}
