import type { GitHubUser } from '../types/github.js';
import { themes } from '../themes.js';

// Read template and generate card
export function generateCardTemplate(
  user: GitHubUser,
  theme: keyof typeof themes,
  width: number,
  height: number
) {
  const colors = themes[theme] || themes.default;

  return {
    type: 'div',
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
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            },
            children: [
              {
                type: 'img',
                props: {
                  src: user.avatar_url,
                  width: 80,
                  height: 80,
                  style: {
                    borderRadius: '50%',
                    marginRight: '20px',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '28px',
                          fontWeight: 'bold',
                          color: colors.text,
                          marginBottom: '4px',
                        },
                        children: user.name || user.login,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '18px',
                          color: colors.secondary,
                        },
                        children: `@${user.login}`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        user.bio
          ? {
              type: 'div',
              props: {
                style: {
                  fontSize: '16px',
                  color: colors.text,
                  marginBottom: '24px',
                  lineHeight: 1.5,
                },
                children: user.bio,
              },
            }
          : null,
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: '32px',
              marginTop: 'auto',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: colors.accent,
                        },
                        children: String(user.public_repos),
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '14px',
                          color: colors.secondary,
                        },
                        children: 'Repos',
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: colors.accent,
                        },
                        children: String(user.followers),
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '14px',
                          color: colors.secondary,
                        },
                        children: 'Followers',
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: colors.accent,
                        },
                        children: String(user.following),
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '14px',
                          color: colors.secondary,
                        },
                        children: 'Following',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}
