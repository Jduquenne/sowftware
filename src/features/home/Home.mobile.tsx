import { LandPlot, Sprout, CalendarDays, Salad, Droplet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { buildDashboardSummary } from './logic/dashboard'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'

export function HomeMobile() {
  const catalog = useStore((s) => s.catalog)
  const plots = useStore((s) => s.plots)
  const plantings = useStore((s) => s.plantings)
  const wateringLogs = useStore((s) => s.wateringLogs)
  const addWateringLog = useStore((s) => s.addWateringLog)
  const navigate = useNavigate()

  const summary = buildDashboardSummary(catalog, plots, plantings, wateringLogs)

  return (
    <div className="p-4">
      <h1 className="flex items-center gap-2 text-lg font-semibold text-green-800">
        <Sprout size={22} />
        Bonjour !
      </h1>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-emerald-50 p-3">
          <LandPlot size={18} className="text-emerald-700" />
          <div className="mt-1 text-xl font-semibold text-emerald-800">{summary.plotCount}</div>
          <div className="text-xs text-emerald-700">parcelle(s)</div>
        </div>
        <div className="rounded-lg bg-teal-50 p-3">
          <Sprout size={18} className="text-teal-700" />
          <div className="mt-1 text-xl font-semibold text-teal-800">{summary.activePlantingCount}</div>
          <div className="text-xs text-teal-700">plantation(s) active(s)</div>
        </div>
      </div>

      <section className="mt-5">
        <button
          type="button"
          onClick={() => navigate('/sowing')}
          className="flex w-full items-center gap-2 text-sm font-semibold text-neutral-700"
        >
          <CalendarDays size={16} className="text-emerald-600" />
          À semer ce mois-ci
        </button>
        {summary.sowingThisMonth.length === 0 ? (
          <EmptyState size="xs" className="mt-2">Rien à semer ce mois-ci.</EmptyState>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {summary.sowingThisMonth.map((entry) => (
              <span key={entry.id} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800">
                {entry.nomCommun}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="mt-5">
        <button
          type="button"
          onClick={() => navigate('/harvest')}
          className="flex w-full items-center gap-2 text-sm font-semibold text-neutral-700"
        >
          <Salad size={16} className="text-orange-600" />
          À récolter maintenant
        </button>
        {summary.harvestThisMonth.length === 0 ? (
          <EmptyState size="xs" className="mt-2">Rien à récolter ce mois-ci.</EmptyState>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {summary.harvestThisMonth.map((entry) => (
              <span key={entry.id} className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-800">
                {entry.nomCommun}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="mt-5">
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
                className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm"
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

      {plots.length === 0 && (
        <section className="mt-6 rounded-lg border border-dashed border-neutral-300 p-3 text-sm text-neutral-500">
          Créez votre première parcelle pour commencer à suivre vos plantations.
        </section>
      )}
    </div>
  )
}
