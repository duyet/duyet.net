import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { query, type RedirectionStats } from "@/libs/get_stats.ts";
import { StatsChart } from "@/components/StatsChart.tsx";
import { clickhouseQuery, type ClickHouseResponse } from "@/libs/clickhouse.ts";
import { urls } from "@/urls.ts";

export const handler: Handlers<ClickHouseResponse<RedirectionStats>> = {
  async GET(_req: Request, ctx: FreshContext) {
    let data: ClickHouseResponse<RedirectionStats>;
    try {
      data = await clickhouseQuery<RedirectionStats>(query);
    } catch (e) {
      console.error("Get stats data error:", e);
      return ctx.renderNotFound({
        title: "Get stats data error",
        message: "" + e,
      });
    }

    return ctx.render(data);
  },
};

export default function Page(
  props: PageProps<ClickHouseResponse<RedirectionStats>>,
) {
  return (
    <>
      <Head>
        <title>Redirection Stats</title>
      </Head>
      <div class="flex flex-col gap-4 p-8 mx-auto max-w-screen-lg">
        <h1 className="text-center text-2xl">Redirection Stats</h1>
        <StatsChart validatedUrls={urls} data={props.data.data} />
      </div>
    </>
  );
}
