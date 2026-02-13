import { Hono } from 'hono';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-wasm';

// Helper for JSX
function h(tag: string, props: any, ...children: any[]): any {
  return { tag, props: props || {}, children };
}

const app = new Hono();

// GitHub API types
interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

// Theme configurations
const themes = {
  default: {
    bg: '#ffffff',
    text: '#1f2328',
    secondary: '#656d76',
    accent: '#0969da',
    border: '#d0d7de',
  },
  dark: {
    bg: '#0d1117',
    text: '#e6edf3',
    secondary: '#7d8590',
    accent: '#2f81f7',
    border: '#30363d',
  },
  ocean: {
    bg: '#0c4a6e',
    text: '#f0f9ff',
    secondary: '#bae6fd',
    accent: '#38bdf8',
    border: '#075985',
  },
};

// Fetch GitHub user data
async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'GitHub-Card-Worker',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

// Load font for Satori
async function loadFont() {
  const fontResponse = await fetch(
    'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-400-normal.woff'
  );
  const fontData = await fontResponse.arrayBuffer();
  return fontData;
}

// Generate card template
function generateCardTemplate(user: GitHubUser, theme: keyof typeof themes, width: number, height: number) {
  const colors = themes[theme] || themes.default;

  return {
    tag: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: colors.bg,
        padding: '40px',
        fontFamily: 'Inter, sans-serif',
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
      },
    },
    children: [
      {
        tag: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px',
          },
        },
        children: [
          {
            tag: 'img',
            props: {
              src: user.avatar_url,
              width: 80,
              height: 80,
              style: {
                borderRadius: '50%',
                marginRight: '20px',
              },
            },
            children: [],
          },
          {
            tag: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
            },
            children: [
              {
                tag: 'div',
                props: {
                  style: {
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: '4px',
                  },
                },
                children: [user.name || user.login],
              },
              {
                tag: 'div',
                props: {
                  style: {
                    fontSize: '18px',
                    color: colors.secondary,
                  },
                },
                children: [`@${user.login}`],
              },
            ],
          },
        ],
      },
      user.bio
        ? {
            tag: 'div',
            props: {
              style: {
                fontSize: '16px',
                color: colors.text,
                marginBottom: '24px',
                lineHeight: 1.5,
              },
            },
            children: [user.bio],
          }
        : null,
      {
        tag: 'div',
        props: {
          style: {
            display: 'flex',
            gap: '32px',
            marginTop: 'auto',
          },
        },
        children: [
          {
            tag: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
            },
            children: [
              {
                tag: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: colors.accent,
                  },
                },
                children: [String(user.public_repos)],
              },
              {
                tag: 'div',
                props: {
                  style: {
                    fontSize: '14px',
                    color: colors.secondary,
                  },
                },
                children: ['Repos'],
              },
            ],
          },
          {
            tag: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
            },
            children: [
              {
                tag: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: colors.accent,
                  },
                },
                children: [String(user.followers)],
              },
              {
                tag: 'div',
                props: {
                  style: {
                    fontSize: '14px',
                    color: colors.secondary,
                  },
                },
                children: ['Followers'],
              },
            ],
          },
          {
            tag: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
            },
            children: [
              {
                tag: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: colors.accent,
                  },
                },
                children: [String(user.following)],
              },
              {
                tag: 'div',
                props: {
                  style: {
                    fontSize: '14px',
                    color: colors.secondary,
                  },
                },
                children: ['Following'],
              },
            ],
          },
        ].filter(Boolean),
      },
    ].filter(Boolean),
  };
}

// Initialize resvg WASM (cached)
let isResvgInitialized = false;

async function initResvg() {
  if (!isResvgInitialized) {
    const wasmResponse = await fetch(
      'https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm'
    );
    const wasmBuffer = await wasmResponse.arrayBuffer();
    await (Resvg as any).initWasm(wasmBuffer);
    isResvgInitialized = true;
  }
}

// Root route
app.get('/', (c) => {
  return c.redirect('/doc');
});

