# Deployment Guide

This guide explains how to deploy the GitHub Card worker to Cloudflare Workers.

## Prerequisites

- Node.js (v25 or later)
- bun
- A Cloudflare account (free tier is sufficient)

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

## Local Development

To test the worker locally:

```bash
bun run dev
```

The worker will be available at `http://localhost:8787`

### Testing Endpoints

- **Documentation**: http://localhost:8787/doc
- **Root**: http://localhost:8787/ (redirects to /doc)
- **Generate Card**: http://localhost:8787/octocat
- **With Parameters**: http://localhost:8787/octocat?theme=dark&width=800&height=500

## Deploy to Cloudflare Workers

### Deploy

```bash
bun run deploy
```

Or using wrangler directly:

```bash
wrangler deploy
```

### First Deployment

On your first deployment, Wrangler will:

1. Create a new Worker in your Cloudflare account
2. Upload the code
3. Provide you with a URL like `https://github-card.<your-subdomain>.workers.dev`

### Subsequent Deployments

Just run `bun run deploy` again to update the worker with your latest changes.

## Configuration

### Custom Domain (Optional)

To use a custom domain:

1. Add your domain to Cloudflare
2. In the Cloudflare dashboard, go to Workers & Pages
3. Select your worker
4. Click on "Triggers" tab
5. Add a custom domain under "Custom Domains"

### Environment Variables (Optional)

If you need to add environment variables (e.g., GitHub token for higher rate limits):

2. Set secrets securely:

```bash
 wrangler secret put GITHUB_TOKEN
```

Then update the code to use the token:

```typescript
const response = await fetch(`https://api.github.com/users/${username}`, {
  headers: {
    'User-Agent': 'GitHub-Card-Worker',
    'Authorization': env.GITHUB_TOKEN ? `token ${env.GITHUB_TOKEN}` : '',
  },
});
```

## Monitoring

### View Logs

```bash
wrangler tail
```

This will stream real-time logs from your deployed worker.

### Cloudflare Dashboard

1. Log in to your Cloudflare account
2. Navigate to Workers & Pages
3. Select your worker to view:
   - Request analytics
   - Error logs
   - Performance metrics

## Troubleshooting

### Deployment Errors

If deployment fails:

1. Ensure you're logged in: ` wrangler whoami`
2. Check your account limits (free tier has limits)
3. Verify your `wrangler.toml` is correct

### Runtime Errors

Check the logs:

```bash
wrangler tail
```

## Performance Optimization

### Caching

The worker already implements HTTP caching with `Cache-Control: public, max-age=3600`.

To improve performance further:

1. Use Cloudflare's Cache API to cache generated images
2. Add stale-while-revalidate headers
3. Implement edge caching for frequently requested profiles

### Rate Limits

GitHub API has rate limits:

- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour

For production use with high traffic, consider:

1. Adding a GitHub token (see Environment Variables above)
2. Implementing your own caching layer
3. Using Cloudflare KV or D1 to cache user data

## Cost

Cloudflare Workers free tier includes:

- 100,000 requests per day
- 10ms CPU time per request

This should be sufficient for most use cases. If you exceed these limits, Workers Paid ($5/month) provides:

- 10 million requests per month
- Additional requests at $0.50 per million

## Support

For issues:

1. Check the logs: ` wrangler tail`
2. Review Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
3. Open an issue on the GitHub repository

## Updates

To update your deployed worker:

```bash
git pull
bun install  # if dependencies changed
bun run deploy
```
