/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ V68 — BUREAU LAYOUT CANONICAL                           ║
 * ║              9 Sphères × 6 Sections = Architecture Gelée                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Ce composant est le POINT D'ENTRÉE du Bureau.
 * Il affiche les 6 sections canoniques via des tabs.
 * 
 * RÈGLES:
 * - Impossible de naviguer hors des 6 sections
 * - Les sections viennent de CANON.ts (immuables)
 * - La navigation utilise ui.store
 */

import React from 'react';
import { 
  BUREAU_SECTIONS, 
  BureauSectionId, 
  getOrderedBureauSections,
  SPHERES,
  SphereId,
} from '../../constants/CANON';
import { useUIStore, useNavigation } from '../../stores/ui.store';
import { BureauContentCanonical } from '../bureau-canonical';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: '#1E1F22',
    color: '#E9E4D6',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #2F4C39',
    backgroundColor: '#1E1F22',
  },
  sphereInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sphereIcon: {
    fontSize: '24px',
  },
  sphereName: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#D8B26A',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#8D8371',
  },
  breadcrumbSeparator: {
    color: '#3F7249',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '0 24px',
    borderBottom: '1px solid #2F4C39',
    backgroundColor: '#1E1F22',
    overflowX: 'auto' as const,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#8D8371',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
  },
  tabActive: {
    color: '#3EB4A2',
    borderBottomColor: '#3EB4A2',
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
  },
  tabHover: {
    backgroundColor: 'rgba(62, 180, 162, 0.05)',
  },
  tabIcon: {
    fontSize: '16px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    color: '#8D8371',
    backgroundColor: 'transparent',
    border: '1px solid #2F4C39',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface BureauTabsProps {
  activeSection: BureauSectionId;
  onSelectSection: (sectionId: BureauSectionId) => void;
}

const BureauTabs: React.FC<BureauTabsProps> = ({ activeSection, onSelectSection }) => {
  const sections = getOrderedBureauSections();
  
  return (
    <div style={styles.tabs}>
      {sections.map((section) => {
        const isActive = section.id === activeSection;
        
        return (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
            }}
            title={section.description}
          >
            <span style={styles.tabIcon}>{section.icon}</span>
            <span>{section.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface BureauLayoutCanonicalProps {
  sphereId?: SphereId;
  initialSection?: BureauSectionId;
}

export const BureauLayoutCanonical: React.FC<BureauLayoutCanonicalProps> = ({
  sphereId: propSphereId,
  initialSection,
}) => {
  const { 
    sphereId, 
    sectionId,
    selectSection,
    exitBureau,
  } = useNavigation();
  
  // Use prop or store
  const currentSphereId = propSphereId || sphereId || 'personal';
  const currentSection = sectionId || initialSection || 'quickcapture';
  
  // Get sphere info from CANON
  const sphere = SPHERES[currentSphereId as SphereId] || SPHERES.personal;
  const section = BUREAU_SECTIONS[currentSection as BureauSectionId] || BUREAU_SECTIONS.quickcapture;
  
  const handleSelectSection = (sectionId: BureauSectionId) => {
    selectSection(sectionId);
  };
  
  const handleBack = () => {
    exitBureau();
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.sphereInfo}>
          <span style={styles.sphereIcon}>{sphere.icon}</span>
          <span style={styles.sphereName}>{sphere.label}</span>
          <span style={styles.breadcrumb}>
            <span style={styles.breadcrumbSeparator}>›</span>
            <span>Bureau</span>
            <span style={styles.breadcrumbSeparator}>›</span>
            <span style={{ color: '#3EB4A2' }}>{section.label}</span>
          </span>
        </div>
        
        <button
          onClick={handleBack}
          style={styles.backButton}
          title="Retour au Dashboard"
        >
          ← Retour
        </button>
      </div>
      
      {/* Tabs */}
      <BureauTabs
        activeSection={currentSection as BureauSectionId}
        onSelectSection={handleSelectSection}
      />
      
      {/* Content */}
      <div style={styles.content}>
        <BureauContentCanonical
          section={currentSection as BureauSectionId}
          sphereId={currentSphereId}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default BureauLayoutCanonical;
