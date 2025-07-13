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

  const totalClicks = redirects.data.reduce((acc, curr) => acc + curr.count, 0);
  const totalUrls = redirects.data.length;
  const recentActivity = lastUpdated.data.slice(0, 5);

  return (
    <>
      <Head>
        <title>Analytics - duyet.net</title>
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
                <a href="/stats" className="text-foreground">Analytics</a>
                <a
                  href="/mini"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mini PC
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h1 className="text-4xl font-light mb-4">Analytics</h1>
              <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                <span>{totalClicks.toLocaleString()} clicks</span>
                <span>{totalUrls} URLs</span>
                <span>{recentActivity.length} recent</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-6">Activity</h2>
                <StatsLastUpdatedChart data={lastUpdated.data} />
              </div>

              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-6">Traffic</h2>
                <StatsChart validatedUrls={urls} data={redirects.data} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
