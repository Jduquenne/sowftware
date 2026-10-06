import { useState } from 'react'
import { CalendarDays, LayoutGrid } from 'lucide-react'
import { useStore } from '../../store'
import { filterByCategory, filterByGrowingLocation, filterBySearch, listCategories, sortByName } from '../catalog/logic/filters'
import { getHarvestForMonth, harvestCountsByMonth } from './logic/harvest'
import { getCurrentMonth, monthName } from '../../utils/months'
import { useSearchParamState } from '../../utils/useSearchParamState'
import { PageHeader } from '../../ui/PageHeader'
import { Segmented } from '../../ui/Segmented'
import { PanelCard } from '../../ui/PanelCard'
import { LocationToggle } from '../../ui/LocationToggle'
import { CategoryFilterList } from '../../ui/CategoryFilter'
import { MonthPicker } from '../../ui/MonthPicker'
import type { FilterOption } from '../../ui/Filter'
import { TextInput } from '../../ui/Input'
import { Badge } from '../../ui/Badge'
import { CatalogCard } from '../../ui/CatalogCard'
import { YearTable } from '../../ui/YearTable'
import { EmptyState } from '../../ui/EmptyState'

type ViewMode = 'month' | 'year'

const VIEW_OPTIONS: FilterOption<ViewMode>[] = [
  { value: 'month', label: 'Par mois', icon: LayoutGrid },
  { value: 'year', label: "Sur l'année", icon: CalendarDays },
]

export function HarvestDesktop() {
  const catalog = useStore((s) => s.catalog)
  const [month, setMonth] = useState(getCurrentMonth())
  const [categorie, setCategorie] = useState<string | null>(null)
  const [potActive, setPotActive] = useState(false)
  const [groundActive, setGroundActive] = useState(false)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useSearchParamState<ViewMode>('view', 'month')

  const categories = listCategories(catalog)
  const filtered = sortByName(
    filterBySearch(filterByGrowingLocation(filterByCategory(catalog, categorie), potActive, groundActive), search),
  )

  const monthItems = getHarvestForMonth(filtered, month)
  const monthCounts = harvestCountsByMonth(filtered)
  const yearRows = filtered.filter((entry) => entry.moisRecolte.length > 0)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Récolte"
        subtitle="Calendrier des récoltes"
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
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          {viewMode === 'month' && <MonthPicker month={month} onSelect={setMonth} counts={monthCounts} />}
          <div className="mb-5 flex shrink-0 items-baseline justify-between">
            <h2 className="font-display text-3xl font-semibold text-forest-900">
              {viewMode === 'month' ? `À récolter en ${monthName(month).toLowerCase()}` : "Toute l'année"}
            </h2>
            {viewMode === 'year' ? (
              <span className="flex items-center gap-1.5 text-sm text-neutral-600">
                <span className="size-2.5 rounded-full bg-sun-500" />
                Récolte
              </span>
            ) : (
              <span className="text-sm text-neutral-500">{monthItems.length} plantes</span>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-8">
            {viewMode === 'month' ? (
              <>
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 2xl:grid-cols-4">
                  {monthItems.map((entry) => (
                    <CatalogCard
                      key={entry.id}
                      entry={entry}
                      variant="vertical"
                      extra={
                        entry.saisonRecolte && (
                          <Badge pill className="bg-sun-100 text-sun-800">
                            {entry.saisonRecolte}
                          </Badge>
                        )
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
                  renderMonth={(entry, m) =>
                    entry.moisRecolte.includes(m) && <span className="h-2.5 w-full max-w-6 rounded-full bg-sun-500" />
                  }
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
