import { useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry } from '../../services/db'
import { plantsNeededForTarget, areaNeededM2, estimatedYieldForPlot } from './logic/forecast'
import { Field } from '../../ui/Field'
import { TextInput, Select } from '../../ui/Input'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { Callout } from '../../ui/Callout'
import { EmptyState } from '../../ui/EmptyState'

export function YieldDesktop() {
  const catalog = useStore((s) => s.catalog)
  const catalogById = useStore((s) => s.catalogById)
  const plots = useStore((s) => s.plots)
  const plantings = useStore((s) => s.plantings)

  const [selectedEntry, setSelectedEntry] = useState<CatalogEntry | null>(null)
  const [targetKg, setTargetKg] = useState('')

  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(plots[0]?.id ?? null)

  const yieldableCatalog = catalog.filter((c) => c.yieldPerPlantKg !== null)

  const target = Number(targetKg)
  const plantsNeeded = selectedEntry && target > 0 ? plantsNeededForTarget(selectedEntry, target) : null
  const areaNeeded = selectedEntry && plantsNeeded ? areaNeededM2(selectedEntry, plantsNeeded) : null

  const summary = selectedPlotId ? estimatedYieldForPlot(plantings, selectedPlotId, catalogById) : null

  return (
    <div className="grid h-full grid-cols-2 gap-6 p-6">
      <div className="flex min-h-0 flex-col">
        <h1 className="mb-4 shrink-0 text-xl font-semibold text-green-800">Calculateur de rendement</h1>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
          <CatalogSearchSelect
            catalog={yieldableCatalog}
            value={selectedEntry}
            onSelect={setSelectedEntry}
            onClear={() => setSelectedEntry(null)}
          />

          {selectedEntry && (
            <>
              <p className="text-xs text-neutral-500">
                Rendement estimé : ~{selectedEntry.yieldPerPlantKg} kg/pied
              </p>
              <Field label="Objectif (kg)" htmlFor="target-kg-desktop">
                <TextInput
                  id="target-kg-desktop"
                  type="number"
                  value={targetKg}
                  onChange={(e) => setTargetKg(e.target.value)}
                />
              </Field>
              {plantsNeeded !== null && (
                <Callout>
                  <strong>{plantsNeeded}</strong> pied(s) nécessaire(s)
                  {areaNeeded !== null && (
                    <span className="block text-xs text-green-700">≈ {areaNeeded} m² requis</span>
                  )}
                </Callout>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        <h1 className="mb-4 shrink-0 text-xl font-semibold text-green-800">Estimation par parcelle</h1>
        {plots.length === 0 ? (
          <EmptyState>Aucune parcelle créée.</EmptyState>
        ) : (
          <>
            <Select
              value={selectedPlotId ?? ''}
              onChange={(e) => setSelectedPlotId(e.target.value)}
              className="mb-3 shrink-0"
            >
              {plots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>

            {summary && (
              <div className="min-h-0 flex-1 overflow-y-auto">
                <Callout>
                  Rendement total estimé : <strong>{summary.totalKg} kg</strong>
                </Callout>
                <table className="mt-3 w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400">
                      <th className="pb-2 font-medium">Plante</th>
                      <th className="pb-2 font-medium">Quantité</th>
                      <th className="pb-2 font-medium">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {summary.rows.map((row) => {
                      const entry = catalogById.get(row.catalogId)
                      return (
                        <tr key={row.catalogId}>
                          <td className="py-2 text-neutral-800">{entry?.nomCommun}</td>
                          <td className="py-2 text-neutral-500">{row.count}</td>
                          <td className="py-2 text-neutral-500">
                            {row.subtotalKg !== null ? `${row.subtotalKg} kg` : 'non estimé'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {summary.unestimatedCount > 0 && (
                  <EmptyState size="xs" className="mt-2">
                    {summary.unestimatedCount} plantation(s) sans estimation de rendement disponible.
                  </EmptyState>
                )}
                {summary.rows.length === 0 && (
                  <EmptyState className="mt-2">Aucune plantation dans cette parcelle.</EmptyState>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
