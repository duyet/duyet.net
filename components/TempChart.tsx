import { EChart } from "@/islands/EChart.tsx";
import { type Temp } from "../libs/get_minipc_temp.ts";
import type { ClickHouseResponse } from "@/libs/clickhouse.ts";

export function TempChart(
  { temp, title }: { temp: ClickHouseResponse<Temp>; title: string },
) {
  const { data } = temp;
  const labels = data.map((row) => row.created_at);
  const series = [
    {
      name: "cpu_temp",
      type: "line",
      data: data.map((row) => Math.trunc(row.cpu_temp || 0)),
      markPoint: {
        data: [
          { type: "max", name: "max_cpu_temp" },
        ],
      },
    },
    {
      name: "wifi_temp",
      type: "line",
      data: data.map((row) => Math.trunc(row.wifi_temp || 0)),
      markPoint: {
        data: [
          { type: "max", name: "max_wifi_temp" },
        ],
      },
    },
    {
      name: "ssd_temp",
      type: "line",
      data: data.map((row) => Math.trunc(row.ssd_temp || 0)),
      markPoint: {
        data: [
          { type: "max", name: "max_ssd_temp" },
        ],
      },
    },
    {
      name: "hdd_temp",
      type: "line",
      data: data.map((row) => Math.trunc(row.hdd_temp || 0)),
      markPoint: {
        data: [
          { type: "max", name: "max_hdd_temp" },
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
              formatter: "{value} °C",
            },
          },
          series,
        }}
        className="w-full h-[400px]"
      />
    </div>
  );
}
