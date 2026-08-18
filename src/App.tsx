import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StatusLine, type JourneyStage } from './components/StatusLine';
import { SearchPage } from './pages/SearchPage';
import { RepositoryDetailsPage } from './pages/RepositoryDetailsPage';
import styles from './App.module.css';

/**
 * Figures out which stage of the SEARCH -> DISCOVER -> INVESTIGATE ->
 * UNDERSTAND journey to highlight, based on the current URL.
 * Right now this is simple (home = search, anything else = discover);
 * it gets more precise in later milestones as the details page grows
 * actual sections (languages, activity, contributors).
 */
function stageForPath(pathname: string): JourneyStage {
  if (pathname === '/') return 'search';
  return 'discover';
}

// Small wrapper needed because useLocation() only works INSIDE a
// BrowserRouter, so it can't live directly in the App function below.
function AppShell() {
  const location = useLocation();

  return (
    <div className={styles.app}>
      <StatusLine activeStage={stageForPath(location.pathname)} />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/repo/:owner/:name" element={<RepositoryDetailsPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
