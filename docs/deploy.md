# Deploy Runbook (Maintainer)

This document is the operator guide for deploying `divisioner` to GitHub Pages.

## Deployment Model

- Hosting: GitHub Pages
- CI/CD: GitHub Actions workflow at `.github/workflows/deploy.yml`
- Build output: `dist`
- Production base path: `/divisioner/` (configured in `vite.config.ts`)

## Prerequisites

- You have admin access to the GitHub repository.
- OpenCage API key is available for geocoding.
- Repository name is `divisioner` (or `vite.config.ts` base path is updated to match).

## One-Time GitHub Setup

1. Open repository **Settings -> Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Settings -> Secrets and variables -> Actions**.
4. Add repository secret:
   - `VITE_OPENCAGE_API_KEY` = your OpenCage API key

## How Deployment Works

The workflow runs on:

- Pushes to `main`
- Manual trigger (`workflow_dispatch`)

Pipeline sequence:

1. Checkout code
2. Setup Node 20
3. Install dependencies (`npm ci`)
4. Build app (`npm run build`) with `VITE_OPENCAGE_API_KEY` from repo secrets
5. Upload Pages artifact (`dist`)
6. Deploy artifact to GitHub Pages

## Release Checklist

Before pushing:

```bash
npm run test:run
npm run build
```

Optional quality check:

```bash
npm run lint
```

Then:

1. Push branch to `main` (or merge PR into `main`).
2. Wait for **Deploy to GitHub Pages** workflow to succeed.
3. Open deployed site and run smoke checks.

## Post-Deploy Smoke Test

- App loads from `https://<username>.github.io/divisioner/`
- JS/CSS assets load without 404s
- Map tiles render
- Geocoding search works
- Reverse lookup from map click works

## Troubleshooting

### Build fails: missing `VITE_OPENCAGE_API_KEY`

- Confirm repository secret exists and name is exact: `VITE_OPENCAGE_API_KEY`.
- Re-run the workflow from the Actions tab.

### Deployed page loads, but JS/CSS 404

- Check `vite.config.ts` production base path matches repo name:
  - expected: `/divisioner/`
- If repo name changes, update base path and redeploy.

### Workflow fails at deploy step

- Confirm Pages source is set to **GitHub Actions**.
- Confirm workflow permissions include:
  - `contents: read`
  - `pages: write`
  - `id-token: write`

### Geocoding not working in production

- Verify `VITE_OPENCAGE_API_KEY` secret is valid.
- Check browser console/network for OpenCage request failures.
- Confirm key restrictions (if configured) allow GitHub Pages domain.
