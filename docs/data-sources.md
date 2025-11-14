# Data Sources & Caching

MemorySequence mixes first-party content hosted on OneDrive with data scraped from public websites. This document outlines how those sources are accessed, how results are cached, and what to change if the upstream links move.

## Memories (OneDrive)

- **Share URLs**
  - Development: `https://1drv.ms/u/s!AmQasIRCiDf9vg-uuspbdj0x8Fi9`
  - Production: `https://1drv.ms/u/s!AmQasIRCiDf9vVBQ--3w2STYkPo8`
- The URLs above are expanded by OneDrive into metadata and JSON representing each memory. `MemoriesComponent` encodes the share link and calls:
  ```
  https://api.onedrive.com/v1.0/shares/u!{btoa(shareUrl + '?v=' + Math.random())}/root?expand=children
  ```
  The `?v=` cache buster ensures OneDrive does not serve a stale response.
- Each child contains `title`, `content`, `time`, and `tags`. HTML content is sanitised at runtime and rendered directly in the UI.

### Caching Strategy

`MemoriesComponent` keeps a lightweight cache to avoid hitting OneDrive on every page load:

| Key | Purpose |
| --- | --- |
| `lastModified` | The `lastModifiedDateTime` returned by OneDrive. If unchanged, the cached payload is reused. |
| `sortedMemoriesPublic` | Public-only memories (private entries removed). |
| `sortedMemoriesPrivate` | Full memory list, including entries tagged `personal`. |

If any of these keys are missing or stale, the component fetches fresh data and rewrites the cache. Clearing browser storage forces a resync.

### Private vs. Public Memories

Entries tagged with `"personal"` are hidden unless the user is logged in. The login flow simply toggles a flag in local storage (`loggedIn = "xyufsvt"`) and the sorted list is re-filtered.

## Books Feed (Express Scraper)

The reading list is aggregated by `server.js`:

- Performs a `GET` request to `https://jordanbpeterson.com/reading-list/great-books/`.
- Uses `cheerio` to extract the ordered list of books and seeds the response with two manual defaults.
- Serves the combined array at `GET /` with permissive CORS headers.
- Exposes an additional passthrough endpoint at `GET /api` which proxies `https://contesttrackerapi.herokuapp.com/android/`. This is currently unused by the Angular app but kept for convenience.

`BooksComponent` checks local storage for `books` and `read`. When empty, it hits the scraper (`http://localhost:3001` in development, `http://18.221.40.67:3001` in production) and writes the results back to storage. The `read` flag is a string (`"1"`/`"0"`) persisted to support strike-through toggling.

## Google Books Metadata

`BooksComponent.bookApi()` enriches the static `myBookList` by querying the public Google Books API:

```
GET https://www.googleapis.com/books/v1/volumes?q={bookTitle}
```

- No API key is used; for heavy usage you may want to register a key and supply it via query parameter to avoid rate limiting.
- The method is invoked on first load when `localStorage.myBookList` is absent or too short. After enrichment, the list is cached under `myBookList`.

## Login Credentials

The front-end uses a hard-coded credential pair:

- Username: `str`
- Password: `programming!0!`

Successful authentication sets `localStorage.loggedIn = "xyufsvt"`, which the UI treats as a persistent session flag.

## Rotating Links or Clearing Cache

- Update the OneDrive share URLs (`locprodUrl`) in `memories.component.ts` if the dataset moves.
- If the production scraper endpoint changes, update the host string in `books.component.ts`.
- For immediate cache invalidation during development, open DevTools and clear Application &rarr; Local Storage for the app domain.
