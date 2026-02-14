// GitHub API types
export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  company: string | null;
}

export interface GitHubEvent {
  type: string;
  created_at: string;
  repo?: {
    name: string;
  };
}

export interface CommitData {
  date: string;
  count: number;
}
