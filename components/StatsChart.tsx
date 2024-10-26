import { type Data } from "@/libs/get_stats.ts";
import { EChart } from "@/islands/EChart.tsx";

export function StatsChart({ data }: { data: Data }) {
  const rows = (data.data || []).sort((a, b) =>
    parseInt(b.count) - parseInt(a.count)
  ).slice(0, 20);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "log",
      name: "Count",
    },
    yAxis: {
      type: "category",
      data: rows.map((row) => row.source),
      inverse: true,
    },
    series: [
      {
        name: "Count",
        type: "bar",
        data: rows.map((row) => parseInt(row.count)),
        label: {
          show: true,
          position: "right",
        },
      },
    ],
  };

  return (
    <>
      <EChart option={option} className="w-full min-h-[700px]" />
    </>
  );
}
