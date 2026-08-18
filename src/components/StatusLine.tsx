import styles from './StatusLine.module.css';

export type JourneyStage = 'search' | 'discover' | 'investigate' | 'understand';

const STAGES: { key: JourneyStage; label: string }[] = [
  { key: 'search', label: 'SEARCH' },
  { key: 'discover', label: 'DISCOVER' },
  { key: 'investigate', label: 'INVESTIGATE' },
  { key: 'understand', label: 'UNDERSTAND' },
];

interface StatusLineProps {
  activeStage: JourneyStage;
}

/**
 * The app's signature element: a persistent case-file-style progress
 * tracker that reflects where the user is in the required UX journey
 * (Search -> Discover -> Investigate -> Understand). It's driven by
 * actual navigation state, not decorative.
 */
export function StatusLine({ activeStage }: StatusLineProps) {
  const activeIndex = STAGES.findIndex((s) => s.key === activeStage);

  return (
    <div className={styles.line} role="status" aria-label="Current step in repository investigation">
      {STAGES.map((stage, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        return (
          <span key={stage.key} className={styles.segment}>
            <span
              className={[
                styles.label,
                isActive ? styles.active : '',
                isPast ? styles.past : '',
              ].join(' ')}
            >
              {stage.label}
            </span>
            {i < STAGES.length - 1 && <span className={styles.arrow}>→</span>}
          </span>
        );
      })}
    </div>
  );
}
