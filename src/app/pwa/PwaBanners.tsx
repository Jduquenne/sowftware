import { useInstallPrompt } from './useInstallPrompt'
import { useOnlineStatus } from './useOnlineStatus'
import { usePwaUpdate } from './usePwaUpdate'

export function PwaBanners() {
  const isOnline = useOnlineStatus()
  const { canInstall, promptInstall } = useInstallPrompt()
  const { needRefresh, offlineReady, applyUpdate, dismissOfflineReady } = usePwaUpdate()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-1.5 p-3">
      {!isOnline && (
        <div className="pointer-events-auto rounded-full bg-forest-950 px-4 py-2 text-sm text-white shadow-float">
          Vous êtes hors ligne — vos données restent disponibles localement.
        </div>
      )}

      {needRefresh && (
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-forest-700 px-4 py-2 text-sm text-white shadow-float">
          <span>Nouvelle version disponible.</span>
          <button type="button" onClick={applyUpdate} className="rounded-full bg-white/20 px-3 py-0.5 font-semibold">
            Mettre à jour
          </button>
        </div>
      )}

      {offlineReady && !needRefresh && (
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-forest-950 px-4 py-2 text-sm text-white shadow-float">
          <span>Application prête pour une utilisation hors ligne.</span>
          <button type="button" onClick={dismissOfflineReady} className="text-white/70">
            ✕
          </button>
        </div>
      )}

      {canInstall && (
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-forest-950 shadow-float">
          <span>Installer Jardin Planner sur cet appareil ?</span>
          <button
            type="button"
            onClick={promptInstall}
            className="rounded-full bg-forest-700 px-3 py-0.5 font-semibold text-white"
          >
            Installer
          </button>
        </div>
      )}
    </div>
  )
}
