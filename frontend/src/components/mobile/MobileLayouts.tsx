// CHE·NU™ Mobile Layouts — Responsive Design System
// Mobile-first responsive components for all devices

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// ============================================================
// BREAKPOINTS (Tailwind-compatible)
// ============================================================

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ============================================================
// RESPONSIVE HOOKS
// ============================================================

function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowSize();

  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'xs' || breakpoint === 'sm';
}

export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'md';
}

export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// ============================================================
// RESPONSIVE CONTEXT
// ============================================================

interface ResponsiveContextValue {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

const ResponsiveContext = createContext<ResponsiveContextValue | null>(null);

export function ResponsiveProvider({ children }: { children: ReactNode }) {
  const { width, height } = useWindowSize();
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return (
    <ResponsiveContext.Provider
      value={{ breakpoint, isMobile, isTablet, isDesktop, width, height }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive(): ResponsiveContextValue {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within ResponsiveProvider');
  }
  return context;
}

// ============================================================
// MOBILE SHELL LAYOUT
// ============================================================

interface MobileShellProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  navigation?: ReactNode;
}

export function MobileShell({ children, header, footer, navigation }: MobileShellProps) {
  return (
    <div className="mobile-shell flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      {header && (
        <header className="mobile-header flex-shrink-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between safe-area-top">
          {header}
        </header>
      )}

      {/* Main Content */}
      <main className="mobile-content flex-1 overflow-y-auto overscroll-contain">
        {children}
      </main>

      {/* Navigation */}
      {navigation && (
        <nav className="mobile-navigation flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
          {navigation}
        </nav>
      )}

      {/* Footer (optional) */}
      {footer && (
        <footer className="mobile-footer flex-shrink-0">
          {footer}
        </footer>
      )}
    </div>
  );
}

// ============================================================
// MOBILE HEADER COMPONENT
// ============================================================

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export function MobileHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
  showBack,
  onBack,
}: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-[60px]">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {leftAction}
      </div>

      {/* Center */}
      <div className="flex-1 text-center">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 min-w-[60px] justify-end">
        {rightAction}
      </div>
    </div>
  );
}

// ============================================================
// MOBILE BOTTOM NAVIGATION (8 SPHERES)
// ============================================================

interface BottomNavItem {
  code: string;
  name: string;
  icon: string;
}

interface MobileBottomNavProps {
  activeCode: string;
  onSelect: (code: string) => void;
}

// 8 Spheres (FROZEN - Memory Prompt)
const SPHERE_NAV_ITEMS: BottomNavItem[] = [
  { code: 'personal', name: 'Personal', icon: '🏠' },
  { code: 'business', name: 'Business', icon: '💼' },
  { code: 'government', name: 'Gov', icon: '🏛️' },
  { code: 'design_studio', name: 'Studio', icon: '🎨' },
  { code: 'community', name: 'Community', icon: '👥' },
  { code: 'social', name: 'Social', icon: '📱' },
  { code: 'entertainment', name: 'Fun', icon: '🎬' },
  { code: 'my_team', name: 'Team', icon: '🤝' },
];

