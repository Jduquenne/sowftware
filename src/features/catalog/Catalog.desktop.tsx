import { useState } from 'react'
import { useStore } from '../../store'
import { filterByCategory, listCategories } from './logic/filters'
import { CategoryFilterList } from '../../ui/CategoryFilter'
import { CatalogCard } from '../../ui/CatalogCard'

export function CatalogDesktop() {
  const catalog = useStore((s) => s.catalog)
  const [categorie, setCategorie] = useState<string | null>(null)
  const categories = listCategories(catalog)
  const entries = filterByCategory(catalog, categorie)

  return (
    <div className="flex h-full">
      <aside className="w-36 shrink-0 overflow-y-auto border-r border-neutral-200 p-3">
        <div className="mb-2 text-xs font-semibold uppercase text-neutral-400">Catégorie</div>
        <CategoryFilterList categories={categories} selected={categorie} onSelect={setCategorie} />
      </aside>

      <div className="flex min-h-0 flex-1 flex-col p-6">
        <div className="mb-4 flex shrink-0 items-baseline justify-between">
          <h1 className="text-xl font-semibold text-green-800">Catalogue</h1>
          <span className="text-sm text-neutral-400">{entries.length} éléments</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {entries.map((entry) => (
              <CatalogCard key={entry.id} entry={entry} variant="vertical" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
