import type { DashboardSummary } from './dashboard'

function plural(n: number, singular: string, pluralForm: string): string {
  return `${n} ${n > 1 ? pluralForm : singular}`
}

export function monthSummarySentence(summary: DashboardSummary): string {
  const sow = plural(summary.sowingCount, 'plante à semer', 'plantes à semer')
  const harvest = `${summary.harvestCount} à récolter`
  const water = summary.wateringAlerts.length
  const waterPart =
    water === 0
      ? "aucune plantation n'attend d'eau"
      : `${plural(water, "plantation qui attend de l'eau", "plantations qui attendent de l'eau")}`
  return `Ce mois-ci : ${sow}, ${harvest} et ${waterPart}.`
}
