import { Droplet, LayoutDashboard, Sprout } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { buildDashboardSummary, type WateringAlert } from './logic/dashboard'
import { formatShortDate, seasonLabel, seasonOfMonth } from './logic/season'
import { getCurrentMonth } from '../../utils/months'
import { SectionHeading } from '../../ui/SectionCard'
import { StatCard } from '../../ui/StatCard'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { WateringAlertCard } from './WateringAlertCard'
import { SeasonPlantCard } from './SeasonPlantCard'
import { FirstPlotHint } from './FirstPlotHint'

export function HomeMobile() {
  const catalog = useStore((s) => s.catalog)
  const plots = useStore((s) => s.plots)
  const plantings = useStore((s) => s.plantings)
  const wateringLogs = useStore((s) => s.wateringLogs)
  const addWateringLog = useStore((s) => s.addWateringLog)
  const navigate = useNavigate()

  const summary = buildDashboardSummary(catalog, plots, plantings, wateringLogs)
  const season = seasonLabel(seasonOfMonth(getCurrentMonth()))

  const water = ({ planting }: WateringAlert) =>
    addWateringLog({
      plantingId: planting.id,
      plotId: planting.plotId,
      wateredAt: new Date().toISOString(),
      amountMl: null,
      note: '',
    })

  const seeAll = (path: string) => (
    <Button variant="link" onClick={() => navigate(path)}>
      Voir tout
    </Button>
  )

  return (
    <div className="space-y-7 px-5 pt-6 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-forest-800 via-forest-600 to-forest-400 px-6 py-5 shadow-float">
        <div className="text-sm font-bold tracking-[0.18em] text-sun-300 uppercase">
          {formatShortDate(new Date())} · {season}
        </div>
      </div>

      {plots.length === 0 && <FirstPlotHint />}

      <div className="grid grid-cols-2 gap-3">
        <StatCard size="sm" icon={LayoutDashboard} value={summary.plotCount} label="Parcelles" />
        <StatCard
          size="sm"
          icon={Sprout}
          iconClass="bg-pink-100 text-pink-700"
          value={summary.ongoingPlantingCount}
          label="Plantations"
        />
      </div>

      <section>
        <SectionHeading
          title="À arroser"
          icon={Droplet}
          iconClass="bg-water-50 text-water-600"
          badge={
            summary.wateringAlerts.length > 0 && (
              <Badge pill className="bg-sun-100 text-sun-800">
                {summary.wateringAlerts.length}
              </Badge>
            )
          }
        />
        {summary.wateringAlerts.length === 0 ? (
          <EmptyState className="mt-3">Rien à arroser pour le moment.</EmptyState>
        ) : (
          <div className="mt-4 space-y-3">
            {summary.wateringAlerts.map((alert) => (
              <WateringAlertCard key={alert.planting.id} alert={alert} variant="mobile" onWater={() => water(alert)} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading title="À semer ce mois-ci" action={seeAll('/sowing')} />
        {summary.sowingThisMonth.length === 0 ? (
          <EmptyState className="mt-3">Rien à semer ce mois-ci.</EmptyState>
        ) : (
          <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1">
            {summary.sowingThisMonth.map((entry) => (
              <SeasonPlantCard key={entry.id} entry={entry} strip="S" className="w-40 shrink-0" />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading title="À récolter maintenant" action={seeAll('/harvest')} />
        {summary.harvestThisMonth.length === 0 ? (
          <EmptyState className="mt-3">Rien à récolter ce mois-ci.</EmptyState>
        ) : (
          <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1">
            {summary.harvestThisMonth.map((entry) => (
              <SeasonPlantCard key={entry.id} entry={entry} strip="R" className="w-40 shrink-0" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
