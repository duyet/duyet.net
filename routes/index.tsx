export default function Home() {
  return (
    <div class="px-4 py-6 mx-auto min-h-screen flex bg-slate-50">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="mb-4"
          src="/logo.svg"
          width="80"
          height="80"
          alt="duyet.net logo"
        />
        <div class="flex flex-col gap-6 items-center w-full">
          <div class="text-center">
            <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
              duyet.net
            </h1>
            <p class="text-base text-slate-600">
              Data Engineering
            </p>
          </div>

          <div class="space-y-4 w-full max-w-lg">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <a
                href="/blog"
                class="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="text-xl mb-1">📝</div>
                <div class="font-medium text-slate-900 text-sm">Blog</div>
                <div class="text-xs text-slate-500">My thoughts</div>
              </a>

              <a
                href="/cv"
                class="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="text-xl mb-1">👨‍💻</div>
                <div class="font-medium text-slate-900 text-sm">Resume</div>
                <div class="text-xs text-slate-500">Experience</div>
              </a>

              <a
                href="/insights"
                class="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="text-xl mb-1">📈</div>
                <div class="font-medium text-slate-900 text-sm">Insights</div>
                <div class="text-xs text-slate-500">Data platform</div>
              </a>

              <a
                href="/mcp"
                class="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="text-xl mb-1">🔗</div>
                <div class="font-medium text-slate-900 text-sm">MCP</div>
                <div class="text-xs text-slate-500">Protocol tools</div>
              </a>

              <a
                href="/stats"
                class="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="text-xl mb-1">📊</div>
                <div class="font-medium text-slate-900 text-sm">Analytics</div>
                <div class="text-xs text-slate-500">Traffic insights</div>
              </a>

              <a
                href="/mini"
                class="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="text-xl mb-1">🖥️</div>
                <div class="font-medium text-slate-900 text-sm">Mini PC</div>
                <div class="text-xs text-slate-500">Server dashboard</div>
              </a>

              <a
                href="/llms.txt"
                class="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="text-xl mb-1">🤖</div>
                <div class="font-medium text-slate-900 text-sm">LLMs.txt</div>
                <div class="text-xs text-slate-500">AI resources</div>
              </a>

              <a
                href="/live"
                class="text-center p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div class="text-xl mb-1">📡</div>
                <div class="font-medium text-slate-900 text-sm">Live</div>
                <div class="text-xs text-slate-500">Real-time users</div>
              </a>
            </div>

            <div class="flex justify-center pt-2">
              <a
                href="/ls"
                class="text-slate-500 hover:text-slate-700 transition-colors text-sm"
              >
                All Links →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
