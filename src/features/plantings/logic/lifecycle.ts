import type { PlantingStatus } from '../../../services/db'

export const PLANTING_STATUSES: { value: PlantingStatus; label: string }[] = [
  { value: 'planned', label: 'Prévu' },
  { value: 'sown', label: 'Semé' },
  { value: 'growing', label: 'En croissance' },
  { value: 'harvested', label: 'Récolté' },
  { value: 'removed', label: 'Retiré' },
]

export function plantingStatusLabel(status: PlantingStatus): string {
  return PLANTING_STATUSES.find((s) => s.value === status)?.label ?? status
}
