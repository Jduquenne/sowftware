import { useState } from 'react'
import { CalendarDays, LayoutGrid } from 'lucide-react'
import { useStore } from '../../store'
import { useSearchParamState } from '../../utils/useSearchParamState'
import { filterByCategory, filterByGrowingLocation, filterBySearch, toggleValue, listCategories, sortByName } from '../catalog/logic/filters'
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
import { getCurrentMonth, monthName } from '../../utils/months'
import { PageHeader } from '../../ui/PageHeader'
import { Segmented } from '../../ui/Segmented'
import { PanelCard } from '../../ui/PanelCard'
import { LocationToggle } from '../../ui/LocationToggle'
import { CategoryFilterList } from '../../ui/CategoryFilter'
import { MonthPicker } from '../../ui/MonthPicker'
import { ToggleList } from '../../ui/ToggleGroup'
import type { FilterOption } from '../../ui/Filter'
import { TextInput } from '../../ui/Input'
import { Badge } from '../../ui/Badge'
import { CatalogCard } from '../../ui/CatalogCard'
import { YearTable } from '../../ui/YearTable'
import { EmptyState } from '../../ui/EmptyState'

type ViewMode = 'month' | 'year'

const KIND_OPTIONS: SowingKind[] = ['semis', 'bouture']
const KIND_TOGGLE_OPTIONS: FilterOption<SowingKind>[] = KIND_OPTIONS.map((k) => ({
  value: k,
  label: sowingKindLabel(k),
  icon: sowingKindIcon(k),
  activeClass: sowingKindActiveClass(k),
}))
const VIEW_OPTIONS: FilterOption<ViewMode>[] = [
  { value: 'month', label: 'Par mois', icon: LayoutGrid },
  { value: 'year', label: "Sur l'année", icon: CalendarDays },
]
const KIND_DOT: Record<SowingKind, string> = { semis: 'bg-forest-400', bouture: 'bg-teal-500' }

export function SowingDesktop() {
  const catalog = useStore((s) => s.catalog)
  const [month, setMonth] = useState(getCurrentMonth())
  const [categorie, setCategorie] = useState<string | null>(null)
  const [potActive, setPotActive] = useState(false)
  const [groundActive, setGroundActive] = useState(false)
  const [activeKinds, setActiveKinds] = useState<SowingKind[]>(KIND_OPTIONS)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useSearchParamState<ViewMode>('view', 'month')

  const categories = listCategories(catalog)
  const filtered = sortByName(
    filterBySearch(filterByGrowingLocation(filterByCategory(catalog, categorie), potActive, groundActive), search),
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
  const count = viewMode === 'month' ? monthItems.length : yearRows.length

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Semis"
        subtitle="Calendrier de semis et de boutures"
        actions={<Segmented options={VIEW_OPTIONS} selected={viewMode} onSelect={setViewMode} />}
      />

      <div className="flex min-h-0 flex-1 gap-8 px-10 pt-8">
        <aside className="w-64 shrink-0 space-y-5 overflow-y-auto pb-8">
          <PanelCard title="Recherche">
            <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" />
          </PanelCard>
          <PanelCard title="Catégories">
            <CategoryFilterList categories={categories} selected={categorie} onSelect={setCategorie} />
          </PanelCard>
          <PanelCard title="Emplacement">
            <LocationToggle
              potActive={potActive}
              groundActive={groundActive}
              onTogglePot={() => setPotActive((v) => !v)}
              onToggleGround={() => setGroundActive((v) => !v)}
            />
          </PanelCard>
          <PanelCard title="Type">
            <ToggleList
              options={KIND_TOGGLE_OPTIONS}
              active={activeKinds}
              onToggle={(k) => setActiveKinds((prev) => toggleValue(prev, k))}
            />
          </PanelCard>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          {viewMode === 'month' && <MonthPicker month={month} onSelect={setMonth} counts={monthCounts} />}
          <div className="mb-5 flex shrink-0 items-baseline justify-between">
            <h2 className="font-display text-3xl font-semibold text-forest-900">
              {viewMode === 'month' ? `À semer en ${monthName(month).toLowerCase()}` : "Toute l'année"}
            </h2>
            {viewMode === 'year' ? (
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                {KIND_OPTIONS.map((k) => (
                  <span key={k} className="flex items-center gap-1.5">
                    <span className={`size-2.5 rounded-full ${KIND_DOT[k]}`} />
                    {sowingKindLabel(k)}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-neutral-500">{count} plantes</span>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-8">
            {viewMode === 'month' ? (
              <>
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 2xl:grid-cols-4">
                  {monthItems.map(({ entry, kinds }) => (
                    <CatalogCard
                      key={entry.id}
                      entry={entry}
                      variant="vertical"
                      extra={
                        <div className="flex flex-wrap gap-1">
                          {kinds.map((k) => (
                            <Badge key={k} pill icon={sowingKindIcon(k)} className={sowingKindClass(k)}>
                              {sowingKindLabel(k)}
                            </Badge>
                          ))}
                        </div>
                      }
                    />
                  ))}
                </div>
                {monthItems.length === 0 && <EmptyState className="mt-6">Rien pour ce mois avec ces filtres.</EmptyState>}
              </>
            ) : (
              <>
                <YearTable
                  entries={yearRows}
                  renderMonth={(entry, m) => (
                    <>
                      {activeKinds.includes('semis') && entry.moisSemis.includes(m) && (
                        <span className={`size-2.5 rounded-full ${KIND_DOT.semis}`} />
                      )}
                      {activeKinds.includes('bouture') && entry.moisBouture.includes(m) && (
                        <span className={`size-2.5 rounded-full ${KIND_DOT.bouture}`} />
                      )}
                    </>
                  )}
                />
                {yearRows.length === 0 && (
                  <EmptyState className="mt-6">Aucune plante ne correspond à ces filtres.</EmptyState>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
