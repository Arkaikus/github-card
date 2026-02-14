import type { GitHubUser, CommitData } from '../types/github.js';
import { themes } from '../themes.js';

// Read template and generate card
export function generateCardTemplate(
  user: GitHubUser,
  theme: keyof typeof themes,
  width: number,
  height: number,
  commitData: CommitData[] = []
) {
  const colors = themes[theme] || themes.default;

  // Calculate commit intensity for color mapping
  const maxCommits = Math.max(...commitData.map((d) => d.count), 1);
  const getCommitColor = (count: number) => {
    if (count === 0) return colors.border;
    const intensity = Math.min(count / maxCommits, 1);
    // Create gradient from low to high intensity
    const alpha = 0.2 + intensity * 0.8;
    return `${colors.accent}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  };

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
        gap: '0.5rem',
      },
      children: [
        // Header Row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              // border: `1px solid ${colors.border}`,
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
        // Bio Row
        user.bio
        && {
          type: 'p',
          props: {
            style: {
              fontSize: '16px',
              color: colors.text,
              lineHeight: 1.5,
              // border: `1px solid ${colors.border}`,
            },
            children: user.bio,
          },
        },
        // Location/Company and Commit Graph Row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: '0.5rem',
              padding: '0.5rem 0',
              // border: `1px solid ${colors.border}`,
              justifyContent: 'space-between',
              width: '100%',
            },
            children: [
              // Left: Location and Company
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    // flex: '0 0 auto',
                  },
                  children: [
                    user.location && {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          color: colors.secondary,
                        },
                        children: `📍 ${user.location}`,
                      },
                    },
                    user.company
                    && {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          color: colors.secondary,
                        },
                        children: `🏢 ${user.company.replace(/^@/, '')}`,
                      },
                    },
                  ].filter(Boolean),
                },
              },
              // Right: Commit Graph
              commitData &&
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px',
                    width: '100%',
                  },
                  children: Array.from({ length: 12 }, (_, weekIndex) => ({
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                      },
                      children: Array.from({ length: 7 }, (_, dayIndex) => {
                        const dataIndex = weekIndex * 7 + dayIndex;
                        const day = commitData[dataIndex];
                        return day ? {
                          type: 'div',
                          props: {
                            style: {
                              width: '10px',
                              height: '10px',
                              backgroundColor: getCommitColor(day.count),
                              borderRadius: '2px',
                            },
                            title: `${day.date}: ${day.count} commits`,
                          },
                        } : null;
                      }).filter(Boolean),
                    },
                  })),
                },
              },
            ].filter(Boolean),
          },
        },
        // Stats Row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: '1rem',
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
