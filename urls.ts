export type Urls = Record<string, string | { target: string; desc: string }>;

export const urls: Urls = {
  "/": "https://duyet.net",
  "/blog": "https://blog.duyet.net",
  "/cv": "https://cv.duyet.net",
  "/about": "https://blog.duyet.net/about",
  "/i": { target: "https://insights.duyet.net", desc: "insights" },
  "/clickhouse": {
    target: "https://blog.duyet.net/tag/clickhouse",
    desc: "blog about clickhouse topic",
  },
  "/tiktok": {
    target: "https://www.tiktok.com/@duyet.net",
    desc: "@duyet.net on tiktok",
  },
  "/tt": {
    target: "https://www.tiktok.com/@duyet.net",
    desc: "alias for /tiktok",
  },
  "/un": {
    target: "https://unsplash.com/@_duyet",
    desc: "@_duyet on unsplash",
  },
  "/x": { target: "https://x.com/_duyet", desc: "@_duyet on X" },
  "/ni": "https://www.tiktok.com/@niniluungan",
  "/numi": "https://numi.app",
  "/ch": {
    target:
      "https://blog.duyet.net/series/clickhouse-on-kubernetes?utm_source=duyet.net&utm_medium=linkedin&utm_campaign=duyet.net",
    desc: "series about CH",
  },
  "/mo": "https://monica.im/invitation?c=RJF8T7RT",
  "/api_nini":
    "https://script.google.com/macros/s/AKfycbyiUXV00n3EbcU_39nzuZnB8uXsIq9RJ30msOeNOnESA_qz9tdWI9P1sCPrg25JPeUh/exec",
  "/api/nini": "https://duyet.net/api_nini",
};
