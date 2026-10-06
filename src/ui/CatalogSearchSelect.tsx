import { useState, type ReactNode } from 'react'
import type { CatalogEntry } from '../services/db'
import { TextInput } from './Input'
import { Button } from './Button'

interface CatalogSearchSelectProps {
  catalog: CatalogEntry[]
  value?: CatalogEntry | null
  onSelect: (entry: CatalogEntry) => void
  onClear?: () => void
  readOnlyLabel?: string
  placeholder?: string
  error?: string | null
  renderResultExtra?: (entry: CatalogEntry) => ReactNode
}

export function CatalogSearchSelect({
  catalog,
  value,
  onSelect,
  onClear,
  readOnlyLabel,
  placeholder = 'Rechercher une plante…',
  error,
  renderResultExtra,
}: CatalogSearchSelectProps) {
  const [search, setSearch] = useState('')

  if (readOnlyLabel) {
    return <p className="text-sm font-semibold text-forest-950">{readOnlyLabel}</p>
  }

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2 text-sm">
        <span>
          {value.nomCommun} — {value.variete}
        </span>
        {onClear && (
          <Button variant="link" size="sm" onClick={onClear}>
            Changer
          </Button>
        )}
      </div>
    )
  }

  const results = search.trim()
    ? catalog
        .filter((c) => `${c.nomCommun} ${c.variete}`.toLowerCase().includes(search.trim().toLowerCase()))
        .slice(0, 8)
    : []

  return (
    <>
      <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {results.length > 0 && (
        <ul className="mt-1.5 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-card">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(c)
                  setSearch('')
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-cream"
              >
                {c.nomCommun} — {c.variete}
                {renderResultExtra?.(c)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
