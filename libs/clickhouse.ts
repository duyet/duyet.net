export const getClickHouse = (): {
  url: string;
  headers: Record<string, string>;
} => {
  if (
    !Deno.env.get("CLICKHOUSE_URL") ||
    !Deno.env.get("CLICKHOUSE_USER") ||
    !Deno.env.get("CLICKHOUSE_PASSWORD")
  ) {
    throw new Error(
      "Missing CLICKHOUSE_URL, CLICKHOUSE_USER or CLICKHOUSE_PASSWORD",
    );
  }

  return {
    url: Deno.env.get("CLICKHOUSE_URL")!,
    headers: {
      "X-ClickHouse-User": Deno.env.get("CLICKHOUSE_USER")!,
      "X-ClickHouse-Key": Deno.env.get("CLICKHOUSE_PASSWORD")!,
    },
  };
};

export interface ClickHouseResponse<T> {
  meta: Array<Record<string, string>>;
  data: Array<T>;
}

export const clickhouseQuery = async <Row>(
  query: string,
): Promise<ClickHouseResponse<Row>> => {
  const ch = getClickHouse();
  console.log(ch);

  const resp = await fetch(ch.url, {
    method: "POST",
    headers: ch.headers,
    body: `${query} \nFormat JSON;`,
  });

  const text = await resp.text();
  console.log("query and response", query, text);

  const json: ClickHouseResponse<Row> = JSON.parse(text) || [];
  return json;
};
