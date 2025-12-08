# Data Sources

The Vue rewrite of Memory Sequence intentionally relies on a single, self-managed data source: a JSON file shipped with the application. This keeps the build static, easy to host, and trivial to update.

## Primary Source — `public/data.json`

- **Location**: `public/data.json`
- **Delivery**: Served as-is by the static host; fetched client-side by the app on load.
- **Schema**:
  ```json
  {
    "title": "Entry title",
    "content": "<p>HTML body…</p>",
    "time": "14 November 2025",
    "tags": ["optional", "tags"]
  }
  ```

### Editing Workflow

1. Open `public/data.json` in your editor.
2. Append or modify entries following the schema above.
3. Save the file — no rebuild required for local development (`npm run dev` watches the file automatically).

For production, deploy the updated `data.json` alongside the existing build. Static hosts (Netlify, Vercel, S3, etc.) will serve the new content immediately once the file is replaced.

### HTML Content Guidelines

- Keep markup simple: paragraphs, lists, emphasis, links.
- The client uses DOMPurify to sanitise HTML before rendering, mitigating XSS concerns.
- Avoid inline scripts or complex embeds; if richer media is needed later, extend the sanitisation allow-list with care.

### Date Format

- Human-readable strings (e.g., `03 August 2025`) are parsed with the browser’s `Date` constructor.
- The app falls back gracefully if it encounters an invalid date, but consistent formatting ensures correct sorting and display.

## Derived Data

The application enriches each JSON entry at runtime:

- `formattedDate`: Internationalised date string (`Intl.DateTimeFormat`).
- `readingTime`: Word-count estimate based on ~200 WPM.
- `snippet`: Plain-text preview for the archive cards.
- `tags`: Ensured to be an array (empty if omitted).

No other caches or remote services are used. Removing the old Angular-era OneDrive feed, login flags, and Express scraper drastically simplifies maintenance.

## Future Extensions

If you later reintroduce remote content (e.g., a CMS or another JSON endpoint), consider:

- Creating a fetch composable (e.g., `useRemoteEntries`) with retry/backoff.
- Adding a build step that hydrates `public/data.json` from the external source.
- Persisting a revision hash in `localStorage` to avoid redundant fetches while still keeping the app stateless.

For now, a single JSON file keeps the workflow fast and predictable.
