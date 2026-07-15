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
