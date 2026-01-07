/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — BUREAU PAGE CANONICAL                                 ║
 * ║              Architecture à 6 sections + Mode Dashboard                      ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  ARCHITECTURE:                                                               ║
 * ║                                                                              ║
 * ║  MODE DASHBOARD 📊          MODE BUREAU 🗂️                                   ║
 * ║  ══════════════════         ═══════════════════════                          ║
 * ║  Vue d'ensemble             Mode travail avec:                               ║
 * ║  • KPIs                       1. ⚡ QuickCapture                             ║
 * ║  • Stats rapides              2. ▶️ ResumeWorkspace                          ║
 * ║  • Overview                   3. 💬 Threads                                  ║
 * ║                               4. 📁 DataFiles                                ║
 * ║                               5. 🤖 ActiveAgents                             ║
 * ║                               6. 📅 Meetings                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Types
import { CHENU_COLORS } from '../../types';
import { 
  BureauSectionId, 
  WorkspaceViewMode,
  BUREAU_SECTIONS,
  BUREAU_SECTION_IDS,
  VIEW_MODE_CONFIGS,
} from '../../types/bureau.types';
import { SphereId, SPHERES, BRAND_COLORS } from '../../config/spheres.config';

// Canonical Bureau Content
import { BureauContentCanonical } from '../../components/bureau-canonical';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

const SPHERE_ORDER: SphereId[] = [
  'personal', 'my_team', 'business', 'government', 'design_studio',
  'community', 'social', 'entertainment', 'scholars'
];

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD COMPONENT (Mode alternatif)
// ═══════════════════════════════════════════════════════════════════════════════

