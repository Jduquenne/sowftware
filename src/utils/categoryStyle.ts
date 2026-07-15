import { Carrot, Apple, Leaf, Flower2, type LucideIcon } from 'lucide-react'

export interface CategoryStyle {
  icon: LucideIcon
  /** Text color for the icon/label when inactive, e.g. in an unselected filter. */
  accentClass: string
  /** Background + text for a selected/active state (filter chip, nav highlight). */
  activeClass: string
  /** Background + text for a small inline badge (e.g. a category tag on a row). */
  badgeClass: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  legume: {
    icon: Carrot,
    accentClass: 'text-emerald-600',
    activeClass: 'bg-emerald-600 text-white',
    badgeClass: 'bg-emerald-100 text-emerald-800',
  },
  fruit: {
    icon: Apple,
    accentClass: 'text-orange-600',
    activeClass: 'bg-orange-600 text-white',
    badgeClass: 'bg-orange-100 text-orange-800',
  },
  aromate: {
    icon: Leaf,
    accentClass: 'text-violet-600',
    activeClass: 'bg-violet-600 text-white',
    badgeClass: 'bg-violet-100 text-violet-800',
  },
  fleur: {
    icon: Flower2,
    accentClass: 'text-pink-600',
    activeClass: 'bg-pink-600 text-white',
    badgeClass: 'bg-pink-100 text-pink-800',
  },
}

const DEFAULT_STYLE: CategoryStyle = {
  icon: Leaf,
  accentClass: 'text-neutral-500',
  activeClass: 'bg-neutral-700 text-white',
  badgeClass: 'bg-neutral-100 text-neutral-700',
}

export function getCategoryStyle(categorie: string): CategoryStyle {
  return CATEGORY_STYLES[categorie] ?? DEFAULT_STYLE
}
