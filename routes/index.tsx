export default function Home() {
  return (
    <div className="min-h-screen">
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
            className="group rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&crop=center"
              alt="Blog"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="font-medium">Blog</div>
            </div>
          </a>

          <a
            href="/cv"
            className="group rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center"
              alt="Resume"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="font-medium">Resume</div>
            </div>
          </a>

          <a
            href="/insights"
            className="group rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center"
              alt="Insights"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="font-medium">Insights</div>
            </div>
          </a>

          <a
            href="/mcp"
            className="group rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400&h=300&fit=crop&crop=center"
              alt="MCP"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="font-medium">MCP</div>
            </div>
          </a>

          <a
            href="/stats"
            className="group rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center"
              alt="Analytics"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="font-medium">Analytics</div>
            </div>
          </a>

          <a
            href="/mini"
            className="group rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop&crop=center"
              alt="Mini PC"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="font-medium">Mini PC</div>
            </div>
          </a>

          <a
            href="/llms.txt"
            className="group rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center"
              alt="LLMs.txt"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="font-medium">LLMs.txt</div>
            </div>
          </a>

          <a
            href="/live"
            className="group rounded-lg overflow-hidden border hover:border-primary transition-colors relative"
          >
            <img
              src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center"
              alt="Live"
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="font-medium">Live</div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full">
              </div>
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
