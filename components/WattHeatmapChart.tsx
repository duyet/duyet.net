import { EChart } from "@/islands/EChart.tsx";
import { type TempByDay } from "@/libs/get_minipc_temps_by_day.ts";
import type { ClickHouseResponse } from "@/libs/clickhouse.ts";

export function WattHeatmapChart(
  { watts, title }: { watts: ClickHouseResponse<TempByDay>; title: string },
) {
  const { data } = watts;

  const days = [...new Set(data.map((row) => row.day))];
  const hours = [...new Set(data.map((row) => row.hour))];

  const chartData = hours.flatMap((hour: string, i: number) =>
    days.map((day: string, j) => {
      return [
        i,
        j,
        parseFloat(
          (data.find((row) => row.day === day && row.hour === hour)
            ?.value || 0.0).toFixed(1),
        ) ||
        "-",
      ];
    })
  );

  const values = data.map((row) => parseFloat(row.value.toFixed(1)));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  console.log("data", data.length, data);
  console.log("chartData", chartData.length, chartData);

  return (
    <div className="min-h-[400px]">
      <EChart
        option={{
          title: { text: title },
          tooltip: {
            position: "top",
          },
          xAxis: {
            type: "category",
            data: hours,
            splitArea: {
              show: false,
            },
          },
          yAxis: {
            type: "category",
            data: days,
            splitArea: {
              show: false,
            },
          },
          visualMap: {
            type: "piecewise",
            min: minValue,
            max: maxValue,
            show: true,
            splitNumber: 3,
            minOpen: true,
            orient: "horizontal",
            left: "center",
            bottom: 0,
            precision: 2,
          },
          series: [
            {
              name: title,
              type: "heatmap",
              data: chartData,
              label: {
                show: true,
                fontSize: 12,
                borderStyle: "dotted",
                overflow: "truncate",
                ellipsis: "", // Default: '...'
              },
              tooltip: {},
            },
          ],
        }}
        className="w-full h-[400px]"
      />
    </div>
  );
}
