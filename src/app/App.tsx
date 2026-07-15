import { useEffect } from 'react'
import { useStore } from '../store'
import { useIsDesktop } from '../utils/useIsDesktop'
import { MobileShell } from './shell/MobileShell'
import { DesktopShell } from './shell/DesktopShell'
import { PwaBanners } from './pwa/PwaBanners'

export function App() {
  const isDesktop = useIsDesktop()
  const ready = useStore((s) => s.ready)
  const bootstrap = useStore((s) => s.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">
        Chargement…
      </div>
    )
  }

  return (
    <>
      <PwaBanners />
      {isDesktop ? <DesktopShell /> : <MobileShell />}
    </>
  )
}
