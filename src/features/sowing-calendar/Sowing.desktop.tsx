import { useState } from 'react'
import { Shovel } from 'lucide-react'
import { useStore } from '../../store'
import { useSearchParamState } from '../../utils/useSearchParamState'
import { filterByCategory, filterByGrowingLocation, filterBySearch, toggleValue, listCategories } from '../catalog/logic/filters'
import { FlowerPot } from '../../ui/icons/FlowerPot'
import {
  getSowingForMonth,
  sowingCountsByMonth,
  hasSowingData,
  sowingKindLabel,
  sowingKindClass,
  sowingKindActiveClass,
  sowingKindIcon,
  type SowingKind,
} from './logic/sowing'
import { getCurrentMonth, MONTH_NAMES_SHORT } from '../../utils/months'
import { CategoryFilterList } from '../../ui/CategoryFilter'
import { MonthPicker } from '../../ui/MonthPicker'
import { ToggleList } from '../../ui/ToggleGroup'
import { FilterChips, type FilterOption } from '../../ui/Filter'
import { TextInput } from '../../ui/Input'
import { Badge } from '../../ui/Badge'
import { CatalogCard } from '../../ui/CatalogCard'
import { EmptyState } from '../../ui/EmptyState'

const KIND_OPTIONS: SowingKind[] = ['semis', 'bouture']
const KIND_TOGGLE_OPTIONS: FilterOption<SowingKind>[] = KIND_OPTIONS.map((k) => ({
  value: k,
  label: sowingKindLabel(k),
  icon: sowingKindIcon(k),
  activeClass: sowingKindActiveClass(k),
}))
const VIEW_MODE_OPTIONS: FilterOption<'month' | 'year'>[] = [
  { value: 'month', label: 'Vue mensuelle', activeClass: 'bg-green-800 text-white' },
  { value: 'year', label: 'Vue annuelle', activeClass: 'bg-green-800 text-white' },
]
const SemisIcon = sowingKindIcon('semis')
const BoutureIcon = sowingKindIcon('bouture')

export function SowingDesktop() {
  const catalog = useStore((s) => s.catalog)
  const [month, setMonth] = useState(getCurrentMonth())
  const [categorie, setCategorie] = useState<string | null>(null)
  const [potActive, setPotActive] = useState(false)
  const [groundActive, setGroundActive] = useState(false)
  const [activeKinds, setActiveKinds] = useState<SowingKind[]>(KIND_OPTIONS)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useSearchParamState<'month' | 'year'>('view', 'month')

  const categories = listCategories(catalog)
  const filtered = filterBySearch(
    filterByGrowingLocation(filterByCategory(catalog, categorie), potActive, groundActive),
    search,
  )

  const monthItems = getSowingForMonth(filtered, month).filter(({ kinds }) =>
    kinds.some((k) => activeKinds.includes(k)),
  )
  const monthCounts = sowingCountsByMonth(filtered)

  const yearRows = filtered.filter(
    (entry) =>
      hasSowingData(entry) &&
      ((activeKinds.includes('semis') && entry.moisSemis.length > 0) ||
        (activeKinds.includes('bouture') && entry.moisBouture.length > 0)),
  )

  return (
    <div className="flex h-full">
      <aside className="w-40 shrink-0 overflow-y-auto border-r border-neutral-200 p-3">
        <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" />

        <div className="mb-2 mt-4 text-xs font-semibold uppercase text-neutral-400">Catégorie</div>
        <CategoryFilterList categories={categories} selected={categorie} onSelect={setCategorie} />

        <div className="mb-2 mt-5 text-xs font-semibold uppercase text-neutral-400">Emplacement</div>
        <div className="flex gap-1">
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

        <div className="mb-2 mt-5 text-xs font-semibold uppercase text-neutral-400">Type</div>
        <ToggleList
          options={KIND_TOGGLE_OPTIONS}
          active={activeKinds}
          onToggle={(k) => setActiveKinds((prev) => toggleValue(prev, k))}
          iconOnly
        />
      </aside>

      <div className="flex min-h-0 flex-1 flex-col p-6">
        <div className="mb-4 flex shrink-0 items-baseline justify-between">
          <h1 className="text-xl font-semibold text-green-800">Calendrier de semis et boutures</h1>
          <span className="text-sm text-neutral-400">
            {viewMode === 'month' ? monthItems.length : yearRows.length} éléments
          </span>
        </div>

        <div className="mb-4 shrink-0">
          <FilterChips options={VIEW_MODE_OPTIONS} selected={viewMode} onSelect={setViewMode} />
        </div>

        {viewMode === 'month' ? (
          <>
            <MonthPicker month={month} onSelect={setMonth} counts={monthCounts} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {monthItems.map(({ entry, kinds }) => (
                  <CatalogCard
                    key={entry.id}
                    entry={entry}
                    variant="vertical"
                    extra={
                      <div className="flex flex-wrap gap-1">
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
              {monthItems.length === 0 && (
                <EmptyState className="mt-6">Rien pour ce mois avec ces filtres.</EmptyState>
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-3 flex shrink-0 items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5" title={sowingKindLabel('semis')}>
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <SemisIcon size={13} />
              </span>
              <span className="flex items-center gap-1.5" title={sowingKindLabel('bouture')}>
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                <BoutureIcon size={13} />
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full table-fixed text-left text-sm">
                <thead>
                  <tr className="text-neutral-400">
                    <th className="sticky top-0 z-10 w-56 border-b border-neutral-200 bg-neutral-50 pb-2 pr-2 pt-1 font-medium">
                      Plante
                    </th>
                    {MONTH_NAMES_SHORT.map((m) => (
                      <th
                        key={m}
                        title={m}
                        className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 pb-2 pt-1 text-center font-medium"
                      >
                        {m[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {yearRows.map((entry) => (
                    <tr key={entry.id}>
                      <td className="w-56 py-1.5 pr-2 text-neutral-800">
                        {entry.nomCommun} <span className="text-neutral-400">— {entry.variete}</span>
                      </td>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                        const showSemis = activeKinds.includes('semis') && entry.moisSemis.includes(m)
                        const showBouture = activeKinds.includes('bouture') && entry.moisBouture.includes(m)
                        return (
                          <td key={m} className="py-1.5">
                            <div className="flex items-center justify-center gap-0.5">
                              {showSemis && <span className="h-2 w-2 rounded-full bg-green-500" />}
                              {showBouture && <span className="h-2 w-2 rounded-full bg-teal-500" />}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {yearRows.length === 0 && (
                <EmptyState className="mt-6">Aucune plante ne correspond à ces filtres.</EmptyState>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
