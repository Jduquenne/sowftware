export type Season = 'hiver' | 'printemps' | 'ete' | 'automne'

const SEASON_LABELS: Record<Season, string> = {
  hiver: 'Hiver',
  printemps: 'Printemps',
  ete: 'Été',
  automne: 'Automne',
}

const SEASON_HEADLINES: Record<Season, string> = {
  hiver: 'Le jardin se repose',
  printemps: 'Le printemps réveille le jardin',
  ete: "L'été bat son plein au jardin",
  automne: "L'automne s'installe au jardin",
}

export function seasonOfMonth(month: number): Season {
  if (month === 12 || month <= 2) return 'hiver'
  if (month <= 5) return 'printemps'
  if (month <= 8) return 'ete'
  return 'automne'
}

export function seasonLabel(season: Season): string {
  return SEASON_LABELS[season]
}

export function seasonHeadline(season: Season): string {
  return SEASON_HEADLINES[season]
}

export function formatLongDate(date: Date): string {
  const text = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function monthChipLabel(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleDateString('fr-FR', { month: 'short' })
}
