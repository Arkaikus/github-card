declare module '*.html' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

// Cloudflare Workers KV binding
interface Env {
  GITHUB_CACHE: KVNamespace;
}
