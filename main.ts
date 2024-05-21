function getUrl(slug: string): string {
  const urls: Record<string, string> = {
    '/': 'https://blog.duyet.net',
    '/blog': 'https://blog.duyet.net',
    '/about': 'https://blog.duyet.net/about',
    '/i': 'https://insights.duyet.net',
    '/clickhouse': 'https://blog.duyet.net/tag/clickhouse',
  }

  return urls[slug] || urls['/']
}

Deno.serve(async (req: Request) => {
  const slug = '/' + (req.url.split('/').pop() || '')
  const url = getUrl(slug)

  console.log(slug, '==> redirecting to', url)

  return Response.redirect(url, 301)
})
