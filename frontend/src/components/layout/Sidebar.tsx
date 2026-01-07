/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — SIDEBAR                                     ║
 * ║                    Navigation des 9 Sphères                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useSphere } from '../../providers/SphereProvider';
import { useAuth } from '../../providers/AuthProvider';
import { SphereId } from '../../constants/CANON';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const { spheres, currentSphere, navigateToSphere } = useSphere();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleSphereClick = (sphereId: SphereId) => {
    navigateToSphere(sphereId);
  };
  
  return (
    <aside 
      className={`
        h-screen bg-[#1A1B1E] border-r border-[#2A2B2E] flex flex-col
        transition-all duration-300 relative
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#2A2B2E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D8B26A] to-[#7A593A] flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🏛️</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-[#E9E4D6]">
                CHE<span className="text-[#D8B26A]">·</span>NU
              </h1>
              <p className="text-xs text-[#5A5B5E]">V68</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Spheres Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className={`px-3 mb-2 ${collapsed ? 'hidden' : ''}`}>
          <span className="text-xs font-medium text-[#5A5B5E] uppercase tracking-wider">
            Sphères
          </span>
        </div>
        
        <ul className="space-y-1 px-2">
          {spheres.map((sphere) => {
            const isActive = currentSphere?.id === sphere.id;
            
            return (
              <li key={sphere.id}>
                <button
                  onClick={() => handleSphereClick(sphere.id)}
                  data-testid={`sphere-${sphere.id}`}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-[#2A2B2E] text-[#E9E4D6]' 
                      : 'text-[#8D8371] hover:bg-[#2A2B2E]/50 hover:text-[#E9E4D6]'
                    }
                  `}
                  title={collapsed ? sphere.name : undefined}
                >
                  {/* Sphere Icon */}
                  <div 
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-all duration-200
                      ${isActive ? 'bg-opacity-20' : 'bg-opacity-10'}
                    `}
                    style={{ 
                      backgroundColor: isActive ? sphere.color : 'transparent',
                      border: `1px solid ${sphere.color}40`
                    }}
                  >
                    <span className="text-lg">{sphere.icon}</span>
                  </div>
                  
                  {/* Sphere Name */}
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">
                      {sphere.name}
                    </span>
                  )}
                  
                  {/* Active Indicator */}
                  {isActive && !collapsed && (
                    <div 
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ backgroundColor: sphere.color }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Nova Quick Access */}
      <div className="px-2 py-3 border-t border-[#2A2B2E]">
        <button
          data-testid="nova-panel"
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            bg-gradient-to-r from-[#D8B26A]/10 to-[#7A593A]/10
            border border-[#D8B26A]/30
            text-[#D8B26A] hover:bg-[#D8B26A]/20
            transition-all duration-200
          `}
          title={collapsed ? 'Nova' : undefined}
        >
          <div className="w-8 h-8 rounded-lg bg-[#D8B26A]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🌟</span>
          </div>
          {!collapsed && (
            <>
              <span className="text-sm font-medium">Nova</span>
              <span className="ml-auto text-xs bg-[#D8B26A]/20 px-2 py-0.5 rounded">
                L0
              </span>
            </>
          )}
        </button>
      </div>
      
      {/* User Section */}
      <div className="p-3 border-t border-[#2A2B2E]">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            data-testid="user-menu"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg
              text-[#8D8371] hover:bg-[#2A2B2E] hover:text-[#E9E4D6]
              transition-all duration-200
            `}
          >
            <div className="w-8 h-8 rounded-full bg-[#3F7249] flex items-center justify-center flex-shrink-0">
              <span className="text-sm">{user?.avatar || '👤'}</span>
            </div>
            {!collapsed && (
              <>
                <div className="text-left truncate flex-1">
                  <p className="text-sm font-medium text-[#E9E4D6] truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-[#5A5B5E] truncate">
                    {user?.email}
                  </p>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
          
          {/* User Dropdown */}
          {showUserMenu && !collapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#2A2B2E] rounded-lg border border-[#3A3B3E] shadow-xl overflow-hidden z-50">
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-[#E9E4D6] hover:bg-[#3A3B3E] transition-colors flex items-center gap-2"
              >
                <span>🚪</span>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Collapse Toggle */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute top-4 -right-3 w-6 h-6 bg-[#2A2B2E] border border-[#3A3B3E] rounded-full flex items-center justify-center text-[#8D8371] hover:text-[#E9E4D6] transition-colors z-10"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
