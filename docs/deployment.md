# Deployment Guide (Vue 3)

The Vue rewrite of Memory Sequence is a fully static single-page application. Deployments are therefore straightforward: build the assets with Vite, ship the resulting `dist/` folder, and include `public/data.json`.

## Build Pipeline

```bash
npm install        # first-time setup
npm run build      # emits dist/
```

- `npm run build` produces minified JS/CSS under `dist/`.
- Static assets from `public/` (including `data.json` and `favicon.png`) are copied across automatically.

## Local Verification

Use Vite’s preview command to smoke-test the production build locally:

```bash
npm run preview
```

- Serves `dist/` on `http://localhost:4173/`.
- Confirms the static bundle loads `data.json` correctly from the same origin.

## Deploying to a Static Host

Any static host works (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3 + CloudFront, etc.). The generic process:

1. Build locally or via CI (`npm run build`).
2. Upload the contents of `dist/` to your host.
3. Ensure `data.json` ships alongside the assets (it lives in `dist/data.json` after build).
4. Configure your host for SPA routing if necessary (all routes should serve `index.html`).

Because the app fetches `data.json` relative to `import.meta.env.BASE_URL`, no configuration tweaks are needed when deploying to subdirectories. If you serve the site under a sub-path, set `vite.config.js -> base` accordingly before building.

## Updating Content Without Rebuilding

Since `data.json` lives in the static assets, you can publish new entries by replacing that single file on the host:

1. Edit `public/data.json`.
2. Deploy the updated file (or rebuild to include it automatically).
3. The front-end cache-busts requests with a timestamp query, so users pull the latest content on refresh.

## CI/CD Tips

- Cache `node_modules` between runs to speed up builds.
- Run `npm run build` as part of the pipeline; failing builds automatically signal issues with malformed JSON or syntax errors.
- Optionally run `npm run preview -- --host` inside CI to run end-to-end tests against the production bundle.

That’s it—no Angular deploy script, no Node server, no additional services. Ship the static bundle and you’re live.
