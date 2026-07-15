import { useStore } from '../../store'
import { wateringLogsForPlanting, daysSinceLastWatering } from './logic/watering'
import { Button } from '../../ui/Button'

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
    <div className="mt-4 border-t border-neutral-200 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-neutral-500">Arrosage</div>
          <div className="text-sm text-neutral-700">
            {days === null ? 'Jamais arrosé' : days === 0 ? "Arrosé aujourd'hui" : `Il y a ${days} jour(s)`}
          </div>
        </div>
        <Button
          variant="info"
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
          Arroser maintenant
        </Button>
      </div>

      {logs.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-neutral-500">
          {logs.slice(0, 5).map((log) => (
            <li key={log.id} className="flex items-center justify-between">
              <span>{new Date(log.wateredAt).toLocaleDateString('fr-FR')}</span>
              <Button variant="link-danger" size="sm" onClick={() => removeWateringLog(log.id)}>
                Supprimer
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
