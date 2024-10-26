import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { type Data as TempData } from "@/libs/get_minipc_temps.ts";
import { type Data as TempByDayData } from "@/libs/get_minipc_temps_by_day.ts";
import { getTemps } from "@/libs/get_minipc_temps.ts";
import { getTempByDay } from "@/libs/get_minipc_temps_by_day.ts";
import { TempChart } from "@/components/TempChart.tsx";
import { TempHeatmapChart } from "@/components/TempHeatmapChart.tsx";

interface Data {
  temp: TempData;
  tempByDay: TempByDayData;
}

export const handler: Handlers<Data> = {
  async GET(_req: Request, ctx: FreshContext) {
    let temp: TempData;
    let tempByDay: TempByDayData;
    try {
      temp = await getTemps();
      tempByDay = await getTempByDay("cpu_temp");
    } catch (e) {
      return ctx.renderNotFound({
        title: "Getting data error",
        message: "" + e,
      });
    }

    return ctx.render({ temp, tempByDay });
  },
};

export default function Page({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>MiniPC</title>
      </Head>
      <div class="flex flex-col gap-4 p-4 md:p-8 mx-auto max-w-full md:max-w-screen-lg">
        <h1 className="text-center text-2xl">MiniPC</h1>

        <div className="flex flex-col gap-8">
          <div>
            <TempChart temp={data.temp} title="Sensors" />
            <p className="mt-4">
              There is a cron job that runs every minute using{" "}
              <code>lm-sensors</code>{" "}
              to collect temperature data and send it to ClickHouse, measuring
              CPU temperature, Wi-Fi adapter, NVMe temperature, etc.
            </p>
          </div>

          <div>
            <TempHeatmapChart
              temp={data.tempByDay}
              title={"AMD Ryzen (k10temp sensor)"}
            />
            <div>
              Each row represents a day, and each square represents the average
              temperature of the CPU at that hour
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
