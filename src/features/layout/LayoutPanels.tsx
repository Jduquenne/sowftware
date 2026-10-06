import type { ReactNode } from 'react'
import { ArrowRight, Sprout, X } from 'lucide-react'
import type { CatalogEntry, Placement, Plot } from '../../services/db'
import { footprintCells, plotFootprint } from './logic/grid'
import type { ConflictPair, PlacementConflict } from './logic/occupancy'
import { plantColor } from './logic/plantColor'
import { Button } from '../../ui/Button'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { Callout } from '../../ui/Callout'
import { EntryVisual } from '../../ui/CatalogCard'
import { IconTile } from '../../ui/IconTile'

function PanelTitle({ children, className = 'mb-2' }: { children: ReactNode; className?: string }) {
  return <h2 className={`${className} pr-8 font-display text-xl font-semibold text-forest-900`}>{children}</h2>
}

function PlantDot({ entry }: { entry: CatalogEntry | undefined }) {
  return (
    <span
      className="size-11 shrink-0 rounded-full border-[6px] border-forest-600 shadow-card"
      style={{ backgroundColor: entry ? plantColor(entry.nomCommun) : undefined }}
    />
  )
}

export function FloatingPanel({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="absolute right-8 bottom-8 z-20 max-h-[65vh] w-[400px] overflow-y-auto rounded-3xl border border-line bg-white p-5 shadow-float">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-neutral-500 hover:bg-cream"
        aria-label="Fermer"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  )
}

type PanelTab = 'detail' | 'conflicts'

interface PanelTabsProps {
  active: PanelTab
  conflictCount: number
  detailEnabled: boolean
  onSelect: (tab: PanelTab) => void
}

export function PanelTabs({ active, conflictCount, detailEnabled, onSelect }: PanelTabsProps) {
  const tabClass = (tab: PanelTab) =>
    `flex flex-1 items-center justify-center gap-2 border-b-2 pb-2.5 text-sm font-semibold disabled:opacity-40 ${
      active === tab ? 'border-forest-600 text-forest-900' : 'border-line text-neutral-500 hover:text-forest-900'
    }`
  return (
    <div className="mb-4 flex pr-10">
      <button type="button" disabled={!detailEnabled} onClick={() => onSelect('detail')} className={tabClass('detail')}>
        Détail
      </button>
      <button type="button" onClick={() => onSelect('conflicts')} className={tabClass('conflicts')}>
        Conflits
        {conflictCount > 0 && (
          <span className="rounded-full bg-sun-300 px-2 text-xs font-bold text-forest-950">{conflictCount}</span>
        )}
      </button>
    </div>
  )
}

export function ShapeHelpPanel() {
  return (
    <>
      <PanelTitle>Modifier la forme</PanelTitle>
      <p className="text-sm text-neutral-600">
        Cliquez ou glissez sur les cases pour les exclure de la parcelle (forme non rectangulaire), ou sur une case
        déjà exclue pour la réintégrer.
      </p>
    </>
  )
}

interface PickPanelProps {
  catalog: CatalogEntry[]
  series: boolean
  unpositionedChildren: Plot[]
  error: string | null
  onPickEntry: (entry: CatalogEntry) => void
  onPlaceChild: (child: Plot) => void
  onCancel: () => void
}

