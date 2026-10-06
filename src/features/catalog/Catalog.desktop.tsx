import { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { useStore } from '../../store'
import { countByCategory, filterByCategory, listCategories, sortByName } from './logic/filters'
import { getCategoryStyle } from '../../utils/categoryStyle'
import { useSearchParamState } from '../../utils/useSearchParamState'
import { PageHeader } from '../../ui/PageHeader'
import { Segmented } from '../../ui/Segmented'
import { CategoryFilterList } from '../../ui/CategoryFilter'
import { CatalogCard } from '../../ui/CatalogCard'
import type { FilterOption } from '../../ui/Filter'
import { CatalogLegend } from './CatalogLegend'
import { CatalogTable } from './CatalogTable'

type ViewMode = 'grid' | 'table'

const VIEW_OPTIONS: FilterOption<ViewMode>[] = [
  { value: 'grid', label: 'Grille', icon: LayoutGrid },
  { value: 'table', label: 'Tableau', icon: List },
]

export function CatalogDesktop() {
  const catalog = useStore((s) => s.catalog)
  const [categorie, setCategorie] = useState<string | null>(null)
  const [view, setView] = useSearchParamState<ViewMode>('view', 'grid')
  const categories = listCategories(catalog)
  const entries = sortByName(filterByCategory(catalog, categorie))
  const categoryNames = categories.map((c) => getCategoryStyle(c).pluralLabel.toLowerCase()).join(', ')

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Catalogue"
        subtitle={`${catalog.length} plantes · ${categoryNames}`}
        actions={<Segmented options={VIEW_OPTIONS} selected={view} onSelect={setView} />}
      />

      <div className="flex min-h-0 flex-1 gap-8 px-10 pt-8">
        <aside className="w-64 shrink-0 space-y-5 overflow-y-auto pb-8">
          <div className="rounded-3xl border border-line bg-white p-4 shadow-card">
            <div className="mb-3 px-2 text-xs font-bold tracking-[0.15em] text-neutral-500 uppercase">Catégories</div>
            <CategoryFilterList
              categories={categories}
              selected={categorie}
              onSelect={setCategorie}
              counts={countByCategory(catalog)}
            />
          </div>
          <CatalogLegend />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-5 flex shrink-0 items-baseline justify-between">
            <h2 className="font-display text-3xl font-semibold text-forest-900">
              {categorie ? getCategoryStyle(categorie).pluralLabel : 'Toutes les plantes'}
            </h2>
            <span className="text-sm text-neutral-500">{entries.length} plantes · tri par nom</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pb-8">
            {view === 'grid' ? (
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 2xl:grid-cols-4">
                {entries.map((entry) => (
                  <CatalogCard key={entry.id} entry={entry} variant="vertical" />
                ))}
              </div>
            ) : (
              <CatalogTable entries={entries} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
