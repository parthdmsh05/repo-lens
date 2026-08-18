import type { GitHubRepository } from '../types/github';
import { formatCount } from '../utils/formatCount';
import styles from './RepositoryCard.module.css';

interface RepositoryCardProps {
  repo: GitHubRepository;
  onSelect: () => void;
}

/**
 * A single search result. Purely presentational: it receives a repo object
 * and a click handler as props, and has no state or API knowledge of its
 * own. That separation is what makes it reusable — this same component
 * could show up in a "bookmarks" list or a "compare" screen later without
 * any changes.
 */
export function RepositoryCard({ repo, onSelect }: RepositoryCardProps) {
  return (
    <button className={styles.card} onClick={onSelect}>
      <img
        src={repo.owner.avatar_url}
        alt=""
        className={styles.avatar}
        width={40}
        height={40}
      />
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <span className={styles.name}>{repo.name}</span>
          <span className={styles.owner}>{repo.owner.login}</span>
        </div>

        {repo.description && <p className={styles.description}>{repo.description}</p>}

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            ★ {formatCount(repo.stargazers_count)}
          </span>
          {repo.language && (
            <span className={styles.metaItem}>
              <span className={styles.languageDot} />
              {repo.language}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
