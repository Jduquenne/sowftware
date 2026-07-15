import { Sprout, Scissors, type LucideIcon } from 'lucide-react'
import type { CatalogEntry } from '../../../services/db'

export type SowingKind = 'semis' | 'bouture'

export interface SowingItem {
  entry: CatalogEntry
  kinds: SowingKind[]
}

export function getSowingForMonth(catalog: CatalogEntry[], month: number): SowingItem[] {
  const items: SowingItem[] = []
  for (const entry of catalog) {
    const kinds: SowingKind[] = []
    if (entry.moisSemis.includes(month)) kinds.push('semis')
    if (entry.moisBouture.includes(month)) kinds.push('bouture')
    if (kinds.length > 0) items.push({ entry, kinds })
  }
  return items
}

export function sowingCountsByMonth(catalog: CatalogEntry[]): Record<number, number> {
  const counts: Record<number, number> = {}
  for (let m = 1; m <= 12; m++) counts[m] = getSowingForMonth(catalog, m).length
  return counts
}

export function hasSowingData(entry: CatalogEntry): boolean {
  return entry.moisSemis.length > 0 || entry.moisBouture.length > 0
}

const KIND_LABELS: Record<SowingKind, string> = { semis: 'Semis', bouture: 'Bouture' }
const KIND_CLASSES: Record<SowingKind, string> = {
  semis: 'bg-green-100 text-green-800',
  bouture: 'bg-teal-100 text-teal-800',
}
const KIND_ACTIVE_CLASSES: Record<SowingKind, string> = {
  semis: 'bg-green-700 text-white',
  bouture: 'bg-teal-700 text-white',
}
const KIND_ICONS: Record<SowingKind, LucideIcon> = { semis: Sprout, bouture: Scissors }

export function sowingKindLabel(kind: SowingKind): string {
  return KIND_LABELS[kind]
}

export function sowingKindClass(kind: SowingKind): string {
  return KIND_CLASSES[kind]
}

export function sowingKindActiveClass(kind: SowingKind): string {
  return KIND_ACTIVE_CLASSES[kind]
}

export function sowingKindIcon(kind: SowingKind): LucideIcon {
  return KIND_ICONS[kind]
}
