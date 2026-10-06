import type { CatalogEntry } from '../../services/db'
import { CategoryBadge } from '../../ui/CategoryBadge'
import { EntryVisual, catalogYearRows } from '../../ui/CatalogCard'
import { YearStrip } from '../../ui/YearStrip'

const POT_LABELS: Record<CatalogEntry['pot'], string> = {
  oui: 'En pot',
  possible: 'Possible',
  non: 'Pleine terre',
  inconnu: '—',
}

export function CatalogTable({ entries }: { entries: CatalogEntry[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-cream/60 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
          <tr>
            <th className="px-4 py-3">Plante</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3">Famille</th>
            <th className="px-4 py-3">Espacement</th>
            <th className="px-4 py-3">Pot</th>
            <th className="w-56 px-4 py-3">Calendrier</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-cream/40">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-xl">
                    <EntryVisual entry={entry} className="absolute inset-0 h-full w-full" iconSize={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-forest-950">{entry.nomCommun}</div>
                    <div className="truncate text-neutral-500">{entry.variete}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2.5">
                <CategoryBadge categorie={entry.categorie} />
              </td>
              <td className="px-4 py-2.5 text-neutral-600 italic">{entry.familleBotanique}</td>
              <td className="px-4 py-2.5 text-neutral-600">{entry.espacementRaw ? `${entry.espacementRaw} cm` : '—'}</td>
              <td className="px-4 py-2.5 text-neutral-600">{POT_LABELS[entry.pot]}</td>
              <td className="px-4 py-2.5">
                <YearStrip rows={catalogYearRows(entry)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
