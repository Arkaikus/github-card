# GitHub Card

A Cloudflare Worker service that generates beautiful GitHub profile cards as PNG images.

## 🚀 Features

- **Dynamic GitHub Cards**: Generate profile cards for any GitHub user
- **Multiple Themes**: Choose from default, dark, and ocean themes
- **Customizable**: Adjust width and height via query parameters
- **Fast**: Powered by Cloudflare Workers edge computing
- **Smart Caching**: KV-based caching to avoid GitHub API rate limits
- **Built with Modern Tech**: Hono, Satori, and Resvg

## 📦 Installation

```bash
bun install
```

## 🛠️ Development

Start the development server locally:

```bash
bun run dev
```

The worker will be available at `http://localhost:8787`

## 🚢 Deployment

### First-time Setup

Before deploying, create a KV namespace for caching GitHub API responses:

```bash
# Create production KV namespace
wrangler kv namespace create "GITHUB_CACHE"

# Update wrangler.jsonc with the returned namespace ID
# Replace "preview_id" with the actual ID in the kv_namespaces section
```

### Deploy

Deploy to Cloudflare Workers:

```bash
bun run deploy
```

The KV cache will automatically store GitHub API responses for 1 hour, preventing rate limiting issues.

## 📖 Usage

### Generate a Card

Make a GET request to `/:username`:

```
https://your-worker.workers.dev/octocat
```

### Query Parameters

- `width` (number): Card width in pixels (200-2000, default: 600)
- `height` (number): Card height in pixels (200-2000, default: 400)
- `theme` (string): Color theme - `default`, `dark`, or `ocean` (default: default)

### Examples

```
# Default theme
https://your-worker.workers.dev/octocat

# Dark theme with custom size
https://your-worker.workers.dev/octocat?theme=dark&width=800&height=500

# Ocean theme
https://your-worker.workers.dev/octocat?theme=ocean
```

### Use in Markdown

Embed in README files:

```markdown
![GitHub Card](https://your-worker.workers.dev/octocat?theme=dark)
```

## 📄 Documentation

Visit `/doc` endpoint for full API documentation:

```
https://your-worker.workers.dev/doc
```

## 🎨 Themes

- **default**: Clean light theme
- **dark**: Dark mode theme
- **ocean**: Blue ocean theme

## Preview

![GitHub Card](https://github-card.arkaikus.workers.dev/arkaikus?theme=dark)

## 🏗️ Built With

- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing platform
- [Hono](https://hono.dev/) - Fast web framework
- [Satori](https://github.com/vercel/satori) - HTML/CSS to SVG conversion
- [Resvg](https://github.com/yisibl/resvg-js) - SVG to PNG rendering

## 📝 License

ISC

