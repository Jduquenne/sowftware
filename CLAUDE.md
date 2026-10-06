# Garden Planner — Architectural Invariants

Offline-first PWA to plan a home garden in France: sowing/cutting calendars,
harvest seasonality, plot layout with companion-planting logic, watering
tracking, and yield forecasting.

## Stack

- React + Vite + TypeScript, built as an installable, offline-first PWA.
- Tailwind for styling.
- Zustand for state.
- IndexedDB for persistence. No backend, no cloud sync — fully local.

## Architecture

- **Feature-based**, not type-based. Code is organized by domain feature under
  `features/`, with cross-cutting `services/` and `utils/`. There is no
  top-level `components/` / `hooks/` / `pages/` split.
- Directory roles:
  - `features/<feature>/` — one folder per domain feature.
  - `services/` — framework-free data access (IndexedDB, per-entity services).
  - `utils/` — shared, framework-agnostic helpers.
  - `store/` — the single Zustand root store, composed of per-feature slices.
  - `app/` — root component and the two app shells.
  - `ui/` — shared presentational primitives.
  - `data/` — bundled seed dataset generated from the source catalog.

## Two distinct UX experiences

Mobile and desktop are genuinely different flows sharing one data/logic layer,
**not** one responsive layout with breakpoints.

- Mobile (`< 768px`): simplified, wizard-style, one task at a time, bottom nav.
- Desktop (`≥ 768px`): multi-panel dashboard, power-user density.
- Each feature has `Feature.mobile.tsx` and `Feature.desktop.tsx`, selected by a
  single `index.tsx` switch using `useIsDesktop()`. Do not scatter `md:`
  conditionals to fake two experiences.
- Shared per feature: `features/<feature>/logic/` (pure functions) and
  `features/<feature>/store/` (Zustand slice). A feature may also export a
  shared presentational subcomponent (e.g. a form) used by both of its own
  mobile/desktop views — that's not a third presentation, just reuse within
  the feature.
- `DesktopShell`'s main column has no generic detail pane — a feature renders
  its own detail/side panel internally (see `features/plots`) when its content
  is feature-specific, rather than the shell dictating a fixed empty slot.
- `MobileShell`'s bottom nav is capped at 4 primary tabs + a "Plus" bottom
  sheet for everything else — adding a new feature's view does **not** mean
  appending a new tab; add it to the "Plus" sheet (or renegotiate what counts
  as primary) instead.

## Internal scroll, not page scroll

Both shells are `h-screen overflow-hidden` (not `min-h-screen`) so the app
never grows the document/window — nav, filters, and headers stay pinned; only
the actual list/table/canvas scrolls, in its own bounded region. This depends
on an unbroken chain from the shell down:

- Every ancestor of a scrolling region needs a **real, bounded** height
  (`h-screen` / `h-full`), not just `min-h-*` — `min-h-*` lets content grow
  the box instead of clipping it, which silently defeats `overflow-y-auto`
  further down and pushes the scroll up to the whole page instead.
