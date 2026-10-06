import type { ReactNode } from 'react'
import type { CatalogEntry } from '../services/db'
import { MONTH_NAMES_SHORT, getCurrentMonth } from '../utils/months'
import { EntryThumb } from './EntryThumb'

interface YearTableProps {
  entries: CatalogEntry[]
  renderMonth: (entry: CatalogEntry, month: number) => ReactNode
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export function YearTable({ entries, renderMonth }: YearTableProps) {
  const current = getCurrentMonth()
  return (
    <div className="rounded-3xl border border-line bg-white shadow-card">
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="text-xs font-semibold text-neutral-500">
            <th className="sticky top-0 z-10 w-72 rounded-tl-3xl border-b border-line bg-white px-4 py-3 tracking-wide uppercase">
              Plante
            </th>
            {MONTHS.map((m) => (
              <th
                key={m}
                title={MONTH_NAMES_SHORT[m - 1]}
                className={`sticky top-0 z-10 border-b border-line py-3 text-center last:rounded-tr-3xl ${
                  m === current ? 'bg-sun-100 text-sun-800' : 'bg-white'
                }`}
              >
                {MONTH_NAMES_SHORT[m - 1]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-cream/40">
              <td className="px-4 py-2">
                <div className="flex items-center gap-3">
                  <EntryThumb entry={entry} />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-forest-950">{entry.nomCommun}</div>
                    <div className="truncate text-neutral-500">{entry.variete}</div>
                  </div>
                </div>
              </td>
              {MONTHS.map((m) => (
                <td key={m} className={`py-2 ${m === current ? 'bg-sun-100/40' : ''}`}>
                  <div className="flex items-center justify-center gap-0.5">{renderMonth(entry, m)}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
