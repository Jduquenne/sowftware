import type { CatalogEntry, Planting, Plot, WateringLog } from '../../../services/db'
import { getSowingForMonth } from '../../sowing-calendar/logic/sowing'
import { getHarvestForMonth } from '../../harvest-calendar/logic/harvest'
import { wateringLogsForPlanting, daysSinceLastWatering } from '../../plantings/logic/watering'
import { getCurrentMonth } from '../../../utils/months'

const WATERING_ALERT_DAYS = 3
const LIST_PREVIEW_SIZE = 6

export interface WateringAlert {
  planting: Planting
  entry: CatalogEntry | undefined
  days: number | null
}

export interface DashboardSummary {
  plotCount: number
  activePlantingCount: number
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
  const activePlantings = plantings.filter((p) => p.status === 'sown' || p.status === 'growing')

  const wateringAlerts: WateringAlert[] = activePlantings
    .map((planting) => {
      const logs = wateringLogsForPlanting(wateringLogs, planting.id)
      return { planting, entry: catalogById.get(planting.catalogId), days: daysSinceLastWatering(logs) }
    })
    .filter((alert) => alert.days === null || alert.days >= WATERING_ALERT_DAYS)

  return {
    plotCount: plots.length,
    activePlantingCount: activePlantings.length,
    sowingThisMonth: getSowingForMonth(catalog, month)
      .map((item) => item.entry)
      .slice(0, LIST_PREVIEW_SIZE),
    harvestThisMonth: getHarvestForMonth(catalog, month).slice(0, LIST_PREVIEW_SIZE),
    wateringAlerts,
  }
}
