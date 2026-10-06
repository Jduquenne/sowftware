import type { PlantingStatus } from '../../../services/db'

const STATUS_BADGE_CLASSES: Partial<Record<PlantingStatus, string>> = {
  planned: 'bg-neutral-100 text-neutral-700',
  sown: 'bg-sun-100 text-sun-800',
  growing: 'bg-forest-50 text-forest-700',
}

export function statusBadgeClass(status: PlantingStatus): string {
  return STATUS_BADGE_CLASSES[status] ?? 'bg-neutral-100 text-neutral-700'
}
