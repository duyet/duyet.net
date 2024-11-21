/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import "std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import { UserAgent } from "user_agent";

import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { kv } from "./libs/kv.ts";
import { getClickHouse } from "./libs/clickhouse.ts";

// Create a queue listener that will process enqueued messages
kv.listenQueue(async (msg) => {
  // console.log(`[${msg.method}] [${msg.ip}]:`, ...msg.msg);

  const ua = new UserAgent(msg.ua);
  const source = msg.msg[0];
  const target = msg.msg[2];

  const ch = getClickHouse();

  try {
    const resp = await fetch(ch.url, {
      method: "POST",
      headers: ch.headers,
      body:
        `INSERT INTO duyet_analytics.duyet_redirect (source, target, ip, user_agent, browser, os_name, os_version, device_type)
         VALUES ('${source}', '${target}', '${msg.ip}', '${msg.ua}', '${ua.browser.name}', '${ua.os.name}', '${ua.os.version}', '${ua.device.type}')`,
    });
    const json = await resp.json();
    console.log("Inserted logs to ClickHouse: ", json, ", msg:", msg);
  } catch (e) {
    console.error("ClickHouse error:", e, ", msg:", msg);
  }
});

await start(manifest, config);
