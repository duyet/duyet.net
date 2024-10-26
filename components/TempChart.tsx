import { EChart } from "@/islands/EChart.tsx";
import { type Data } from "@/libs/get_minipc_temps.ts";

export function TempChart({ temp, title }: { temp: Data; title: string }) {
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
      name: "iwlwifi_temp",
      type: "line",
      data: data.map((row) => Math.trunc(row.iwlwifi_temp || 0)),
      markPoint: {
        data: [
          { type: "max", name: "max_iwlwifi_temp" },
        ],
      },
    },

    {
      name: "nvme_composite_temp",
      type: "line",
      data: data.map((row) => Math.trunc(row.nvme_composite_temp || 0)),
      markPoint: {
        data: [
          { type: "max", name: "max_nvme" },
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
