import { Head } from "$fresh/runtime.ts";

import { query as q1, type RedirectionStats } from "@/libs/get_stats.ts";
import { StatsChart } from "@/components/StatsChart.tsx";
import { clickhouseQuery } from "@/libs/clickhouse.ts";
import { urls } from "@/urls.ts";
import { StatsLastUpdatedChart } from "@/components/StatsLastUpdatedChart.tsx";
import {
  query as q2,
  type RedirectionLastUpdatedStats,
} from "@/libs/get_stats_last_updated.ts";

export default async function Page() {
  const redirects = await clickhouseQuery<RedirectionStats>(q1);
  const lastUpdated = await clickhouseQuery<RedirectionLastUpdatedStats>(q2);

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
