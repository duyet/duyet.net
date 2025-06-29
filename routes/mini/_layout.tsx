import { type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function Layout({ Component, state }: PageProps) {
  return (
    <>
      <Head>
        <title>Mini PC Dashboard - duyet.net</title>
      </Head>
      <div class="min-h-screen bg-slate-50">
        <div class="p-4 md:p-8 mx-auto max-w-screen-xl">
          <div class="mb-8">
            <div class="mb-4">
              <a
                href="/"
                class="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2 text-sm"
              >
                ← Back to home
              </a>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 mb-6">
              Mini PC Dashboard
            </h1>

            <div class="bg-white border border-slate-200 rounded-lg p-6 mb-6">
              <div class="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <div class="flex items-start gap-3 mb-4">
                    <div class="text-2xl">🖥️</div>
                    <div>
                      <h2 class="text-xl font-semibold text-slate-900 mb-2">
                        Beelink SER5 MAX
                      </h2>
                      <p class="text-slate-600 leading-relaxed">
                        My homelab server with{" "}
                        <strong>AMD Ryzen™ 7 5800H</strong>. Running{" "}
                        <a
                          href="https://clickhouse-monitoring.vercel.app/?ref=mini"
                          target="_blank"
                          class="text-blue-600 hover:text-blue-700 underline"
                        >
                          ClickHouse
                        </a>, Home Assistant, nextCloud and more. Remote access
                        via Tailscale.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <img
                    src="/minipc.jpg"
                    class="w-full rounded-lg border border-slate-200"
                    alt="Beelink SER5 MAX Mini PC"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <Component {...state} />
          </div>
        </div>
      </div>
    </>
  );
}
