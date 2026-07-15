import type { CatalogEntry } from '../../../services/db'
import { COMPANION_PAIRS, type CompanionRelation } from '../../../data/companionRules'

export interface CompanionCheck {
  relation: CompanionRelation
  reason: string
}

function normalize(name: string): string {
  return name.trim().toLowerCase()
}

/**
 * Explicit pairs take priority; same botanical family falls back to 'avoid'
 * (crop rotation / shared pest-disease risk) when no explicit pair exists.
 */
export function getCompanionRelation(a: CatalogEntry, b: CatalogEntry): CompanionCheck | null {
  if (a.id === b.id) return null

  const nameA = normalize(a.nomCommun)
  const nameB = normalize(b.nomCommun)

  for (const pair of COMPANION_PAIRS) {
    const pairA = normalize(pair.a)
    const pairB = normalize(pair.b)
    if ((nameA === pairA && nameB === pairB) || (nameA === pairB && nameB === pairA)) {
      return { relation: pair.relation, reason: pair.reason }
    }
  }

  if (a.nomCommun !== b.nomCommun && a.familleBotanique === b.familleBotanique) {
    return {
      relation: 'avoid',
      reason: `Même famille botanique (${a.familleBotanique}) — succession/rotation déconseillée.`,
    }
  }

  return null
}
