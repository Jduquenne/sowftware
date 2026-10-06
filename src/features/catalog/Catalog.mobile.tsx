import { useState } from 'react'
import { useStore } from '../../store'
import { filterByCategory, listCategories, sortByName } from './logic/filters'
import { getCategoryStyle } from '../../utils/categoryStyle'
import { PageHeader } from '../../ui/PageHeader'
import { CategoryFilterChips } from '../../ui/CategoryFilter'
import { CatalogCard } from '../../ui/CatalogCard'

export function CatalogMobile() {
  const catalog = useStore((s) => s.catalog)
  const [categorie, setCategorie] = useState<string | null>(null)
  const categories = listCategories(catalog)
  const entries = sortByName(filterByCategory(catalog, categorie))

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-line bg-cream/90">
        <PageHeader variant="mobile" title="Catalogue" actions={`${catalog.length} plantes`} />
        <div className="px-5 pb-3">
          <CategoryFilterChips categories={categories} selected={categorie} onSelect={setCategorie} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-4">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-3xl font-semibold text-forest-900">
            {categorie ? getCategoryStyle(categorie).pluralLabel : 'Toutes les plantes'}
          </h2>
          <span className="text-sm text-neutral-500">{entries.length} plantes</span>
        </div>
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <CatalogCard key={entry.id} entry={entry} variant="horizontal" />
          ))}
        </div>
      </div>
    </div>
  )
}
