import { FreshContext, Handlers, type PageProps } from "$fresh/server.ts";
import { type UrlConfig, type Urls, urls } from "@/urls.ts";

type DataProps = {
  urls: Urls;
  systemUrls: Urls;
};

export const handler: Handlers<DataProps> = {
  GET(_req: Request, ctx: FreshContext) {
    const { systemUrls, urlsWithoutSystem } = Object.entries(urls).reduce(
      (acc, [slug, config]) => {
        if (typeof config === "object" && config.system) {
          acc.systemUrls[slug] = config;
        } else {
          acc.urlsWithoutSystem[slug] = config;
        }
        return acc;
      },
      { systemUrls: {} as Urls, urlsWithoutSystem: {} as Urls },
    );

    return ctx.render({ urls: urlsWithoutSystem, systemUrls });
  },
};

export default function Listing(
  { data: { urls, systemUrls } }: PageProps<DataProps>,
) {
  return (
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
          <div class="text-center mb-8">
            <img
              class="mx-auto mb-4"
              src="/logo.svg"
              width="80"
              height="80"
              alt="duyet.net logo"
            />
            <h1 class="text-3xl font-bold text-slate-900 mb-2">All Links</h1>
            <p class="text-slate-600">
              Complete directory of shortcuts and services
            </p>
          </div>
        </div>

        <div class="space-y-8">
          {/* System URLs */}
          <div class="bg-white border border-slate-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span class="text-lg">⚙️</span>
              System & Internal
            </h2>
            <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(systemUrls).map(([url, target]) => (
                <UrlCard key={url} url={url} target={target} internal />
              ))}
            </div>
          </div>

          {/* Homelab Section */}
          <div class="bg-white border border-slate-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span class="text-lg">🏠</span>
              Homelab & Services
            </h2>
            <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <a
                href="/monitor"
                class="p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="flex items-center gap-3">
                  <div class="text-xl">📊</div>
                  <div>
                    <div class="font-medium text-slate-900">/monitor</div>
                    <div class="text-sm text-slate-500">
                      ClickHouse Monitoring
                    </div>
                  </div>
                </div>
              </a>
              <a
                href="/mini"
                class="p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="flex items-center gap-3">
                  <div class="text-xl">🖥️</div>
                  <div>
                    <div class="font-medium text-slate-900">/mini</div>
                    <div class="text-sm text-slate-500">Mini PC Dashboard</div>
                  </div>
                </div>
              </a>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">🏠</div>
                  <div>
                    <div class="font-medium text-slate-500">Home Assistant</div>
                    <div class="text-sm text-slate-400">
                      Smart home automation
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">☁️</div>
                  <div>
                    <div class="font-medium text-slate-500">NextCloud</div>
                    <div class="text-sm text-slate-400">
                      Private cloud storage
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">⚡</div>
                  <div>
                    <div class="font-medium text-slate-500">n8n</div>
                    <div class="text-sm text-slate-400">
                      Workflow automation
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">🐳</div>
                  <div>
                    <div class="font-medium text-slate-500">Portainer</div>
                    <div class="text-sm text-slate-400">Docker management</div>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">🤖</div>
                  <div>
                    <div class="font-medium text-slate-500">LiteLLM</div>
                    <div class="text-sm text-slate-400">LLM proxy server</div>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">💬</div>
                  <div>
                    <div class="font-medium text-slate-500">Open WebUI</div>
                    <div class="text-sm text-slate-400">AI chat interface</div>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">📊</div>
                  <div>
                    <div class="font-medium text-slate-500">Grafana</div>
                    <div class="text-sm text-slate-400">Metrics dashboard</div>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">📈</div>
                  <div>
                    <div class="font-medium text-slate-500">Prometheus</div>
                    <div class="text-sm text-slate-400">Monitoring system</div>
                  </div>
                </div>
              </div>
              <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center gap-3">
                  <div class="text-xl">🔒</div>
                  <div>
                    <div class="font-medium text-slate-500">Tailscale</div>
                    <div class="text-sm text-slate-400">VPN access layer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* External URLs */}
          <div class="bg-white border border-slate-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span class="text-lg">🔗</span>
              Public Links & Social
            </h2>
            <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(urls).map(([url, target]) => (
                <UrlCard key={url} url={url} target={target} internal={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UrlCard(
  { url, target, internal }: {
    url: string;
    target: string | UrlConfig;
    internal: boolean;
  },
) {
  const href = typeof target === "object" ? target.target : target;
  const desc = typeof target === "object" ? target.desc : null;
  const isExternal = !internal && !href.startsWith("/");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      class="p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all block"
    >
      <div class="flex items-center gap-3">
        <div class="text-xl">
          {internal ? "⚙️" : isExternal ? "🌐" : "📄"}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-slate-900 truncate">{url}</div>
          {desc && <div class="text-sm text-slate-500 truncate">{desc}</div>}
        </div>
        {isExternal && (
          <div class="text-slate-400">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              >
              </path>
            </svg>
          </div>
        )}
      </div>
    </a>
  );
}
