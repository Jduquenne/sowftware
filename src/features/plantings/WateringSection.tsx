import { Droplet, Trash2 } from 'lucide-react'
import { useStore } from '../../store'
import { wateringLogsForPlanting, daysSinceLastWatering } from './logic/watering'
import { Button } from '../../ui/Button'
import { IconTile } from '../../ui/IconTile'

interface WateringSectionProps {
  plantingId: string
}

export function WateringSection({ plantingId }: WateringSectionProps) {
  const wateringLogs = useStore((s) => s.wateringLogs)
  const addWateringLog = useStore((s) => s.addWateringLog)
  const removeWateringLog = useStore((s) => s.removeWateringLog)

  const logs = wateringLogsForPlanting(wateringLogs, plantingId)
  const days = daysSinceLastWatering(logs)

  return (
    <div className="mt-6 rounded-2xl border border-water-50 bg-water-50/60 p-4">
      <div className="flex items-center gap-3">
        <IconTile icon={Droplet} size="sm" className="bg-white text-water-600" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-neutral-500">Arrosage</div>
          <div className="text-sm font-semibold text-forest-950">
            {days === null ? 'Jamais arrosé' : days === 0 ? "Arrosé aujourd'hui" : `Il y a ${days} jour(s)`}
          </div>
        </div>
      </div>
      <Button
        variant="info"
        className="mt-3 w-full"
        onClick={() =>
          addWateringLog({
            plantingId,
            plotId: null,
            wateredAt: new Date().toISOString(),
            amountMl: null,
            note: '',
          })
        }
      >
        <Droplet size={16} />
        Arroser maintenant
      </Button>

      {logs.length > 0 && (
        <ul className="mt-3 divide-y divide-water-50 rounded-xl bg-white text-sm text-neutral-600">
          {logs.slice(0, 5).map((log) => (
            <li key={log.id} className="flex items-center justify-between px-3 py-2">
              <span>{new Date(log.wateredAt).toLocaleDateString('fr-FR')}</span>
              <button
                type="button"
                onClick={() => removeWateringLog(log.id)}
                className="text-neutral-400 hover:text-red-600"
                aria-label="Supprimer cet arrosage"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
