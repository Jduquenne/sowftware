import { LandPlot, Sprout, CalendarDays, Salad, Droplet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { buildDashboardSummary } from './logic/dashboard'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'

export function HomeDesktop() {
  const catalog = useStore((s) => s.catalog)
  const plots = useStore((s) => s.plots)
  const plantings = useStore((s) => s.plantings)
  const wateringLogs = useStore((s) => s.wateringLogs)
  const addWateringLog = useStore((s) => s.addWateringLog)
  const navigate = useNavigate()

  const summary = buildDashboardSummary(catalog, plots, plantings, wateringLogs)

  return (
    <div className="flex h-full flex-col p-6">
      <h1 className="flex shrink-0 items-center gap-2 text-2xl font-semibold text-green-800">
        <Sprout size={26} />
        Bonjour !
      </h1>

      <div className="mt-5 grid shrink-0 grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-50 p-4">
          <LandPlot size={22} className="text-emerald-700" />
          <div className="mt-1 text-2xl font-semibold text-emerald-800">{summary.plotCount}</div>
          <div className="text-sm text-emerald-700">parcelle(s)</div>
        </div>
        <div className="rounded-xl bg-teal-50 p-4">
          <Sprout size={22} className="text-teal-700" />
          <div className="mt-1 text-2xl font-semibold text-teal-800">{summary.activePlantingCount}</div>
          <div className="text-sm text-teal-700">plantation(s) active(s)</div>
        </div>
      </div>

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-3 gap-6 overflow-y-auto">
        <section>
          <button
            type="button"
            onClick={() => navigate('/sowing')}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-700"
          >
            <CalendarDays size={16} className="text-emerald-600" />
            À semer ce mois-ci
          </button>
          {summary.sowingThisMonth.length === 0 ? (
            <EmptyState size="xs" className="mt-2">Rien à semer ce mois-ci.</EmptyState>
          ) : (
            <ul className="mt-2 space-y-1">
              {summary.sowingThisMonth.map((entry) => (
                <li key={entry.id} className="rounded bg-emerald-50 px-2 py-1 text-sm text-emerald-800">
                  {entry.nomCommun}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <button
            type="button"
            onClick={() => navigate('/harvest')}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-700"
          >
            <Salad size={16} className="text-orange-600" />
            À récolter maintenant
          </button>
          {summary.harvestThisMonth.length === 0 ? (
            <EmptyState size="xs" className="mt-2">Rien à récolter ce mois-ci.</EmptyState>
          ) : (
            <ul className="mt-2 space-y-1">
              {summary.harvestThisMonth.map((entry) => (
                <li key={entry.id} className="rounded bg-orange-50 px-2 py-1 text-sm text-orange-800">
                  {entry.nomCommun}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <Droplet size={16} className="text-blue-600" />
            Arrosage
          </div>
          {summary.wateringAlerts.length === 0 ? (
            <EmptyState size="xs" className="mt-2">Rien à arroser pour le moment.</EmptyState>
          ) : (
            <ul className="mt-2 space-y-2">
              {summary.wateringAlerts.map(({ planting, entry, days }) => (
                <li
                  key={planting.id}
                  className="flex items-center justify-between rounded bg-blue-50 px-2 py-1.5 text-sm"
                >
                  <div>
                    <div className="font-medium text-blue-900">{entry?.nomCommun ?? 'Plante inconnue'}</div>
                    <div className="text-xs text-blue-700">
                      {days === null ? 'Jamais arrosé' : `Il y a ${days} jour(s)`}
                    </div>
                  </div>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() =>
                      addWateringLog({
                        plantingId: planting.id,
                        plotId: planting.plotId,
                        wateredAt: new Date().toISOString(),
                        amountMl: null,
                        note: '',
                      })
                    }
                  >
                    Arroser
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {plots.length === 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-4 text-sm text-neutral-500">
          Créez votre première parcelle pour commencer à suivre vos plantations.
        </div>
      )}
    </div>
  )
}
