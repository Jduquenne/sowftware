import { useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button'

export function FirstPlotHint() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-dashed border-forest-200 bg-white/60 p-5 text-sm text-neutral-600">
      Créez votre première parcelle pour commencer à suivre vos plantations.
      <Button variant="link" onClick={() => navigate('/plots')}>
        Créer une parcelle →
      </Button>
    </div>
  )
}
