# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Architecture

**yourgymbro** is a React 19 + Vite gym/workout tracking app. The project is early-stage — the directory structure is scaffolded but most files are still empty placeholders.

**Planned backend:** Supabase (auth + database), via `src/services/supabaseClient.js`.

### Source structure

```
src/
  pages/          # Route-level views: Home, Login, Profile, Schedule, NotFound
  components/
    common/       # Reusable UI: Button, Input, Modal, Table
    layout/       # Shell components: MainLayout, Navbar, Sidebar
    workout/      # Domain components: WorkoutCard, ExerciseForm, ExerciseTable
  context/        # AuthContext, WorkoutContext (React context providers)
  hooks/          # useAuth, useWorkout (consume their respective contexts)
  services/       # supabaseClient, authService, workoutService (API layer)
  routes/         # AppRouter (React Router setup)
  data/           # mockWorkouts.js (dev/testing data)
  utils/          # calculateVolume.js, formatDate.js
```

### Data flow pattern (planned)
- `services/` — raw Supabase calls
- `context/` — global state (auth session, workout list) wrapping the app
- `hooks/` — convenience hooks (`useAuth`, `useWorkout`) that consume context
- `pages/` + `components/` — UI, using hooks to read/write state

### Key conventions
- JavaScript (not TypeScript); `.jsx` for React components, `.js` for non-JSX
- ESLint rule: `no-unused-vars` ignores names matching `/^[A-Z_]/`
- No test framework is configured yet
