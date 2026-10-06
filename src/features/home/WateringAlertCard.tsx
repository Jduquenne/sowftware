import { Droplet } from 'lucide-react'
import type { WateringAlert } from './logic/dashboard'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { EntryVisual } from '../../ui/CatalogCard'

interface WateringAlertCardProps {
  alert: WateringAlert
  variant: 'desktop' | 'mobile'
  onWater: () => void
}

function plantName(alert: WateringAlert): string {
  if (!alert.entry) return 'Plante inconnue'
  return `${alert.entry.nomCommun} · ${alert.entry.variete}`
}

function dryLabel(days: number | null, short: boolean): string {
  if (days === null) return 'Jamais arrosé'
  const unit = days > 1 ? 'jours' : 'jour'
  return short ? `${days} ${unit}` : `${days} ${unit} sans eau`
}

export function WateringAlertCard({ alert, variant, onWater }: WateringAlertCardProps) {
  const mobile = variant === 'mobile'
  const plotName = alert.plot?.name ?? 'Sans parcelle'

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border border-line p-4 ${mobile ? 'bg-white shadow-card' : 'bg-cream/60'}`}
    >
      <div className={`relative shrink-0 overflow-hidden rounded-2xl bg-forest-50 ${mobile ? 'size-16' : 'size-20'}`}>
        {alert.entry && <EntryVisual entry={alert.entry} className="absolute inset-0 h-full w-full" iconSize={28} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-forest-950">{plantName(alert)}</div>
        <div className="text-sm text-neutral-500">
          {mobile ? `${plotName} · ${dryLabel(alert.days, true)}` : plotName}
        </div>
        {!mobile && (
          <Badge pill className="mt-1.5 bg-sun-100 text-sun-800">
            {dryLabel(alert.days, false)}
          </Badge>
        )}
      </div>
      <Button variant="info" className="shrink-0" onClick={onWater}>
        <Droplet size={16} />
        Arroser
      </Button>
    </div>
  )
}
