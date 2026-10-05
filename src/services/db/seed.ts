import { getDB, getMeta, setMeta } from './database'
import type { CatalogEntry } from './schema'
import catalogSeedData from '../../data/catalog.seed.json'

// Bump on every change to catalog.seed.json or to the transform logic above —
// existing installs compare against this to decide whether to reseed, so an
// unbumped version silently keeps stale (or empty) data forever.
export const SEED_VERSION = 8
const SEED_VERSION_KEY = 'catalogSeedVersion'

/**
 * Ensures the catalog is seeded and up to date.
 *
 * Non-destructive by contract: only the `catalog` store is (re)written here.
 * User-owned stores (plots, placements, plantings, wateringLogs) are never
 * touched, so bumping SEED_VERSION refreshes reference data without losing
 * anything the user created.
 */
export async function ensureSeed(): Promise<void> {
  const current = await getMeta<number>(SEED_VERSION_KEY)
  if (current === SEED_VERSION) return

  const db = await getDB()
  const tx = db.transaction('catalog', 'readwrite')
  await tx.store.clear()
  await Promise.all((catalogSeedData as CatalogEntry[]).map((entry) => tx.store.put(entry)))
  await tx.done

  await setMeta(SEED_VERSION_KEY, SEED_VERSION)
}
