# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a 6-Day Workout Split Tracker PWA (Progressive Web App) built with React, Vite, and Tailwind CSS. The app is designed to be installable on iOS devices and works offline using a service worker. It tracks workout sessions with a specific 6-day split program with alternating leg day variations.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Architecture and Key Concepts

### Single Page Application Structure
- **App.jsx**: Main application component containing all workout logic, state management, and UI
- **main.jsx**: Entry point that renders the App component
- **index.css**: Global styles (Tailwind CSS)

### Data Management
- Uses `localStorage` with key `sixDaySplitTracker_v1` for persistence
- Data structure: `{ notes: "", history: {} }`
- Session keys format: `${dateKey}_${currentDayLabel}_LV${legVariant}` (e.g., "2024-10-03_Push_LVA")
- Each session stores: `{ completed: {}, notes: "" }`

### Workout Program Structure
The app implements a specific 6-day split with these components:
- **dayOrder**: `["Push", "Pull & Abs", "Rest", "Leg Day", "Upper Body", "Rest (2)"]`
- **Leg Variants**: A (Hamstring-focused) and B (Quad-focused) for leg days
- **Exercise tracking**: Each exercise has sets/reps, and individual sets can be marked complete

### PWA Configuration
- **Service Worker**: `public/sw.js` handles caching with version `workout-tracker-v1`
- **Manifest**: `public/manifest.json` enables installation on mobile devices
- **Base Path**: Configured for GitHub Pages deployment (`/workout-tracker-pwa/`)

### State Management Patterns
- Single component manages all state (no external state management)
- `useEffect` for localStorage persistence
- `useMemo` for computing current day's workout blocks
- Toggle functions for marking sets complete

## Development Notes

### Styling
- Uses Tailwind CSS with custom rounded corners (`rounded-2xl`) throughout
- Responsive design with `sm:` breakpoints
- Color scheme: Gray backgrounds with white cards and green completion indicators

### Key Functions to Understand
- `buildSimpleBlock()`: Creates workout blocks for Push/Legs
- `buildPullAbsBlock()`: Special handling for Pull & Abs day
- `buildUpperBlock()`: Structures Upper Body day with multiple sections
- `getTodayIndex()`: Maps calendar days to workout schedule (Monday = index 0)

### Cache Management
When modifying caching behavior, update the `CACHE` string in `public/sw.js` to ensure proper cache invalidation.

### Deployment Configuration
- GitHub Pages deployment via `gh-pages` package
- Homepage URL configured in package.json
- Vite base path set to `/workout-tracker-pwa/` for GitHub Pages