export function MobileBottomNav({ activeCode, onSelect }: MobileBottomNavProps) {
  const [showMore, setShowMore] = useState(false);
  
  // Show first 4 spheres + "More" on mobile
  const visibleItems = SPHERE_NAV_ITEMS.slice(0, 4);
  const moreItems = SPHERE_NAV_ITEMS.slice(4);

  return (
    <div className="relative">
      {/* More Menu */}
      {showMore && (
        <div className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 grid grid-cols-4 gap-4">
          {moreItems.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                onSelect(item.code);
                setShowMore(false);
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeCode === item.code
                  ? 'bg-primary-100 dark:bg-primary-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex items-center justify-around h-16 px-2">
        {visibleItems.map((item) => (
          <button
            key={item.code}
            onClick={() => onSelect(item.code)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] transition-colors ${
              activeCode === item.code
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        ))}
        
        {/* More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] transition-colors ${
            showMore || moreItems.some(i => i.code === activeCode)
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <span className="text-xl">⋯</span>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MOBILE BUREAU TABS (10 SECTIONS)
// ============================================================

interface MobileBureauTabsProps {
  activeSection: number;
  onSectionChange: (id: number) => void;
}

// 10 Bureau Sections (NON-NEGOTIABLE - Memory Prompt)
const BUREAU_SECTIONS = [
  { id: 1, name: 'Dashboard', icon: '📊' },
  { id: 2, name: 'Notes', icon: '📝' },
  { id: 3, name: 'Tasks', icon: '✅' },
  { id: 4, name: 'Projects', icon: '📁' },
  { id: 5, name: 'Threads', icon: '💬' },
  { id: 6, name: 'Meetings', icon: '📅' },
  { id: 7, name: 'Data', icon: '🗄️' },
  { id: 8, name: 'Agents', icon: '🤖' },
  { id: 9, name: 'Reports', icon: '📈' },
  { id: 10, name: 'Budget', icon: '💰' },
];

export function MobileBureauTabs({ activeSection, onSectionChange }: MobileBureauTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 p-3 min-w-max">
        {BUREAU_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span>{section.icon}</span>
            <span>{section.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MOBILE THREAD CARD
// ============================================================

interface MobileThreadCardProps {
  id: string;
  title: string;
  description?: string;
  sphereIcon: string;
  status: 'active' | 'paused' | 'archived';
  tokenBudget: number;
  tokensUsed: number;
  lastActivity: string;
  onClick: () => void;
}

export function MobileThreadCard({
  id,
  title,
  description,
  sphereIcon,
  status,
  tokenBudget,
  tokensUsed,
  lastActivity,
  onClick,
}: MobileThreadCardProps) {
  const usagePercent = (tokensUsed / tokenBudget) * 100;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* Sphere Icon */}
        <div className="text-2xl">{sphereIcon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              .chenu
            </span>
          </div>

          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {description}
            </p>
          )}

          {/* Token Usage Bar */}
          <div className="mt-2">
            <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  usagePercent > 80
                    ? 'bg-red-500'
                    : usagePercent > 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-400">
                {tokensUsed.toLocaleString()} / {tokenBudget.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400">{lastActivity}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div
          className={`w-2 h-2 rounded-full ${
            status === 'active'
              ? 'bg-green-500'
              : status === 'paused'
              ? 'bg-yellow-500'
              : 'bg-gray-400'
          }`}
        />
      </div>
    </div>
  );
}

// ============================================================
// MOBILE NOVA FAB (Floating Action Button)
// ============================================================

interface MobileNovaFabProps {
  onClick: () => void;
  unreadCount?: number;
}

export function MobileNovaFab({ onClick, unreadCount = 0 }: MobileNovaFabProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center active:scale-95 transition-transform z-50"
    >
      <span className="text-2xl">🌟</span>
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

// ============================================================
// MOBILE BOTTOM SHEET
// ============================================================

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  height?: 'auto' | 'half' | 'full';
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
}: MobileBottomSheetProps) {
  const heightClass = {
    auto: 'max-h-[80vh]',
    half: 'h-[50vh]',
    full: 'h-[90vh]',
  }[height];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl ${heightClass} overflow-hidden animate-slide-up`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 safe-area-bottom">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MOBILE SWIPE LIST ITEM
// ============================================================

interface MobileSwipeItemProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}

export function MobileSwipeItem({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
}: MobileSwipeItemProps) {
  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - startX;
    setOffset(Math.max(-100, Math.min(100, diff)));
  };

  const handleTouchEnd = () => {
    if (offset > 50 && onSwipeRight) {
      onSwipeRight();
    } else if (offset < -50 && onSwipeLeft) {
      onSwipeLeft();
    }
    setOffset(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-green-500 flex items-center justify-start pl-4">
          {leftAction}
        </div>
        <div className="flex-1 bg-red-500 flex items-center justify-end pr-4">
          {rightAction}
        </div>
      </div>

      {/* Content */}
      <div
        className="relative bg-white dark:bg-gray-800 transition-transform"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================
// MOBILE PULL TO REFRESH
// ============================================================

interface MobilePullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

export function MobilePullToRefresh({ children, onRefresh }: MobilePullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling) return;
    const distance = Math.min(e.touches[0].clientY - 50, 150);
    setPullDistance(Math.max(0, distance));
  };

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    setPulling(false);
    setPullDistance(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <div
        className="flex items-center justify-center transition-all overflow-hidden"
        style={{ height: pullDistance }}
      >
        <div
          className={`w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full ${
            refreshing ? 'animate-spin' : ''
          }`}
          style={{
            transform: `rotate(${(pullDistance / threshold) * 360}deg)`,
          }}
        />
      </div>

      {children}
    </div>
  );
}

// ============================================================
// RESPONSIVE SHOW/HIDE COMPONENTS
// ============================================================

interface ShowProps {
  children: ReactNode;
}

export function ShowOnMobile({ children }: ShowProps) {
  const isMobile = useIsMobile();
  return isMobile ? <>{children}</> : null;
}

export function ShowOnTablet({ children }: ShowProps) {
  const isTablet = useIsTablet();
  return isTablet ? <>{children}</> : null;
}

export function ShowOnDesktop({ children }: ShowProps) {
  const isDesktop = useIsDesktop();
  return isDesktop ? <>{children}</> : null;
}

export function HideOnMobile({ children }: ShowProps) {
  const isMobile = useIsMobile();
  return !isMobile ? <>{children}</> : null;
}

// ============================================================
// MOBILE CSS UTILITIES
// ============================================================

export const mobileStyles = `
/* Safe Area Insets */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right);
}

/* Hide Scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Prevent Overscroll */
.overscroll-contain {
  overscroll-behavior: contain;
}

/* Touch Action */
.touch-pan-y {
  touch-action: pan-y;
}

/* Slide Up Animation */
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* Prevent Text Selection */
.select-none-mobile {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

/* Momentum Scrolling */
.momentum-scroll {
  -webkit-overflow-scrolling: touch;
}
`;

// ============================================================
// EXPORTS
// ============================================================

export default {
  MobileShell,
  MobileHeader,
  MobileBottomNav,
  MobileBureauTabs,
  MobileThreadCard,
  MobileNovaFab,
  MobileBottomSheet,
  MobileSwipeItem,
  MobilePullToRefresh,
  ShowOnMobile,
  ShowOnTablet,
  ShowOnDesktop,
  HideOnMobile,
  ResponsiveProvider,
};
