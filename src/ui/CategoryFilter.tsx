import { getCategoryStyle } from '../utils/categoryStyle'
import { FilterChips, FilterList, type FilterOption } from './Filter'

interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onSelect: (categorie: string | null) => void
}

function categoryOptions(categories: string[]): FilterOption<string | null>[] {
  return [
    { value: null, label: 'Toutes' },
    ...categories.map((c) => {
      const style = getCategoryStyle(c)
      return {
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
        icon: style.icon,
        activeClass: style.activeClass,
        iconClass: style.accentClass,
      }
    }),
  ]
}

/** Horizontal scrollable chips — mobile. */
export function CategoryFilterChips({ categories, selected, onSelect }: CategoryFilterProps) {
  return <FilterChips options={categoryOptions(categories)} selected={selected} onSelect={onSelect} />
}

/** Compact vertical list — desktop. Narrower and icon-led, not a wide plain text column. */
export function CategoryFilterList({ categories, selected, onSelect }: CategoryFilterProps) {
  return <FilterList options={categoryOptions(categories)} selected={selected} onSelect={onSelect} />
}
