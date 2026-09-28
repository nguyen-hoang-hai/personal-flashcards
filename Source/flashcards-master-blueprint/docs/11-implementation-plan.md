# 11. Implementation plan

## Libraries

Frontend:

- react, react-dom
- vite, typescript
- react-router-dom
- tailwindcss
- zod
- react-hook-form
- papaparse
- date-fns
- lucide-react

Backend:

- Cloudflare Workers runtime
- D1 binding
- zod
- hono, optional

Testing:

- vitest
- @testing-library/react
- playwright

## Phase 1

- Repo setup.
- D1 and migrations.
- One-user auth.
- Session cookie.
- Language Hub.
- English/Japanese routing.

## Phase 2

- Deck CRUD.
- User deck visibility/settings.
- Vocabulary CRUD.
- Study directions.
- Quick Add and Detailed Add.
- CSV preview/import.
- Seed importer.

## Phase 3

- Scheduler service.
- Per-language Daily Planner.
- Multi-deck controlled shuffle.
- Review queue and rating.
- Progress and review logs.

## Phase 4

- Statistics.
- Backup/export/restore.
- Mobile polish.
- Security tests.
- End-to-end tests.
