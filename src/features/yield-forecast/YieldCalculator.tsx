import { useState } from 'react'
import { useStore } from '../../store'
import type { CatalogEntry } from '../../services/db'
import { plantsNeededForTarget, areaNeededM2 } from './logic/forecast'
import { Field } from '../../ui/Field'
import { TextInput } from '../../ui/Input'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { EntryThumb } from '../../ui/EntryThumb'

function ResultTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-forest-50 px-4 py-3">
      <div className="font-display text-3xl font-semibold text-forest-900">{value}</div>
      <div className="text-sm text-forest-700">{label}</div>
    </div>
  )
}

export function YieldCalculator() {
  const catalog = useStore((s) => s.catalog)
  const [selectedEntry, setSelectedEntry] = useState<CatalogEntry | null>(null)
  const [targetKg, setTargetKg] = useState('')

  const yieldableCatalog = catalog.filter((c) => c.yieldPerPlantKg !== null)
  const target = Number(targetKg)
  const plantsNeeded = selectedEntry && target > 0 ? plantsNeededForTarget(selectedEntry, target) : null
  const areaNeeded = selectedEntry && plantsNeeded ? areaNeededM2(selectedEntry, plantsNeeded) : null

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        Choisissez une plante et un objectif de récolte : on estime le nombre de pieds et la surface nécessaires.
      </p>
      <CatalogSearchSelect
        catalog={yieldableCatalog}
        value={selectedEntry}
        onSelect={setSelectedEntry}
        onClear={() => setSelectedEntry(null)}
      />

      {selectedEntry && (
        <>
          <div className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-2.5">
            <EntryThumb entry={selectedEntry} />
            <div className="text-sm">
              <div className="font-semibold text-forest-950">{selectedEntry.nomCommun}</div>
              <div className="text-neutral-500">Rendement estimé : ~{selectedEntry.yieldPerPlantKg} kg/pied</div>
            </div>
          </div>
          <Field label="Objectif de récolte (kg)" htmlFor="target-kg">
            <TextInput id="target-kg" type="number" value={targetKg} onChange={(e) => setTargetKg(e.target.value)} />
          </Field>
          {plantsNeeded !== null && (
            <div className="grid grid-cols-2 gap-3">
              <ResultTile value={String(plantsNeeded)} label={plantsNeeded > 1 ? 'pieds nécessaires' : 'pied nécessaire'} />
              {areaNeeded !== null && <ResultTile value={`≈ ${areaNeeded} m²`} label="de surface" />}
            </div>
          )}
        </>
      )}
    </div>
  )
}
