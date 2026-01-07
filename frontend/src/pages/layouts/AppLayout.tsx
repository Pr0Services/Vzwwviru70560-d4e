/**
 * CHE·NU™ — App Layout
 * Main layout with sidebar, header, and content area
 */

import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Globe2, MessageSquare, Bot, Sparkles,
  Shield, Settings, Menu, X, ChevronLeft, Bell, Search,
  Moon, Sun, LogOut, User, Coins
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Badge, Avatar, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator, Tooltip, Progress } from '@/components/ui'
import { NovaFloatingButton, NovaMiniPanel } from '@/components/nova'
import { mockUser, mockNovaMessages, mockGovernanceStats } from '@/mocks/data'

// ============================================================================
// NAV ITEMS
// ============================================================================

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/spheres', icon: Globe2, label: 'Spheres' },
  { path: '/threads', icon: MessageSquare, label: 'Threads' },
  { path: '/agents', icon: Bot, label: 'Agents' },
  { path: '/nova', icon: Sparkles, label: 'Nova' },
  { path: '/governance', icon: Shield, label: 'Governance', badge: mockGovernanceStats.pending },
]

// ============================================================================
// SIDEBAR
// ============================================================================

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              CHE·NU
            </span>
          </motion.div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path))

          return (
            <Tooltip key={item.path} content={item.label} position="right" disabled={!collapsed}>
              <NavLink
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="danger" size="sm">{item.badge}</Badge>
                    )}
                  </>
                )}
                {collapsed && item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </NavLink>
            </Tooltip>
          )
        })}
      </nav>

      {/* Token Usage */}
      {!collapsed && (
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Tokens
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {(mockUser.tokensUsed / 1000).toFixed(0)}K / {(mockUser.tokensLimit / 1000).toFixed(0)}K
              </span>
            </div>
            <Progress
              value={(mockUser.tokensUsed / mockUser.tokensLimit) * 100}
              size="sm"
              variant={mockUser.tokensUsed / mockUser.tokensLimit > 0.8 ? 'danger' : 'default'}
            />
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <Tooltip content="Settings" position="right" disabled={!collapsed}>
          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
              location.pathname.startsWith('/settings')
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Settings</span>}
          </NavLink>
        </Tooltip>
      </div>
    </aside>
  )
}

// ============================================================================
// HEADER
// ============================================================================

interface HeaderProps {
  sidebarCollapsed: boolean
}

function Header({ sidebarCollapsed }: HeaderProps) {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search threads, agents, spheres..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-500">
            ⌘K
          </kbd>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode */}
          <Tooltip content={darkMode ? 'Light mode' : 'Dark mode'}>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </Tooltip>

          {/* Notifications */}
          <Tooltip content="Notifications">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </Tooltip>

          {/* User Menu */}
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Avatar name={mockUser.name} size="sm" />
                <span className="font-medium text-sm hidden md:block">{mockUser.name}</span>
              </button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-gray-100">{mockUser.name}</p>
                <p className="text-xs text-gray-500">{mockUser.email}</p>
              </div>
              <DropdownItem icon={<User className="w-4 h-4" />} onClick={() => navigate('/settings/profile')}>
                Profile
              </DropdownItem>
              <DropdownItem icon={<Coins className="w-4 h-4" />} onClick={() => navigate('/settings/billing')}>
                Billing
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={<LogOut className="w-4 h-4" />} onClick={() => navigate('/auth/login')} destructive>
                Log out
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

// ============================================================================
// APP LAYOUT
// ============================================================================

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [novaOpen, setNovaOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Header */}
      <Header sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Nova Floating Button */}
      <NovaFloatingButton onClick={() => setNovaOpen(true)} unreadCount={0} />

      {/* Nova Mini Panel */}
      <NovaMiniPanel
        open={novaOpen}
        onClose={() => setNovaOpen(false)}
        onExpand={() => {
          setNovaOpen(false)
          navigate('/nova')
        }}
        messages={mockNovaMessages}
        onSendMessage={(content) => logger.debug('Send:', content)}
      />
    </div>
  )
}
