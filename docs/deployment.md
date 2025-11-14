# Deployment Guide

MemorySequence is a static Angular application that can be hosted on any web server capable of serving the compiled assets. This document explains the provided deployment script and outlines the assumptions baked into it.

## Production Build

The usual Angular CLI workflow applies:

```bash
ng build --prod
```

This produces the `dist/` folder containing an optimized bundle. The `start`, `test`, and `e2e` scripts operate on the same tooling that Angular CLI installs locally.

## `npm run deploy`

The project ships with a convenience script intended for the original hosting environment:

```json
"deploy": "git pull && ng build --prod --base-href /memseq/ && sudo mv dist ../../html/ && sudo rm -r ../../html/memseq && sudo mv ../../html/dist ../../html/memseq"
```

### What it does

1. `git pull` — ensures the working copy is up to date.
2. `ng build --prod --base-href /memseq/` — compiles the app with a `base` tag pointing at `/memseq/`.
3. `sudo mv dist ../../html/` — moves the freshly-built `dist` directory two levels up into an `html` folder.
4. `sudo rm -r ../../html/memseq` — removes the previous deployment.
5. `sudo mv ../../html/dist ../../html/memseq` — renames the copied `dist` folder to `memseq`.

### Assumptions & Requirements

- The repository resides two directories below the web root (`../../html/`).
- You have `sudo` rights on the target machine.
- `ng` is available on the `$PATH` (i.e., Angular CLI is installed globally or via `npx`).
- The production web server serves static content from `../../html/memseq/`.

If any of these assumptions do not hold, adjust the script or run the commands manually with paths matching your server layout.

## Alternate Deployments

For other environments (S3, Netlify, nginx, etc.) you can:

1. Run `ng build --prod --base-href /` (or the appropriate subdirectory).
2. Upload the contents of `dist/memory-sequence` (Angular 7 names the folder after `package.json`).
3. Serve the files via your preferred static host.

Remember to proxy or redeploy the companion Node service (`server.js`) if you rely on the live Books feed. In production builds the app expects it at `http://18.221.40.67:3001`. Update `books.component.ts` if your backend host differs.

## Server Process

`server.js` is not bundled by the Angular build. To run it on the target server:

```bash
node server.js        # or pm2/forever for long-running environments
```

Make sure ports and firewall rules allow the Angular front-end to reach whichever host/port combination you choose.