- Flex/grid children default to `min-height: auto`, which lets them overflow
  their container despite `overflow-y-auto` — the scrolling element (and,
  in a flex row, its scrolling sibling's container) needs **`min-h-0`**
  alongside `flex-1 overflow-y-auto` or the fix silently doesn't take.
- Pattern for a feature screen with its own fixed header above a scrolling
  list: outer `flex h-full flex-col`, header `shrink-0`, list wrapper
  `min-h-0 flex-1 overflow-y-auto`. For a fixed side aside next to scrolling
  content: outer `flex h-full`, aside plain (add `overflow-y-auto` only if
  its own content could realistically grow tall), content
  `flex min-h-0 flex-1 flex-col` with the same header/list split inside.
  See `features/catalog/Catalog.desktop.tsx` as the reference example.

## Data model

Three distinct concepts, kept separate:

- **Catalog** — reference species/variety data, read-only, seeded. One store.
- **Instances (plantings)** — plants the user actually planted, with lifecycle.
- **Plots** — spaces (jardin / terrasse / potager / pot) with dimensions.
- **Placements** — a catalog entry at coordinates in a plot, linked to a planting.

IndexedDB has one object store per entity (`catalog`, `plots`, `placements`,
`plantings`, `wateringLogs`) plus a `meta` store. IndexedDB is the source of
truth; the Zustand store is an in-memory cache hydrated from services. No
`persist` middleware.

Plots can nest: a plot may have a `parentPlotId` (self-reference, not a
separate entity) placed at `xInParent`/`yInParent` inside its parent's grid.
Plots can also be non-rectangular via `excludedCells` — cells excluded from
an otherwise-rectangular bounding grid — rather than true polygon geometry,
staying consistent with the grid-based (not CAD) philosophy below.
`exposition` (required, 3-value enum) and `orientation` (optional, 8-point
compass enum) are structured fields, not free text; both defined in
`features/plots/logic/plotTypes.ts`.

**Gotcha:** IndexedDB has no schema migration — new `Plot` fields added after
existing records were created come back as `undefined` on read, not the new
default. `services/plots.service.ts`'s `normalizePlot()` backfills every
field on `listPlots()`/`getPlot()`. This bit once already: old plots
vanished from the hierarchy view because `parentPlotId === null` failed
against `undefined`. Any new `Plot` field needs the same backfill treatment
or old records silently break.

Deleting a plot cascades (`deletePlot`, one transaction): the plot, all its
descendants and their placements are deleted; plantings/watering logs in them
are detached (`plotId: null`), not deleted. For partial plot updates from the
grid, use `setPlotCellExcluded`/`setPlotPosition` (read-modify-write inside
the transaction) rather than `editPlot` with a full input built from render
state — the latter loses writes during a fast drag.

## Seed data

The catalog is seeded from a source dataset via a versioned, **non-destructive**
mechanism (`services/db/seed.ts`): bumping the seed version refreshes only the
`catalog` store and never touches user-owned data.

`src/data/companionRules.ts` (favorable/avoid plant pairs) is **hand-curated**
from general companion-planting knowledge, not derived from the source CSV —
treat it as a starting point to extend, not ground truth. Same-family
succession avoidance (crop rotation) is a separate fallback rule based on
`familleBotanique`, applied when no explicit pair exists.

`CatalogEntry.yieldPerPlantKg` is likewise **hand-curated** (in
`scripts/generate-catalog-seed.mjs`, `YIELD_PER_PLANT_KG` lookup by
`nomCommun`), not from the CSV. Only populated for food categories
(légume/fruit/aromate); `null` for ornamentals (`fleur`) and a few
non-food aromatics (e.g. Lavande) — a rough planning aid, not a precise figure.

`CatalogEntry.imageUrl` follows the same hand-curated-lookup-by-`nomCommun`
pattern, in `scripts/catalog-image-urls.mjs` (`IMAGE_URL_PATH`, shared by
`generate-catalog-seed.mjs` and by `scripts/apply-catalog-images.mjs` — the
latter re-applies the lookup onto the already-bundled
`src/data/catalog.seed.json` in place, since the source CSV isn't kept in the
repo and full regeneration isn't always possible). One photo per common name
covers every variety. Files live in `public/catalog-images/` and are added
progressively — most entries have `null` and fall back to the category icon
(`utils/categoryStyle.ts`) in the UI; `ui/CatalogCard.tsx` is
where that fallback (including on a broken/missing file) is implemented.
Bump `SEED_VERSION` in `src/services/db/seed.ts` after running either script.

## Layout assistant

- Grid-based, not freeform coordinates (`features/layout/logic/grid.ts`):
  fixed `CELL_SIZE_CM` reference unit; a plant's footprint is
  `round(espacementCm.min / CELL_SIZE_CM)` cells square. This is a helper
  approximation, not a precise CAD simulation.
- `features/layout/logic/occupancy.ts` (`buildPlotOccupancy`, conflict
  helpers) is the single source for what occupies a plot's grid (placements,
  excluded cells, positioned sub-plots) — both Layout views use it; never
  recompute occupancy in a view. Look catalog entries up via the store's
  `catalogById`, not `catalog.find`.
- Only applies to dimensioned plots (`isLayoutable`) — pot-type plots have no
  area to lay out.
- Desktop places by clicking a grid cell; mobile has no visual grid (adds via
  search, auto-assigned to the first free slot) — consistent with mobile
  never getting a spatial canvas, only desktop does.
- A positioned sub-plot renders as a single occupiable zone (its own
  footprint via `plotFootprint`) inside its parent's grid; clicking it opens
  its own independent grid (own `excludedCells`, own placements) rather than
  recursively rendering nested grids in one canvas — logical nesting via
  navigation, not geometric nesting on one screen.
- Desktop interaction modes (shape edit / delete / "placement en série") are
  mutually exclusive toggles set from the header — activating one clears the
  others. Each supports click-and-drag over multiple cells the same way:
  `onMouseDown` performs the action on the first cell and arms a drag value,
  `onMouseEnter` on subsequent cells repeats it, and a single `window`
  `mouseup` listener ends the drag. Reuse this pattern (`useDragValue`, used
  by `LayoutGrid`) for any future bulk-grid action instead of
  one-cell-at-a-time clicks. Modes live in one `Tool` union in
  `logic/desktopUiState.ts`'s reducer — add a new mode there, not as another
  boolean `useState`.
- `Layout.desktop.tsx` doesn't use the shared `DetailAside` — a full-width
  grid needs the space a fixed aside would take. It renders a floating
  bottom-right panel only when there's something to show (shape mode active,
  or an interaction other than idle), keeping the grid full width when idle.
