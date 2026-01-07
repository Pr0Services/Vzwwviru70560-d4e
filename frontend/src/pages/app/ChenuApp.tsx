// ================================
// CHE·NU — 3 SURFACES APPLICATION
// A (Nova/Dialogue), B (Spheres), C (Workspace)
// ================================

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SurfaceNova } from '@/components/surfaces/SurfaceNova'
import { SurfaceSpheres } from '@/components/surfaces/SurfaceSpheres'
import { SurfaceWorkspace } from '@/components/surfaces/SurfaceWorkspace'
import { AppHeader } from '@/components/surfaces/AppHeader'
import { clsx } from 'clsx'

// -------------------------------
// TYPES
// -------------------------------

export type Surface = 'nova' | 'spheres' | 'workspace'

export interface WorkspaceVersion {
  id: string
  content: string
  status: 'active' | 'proposed' | 'archived'
  timestamp: Date
  author: 'user' | 'nova'
}

export interface Sphere {
  id: string
  name: string
  icon: string
  color: string
  description: string
  agentCount: number
  isActive: boolean
}

// -------------------------------
// ROOT APP
// -------------------------------

export function ChenuApp() {
  const [activeSurface, setActiveSurface] = useState<Surface>('workspace')
  const [activeSphere, setActiveSphere] = useState<Sphere | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceVersion[]>([
    { 
      id: 'v1', 
      content: '', 
      status: 'active',
      timestamp: new Date(),
      author: 'user'
    }
  ])

  const activeVersion = workspace.find(v => v.status === 'active')!

  const handlePropose = useCallback((content: string) => {
    const newVersion: WorkspaceVersion = {
      id: crypto.randomUUID(),
      content,
      status: 'proposed',
      timestamp: new Date(),
      author: 'nova'
    }
    setWorkspace(prev => [...prev, newVersion])
    return newVersion
  }, [])

  const handleAccept = useCallback((id: string) => {
    setWorkspace(prev => prev.map(v => ({
      ...v,
      status: v.id === id ? 'active' : (v.status === 'active' ? 'archived' : v.status)
    } as WorkspaceVersion)))
  }, [])

  const handleReject = useCallback((id: string) => {
    setWorkspace(prev => prev.filter(v => v.id !== id || v.status !== 'proposed'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header with Surface Navigation */}
      <AppHeader 
        activeSurface={activeSurface} 
        onSwitchSurface={setActiveSurface}
        activeSphere={activeSphere}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeSurface === 'nova' && (
            <SurfaceNova 
              key="nova"
              activeSphere={activeSphere}
              onPropose={handlePropose}
            />
          )}
          
          {activeSurface === 'spheres' && (
            <SurfaceSpheres 
              key="spheres"
              activeSphere={activeSphere}
              onSelectSphere={setActiveSphere}
              onNavigateToNova={() => setActiveSurface('nova')}
            />
          )}
          
          {activeSurface === 'workspace' && (
            <SurfaceWorkspace 
              key="workspace"
              activeVersion={activeVersion}
              versions={workspace}
              activeSphere={activeSphere}
              onPropose={handlePropose}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default ChenuApp
