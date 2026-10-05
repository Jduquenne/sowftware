import { useState, type ReactNode } from 'react'
import type { CatalogEntry } from '../services/db'
import { getCategoryStyle } from '../utils/categoryStyle'
import { CategoryBadge } from './CategoryBadge'

interface CatalogCardProps {
  entry: CatalogEntry
  variant: 'vertical' | 'horizontal'
  extra?: ReactNode
  onClick?: () => void
}

function EntryVisual({ entry, className, iconSize }: { entry: CatalogEntry; className: string; iconSize: number }) {
  const style = getCategoryStyle(entry.categorie)
  const Icon = style.icon
  const [imageFailed, setImageFailed] = useState(false)

  if (entry.imageUrl && !imageFailed) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}${entry.imageUrl.slice(1)}`}
        alt={entry.nomCommun}
        onError={() => setImageFailed(true)}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <div className={`flex shrink-0 items-center justify-center ${style.badgeClass} ${className}`}>
      <Icon size={iconSize} />
    </div>
  )
}

export function CatalogCard({ entry, variant, extra, onClick }: CatalogCardProps) {
  const Container = onClick ? 'button' : 'div'
  const interactiveProps = onClick ? { type: 'button' as const, onClick } : {}

  if (variant === 'horizontal') {
    return (
      <Container
        {...interactiveProps}
        className={`flex w-full items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 ${onClick ? 'text-left' : ''}`}
      >
        <EntryVisual entry={entry} className="h-14 w-14 rounded-md" iconSize={24} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-neutral-800">{entry.nomCommun}</div>
          <div className="truncate text-sm text-neutral-500">{entry.variete}</div>
          {extra}
        </div>
        <CategoryBadge categorie={entry.categorie} />
      </Container>
    )
  }

  return (
    <Container
      {...interactiveProps}
      className={`flex w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white ${onClick ? 'text-left' : ''}`}
    >
      <EntryVisual entry={entry} className="h-24 w-full" iconSize={32} />
      <div className="flex flex-col gap-1 p-3">
        <div className="font-medium text-neutral-800">{entry.nomCommun}</div>
        <div className="text-sm text-neutral-500">{entry.variete}</div>
        {extra}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-neutral-400">{entry.familleBotanique}</span>
          <CategoryBadge categorie={entry.categorie} />
        </div>
      </div>
    </Container>
  )
}
