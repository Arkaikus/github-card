import { Hono } from 'hono';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-wasm';
import { themes, Theme } from './themes.js';
import { docHTML } from './doc-template.js';

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

// Read template and generate card
function readTemplate(user: GitHubUser, theme: keyof typeof themes, width: number, height: number) {
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
  return c.html(docHTML);
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
    const template = readTemplate(user, theme, width, height);
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
