# Memory Sequence · Vue 3 rewrite

Memory Sequence is now a modern Vue 3 + Vite single-page experience that lets you mount any JSON archive into browser storage and read/edit it entirely client-side. The UI embraces a 2025-ready, minimalist dark aesthetic designed for focused reading on any device.

![Memory Sequence preview](src/assets/img/readme.png)

---

- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Editing Content](#editing-content)
- [Styling & Theming](#styling--theming)
- [Build & Deploy](#build--deploy)
- [Next Steps](#next-steps)

---

## Key Features

- **Zero backend** — Static hosting friendly; mount a JSON file into `localStorage`, no server needed.
- **Self-serve data flow** — Upload/paste JSON, persist it locally, generate/export it, or demount with a click.
- **Modern dark UI** — Focused typography, responsive layout, and gentle motion.
- **Rich reading view** — Sanitised HTML rendering with tag chips and reading-time estimates.
- **Archive overview** — Quick stats (total entries, last update, tag count) plus interactive cards.

## Project Structure

```
memorySequence/
├── index.html           # HTML shell & metadata
├── public/             # Static assets copied as-is (favicon, etc.)
├── src/
│   ├── App.vue          # Shell layout, storage-backed data flow
│   ├── components/
│   │   ├── AnalyticsBar.vue
│   │   ├── JsonMountPanel.vue   # Upload/paste flow + sample JSON
│   │   ├── MemoryDetail.vue
│   │   ├── MemoryEditor.vue
│   │   └── MemoryList.vue
│   ├── assets/
│   │   ├── img/         # Preserved brand imagery
│   │   └── vue.svg
│   ├── data/
│   │   └── sampleEntries.js     # Inline example used by the mount panel
│   ├── main.js          # Entry point
│   └── style.css        # Global theme variables & resets
├── docs/                # Project notes (update as the Vue build evolves)
├── package.json
└── vite.config.js
```

## Getting Started

```bash
npm install
npm run dev
```

- Visit `http://localhost:5173/` (default Vite port).
- `npm run build` bundles the site for production into `dist/`.
- `npm run preview` serves the production build locally.

## Editing Content

1. Launch the app and use the **Mount JSON** panel to upload a `.json` file or paste raw JSON. The payload is validated, stored in `localStorage`, and immediately rendered.
2. Use the **Generate JSON** button (below the search bar) any time to reveal a full-width textarea containing the exact archive currently stored in the browser. Copy it out for backups or manual editing.
3. Click **Demount current JSON** to wipe the mounted archive from the browser and return to the upload panel.
4. The in-app **New Memory** editor converts your draft into the required shape and automatically prepends it to the mounted archive; the textarea mentioned above will include your new entry instantly.

Each entry should follow this structure:

```json
{
  "title": "Entry title",
  "content": "<p>HTML content…</p>",
  "time": "14 November 2025",
  "tags": ["personal", "theme"]
}
```

Keep HTML simple (`<p>`, `<ul>`, `<a>`, `<strong>`, etc.); the reader sanitises content with DOMPurify before rendering.

## Styling & Theming

- Global tokens/typography live in `src/style.css`.
- Component-level polish is scoped within each `.vue` file.
- Assets from the original project (`src/assets/img/*`) remain available for future branding iterations.
- The layout uses CSS variables for rapid experimentation with hues, contrasts, and backgrounds.

## Build & Deploy

1. Generate a production build:
   ```bash
   npm run build
   ```
   (The current Vite config emits to `docs/` for GitHub Pages hosting.)
2. Deploy the generated folder to any static host (Netlify, Vercel, GitHub Pages, S3, etc.).
3. Ship only the static bundle; readers will mount their own JSON at runtime, so there is no need to distribute sensitive data with the build.

No server-side scraper or Angular dependencies remain — this is a purely static Vue front-end that hydrates content from the viewer’s browser storage.

## Next Steps

- Layer in filters (by tag, year) or a fuzzy search when you’re ready.
- Extend the design system with additional components (timeline, gallery, etc.).
- Update the documents under `docs/` to reflect future enhancements to the Vue rebuild.

Enjoy crafting the new Memory Sequence experience!
