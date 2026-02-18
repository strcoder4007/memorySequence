# Memory Sequence - Project Handoff

## Overview

**Memory Sequence** is a Vue 3 + Vite single-page application that lets users mount any JSON archive into browser storage and read/edit it entirely client-side. It's a minimalist dark-themed memory/journal system with zero backend requirements.

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Plain CSS with CSS variables (dark theme)
- **Storage**: Browser localStorage (no backend)
- **Deployment**: Static hosting (GitHub Pages, Netlify, Vercel)

## Project Structure

```
memorySequence/
├── index.html              # HTML shell & metadata
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── App.vue              # Shell layout, storage-backed data flow
│   ├── main.js              # Entry point
│   ├── style.css            # Global theme variables & resets
│   ├── components/
│   │   ├── AnalyticsBar.vue     # Stats display
│   │   ├── JsonMountPanel.vue   # Upload/paste JSON flow
│   │   ├── MemoryDetail.vue     # Individual memory view
│   │   ├── MemoryEditor.vue     # Create/edit memories
│   │   └── MemoryList.vue       # List of memories
│   ├── assets/
│   │   └── img/                 # Brand imagery
│   └── data/
│       └── sampleEntries.js     # Example JSON for mount panel
├── docs/                      # Project notes
├── package.json
└── vite.config.js
```

## Getting Started

```bash
cd /Users/str/Projects/memorySequence
npm install
npm run dev       # Development server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

## Key Features

1. **Mount JSON**: Upload a JSON file or paste raw JSON to load into localStorage
2. **Memory List View**: Display all memory entries as cards
3. **Memory Detail View**: Rich HTML rendering with sanitization (DOMPurify)
4. **Memory Editor**: Create new entries with title, HTML content, time, and tags
5. **Generate JSON**: Export current localStorage content as JSON
6. **Demount**: Clear localStorage and return to upload view

## Data Structure

Each memory entry follows this schema:

```json
{
  "title": "Entry title",
  "content": "<p>HTML content…</p>",
  "time": "14 November 2025",
  "tags": ["personal", "theme"]
}
```

## Environment

- No environment variables required
- No API keys needed
- Purely client-side application

## Important Files

- `src/App.vue`: Main application component, handles localStorage sync
- `src/components/JsonMountPanel.vue`: File upload/paste functionality
- `src/style.css`: Global styles, CSS variables for theming

## Design System

- Dark theme by default
- CSS variables in `src/style.css` for easy theming changes
- Responsive layout (mobile-friendly)
- Minimalist typography focused on readability

## Dependencies

Key packages (see `package.json`):
- vue: ^3.x
- vite: ^5.x
- dompurify: for HTML sanitization (implied by README)

## Deployment

```bash
npm run build
# Output goes to dist/ (or docs/ if configured for GitHub Pages)
```

Deploy the `dist/` folder to any static host.

## Notes for AI Agents

- This is a purely frontend application - no backend, no database
- All data lives in the user's browser localStorage
- Users share their own JSON files to load memories
- The app is designed to be self-serve - users mount their own data
- HTML content is sanitized before rendering for security
- Build output is static files - easy to host anywhere
