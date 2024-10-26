import { EChart } from "@/islands/EChart.tsx";
import { type Data } from "@/libs/get_minipc_temps_by_day.ts";

export function TempHeatmapChart(
  { temp, title }: { temp: Data; title: string },
) {
  const { data } = temp;

  const days = [...new Set(data.map((row) => row.day))];
  const hours = [...new Set(data.map((row) => row.hour))];

  const chartData = hours.flatMap((hour: string, i: number) =>
    days.map((day: string, j) => {
      return [
        i,
        j,
        Math.trunc(
          data.find((row) => row.day === day && row.hour === hour)
            ?.value || 0,
        ) || "-",
      ];
    })
  );

  const minTemp = Math.min(...temp.data.map((row) => row.value));
  const maxTemp = Math.max(...temp.data.map((row) => row.value));

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
              show: true,
            },
          },
          yAxis: {
            type: "category",
            data: days,
            splitArea: {
              show: true,
            },
          },
          visualMap: {
            min: minTemp,
            max: maxTemp,
            show: false,
          },
          series: [
            {
              name: title,
              type: "heatmap",
              data: chartData,
              label: {
                show: true,
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
