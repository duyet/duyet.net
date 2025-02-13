export interface RedirectionStats {
  source: string;
  count: number;
}

export const query = `
    SELECT
        source,
        count() as count
    FROM duyet_analytics.duyet_redirect
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT 200
`;
