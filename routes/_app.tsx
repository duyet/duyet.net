import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>duyet</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://cdn.seline.so/seline.js" async></script>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
