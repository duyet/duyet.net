# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a Deno-based web application built with Fresh framework that serves as a
URL shortener and redirection service for duyet.net. The application also
includes monitoring dashboards for Mini PC statistics and system analytics.

## Core Architecture

### Framework Stack

- **Deno**: Runtime environment with TypeScript support
- **Fresh**: Full-stack web framework with SSR and islands architecture
- **Preact**: React-compatible UI library for components
- **TailwindCSS**: Utility-first CSS framework
- **ClickHouse**: Analytics database for tracking redirections

### Key Components

- **URL Redirections**: Maps short URLs to targets via `urls.ts` config
- **Analytics**: Tracks clicks and user behavior in ClickHouse
- **Mini PC Dashboard**: Real-time monitoring with charts (temperature, power,
  memory)
- **Islands**: Interactive client-side components (EChart.tsx, theme.ts)

### Directory Structure

```
routes/           # Fresh file-based routing
├── [...redirect] # Catch-all route for URL redirections
├── stats/        # Analytics dashboard
└── mini/         # Mini PC monitoring

components/       # Reusable server components
islands/          # Client-side interactive components  
libs/             # Utilities and data fetching
static/           # Static assets
```

## Essential Commands

### Development

```bash
# Start development server with hot reload
deno task start

# Debug mode with inspector
deno task debug

# Build for production
deno task build

# Preview production build
deno task preview
```

### Quality & Testing

```bash
# Run all checks (format, lint, type check)
deno task check

# Run tests with coverage
deno task test:coverage

# Format code
deno fmt

# Lint code
deno lint

# Type check specific files
deno check **/*.ts **/*.tsx
```

### Git Hooks

```bash
# Install pre-commit hooks
deno task hooks:install

# Pre-commit runs: format, lint, test coverage
deno task hooks:pre-commit
```

## Data Layer

### URL Configuration

- **File**: `urls.ts` - Central mapping of short URLs to targets
- **Format**: Supports string targets or `UrlConfig` objects with metadata
- **System routes**: Internal pages marked with `system: true`

### Analytics Pipeline

1. **Logging**: User requests logged via `libs/utils.ts:getLogger()`
2. **Queue**: Events queued in Deno KV store
3. **Processing**: Background worker processes queue into ClickHouse
4. **Dashboards**: Stats displayed via chart components

### Environment Variables

Required for ClickHouse integration:

- `CLICKHOUSE_URL`
- `CLICKHOUSE_USER`
- `CLICKHOUSE_PASSWORD`

## Code Patterns

### Route Handlers

- Use Fresh `Handlers` export with HTTP method functions
- Access request context via `FreshContext`
- Return `Response` objects for redirects/data

### Data Fetching

- Utilities in `libs/` for ClickHouse queries
- Use `clickhouseQuery<Type>()` helper for typed responses
- Handle errors gracefully with fallbacks

### Components

- **Server Components**: In `components/` for SSR
- **Islands**: In `islands/` for client interactivity
- **Props**: Use TypeScript interfaces for type safety

### Import Paths

- Use `@/` for root imports
- Path aliases configured in `deno.json` imports map
- Prefer absolute imports over relative

## Testing Strategy

- Unit tests for utilities (`*.test.ts`)
- Integration tests for data fetching
- Coverage reports generated to `cov/` directory
- Use `--allow-all --unstable-kv` flags for test runs
