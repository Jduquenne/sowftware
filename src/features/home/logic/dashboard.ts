import type { CatalogEntry, Planting, PlantingStatus, Plot, WateringLog } from '../../../services/db'
import { getSowingForMonth } from '../../sowing-calendar/logic/sowing'
import { getHarvestForMonth } from '../../harvest-calendar/logic/harvest'
import { wateringLogsForPlanting, daysSinceLastWatering } from '../../plantings/logic/watering'
import { getCurrentMonth } from '../../../utils/months'

const WATERING_ALERT_DAYS = 3
const LIST_PREVIEW_SIZE = 6
const ONGOING_STATUSES: PlantingStatus[] = ['planned', 'sown', 'growing']

export interface WateringAlert {
  planting: Planting
  entry: CatalogEntry | undefined
  plot: Plot | undefined
  days: number | null
}

export interface DashboardSummary {
  plotCount: number
  subPlotCount: number
  ongoingPlantingCount: number
  statusCounts: { status: PlantingStatus; count: number }[]
  sowingCount: number
  harvestCount: number
  sowingThisMonth: CatalogEntry[]
  harvestThisMonth: CatalogEntry[]
  wateringAlerts: WateringAlert[]
}

/** Sowing/harvest lists come from the whole catalog (what's in season), not just what the user planted. */
export function buildDashboardSummary(
  catalog: CatalogEntry[],
  plots: Plot[],
  plantings: Planting[],
  wateringLogs: WateringLog[],
): DashboardSummary {
  const month = getCurrentMonth()
  const catalogById = new Map(catalog.map((c) => [c.id, c]))
  const plotById = new Map(plots.map((p) => [p.id, p]))
  const wateredPlantings = plantings.filter((p) => p.status === 'sown' || p.status === 'growing')
  const sowing = getSowingForMonth(catalog, month).map((item) => item.entry)
  const harvest = getHarvestForMonth(catalog, month)

  const wateringAlerts: WateringAlert[] = wateredPlantings
    .map((planting) => {
      const logs = wateringLogsForPlanting(wateringLogs, planting.id)
      return {
        planting,
        entry: catalogById.get(planting.catalogId),
        plot: planting.plotId ? plotById.get(planting.plotId) : undefined,
        days: daysSinceLastWatering(logs),
      }
    })
    .filter((alert) => alert.days === null || alert.days >= WATERING_ALERT_DAYS)

  const statusCounts = ONGOING_STATUSES.map((status) => ({
    status,
    count: plantings.filter((p) => p.status === status).length,
  })).filter((s) => s.count > 0)

  return {
    plotCount: plots.length,
    subPlotCount: plots.filter((p) => p.parentPlotId !== null).length,
    ongoingPlantingCount: statusCounts.reduce((sum, s) => sum + s.count, 0),
    statusCounts,
    sowingCount: sowing.length,
    harvestCount: harvest.length,
    sowingThisMonth: sowing.slice(0, LIST_PREVIEW_SIZE),
    harvestThisMonth: harvest.slice(0, LIST_PREVIEW_SIZE),
    wateringAlerts,
  }
}
