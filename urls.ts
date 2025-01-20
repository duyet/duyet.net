export type UrlConfig = {
  target: string;
  desc: string;
  system?: boolean;
};

export type Urls = Record<
  string,
  string | UrlConfig
>;

export const urls: Urls = {
  "/ls": { target: "/ls", desc: "this page", system: true },
  "/ping": { target: "/ping", desc: "pong", system: true },
  "/health": { target: "/health", desc: "are you ok?", system: true },
  "/stats": { target: "/stats", desc: "counting stats", system: true },
  "/mini": { target: "/mini", desc: "minipc stats", system: true },

  "/": "https://duyet.net",
  "/blog": "https://blog.duyet.net",
  "/cv": "https://cv.duyet.net",
  "/about": "https://blog.duyet.net/about",
  "/i": { target: "https://insights.duyet.net", desc: "insights" },
  "/in": { target: "https://linkedin.com/in/duyet", desc: "linkedin" },
  "/rs": {
    target: "https://rust-tieng-viet.github.io",
    desc: "Rust Tiếng Việt",
  },
  "/github": {
    target: "https://github.com/duyet",
    desc: "@duyet on Github",
  },
  "/monitor": {
    target: "https://clickhouse-monitoring.vercel.app",
    desc: "ClickHouse Monitoring UI",
  },
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
    "https://script.google.com/macros/s/AKfycbxMwI-TYN05oHfqHB5nwO80WwpHuYsqSFqYakgLtICljYaJ_pPZlNQuY1_RE1xG3joL/exec",
  "/api/nini": "https://duyet.net/api_nini",
};
