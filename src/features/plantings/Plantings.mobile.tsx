import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store'
import { PlantingForm } from './PlantingForm'
import { WateringSection } from './WateringSection'
import { plantingStatusLabel } from './logic/lifecycle'
import { statusBadgeClass } from './logic/statusStyle'
import { PageHeader } from '../../ui/PageHeader'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'
import { EntryThumb } from '../../ui/EntryThumb'
import { EmptyState } from '../../ui/EmptyState'
import { ListRow, ListRowGroup } from '../../ui/ListRow'

export function PlantingsMobile() {
  const plantings = useStore((s) => s.plantings)
  const catalogById = useStore((s) => s.catalogById)
  const plots = useStore((s) => s.plots)
  const addPlanting = useStore((s) => s.addPlanting)
  const editPlanting = useStore((s) => s.editPlanting)
  const removePlanting = useStore((s) => s.removePlanting)
  const [mode, setMode] = useState<'list' | 'create' | string>('list')

  const plotName = (id: string | null) => plots.find((p) => p.id === id)?.name ?? 'Sans parcelle'

  if (mode === 'create') {
    return (
      <div>
        <PageHeader variant="mobile" title="Nouvelle plantation" />
        <div className="px-5 pb-4">
          <PlantingForm
            onSubmit={async (input) => {
              await addPlanting(input)
              setMode('list')
            }}
            onCancel={() => setMode('list')}
          />
        </div>
      </div>
    )
  }

  const editingPlanting = plantings.find((p) => p.id === mode)
  if (editingPlanting) {
    return (
      <div>
        <PageHeader
          variant="mobile"
          title="Modifier la plantation"
          subtitle={catalogById.get(editingPlanting.catalogId)?.nomCommun}
        />
        <div className="px-5 pb-4">
          <PlantingForm
            initial={editingPlanting}
            onSubmit={async (input) => {
              await editPlanting(editingPlanting.id, input)
              setMode('list')
            }}
            onCancel={() => setMode('list')}
            onDelete={async () => {
              await removePlanting(editingPlanting.id)
              setMode('list')
            }}
          />
          <WateringSection plantingId={editingPlanting.id} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        variant="mobile"
        title="Plantations"
        actions={
          <Button size="sm" onClick={() => setMode('create')}>
            <Plus size={14} />
            Nouvelle
          </Button>
        }
      />

      <div className="px-5 pb-4">
        <ListRowGroup>
          {plantings.map((planting) => {
            const entry = catalogById.get(planting.catalogId)
            return (
              <ListRow
                key={planting.id}
                leading={<EntryThumb entry={entry} />}
                title={entry ? `${entry.nomCommun} · ${entry.variete}` : 'Plante inconnue'}
                subtitle={plotName(planting.plotId)}
                trailing={
                  <Badge pill className={statusBadgeClass(planting.status)}>
                    {plantingStatusLabel(planting.status)}
                  </Badge>
                }
                onClick={() => setMode(planting.id)}
              />
            )
          })}
        </ListRowGroup>

        {plantings.length === 0 && <EmptyState className="mt-4">Aucune plantation pour le moment.</EmptyState>}
      </div>
    </div>
  )
}
