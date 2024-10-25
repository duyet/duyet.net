// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_redirect_index from "./routes/[...redirect]/index.ts";
import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $ads_txt from "./routes/ads.txt.ts";
import * as $api_joke from "./routes/api/joke.ts";
import * as $health from "./routes/health.ts";
import * as $index from "./routes/index.tsx";
import * as $ls from "./routes/ls.ts";
import * as $ping from "./routes/ping.ts";
import * as $robots_txt from "./routes/robots.txt.ts";
import * as $stats_index from "./routes/stats/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/[...redirect]/index.ts": $_redirect_index,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/ads.txt.ts": $ads_txt,
    "./routes/api/joke.ts": $api_joke,
    "./routes/health.ts": $health,
    "./routes/index.tsx": $index,
    "./routes/ls.ts": $ls,
    "./routes/ping.ts": $ping,
    "./routes/robots.txt.ts": $robots_txt,
    "./routes/stats/index.tsx": $stats_index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
