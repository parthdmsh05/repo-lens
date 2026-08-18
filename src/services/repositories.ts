import { githubGet } from './githubClient';
import type { GitHubSearchResponse } from '../types/github';

/**
 * Search repositories by name/keyword.
 * GitHub endpoint: GET /search/repositories?q={query}
 *
 * We sort by stars by default since "best match" relevance sorting via the
 * search API is already stars/relevance-weighted, and stars is the metric
 * users intuitively understand when scanning results.
 */
export async function searchRepositories(
  query: string,
  signal?: AbortSignal
): Promise<GitHubSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    per_page: '20',
  });
  const { data } = await githubGet<GitHubSearchResponse>(
    `/search/repositories?${params.toString()}`,
    signal
  );
  return data;
}
