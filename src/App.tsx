import { useEffect, useState } from 'react';
import { StatusLine } from './components/StatusLine';
import { searchRepositories } from './services/repositories';
import { isApiError } from './services/githubClient';
import type { ApiError, GitHubSearchResponse } from './types/github';
import styles from './App.module.css';

/**
 * MILESTONE 1 — Project Setup & Plumbing Check
 *
 * This is not the real app UI yet. It exists to prove, end to end, that:
 *   UI -> service layer -> GitHub API -> normalized response/error -> UI
 * actually works before any real screens get built on top of it.
 *
 * It will be replaced by proper routing (SearchPage / RepositoryDetailsPage)
 * in Milestone 2.
 */
function App() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [result, setResult] = useState<GitHubSearchResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkConnectivity() {
      try {
        const data = await searchRepositories('react', controller.signal);
        setResult(data);
        setStatus('success');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(isApiError(err) ? err : { kind: 'unknown', message: 'Something went wrong.' });
        setStatus('error');
      }
    }

    checkConnectivity();
    return () => controller.abort();
  }, []);

  return (
    <div className={styles.app}>
      <StatusLine activeStage="search" />
      <main className={styles.main}>
        <h1 className={styles.title}>Repository Intelligence</h1>
        <p className={styles.subtitle}>Milestone 1 — project setup &amp; API plumbing check</p>

        <div className={styles.panel}>
          {status === 'loading' && <p className={styles.mono}>Pinging GitHub API…</p>}

          {status === 'success' && result && (
            <>
              <p className={styles.mono}>
                ✓ Connected. Sample query "react" returned{' '}
                <strong>{result.total_count.toLocaleString()}</strong> total matches, first page
                has {result.items.length} items.
              </p>
              <ul className={styles.sampleList}>
                {result.items.slice(0, 3).map((repo) => (
                  <li key={repo.id}>
                    {repo.full_name} — ★ {repo.stargazers_count.toLocaleString()}
                  </li>
                ))}
              </ul>
            </>
          )}

          {status === 'error' && error && (
            <p className={styles.errorText}>
              ✗ {error.kind}: {error.message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