interface DashboardViewProps {
  sphereId: string;
  onSwitchToMode: (mode: WorkspaceViewMode) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ sphereId, onSwitchToMode }) => {
  const stats = [
    { label: 'Threads actifs', value: 12, icon: '💬', color: CHENU_COLORS.cenoteTurquoise },
    { label: 'Tokens utilisés', value: '2.4K', icon: '💎', color: CHENU_COLORS.sacredGold },
    { label: 'Décisions en attente', value: 3, icon: '⏳', color: CHENU_COLORS.jungleEmerald },
    { label: 'Agents actifs', value: 5, icon: '🤖', color: CHENU_COLORS.earthEmber },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: CHENU_COLORS.softSand,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          📊 Dashboard
        </h2>
        <motion.button
          onClick={() => onSwitchToMode('bureau')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px solid ${CHENU_COLORS.sacredGold}`,
            backgroundColor: 'transparent',
            color: CHENU_COLORS.sacredGold,
            fontSize: '13px',
            cursor: 'pointer',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🗂️ Ouvrir Bureau
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            style={{
              backgroundColor: '#111113',
              borderRadius: '12px',
              border: `1px solid ${stat.color}33`,
              padding: '20px',
            }}
            whileHover={{ scale: 1.02, borderColor: stat.color }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}>
              <span style={{ fontSize: '28px' }}>{stat.icon}</span>
              <span style={{
                fontSize: '24px',
                fontWeight: 700,
                color: stat.color,
              }}>
                {stat.value}
              </span>
            </div>
            <p style={{ 
              fontSize: '13px', 
              color: CHENU_COLORS.ancientStone,
            }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: '#111113',
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${CHENU_COLORS.ancientStone}22`,
      }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: 600, 
          color: CHENU_COLORS.softSand,
          marginBottom: '16px',
        }}>
          ⚡ Actions rapides
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {BUREAU_SECTION_IDS.map((sectionId) => {
            const section = BUREAU_SECTIONS[sectionId];
            return (
              <motion.button
                key={sectionId}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${CHENU_COLORS.ancientStone}33`,
                  backgroundColor: 'transparent',
                  color: CHENU_COLORS.softSand,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                whileHover={{ 
                  backgroundColor: CHENU_COLORS.sacredGold + '11',
                  borderColor: CHENU_COLORS.sacredGold + '44',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSwitchToMode('bureau')}
              >
                {section.icon} {section.nameFr}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
  },
  sphereSidebar: {
    width: '72px',
    backgroundColor: '#0a0a0b',
    borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '16px 0',
    gap: '4px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: BRAND_COLORS.sacredGold,
    marginBottom: '24px',
    cursor: 'pointer',
  },
  sphereBtn: (isActive: boolean, color: string) => ({
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: isActive ? color : 'transparent',
    cursor: 'pointer',
    fontSize: '18px',
    opacity: isActive ? 1 : 0.5,
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.2s ease',
  }),
  sectionSidebar: {
    width: '220px',
    backgroundColor: '#111113',
    borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sphereHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  sphereTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  modeToggle: {
    display: 'flex',
    margin: '12px',
    padding: '3px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    borderRadius: '8px',
  },
  modeBtn: (isActive: boolean) => ({
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.softSand : 'transparent',
    color: isActive ? '#000' : CHENU_COLORS.ancientStone,
    fontSize: '12px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  }),
  sectionNav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '8px 12px',
    gap: '2px',
    overflowY: 'auto' as const,
  },
  sectionBtn: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive ? BRAND_COLORS.sacredGold + '22' : 'transparent',
    color: isActive ? BRAND_COLORS.sacredGold : CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '13px',
    textAlign: 'left' as const,
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.15s ease',
  }),
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  header: {
    height: '56px',
    backgroundColor: '#111113',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  canonicalBadge: {
    padding: '4px 10px',
    backgroundColor: BRAND_COLORS.jungleEmerald + '22',
    borderRadius: '12px',
    fontSize: '10px',
    color: BRAND_COLORS.jungleEmerald,
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const BureauPageCanonical: React.FC = () => {
  const { sphereCode, section } = useParams<{ sphereCode: string; section?: string }>();
  const navigate = useNavigate();
  
  // State
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>('bureau');
  const [activeSphere, setActiveSphere] = useState<SphereId>('personal');
  const [activeSection, setActiveSection] = useState<BureauSectionId>('quickcapture');

  // Sync URL → State
  useEffect(() => {
    if (sphereCode && SPHERES[sphereCode as SphereId]) {
      setActiveSphere(sphereCode as SphereId);
    }
    if (section === 'dashboard') {
      setViewMode('dashboard');
    } else if (section && BUREAU_SECTION_IDS.includes(section as BureauSectionId)) {
      setViewMode('bureau');
      setActiveSection(section as BureauSectionId);
    }
  }, [sphereCode, section]);

  // Handlers
  const handleSphereChange = (id: SphereId) => {
    setActiveSphere(id);
    const targetSection = viewMode === 'dashboard' ? 'dashboard' : activeSection;
    navigate(`/bureau/${id}/${targetSection}`);
  };

  const handleModeChange = (mode: WorkspaceViewMode) => {
    setViewMode(mode);
    const targetSection = mode === 'dashboard' ? 'dashboard' : activeSection;
    navigate(`/bureau/${activeSphere}/${targetSection}`);
  };

  const handleSectionChange = (id: BureauSectionId) => {
    setActiveSection(id);
    setViewMode('bureau');
    navigate(`/bureau/${activeSphere}/${id}`);
  };

  // Config lookups
  const sphereConfig = SPHERES[activeSphere];
  const sectionConfig = viewMode === 'bureau' ? BUREAU_SECTIONS[activeSection] : null;

  return (
    <div style={styles.container}>
      {/* ═══════════════ SPHERE SIDEBAR ═══════════════ */}
      <div style={styles.sphereSidebar}>
        <div onClick={() => navigate('/')} style={styles.logo}>C</div>
        
        {SPHERE_ORDER.map(id => {
          const config = SPHERES[id];
          if (!config) return null;
          return (
            <motion.button
              key={id}
              onClick={() => handleSphereChange(id)}
              style={styles.sphereBtn(activeSphere === id, config.color)}
              title={config.name}
              whileHover={{ opacity: 0.8 }}
              whileTap={{ scale: 0.95 }}
            >
              {config.icon}
            </motion.button>
          );
        })}
      </div>

      {/* ═══════════════ SECTION SIDEBAR ═══════════════ */}
      <div style={styles.sectionSidebar}>
        {/* Sphere Header */}
        <div style={styles.sphereHeader}>
          <span style={{ fontSize: '22px' }}>{sphereConfig?.icon}</span>
          <div>
            <div style={styles.sphereTitle}>{sphereConfig?.name}</div>
            <div style={{ fontSize: '10px', color: CHENU_COLORS.ancientStone }}>
              {viewMode === 'dashboard' ? 'Dashboard' : 'Bureau'}
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={styles.modeToggle}>
          <button
            style={styles.modeBtn(viewMode === 'dashboard')}
            onClick={() => handleModeChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            style={styles.modeBtn(viewMode === 'bureau')}
            onClick={() => handleModeChange('bureau')}
          >
            🗂️ Bureau
          </button>
        </div>

        {/* Section Navigation (only in Bureau mode) */}
        {viewMode === 'bureau' && (
          <nav style={styles.sectionNav}>
            {BUREAU_SECTION_IDS.map(sectionId => {
              const sec = BUREAU_SECTIONS[sectionId];
              return (
                <motion.button
                  key={sectionId}
                  onClick={() => handleSectionChange(sectionId)}
                  style={styles.sectionBtn(activeSection === sectionId)}
                  whileHover={{ backgroundColor: CHENU_COLORS.sacredGold + '11' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{sec.icon}</span>
                  <span>{sec.nameFr}</span>
                </motion.button>
              );
            })}
          </nav>
        )}
      </div>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerTitle}>
            <span>{sphereConfig?.icon}</span>
            <span>
              {sphereConfig?.name} — {viewMode === 'dashboard' ? 'Dashboard' : sectionConfig?.nameFr}
            </span>
          </div>
          <span style={styles.canonicalBadge}>✓ 6 Sections Canoniques</span>
        </header>

        {/* Content */}
        <main style={styles.content}>
          {viewMode === 'dashboard' ? (
            <DashboardView 
              sphereId={activeSphere} 
              onSwitchToMode={handleModeChange}
            />
          ) : (
            <BureauContentCanonical 
              section={activeSection} 
              sphereId={activeSphere} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default BureauPageCanonical;
