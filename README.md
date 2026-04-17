# ⚡ Auto-Divisioner

An interactive tool for dividing sports teams into divisions based on their geographic locations. Built with React and Leaflet, the app helps visualize and organize teams efficiently — great for custom leagues, expansion scenarios, or geography-based clustering.

## ✨ Features

- 🔍 Input teams with names and locations (type or pick from a map)
- 📍 Click on a map to set coordinates
- 📦 Load preset team lists (NBA, Euroleague, etc.)
- 🧠 Automatically generate divisions and conferences by proximity
- 🗺️ View divisions on an interactive map
- 🎨 Each division is color-coded consistently across the app
- 🔁 Toggle rivalry matrix view
- 🧾 Responsive and mobile-friendly UI

## 🚀 Quick Start

```bash
npm install
npm run dev
```

If you want geocoding enabled locally, create `.env.local`:

```bash
VITE_OPENCAGE_API_KEY=your_opencage_api_key
```

Without this variable, the app still runs, but geocoding search/reverse lookup is disabled.

## Deployment

This project deploys to GitHub Pages via GitHub Actions.

For full setup and maintainer runbook (secrets, Pages settings, verification, troubleshooting), see [`docs/deploy.md`](docs/deploy.md).
Alternatively you can find a hosted version at https://kirillreuk.github.io/divisioner

## 📦 Presets
Includes built-in presets like:

- NBA teams
- WNBA teams
- Euroleague teams
- More coming soon...

## 📌 Tech Stack

- React + TypeScript
- Tailwind CSS
- React Leaflet (with OpenStreetMap tiles)
- Headless UI for modals
- Lucide icons

## 📄 License
MIT

Made with 🏀 by Kirill Reuk
