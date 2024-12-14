import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { query as tempQuery, type Temp } from "@/libs/get_minipc_temp.ts";
import {
  query as tempByDayQuery,
  type TempByDay,
} from "@/libs/get_minipc_temps_by_day.ts";
import { query as wattQuery, type WattByDay } from "@/libs/get_minipc_watt.ts";
import { TempChart } from "@/components/TempChart.tsx";
import { TempHeatmapChart } from "@/components/TempHeatmapChart.tsx";
import { WattHeatmapChart } from "@/components/WattHeatmapChart.tsx";
import { clickhouseQuery, type ClickHouseResponse } from "@/libs/clickhouse.ts";

interface Data {
  temp: ClickHouseResponse<Temp>;
  tempByDay: ClickHouseResponse<TempByDay>;
  wattByDay: ClickHouseResponse<WattByDay>;
}

export const handler: Handlers<Data> = {
  async GET(_req: Request, ctx: FreshContext) {
    let temp: ClickHouseResponse<Temp>;
    let tempByDay: ClickHouseResponse<TempByDay>;
    let wattByDay: ClickHouseResponse<WattByDay>;

    try {
      const resp = await Promise.all([
        clickhouseQuery<Temp>(tempQuery),
        clickhouseQuery<TempByDay>(tempByDayQuery),
        clickhouseQuery<WattByDay>(wattQuery),
      ]);
      temp = resp[0];
      tempByDay = resp[1];
      wattByDay = resp[2];
    } catch (e) {
      return ctx.renderNotFound({
        title: "Getting data error",
        message: "" + e,
      });
    }

    return ctx.render({ temp, tempByDay, wattByDay });
  },
};

export default function Page(
  { data: { temp, tempByDay, wattByDay } }: PageProps<Data>,
) {
  return (
    <>
      <Head>
        <title>Mini PC</title>
      </Head>
      <div class="flex flex-col gap-4 p-4 mb-8 md:p-8 mx-auto max-w-full md:max-w-screen-lg">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-center text-2xl">Mini PC</h1>
          <div className="p-6 bg-slate-50	rounded">
            My Mini PC, Beelink SER5 MAX (AMD Ryzen™ 7 5800H), is used for
            running homelab services like{" "}
            <a
              href="https://clickhouse-monitoring.vercel.app/?ref=mini"
              target="_blank"
            >
              ClickHouse
            </a>, Home Assistant, nextCloud, etc. I can also access it from
            anywhere via Tailscale.
          </div>
          <img src="/minipc.jpg" className="responsive w-full rounded" />
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <TempChart temp={temp} title="Sensors" />
            <p className="mt-4">
              There is a cron job that runs every minute using{" "}
              <code>lm-sensors</code>{" "}
              to collect temperature data and send it to ClickHouse, measuring
              CPU temperature, Wi-Fi adapter, NVMe temperature, etc.
            </p>
          </div>

          <div>
            <TempHeatmapChart
              temp={tempByDay}
              title={"AMD Ryzen temperature (°C)"}
            />
            <p className="mt-4">
              Data from k10temp sensor. Each row represents a day, and each
              square represents the average temperature of the CPU at that hour
            </p>
          </div>

          <div>
            <WattHeatmapChart
              watts={wattByDay}
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
