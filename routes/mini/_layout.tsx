import { type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
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

export default function Layout({ Component, state }: PageProps) {
  return (
    <>
      <Head>
        <title>Mini PC Dashboard - duyet.net</title>
      </Head>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Mini PC Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Real-time monitoring of Beelink SER5 MAX homelab server
                </p>
              </div>
              <Button variant="outline" asChild>
                <a href="/">
                  ← Back to home
                </a>
              </Button>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                    🖥️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      Beelink SER5 MAX
                      <Badge variant="default">Active</Badge>
                    </div>
                    <CardDescription className="mt-1">
                      AMD Ryzen™ 7 5800H Homelab Server
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      My homelab server running{" "}
                      <a
                        href="https://clickhouse-monitoring.vercel.app/?ref=mini"
                        target="_blank"
                        className="text-primary hover:underline font-medium"
                      >
                        ClickHouse
                      </a>, Home Assistant, nextCloud and more. Remote access
                      via Tailscale for secure monitoring.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">AMD Ryzen 7 5800H</Badge>
                      <Badge variant="secondary">ClickHouse</Badge>
                      <Badge variant="secondary">Home Assistant</Badge>
                      <Badge variant="secondary">Tailscale</Badge>
                    </div>
                  </div>
                  <div>
                    <img
                      src="/minipc.jpg"
                      className="w-full rounded-lg border"
                      alt="Beelink SER5 MAX Mini PC"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Component {...state} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
