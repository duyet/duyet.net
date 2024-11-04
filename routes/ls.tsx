import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { type Urls, urls } from "@/urls.ts";

type DataProps = {
  urls: Urls;
  systemUrls: Record<string, string>;
};

export const handler: Handlers<DataProps> = {
  GET(_req: Request, ctx: FreshContext) {
    const systemUrls = {
      "/ls": "this page",
      "/ping": "pong",
      "/health": "are you ok?",
      "/stats": "counting stats",
      "/mini": "minipc stats",
    };
    return ctx.render({ urls, systemUrls });
  },
};

export default function Listing(
  props: PageProps<DataProps>,
) {
  const { urls, systemUrls } = props.data;

  return (
    <div class="px-4 py-8 mx-auto h-screen flex gap-8">
      <div class="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the logo"
        />
        <div className="flex flex-col gap-4 justify-between p-5">
          <ul className="columns-1 md:columns-3 gap-16 list-decimal">
            {Object.entries(urls).map(([url, target]) => (
              <li key={url}>
                <a className="underline inline-flex" href={url} target="_blank">
                  {url}
                </a>
                {typeof target === "object"
                  ? <span className="italic truncate">- {target.desc}</span>
                  : null}
              </li>
            ))}
          </ul>
          <hr className="mt-5 mb-5 border-dotted" />
          <ul className="columns-1 md:columns-3 gap-16 list-decimal">
            {Object.entries(systemUrls).map(([url, desc]) => (
              <li key={url}>
                <a className="underline" href={url} target="_blank">{url}</a>
                {" - "}
                <span className="italic truncate">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