export function PickPanel({ catalog, series, unpositionedChildren, error, onPickEntry, onPlaceChild, onCancel }: PickPanelProps) {
  return (
    <>
      <PanelTitle>{series ? 'Placement en série' : 'Choisir une plante'}</PanelTitle>
      {series && (
        <p className="mb-3 text-sm text-neutral-600">
          Choisissez une plante, puis cliquez les cases vides où la placer.
        </p>
      )}
      {!series && unpositionedChildren.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-xs font-bold tracking-[0.15em] text-neutral-500 uppercase">
            Sous-parcelles à positionner
          </div>
          <div className="flex flex-col gap-1.5">
            {unpositionedChildren.map((child) => {
              const footprint = plotFootprint(child)
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => onPlaceChild(child)}
                  className="flex items-center justify-between rounded-xl border border-dashed border-violet-300 bg-violet-50 px-3 py-2 text-left text-sm font-semibold text-violet-800 hover:border-violet-500"
                >
                  <span>{child.name}</span>
                  <span className="text-xs font-medium text-violet-600">
                    {footprint.w}×{footprint.h}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
      <CatalogSearchSelect
        catalog={catalog}
        onSelect={onPickEntry}
        error={error}
        renderResultExtra={(c) => (
          <span className="ml-1 text-xs text-neutral-400">
            ({footprintCells(c)}×{footprintCells(c)})
          </span>
        )}
      />
      <Button variant="secondary" onClick={onCancel} className="mt-4">
        Annuler
      </Button>
    </>
  )
}

interface PlacementDetailPanelProps {
  placement: Placement
  catalogById: ReadonlyMap<string, CatalogEntry>
  conflicts: PlacementConflict[]
  onRemove: () => void
  onClose: () => void
}

export function PlacementDetailPanel({ placement, catalogById, conflicts, onRemove, onClose }: PlacementDetailPanelProps) {
  const entry = catalogById.get(placement.catalogId)
  const size = entry ? footprintCells(entry) : 1
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-forest-50">
          {entry && <EntryVisual entry={entry} className="absolute inset-0 h-full w-full" iconSize={24} />}
        </div>
        <div className="min-w-0">
          <div className="font-display text-xl font-semibold text-forest-900">{entry?.nomCommun}</div>
          <div className="text-sm text-neutral-500">{entry?.variete}</div>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-cream px-3 py-2">
          <dt className="text-xs text-neutral-500">Espacement</dt>
          <dd className="font-semibold text-forest-950">{entry?.espacementRaw || '—'} cm</dd>
        </div>
        <div className="rounded-xl bg-cream px-3 py-2">
          <dt className="text-xs text-neutral-500">Emprise</dt>
          <dd className="font-semibold text-forest-950">
            {size}×{size} cases
          </dd>
        </div>
      </dl>
      {conflicts.length > 0 && (
        <div className="mt-4 space-y-2">
          {conflicts.map(({ neighbor, reason }) => (
            <Callout key={neighbor.id} tone="warning" size="sm">
              <strong>Conflit avec {catalogById.get(neighbor.catalogId)?.nomCommun}</strong> : {reason}
            </Callout>
          ))}
        </div>
      )}
      <div className="mt-5 flex gap-2">
        <Button variant="danger" onClick={onRemove}>
          Retirer
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </>
  )
}

interface ConflictsPanelProps {
  pairs: ConflictPair[]
  catalogById: ReadonlyMap<string, CatalogEntry>
  onShow: (placement: Placement) => void
}

export function ConflictsPanel({ pairs, catalogById, onShow }: ConflictsPanelProps) {
  return (
    <div className="space-y-3">
      {pairs.map(({ a, b, reason }) => {
        const entryA = catalogById.get(a.catalogId)
        const entryB = catalogById.get(b.catalogId)
        return (
          <div key={`${a.id}|${b.id}`} className="rounded-2xl border border-sun-300 bg-sun-100/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex shrink-0 items-center gap-1.5">
                <PlantDot entry={entryA} />
                <X size={14} className="text-neutral-500" />
                <PlantDot entry={entryB} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-forest-950">
                  {entryA?.nomCommun} et {entryB?.nomCommun}
                </div>
                <div className="text-xs text-neutral-600">Côte à côte</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-700">{reason}</p>
            <Button variant="secondary" size="sm" onClick={() => onShow(a)} className="mt-3">
              Voir sur le plan
              <ArrowRight size={14} />
            </Button>
          </div>
        )
      })}
      <div className="flex items-center gap-3 pt-1">
        <IconTile icon={Sprout} size="md" round />
        <div>
          <div className="font-semibold text-forest-950">
            {pairs.length > 0 ? 'Le reste du plan est harmonieux' : 'Le plan est harmonieux'}
          </div>
          <div className="text-sm text-neutral-500">
            {pairs.length > 0 ? 'Aucun autre voisinage à éviter' : 'Aucun voisinage à éviter'} dans cette parcelle.
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChildDetailPanelProps {
  child: Plot
  onEnter: () => void
  onUnposition: () => void
  onClose: () => void
}

export function ChildDetailPanel({ child, onEnter, onUnposition, onClose }: ChildDetailPanelProps) {
  const footprint = plotFootprint(child)
  return (
    <>
      <PanelTitle className="mb-1">{child.name}</PanelTitle>
      <p className="text-sm text-neutral-500">
        Sous-parcelle — {footprint.w}×{footprint.h} cases
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Button onClick={onEnter}>
          Ouvrir la grille
          <ArrowRight size={16} />
        </Button>
        <Button variant="danger" onClick={onUnposition}>
          Retirer de la grille
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </>
  )
}