- The last plot selected is remembered in `layoutSlice`'s
  `lastSelectedPlotId` (in-memory only, not persisted to IndexedDB) and used
  as the default plot, so navigating away and back to Disposition doesn't
  reset to the first plot in the list. The URL `?plot=` param (via
  `useSearchParamState`) still wins when present.

## Yield forecast

Scoped as target-quantity-per-plant (`features/yield-forecast/logic/forecast.ts`):
user enters a kg goal for one catalog entry, gets back plants needed and area
needed. Deliberately **not** a per-person/year consumption model — that would
need a second hand-curated estimate per plant with far less consensus (diets
vary too much), for a feature that wasn't asked for. Don't add "feed N
people" as a persona/consumption model without re-confirming scope.

## Visual design

- `utils/categoryStyle.ts` maps `categorie` (légume/fruit/aromate/fleur) to a
  `lucide-react` icon, French `label`/`pluralLabel`, a badge/tile class and a
  photo-fallback `gradientClass`. Any new
  UI showing a catalog category should use this, not an ad-hoc color.
- `ui/CategoryFilter.tsx` (`CategoryFilterChips` for mobile, `CategoryFilterList`
  for desktop) and `ui/CategoryBadge.tsx` are the shared components for
  category filtering/tagging — Catalog, Sowing, Harvest all use these rather
  than hand-rolling their own filter list. Reuse them for new
  category-filterable screens instead of duplicating the pattern again.
- `features/home/` is the default landing view (`home` ViewKey) — a
  dashboard (plot/planting counts, what's in season this month, watering
  alerts with a one-tap quick-log). It reuses existing calendar/watering
  logic verbatim rather than recomputing; don't duplicate that logic here.

## UI design system (`ui/`)

Shared presentational primitives, not per-feature copies. **Check `ui/` before
hand-rolling a button, field, filter, badge, list row, or detail panel — and
extract a new shared component the moment a Tailwind pattern repeats in a 2nd
feature**, rather than copy-pasting the class string again.

- `Button` — `variant`: primary/secondary/danger/info/link/link-danger,
  `size`: sm/md.
- `Field` + `Input` (`TextInput`/`Select`/`Textarea`) — labeled form fields.
- `CatalogSearchSelect` — search-and-pick a catalog entry; covers all three
  modes seen so far (locked read-only, persistent selection with "Changer",
  one-shot picker) via props, not three components.
- `MonthPicker` (desktop chip grid) / `MonthNav` (mobile prev/current/next
  header) — month selection, used by Sowing and Harvest.
