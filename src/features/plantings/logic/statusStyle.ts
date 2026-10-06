import type { PlantingStatus } from '../../../services/db'

const STATUS_BADGE_CLASSES: Record<PlantingStatus, string> = {
  planned: 'bg-neutral-100 text-neutral-700',
  sown: 'bg-sun-100 text-sun-800',
  growing: 'bg-forest-50 text-forest-700',
  harvested: 'bg-orange-100 text-orange-800',
  removed: 'bg-neutral-100 text-neutral-500',
}

export function statusBadgeClass(status: PlantingStatus): string {
  return STATUS_BADGE_CLASSES[status]
}
