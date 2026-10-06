import { useState } from 'react'
import { Shovel } from 'lucide-react'
import { useStore } from '../../store'
import { filterByCategory, filterByGrowingLocation, filterBySearch, listCategories } from '../catalog/logic/filters'
import { FlowerPot } from '../../ui/icons/FlowerPot'
import { getSowingForMonth, sowingKindLabel, sowingKindClass, sowingKindIcon } from './logic/sowing'
import { getCurrentMonth } from '../../utils/months'
import { CategoryFilterChips } from '../../ui/CategoryFilter'
import { MonthNav } from '../../ui/MonthNav'
import { Badge } from '../../ui/Badge'
import { TextInput } from '../../ui/Input'
import { CatalogCard } from '../../ui/CatalogCard'
import { EmptyState } from '../../ui/EmptyState'

export function SowingMobile() {
  const catalog = useStore((s) => s.catalog)
  const [month, setMonth] = useState(getCurrentMonth())
  const [categorie, setCategorie] = useState<string | null>(null)
  const [potActive, setPotActive] = useState(false)
  const [groundActive, setGroundActive] = useState(false)
  const [search, setSearch] = useState('')

  const categories = listCategories(catalog)
  const filtered = filterBySearch(
    filterByGrowingLocation(filterByCategory(catalog, categorie), potActive, groundActive),
    search,
  )
  const items = getSowingForMonth(filtered, month)

  return (
    <div className="p-4">
      <MonthNav month={month} onChange={setMonth} />

      <div className="mt-3">
        <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" />
      </div>

      <div className="mt-2">
        <CategoryFilterChips categories={categories} selected={categorie} onSelect={setCategorie} />
      </div>

      <div className="mt-2 flex gap-1">
        <button
          type="button"
          onClick={() => setPotActive((v) => !v)}
          title="En pot"
          aria-pressed={potActive}
          className={`flex items-center gap-1.5 rounded p-1.5 text-xs ${
            potActive ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-400'
          }`}
        >
          <FlowerPot size={15} />
        </button>
        <button
          type="button"
          onClick={() => setGroundActive((v) => !v)}
          title="En terre"
          aria-pressed={groundActive}
          className={`flex items-center gap-1.5 rounded p-1.5 text-xs ${
            groundActive ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-400'
          }`}
        >
          <Shovel size={15} />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {items.map(({ entry, kinds }) => (
          <CatalogCard
            key={entry.id}
            entry={entry}
            variant="horizontal"
            extra={
              <div className="mt-1 flex flex-wrap gap-1">
                {kinds.map((k) => (
                  <Badge
                    key={k}
                    icon={sowingKindIcon(k)}
                    title={sowingKindLabel(k)}
                    className={sowingKindClass(k)}
                  />
                ))}
              </div>
            }
          />
        ))}
      </div>

      {items.length === 0 && <EmptyState className="mt-6">Rien pour ce mois avec ces filtres.</EmptyState>}

      <p className="mt-3 text-xs text-neutral-400">{items.length} éléments</p>
    </div>
  )
}
