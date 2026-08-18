import styles from './RepositoryCardSkeleton.module.css';

/**
 * Shows the *shape* of a RepositoryCard before real data arrives, so the
 * layout doesn't jump around once results load. Purely visual, no props.
 */
export function RepositoryCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.avatar} />
      <div className={styles.body}>
        <div className={styles.line} style={{ width: '40%' }} />
        <div className={styles.line} style={{ width: '80%' }} />
        <div className={styles.line} style={{ width: '30%' }} />
      </div>
    </div>
  );
}
