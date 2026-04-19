# YourGymBro

A clean, minimal gym workout tracker built with React 19 and Supabase. Log your sessions, track exercises, and monitor your progress — all in one place.

## Features

- **Workout sessions** — create named sessions with a date, switch between them, and delete them
- **Exercise logging** — log exercises with sets, reps, and optional weight (kg)
- **Voice input** — dictate exercises hands-free using the Web Speech API
- **Exercise autocomplete** — searchable combobox with a built-in exercise library
- **Auth** — sign up / log in via Supabase (email + password)
- **Dark / light mode** — toggle in the navbar, defaults to dark
- **Multi-language ready** — translation layer in place (English supported)

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 + Vite |
| Routing | React Router v7 |
| Backend / Auth | Supabase |
| Styling | Plain CSS (custom properties) |
| Deployment | Netlify |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key

# 3. Start the dev server
npm run dev
```

## Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Project Structure

```
src/
  pages/        # Route-level views (Home, Login, Signup, Profile, Schedule)
  components/   # UI components (workout forms, voice input, layout, navbar)
  context/      # React context providers (Auth, Workout, Language)
  hooks/        # useAuth, useWorkout
  services/     # Supabase client, auth service, workout service
  routes/       # AppRouter + ProtectedRoute
  data/         # Exercise library, translations
  utils/        # calculateVolume, formatDate
```
