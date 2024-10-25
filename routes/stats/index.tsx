import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { type Data, getStats } from "@/libs/get_stats.ts";
import { Head } from "$fresh/runtime.ts";
import { Chart } from "https://deno.land/x/fresh_charts@0.3.1/mod.ts";
import { ChartColors } from "https://deno.land/x/fresh_charts@0.3.1/utils.ts";

export const handler: Handlers<Data> = {
  async GET(_req: Request, ctx: FreshContext) {
    let data: Data;
    try {
      data = await getStats();
    } catch (e) {
      console.error("Get stats data error:", e);
      return ctx.renderNotFound({
        title: "Get stats data error",
        message: "" + e,
      });
    }

    return ctx.render(data);
  },
};

export default function Page(props: PageProps<Data>) {
  const data = (props.data.data || []).sort((a, b) =>
    parseInt(b.count) - parseInt(a.count)
  ).slice(0, 20);
  const labels = data.map((row) => row.source);
  const datasets = [
    {
      label: "Data",
      data: data.map((row) => parseInt(row.count)),
      backgroundColor: ChartColors.Blue,
    },
  ];

  return (
    <>
      <Head>
        <title>Example Chart</title>
      </Head>
      <div class="flex flex-col gap-4 p-8 mx-auto max-w-screen-md">
        <h1 className="text-center">Redirection Stats</h1>
        <Chart
          type="bar"
          height={800}
          options={{
            indexAxis: "y",
            plugins: {
              legend: {
                position: "right",
                display: false,
              },
            },
            scales: {
              x: {
                display: true,
                type: "logarithmic",
              },
            },
            layout: {
              autoPadding: true,
            },
          }}
          data={{
            labels,
            datasets,
          }}
        />
      </div>
    </>
  );
}
