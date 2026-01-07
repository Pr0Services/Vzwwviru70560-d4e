/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — BUREAU CONTAINER                                ║
 * ║                    Task B1.4: Container for 6 bureau sections                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from 'react'
import { 
  Zap, FolderOpen, MessageSquare, Database, Bot, Video,
  ChevronLeft, ChevronRight, Maximize2, Minimize2
} from 'lucide-react'
import { useBureauStore } from '@/stores'
import type { SphereId, BureauSectionId } from '@/types'

// Icon mapping
const bureauIcons: Record<BureauSectionId, React.ElementType> = {
  quick_capture: Zap,
  resume_workspace: FolderOpen,
  threads: MessageSquare,
  data_files: Database,
  active_agents: Bot,
  meetings: Video,
}

// Color mapping
const sectionColors: Record<BureauSectionId, { bg: string; text: string; accent: string }> = {
  quick_capture: { bg: 'bg-sacred-gold/10', text: 'text-sacred-gold', accent: 'border-sacred-gold/30' },
  resume_workspace: { bg: 'bg-earth-ember/10', text: 'text-earth-ember', accent: 'border-earth-ember/30' },
  threads: { bg: 'bg-cenote-turquoise/10', text: 'text-cenote-turquoise', accent: 'border-cenote-turquoise/30' },
  data_files: { bg: 'bg-jungle-emerald/10', text: 'text-jungle-emerald', accent: 'border-jungle-emerald/30' },
  active_agents: { bg: 'bg-sphere-studio/10', text: 'text-sphere-studio', accent: 'border-sphere-studio/30' },
  meetings: { bg: 'bg-sphere-social/10', text: 'text-sphere-social', accent: 'border-sphere-social/30' },
}

interface BureauContainerProps {
  sphereId: SphereId
  activeSectionId?: BureauSectionId
  onSectionChange?: (sectionId: BureauSectionId) => void
  children?: React.ReactNode
}

export default function BureauContainer({
  sphereId,
  activeSectionId,
  onSectionChange,
  children,
}: BureauContainerProps) {
  const { sections, activeSection, setActiveSection } = useBureauStore()
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentSectionId = activeSectionId || activeSection
  const currentSection = sections.find(s => s.id === currentSectionId)
  const CurrentIcon = currentSectionId ? bureauIcons[currentSectionId] : FolderOpen
  const colors = currentSectionId ? sectionColors[currentSectionId] : sectionColors.threads

  // Sync with external changes
  useEffect(() => {
    if (activeSectionId && activeSectionId !== activeSection) {
      setActiveSection(activeSectionId)
    }
  }, [activeSectionId, activeSection, setActiveSection])

  const handleSectionClick = (sectionId: BureauSectionId) => {
    setActiveSection(sectionId)
    onSectionChange?.(sectionId)
  }

  return (
    <div className={`
      flex h-full
      ${isFullscreen ? 'fixed inset-0 z-40 bg-ui-slate' : ''}
    `}>
      {/* Section Sidebar */}
      <div className={`
        flex flex-col border-r border-white/5 bg-shadow-moss/30
        transition-all duration-300
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/5">
          {!isSidebarCollapsed && (
            <span className="text-sm font-medium text-soft-sand">Bureau</span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-ancient-stone"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Sections */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {sections.map((section) => {
            const Icon = bureauIcons[section.id as BureauSectionId]
            const isActive = section.id === currentSectionId
            const sectionColor = sectionColors[section.id as BureauSectionId]

            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id as BureauSectionId)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  transition-colors
                  ${isActive 
                    ? `${sectionColor.bg} ${sectionColor.text} border-l-2 ${sectionColor.accent.replace('border-', 'border-l-')}` 
                    : 'text-ancient-stone hover:bg-white/5 hover:text-soft-sand border-l-2 border-transparent'}
                `}
                title={isSidebarCollapsed ? section.name_fr : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="text-sm">{section.name_fr}</div>
                    <div className="text-xs text-ancient-stone/70">{section.name_en}</div>
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-white/5 text-xs text-ancient-stone">
            <p>6 sections • Architecture FROZEN</p>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
              <CurrentIcon className={`w-4 h-4 ${colors.text}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-soft-sand">
                {currentSection?.name_fr || 'Section'}
              </h3>
              <p className="text-xs text-ancient-stone">
                {currentSection?.name_en}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
              title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6">
          {children || (
            <SectionPlaceholder 
              sectionId={currentSectionId as BureauSectionId} 
              sphereId={sphereId}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Placeholder content for each section
function SectionPlaceholder({ 
  sectionId, 
  sphereId 
}: { 
  sectionId: BureauSectionId
  sphereId: SphereId 
}) {
  const Icon = bureauIcons[sectionId] || FolderOpen
  const colors = sectionColors[sectionId] || sectionColors.threads

  const descriptions: Record<BureauSectionId, { title: string; desc: string; action: string }> = {
    quick_capture: {
      title: 'Capture Rapide',
      desc: 'Capturez rapidement vos idées, notes et tâches sans interrompre votre flux de travail.',
      action: 'Nouvelle capture',
    },
    resume_workspace: {
      title: 'Reprendre',
      desc: 'Retrouvez votre travail en cours et reprenez exactement là où vous vous êtes arrêté.',
      action: 'Voir l\'historique',
    },
    threads: {
      title: 'Threads',
      desc: 'Gérez vos conversations et fils de discussion dans cette sphère.',
      action: 'Nouveau thread',
    },
    data_files: {
      title: 'DataSpaces',
      desc: 'Organisez vos fichiers et données dans des espaces structurés.',
      action: 'Créer un DataSpace',
    },
    active_agents: {
      title: 'Agents Actifs',
      desc: 'Suivez les agents IA travaillant pour vous dans cette sphère.',
      action: 'Engager un agent',
    },
    meetings: {
      title: 'Réunions',
      desc: 'Planifiez et gérez vos réunions et collaborations.',
      action: 'Planifier une réunion',
    },
  }

  const content = descriptions[sectionId]

  return (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center mb-6`}>
        <Icon className={`w-10 h-10 ${colors.text} opacity-70`} />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-soft-sand mb-2">
        {content?.title}
      </h3>
      
      <p className="text-ancient-stone mb-6">
        {content?.desc}
      </p>

      <button className={`
        btn ${colors.bg} ${colors.text} border ${colors.accent}
        hover:opacity-90 transition-opacity
      `}>
        {content?.action}
      </button>

      <p className="mt-8 text-xs text-ancient-stone">
        Sphère: <span className="text-soft-sand">{sphereId}</span>
      </p>
    </div>
  )
}

// Mini tabs variant for mobile
export function BureauTabs({
  activeSectionId,
  onSectionChange,
}: {
  activeSectionId?: BureauSectionId
  onSectionChange?: (sectionId: BureauSectionId) => void
}) {
  const { sections } = useBureauStore()

  return (
    <div className="flex gap-1 p-1 bg-white/5 rounded-xl overflow-x-auto">
      {sections.map((section) => {
        const Icon = bureauIcons[section.id as BureauSectionId]
        const isActive = section.id === activeSectionId
        const colors = sectionColors[section.id as BureauSectionId]

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange?.(section.id as BureauSectionId)}
            className={`
              flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg
              transition-colors text-sm
              ${isActive 
                ? `${colors.bg} ${colors.text}` 
                : 'text-ancient-stone hover:text-soft-sand'}
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{section.name_fr}</span>
          </button>
        )
      })}
    </div>
  )
}
