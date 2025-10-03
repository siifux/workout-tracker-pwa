# 6-Day Workout Split Tracker (PWA)

React + Vite + Tailwind + Service Worker. Offline-capable and installable on iOS.

## Dev
```bash
npm i
npm run dev
```
Open http://localhost:5173

## Build
```bash
npm run build
npm run preview
```

## Deploy (any static host)
- **Netlify:** drag `dist/` or connect repo.
- **Vercel:** import repo (framework: Vite).
- **GitHub Pages:** push; then `Settings → Pages → Deploy from a branch → gh-pages` (use `gh-pages` CLI or an action).

### iOS Install
1. Open your deployed URL in Safari.
2. Wait 2–3 seconds so the service worker installs.
3. Share → **Add to Home Screen**.
4. Launch from the icon; it runs standalone and works offline.

### Notes
- Data is saved in `localStorage` (per-origin). Use Export/Import inside the app to move devices.
- If you change caching, bump the `CACHE` string in `public/sw.js`.
