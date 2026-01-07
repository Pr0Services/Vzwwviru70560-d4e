/**
 * CHE·NU™ — Main Layout
 * Primary application layout with sidebar navigation
 */

import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { 
  Home, User, Briefcase, Building2, Palette, Users, 
  Smartphone, Film, UsersRound, GraduationCap,
  Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { useAuthStore, useSpheresStore, useAppStore } from '@/stores'
import type { SphereId } from '@/types'

// Sphere icon mapping
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

// Sphere color mapping
const sphereColors: Record<SphereId, string> = {
  personal: 'text-sphere-personal',
  business: 'text-sphere-business',
  government: 'text-sphere-government',
  studio: 'text-sphere-studio',
  community: 'text-sphere-community',
  social: 'text-sphere-social',
  entertainment: 'text-sphere-entertainment',
  team: 'text-sphere-team',
  scholar: 'text-sphere-scholar',
}

export default function MainLayout() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { spheres, activeSphere, setActiveSphere } = useSpheresStore()
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-ui-slate flex">
      {/* Sidebar - Desktop */}
      <aside className={`
        hidden lg:flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-20'}
        bg-gradient-to-b from-shadow-moss/50 to-ui-slate
        border-r border-white/5
        transition-all duration-300
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sacred-gold to-earth-ember flex items-center justify-center">
              <span className="text-lg font-display font-bold text-ui-slate">N</span>
            </div>
            {sidebarOpen && (
              <span className="font-display font-semibold text-soft-sand">CHE·NU</span>
            )}
          </Link>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone hover:text-soft-sand transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Home */}
          <Link
            to="/"
            className={`
              flex items-center gap-3 px-4 py-3 mx-2 rounded-lg
              transition-colors
              ${location.pathname === '/' 
                ? 'bg-sacred-gold/20 text-sacred-gold' 
                : 'text-ancient-stone hover:bg-white/5 hover:text-soft-sand'}
            `}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Accueil</span>}
          </Link>

          {/* Spheres */}
          <div className="mt-6 px-4">
            {sidebarOpen && (
              <h3 className="text-xs font-semibold text-ancient-stone uppercase tracking-wider mb-2">
                Sphères
              </h3>
            )}
          </div>

          {spheres.map((sphere) => {
            const Icon = sphereIcons[sphere.id as SphereId] || Home
            const isActive = location.pathname.startsWith(`/sphere/${sphere.id}`)
            const colorClass = sphereColors[sphere.id as SphereId] || 'text-soft-sand'

            return (
              <Link
                key={sphere.id}
                to={`/sphere/${sphere.id}`}
                onClick={() => setActiveSphere(sphere.id as SphereId)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg
                  transition-colors
                  ${isActive 
                    ? `bg-white/10 ${colorClass}` 
                    : 'text-ancient-stone hover:bg-white/5 hover:text-soft-sand'}
                `}
                title={!sidebarOpen ? sphere.name_fr : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{sphere.name_fr}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/5 p-4">
          <Link
            to="/settings"
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg
              transition-colors
              ${location.pathname === '/settings' 
                ? 'bg-white/10 text-soft-sand' 
                : 'text-ancient-stone hover:bg-white/5 hover:text-soft-sand'}
            `}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Paramètres</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-ancient-stone hover:bg-red-500/10 hover:text-red-400 transition-colors mt-2"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>

          {sidebarOpen && user && (
            <div className="mt-4 px-3">
              <p className="text-sm text-soft-sand truncate">{user.display_name || user.email}</p>
              <p className="text-xs text-ancient-stone truncate">{user.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-ui-slate border-b border-white/5 flex items-center justify-between px-4 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sacred-gold to-earth-ember flex items-center justify-center">
            <span className="text-sm font-display font-bold text-ui-slate">N</span>
          </div>
          <span className="font-display font-semibold text-soft-sand">CHE·NU</span>
        </Link>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-white/5 text-soft-sand"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-ui-slate border-r border-white/5 z-50
        transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="py-4 overflow-y-auto h-full">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 mx-2 rounded-lg
              ${location.pathname === '/' ? 'bg-sacred-gold/20 text-sacred-gold' : 'text-ancient-stone'}
            `}
          >
            <Home className="w-5 h-5" />
            <span>Accueil</span>
          </Link>

          <div className="mt-6 px-4">
            <h3 className="text-xs font-semibold text-ancient-stone uppercase tracking-wider mb-2">
              Sphères
            </h3>
          </div>

          {spheres.map((sphere) => {
            const Icon = sphereIcons[sphere.id as SphereId] || Home
            const isActive = location.pathname.startsWith(`/sphere/${sphere.id}`)
            const colorClass = sphereColors[sphere.id as SphereId]

            return (
              <Link
                key={sphere.id}
                to={`/sphere/${sphere.id}`}
                onClick={() => {
                  setActiveSphere(sphere.id as SphereId)
                  setMobileMenuOpen(false)
                }}
                className={`
                  flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg
                  ${isActive ? `bg-white/10 ${colorClass}` : 'text-ancient-stone'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{sphere.name_fr}</span>
              </Link>
            )
          })}

          <div className="mt-6 border-t border-white/5 pt-4">
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-ancient-stone"
            >
              <Settings className="w-5 h-5" />
              <span>Paramètres</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 mt-16 lg:mt-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
