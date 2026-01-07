/**
 * CHE·NU — WORKSPACE PAGE
 * ============================================================
 * Page principale de l'espace de travail
 * Redirige vers ZoneConception
 * 
 * @version 27.0.0
 */

import React from 'react'
import { ZoneConception } from '@/components/zones/ZoneConception'

interface WorkspacePageProps {
  isExpertMode?: boolean
  isMeetingActive?: boolean
}

export function WorkspacePage({ 
  isExpertMode = false, 
  isMeetingActive = false 
}: WorkspacePageProps) {
  return (
    <ZoneConception 
      isExpertMode={isExpertMode}
      isMeetingActive={isMeetingActive}
    />
  )
}

export default WorkspacePage
