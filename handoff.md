# Memory Sequence — Project Handoff

## Overview

**Memory Sequence** is a Vue 3 + Vite single-page journal/memory app. Users mount a JSON archive into browser `localStorage` and read/edit it entirely client-side. Zero backend, purely static deployment.

## Tech Stack

- **Frontend**: Vue 3 (Composition API, `<script setup>`)
- **Build**: Vite 5
- **Styling**: Plain CSS with CSS custom properties — no Tailwind, no component library
- **Fonts**: Space Grotesk 900 (brand wordmark), Plus Jakarta Sans (UI text) — Google Fonts
- **Sanitisation**: DOMPurify for HTML content
- **Storage**: Browser localStorage (key: `memory-sequence:data`)

## Design System

### Accent Color — Supabase Green `#36D399`
All accent tokens use this green across both light and dark themes:
- `--accent: #36D399`
- `--accent-dim: rgba(54, 211, 153, 0.10)` (light) / `rgba(54, 211, 153, 0.12)` (dark)
- `--accent-glow: rgba(54, 211, 153, 0.20)` (light) / `rgba(54, 211, 153, 0.22)` (dark)
- `--accent-text: #FFFFFF` (light) / `#0F1E14` (dark)

### Brand Wordmark
Pure HTML/CSS — no image. Three `<span>` elements inside `<h1 class="wordmark">`:
- `MEMORY` + space + `SEQUENCES`
- Gradient: `#1A9E5F` → `#3ECF8E` → `#7EFFBD` (vertical shimmer via `::after`)
- Font: Space Grotesk 900, responsive via `clamp(1.8rem, 1.2rem + 4vw, 4rem)`

### Dual Themes
Light (`--bg: #F7F7F7`) and dark (`--bg: #121212`). Toggle stored in `localStorage` key `memory-sequence:theme`.

### Surface Hierarchy
- `--surface`: card backgrounds
- `--surface-raised`: nested elements, skeleton loaders
- `--surface-high`: modals, tooltips

### Transitions
Spring curve used throughout: `cubic-bezier(0.34, 1.56, 0.64, 1)`. No global `transition: all`.

## Project Structure

```
src/
├── App.vue                  # Header, wordmark, data actions, theme toggle, layout grid
├── main.js                  # Mounts app to #app
├── style.css                # CSS variables, resets, typography base
├── components/
│   ├── AnalyticsBar.vue     # Monthly bar chart — word count, linear 0–10k scale
│   ├── AppModal.vue         # Full-screen modal portal (editor)
│   ├── JsonMountPanel.vue   # Mount JSON: upload file or paste + example structure
│   ├── MemoryDetail.vue     # Full memory reading view with prose rendering
│   ├── MemoryEditor.vue     # Create/edit form: title, tags (add/remove), content textarea
│   └── MemoryList.vue       # Scrollable card list with search, month filter, active state
├── assets/img/              # logo.png (fallback), favicon.png
└── data/sampleEntries.js    # Inline example JSON
```

## Key Features

1. **Mount JSON** — upload `.json` file or paste; validated before storing
2. **Memory List** — cards with active state, edit/delete buttons (hover), tag chips, month filter
3. **Memory Detail** — sanitised HTML prose, reading time, tag chips, formatted date
4. **Memory Editor** — modal or embedded, title + tags + content, HTML ↔ draft text conversion
5. **Generate JSON** — exports current archive from localStorage as copyable JSON
6. **Demount** — wipes localStorage and returns to mount panel
7. **Analytics** — monthly bar chart filtered by selected month; word count (0–10k linear scale)

## Data Structure

```json
{
  "title": "Entry title",
  "content": "<p>HTML content…</p>",
  "time": "14 November 2025",
  "tags": ["personal", "journal"]
}
```

Normalized entry (after mounting) adds: `id`, `sourceIndex`, `timestamp`, `date`, `formattedDate`, `sanitizedContent`, `snippet`, `readingTime`, `tags`, `plainText`.

## Storage Keys

| Key | Content |
|---|---|
| `memory-sequence:data` | Full JSON archive array |
| `memory-sequence:theme` | `'light'` or `'dark'` |

## Environment

No environment variables. No API keys. Purely client-side.

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → docs/
npm run preview
```

## Deployment

Build output (`docs/`) deploys to any static host. Currently configured for GitHub Pages.

## Notes for AI Agents

- All CSS is scoped within `.vue` files + global tokens in `style.css`
- Brand logo is HTML/CSS — do not replace with image without removing the text-based implementation
- The accent color is the Supabase green — do not change to blue or other colors
- Analytics bar height = word count on a linear scale capped at 10,000 words
- HTML content is sanitized — `<script>`, `<style>`, etc. are stripped
- Theme toggle is in the header, stores preference in localStorage
