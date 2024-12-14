import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { query as q1, type RedirectionStats } from "@/libs/get_stats.ts";
import { StatsChart } from "@/components/StatsChart.tsx";
import { clickhouseQuery, type ClickHouseResponse } from "@/libs/clickhouse.ts";
import { urls } from "@/urls.ts";
import { StatsLastUpdatedChart } from "@/components/StatsLastUpdatedChart.tsx";
import {
  query as q2,
  type RedirectionLastUpdatedStats,
} from "@/libs/get_stats_last_updated.ts";

interface Data {
  redirects: ClickHouseResponse<RedirectionStats>;
  lastUpdated: ClickHouseResponse<RedirectionLastUpdatedStats>;
}

export const handler: Handlers<Data> = {
  async GET(_req: Request, ctx: FreshContext) {
    let redirects: Data["redirects"];
    let lastUpdated: Data["lastUpdated"];
    try {
      const resp = await Promise.all([
        clickhouseQuery<RedirectionStats>(q1),
        clickhouseQuery<RedirectionLastUpdatedStats>(q2),
      ]);

      redirects = resp[0];
      lastUpdated = resp[1];
    } catch (e) {
      console.error("Get stats data error:", e);
      return ctx.renderNotFound({
        title: "Get stats data error",
        message: "" + e,
      });
    }

    return ctx.render({ redirects, lastUpdated });
  },
};

export default function Page(
  { data: { redirects, lastUpdated } }: PageProps<Data>,
) {
  return (
    <>
      <Head>
        <title>Redirection Stats</title>
      </Head>
      <div class="flex flex-col gap-4 p-8 mx-auto max-w-screen-lg">
        <h1 className="text-center text-2xl">Redirection Stats</h1>
        <StatsLastUpdatedChart data={lastUpdated.data} />
        <StatsChart validatedUrls={urls} data={redirects.data} />
      </div>
    </>
  );
}
