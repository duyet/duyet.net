export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">duyet.net</h1>
              <span className="text-sm text-muted-foreground">
                | Data Engineer
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Access Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a
            href="/blog"
            className="bg-card border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blog</p>
                <p className="text-2xl font-semibold">Latest</p>
              </div>
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          </a>

          <a
            href="/stats"
            className="bg-card border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analytics</p>
                <p className="text-2xl font-semibold">Live</p>
              </div>
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </a>

          <a
            href="/mini"
            className="bg-card border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mini PC</p>
                <p className="text-2xl font-semibold">Online</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </a>

          <a
            href="/live"
            className="bg-card border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Users</p>
                <p className="text-2xl font-semibold">Active</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse">
              </div>
            </div>
          </a>
        </div>

        {/* Navigation Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Development</h3>
            <div className="space-y-3">
              <a
                href="/github"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">GitHub</span>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="/cv"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">Resume</span>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="/llms.txt"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">LLMs.txt</span>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Analytics</h3>
            <div className="space-y-3">
              <a
                href="/stats"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">Statistics</span>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="/live"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">Live Users</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </a>
              <a
                href="/mini"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">System Monitor</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </a>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Tools</h3>
            <div className="space-y-3">
              <a
                href="/mcp"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">MCP Server</span>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="/ls"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">All Links</span>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </a>
              <a
                href="/health"
                className="flex items-center justify-between py-2 hover:text-foreground transition-colors"
              >
                <span className="text-sm">Health Check</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
