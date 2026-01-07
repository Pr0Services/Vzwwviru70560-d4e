/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — MAIN LAYOUT CANONIQUE V2                        ║
 * ║                    Architecture 4 Zones (GELÉE) + Router Integration          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * LAYOUT 4 ZONES (ARCHITECTURE GELÉE - NE PAS MODIFIER):
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ [MAPVIEW]          CHE·NU V52          [Services] [Nova] [👤]  │ ← TOP BAR
 * │  (hors bar)                                                     │
 * ├─────────────────────────────────────────────────────────────────┤
 * │                                                                 │
 * │                    WORKSPACE ENGINE                             │
 * │                 (presque tout l'écran)                          │
 * │                                                                 │
 * ├─────────────────────────────────────────────────────────────────┤
 * │   [💬 Messages] [📧 Email] [📅 Meetings] [🤖 Agents] [✨ Nova]  │ ← COMMUNICATION
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * INTÉGRATION ROUTER:
 * - FloatingMinimap synchronisée avec react-router
 * - Navigation par URL pour toutes les sphères
 * - État lu depuis l'URL, pas l'état local
 */

import React, { useState, useCallback, ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FloatingMinimap, SphereId } from '../components/navigation/FloatingMinimap';
import { useRouterNavigation, SPHERES, BUREAU_SECTIONS, BureauSection } from '../hooks/useRouterNavigation';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface MainLayoutProps {
  children?: ReactNode;
}

interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  badge?: number;
}

interface CommChannel {
  id: string;
  name: string;
  icon: string;
  badge?: number;
  special?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  uiDark: '#141416',
  softSand: '#E9E4D6',
  border: '#2A2A2E',
};

// Services CHE·NU (top bar droite)
const SERVICES: ServiceItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'workspaces', name: 'Workspaces', icon: '🗂️' },
  { id: 'databases', name: 'Bases de données', icon: '🗄️' },
  { id: 'marketplace', name: 'Marketplace', icon: '🏪' },
  { id: 'forum', name: 'Forum', icon: '💬' },
  { id: 'streaming', name: 'Streaming', icon: '📺' },
  { id: 'settings', name: 'Paramètres', icon: '⚙️' },
];

// Canaux de communication (bottom bar)
const COMM_CHANNELS: CommChannel[] = [
  { id: 'messages', name: 'Messages', icon: '💬', badge: 3 },
  { id: 'email', name: 'Email', icon: '📧', badge: 12 },
  { id: 'meetings', name: 'Réunions', icon: '📅', badge: 1 },
  { id: 'agents', name: 'Agents', icon: '🤖', badge: 0 },
  { id: 'nova', name: 'Nova', icon: '✨', special: true },
];

