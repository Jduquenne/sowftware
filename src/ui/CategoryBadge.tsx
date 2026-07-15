import { getCategoryStyle } from '../utils/categoryStyle'
import { Badge } from './Badge'

interface CategoryBadgeProps {
  categorie: string
}

export function CategoryBadge({ categorie }: CategoryBadgeProps) {
  const style = getCategoryStyle(categorie)
  return (
    <Badge icon={style.icon} pill className={`capitalize ${style.badgeClass}`}>
      {categorie}
    </Badge>
  )
}
