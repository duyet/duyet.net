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
import { Header } from "@/components/ui/header.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";

export default async function Page() {
  const redirects = await clickhouseQuery<RedirectionStats>(q1);
  const lastUpdated = await clickhouseQuery<RedirectionLastUpdatedStats>(q2);

  const totalClicks = redirects.data.reduce((acc, curr) => acc + curr.count, 0);
  const totalUrls = redirects.data.length;
  const recentActivity = lastUpdated.data.slice(0, 5);

  return (
    <>
      <Head>
        <title>Analytics Dashboard - duyet.net</title>
      </Head>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                  URL redirection metrics and traffic insights
                </p>
              </div>
              <Button variant="outline" asChild>
                <a href="/">
                  ← Back to home
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Clicks
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">
                    📊
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalClicks.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all URLs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active URLs
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">
                    🔗
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUrls}</div>
                  <p className="text-xs text-muted-foreground">
                    Total redirects configured
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recent Activity
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">
                    ⚡
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {recentActivity.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last 5 interactions
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Activity Timeline
                    <Badge variant="secondary">Live</Badge>
                  </CardTitle>
                  <CardDescription>
                    Recent redirection activity and user interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <StatsLastUpdatedChart data={lastUpdated.data} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>
                    URL performance metrics and click distribution
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <StatsChart validatedUrls={urls} data={redirects.data} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