- `Filter` (`FilterChips`/`FilterList`) — generic selectable-option
  row/list, any value type, per-option active-color override.
  `CategoryFilter` (`CategoryFilterChips`/`List`) is a thin wrapper over it
  for the catalog-category case specifically — reuse `Filter` directly for
  any other filter set (as Sowing's Pot filter and Yield's mode toggle do).
- `Badge`, `Callout` (`tone`: success/warning), `EmptyState`.
- `ListRow` inside `ListRowGroup` — mobile card row (leading/title/subtitle/
  trailing, clickable or static).
- `PageHeader` (`variant` desktop/mobile) — screen title band (eyebrow,
  serif title, subtitle, actions).
- `SectionCard` / `SectionHeading` — white rounded section with icon-tile +
  serif heading + optional badge/action; `StatCard` — big-number tile.
- `IconTile` — tinted rounded icon square; use it instead of hand-rolling one.
- `Segmented` — pill segmented control for exclusive view modes (Catalogue
  Grille/Tableau); prefer it over `FilterChips` for a 2–3-way view switch.
- `YearStrip` — 12-month segmented rows with the current month outlined;
  `CatalogCard` exports `catalogYearRows` (S semis+bouture / P plantation /
  R récolte) and always shows it.
- Theme tokens live in `src/index.css` `@theme` (`forest`, `sun`, `water`,
  `cream`, `line`, `shadow-card`/`shadow-float`, `font-display` Fraunces,
  `bg-dots`) — use them rather than raw Tailwind greens/ambers.
- `DetailAside` + `DetailAsideHeading` — the desktop `w-80` list+detail-panel
  shell shared by `Plots` and `Plantings` desktop views. `Layout` deliberately
  doesn't use it (see Layout assistant section) — a full-width grid needs the
  space a fixed aside would take.

Deliberately left un-genericized: desktop `<table>`s (columns differ too much
per screen to be worth a generic table component) and the `Layout` placement
grid (too feature-specific to generalize).

## PWA (install / update / offline)

- `src/app/pwa/` holds the three concerns as separate hooks — `useInstallPrompt`
  (captures `beforeinstallprompt`), `useOnlineStatus`, `usePwaUpdate` (wraps
  `virtual:pwa-register`) — composed into `PwaBanners.tsx`, which App.tsx
  renders above both shells. Don't fold PWA lifecycle concerns into a shell or
  a feature; they're app-shell-level, not feature-level.
- `registerType: 'prompt'` (not `'autoUpdate'`) — updates must show the French
  "Nouvelle version disponible" banner and wait for the user to confirm,
  never silently swap the app under them.
- Icons (`public/pwa-192.png`, `pwa-512.png`, `maskable-512.png`,
  `apple-touch-icon.png`) were generated once from a hand-drawn SVG via a
  throwaway `sharp` script (not a project dependency) — regenerate the same
  way if the icon design changes; don't hand-edit the PNGs.

## Dev environment

- Project lives on a Windows-mounted path under WSL2 (`/mnt/e/...`). inotify
  events don't propagate through drvfs, so `vite.config.ts` enables
  `server.watch.usePolling` — without it, edits during `npm run dev` are
  silently not picked up (dev server keeps serving stale transformed modules)
  and the seed/store bug looks like a code bug when it's actually a stale server.

## Working agreement

- **Phased, step-validated development.** Propose a phase, wait for go-ahead,
  implement only that phase, stop for review. Never jump ahead unprompted.
- **Do not manage git.** Never run `git add` / `commit` / `push`.
- **No ESLint / oxlint** setup unless explicitly requested.
- Code and identifiers in English. **Avoid comments almost entirely** — no
  block comments, no paragraph-length explanations, no restating what the
  code already says. A one-line comment is only acceptable for a genuinely
  non-obvious WHY (a hidden constraint, a workaround, a surprising
  invariant); when in doubt, leave it out.
- **All user-facing UI text is in French** (labels, headings, empty states,
  PWA manifest name/description). No i18n library for now — hardcoded French
  strings; introduce i18n only if/when explicitly requested.
- Track work as issues in `dev/issue.json`.
