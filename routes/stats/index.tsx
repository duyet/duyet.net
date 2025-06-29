import { Head } from "$fresh/runtime.ts";

import { query as q1, type RedirectionStats } from "@/libs/get_stats.ts";
import { StatsChart } from "@/islands/StatsChart.tsx";
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
        <title>Analytics Dashboard - duyet.net</title>
      </Head>
      <div class="min-h-screen bg-slate-50">
        <div class="p-8 mx-auto max-w-screen-xl">
          <div class="mb-8">
            <div class="mb-4">
              <a
                href="/"
                class="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2 text-sm"
              >
                ← Back to home
              </a>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">
              Analytics Dashboard
            </h1>
            <p class="text-slate-600">
              URL redirection metrics and traffic insights
            </p>
          </div>

          <div class="space-y-6">
            <div class="bg-white border border-slate-200 rounded-lg p-6">
              <div class="mb-4">
                <h2 class="text-xl font-semibold text-slate-900">
                  Activity Timeline
                </h2>
                <p class="text-slate-600 text-sm">
                  Recent redirection activity
                </p>
              </div>
              <StatsLastUpdatedChart data={lastUpdated.data} />
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-6">
              <div class="mb-4">
                <h2 class="text-xl font-semibold text-slate-900">
                  Traffic Overview
                </h2>
                <p class="text-slate-600 text-sm">URL performance metrics</p>
              </div>
              <StatsChart validatedUrls={urls} data={redirects.data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
