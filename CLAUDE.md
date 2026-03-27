# AQC Mockup Starter Pack

This is a **mockup-first frontend starter pack**. Users clone this repo to build interactive UI prototypes with persistent data — no backend required.

## Architecture

- **React 19** + **TypeScript** + **Vite**
- **TanStack Router** for routing, **React Query** for async state, **React Hook Form + Zod** for forms
- **shadcn/ui** + **Tailwind CSS** for styling
- **All data lives in `src/data/db.json`** — a single JSON file that acts as the database

## Data Layer — The Golden Rule

**`src/data/db.json` is the single source of truth for all persistent data.**

This file seeds `localStorage` on first load. The mock-db engine (`src/lib/mock-db.ts`) provides CRUD operations that read/write localStorage. React Query hooks wrap these with a small async delay so loading states work realistically.

### When adding or changing data

1. **Schema changes go in `db.json`.** Add new collections as top-level arrays, add new fields to existing records. Every data shape must be represented here.
2. **Create a hook in `src/hooks/`** that uses the `mock-db` CRUD functions (`getAll`, `getById`, `query`, `create`, `update`, `remove`) wrapped with React Query (`useQuery` / `useMutation`).
3. **Create a type** either inline in the hook file or in `src/schemas/` if it needs Zod validation.
4. **If a page needs data that doesn't exist yet**, add seed records to `db.json` first, then build the hook.

### When NOT to do

- **Do NOT create a real backend, API server, or database.** Everything runs client-side.
- **Do NOT use `fetch()` or `axios` for data operations.** Use the `mock-db` functions instead.
- **Do NOT import from `pocketbase`.** The pocketbase dependency is legacy and will be removed.
- **Do NOT store data in component state for persistence.** Use `mock-db` → localStorage so data survives page reloads.

### Emulating API calls

For features that would normally require a real API (AI assessments, file uploads, email sending, payment checkout):

- Create a **mock service** in `src/services/` that returns realistic hardcoded data after a `delay()`.
- The user can later swap these stubs for real API calls without changing the UI code.

## File Organization

```
src/
├── data/db.json          ← THE DATABASE — all seed data goes here
├── lib/mock-db.ts        ← CRUD engine (getAll, getById, create, update, remove, query)
├── hooks/                ← React Query hooks for each domain (use-crm.ts, use-projects.ts, etc.)
├── services/             ← Mock API services (api-auth.ts, api-content.ts, etc.)
├── schemas/              ← Zod schemas for form validation
├── components/           ← UI components (shadcn/ui + custom)
├── pages/                ← Route pages organized by layout (app/, auth/, blog/, etc.)
├── layouts/              ← Layout wrappers (app, auth, public)
└── types/                ← TypeScript type definitions
```

## Key Patterns

### Adding a new data collection

```typescript
// 1. Add seed data to src/data/db.json
{
  "my_collection": [
    { "id": "item_1", "name": "Example", "created_at": "2025-01-01T00:00:00Z" }
  ]
}

// 2. Create hook in src/hooks/use-my-collection.ts
import * as db from '@/lib/mock-db'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface MyItem { id: string; name: string; created_at: string }

export function useMyCollection() {
  return useQuery({
    queryKey: ['my-collection'],
    queryFn: async () => {
      await db.delay()
      return db.getAll<MyItem>('my_collection')
    }
  })
}

export function useCreateMyItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<MyItem>) => {
      await db.delay()
      return db.create<MyItem>('my_collection', data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-collection'] })
  })
}
```

### Auth system

Auth is fully mocked. Any email/password combination succeeds at login. The session is stored in localStorage. The mock user has `is_admin: true` and `is_manager: true` by default. Modify the user record in `db.json` to change roles.

### Resetting data

Call `resetDb()` from `src/lib/mock-db.ts` to wipe localStorage and re-seed from `db.json`. This is useful during development when you want to start fresh.

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Type check + ESLint
```

## Style Guidelines

- Use **shadcn/ui** components from `src/components/ui/` — do not install alternative component libraries
- Use **Tailwind CSS** utility classes — do not write custom CSS unless absolutely necessary
- Use **lucide-react** for icons
- Follow existing patterns: form fields use `react-hook-form` + `zod`, data fetching uses `React Query`, routing uses `TanStack Router`