// Labels pour les sections bureau
const SECTION_LABELS: Record<BureauSection, string> = {
  dashboard: 'Tableau de bord',
  notes: 'Notes',
  tasks: 'Tâches',
  projects: 'Projets',
  threads: 'Fils de discussion',
  meetings: 'Réunions',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { 
    activeSphere, 
    activeSection,
    activeSphereData,
    navigateToSphere, 
    navigateToSection,
    navigateToOverview,
    isOverview,
  } = useRouterNavigation();
  
  const [activeService, setActiveService] = useState<string | null>(null);
  const [activeComm, setActiveComm] = useState<string | null>(null);
  const [novaOpen, setNovaOpen] = useState(false);

  // Handler changement de sphère (connecté au router)
  const handleSphereSelect = useCallback((sphereId: SphereId) => {
    navigateToSphere(sphereId, 'dashboard');
  }, [navigateToSphere]);

  // Handler click sur le centre (overview)
  const handleCenterClick = useCallback(() => {
    navigateToOverview();
  }, [navigateToOverview]);

  // Handler navigation vers settings
  const handleServiceClick = useCallback((serviceId: string) => {
    if (serviceId === 'settings') {
      navigate('/settings');
    } else {
      setActiveService(activeService === serviceId ? null : serviceId);
    }
  }, [navigate, activeService]);

  // Titre dynamique basé sur la sphère active
  const getWorkspaceTitle = () => {
    if (isOverview) {
      return 'Centre de Commandement';
    }
    if (activeSphereData) {
      return `Bureau — ${activeSphereData.nameFr}`;
    }
    return 'Workspace';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: COLORS.uiDark,
        color: COLORS.softSand,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          ZONE 1 + 2: TOP BAR (MapView hors bar + Services)
          ═══════════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
          padding: '0 16px',
          backgroundColor: COLORS.uiSlate,
          borderBottom: `1px solid ${COLORS.border}`,
          position: 'relative',
          zIndex: 100,
        }}
      >
        {/* Logo + Titre (à côté de la MapView) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 220 }}>
          <span 
            style={{ 
              fontSize: 20, 
              fontWeight: 600,
              color: COLORS.softSand,
              letterSpacing: '0.05em',
              cursor: 'pointer',
            }}
            onClick={handleCenterClick}
          >
            CHE<span style={{ color: COLORS.sacredGold }}>·</span>NU
          </span>
          <span style={{ 
            fontSize: 11, 
            color: COLORS.ancientStone,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            V52
          </span>
        </div>

        {/* Services CHE·NU (droite) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                backgroundColor: activeService === service.id ? `${COLORS.sacredGold}20` : 'transparent',
                border: `1px solid ${activeService === service.id ? COLORS.sacredGold : 'transparent'}`,
                borderRadius: 8,
                color: activeService === service.id ? COLORS.sacredGold : COLORS.softSand,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={service.name}
            >
              <span>{service.icon}</span>
            </button>
          ))}
          
          {/* Séparateur */}
          <div style={{ width: 1, height: 24, backgroundColor: COLORS.border, margin: '0 8px' }} />
          
          {/* Bouton utilisateur */}
          <button
            onClick={() => navigate('/settings/profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.softSand,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <span>👤</span>
            <span>Jo</span>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAPVIEW FLOTTANTE (HORS DE LA TOP BAR)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed',
          top: 70,
          left: 16,
          zIndex: 200,
        }}
      >
        <FloatingMinimap
          activeSphere={activeSphere}
          onSphereSelect={handleSphereSelect}
          onCenterClick={handleCenterClick}
          size={180}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          ZONE 3: WORKSPACE ENGINE (Centre, presque tout l'écran)
          ═══════════════════════════════════════════════════════════════════════ */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 16px 16px 220px', // Padding left pour ne pas chevaucher la MapView
          overflow: 'auto',
          backgroundColor: COLORS.uiDark,
        }}
      >
        {/* Header du Workspace */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <h1 style={{ 
              fontSize: 24, 
              fontWeight: 600, 
              color: COLORS.softSand,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              {activeSphereData && (
                <span style={{ 
                  fontSize: 28,
                  filter: 'drop-shadow(0 0 8px ' + activeSphereData.colorGlow + ')',
                }}>
                  {activeSphereData.emoji}
                </span>
              )}
              {getWorkspaceTitle()}
            </h1>
            <p style={{ 
              fontSize: 13, 
              color: COLORS.ancientStone, 
              marginTop: 4,
            }}>
              {isOverview 
                ? 'Organiser · Décider · Accéder' 
                : 'Produire · Collaborer · Exécuter'
              }
            </p>
          </div>

          {/* Navigation Bureau Sections (si dans une sphère) */}
          {activeSphere && (
            <div style={{ display: 'flex', gap: 4 }}>
              {BUREAU_SECTIONS.map((section) => (
                <button
                  key={section}
                  onClick={() => navigateToSection(section)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: activeSection === section 
                      ? `${activeSphereData?.color || COLORS.sacredGold}20` 
                      : 'transparent',
                    border: `1px solid ${
                      activeSection === section 
                        ? activeSphereData?.color || COLORS.sacredGold 
                        : COLORS.border
                    }`,
                    borderRadius: 8,
                    color: activeSection === section 
                      ? activeSphereData?.color || COLORS.sacredGold 
                      : COLORS.softSand,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                  }}
                >
                  {SECTION_LABELS[section]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contenu du Workspace (Outlet pour les routes imbriquées ou children) */}
        <div
          style={{
            flex: 1,
            backgroundColor: COLORS.uiSlate,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            overflow: 'auto',
          }}
        >
          {children || <Outlet />}
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          ZONE 4: COMMUNICATION BAR (Bottom)
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 56,
          padding: '0 16px',
          backgroundColor: COLORS.uiSlate,
          borderTop: `1px solid ${COLORS.border}`,
          gap: 8,
        }}
      >
        {COMM_CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => {
              if (channel.id === 'nova') {
                setNovaOpen(!novaOpen);
              } else {
                setActiveComm(activeComm === channel.id ? null : channel.id);
              }
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: (activeComm === channel.id || (channel.id === 'nova' && novaOpen))
                ? channel.special ? `${COLORS.cenoteTurquoise}20` : `${COLORS.sacredGold}20`
                : 'transparent',
              border: `1px solid ${
                (activeComm === channel.id || (channel.id === 'nova' && novaOpen))
                  ? channel.special ? COLORS.cenoteTurquoise : COLORS.sacredGold
                  : COLORS.border
              }`,
              borderRadius: 8,
              color: (activeComm === channel.id || (channel.id === 'nova' && novaOpen))
                ? channel.special ? COLORS.cenoteTurquoise : COLORS.sacredGold
                : COLORS.softSand,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 16 }}>{channel.icon}</span>
            <span>{channel.name}</span>
            
            {/* Badge */}
            {channel.badge && channel.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 9,
                  padding: '0 4px',
                }}
              >
                {channel.badge}
              </span>
            )}
          </button>
        ))}
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          NOVA PANEL (Slide-in depuis la droite)
          ═══════════════════════════════════════════════════════════════════════ */}
      {novaOpen && (
        <div
          style={{
            position: 'fixed',
            right: 0,
            top: 56,
            bottom: 56,
            width: 360,
            backgroundColor: COLORS.uiSlate,
            borderLeft: `1px solid ${COLORS.cenoteTurquoise}40`,
            boxShadow: `-4px 0 20px ${COLORS.cenoteTurquoise}20`,
            zIndex: 150,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease',
          }}
        >
          {/* Header Nova */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>✨</span>
              <span style={{ fontWeight: 600, color: COLORS.cenoteTurquoise }}>Nova</span>
              <span style={{ fontSize: 11, color: COLORS.ancientStone }}>System Intelligence</span>
            </div>
            <button
              onClick={() => setNovaOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.ancientStone,
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              ✕
            </button>
          </div>
          
          {/* Contexte actuel */}
          {activeSphereData && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: `${activeSphereData.color}10`,
                borderBottom: `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>{activeSphereData.emoji}</span>
              <span style={{ fontSize: 12, color: activeSphereData.color }}>
                Contexte: {activeSphereData.nameFr}
              </span>
              <span style={{ fontSize: 11, color: COLORS.ancientStone }}>
                / {SECTION_LABELS[activeSection]}
              </span>
            </div>
          )}
          
          {/* Messages Nova */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
            <div
              style={{
                padding: 12,
                backgroundColor: `${COLORS.cenoteTurquoise}10`,
                borderRadius: 8,
                borderLeft: `3px solid ${COLORS.cenoteTurquoise}`,
                marginBottom: 12,
              }}
            >
              <p style={{ fontSize: 13, color: COLORS.softSand, margin: 0 }}>
                Bonjour Jo! {activeSphereData 
                  ? `Tu es dans la sphère ${activeSphereData.nameFr}. Comment puis-je t'aider?`
                  : 'Comment puis-je t\'aider aujourd\'hui?'
                }
              </p>
            </div>
            
            {/* Suggestions contextuelles */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 11, color: COLORS.ancientStone, marginBottom: 8 }}>
                SUGGESTIONS
              </p>
              {activeSphere ? (
                <>
                  <SuggestionChip icon="📋" text={`Voir les tâches ${activeSphereData?.nameFr}`} />
                  <SuggestionChip icon="📊" text="Analyser les statistiques" />
                  <SuggestionChip icon="🤖" text="Lancer un agent" />
                </>
              ) : (
                <>
                  <SuggestionChip icon="🏠" text="Aller à Personal" onClick={() => handleSphereSelect('personal')} />
                  <SuggestionChip icon="💼" text="Aller à Business" onClick={() => handleSphereSelect('business')} />
                  <SuggestionChip icon="📚" text="Aller à Scholar" onClick={() => handleSphereSelect('scholar')} />
                </>
              )}
            </div>
          </div>
          
          {/* Input Nova */}
          <div style={{ padding: 16, borderTop: `1px solid ${COLORS.border}` }}>
            <input
              type="text"
              placeholder="Demander à Nova..."
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: COLORS.uiDark,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.softSand,
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface SuggestionChipProps {
  icon: string;
  text: string;
  onClick?: () => void;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      padding: '10px 12px',
      marginBottom: 8,
      backgroundColor: 'transparent',
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      color: COLORS.softSand,
      fontSize: 12,
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s ease',
    }}
  >
    <span>{icon}</span>
    <span>{text}</span>
  </button>
);

export default MainLayout;
