import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { type Data, getStats } from "@/libs/get_stats.ts";
import { Head } from "$fresh/runtime.ts";
import { StatsChart } from "@/components/StatsChart.tsx";

export const handler: Handlers<Data> = {
  async GET(_req: Request, ctx: FreshContext) {
    let data: Data;
    try {
      data = await getStats();
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

export default function Page(props: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>Redirection Stats</title>
      </Head>
      <div class="flex flex-col gap-4 p-8 mx-auto max-w-screen-lg">
        <h1 className="text-center text-2xl">Redirection Stats</h1>
        <StatsChart data={props.data} />
      </div>
    </>
  );
}
