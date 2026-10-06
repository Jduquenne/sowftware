import { useState } from 'react'
import { useStore } from '../../store'
import { estimatedYieldForPlot } from './logic/forecast'
import { Select } from '../../ui/Input'
import { EmptyState } from '../../ui/EmptyState'
import { EntryThumb } from '../../ui/EntryThumb'

export function PlotYieldEstimate() {
  const catalogById = useStore((s) => s.catalogById)
  const plots = useStore((s) => s.plots)
  const plantings = useStore((s) => s.plantings)
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(plots[0]?.id ?? null)

  if (plots.length === 0) return <EmptyState>Aucune parcelle créée.</EmptyState>

  const summary = selectedPlotId ? estimatedYieldForPlot(plantings, selectedPlotId, catalogById) : null

  return (
    <div className="space-y-4">
      <Select value={selectedPlotId ?? ''} onChange={(e) => setSelectedPlotId(e.target.value)}>
        {plots.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      {summary && (
        <>
          <div className="rounded-2xl bg-sun-100 px-4 py-3">
            <div className="font-display text-4xl font-semibold text-forest-900">{summary.totalKg} kg</div>
            <div className="text-sm text-sun-800">Rendement total estimé</div>
          </div>

          {summary.rows.length === 0 ? (
            <EmptyState>Aucune plantation dans cette parcelle.</EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {summary.rows.map((row) => {
                const entry = catalogById.get(row.catalogId)
                return (
                  <li key={row.catalogId} className="flex items-center gap-3 py-2.5 text-sm">
                    <EntryThumb entry={entry} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-forest-950">{entry?.nomCommun}</div>
                      <div className="text-neutral-500">
                        {row.count} pied{row.count > 1 ? 's' : ''}
                      </div>
                    </div>
                    <span className={row.subtotalKg !== null ? 'font-semibold text-forest-800' : 'text-neutral-400'}>
                      {row.subtotalKg !== null ? `${row.subtotalKg} kg` : 'non estimé'}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
          {summary.unestimatedCount > 0 && (
            <EmptyState size="xs">
              {summary.unestimatedCount} plantation(s) sans estimation de rendement disponible.
            </EmptyState>
          )}
        </>
      )}
    </div>
  )
}
