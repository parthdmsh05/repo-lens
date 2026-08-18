import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepositorySearch } from '../hooks/useRepositorySearch';
import { RepositoryCard } from '../components/RepositoryCard';
import { RepositoryCardSkeleton } from '../components/RepositoryCardSkeleton';
import styles from './SearchPage.module.css';

export function SearchPage() {
  // inputValue = whatever is currently typed in the box (updates every keystroke).
  // This is separate from "submittedQuery" inside the hook on purpose —
  // typing should NEVER trigger a fetch, only submitting the form should.
  const [inputValue, setInputValue] = useState('');
  const { status, results, error, submittedQuery, search } = useRepositorySearch();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop the browser from doing a full page reload
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    search(trimmed);
  }

  function goToRepository(owner: string, name: string) {
    navigate(`/repo/${owner}/${name}`);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Repository Intelligence</h1>
      <p className={styles.subtitle}>
        Search any GitHub repository to investigate its languages, contributors, and activity.
      </p>

      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search repositories… e.g. react, tensorflow, vscode"
          aria-label="Search GitHub repositories"
        />
        <button className={styles.button} type="submit">
          Search
        </button>
      </form>

      <div className={styles.results}>
        {status === 'idle' && (
          <p className={styles.hint}>Type a repository name or keyword above, then press Search.</p>
        )}

        {status === 'loading' && (
          <div className={styles.list}>
            {Array.from({ length: 5 }).map((_, i) => (
              <RepositoryCardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'error' && error && (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>
              {error.kind === 'rate_limited' ? 'Rate limit reached' : 'Search failed'}
            </p>
            <p className={styles.errorMessage}>{error.message}</p>
            <button
              className={styles.retryButton}
              onClick={() => submittedQuery && search(submittedQuery)}
            >
              Try again
            </button>
          </div>
        )}

        {status === 'success' && results.length === 0 && (
          <p className={styles.hint}>
            No repositories found for "{submittedQuery}". Try a different keyword.
          </p>
        )}

        {status === 'success' && results.length > 0 && (
          <div className={styles.list}>
            {results.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repo={repo}
                onSelect={() => goToRepository(repo.owner.login, repo.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
