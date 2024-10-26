import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { type Data as TempData } from "@/libs/get_minipc_temps.ts";
import { type Data as TempByDayData } from "@/libs/get_minipc_temps_by_day.ts";
import { type Data as WattByDayData } from "@/libs/get_minipc_watts.ts";
import { getTemps } from "@/libs/get_minipc_temps.ts";
import { getTempByDay } from "@/libs/get_minipc_temps_by_day.ts";
import { getWatts } from "@/libs/get_minipc_watts.ts";
import { TempChart } from "@/components/TempChart.tsx";
import { TempHeatmapChart } from "@/components/TempHeatmapChart.tsx";
import { WattHeatmapChart } from "@/components/WattHeatmapChart.tsx";

interface Data {
  temp: TempData;
  tempByDay: TempByDayData;
  wattByDay: WattByDayData;
}

export const handler: Handlers<Data> = {
  async GET(_req: Request, ctx: FreshContext) {
    let temp: TempData;
    let tempByDay: TempByDayData;
    let wattByDay: WattByDayData;
    try {
      temp = await getTemps();
      tempByDay = await getTempByDay("cpu_temp");
      wattByDay = await getWatts();
    } catch (e) {
      return ctx.renderNotFound({
        title: "Getting data error",
        message: "" + e,
      });
    }

    return ctx.render({ temp, tempByDay, wattByDay });
  },
};

export default function Page({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>MiniPC</title>
      </Head>
      <div class="flex flex-col gap-4 p-4 mb-8 md:p-8 mx-auto max-w-full md:max-w-screen-lg">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-center text-2xl">Mini PC</h1>
          <div className="p-6 bg-slate-50	rounded">
            My Mini PC, Beelink SER5 MAX (AMD Ryzen™ 7 5800H), is used for
            running homelab services like ClickHouse, Home Assistant, nextCloud,
            etc. I can also access it from anywhere via Tailscale.
          </div>
          <img src="/minipc.jpg" className="responsive w-full rounded" />
        </div>

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
            <p className="mt-4">
              Each row represents a day, and each square represents the average
              temperature of the CPU at that hour
            </p>
          </div>

          <div>
            <WattHeatmapChart
              watts={data.wattByDay}
              title={"MiniPC power consumption (kWh)"}
            />
            <p className="mt-4">
              Cron job that runs every minute using powerstat - a tool to
              measure power consumption.
            </p>
            <pre className="mt-4"><code>powerstat -R -d 0</code></pre>
          </div>
        </div>
      </div>
    </>
  );
}
