import { useState, type ReactNode } from 'react'
import { Ruler } from 'lucide-react'
import type { CatalogEntry } from '../services/db'
import { getCategoryStyle } from '../utils/categoryStyle'
import { Badge } from './Badge'
import { IconTile } from './IconTile'
import { YearStrip, type YearStripRow } from './YearStrip'

interface CatalogCardProps {
  entry: CatalogEntry
  variant: 'vertical' | 'horizontal'
  extra?: ReactNode
  onClick?: () => void
}

export function catalogYearRows(entry: CatalogEntry): YearStripRow[] {
  return [
    {
      label: 'S',
      title: 'Semis / bouture',
      months: [...new Set([...entry.moisSemis, ...entry.moisBouture])],
      colorClass: 'bg-forest-200',
    },
    { label: 'P', title: 'Plantation', months: entry.moisPlantation, colorClass: 'bg-forest-600' },
    { label: 'R', title: 'Récolte', months: entry.moisRecolte, colorClass: 'bg-sun-500' },
  ]
}

function spacingLabel(entry: CatalogEntry): string | null {
  const r = entry.espacementCm
  if (!r) return null
  return r.min === r.max ? `${r.min} cm` : `${r.min}–${r.max} cm`
}

function potLabel(entry: CatalogEntry): string | null {
  if (entry.pot === 'oui' || entry.pot === 'possible') return 'En pot'
  if (entry.pot === 'non') return 'Pleine terre'
  return null
}

export function EntryVisual({ entry, className, iconSize }: { entry: CatalogEntry; className: string; iconSize: number }) {
  const style = getCategoryStyle(entry.categorie)
  const Icon = style.icon
  const [imageFailed, setImageFailed] = useState(false)

  if (entry.imageUrl && !imageFailed) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}${entry.imageUrl.slice(1)}`}
        alt={entry.nomCommun}
        loading="lazy"
        onError={() => setImageFailed(true)}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <div className={`flex items-center justify-center bg-linear-to-br text-white/60 ${style.gradientClass} ${className}`}>
      <Icon size={iconSize} />
    </div>
  )
}

export function CatalogCard({ entry, variant, extra, onClick }: CatalogCardProps) {
  const Container = onClick ? 'button' : 'div'
  const interactiveProps = onClick ? { type: 'button' as const, onClick } : {}
  const style = getCategoryStyle(entry.categorie)
  const spacing = spacingLabel(entry)
  const pot = potLabel(entry)

  if (variant === 'horizontal') {
    return (
      <Container
        {...interactiveProps}
        className="flex w-full gap-4 rounded-3xl border border-line bg-white p-3 text-left shadow-card"
      >
        <div className="relative w-24 shrink-0 self-stretch overflow-hidden rounded-2xl">
          <EntryVisual entry={entry} className="absolute inset-0 h-full w-full" iconSize={32} />
          <IconTile icon={style.icon} size="xs" className={`absolute top-2 left-2 ${style.badgeClass}`} />
        </div>
        <div className="min-w-0 flex-1 py-1">
          <div className="truncate text-lg font-semibold text-forest-950">{entry.nomCommun}</div>
          <div className="truncate text-sm text-neutral-500">
            {entry.variete} · <span className="italic">{entry.familleBotanique}</span>
          </div>
          {(spacing || pot) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {spacing && (
                <Badge pill className="bg-cream text-neutral-700">
                  Espacement {spacing}
                </Badge>
              )}
              {pot && (
                <Badge pill className="bg-forest-50 text-forest-700">
                  {pot}
                </Badge>
              )}
            </div>
          )}
          {extra}
          <YearStrip rows={catalogYearRows(entry)} className="mt-3" />
        </div>
      </Container>
    )
  }

  return (
    <Container
      {...interactiveProps}
      className="flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-white text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-float"
    >
      <div className="relative h-36 shrink-0">
        <EntryVisual entry={entry} className="h-full w-full" iconSize={44} />
        <IconTile icon={style.icon} size="sm" className={`absolute top-3 left-3 ${style.badgeClass}`} />
        {pot && (
          <Badge
            pill
            className={`absolute top-3 right-3 ${pot === 'En pot' ? 'bg-white/90 text-forest-800' : 'bg-forest-950/75 text-white'}`}
          >
            {pot}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="font-semibold text-forest-950">{entry.nomCommun}</div>
        <div className="text-sm text-neutral-500">{entry.variete}</div>
        <div className="mt-2 flex items-center justify-between gap-2 text-sm text-neutral-600">
          <span className="truncate italic">{entry.familleBotanique}</span>
          {spacing && (
            <span className="flex shrink-0 items-center gap-1">
              <Ruler size={14} />
              {spacing}
            </span>
          )}
        </div>
        {extra && <div className="mt-2">{extra}</div>}
        <YearStrip rows={catalogYearRows(entry)} className="mt-auto pt-3" />
      </div>
    </Container>
  )
}
