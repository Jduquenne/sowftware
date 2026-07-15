import type { CatalogEntry } from '../../../services/db'

export function getHarvestForMonth(catalog: CatalogEntry[], month: number): CatalogEntry[] {
  return catalog.filter((entry) => entry.moisRecolte.includes(month))
}

export function harvestCountsByMonth(catalog: CatalogEntry[]): Record<number, number> {
  const counts: Record<number, number> = {}
  for (let m = 1; m <= 12; m++) counts[m] = getHarvestForMonth(catalog, m).length
  return counts
}
