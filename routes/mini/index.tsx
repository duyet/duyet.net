import { type RouteContext } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

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
    <>
      <Head>
        <title>Mini PC - duyet.net</title>
      </Head>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" className="h-6 w-6" alt="duyet.net" />
                <a
                  href="/"
                  className="font-medium hover:text-primary transition-colors"
                >
                  duyet
                </a>
              </div>
              <nav className="hidden md:flex gap-6">
                <a
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </a>
                <a
                  href="/cv"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Resume
                </a>
                <a
                  href="/stats"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analytics
                </a>
                <a href="/mini" className="text-foreground">Mini PC</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h1 className="text-4xl font-light mb-4">Mini PC</h1>
              <p className="text-muted-foreground">
                AMD Ryzen 7 5800H monitoring
              </p>
            </div>

            <div className="space-y-8">
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-6">Temperature</h2>
                <TempChart temp={temp} title="Live sensors" />
              </div>

              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-6">CPU Heatmap</h2>
                <TempHeatmapChart
                  temp={tempCPUByDay}
                  title="CPU AMD Ryzen temperature (°C)"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="border rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-6">SSD</h2>
                  <TempHeatmapChart
                    temp={tempSSDByDay}
                    title="SSD temperature (°C)"
                  />
                </div>

                <div className="border rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-6">HDD</h2>
                  <TempHeatmapChart
                    temp={tempHDDByDay}
                    title="HDD temperature (°C)"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-6">Power</h2>
                <div className="space-y-6">
                  <WattHeatmapChart
                    watts={wattByDay}
                    title="Power consumption (kWh)"
                  />
                  <KWattByDayChart
                    wattByHour={kWhByDay}
                    title="Power consumption by day"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
