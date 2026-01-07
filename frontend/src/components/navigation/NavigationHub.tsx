/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NAVIGATION HUB                                  ║
 * ║                    Task B1.1: Central navigation component                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Search, Command, ArrowRight, Clock, Star,
  User, Briefcase, Building2, Palette, Users, 
  Smartphone, Film, UsersRound, GraduationCap,
  Zap, FolderOpen, MessageSquare, Database, Bot, Video,
  X
} from 'lucide-react'
import { useSpheresStore, useBureauStore } from '@/stores'
import type { SphereId, BureauSectionId } from '@/types'

// Icon mappings
const sphereIcons: Record<SphereId, React.ElementType> = {
  personal: User,
  business: Briefcase,
  government: Building2,
  studio: Palette,
  community: Users,
  social: Smartphone,
  entertainment: Film,
  team: UsersRound,
  scholar: GraduationCap,
}

const bureauIcons: Record<BureauSectionId, React.ElementType> = {
  quick_capture: Zap,
  resume_workspace: FolderOpen,
  threads: MessageSquare,
  data_files: Database,
  active_agents: Bot,
  meetings: Video,
}

interface NavigationHubProps {
  isOpen: boolean
  onClose: () => void
}

type NavigationItem = {
  id: string
  type: 'sphere' | 'section' | 'action' | 'recent'
  title: string
  subtitle?: string
  icon: React.ElementType
  path: string
  sphereId?: SphereId
}

export default function NavigationHub({ isOpen, onClose }: NavigationHubProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { spheres } = useSpheresStore()
  const { sections } = useBureauStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Build navigation items
  const allItems = useMemo<NavigationItem[]>(() => {
    const items: NavigationItem[] = []

    // Add spheres
    spheres.forEach(sphere => {
      const Icon = sphereIcons[sphere.id as SphereId] || User
      items.push({
        id: `sphere-${sphere.id}`,
        type: 'sphere',
        title: sphere.name_fr,
        subtitle: sphere.name_en,
        icon: Icon,
        path: `/sphere/${sphere.id}`,
        sphereId: sphere.id as SphereId,
      })
    })

    // Add bureau sections (for current sphere context)
    const currentSphereMatch = location.pathname.match(/\/sphere\/(\w+)/)
    if (currentSphereMatch) {
      const currentSphereId = currentSphereMatch[1] as SphereId
      sections.forEach(section => {
        const Icon = bureauIcons[section.id as BureauSectionId] || FolderOpen
        items.push({
          id: `section-${section.id}`,
          type: 'section',
          title: section.name_fr,
          subtitle: `Dans ${spheres.find(s => s.id === currentSphereId)?.name_fr || 'Sphère'}`,
          icon: Icon,
          path: `/sphere/${currentSphereId}/${section.id}`,
          sphereId: currentSphereId,
        })
      })
    }

    // Add quick actions
    items.push({
      id: 'action-settings',
      type: 'action',
      title: 'Paramètres',
      subtitle: 'Configuration du compte',
      icon: User,
      path: '/settings',
    })

    return items
  }, [spheres, sections, location.pathname])

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems

    const query = searchQuery.toLowerCase()
    return allItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.subtitle?.toLowerCase().includes(query)
    )
  }, [allItems, searchQuery])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex])
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }

  const handleSelect = (item: NavigationItem) => {
    navigate(item.path)
    onClose()
    setSearchQuery('')
    setSelectedIndex(0)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Hub Modal */}
      <div className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50">
        <div className="glass rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <Search className="w-5 h-5 text-ancient-stone" />
            <input
              type="text"
              placeholder="Rechercher une sphère, section ou action..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-soft-sand placeholder-ancient-stone outline-none text-lg"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-xs text-ancient-stone">
                <Command className="w-3 h-3" />K
              </kbd>
              <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-ancient-stone"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Quick Actions */}
            {!searchQuery && (
              <div className="p-2 border-b border-white/5">
                <div className="px-3 py-2 text-xs font-medium text-ancient-stone uppercase tracking-wider">
                  Actions rapides
                </div>
                <div className="grid grid-cols-3 gap-2 p-2">
                  {[
                    { icon: Zap, label: 'Capture', color: 'text-sacred-gold' },
                    { icon: MessageSquare, label: 'Thread', color: 'text-cenote-turquoise' },
                    { icon: Bot, label: 'Agent', color: 'text-jungle-emerald' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                      <span className="text-xs text-soft-sand">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Spheres Section */}
            {filteredItems.filter(i => i.type === 'sphere').length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-ancient-stone uppercase tracking-wider">
                  Sphères
                </div>
                {filteredItems
                  .filter(item => item.type === 'sphere')
                  .map((item, index) => {
                    const globalIndex = filteredItems.indexOf(item)
                    const isSelected = globalIndex === selectedIndex
                    const Icon = item.icon

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-3 rounded-xl
                          transition-colors
                          ${isSelected ? 'bg-sacred-gold/20' : 'hover:bg-white/5'}
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${isSelected ? 'bg-sacred-gold/30' : 'bg-white/5'}
                        `}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-sacred-gold' : 'text-ancient-stone'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`font-medium ${isSelected ? 'text-sacred-gold' : 'text-soft-sand'}`}>
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="text-xs text-ancient-stone">{item.subtitle}</div>
                          )}
                        </div>
                        <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-sacred-gold' : 'text-ancient-stone/50'}`} />
                      </button>
                    )
                  })}
              </div>
            )}

            {/* Bureau Sections */}
            {filteredItems.filter(i => i.type === 'section').length > 0 && (
              <div className="p-2 border-t border-white/5">
                <div className="px-3 py-2 text-xs font-medium text-ancient-stone uppercase tracking-wider">
                  Sections Bureau
                </div>
                {filteredItems
                  .filter(item => item.type === 'section')
                  .map((item) => {
                    const globalIndex = filteredItems.indexOf(item)
                    const isSelected = globalIndex === selectedIndex
                    const Icon = item.icon

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                          transition-colors
                          ${isSelected ? 'bg-cenote-turquoise/20' : 'hover:bg-white/5'}
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-cenote-turquoise' : 'text-ancient-stone'}`} />
                        <div className="flex-1 text-left">
                          <div className={`${isSelected ? 'text-cenote-turquoise' : 'text-soft-sand'}`}>
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="text-xs text-ancient-stone">{item.subtitle}</div>
                          )}
                        </div>
                      </button>
                    )
                  })}
              </div>
            )}

            {/* No Results */}
            {filteredItems.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-ancient-stone/30 mx-auto mb-3" />
                <p className="text-ancient-stone">Aucun résultat pour "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/5 flex items-center justify-between text-xs text-ancient-stone">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5">↑↓</kbd> naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5">↵</kbd> sélectionner
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5">esc</kbd> fermer
              </span>
            </div>
            <span className="text-sacred-gold">CHE·NU™</span>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook for keyboard shortcut
export function useNavigationHub() {
  const [isOpen, setIsOpen] = useState(false)

  // Listen for Cmd+K / Ctrl+K
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  }
}
