import { Link, useParams } from 'react-router-dom';
import styles from './RepositoryDetailsPage.module.css';

/**
 * Placeholder for Milestone 3. Its only job right now is to prove that
 * clicking a search result actually navigates to a URL that identifies
 * which repository was picked.
 */
export function RepositoryDetailsPage() {
  // useParams reads the dynamic parts of the URL. Our route is defined as
  // "/repo/:owner/:name" (see App.tsx), so visiting /repo/facebook/react
  // gives us { owner: "facebook", name: "react" } here.
  const { owner, name } = useParams();

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Back to search
      </Link>
      <h1 className={styles.title}>
        {owner}/{name}
      </h1>
      <p className={styles.hint}>
        Full repository details, languages, activity, and contributors arrive in Milestone 3.
      </p>
    </div>
  );
}
