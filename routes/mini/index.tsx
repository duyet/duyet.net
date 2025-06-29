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
    <div className="space-y-6">
      {/* Temperature Sensors Overview */}
      <div class="bg-white border border-slate-200 rounded-lg p-6">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <span>🌡️</span>
            Live Sensors
          </h2>
          <p class="text-slate-600 text-sm">Real-time temperature monitoring</p>
        </div>
        <TempChart temp={temp} title="Sensors" />
        <div class="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-slate-600 text-sm leading-relaxed">
            Automated monitoring via{" "}
            <code class="bg-slate-200 px-2 py-1 rounded text-slate-800">
              lm-sensors
            </code>{" "}
            cron job collecting temperature data every minute from CPU, Wi-Fi
            adapter, NVMe, and other components.
          </p>
        </div>
      </div>

      {/* CPU Temperature Heatmap */}
      <div class="bg-white border border-slate-200 rounded-lg p-6">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <span>🔥</span>
            CPU Temperature Heatmap
          </h2>
          <p class="text-slate-600 text-sm">
            AMD Ryzen 7 5800H thermal patterns
          </p>
        </div>
        <TempHeatmapChart
          temp={tempCPUByDay}
          title="CPU AMD Ryzen temperature (°C)"
        />
        <div class="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-slate-600 text-sm leading-relaxed">
            Data from{" "}
            <code class="bg-slate-200 px-2 py-1 rounded text-slate-800">
              k10temp
            </code>{" "}
            sensor. Each row represents a day, each square shows average hourly
            CPU temperature.
          </p>
        </div>
      </div>

      {/* Storage Temperature Grid */}
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white border border-slate-200 rounded-lg p-6">
          <div class="mb-4">
            <h2 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span>💾</span>
              SSD Temperature
            </h2>
            <p class="text-slate-600 text-sm">NVMe thermal monitoring</p>
          </div>
          <TempHeatmapChart
            temp={tempSSDByDay}
            title="SSD temperature (°C)"
          />
        </div>

        <div class="bg-white border border-slate-200 rounded-lg p-6">
          <div class="mb-4">
            <h2 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span>💿</span>
              HDD Temperature
            </h2>
            <p class="text-slate-600 text-sm">Hard drive thermal data</p>
          </div>
          <TempHeatmapChart
            temp={tempHDDByDay}
            title="HDD temperature (°C)"
          />
        </div>
      </div>

      {/* Power Consumption Section */}
      <div class="bg-white border border-slate-200 rounded-lg p-6">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <span>⚡</span>
            Power Consumption
          </h2>
          <p class="text-slate-600 text-sm">Energy usage analytics</p>
        </div>

        <div class="space-y-6">
          <WattHeatmapChart
            watts={wattByDay}
            title="Power consumption (kWh)"
          />
          <KWattByDayChart
            wattByHour={kWhByDay}
            title="Power consumption by day"
          />
        </div>

        <div class="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-slate-600 text-sm leading-relaxed mb-2">
            Continuous power monitoring using{" "}
            <code class="bg-slate-200 px-2 py-1 rounded text-slate-800">
              powerstat
            </code>
            tool with minute-level precision.
          </p>
          <div class="bg-slate-800 p-3 rounded-lg">
            <code class="text-green-400 font-mono text-sm">
              powerstat -R -d 0
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
