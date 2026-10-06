import type { CatalogEntry } from '../../../services/db'

export function listCategories(catalog: CatalogEntry[]): string[] {
  return [...new Set(catalog.map((entry) => entry.categorie))].sort()
}

export function filterByCategory(catalog: CatalogEntry[], categorie: string | null): CatalogEntry[] {
  if (!categorie) return catalog
  return catalog.filter((entry) => entry.categorie === categorie)
}

export function filterByGrowingLocation(
  catalog: CatalogEntry[],
  potActive: boolean,
  groundActive: boolean,
): CatalogEntry[] {
  if (potActive === groundActive) return catalog
  return catalog.filter((entry) => (potActive ? entry.pot === 'oui' : entry.pot !== 'oui'))
}

export function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function filterBySearch(catalog: CatalogEntry[], search: string): CatalogEntry[] {
  const q = search.trim().toLowerCase()
  if (!q) return catalog
  return catalog.filter((entry) => `${entry.nomCommun} ${entry.variete}`.toLowerCase().includes(q))
}

export function sortByName(catalog: CatalogEntry[]): CatalogEntry[] {
  return [...catalog].sort(
    (a, b) => a.nomCommun.localeCompare(b.nomCommun, 'fr') || a.variete.localeCompare(b.variete, 'fr'),
  )
}

export function countByCategory(catalog: CatalogEntry[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const entry of catalog) counts[entry.categorie] = (counts[entry.categorie] ?? 0) + 1
  return counts
}
