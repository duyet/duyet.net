import { type RouteContext } from "$fresh/server.ts";

import { query as tempQuery, type Temp } from "@/libs/get_minipc_temp.ts";
import {
  type TempByDay,
  tempCPUByDayQuery,
  tempHDDByDayQuery,
  tempSSDByDayQuery,
} from "@/libs/get_minipc_temps_by_day.ts";
import {
  type KWattByDay,
  query as wattQuery,
  queryKWattByDay,
  type WattByDayHourMatrix,
} from "@/libs/get_minipc_watt.ts";
import { TempChart } from "@/components/TempChart.tsx";
import { TempHeatmapChart } from "@/components/TempHeatmapChart.tsx";
import { WattHeatmapChart } from "@/components/WattHeatmapChart.tsx";
import { clickhouseQuery } from "@/libs/clickhouse.ts";
import { KWattByDayChart } from "@/components/KWattByDayChart.tsx";

export default async function Page(_req: Request, _ctx: RouteContext) {
  const temp = await clickhouseQuery<Temp>(tempQuery);
  const tempCPUByDay = await clickhouseQuery<TempByDay>(tempCPUByDayQuery);
  const tempSSDByDay = await clickhouseQuery<TempByDay>(tempSSDByDayQuery);
  const tempHDDByDay = await clickhouseQuery<TempByDay>(tempHDDByDayQuery);
  const wattByDay = await clickhouseQuery<WattByDayHourMatrix>(wattQuery);
  const kWhByDay = await clickhouseQuery<KWattByDay>(queryKWattByDay);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <TempChart temp={temp} title="Sensors" />
        <p className="mt-4">
          There is a cron job that runs every minute using{" "}
          <code>lm-sensors</code>{" "}
          to collect temperature data and send it to ClickHouse, measuring CPU
          temperature, Wi-Fi adapter, NVMe temperature, etc.
        </p>
      </div>

      <div>
        <TempHeatmapChart
          temp={tempCPUByDay}
          title={"CPU AMD Ryzen temperature (°C)"}
        />
        <p className="mt-4">
          Data from k10temp sensor. Each row represents a day, and each square
          represents the average temperature of the CPU at that hour
        </p>
      </div>

      <div>
        <TempHeatmapChart
          temp={tempSSDByDay}
          title={"SSD temperature (°C)"}
        />
        <p className="mt-4">
        </p>
      </div>

      <div>
        <TempHeatmapChart
          temp={tempHDDByDay}
          title={"HDD temperature (°C)"}
        />
        <p className="mt-4">
        </p>
      </div>

      <div>
        <WattHeatmapChart
          watts={wattByDay}
          title={"Power consumption (kWh)"}
        />
        <KWattByDayChart
          wattByHour={kWhByDay}
          title="Power consumption by day"
        />
        <p className="mt-4">
          Cron job that runs every minute using powerstat - a tool to measure
          power consumption.
        </p>
        <pre className="mt-4"><code>powerstat -R -d 0</code></pre>
      </div>
    </div>
  );
}
