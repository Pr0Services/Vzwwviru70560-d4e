/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — MAIN LAYOUT                                 ║
 * ║                    Layout principal avec Sidebar + Content                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../stores/ui.store';

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST CONTAINER
// ═══════════════════════════════════════════════════════════════════════════════

function ToastContainer() {
  const { toasts, removeToast } = useUIStore();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          data-testid="toast"
          className={`
            px-4 py-3 rounded-lg shadow-lg border max-w-sm
            transform transition-all duration-300 ease-out
            ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'warning' && '⚠'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{toast.title}</p>
              {toast.message && (
                <p className="text-sm opacity-80 mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-50 hover:opacity-100 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LAYOUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#1E1F22] flex">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default MainLayout;
