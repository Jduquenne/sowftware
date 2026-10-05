import type { ReactNode } from 'react'
import type { CatalogEntry, Placement, Plot } from '../../services/db'
import { footprintCells, plotFootprint } from './logic/grid'
import type { PlacementConflict } from './logic/occupancy'
import { Button } from '../../ui/Button'
import { CatalogSearchSelect } from '../../ui/CatalogSearchSelect'
import { Callout } from '../../ui/Callout'

function PanelTitle({ children, className = 'mb-2' }: { children: ReactNode; className?: string }) {
  return <h2 className={`${className} pr-6 text-sm font-semibold text-green-800`}>{children}</h2>
}

export function FloatingPanel({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="absolute bottom-6 right-6 z-20 max-h-[60vh] w-96 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 shadow-lg">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
        aria-label="Fermer"
      >
        ✕
      </button>
      {children}
    </div>
  )
}

export function ShapeHelpPanel() {
  return (
    <>
      <PanelTitle>Modifier la forme</PanelTitle>
      <p className="text-xs text-neutral-500">
        Cliquez une case pour l'exclure de la parcelle (forme non rectangulaire), ou une case déjà exclue pour la
        réintégrer.
      </p>
    </>
  )
}

interface PickPanelProps {
  catalog: CatalogEntry[]
  unpositionedChildren: Plot[]
  error: string | null
  onPickEntry: (entry: CatalogEntry) => void
  onPlaceChild: (child: Plot) => void
  onCancel: () => void
}

export function PickPanel({ catalog, unpositionedChildren, error, onPickEntry, onPlaceChild, onCancel }: PickPanelProps) {
  return (
    <>
      <PanelTitle>Choisir une plante</PanelTitle>
      {unpositionedChildren.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 text-xs font-semibold uppercase text-neutral-400">Sous-parcelles à positionner</div>
          <div className="flex flex-col gap-1">
            {unpositionedChildren.map((child) => {
              const footprint = plotFootprint(child)
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => onPlaceChild(child)}
                  className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 px-2 py-1 text-left text-sm text-blue-800 hover:border-blue-400"
                >
                  <span>{child.name}</span>
                  <span className="text-xs text-blue-600">
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
      <Button variant="secondary" onClick={onCancel} className="mt-3">
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
  return (
    <>
      <PanelTitle className="mb-1">{entry?.nomCommun}</PanelTitle>
      <p className="text-xs text-neutral-500">{entry?.variete}</p>
      <p className="mt-2 text-xs text-neutral-500">Espacement recommandé : {entry?.espacementRaw || '—'} cm</p>
      {conflicts.length > 0 && (
        <div className="mt-3 space-y-2">
          {conflicts.map(({ neighbor, reason }) => (
            <Callout key={neighbor.id} tone="warning" size="sm">
              ⚠️ Conflit avec {catalogById.get(neighbor.catalogId)?.nomCommun} : {reason}
            </Callout>
          ))}
        </div>
      )}
      <div className="mt-4 flex gap-2">
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
      <p className="text-xs text-neutral-500">
        Sous-parcelle — {footprint.w}×{footprint.h} cases
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={onEnter}>Entrer dans cette parcelle →</Button>
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
