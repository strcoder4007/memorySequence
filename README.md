# MemorySequence

MemorySequence is a personal knowledge garden built with Angular 7. It renders a chronology of “memory” entries pulled from an OneDrive share and augments them with an interactive reading list. The application ships with a lightweight Express scraper that hydrates the reading list from Jordan Peterson’s public recommendations.

The project started life as an Angular CLI scaffold, but now has a defined feature set, bespoke styling, and an opinionated local-storage caching strategy. The updated documentation below explains how those pieces fit together and how to run or extend the project today.

---

- [Features](#features)
- [Project Layout](#project-layout)
- [Local Development](#local-development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Credentials & Local Storage](#credentials--local-storage)
- [Reference Docs](#reference-docs)

---

## Features

- Memory timeline sourced from OneDrive, with private entries gated behind a simple login toggle.
- Single-memory view with theme support (light/dark) and tag surfacing.
- Books dashboard that merges a curated list with a scraped feed (via the bundled Express server) and enriches entries with Google Books metadata.
- Responsive navigation with quick access to the latest memory (“About”), a books catalog, and theme toggling.

## Project Layout

```
memorySequence/
├── src/
│   └── app/
│       ├── app.component.*        # Shell: navigation, theme toggle, login
│       ├── memories/              # Timeline + data ingestion from OneDrive
│       ├── memory/                # Single memory view
│       ├── books/                 # Reading list UI + API integration
│       ├── login/                 # Inline login widget
│       └── search/                # (Currently hidden) typeahead shell
├── server.js                      # Express scraper for the books feed
├── package.json                   # Scripts and dependency manifest
└── docs/                          # Supplemental documentation
```

Angular CLI (`@angular/cli` 7.3) handles building, testing, and scaffolding. The app uses `rxjs` for HTTP orchestration and styles itself with Bootstrap 4 and Font Awesome glyphs.

## Local Development

Prerequisites: Node.js 10+ and npm.

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the front-end dev server
   ```bash
   npm start
   ```
   Visit `http://localhost:4200/`.
3. (Optional but recommended) Start the book scraper in a second shell so the Books view can load live data.
   ```bash
   node server.js
   ```
   This exposes the scraper on `http://localhost:3001/`.

The memories feed targets an OneDrive share URL. The development build consumes the link configured in `MemoriesComponent.locprodUrl`. See `docs/data-sources.md` for details and guidance on rotating the share link.

## Testing

- `npm test` — run unit tests with Karma + Jasmine.
- `npm run e2e` — execute Protractor end-to-end tests (requires `npm start` running).
- `npm run lint` — run TSLint over the source tree.

No custom test suite is currently authored beyond Angular’s defaults.

## Deployment

Production builds use the standard Angular CLI flow:

```bash
npm run build         # emits dist/ with development config
ng build --prod       # manual alternative for optimized bundles
```

A bespoke deployment helper exists as `npm run deploy`. It assumes the project lives alongside an `../../html/` directory on the target host and requires write access (sudo). See `docs/deployment.md` for the full breakdown before running it in a new environment.

## Credentials & Local Storage

- Default login: `str` / `programming!0!`
- Local storage keys: `loggedIn`, `sortedMemoriesPrivate`, `sortedMemoriesPublic`, `lastModified`, `books`, `read`, `myBookList`

The app relies on these keys for caching and access control. Clearing them forces a fresh sync from OneDrive and the books scraper.

## Reference Docs

- `docs/architecture.md` — component responsibilities, data flow, and theming notes.
- `docs/data-sources.md` — OneDrive integration, scraper behavior, and caching strategy.
- `docs/deployment.md` — expectations and caveats around the provided deploy script and infrastructure assumptions.

Feel free to extend the `docs/` directory with additional runbooks or onboarding notes as the project evolves.
