# Architecture (Vue 3)

This document captures how the new Memory Sequence front-end is organised and how data flows through the Vue 3 application.

## Overview

- **Framework**: Vue 3 with the `<script setup>` composition API.
- **Bundler**: Vite (ESM, hot-module replacement, fast dev server).
- **Hosting model**: Purely static — no backend or server-side rendering required.
- **Content source**: `public/data.json`, fetched client-side at runtime.

The app is intentionally lean: a single root component (`App.vue`) orchestrates data loading and layout, while two child components (`MemoryList` and `MemoryDetail`) handle presentation.

## Component Map

| Component | Responsibility |
| --------- | -------------- |
| `App.vue` | Fetches and normalises entries, manages global state (loading, error, selection), renders the hero, stats, and the two-column layout. |
| `MemoryList.vue` | Displays the archive cards, handles selection, and provides loading/error/skeleton states for the list view. |
| `MemoryDetail.vue` | Renders the active entry with sanitised HTML, tag chips, reading-time estimate, and empty/error states. |

Common helpers (formatting, snippet generation, sanitisation) live inside `App.vue` for now. When the feature set grows, you can extract them into `src/utils/` or `src/composables/`.

## Data Lifecycle

1. **Load** – `App.vue` fetches `${import.meta.env.BASE_URL}data.json` on mount, cache-busted with a timestamp query.
2. **Normalise** – Each entry is enriched with:
   - `id`: stable key derived from timestamp + index.
   - `date` & `formattedDate`: parsed native `Date` and an `Intl.DateTimeFormat` string.
   - `sanitizedContent`: DOMPurify-cleaned HTML.
   - `snippet`: truncated plain text preview.
   - `readingTime`: words-per-minute estimate (~200 wpm).
   - `tags`: guaranteed array (empty when omitted).
3. **Sort** – Entries are sorted newest-first.
4. **Select** – First entry auto-selects; user taps override via `MemoryList`.
5. **Render** – `MemoryDetail` consumes the selected entry, `MemoryList` displays navigation cards, hero stats update through computed properties.

## Styling System

- Global tokens (colors, typography, spacing) reside in `src/style.css`.
- Components leverage scoped styles for local polish (glassmorphism panels, skeleton shimmer, tag chips).
- The design opts for CSS variables and clamp-based responsive sizing to avoid utility frameworks while still allowing quick theming tweaks.
- The root defines `color-scheme: dark` so form controls and scrollbars respect the dark theme.

## Accessibility Notes

- Buttons keep focus outlines; list cards are keyboard-selectable.
- `aria-live` is used on the archive list to announce updates.
- Skeletons are marked with `aria-hidden="true"` to keep screen-reader noise low.
- Future enhancements (search, filters) should continue the same focus/aria patterns.

## Extending the App

- **Search / filtering**: add a composable (e.g., `useFilteredEntries`) and pass filtered arrays into `MemoryList`.
- **Routing**: introduce Vue Router if deep-linking into individual entries becomes necessary. For now, selection lives in memory.
- **State management**: the current reactive references cover the scope; Pinia or Vuex is unnecessary unless the feature set expands drastically.
- **Theming**: toggle classes on `<body>` or update CSS variables at runtime for alternative colorways (e.g., a light theme).

This architecture keeps the footprint tiny, while leaving plenty of headroom for the next wave of enhancements.
