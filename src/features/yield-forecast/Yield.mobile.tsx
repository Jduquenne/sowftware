import { useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry } from '../../services/db'
import { plantsNeededForTarget, areaNeededM2, estimatedYieldForPlot } from './logic/forecast'
import { Field } from '../../ui/Field'
import { TextInput, Select } from '../../ui/Input'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { FilterChips, type FilterOption } from '../../ui/Filter'
import { Callout } from '../../ui/Callout'
import { EmptyState } from '../../ui/EmptyState'

const MODE_OPTIONS: FilterOption<'calculator' | 'plot'>[] = [
  { value: 'calculator', label: 'Calculateur', activeClass: 'bg-green-800 text-white' },
  { value: 'plot', label: 'Mes parcelles', activeClass: 'bg-green-800 text-white' },
]

export function YieldMobile() {
  const catalog = useStore((s) => s.catalog)
  const catalogById = useStore((s) => s.catalogById)
  const plots = useStore((s) => s.plots)
  const plantings = useStore((s) => s.plantings)
  const [mode, setMode] = useState<'calculator' | 'plot'>('calculator')

  const [selectedEntry, setSelectedEntry] = useState<CatalogEntry | null>(null)
  const [targetKg, setTargetKg] = useState('')

  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(plots[0]?.id ?? null)

  const yieldableCatalog = catalog.filter((c) => c.yieldPerPlantKg !== null)

  const target = Number(targetKg)
  const plantsNeeded = selectedEntry && target > 0 ? plantsNeededForTarget(selectedEntry, target) : null
  const areaNeeded = selectedEntry && plantsNeeded ? areaNeededM2(selectedEntry, plantsNeeded) : null

  const summary = selectedPlotId ? estimatedYieldForPlot(plantings, selectedPlotId, catalogById) : null

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-green-800">Prévision de rendement</h1>

      <div className="mt-3">
        <FilterChips options={MODE_OPTIONS} selected={mode} onSelect={setMode} />
      </div>

      {mode === 'calculator' && (
        <div className="mt-4 space-y-3">
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
              <Field label="Objectif (kg)" htmlFor="target-kg">
                <TextInput id="target-kg" type="number" value={targetKg} onChange={(e) => setTargetKg(e.target.value)} />
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
      )}

      {mode === 'plot' && (
        <div className="mt-4">
          {plots.length === 0 ? (
            <EmptyState>Aucune parcelle créée.</EmptyState>
          ) : (
            <>
              <Select value={selectedPlotId ?? ''} onChange={(e) => setSelectedPlotId(e.target.value)}>
                {plots.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>

              {summary && (
                <div className="mt-3">
                  <Callout>
                    Rendement total estimé : <strong>{summary.totalKg} kg</strong>
                  </Callout>
                  <ul className="mt-2 divide-y divide-neutral-200">
                    {summary.rows.map((row) => {
                      const entry = catalogById.get(row.catalogId)
                      return (
                        <li key={row.catalogId} className="flex items-center justify-between py-2 text-sm">
                          <span>
                            {entry?.nomCommun} × {row.count}
                          </span>
                          <span className="text-neutral-500">
                            {row.subtotalKg !== null ? `${row.subtotalKg} kg` : 'non estimé'}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
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
      )}
    </div>
  )
}
