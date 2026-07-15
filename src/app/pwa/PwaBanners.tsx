import { useInstallPrompt } from './useInstallPrompt'
import { useOnlineStatus } from './useOnlineStatus'
import { usePwaUpdate } from './usePwaUpdate'

export function PwaBanners() {
  const isOnline = useOnlineStatus()
  const { canInstall, promptInstall } = useInstallPrompt()
  const { needRefresh, offlineReady, applyUpdate, dismissOfflineReady } = usePwaUpdate()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-1 p-2">
      {!isOnline && (
        <div className="pointer-events-auto rounded bg-neutral-800 px-3 py-1.5 text-xs text-white shadow">
          Vous êtes hors ligne — vos données restent disponibles localement.
        </div>
      )}

      {needRefresh && (
        <div className="pointer-events-auto flex items-center gap-2 rounded bg-green-800 px-3 py-1.5 text-xs text-white shadow">
          <span>Nouvelle version disponible.</span>
          <button type="button" onClick={applyUpdate} className="rounded bg-white/20 px-2 py-0.5 font-medium">
            Mettre à jour
          </button>
        </div>
      )}

      {offlineReady && !needRefresh && (
        <div className="pointer-events-auto flex items-center gap-2 rounded bg-neutral-800 px-3 py-1.5 text-xs text-white shadow">
          <span>Application prête pour une utilisation hors ligne.</span>
          <button type="button" onClick={dismissOfflineReady} className="text-white/70">
            ✕
          </button>
        </div>
      )}

      {canInstall && (
        <div className="pointer-events-auto flex items-center gap-2 rounded bg-white px-3 py-1.5 text-xs text-neutral-700 shadow ring-1 ring-neutral-200">
          <span>Installer Jardin Planner sur cet appareil ?</span>
          <button
            type="button"
            onClick={promptInstall}
            className="rounded bg-green-800 px-2 py-0.5 font-medium text-white"
          >
            Installer
          </button>
        </div>
      )}
    </div>
  )
}
