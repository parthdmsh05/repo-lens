/**
 * These types model the *subset* of the GitHub REST API responses that this
 * app actually uses. They are intentionally not exhaustive — GitHub's real
 * responses have many more fields we never touch.
 *
 * Docs: https://docs.github.com/en/rest
 */

// ---- Repository search: GET /search/repositories ----

export interface GitHubOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubOwner;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  license: { name: string; spdx_id: string } | null;
  created_at: string;
  updated_at: string;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

// ---- Languages: GET /repos/{owner}/{repo}/languages ----
// Raw shape is { "TypeScript": 48291, "CSS": 1023, ... } — bytes per language.
export type GitHubLanguagesRaw = Record<string, number>;

// Our transformed, UI-ready shape.
export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number; // 0-100, rounded to 1 decimal
}

// ---- Contributors: GET /repos/{owner}/{repo}/contributors ----

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

// ---- Commit activity: GET /repos/{owner}/{repo}/stats/commit_activity ----
// GitHub returns 52 weeks of data. Each entry covers one week.
export interface GitHubWeeklyCommitActivity {
  week: number; // unix timestamp, start of week
  total: number; // total commits that week
  days: number[]; // 7 entries, commits per day (Sun-Sat)
}

// ---- Standardized error shape used throughout the app ----
// GitHub errors, network errors, and rate-limit errors all get normalized
// into this so components only ever handle one error shape.
export type ApiErrorKind =
  | 'not_found'
  | 'rate_limited'
  | 'network'
  | 'unknown';

export interface ApiError {
  kind: ApiErrorKind;
  message: string;
  /** For rate limits, when the limit resets (unix seconds), if known. */
  resetAt?: number;
}
