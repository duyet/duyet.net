import { type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function Layout({ Component, state }: PageProps) {
  return (
    <>
      <Head>
        <title>Mini PC</title>
      </Head>
      <div class="flex flex-col gap-4 p-4 mb-8 md:p-8 mx-auto max-w-full md:max-w-screen-lg">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-center text-2xl">Mini PC</h1>
          <div className="p-6 bg-slate-50	rounded">
            My Mini PC, Beelink SER5 MAX (AMD Ryzen™ 7 5800H), is used for
            running homelab services like{" "}
            <a
              href="https://clickhouse-monitoring.vercel.app/?ref=mini"
              target="_blank"
            >
              ClickHouse
            </a>, Home Assistant, nextCloud, etc. I can also access it from
            anywhere via Tailscale.
          </div>
          <img src="/minipc.jpg" className="responsive w-full rounded" />
        </div>

        <Component {...state} />
      </div>
    </>
  );
}
