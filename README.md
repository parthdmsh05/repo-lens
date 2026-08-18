# Repository Intelligence — GitHub Repository Explorer

> **Status: Milestone 1 of N — project scaffold + API plumbing check.**
> This README will grow with each milestone. Sections marked `(TBD)` are
> filled in as the corresponding feature is built.

## Concept

A "developer intelligence console" for investigating the life of a GitHub
repository — not just a metadata viewer, but a guided path (`SEARCH →
DISCOVER → INVESTIGATE → UNDERSTAND`) toward understanding what a project
is, how it's built, who builds it, and whether it's actively maintained.

## What exists right now (Milestone 1)

- Vite + React + TypeScript project scaffold
- Folder architecture (`components/`, `pages/`, `services/`, `hooks/`,
  `utils/`, `types/`, `charts/`, `styles/`)
- A GitHub API service layer (`src/services/`) with:
  - a single low-level fetch wrapper (`githubClient.ts`) that sets auth
    headers and normalizes all failure modes (network error, 404, rate
    limit) into one `ApiError` shape
  - a typed `searchRepositories()` function as the first real endpoint call
- Base design tokens (`src/styles/tokens.css`) implementing the "Repository
  Intelligence" visual identity (color, type, spacing)
- The signature `StatusLine` component (the journey tracker)
- A temporary connectivity check in `App.tsx` that calls the real GitHub
  search API on load and renders success/error — proof the full chain
  (UI → service → GitHub → normalized data → UI) works before real screens
  are built on it. **This will be replaced by real routed pages in
  Milestone 2.**

## Tech stack

- **React 19 + TypeScript** — component model + type safety for API response
  shapes, so a malformed assumption about GitHub's data fails at compile
  time, not at demo time.
- **Vite** — fast dev server and build tooling, minimal config overhead.
- **react-router-dom** — for the dedicated repository details view
  (`/repo/:owner/:name`), so results are linkable/shareable and back/forward
  navigation works, rather than faking navigation with local state.
- No global state library (Redux/Zustand) — not justified at this scale;
  see "Technical Decisions" (added in a later milestone) for reasoning.

## Project structure

```
src/
  components/   Reusable, presentation-focused UI pieces
  pages/        Route-level screens (added in Milestone 2)
  services/     All GitHub API calls live here — nowhere else
  hooks/        Reusable stateful logic (added when needed)
  utils/        Pure helper functions (formatting, transforms)
  types/        Shared TypeScript types for GitHub API shapes
  charts/       Data visualization components (added in later milestones)
  styles/       Design tokens / global CSS
```

## Setup

```bash
npm install
cp .env.example .env   # optional: add a GitHub token to raise rate limits
npm run dev
```

The app works with no token (60 requests/hour, unauthenticated). See
`.env.example` for how to add a personal access token and the security
notes around it.

## Environment variables

| Variable            | Required | Purpose                                              |
|----------------------|----------|-------------------------------------------------------|
| `VITE_GITHUB_TOKEN`  | No       | Raises GitHub API rate limit from 60/hr to 5000/hr    |

## Features implemented so far

- [x] Project scaffold and architecture
- [x] GitHub API service layer with error normalization
- [x] Repository search API call (`searchRepositories`)
- [ ] Search UI (Milestone 2)
- [ ] Repository details view (Milestone 3)
- [ ] Language statistics visualization (Milestone 4)
- [ ] Commit activity visualization (Milestone 5)
- [ ] Contributors list (Milestone 6)
- [ ] Full error/loading/empty state polish (Milestone 7)

## Screenshots

(TBD — added once real UI exists from Milestone 2 onward)

## Deployment link

(TBD)

## Known limitations

- The current screen is a temporary plumbing check, not the real app UI.

## Future improvements

(TBD — filled in near the end)
