import { NavLink, useLocation, Link } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Cpu, 
  Plug, 
  Building2, 
  Calculator,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Layers,
  ExternalLink
} from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/agents', icon: Cpu, label: 'Agents IA' },
  { path: '/integrations', icon: Plug, label: 'Intégrations' },
  { path: '/construction', icon: Building2, label: 'Construction QC' },
  { path: '/calculator', icon: Calculator, label: 'Calculateur' },
  { path: '/assistant', icon: MessageSquare, label: 'Assistant' },
  { path: '/docs', icon: FileText, label: 'Documentation' },
]

const bottomItems = [
  { path: '/settings', icon: Settings, label: 'Paramètres' },
  { path: '/help', icon: HelpCircle, label: 'Aide' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <aside className={clsx(
      'fixed left-0 top-0 h-screen bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 z-50',
      collapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chenu-500 to-chenu-700 flex items-center justify-center font-bold text-white">
            C·N
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-white">CHE·NU</h1>
              <p className="text-xs text-gray-500">Pro-Service</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* 3-Surfaces App Link */}
      <div className="px-3 pt-4 pb-2">
        <Link
          to="/app"
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
            'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30',
            'text-purple-400 hover:text-purple-300 hover:border-purple-500/50'
          )}
        >
          <Layers size={20} />
          {!collapsed && (
            <>
              <span className="flex-1 font-medium">3-Surfaces</span>
              <ExternalLink size={14} />
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
            Navigation
          </p>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              'sidebar-link',
              isActive && 'active'
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              'sidebar-link',
              isActive && 'active'
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
