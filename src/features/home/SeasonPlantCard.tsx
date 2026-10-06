import type { CatalogEntry } from '../../services/db'
import { getCategoryStyle } from '../../utils/categoryStyle'
import { EntryVisual, catalogYearRows } from '../../ui/CatalogCard'
import { IconTile } from '../../ui/IconTile'
import { YearStrip } from '../../ui/YearStrip'

interface SeasonPlantCardProps {
  entry: CatalogEntry
  strip: 'S' | 'R'
  className?: string
}

export function SeasonPlantCard({ entry, strip, className = '' }: SeasonPlantCardProps) {
  const style = getCategoryStyle(entry.categorie)
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="relative h-32 overflow-hidden rounded-2xl">
        <EntryVisual entry={entry} className="h-full w-full" iconSize={36} />
        <IconTile icon={style.icon} size="xs" className={`absolute top-2.5 left-2.5 ${style.badgeClass}`} />
      </div>
      <div className="mt-2 truncate font-semibold text-forest-950">{entry.nomCommun}</div>
      <div className="truncate text-sm text-neutral-500">{entry.variete}</div>
      <YearStrip rows={catalogYearRows(entry).filter((r) => r.label === strip)} className="mt-2" />
    </div>
  )
}
