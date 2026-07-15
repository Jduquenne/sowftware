import { useState } from 'react'
import { useStore } from '../../store'
import { filterByCategory, listCategories } from './logic/filters'
import { CategoryFilterChips } from '../../ui/CategoryFilter'
import { CatalogCard } from '../../ui/CatalogCard'

export function CatalogMobile() {
  const catalog = useStore((s) => s.catalog)
  const [categorie, setCategorie] = useState<string | null>(null)
  const categories = listCategories(catalog)
  const entries = filterByCategory(catalog, categorie)

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-green-800">Catalogue</h1>

      <div className="mt-3">
        <CategoryFilterChips categories={categories} selected={categorie} onSelect={setCategorie} />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {entries.map((entry) => (
          <CatalogCard key={entry.id} entry={entry} variant="horizontal" />
        ))}
      </div>

      <p className="mt-3 text-xs text-neutral-400">{entries.length} éléments</p>
    </div>
  )
}
