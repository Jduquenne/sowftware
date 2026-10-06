const PALETTE = ['#e0483a', '#f08a2c', '#f2c230', '#e04f86', '#a77bd8', '#a9d26a', '#f4efe1', '#ff7a5c']

export function plantColor(nomCommun: string): string {
  let hash = 0
  for (const char of nomCommun) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}
