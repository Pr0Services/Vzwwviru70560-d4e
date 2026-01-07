// ============================================================
// CHE·NU - 3-Surfaces Application
// Nova | Spheres | Workspace
// ============================================================

import { useEffect } from 'react'
import { SurfaceContainer } from '@/components/surfaces'
import { useAppStore } from '@/stores/appStore'
import type { SurfaceType } from '@/types/surfaces'

export function SurfacesApp() {
  const { setActiveSurface } = useAppStore()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const surfaceMap: Record<string, SurfaceType> = {
          '1': 'nova',
          '2': 'spheres',
          '3': 'workspace',
        }
        
        if (surfaceMap[e.key]) {
          e.preventDefault()
          setActiveSurface(surfaceMap[e.key])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveSurface])

  return <SurfaceContainer />
}
