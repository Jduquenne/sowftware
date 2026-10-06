import type { CatalogEntry } from '../../services/db'
import { CategoryBadge } from '../../ui/CategoryBadge'
import { catalogYearRows } from '../../ui/CatalogCard'
import { EntryThumb } from '../../ui/EntryThumb'
import { YearStrip } from '../../ui/YearStrip'
import { TableBody, TableCard, TableHead, Td, Th } from '../../ui/Table'

const POT_LABELS: Record<CatalogEntry['pot'], string> = {
  oui: 'En pot',
  possible: 'Possible',
  non: 'Pleine terre',
  inconnu: '—',
}

export function CatalogTable({ entries }: { entries: CatalogEntry[] }) {
  return (
    <TableCard>
      <TableHead>
        <Th>Plante</Th>
        <Th>Catégorie</Th>
        <Th>Famille</Th>
        <Th>Espacement</Th>
        <Th>Pot</Th>
        <Th className="w-56">Calendrier</Th>
      </TableHead>
      <TableBody>
        {entries.map((entry) => (
          <tr key={entry.id} className="hover:bg-cream/40">
            <Td>
              <div className="flex items-center gap-3">
                <EntryThumb entry={entry} />
                <div className="min-w-0">
                  <div className="font-semibold text-forest-950">{entry.nomCommun}</div>
                  <div className="truncate text-neutral-500">{entry.variete}</div>
                </div>
              </div>
            </Td>
            <Td>
              <CategoryBadge categorie={entry.categorie} />
            </Td>
            <Td className="text-neutral-600 italic">{entry.familleBotanique}</Td>
            <Td className="text-neutral-600">{entry.espacementRaw ? `${entry.espacementRaw} cm` : '—'}</Td>
            <Td className="text-neutral-600">{POT_LABELS[entry.pot]}</Td>
            <Td>
              <YearStrip rows={catalogYearRows(entry)} />
            </Td>
          </tr>
        ))}
      </TableBody>
    </TableCard>
  )
}
