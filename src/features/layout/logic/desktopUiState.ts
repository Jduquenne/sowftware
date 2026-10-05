import type { CatalogEntry } from '../../../services/db'
import type { Cell } from './grid'

export type Tool = { kind: 'place' } | { kind: 'shape' } | { kind: 'delete' } | { kind: 'armed'; entry: CatalogEntry }

export type Panel =
  | { kind: 'none' }
  | { kind: 'pick'; cell: Cell }
  | { kind: 'placement'; placementId: string }
  | { kind: 'child'; childId: string }

export interface LayoutUiState {
  tool: Tool
  panel: Panel
}

export type LayoutUiAction =
  | { type: 'reset' }
  | { type: 'toggleTool'; tool: 'shape' | 'delete' }
  | { type: 'arm'; entry: CatalogEntry }
  | { type: 'disarm' }
  | { type: 'openPanel'; panel: Panel }
  | { type: 'closePanel' }

const PLACE: Tool = { kind: 'place' }
const NO_PANEL: Panel = { kind: 'none' }

export const initialLayoutUiState: LayoutUiState = { tool: PLACE, panel: NO_PANEL }

export function layoutUiReducer(state: LayoutUiState, action: LayoutUiAction): LayoutUiState {
  switch (action.type) {
    case 'reset':
      return initialLayoutUiState
    case 'toggleTool':
      return { tool: state.tool.kind === action.tool ? PLACE : { kind: action.tool }, panel: NO_PANEL }
    case 'arm':
      return { tool: { kind: 'armed', entry: action.entry }, panel: NO_PANEL }
    case 'disarm':
      return state.tool.kind === 'armed' ? { ...state, tool: PLACE } : state
    case 'openPanel':
      return { ...state, panel: action.panel }
    case 'closePanel':
      return { tool: state.tool.kind === 'shape' ? PLACE : state.tool, panel: NO_PANEL }
  }
}

export function isPanelOpen(state: LayoutUiState): boolean {
  return state.tool.kind === 'shape' || state.panel.kind !== 'none'
}
