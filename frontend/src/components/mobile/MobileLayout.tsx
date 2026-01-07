// ============================================================
// CHE·NU - Mobile Components
// ============================================================
// React Native ready components
// Touch-optimized, gesture support
// ============================================================

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  FolderKanban,
  Users,
  Settings,
  Bell,
  Plus,
  Search,
  MoreVertical,
  Sparkles
} from 'lucide-react'
import { clsx } from 'clsx'

// ============================================================
// TYPES
// ============================================================

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: React.ReactNode
}

interface TabBarItem {
  id: string
  icon: React.ReactNode
  label: string
  badge?: number
}

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
}

// ============================================================
// MOBILE LAYOUT
// ============================================================

export function MobileLayout({
  children,
  title,
  showBack,
  onBack,
  rightAction
}: MobileLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                onClick={onBack}
                className="p-2 -ml-2 text-gray-400 hover:text-white"
              >
                <ChevronLeft size={24} />
              </button>
            ) : (
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 -ml-2 text-gray-400 hover:text-white"
              >
                <Menu size={24} />
              </button>
            )}
            {title && (
              <h1 className="text-lg font-semibold text-white truncate">
                {title}
              </h1>
            )}
          </div>
          {rightAction}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-gray-800 z-50 shadow-2xl"
            >
              <MobileMenu onClose={() => setMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// MOBILE MENU
// ============================================================

function MobileMenu({ onClose }: { onClose: () => void }) {
  const menuItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Accueil' },
    { id: 'projects', icon: <FolderKanban size={20} />, label: 'Projets' },
    { id: 'teams', icon: <Users size={20} />, label: 'Équipes' },
    { id: 'nova', icon: <Sparkles size={20} />, label: 'Nova IA' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Paramètres' },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">CHE·NU</span>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400">
          <X size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-purple-400 font-medium">JO</span>
          </div>
          <div>
            <p className="text-sm text-white font-medium">Jo</p>
            <p className="text-xs text-gray-500">Pro-Service Construction</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// TAB BAR
// ============================================================

interface TabBarProps {
  items: TabBarItem[]
  activeId: string
  onChange: (id: string) => void
}

export function TabBar({ items, activeId, onChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={clsx(
              'flex flex-col items-center gap-1 px-4 py-2 min-w-[64px] transition-colors relative',
              activeId === item.id ? 'text-purple-400' : 'text-gray-500'
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// ============================================================
// SWIPEABLE CARD
// ============================================================

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction
}: SwipeableCardProps) {
  const x = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)

  const leftOpacity = useTransform(x, [0, 100], [0, 1])
  const rightOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (event: unknown, info: PanInfo) => {
    setIsDragging(false)
    
    if (info.offset.x > 100 && onSwipeRight) {
      onSwipeRight()
    } else if (info.offset.x < -100 && onSwipeLeft) {
      onSwipeLeft()
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Left action (swipe right to reveal) */}
      {leftAction && (
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute inset-y-0 left-0 w-20 bg-green-500 flex items-center justify-center"
        >
          {leftAction}
        </motion.div>
      )}

      {/* Right action (swipe left to reveal) */}
      {rightAction && (
        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center"
        >
          {rightAction}
        </motion.div>
      )}

      {/* Card content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative bg-gray-800 touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  )
}

// ============================================================
// PULL TO REFRESH
// ============================================================

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const threshold = 80
  const startY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (refreshing) return
    
    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current
    
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true)
      await onRefresh()
      setRefreshing(false)
    }
    setPullDistance(0)
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Refresh indicator */}
      <motion.div
        animate={{ height: pullDistance }}
        className="overflow-hidden flex items-center justify-center bg-gray-800"
      >
        <motion.div
          animate={{ rotate: refreshing ? 360 : (pullDistance / threshold) * 180 }}
          transition={refreshing ? { repeat: Infinity, duration: 1 } : {}}
          className="text-purple-400"
        >
          {refreshing ? (
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ChevronRight
              size={24}
              className="transform -rotate-90"
              style={{ opacity: pullDistance / threshold }}
            />
          )}
        </motion.div>
      </motion.div>

      {children}
    </div>
  )
}

// ============================================================
// MOBILE CARD
// ============================================================

interface MobileCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  rightContent?: React.ReactNode
  onClick?: () => void
  badge?: string
  badgeColor?: 'green' | 'yellow' | 'red' | 'purple'
}

export function MobileCard({
  title,
  subtitle,
  icon,
  rightContent,
  onClick,
  badge,
  badgeColor = 'purple'
}: MobileCardProps) {
  const badgeColors = {
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
    purple: 'bg-purple-500/20 text-purple-400'
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-gray-800 rounded-xl active:bg-gray-700 transition-colors text-left"
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white font-medium truncate">{title}</p>
          {badge && (
            <span className={clsx('px-2 py-0.5 text-xs rounded-full', badgeColors[badgeColor])}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
      {rightContent || <ChevronRight size={20} className="text-gray-600" />}
    </button>
  )
}

// ============================================================
// FLOATING ACTION BUTTON
// ============================================================

interface FABProps {
  icon?: React.ReactNode
  onClick: () => void
  label?: string
}

export function FloatingActionButton({ icon, onClick, label }: FABProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-purple-500 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center"
    >
      {icon || <Plus size={24} />}
    </motion.button>
  )
}

// ============================================================
// MOBILE SEARCH BAR
// ============================================================

interface MobileSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MobileSearchBar({ value, onChange, placeholder = 'Rechercher...' }: MobileSearchProps) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
      />
    </div>
  )
}

// ============================================================
// BOTTOM SHEET
// ============================================================

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose()
            }}
            className="fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-2xl z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-600 rounded-full" />
            </div>

            {/* Title */}
            {title && (
              <div className="px-4 pb-3 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
            )}

            {/* Content */}
            <div className="overflow-auto p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
