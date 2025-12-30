# reWire

Mental skill maintenance for technical adults. Short, focused exercises to rebuild abilities we've offloaded to tools.

## Principles

- Accuracy first, speed second
- Sessions take 1–3 minutes
- Calm, minimal UI
- No gamification, streaks, or dopamine tricks

## Modules

### Addition Grid
Fill a grid with row + column sums. Rebuilds arithmetic fluency and working memory.

- Configurable size (3×3 to 6×6)
- Optional timer (off by default)
- Immediate feedback on submission

*More modules planned.*

## Run

```bash
# Development (hot reload)
docker compose up dev       # http://localhost:3000

# Production
docker compose up prod      # http://localhost:8080
```

## Data

Session history stored in browser localStorage only. No accounts, no backend.