// Documentation route
app.get('/doc', (c) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Card API - Documentation</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2328;
      background-color: #f6f8fa;
      padding: 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #0969da;
      margin-bottom: 20px;
      font-size: 2.5em;
    }
    h2 {
      color: #1f2328;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 1.8em;
      border-bottom: 2px solid #d0d7de;
      padding-bottom: 10px;
    }
    h3 {
      color: #656d76;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 1.3em;
    }
    p {
      margin-bottom: 15px;
      color: #656d76;
    }
    code {
      background-color: #f6f8fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9em;
    }
    pre {
      background-color: #f6f8fa;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 20px;
      border: 1px solid #d0d7de;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    ul {
      margin-left: 20px;
      margin-bottom: 15px;
    }
    li {
      margin-bottom: 8px;
      color: #656d76;
    }
    .example {
      margin-top: 20px;
      padding: 20px;
      background-color: #f6f8fa;
      border-radius: 6px;
      border-left: 4px solid #0969da;
    }
    .example img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin-top: 10px;
      border: 1px solid #d0d7de;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #d0d7de;
    }
    th {
      background-color: #f6f8fa;
      font-weight: 600;
      color: #1f2328;
    }
    td {
      color: #656d76;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 GitHub Card API</h1>
    <p>Generate beautiful GitHub profile cards as PNG images using this simple API.</p>

    <h2>📖 Usage</h2>
    <p>Make a GET request to generate a card for any GitHub user:</p>
    <pre><code>GET /:username</code></pre>

    <h3>Example:</h3>
    <pre><code>https://your-worker.workers.dev/octocat</code></pre>

    <h2>⚙️ Parameters</h2>
    <p>Customize your card with query parameters:</p>
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>width</code></td>
          <td>number</td>
          <td>600</td>
          <td>Card width in pixels (200-2000)</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td>number</td>
          <td>400</td>
          <td>Card height in pixels (200-2000)</td>
        </tr>
        <tr>
          <td><code>theme</code></td>
          <td>string</td>
          <td>default</td>
          <td>Color theme: <code>default</code>, <code>dark</code>, or <code>ocean</code></td>
        </tr>
      </tbody>
    </table>

    <h2>🎨 Themes</h2>
    <p>Choose from three built-in themes:</p>
    <ul>
      <li><strong>default</strong> - Clean light theme</li>
      <li><strong>dark</strong> - Dark mode theme</li>
      <li><strong>ocean</strong> - Blue ocean theme</li>
    </ul>

    <h2>💡 Examples</h2>
    
    <div class="example">
      <h3>Default Theme</h3>
      <pre><code>https://your-worker.workers.dev/octocat</code></pre>
      <p>Generates a default light-themed card.</p>
    </div>

    <div class="example">
      <h3>Dark Theme with Custom Size</h3>
      <pre><code>https://your-worker.workers.dev/octocat?theme=dark&width=800&height=500</code></pre>
      <p>Generates a dark-themed card with custom dimensions.</p>
    </div>

    <div class="example">
      <h3>Ocean Theme</h3>
      <pre><code>https://your-worker.workers.dev/octocat?theme=ocean</code></pre>
      <p>Generates an ocean-themed card.</p>
    </div>

    <h2>🔗 Use in Markdown</h2>
    <p>Embed your card in README files:</p>
    <pre><code>![GitHub Card](https://your-worker.workers.dev/octocat?theme=dark)</code></pre>

    <h2>📝 Response</h2>
    <p>The API returns a PNG image with:</p>
    <ul>
      <li>Content-Type: <code>image/png</code></li>
      <li>Cache-Control: <code>public, max-age=3600</code> (1 hour cache)</li>
    </ul>

    <h2>❌ Error Responses</h2>
    <ul>
      <li><strong>400 Bad Request</strong> - Invalid parameters</li>
      <li><strong>404 Not Found</strong> - GitHub user not found</li>
      <li><strong>500 Internal Server Error</strong> - Error generating card</li>
    </ul>

    <h2>📌 Card Information</h2>
    <p>Each card displays:</p>
    <ul>
      <li>User avatar</li>
      <li>Name and username</li>
      <li>Bio (if available)</li>
      <li>Number of public repositories</li>
      <li>Follower count</li>
      <li>Following count</li>
    </ul>

    <h2>🚀 Powered By</h2>
    <ul>
      <li><strong>Cloudflare Workers</strong> - Edge computing platform</li>
      <li><strong>Hono</strong> - Fast web framework</li>
      <li><strong>Satori</strong> - HTML/CSS to SVG conversion</li>
      <li><strong>Resvg</strong> - SVG to PNG rendering</li>
    </ul>
  </div>
</body>
</html>
  `;

  return c.html(html);
});

// Main route: Generate GitHub card
app.get('/:username', async (c) => {
  const username = c.req.param('username');
  const width = parseInt(c.req.query('width') || '600');
  const height = parseInt(c.req.query('height') || '400');
  const theme = (c.req.query('theme') || 'default') as keyof typeof themes;

  // Validate parameters
  if (!username) {
    return c.text('Username is required', 400);
  }

  if (width < 200 || width > 2000 || height < 200 || height > 2000) {
    return c.text('Width and height must be between 200 and 2000', 400);
  }

  // Fetch user data
  const user = await fetchGitHubUser(username);
  if (!user) {
    return c.text('User not found', 404);
  }

  try {
    // Load font
    const fontData = await loadFont();

    // Generate SVG using Satori
    const template = generateCardTemplate(user, theme, width, height);
    const svg = await satori(template, {
      width,
      height,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    });

    // Initialize resvg
    await initResvg();

    // Convert SVG to PNG using Resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: width,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Return PNG image
    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating card:', error);
    return c.text('Error generating card', 500);
  }
});

export default app;
