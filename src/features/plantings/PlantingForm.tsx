import { useState } from 'react'
import { useStore } from '../../store'
import type { Planting, PlantingStatus } from '../../services/db'
import type { PlantingInput } from '../../services/plantings.service'
import { PLANTING_STATUSES } from './logic/lifecycle'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { TextInput, Select, Textarea } from '../../ui/Input'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'

interface PlantingFormProps {
  initial?: Planting
  onSubmit: (input: PlantingInput) => void
  onCancel: () => void
  onDelete?: () => void
}

export function PlantingForm({ initial, onSubmit, onCancel, onDelete }: PlantingFormProps) {
  const catalog = useStore((s) => s.catalog)
  const plots = useStore((s) => s.plots)

  const initialEntry = initial ? catalog.find((c) => c.id === initial.catalogId) : undefined

  const [catalogId, setCatalogId] = useState(initial?.catalogId ?? '')
  const [plotId, setPlotId] = useState(initial?.plotId ?? '')
  const [status, setStatus] = useState<PlantingStatus>(initial?.status ?? 'planned')
  const [sownAt, setSownAt] = useState(initial?.sownAt?.slice(0, 10) ?? '')
  const [plantedAt, setPlantedAt] = useState(initial?.plantedAt?.slice(0, 10) ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [errors, setErrors] = useState<{ catalogId?: string; plotId?: string }>({})

  const selectedEntry = catalog.find((c) => c.id === catalogId)

  const handleSubmit = () => {
    const newErrors: { catalogId?: string; plotId?: string } = {}
    if (!catalogId) newErrors.catalogId = 'Choisissez une plante.'
    if (!plotId) newErrors.plotId = 'Choisissez une parcelle.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    onSubmit({
      catalogId,
      plotId,
      placementId: initial?.placementId ?? null,
      sownAt: sownAt ? new Date(sownAt).toISOString() : null,
      plantedAt: plantedAt ? new Date(plantedAt).toISOString() : null,
      expectedHarvestStart: initial?.expectedHarvestStart ?? null,
      expectedHarvestEnd: initial?.expectedHarvestEnd ?? null,
      status,
      notes: notes.trim(),
    })
  }

  return (
    <div className="space-y-3">
      <Field label="Plante" error={errors.catalogId}>
        <CatalogSearchSelect
          catalog={catalog}
          value={selectedEntry ?? null}
          onSelect={(c) => setCatalogId(c.id)}
          onClear={() => setCatalogId('')}
          readOnlyLabel={
            initial ? (initialEntry ? `${initialEntry.nomCommun} — ${initialEntry.variete}` : 'Plante inconnue') : undefined
          }
        />
      </Field>

      <Field label="Parcelle" htmlFor="planting-plot" error={errors.plotId}>
        <Select id="planting-plot" value={plotId} onChange={(e) => setPlotId(e.target.value)}>
          <option value="">Sélectionner…</option>
          {plots.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Statut" htmlFor="planting-status">
        <Select id="planting-status" value={status} onChange={(e) => setStatus(e.target.value as PlantingStatus)}>
          {PLANTING_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex gap-2">
        <div className="flex-1">
          <Field label="Date de semis" htmlFor="planting-sown-at">
            <TextInput
              id="planting-sown-at"
              type="date"
              value={sownAt}
              onChange={(e) => setSownAt(e.target.value)}
            />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="Date de plantation" htmlFor="planting-planted-at">
            <TextInput
              id="planting-planted-at"
              type="date"
              value={plantedAt}
              onChange={(e) => setPlantedAt(e.target.value)}
            />
          </Field>
        </div>
      </div>

      <Field label="Notes (optionnel)" htmlFor="planting-notes">
        <Textarea id="planting-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </Field>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit}>Enregistrer</Button>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        {onDelete && (
          <Button variant="danger" onClick={onDelete} className="ml-auto">
            Supprimer
          </Button>
        )}
      </div>
    </div>
  )
}
