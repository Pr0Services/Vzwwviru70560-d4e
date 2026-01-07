/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — CONSOLIDATED BUREAU COMPONENT v40
   ═══════════════════════════════════════════════════════════════════════════════
   
   SINGLE SOURCE OF TRUTH - 6 CANONICAL SECTIONS
   
   ⚠️ DO NOT CREATE DUPLICATE VERSIONS
   All other BureauSections files should import from here.
   
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useCallback, useMemo, Suspense } from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type BureauSectionId = 
  | 'QUICK_CAPTURE'
  | 'RESUME_WORKSPACE'
  | 'THREADS'
  | 'DATA_FILES'
  | 'ACTIVE_AGENTS'
  | 'MEETINGS';

export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'design_studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team'
  | 'scholars';

export interface BureauSectionConfig {
  id: BureauSectionId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  shortcut: string;
}

export interface BureauProps {
  sphereId: SphereId;
  activeSection?: BureauSectionId;
  onSectionChange?: (section: BureauSectionId) => void;
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS - 6 CANONICAL SECTIONS (FROZEN)
// ════════════════════════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS: BureauSectionConfig[] = [
  {
    id: 'QUICK_CAPTURE',
    name: 'Quick Capture',
    nameFr: 'Capture Rapide',
    icon: '⚡',
    description: 'Capture rapide (500 caractères max)',
    shortcut: 'Q',
  },
  {
    id: 'RESUME_WORKSPACE',
    name: 'Resume Workspace',
    nameFr: 'Reprendre',
    icon: '📂',
    description: 'Reprendre le travail en cours',
    shortcut: 'R',
  },
  {
    id: 'THREADS',
    name: 'Threads',
    nameFr: 'Fils',
    icon: '💬',
    description: 'Fils persistants (.chenu)',
    shortcut: 'T',
  },
  {
    id: 'DATA_FILES',
    name: 'Data & Files',
    nameFr: 'Données',
    icon: '📁',
    description: 'Données et fichiers',
    shortcut: 'D',
  },
  {
    id: 'ACTIVE_AGENTS',
    name: 'Active Agents',
    nameFr: 'Agents',
    icon: '🤖',
    description: 'Agents actifs (observation)',
    shortcut: 'A',
  },
  {
    id: 'MEETINGS',
    name: 'Meetings',
    nameFr: 'Réunions',
    icon: '📅',
    description: 'Réunions et calendrier',
    shortcut: 'M',
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// LOADING SKELETON
// ════════════════════════════════════════════════════════════════════════════════

const SkeletonLoader: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div 
    role="status" 
    aria-label="Chargement en cours"
    style={{ padding: '16px' }}
  >
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        style={{
          height: '16px',
          background: 'linear-gradient(90deg, #1B2230 25%, #232B3A 50%, #1B2230 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          marginBottom: '12px',
          width: `${100 - i * 15}%`,
        }}
      />
    ))}
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        [role="status"] div {
          animation: none;
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// SECTION TAB
// ════════════════════════════════════════════════════════════════════════════════

interface SectionTabProps {
  section: BureauSectionConfig;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const SectionTab: React.FC<SectionTabProps> = ({ 
  section, 
  isActive, 
  onClick,
  index,
}) => {
  return (
    <button
      role="tab"
      id={`tab-${section.id}`}
      aria-selected={isActive}
      aria-controls={`panel-${section.id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        border: 'none',
        borderBottom: isActive ? '2px solid #5DA9FF' : '2px solid transparent',
        background: isActive ? '#1B2230' : 'transparent',
        color: isActive ? '#E6EAF0' : '#AEB6C3',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      title={`${section.nameFr} (${section.shortcut})`}
    >
      <span aria-hidden="true">{section.icon}</span>
      <span>{section.nameFr}</span>
      <kbd
        style={{
          fontSize: '10px',
          color: '#525B6B',
          background: '#0F1216',
          padding: '2px 4px',
          borderRadius: '3px',
          marginLeft: '4px',
        }}
        aria-hidden="true"
      >
        {section.shortcut}
      </kbd>
    </button>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION PANEL
// ════════════════════════════════════════════════════════════════════════════════

interface SectionPanelProps {
  section: BureauSectionConfig;
  sphereId: SphereId;
  isActive: boolean;
  children?: React.ReactNode;
}

const SectionPanel: React.FC<SectionPanelProps> = ({
  section,
  sphereId,
  isActive,
  children,
}) => {
  if (!isActive) return null;
  
  return (
    <div
      role="tabpanel"
      id={`panel-${section.id}`}
      aria-labelledby={`tab-${section.id}`}
      tabIndex={0}
      style={{
        padding: '16px',
        minHeight: '300px',
        background: '#151A21',
        borderRadius: '0 0 8px 8px',
      }}
    >
      <Suspense fallback={<SkeletonLoader />}>
        {children || (
          <div style={{ color: '#7A8496', textAlign: 'center', padding: '40px' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '16px' }}>
              {section.icon}
            </span>
            <p>{section.description}</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              Sphère: {sphereId}
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// MAIN BUREAU COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const Bureau: React.FC<BureauProps> = ({
  sphereId,
  activeSection: controlledSection,
  onSectionChange,
  className,
}) => {
  const [internalSection, setInternalSection] = useState<BureauSectionId>('QUICK_CAPTURE');
  
  const activeSection = controlledSection ?? internalSection;
  const setActiveSection = onSectionChange ?? setInternalSection;
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = BUREAU_SECTIONS.findIndex(s => s.id === activeSection);
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % BUREAU_SECTIONS.length;
        setActiveSection(BUREAU_SECTIONS[nextIndex].id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + BUREAU_SECTIONS.length) % BUREAU_SECTIONS.length;
        setActiveSection(BUREAU_SECTIONS[prevIndex].id);
        break;
      case 'Home':
        e.preventDefault();
        setActiveSection(BUREAU_SECTIONS[0].id);
        break;
      case 'End':
        e.preventDefault();
        setActiveSection(BUREAU_SECTIONS[BUREAU_SECTIONS.length - 1].id);
        break;
      default:
        // Shortcut keys
        const section = BUREAU_SECTIONS.find(
          s => s.shortcut.toLowerCase() === e.key.toLowerCase()
        );
        if (section) {
          e.preventDefault();
          setActiveSection(section.id);
        }
    }
  }, [activeSection, setActiveSection]);
  
  return (
    <div 
      className={className}
      style={{ 
        background: '#0F1216', 
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Sections du bureau"
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          overflowX: 'auto',
          background: '#151A21',
          borderBottom: '1px solid #232B3A',
        }}
      >
        {BUREAU_SECTIONS.map((section, index) => (
          <SectionTab
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            index={index}
          />
        ))}
      </div>
      
      {/* Panels */}
      {BUREAU_SECTIONS.map(section => (
        <SectionPanel
          key={section.id}
          section={section}
          sphereId={sphereId}
          isActive={activeSection === section.id}
        />
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// HELPER HOOKS
// ════════════════════════════════════════════════════════════════════════════════

export const useBureauSection = (sphereId: SphereId) => {
  const [activeSection, setActiveSection] = useState<BureauSectionId>('QUICK_CAPTURE');
  
  const goToSection = useCallback((section: BureauSectionId) => {
    setActiveSection(section);
  }, []);
  
  return {
    activeSection,
    setActiveSection: goToSection,
    sections: BUREAU_SECTIONS,
    currentSection: BUREAU_SECTIONS.find(s => s.id === activeSection),
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export { SkeletonLoader };
export default Bureau;
