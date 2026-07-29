import type { PlotType, Exposition, Orientation } from '../../../services/db'

export interface PlotFormValues {
  name: string
  type: PlotType
  lengthCm: string
  widthCm: string
  potCount: string
  exposition: Exposition | ''
  orientation: Orientation | ''
}

export interface PlotFormErrors {
  name?: string
  lengthCm?: string
  widthCm?: string
  potCount?: string
  exposition?: string
}

export function validatePlotForm(values: PlotFormValues): PlotFormErrors {
  const errors: PlotFormErrors = {}
  if (!values.name.trim()) errors.name = 'Le nom est requis.'
  if (!values.exposition) errors.exposition = "L'exposition est requise."

  if (values.type === 'pot') {
    if (!values.potCount || Number(values.potCount) <= 0) {
      errors.potCount = 'Indiquez un nombre de pots supérieur à 0.'
    }
  } else {
    if (!values.lengthCm || Number(values.lengthCm) <= 0) {
      errors.lengthCm = 'Indiquez une longueur supérieure à 0.'
    }
    if (!values.widthCm || Number(values.widthCm) <= 0) {
      errors.widthCm = 'Indiquez une largeur supérieure à 0.'
    }
  }
  return errors
}

export function hasErrors(errors: PlotFormErrors): boolean {
  return Object.keys(errors).length > 0
}
