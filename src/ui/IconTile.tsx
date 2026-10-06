import type { LucideIcon } from 'lucide-react'

type IconTileSize = 'xs' | 'sm' | 'md' | 'lg'

interface IconTileProps {
  icon: LucideIcon
  size?: IconTileSize
  round?: boolean
  className?: string
}

const SIZE_CLASSES: Record<IconTileSize, { box: string; radius: string; icon: number }> = {
  xs: { box: 'size-7', radius: 'rounded-lg', icon: 15 },
  sm: { box: 'size-9', radius: 'rounded-xl', icon: 18 },
  md: { box: 'size-11', radius: 'rounded-2xl', icon: 20 },
  lg: { box: 'size-14', radius: 'rounded-2xl', icon: 26 },
}

export function IconTile({ icon: Icon, size = 'md', round = false, className = 'bg-forest-50 text-forest-700' }: IconTileProps) {
  const s = SIZE_CLASSES[size]
  return (
    <span className={`flex shrink-0 items-center justify-center ${s.box} ${round ? 'rounded-full' : s.radius} ${className}`}>
      <Icon size={s.icon} />
    </span>
  )
}
