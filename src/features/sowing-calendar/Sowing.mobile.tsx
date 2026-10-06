import { useState } from 'react'
import { useStore } from '../../store'
import { filterByCategory, filterByGrowingLocation, filterBySearch, listCategories, sortByName } from '../catalog/logic/filters'
import { getSowingForMonth, sowingKindLabel, sowingKindClass, sowingKindIcon } from './logic/sowing'
import { getCurrentMonth } from '../../utils/months'
import { PageHeader } from '../../ui/PageHeader'
import { CategoryFilterChips } from '../../ui/CategoryFilter'
import { LocationToggle } from '../../ui/LocationToggle'
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
  const filtered = sortByName(
    filterBySearch(filterByGrowingLocation(filterByCategory(catalog, categorie), potActive, groundActive), search),
  )
  const items = getSowingForMonth(filtered, month)

  return (
    <div>
      <PageHeader variant="mobile" title="Semis" actions={`${items.length} plantes`} />

      <div className="space-y-3 px-5 pb-4">
        <MonthNav month={month} onChange={setMonth} />
        <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" />
        <CategoryFilterChips categories={categories} selected={categorie} onSelect={setCategorie} />
        <LocationToggle
          potActive={potActive}
          groundActive={groundActive}
          onTogglePot={() => setPotActive((v) => !v)}
          onToggleGround={() => setGroundActive((v) => !v)}
        />

        <div className="flex flex-col gap-3 pt-2">
          {items.map(({ entry, kinds }) => (
            <CatalogCard
              key={entry.id}
              entry={entry}
              variant="horizontal"
              extra={
                <div className="mt-1.5 flex flex-wrap gap-1">
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

        {items.length === 0 && <EmptyState className="pt-4">Rien pour ce mois avec ces filtres.</EmptyState>}
      </div>
    </div>
  )
}
