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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🌡️</span>
            Live Sensors
            <Badge variant="secondary">Real-time</Badge>
          </CardTitle>
          <CardDescription>
            Real-time temperature monitoring from hardware sensors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TempChart temp={temp} title="Sensors" />
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automated monitoring via{" "}
              <code className="bg-background px-2 py-1 rounded text-foreground font-mono text-xs">
                lm-sensors
              </code>{" "}
              cron job collecting temperature data every minute from CPU, Wi-Fi
              adapter, NVMe, and other components.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CPU Temperature Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🔥</span>
            CPU Temperature Heatmap
          </CardTitle>
          <CardDescription>
            AMD Ryzen 7 5800H thermal patterns and usage analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TempHeatmapChart
            temp={tempCPUByDay}
            title="CPU AMD Ryzen temperature (°C)"
          />
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Data from{" "}
              <code className="bg-background px-2 py-1 rounded text-foreground font-mono text-xs">
                k10temp
              </code>{" "}
              sensor. Each row represents a day, each square shows average
              hourly CPU temperature.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Storage Temperature Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💾</span>
              SSD Temperature
            </CardTitle>
            <CardDescription>
              NVMe thermal monitoring and performance tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TempHeatmapChart
              temp={tempSSDByDay}
              title="SSD temperature (°C)"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💿</span>
              HDD Temperature
            </CardTitle>
            <CardDescription>
              Hard drive thermal data and health monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TempHeatmapChart
              temp={tempHDDByDay}
              title="HDD temperature (°C)"
            />
          </CardContent>
        </Card>
      </div>

      {/* Power Consumption Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚡</span>
            Power Consumption
            <Badge variant="outline">Energy Tracking</Badge>
          </CardTitle>
          <CardDescription>
            Energy usage analytics and efficiency monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
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

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
              Continuous power monitoring using{" "}
              <code className="bg-background px-2 py-1 rounded text-foreground font-mono text-xs">
                powerstat
              </code>
              tool with minute-level precision.
            </p>
            <div className="bg-slate-800 p-3 rounded-lg">
              <code className="text-green-400 font-mono text-sm">
                powerstat -R -d 0
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
