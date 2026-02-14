import type { GitHubUser, GitHubEvent, CommitData } from '../types/github.js';

// Cache TTL: 1 hour (3600 seconds)
const CACHE_TTL = 3600;

// Fetch GitHub user data with KV caching
export async function fetchGitHubUser(
  username: string,
  cache?: KVNamespace
): Promise<GitHubUser | null> {
  const cacheKey = `user:${username.toLowerCase()}`;

  // Try to get from cache first
  if (cache) {
    try {
      const cached = await cache.get(cacheKey, 'json');
      if (cached) {
        console.log('Cache hit for user:', username);
        return cached as GitHubUser;
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
  }

  // Fetch from GitHub API
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();

    // Store in cache
    if (cache) {
      try {
        await cache.put(cacheKey, JSON.stringify(user), {
          expirationTtl: CACHE_TTL,
        });
        console.log('Cached user data for:', username);
      } catch (error) {
        console.error('Cache write error:', error);
      }
    }

    return user;
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

// Fetch GitHub user events for commit graph with KV caching
export async function fetchGitHubEvents(
  username: string,
  cache?: KVNamespace
): Promise<GitHubEvent[]> {
  const cacheKey = `events:${username.toLowerCase()}`;

  // Try to get from cache first
  if (cache) {
    try {
      const cached = await cache.get(cacheKey, 'json');
      if (cached) {
        console.log('Cache hit for events:', username);
        return cached as GitHubEvent[];
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
  }

  // Fetch from GitHub API
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return [];
    }

    const events = await response.json();

    // Store in cache
    if (cache) {
      try {
        await cache.put(cacheKey, JSON.stringify(events), {
          expirationTtl: CACHE_TTL,
        });
        console.log('Cached events data for:', username);
      } catch (error) {
        console.error('Cache write error:', error);
      }
    }

    return events;
  } catch (error) {
    console.error('Error fetching GitHub events:', error);
    return [];
  }
}

// Process events into commit data for the last 12 weeks
export function processCommitData(events: GitHubEvent[]): CommitData[] {
  const commitMap = new Map<string, number>();
  const today = new Date();
  const twelveWeeksAgo = new Date(today.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);

  // Count PushEvents by date
  events.forEach((event) => {
    if (event.type === 'PushEvent') {
      const eventDate = new Date(event.created_at);
      if (eventDate >= twelveWeeksAgo) {
        const dateKey = eventDate.toISOString().split('T')[0];
        commitMap.set(dateKey, (commitMap.get(dateKey) || 0) + 1);
      }
    }
  });

  // Generate array of last 84 days (12 weeks)
  const commitData: CommitData[] = [];
  for (let i = 83; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = date.toISOString().split('T')[0];
    commitData.push({
      date: dateKey,
      count: commitMap.get(dateKey) || 0,
    });
  }

  return commitData;
}
