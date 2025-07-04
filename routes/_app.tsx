import { type PageProps } from "$fresh/server.ts";
import LiveUsersBadge from "@/islands/LiveUsersBadge.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>duyet</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://cdn.seline.so/seline.js" async></script>
        <script src="https://j.duyet.net/p.js" async></script>
      </head>
      <body>
        <Component />
        <LiveUsersBadge />
      </body>
    </html>
  );
}
