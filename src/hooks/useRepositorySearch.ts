import { useEffect, useState } from 'react';
import { searchRepositories } from '../services/repositories';
import { isApiError } from '../services/githubClient';
import type { ApiError, GitHubRepository } from '../types/github';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * A "custom hook" is just a normal function whose name starts with `use`,
 * that's allowed to use React's state/effect tools inside it. We make one
 * whenever a chunk of stateful logic (state + the effect that reacts to it)
 * would otherwise clutter up a page component, or might be reused later.
 *
 * This hook owns everything about "searching repositories": the current
 * status, the results, any error, and the function to trigger a new search.
 * SearchPage.tsx just calls this hook and renders whatever it returns —
 * it doesn't know or care how the fetching actually happens.
 */
export function useRepositorySearch() {
  // The query that has actually been submitted (not every keystroke).
  // Starts as null to mean "nothing searched yet."
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [results, setResults] = useState<GitHubRepository[]>([]);
  const [error, setError] = useState<ApiError | null>(null);

  // This effect re-runs ONLY when submittedQuery changes — i.e. only when
  // the user actually submits a new search, not on every render.
  useEffect(() => {
    if (submittedQuery === null) return;

    const controller = new AbortController();

    async function runSearch() {
      setStatus('loading');
      setError(null);
      try {
        const data = await searchRepositories(submittedQuery as string, controller.signal);
        setResults(data.items);
        setStatus('success');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(isApiError(err) ? err : { kind: 'unknown', message: 'Something went wrong.' });
        setStatus('error');
      }
    }

    runSearch();

    // Cleanup: if the user submits ANOTHER search before this one finishes,
    // cancel the in-flight request so its (now-stale) response can't
    // overwrite the newer one.
    return () => controller.abort();
  }, [submittedQuery]);

  function search(query: string) {
    setSubmittedQuery(query);
  }

  return { status, results, error, submittedQuery, search };
}
