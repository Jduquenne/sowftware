import { Carrot, Apple, Leaf, Flower2, type LucideIcon } from 'lucide-react'

export interface CategoryStyle {
  icon: LucideIcon
  label: string
  pluralLabel: string
  /** Background + text for a small inline badge (e.g. a category tag on a row). */
  badgeClass: string
  /** Gradient used as the visual fallback when an entry has no photo. */
  gradientClass: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  legume: {
    icon: Carrot,
    label: 'Légume',
    pluralLabel: 'Légumes',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    gradientClass: 'from-emerald-200 via-emerald-400 to-emerald-700',
  },
  fruit: {
    icon: Apple,
    label: 'Fruit',
    pluralLabel: 'Fruits',
    badgeClass: 'bg-orange-100 text-orange-800',
    gradientClass: 'from-orange-200 via-orange-400 to-orange-700',
  },
  aromate: {
    icon: Leaf,
    label: 'Aromate',
    pluralLabel: 'Aromates',
    badgeClass: 'bg-violet-100 text-violet-800',
    gradientClass: 'from-violet-200 via-violet-400 to-violet-700',
  },
  fleur: {
    icon: Flower2,
    label: 'Fleur',
    pluralLabel: 'Fleurs',
    badgeClass: 'bg-pink-100 text-pink-800',
    gradientClass: 'from-pink-200 via-pink-400 to-pink-700',
  },
}

const DEFAULT_STYLE: Omit<CategoryStyle, 'label' | 'pluralLabel'> = {
  icon: Leaf,
  badgeClass: 'bg-neutral-100 text-neutral-700',
  gradientClass: 'from-forest-200 via-forest-400 to-forest-700',
}

export function getCategoryStyle(categorie: string): CategoryStyle {
  const label = categorie.charAt(0).toUpperCase() + categorie.slice(1)
  return CATEGORY_STYLES[categorie] ?? { ...DEFAULT_STYLE, label, pluralLabel: label }
}
