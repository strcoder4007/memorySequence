# Memory Sequence · Vue 3

A modern Vue 3 + Vite single-page journal. Mount a JSON archive into browser storage and read/edit it entirely client-side. The UI is a minimalist, typography-first experience with a Supabase-green accent palette, dual-theme support (light + dark), and a pure HTML/CSS brand wordmark.

![Memory Sequence preview](src/assets/img/readme.png)

---

- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Editing Content](#editing-content)
- [Styling & Theming](#styling--theming)
- [Analytics](#analytics)
- [Build \& Deploy](#build--deploy)

---

## Key Features

- **Zero backend** — Static hosting friendly; mount a JSON file into `localStorage`, no server needed.
- **Dual-theme** — Light and dark mode with Supabase-green accent, toggleable from the header.
- **Bold brand wordmark** — Pure HTML/CSS "MEMORY SEQUENCES" gradient wordmark (Space Grotesk 900, no image).
- **Rich reading view** — Sanitised HTML rendering with tag chips and reading-time estimates.
- **Memory editor** — Create and edit entries with title, tags, and HTML content.
- **Monthly analytics** — Bar chart showing writing activity (word count) per month, linear scale 0–10k.
- **Archive export** — Generate and copy the full JSON archive from the UI.

## Project Structure

```
memorySequence/
├── index.html              # HTML shell, Google Fonts (Space Grotesk + Plus Jakarta Sans)
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── App.vue             # Shell layout, header wordmark, data actions, localStorage sync
│   ├── main.js             # Entry point
│   ├── style.css           # CSS variables, theme tokens, global resets
│   ├── components/
│   │   ├── AnalyticsBar.vue     # Monthly activity bar chart (word count, 0–10k linear)
│   │   ├── AppModal.vue          # Full-screen modal for editor
│   │   ├── JsonMountPanel.vue    # Upload/paste JSON + example structure
│   │   ├── MemoryDetail.vue      # Full memory reading view
│   │   ├── MemoryEditor.vue      # Create/edit memory form
│   │   └── MemoryList.vue        # Scrollable card list with search/filter
│   ├── assets/img/              # Preserved brand imagery (logo.png fallback)
│   └── data/
│       └── sampleEntries.js      # Example JSON used by the mount panel
├── docs/                   # Production build output (GitHub Pages)
├── package.json
└── vite.config.js
```

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # Production build → docs/
npm run preview   # Preview production build
```

## Editing Content

1. Use **Mount JSON** to upload a `.json` file or paste raw JSON. The payload is validated and stored in `localStorage`.
2. Click **New Memory** in the sidebar to open the editor. Fill in title, tags, and content.
3. **Generate JSON** exports the current archive as a copyable JSON string.
4. **Demount** wipes the archive and returns to the upload panel.

Each entry follows this schema:

```json
{
  "title": "Entry title",
  "content": "<p>HTML content…</p>",
  "time": "14 November 2025",
  "tags": ["personal", "journal"]
}
```

HTML is sanitised with DOMPurify before rendering — keep markup simple (`<p>`, `<ul>`, `<a>`, `<strong>`, etc.).

## Styling & Theming

All tokens are CSS custom properties in `src/style.css`:

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--accent` | `#36D399` | `#36D399` | Supabase green — buttons, glows, bars |
| `--accent-text` | `#FFFFFF` | `#0F1E14` | Text on accent buttons |
| `--tag-bg/tag-text` | green tint | green tint | Tag chips |
| `--bg` | `#F7F7F7` | `#121212` | Page background |
| `--surface` | `#FFFFFF` | `#1E1E1E` | Card/panel background |

The **brand wordmark** uses its own independent gradient (deep green → mint) via `background-clip: text`. The logo font is **Space Grotesk 900** — loaded from Google Fonts.

Transitions are spring-curved (`cubic-bezier(0.34, 1.56, 0.64, 1)`) throughout.

## Analytics

The Monthly Activity chart shows word count per month:
- **Linear scale**, fixed ceiling at **10,000 words** (0 = blank stub bar)
- Bars use Supabase green gradient
- Tooltip shows word count (primary) and blog count (secondary)
- Click a bar to filter the memory list to that month

## Build & Deploy

```bash
npm run build   # outputs to docs/ for GitHub Pages
```

Deploy `docs/` to any static host. No server, no database — readers mount their own JSON at runtime.

---

*Crafted with Vue 3 + Vite*
