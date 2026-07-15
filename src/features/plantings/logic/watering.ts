import type { WateringLog } from '../../../services/db'

export function wateringLogsForPlanting(logs: WateringLog[], plantingId: string): WateringLog[] {
  return logs
    .filter((log) => log.plantingId === plantingId)
    .sort((a, b) => b.wateredAt.localeCompare(a.wateredAt))
}

export function daysSinceLastWatering(logs: WateringLog[]): number | null {
  if (logs.length === 0) return null
  const lastWateredAt = logs[0].wateredAt
  const diffMs = Date.now() - new Date(lastWateredAt).getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}
