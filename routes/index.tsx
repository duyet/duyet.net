export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" className="h-6 w-6" alt="duyet.net" />
              <span className="font-medium">duyet</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <a
                href="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </a>
              <a
                href="/cv"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Resume
              </a>
              <a
                href="/stats"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Analytics
              </a>
              <a
                href="/mini"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Mini PC
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-light mb-6">Data Engineering</h1>
          <p className="text-xl text-muted-foreground">
            Tools, insights, and projects
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/blog"
            className="group p-6 rounded-lg border hover:border-primary transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium">Blog</div>
          </a>

          <a
            href="/cv"
            className="group p-6 rounded-lg border hover:border-primary transition-colors"
          >
            <div className="text-2xl mb-2">👨‍💻</div>
            <div className="font-medium">Resume</div>
          </a>

          <a
            href="/insights"
            className="group p-6 rounded-lg border hover:border-primary transition-colors"
          >
            <div className="text-2xl mb-2">📈</div>
            <div className="font-medium">Insights</div>
          </a>

          <a
            href="/mcp"
            className="group p-6 rounded-lg border hover:border-primary transition-colors"
          >
            <div className="text-2xl mb-2">🔗</div>
            <div className="font-medium">MCP</div>
          </a>

          <a
            href="/stats"
            className="group p-6 rounded-lg border hover:border-primary transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Analytics</div>
          </a>

          <a
            href="/mini"
            className="group p-6 rounded-lg border hover:border-primary transition-colors"
          >
            <div className="text-2xl mb-2">🖥️</div>
            <div className="font-medium">Mini PC</div>
          </a>

          <a
            href="/llms.txt"
            className="group p-6 rounded-lg border hover:border-primary transition-colors"
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-medium">LLMs.txt</div>
          </a>

          <a
            href="/live"
            className="group p-6 rounded-lg border hover:border-primary transition-colors relative"
          >
            <div className="text-2xl mb-2">📡</div>
            <div className="font-medium">Live</div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full">
            </div>
          </a>
        </div>

        <div className="text-center mt-12">
          <a
            href="/ls"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            All links →
          </a>
        </div>
      </main>
    </div>
  );
}
