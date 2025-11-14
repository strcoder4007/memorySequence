# Architecture

This document describes how the MemorySequence application is assembled and how the major pieces collaborate at runtime.

## Front-End Overview

The project is a classic Angular 7 single-page application. Routing is defined in `AppModule`, with three main surface areas:

- `/` &rarr; `MemoriesComponent` — timeline of public (and optionally private) memories.
- `/memory/:id` &rarr; `MemoryComponent` — single-memory detail view.
- `/books` (navigated via the shell) &rarr; `BooksComponent` — curated reading list.

`AppComponent` serves as the top-level shell for navigation, theme switching, authentication state, and sharing common color props with child components. It also keeps `ViewChild` references to `MemoriesComponent` and `MemoryComponent` so it can trigger refreshes and route to the latest entry.

## Component Responsibilities

### AppComponent

- Holds UI state for theme (`mySide`, `myBgColor`, `myColor`, `memColor`) and menu visibility.
- Persists login state in local storage and toggles the inline `LoginComponent`.
- Receives sorted memories from `MemoriesComponent` via `emitMemories`, then routes to detail pages when requested.
- Watches the current URL to decide whether to show the home or detail layouts, ensuring deep links load content by forcing a data refresh after the view initializes.

### MemoriesComponent

- Fetches the OneDrive share metadata (`getposts`) and then the actual JSON content (`getfinalposts`).
- Normalizes the payload into `Memory` objects, sanitises the embedded HTML with Angular’s `DomSanitizer`, and sorts entries chronologically (newest first).
- Splits memories into public and private lists—the `"personal"` tag flags an entry as private. Public visitors only see the filtered subset.
- Emits the sorted list to the shell and optionally triggers navigation if the URL already points at `/memory/:id`.
- Caches results and metadata (`lastModified`, `sortedMemoriesPublic`, `sortedMemoriesPrivate`) in local storage to avoid redundant API calls.

### MemoryComponent

- Reads the route parameter and rehydrates the relevant memory from local storage (private vs. public lookup depends on login state).
- Displays the entry, date, and tags. Hover behaviour inverts themes using the color palette provided by the parent.

### BooksComponent

- Combines three data sources:
  1. `server.js`, which scrapes the Jordan Peterson reading list and exposes it at `/`.
  2. Cached values in `localStorage` (`books`, `read`) to avoid re-fetching on every navigation.
  3. A statically-seeded `myBookList` enriched with page counts from the Google Books API.
- Segregates books by author for quick scanning and supports strikethrough toggling on click.

### LoginComponent

- Inline form that emits login success/failure events to the shell.
- Accepts the hard-coded credentials (`str` / `programming!0!`) and updates local storage so refreshes persist the session.

### SearchComponent

- Present but currently dormant in the UI (the menu toggle is commented out). It was intended as a local search/typeahead component and can be reactivated if the design calls for it.

## Data Flow Summary

1. `AppComponent` boots and establishes theme + login state from local storage.
2. `MemoriesComponent.ngOnInit` fetches OneDrive contents, caches them, and emits the sorted array.
3. The shell stores the list for navigation and toggles between `MemoriesComponent`, `MemoryComponent`, and `BooksComponent` based on user actions.
4. When the Books view is opened, `BooksComponent` lazily initializes its data sources (local storage first, falling back to `server.js` and Google Books when empty).

## Theming

All components receive their palette from the shell to keep the dark/light toggle consistent. Hover styles are implemented imperatively (`document.getElementById`) because many elements are bound using `innerHTML`, limiting Angular’s Declarative styling options without refactoring.

## Server-Side Companion

`server.js` is independent of the Angular CLI build. It can run alongside `ng serve`, and the Books component targets `http://localhost:3001` in development and the configured production host in production builds. The server injects permissive CORS headers so the Angular app can consume it directly from the browser.
