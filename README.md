# duyet.net

Simple redirect application built with Deno. It redirects various slugs to their corresponding URLs.

The application maps predefined slugs to specific URLs and performs HTTP 301 redirects.

## Local Development

To run the application locally, use the following command:

```bash
deno run --allow-net --watch main.ts
```

## Deployment

```bash
deployctl deploy
```
