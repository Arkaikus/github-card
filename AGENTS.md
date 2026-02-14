# Agent Notes

## Package Manager

**Use Bun instead of bun/ for better performance:**

```bash
# Install dependencies
bun install

# Run dev server
bun run dev
# or
wrangler dev

# Deploy
bun run deploy
# or
wrangler deploy

# Run tests
bun test
```

## Project Structure

After refactoring, the codebase is organized as follows:

```
src/
├── index.ts                    # Entry point (~17 lines) - app initialization only
├── routes/
│   ├── handlers.ts            # Route handler functions
│   └── validation.ts          # Parameter validation logic
├── services/
│   ├── github.ts              # GitHub API client
│   └── image-generator.ts     # SVG/PNG generation orchestration
├── templates/
│   └── card-template.ts       # Card JSX template generation
├── utils/
│   ├── fonts.ts               # Font loading utilities
│   └── emoji.ts               # Emoji loading utilities
├── types/
│   └── github.ts              # GitHubUser interface and related types
├── themes.ts                  # Theme definitions
└── doc-template.ts            # Documentation HTML template
```

## Benefits of New Structure

1. **Single Responsibility**: Each file has one clear purpose
2. **Testability**: Services and utilities can be unit tested independently
3. **Maintainability**: Easy to find and modify specific functionality
4. **Scalability**: Easy to add new themes, templates, or API integrations
5. **Clean Entry Point**: `index.ts` is now only ~17 lines (down from 381)

## KV Caching

GitHub API responses are cached using Cloudflare Workers KV to avoid rate limiting:

- **Cache TTL**: 1 hour (3600 seconds)
- **Cached data**: User profiles and events
- **Cache keys**: `user:{username}` and `events:{username}`
- **Local development**: Automatic local KV namespace (preview_id)
- **Production**: Requires KV namespace creation on Cloudflare dashboard

The cache is automatically used in both local development and production. During local development, wrangler creates a local KV namespace automatically.

## Quick Commands

```bash
# Start local development (wrangler is already installed)
wrangler dev

# Deploy to Cloudflare
wrangler deploy

# Generate TypeScript types for Cloudflare bindings
wrangler types

# Tail logs from deployed worker
wrangler tail
```

## Adding New Features

### Adding a New Theme

1. Edit `templates/themes.json`
2. Add your theme colors
3. Test locally with `?theme=yourtheme`

### Adding New Card Elements

1. Edit `src/templates/card-template.ts`
2. Modify the `generateCardTemplate` function
3. Test locally

### Adding New Routes

1. Add handler to `src/routes/handlers.ts`
2. Register route in `src/index.ts`
3. Add validation if needed in `src/routes/validation.ts`

# Cloudflare Workers

STOP. Your knowledge of Cloudflare Workers APIs and limits may be outdated. Always retrieve current documentation before any Workers, KV, R2, D1, Durable Objects, Queues, Vectorize, AI, or Agents SDK task.

## Docs

- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

For all limits and quotas, retrieve from the product's `/platform/limits/` page. eg. `/workers/platform/limits`

## Commands

| Command | Purpose |
|---------|---------|
| `wrangler dev` | Local development |
| `wrangler deploy` | Deploy to Cloudflare |
| `wrangler types` | Generate TypeScript types |

Run `wrangler types` after changing bindings in wrangler.jsonc.

## Node.js Compatibility

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

## Errors

- **Error 1102** (CPU/Memory exceeded): Retrieve limits from `/workers/platform/limits/`
- **All errors**: https://developers.cloudflare.com/workers/observability/errors/

## Product Docs

Retrieve API references and limits from:
`/kv/` · `/r2/` · `/d1/` · `/durable-objects/` · `/queues/` · `/vectorize/` · `/workers-ai/` · `/agents/`
