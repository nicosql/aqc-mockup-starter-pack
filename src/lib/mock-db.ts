/**
 * Mock Database — localStorage-backed CRUD engine.
 *
 * On first load the seed data from `src/data/db.json` is written to
 * localStorage.  Every subsequent mutation updates localStorage so data
 * persists across page reloads.  Call `resetDb()` to wipe local changes
 * and re-seed from the JSON file.
 *
 * All public helpers return **plain JS values** (no Promises) but the
 * React-Query hooks in the hooks/ directory wrap them with a fake
 * `delay()` so the UI feels realistic (loading spinners, etc.).
 */

import seedData from '@/data/db.json'

const DB_KEY = 'mockup-db'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type DB = Record<string, unknown[]>

function readDb(): DB {
  const raw = localStorage.getItem(DB_KEY)
  if (raw) return JSON.parse(raw) as DB
  // First load — seed from JSON
  localStorage.setItem(DB_KEY, JSON.stringify(seedData))
  return structuredClone(seedData) as unknown as DB
}

function writeDb(db: DB) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function uid(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

// ---------------------------------------------------------------------------
// Public CRUD API
// ---------------------------------------------------------------------------

/** Return every record in a collection. */
export function getAll<T = Record<string, unknown>>(collection: string): T[] {
  const db = readDb()
  return (db[collection] ?? []) as T[]
}

/** Return a single record by `id` (or any key). */
export function getById<T = Record<string, unknown>>(
  collection: string,
  id: string,
  key = 'id'
): T | undefined {
  return getAll<T>(collection).find(
    (r) => (r as Record<string, unknown>)[key] === id
  )
}

/** Return records matching an arbitrary predicate. */
export function query<T = Record<string, unknown>>(
  collection: string,
  filter: (item: T) => boolean
): T[] {
  return getAll<T>(collection).filter(filter)
}

/** Insert a new record. `id`, `created_at`, and `updated_at` are auto-set. */
export function create<T = Record<string, unknown>>(
  collection: string,
  data: Partial<T>
): T {
  const db = readDb()
  const record = {
    id: uid(),
    ...data,
    created_at: now(),
    updated_at: now()
  } as T
  const list = (db[collection] ?? []) as unknown[]
  list.push(record)
  db[collection] = list
  writeDb(db)
  return record
}

/** Merge `data` into the record with the given `id`. */
export function update<T = Record<string, unknown>>(
  collection: string,
  id: string,
  data: Partial<T>
): T {
  const db = readDb()
  const list = (db[collection] ?? []) as Record<string, unknown>[]
  const idx = list.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error(`Record ${id} not found in ${collection}`)
  list[idx] = { ...list[idx], ...data, updated_at: now() }
  db[collection] = list
  writeDb(db)
  return list[idx] as T
}

/** Remove a record by id. */
export function remove(collection: string, id: string): void {
  const db = readDb()
  const list = (db[collection] ?? []) as Record<string, unknown>[]
  db[collection] = list.filter((r) => r.id !== id)
  writeDb(db)
}

/** Read / write a singleton value (e.g. `time_overview`). */
export function getSingleton<T>(key: string): T {
  const db = readDb()
  return db[key] as unknown as T
}

export function setSingleton<T>(key: string, value: T): void {
  const db = readDb()
  ;(db as Record<string, unknown>)[key] = value
  writeDb(db)
}

/** Wipe localStorage and re-seed from db.json. */
export function resetDb(): void {
  localStorage.removeItem(DB_KEY)
  readDb() // re-seeds
}

// ---------------------------------------------------------------------------
// Fake async wrapper — use in hooks for realistic loading states.
// ---------------------------------------------------------------------------

const DEFAULT_DELAY = 120 // ms — fast enough to feel snappy, slow enough to flash a spinner

export function delay(ms = DEFAULT_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
