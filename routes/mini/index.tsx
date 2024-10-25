import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { enUS } from "npm:date-fns/locale";

import { Head } from "$fresh/runtime.ts";
import { Chart } from "@/islands/Chart.tsx";
import { type Data as TempData, getTemps } from "@/libs/get_minipc_data.ts";

interface Data {
  temp: TempData;
}

export const handler: Handlers<Data> = {
  async GET(_req: Request, ctx: FreshContext) {
    let temp: TempData;
    try {
      temp = await getTemps();
    } catch (e) {
      return ctx.renderNotFound({
        title: "Getting data error",
        message: "" + e,
      });
    }

    return ctx.render({ temp });
  },
};

function TempChart({ temp }: { temp: TempData }) {
  const data = temp.data;
  const labels = data.map((row) => row.created_at__hour);

  const styles = {
    pointStyle: false as false,
    borderWidth: 1,
  };
  const datasets = [
    {
      label: "cpu_temp",
      data: data.map((row) => row.cpu_temp),
      ...styles,
    },
    {
      label: "iwlwifi_temp",
      data: data.map((row) => row.iwlwifi_temp),
      ...styles,
    },
    {
      label: "nvme_composite_temp",
      data: data.map((row) => row.nvme_composite_temp),
      ...styles,
    },
  ];

  return (
    <Chart
      type="line"
      options={{
        responsive: true,
        scales: {
          x: {
            display: true,
            time: {
              unit: "hour",
            },
            adapters: {
              date: {
                locale: enUS,
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              autoSkip: true,
            },
          },
          y: {
            display: true,
            title: { display: true, text: "Temp (°C)" },
          },
        },
        layout: {
          autoPadding: true,
        },
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      }}
      data={{
        labels,
        datasets,
      }}
    />
  );
}

export default function Page({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>MiniPC</title>
      </Head>
      <div class="flex flex-col gap-4 p-8 mx-auto max-w-screen-lg">
        <h1 className="text-center">MiniPC</h1>
        <TempChart temp={data.temp} />
      </div>
    </>
  );
}
