# reWire

Mental skill maintenance. Short, focused exercises to rebuild abilities we've offloaded to tools.

## Principles

- Accuracy first, speed second
- Sessions take 1–3 minutes
- Calm, minimal UI
- No gamification, streaks, or dopamine tricks

## Modules

- **Arithmetic Grid** — Fill a grid with the result of row ○ column
- **Digit Span** — Remember and recall number sequences
- **Stroop Test** — Name the ink color, not the word
- **Number Sequences** — Find the pattern, predict the next number
- **Spell Check** — Spot the misspelled words
- **Mental Map** — Follow directions from memory

## Run

```bash
# Development (hot reload)
docker compose up dev       # http://localhost:3000

# Production
docker compose up prod      # http://localhost:8080
```

## Data

Session history stored in browser localStorage only. No accounts, no backend.
