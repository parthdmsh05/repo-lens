import type { ApiError } from '../types/github';

/**
 * Low-level fetch wrapper for the GitHub REST API.
 *
 * This is the ONLY place in the app that calls `fetch` against GitHub.
 * Every other service function (repositories.ts, etc.) goes through this,
 * which means:
 *  - auth headers are set in exactly one place
 *  - error normalization happens in exactly one place
 *  - if we ever needed to swap in a proxy/backend, this is the only file
 *    that would change
 */

const GITHUB_API_BASE = 'https://api.github.com';

// Vite exposes env vars prefixed with VITE_ on import.meta.env.
// This token is optional — the app works without it, just with a much
// lower rate limit (60 req/hr vs 5000 req/hr authenticated).
const token: string | undefined = import.meta.env.VITE_GITHUB_TOKEN;

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Turns any failure mode (HTTP error, network failure, malformed response)
 * into a single normalized ApiError shape, so calling code never has to
 * branch on "was this a Response error or a thrown exception".
 */
async function normalizeErrorFromResponse(response: Response): Promise<ApiError> {
  // GitHub signals rate limiting via 403 (classic) or 429 (secondary limits),
  // combined with X-RateLimit-Remaining: 0 on the classic case.
  const remaining = response.headers.get('x-ratelimit-remaining');
  const resetHeader = response.headers.get('x-ratelimit-reset');

  if (response.status === 403 && remaining === '0') {
    return {
      kind: 'rate_limited',
      message: 'GitHub API rate limit exceeded.',
      resetAt: resetHeader ? Number(resetHeader) : undefined,
    };
  }

  if (response.status === 429) {
    return {
      kind: 'rate_limited',
      message: 'GitHub API is temporarily rate limiting requests.',
      resetAt: resetHeader ? Number(resetHeader) : undefined,
    };
  }

  if (response.status === 404) {
    return {
      kind: 'not_found',
      message: 'That repository could not be found.',
    };
  }

  return {
    kind: 'unknown',
    message: `GitHub API responded with an unexpected error (status ${response.status}).`,
  };
}

/**
 * GET a JSON resource from the GitHub API.
 * Returns the parsed body on success (with response headers attached
 * for endpoints where callers need pagination info from `Link`).
 * Throws an ApiError (never a raw Error/Response) on failure, so every
 * caller can rely on a single try/catch shape.
 */
export async function githubGet<T>(
  path: string,
  signal?: AbortSignal
): Promise<{ data: T; response: Response }> {
  let response: Response;

  try {
    response = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: buildHeaders(),
      signal,
    });
  } catch (err) {
    // fetch() itself throws on network failure (offline, DNS, CORS, etc.)
    // AbortError is re-thrown as-is so callers can distinguish "cancelled"
    // from "actually failed" if they need to.
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    const networkError: ApiError = {
      kind: 'network',
      message: 'Could not reach GitHub. Check your internet connection.',
    };
    throw networkError;
  }

  if (!response.ok) {
    throw await normalizeErrorFromResponse(response);
  }

  const data = (await response.json()) as T;
  return { data, response };
}

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'kind' in err &&
    'message' in err
  );
}
