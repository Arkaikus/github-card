# Contributing Guide

Thank you for your interest in contributing to the GitHub Card project!

## Development Setup

1. **Fork and Clone**

```bash
git clone https://github.com/YOUR-USERNAME/github-card.git
cd github-card
```

2. **Install Dependencies**

**Note: Use bun instead of bun for better performance**

```bash
bun install
# or if you prefer bun
bun install
```

3. **Run Locally**

Wrangler is already installed in the project:

```bash
bun run dev
# or
wrangler dev
```

## Project Structure

```
github-card/
├── src/
│   ├── index.ts                  # Entry point (~17 lines)
│   ├── routes/
│   │   ├── handlers.ts          # Route handlers
│   │   └── validation.ts        # Parameter validation
│   ├── services/
│   │   ├── github.ts            # GitHub API client
│   │   └── image-generator.ts   # Image generation
│   ├── templates/
│   │   └── card-template.ts     # Card template
│   ├── utils/
│   │   ├── fonts.ts             # Font utilities
│   │   └── emoji.ts             # Emoji utilities
│   ├── types/
│   │   └── github.ts            # Type definitions
│   ├── themes.ts                # Theme definitions
│   └── doc-template.ts          # Documentation HTML
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── wrangler.jsonc               # Cloudflare Workers config
├── README.md                    # Project documentation
├── DEPLOYMENT.md                # Deployment guide
├── DEV.md                       # Development notes
└── CONTRIBUTING.md              # This file
```

## Code Style

- Use TypeScript for all code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

## Making Changes

1. **Create a Branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make Your Changes**

- Edit files in `src/`
- Build and test locally
- Ensure TypeScript compiles without errors

3. **Test Your Changes**

```bash
bun run dev
# or
wrangler dev
```

Then test the endpoints:

- http://localhost:8787/doc
- http://localhost:8787/octocat
- http://localhost:8787/octocat?theme=dark

4. **Commit Your Changes**

```bash
git add .
git commit -m "Description of your changes"
```

5. **Push and Create PR**

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Adding New Features

### Adding a New Theme

1. Add theme colors to the `themes` object in `src/index.ts`:

```typescript
const themes = {
  // ... existing themes
  yourtheme: {
    bg: '#000000',
    text: '#ffffff',
    secondary: '#cccccc',
    accent: '#ff0000',
    border: '#333333',
  },
};
```

2. Update the documentation in the `/doc` route
3. Test the new theme locally

### Adding New Card Elements

1. Modify the `generateCardTemplate` function in `src/index.ts`
2. Add new data from the `GitHubUser` interface
3. Style with Tailwind-like CSS properties
4. Test rendering locally

### Adding Query Parameters

1. Add parameter parsing in the route handler
2. Update validation logic
3. Pass to `generateCardTemplate` or `satori`
4. Document in `/doc` route

## Testing

Currently, manual testing is required. When testing:

1. Test all themes (default, dark, ocean)
2. Test various usernames
3. Test query parameters
4. Test error cases (invalid user, invalid params)
5. Verify the /doc page renders correctly

## Build and Deploy

TypeScript compilation is handled automatically by Wrangler.

```bash
# Deploy to Cloudflare
bun run deploy
# or
wrangler deploy
```

## Dependencies

When adding new dependencies:

1. Use `bun add <package>` (or `bun install <package>`)
2. Update package.json (automatic)
3. Test locally
4. Document if needed

## Questions?

Feel free to open an issue for:

- Bug reports
- Feature requests
- Questions about the code
- Suggestions for improvements

## License

By contributing, you agree that your contributions will be licensed under the project's ISC License.
