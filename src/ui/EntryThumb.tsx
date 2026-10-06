import type { CatalogEntry } from '../services/db'
import { EntryVisual } from './CatalogCard'

interface EntryThumbProps {
  entry: CatalogEntry | undefined
  size?: 'sm' | 'md'
}

export function EntryThumb({ entry, size = 'sm' }: EntryThumbProps) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-forest-50 ${size === 'sm' ? 'size-11 rounded-xl' : 'size-14 rounded-2xl'}`}>
      {entry && <EntryVisual entry={entry} className="absolute inset-0 h-full w-full" iconSize={size === 'sm' ? 18 : 22} />}
    </div>
  )
}
