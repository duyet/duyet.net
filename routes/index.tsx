import { Header } from "@/components/ui/header.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  className="h-20 w-20 rounded-full border-2 border-border animate-float"
                  src="/logo.svg"
                  alt="duyet.net logo"
                />
                <div className="absolute -bottom-2 -right-2">
                  <Badge variant="default" className="h-6 px-2 text-xs">
                    Data Engineer
                  </Badge>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Welcome to duyet.net
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Personal hub for data engineering insights, tools, and projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <a href="/blog" className="block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      📝
                    </div>
                    <div>
                      <h3 className="font-semibold">Blog</h3>
                      <p className="text-sm text-muted-foreground">
                        Technical writings
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Deep dives into data engineering, analytics, and modern tech
                    stacks.
                  </p>
                </CardContent>
              </a>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <a href="/cv" className="block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      👨‍💻
                    </div>
                    <div>
                      <h3 className="font-semibold">Resume</h3>
                      <p className="text-sm text-muted-foreground">
                        Professional experience
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    My journey through data engineering and software
                    development.
                  </p>
                </CardContent>
              </a>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <a href="/insights" className="block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      📈
                    </div>
                    <div>
                      <h3 className="font-semibold">Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        Data platform
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analytics dashboards and data visualization projects.
                  </p>
                </CardContent>
              </a>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <a href="/mcp" className="block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      🔗
                    </div>
                    <div>
                      <h3 className="font-semibold">MCP</h3>
                      <p className="text-sm text-muted-foreground">
                        Protocol tools
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Model Context Protocol implementations and utilities.
                  </p>
                </CardContent>
              </a>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <a href="/stats" className="block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      📊
                    </div>
                    <div>
                      <h3 className="font-semibold">Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Traffic insights
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Real-time website analytics and visitor statistics.
                  </p>
                </CardContent>
              </a>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <a href="/mini" className="block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      🖥️
                    </div>
                    <div>
                      <h3 className="font-semibold">Mini PC</h3>
                      <p className="text-sm text-muted-foreground">
                        Server monitoring
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Real-time system metrics and performance monitoring.
                  </p>
                </CardContent>
              </a>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <a href="/llms.txt" className="block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-semibold">LLMs.txt</h3>
                      <p className="text-sm text-muted-foreground">
                        AI resources
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Machine-readable information for AI assistants.
                  </p>
                </CardContent>
              </a>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative">
              <a href="/live" className="block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      📡
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Live</h3>
                        <Badge variant="default" className="h-5 text-xs">
                          New
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Real-time users
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Live user tracking and real-time visitor analytics.
                  </p>
                </CardContent>
              </a>
            </Card>
          </div>

          <div className="text-center">
            <Card className="inline-block">
              <CardContent className="p-4">
                <a
                  href="/ls"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2"
                >
                  View all links and shortcuts
                  <span className="text-xs">→</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
