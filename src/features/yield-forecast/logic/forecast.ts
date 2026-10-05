import type { CatalogEntry, Planting } from '../../../services/db'

export function plantsNeededForTarget(entry: CatalogEntry, targetKg: number): number | null {
  if (!entry.yieldPerPlantKg || entry.yieldPerPlantKg <= 0) return null
  return Math.ceil(targetKg / entry.yieldPerPlantKg)
}

export function areaNeededM2(entry: CatalogEntry, plantCount: number): number | null {
  if (!entry.surfaceM2ParPied) return null
  return Math.round(entry.surfaceM2ParPied.min * plantCount * 100) / 100
}

export interface PlotYieldRow {
  catalogId: string
  count: number
  subtotalKg: number | null
}

export interface PlotYieldSummary {
  totalKg: number
  rows: PlotYieldRow[]
  /** Plantings whose catalog entry has no yield estimate — flagged, not silently dropped. */
  unestimatedCount: number
}

/** Excludes removed plantings; includes planned/sown/growing/harvested as a forward-looking estimate. */
export function estimatedYieldForPlot(
  plantings: Planting[],
  plotId: string,
  catalogById: ReadonlyMap<string, CatalogEntry>,
): PlotYieldSummary {
  const active = plantings.filter((p) => p.plotId === plotId && p.status !== 'removed')

  const countByCatalog = new Map<string, number>()
  for (const planting of active) {
    countByCatalog.set(planting.catalogId, (countByCatalog.get(planting.catalogId) ?? 0) + 1)
  }

  let totalKg = 0
  let unestimatedCount = 0
  const rows: PlotYieldRow[] = []

  for (const [catalogId, count] of countByCatalog) {
    const entry = catalogById.get(catalogId)
    const perPlant = entry?.yieldPerPlantKg ?? null
    const subtotalKg = perPlant ? Math.round(perPlant * count * 100) / 100 : null
    if (subtotalKg === null) unestimatedCount += count
    else totalKg += subtotalKg
    rows.push({ catalogId, count, subtotalKg })
  }

  return { totalKg: Math.round(totalKg * 100) / 100, rows, unestimatedCount }
}
