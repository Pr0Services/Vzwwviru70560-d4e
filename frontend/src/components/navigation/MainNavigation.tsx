/**
 * CHE·NU — Navigation Principale (5 items + Nova)
 */

import React, { useState } from 'react';

const COLORS = {
  bg: '#0D1210',
  sidebar: '#151A18',
  border: '#2A3530',
  sand: '#D8B26A',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
  hover: '#1E2422',
};

interface MainNavigationProps {
  currentPath: string;
  enabledSpheres: string[];
  notifications: number;
  onNavigate: (path: string) => void;
  onNovaOpen: () => void;
}

interface SphereData {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const SPHERES: SphereData[] = [
  { id: 'personal', name: 'Personal', icon: '👤', color: '#4A90D9' },
  { id: 'enterprise', name: 'Enterprise', icon: '🏢', color: '#2ECC71' },
  { id: 'creative', name: 'Creative Studio', icon: '🎨', color: '#9B59B6' },
  { id: 'architecture', name: 'Architecture', icon: '📐', color: '#E67E22' },
  { id: 'social', name: 'Social Media', icon: '📱', color: '#E74C3C' },
  { id: 'community', name: 'Community', icon: '🏘️', color: '#1ABC9C' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#F39C12' },
  { id: 'ai-labs', name: 'AI Labs', icon: '🧪', color: '#00E5FF' },
  { id: 'design', name: 'Design Studio', icon: '🎭', color: '#8E44AD' },
];

const TOOLS = [
  { id: 'calendar', name: 'Calendrier', icon: '📅', path: '/tools/calendar' },
  { id: 'messages', name: 'Messages', icon: '📧', path: '/tools/messages' },
  { id: 'tasks', name: 'Tâches', icon: '📋', path: '/tools/tasks' },
  { id: 'files', name: 'Fichiers', icon: '💾', path: '/tools/files' },
  { id: 'search', name: 'Recherche', icon: '🔍', path: '/tools/search' },
  { id: 'analytics', name: 'Analytics', icon: '📊', path: '/tools/analytics' },
];

export const MainNavigation: React.FC<MainNavigationProps> = ({
  currentPath,
  enabledSpheres,
  notifications,
  onNavigate,
  onNovaOpen,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const isActive = (path: string) => currentPath.startsWith(path);

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: '🏠', path: '/' },
    { id: 'spheres', label: 'Sphères', icon: '🌐', hasSubmenu: true },
    { id: 'tools', label: 'Outils', icon: '🔧', hasSubmenu: true },
    { id: 'ai-lab', label: 'IA Lab', icon: '🧪', path: '/ai-labs' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️', path: '/settings' },
  ];

  const filteredSpheres = SPHERES.filter(s => enabledSpheres.includes(s.id));

  return (
    <nav style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: 260,
      background: COLORS.sidebar,
      borderRight: `1px solid ${COLORS.border}`,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
      zIndex: 1000,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${COLORS.sage} 0%, ${COLORS.sand} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}>
            🏠
          </div>
          <div>
            <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 16 }}>CHE·NU</div>
            <div style={{ color: COLORS.muted, fontSize: 11 }}>Chez Nous</div>
          </div>
        </div>
      </div>

      {/* Menu Principal - 5 items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {menuItems.map(item => (
          <div key={item.id} style={{ position: 'relative' }}>
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  setOpenSubmenu(openSubmenu === item.id ? null : item.id);
                } else if (item.path) {
                  onNavigate(item.path);
                }
              }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isActive(item.path || '') ? `${COLORS.cyan}15` : 
                           hoveredItem === item.id ? COLORS.hover : 'transparent',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                marginBottom: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{
                  color: isActive(item.path || '') ? COLORS.cyan : COLORS.text,
                  fontSize: 14,
                  fontWeight: isActive(item.path || '') ? 500 : 400,
                }}>
                  {item.label}
                </span>
              </div>
              {item.hasSubmenu && (
                <span style={{
                  color: COLORS.muted,
                  fontSize: 12,
                  transform: openSubmenu === item.id ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>
                  ▶
                </span>
              )}
            </button>

            {/* Sous-menu Sphères */}
            {item.id === 'spheres' && openSubmenu === 'spheres' && (
              <div style={{
                marginLeft: 16,
                padding: '8px 0',
                borderLeft: `2px solid ${COLORS.border}`,
              }}>
                {filteredSpheres.map(sphere => (
                  <button
                    key={sphere.id}
                    onClick={() => onNavigate(`/sphere/${sphere.id}`)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: isActive(`/sphere/${sphere.id}`) ? `${sphere.color}20` : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{sphere.icon}</span>
                    <span style={{
                      color: isActive(`/sphere/${sphere.id}`) ? sphere.color : COLORS.text,
                      fontSize: 13,
                    }}>
                      {sphere.name}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => onNavigate('/settings/spheres')}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: 8,
                  }}
                >
                  <span style={{ fontSize: 14 }}>⚙️</span>
                  <span style={{ color: COLORS.muted, fontSize: 12 }}>Gérer mes sphères</span>
                </button>
              </div>
            )}

            {/* Sous-menu Outils */}
            {item.id === 'tools' && openSubmenu === 'tools' && (
              <div style={{
                marginLeft: 16,
                padding: '8px 0',
                borderLeft: `2px solid ${COLORS.border}`,
              }}>
                {TOOLS.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => onNavigate(tool.path)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: isActive(tool.path) ? `${COLORS.cyan}15` : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{tool.icon}</span>
                    <span style={{
                      color: isActive(tool.path) ? COLORS.cyan : COLORS.text,
                      fontSize: 13,
                    }}>
                      {tool.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nova - TOUJOURS VISIBLE EN BAS */}
      <div style={{
        padding: '12px',
        borderTop: `1px solid ${COLORS.border}`,
      }}>
        <button
          onClick={onNovaOpen}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: `linear-gradient(135deg, ${COLORS.cyan}20 0%, ${COLORS.sage}20 100%)`,
            border: `1px solid ${COLORS.cyan}40`,
            borderRadius: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.sage} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}>
            🤖
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}>Nova</div>
            <div style={{ color: COLORS.muted, fontSize: 11 }}>Votre assistant IA</div>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default MainNavigation;
