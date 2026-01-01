# reWire

Mental skill maintenance web app.

## Core Principles

- Accuracy first, speed second
- 1-3 minute sessions
- Calm, minimal UI - no gamification, streaks, or dopamine tricks
- Local storage only (no accounts/backend)

## Tech Stack

- React 18 + TypeScript + Vite
- Docker (dev and prod)
- No external dependencies beyond React

## Commands

**Always use Docker unless specified otherwise.**

```bash
# Development (Docker) - preferred
docker compose up -d            # Start dev server at localhost:3000
docker compose up --build -d    # Rebuild and start
docker compose down             # Stop

# Without Docker (only if requested)
npm install
npm run dev
npm run build
```

## Project Structure

```
src/
  modules/           # Self-contained training modules
    arithmetic-grid/ # Grid-based arithmetic practice
    digit-span/      # Number sequence memory
  components/        # Shared UI components
  hooks/             # Custom React hooks
  pages/             # Page components (Home)
  styles/            # Split CSS (base, layout, components, stats)
  types/             # TypeScript types
```

## Adding a New Module

1. Create `src/modules/{module-name}/`
2. Add `index.ts` with ModuleDefinition export
3. Add main component and CSS
4. Register in `src/modules/index.ts`

## Code Style

- Functional components with hooks
- TypeScript strict mode
- CSS custom properties for theming (see `styles/base.css`)
- No external UI libraries
