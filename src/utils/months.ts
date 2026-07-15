export const MONTH_NAMES = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

export const MONTH_NAMES_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1]
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

export function nextMonth(month: number): number {
  return (month % 12) + 1
}

export function previousMonth(month: number): number {
  return ((month + 10) % 12) + 1
}
