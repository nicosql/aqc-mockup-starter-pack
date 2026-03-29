# AQC Mockup Starter Pack

A **mockup-first frontend starter pack** for building interactive UI prototypes with persistent data — no backend required.

Clone this repo, add your pages and data, and get a realistic working prototype without setting up servers, databases, or APIs.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TanStack Router** for routing
- **React Query** for async state management
- **React Hook Form** + **Zod** for forms and validation
- **shadcn/ui** + **Tailwind CSS** for styling
- **lucide-react** for icons

## How It Works

All data lives in a single JSON file (`src/data/db.json`) that acts as your database. On first load it seeds `localStorage`, and a mock-db engine (`src/lib/mock-db.ts`) provides full CRUD operations against it. React Query hooks wrap these operations with a small async delay so loading and mutation states behave realistically.

For features that would normally need a real API (AI calls, file uploads, payments, etc.), create mock services in `src/services/` that return realistic hardcoded data after a `delay()`. Swap these stubs for real API calls later without touching your UI code.

## Getting Started -Windows Setup Guide

### 1. Install bun

1. open powershell
2. run the following command:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```
open a new powershell window and verify the installation:
```powershell
bun --version
```

### 2. Install Git

1. Go to https://git-scm.com/downloads/win and download the **Standalone Installer** (64-bit)
2. Run the installer — accept the defaults. The important settings are:
   - **Adjusting your PATH**: choose **"Git from the command line and also from 3rd-party software"** (the default)
   - **Line ending conversions**: choose **"Checkout Windows-style, commit Unix-style line endings"** (the default)
3. Restart any open terminals, then verify the installation:

```powershell
git --version
```

This should print something like `git version 2.x.x.windows.x`.

### 3. Clone and Run the Project

```powershell
git clone https://github.com/nicosql/aqc-mockup-starter-pack.git
cd aqc-mockup-starter-pack
bun i
npm run dev
```

The dev server will start and print a local URL (typically `http://localhost:5173`). Open that URL in your browser to see the app.
---


## Adding Data

1. Add seed records to `src/data/db.json` as a top-level array
2. Create a React Query hook in `src/hooks/` using the `mock-db` CRUD functions (`getAll`, `getById`, `query`, `create`, `update`, `remove`)
3. Add types inline or as Zod schemas in `src/schemas/`

## File Organization

```
src/
├── data/db.json       ← Seed data (the database)
├── lib/mock-db.ts     ← CRUD engine
├── hooks/             ← React Query hooks per domain
├── services/          ← Mock API services
├── schemas/           ← Zod validation schemas
├── components/        ← UI components (shadcn/ui + custom)
├── pages/             ← Route pages
├── layouts/           ← Layout wrappers
└── types/             ← TypeScript type definitions
```

## Resetting Data

Call `resetDb()` from `src/lib/mock-db.ts` to wipe localStorage and re-seed from `db.json`.



---

