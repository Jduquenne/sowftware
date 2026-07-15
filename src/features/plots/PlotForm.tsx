import { useState } from 'react'
import type { Plot, PlotType } from '../../services/db'
import type { PlotInput } from '../../services/plots.service'
import { PLOT_TYPES } from './logic/plotTypes'
import { validatePlotForm, hasErrors, type PlotFormErrors } from './logic/validation'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { TextInput, Select } from '../../ui/Input'

interface PlotFormProps {
  initial?: Plot
  onSubmit: (input: PlotInput) => void
  onCancel: () => void
  onDelete?: () => void
}

export function PlotForm({ initial, onSubmit, onCancel, onDelete }: PlotFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<PlotType>(initial?.type ?? 'jardin')
  const [lengthCm, setLengthCm] = useState(initial?.lengthCm?.toString() ?? '')
  const [widthCm, setWidthCm] = useState(initial?.widthCm?.toString() ?? '')
  const [potCount, setPotCount] = useState(initial?.potCount?.toString() ?? '')
  const [exposure, setExposure] = useState(initial?.exposure ?? '')
  const [errors, setErrors] = useState<PlotFormErrors>({})

  const handleSubmit = () => {
    const values = { name, type, lengthCm, widthCm, potCount, exposure }
    const validationErrors = validatePlotForm(values)
    setErrors(validationErrors)
    if (hasErrors(validationErrors)) return

    onSubmit({
      name: name.trim(),
      type,
      lengthCm: type === 'pot' ? null : Number(lengthCm),
      widthCm: type === 'pot' ? null : Number(widthCm),
      potCount: type === 'pot' ? Number(potCount) : null,
      exposure: exposure.trim() || null,
    })
  }

  return (
    <div className="space-y-3">
      <Field label="Nom" htmlFor="plot-name" error={errors.name}>
        <TextInput
          id="plot-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Potager du fond du jardin"
        />
      </Field>

      <Field label="Type" htmlFor="plot-type">
        <Select id="plot-type" value={type} onChange={(e) => setType(e.target.value as PlotType)}>
          {PLOT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </Field>

      {type === 'pot' ? (
        <Field label="Nombre de pots" htmlFor="plot-pot-count" error={errors.potCount}>
          <TextInput
            id="plot-pot-count"
            type="number"
            value={potCount}
            onChange={(e) => setPotCount(e.target.value)}
          />
        </Field>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1">
            <Field label="Longueur (cm)" htmlFor="plot-length" error={errors.lengthCm}>
              <TextInput
                id="plot-length"
                type="number"
                value={lengthCm}
                onChange={(e) => setLengthCm(e.target.value)}
              />
            </Field>
          </div>
          <div className="flex-1">
            <Field label="Largeur (cm)" htmlFor="plot-width" error={errors.widthCm}>
              <TextInput
                id="plot-width"
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
              />
            </Field>
          </div>
        </div>
      )}

      <Field label="Exposition (optionnel)" htmlFor="plot-exposure">
        <TextInput
          id="plot-exposure"
          value={exposure}
          onChange={(e) => setExposure(e.target.value)}
          placeholder="Sud, Nord-Est…"
        />
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
