import { LayoutGrid } from 'lucide-react'
import { getCategoryStyle } from '../utils/categoryStyle'
import { FilterChips, FilterList, type FilterOption } from './Filter'

interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onSelect: (categorie: string | null) => void
  counts?: Record<string, number>
}

function categoryOptions(categories: string[], counts?: Record<string, number>): FilterOption<string | null>[] {
  const total = counts ? Object.values(counts).reduce((sum, n) => sum + n, 0) : undefined
  return [
    { value: null, label: 'Toutes', icon: LayoutGrid, count: total },
    ...categories.map((c) => {
      const style = getCategoryStyle(c)
      return { value: c, label: style.pluralLabel, icon: style.icon, iconClass: style.badgeClass, count: counts?.[c] }
    }),
  ]
}

/** Horizontal scrollable chips — mobile. */
export function CategoryFilterChips({ categories, selected, onSelect, counts }: CategoryFilterProps) {
  return <FilterChips options={categoryOptions(categories, counts)} selected={selected} onSelect={onSelect} />
}

/** Compact vertical list — desktop. */
export function CategoryFilterList({ categories, selected, onSelect, counts }: CategoryFilterProps) {
  return <FilterList options={categoryOptions(categories, counts)} selected={selected} onSelect={onSelect} />
}
