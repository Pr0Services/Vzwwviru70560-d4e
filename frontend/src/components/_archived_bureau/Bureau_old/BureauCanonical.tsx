/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BUREAU CANONICAL COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLE FONDAMENTALE:
 * Chaque SPHÈRE ouvre un BUREAU complet.
 * Tous les BUREAUX partagent la MÊME STRUCTURE.
 * 
 * STRUCTURE CANONIQUE (10 SECTIONS MAX):
 * 1. Dashboard
 * 2. Notes
 * 3. Tasks
 * 4. Projects
 * 5. Threads (.chenu)
 * 6. Meetings
 * 7. Data / Database
 * 8. Agents
 * 9. Reports / History
 * 10. Budget & Governance
 * 
 * Seul le CONTENU, les PERMISSIONS et les AGENTS varient.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { SphereId, SphereNode, ALL_SPHERES } from '../../canonical/SPHERES_CANONICAL_V2';

// Bureau Section Types
export type BureauSectionId = 
  | 'dashboard'
  | 'notes'
  | 'tasks'
  | 'projects'
  | 'threads'
  | 'meetings'
  | 'data'
  | 'agents'
  | 'reports'
  | 'budget';

export interface BureauSection {
  id: BureauSectionId;
  label: string;
  labelFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
}

// CANONICAL BUREAU SECTIONS - NEVER CHANGES
export const BUREAU_SECTIONS: BureauSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelFr: 'Tableau de bord',
    icon: '📊',
    description: 'Overview and quick actions',
    descriptionFr: 'Vue d\'ensemble et actions rapides'
  },
  {
    id: 'notes',
    label: 'Notes',
    labelFr: 'Notes',
    icon: '📝',
    description: 'Quick notes and ideas',
    descriptionFr: 'Notes rapides et idées'
  },
  {
    id: 'tasks',
    label: 'Tasks',
    labelFr: 'Tâches',
    icon: '✓',
    description: 'Task management',
    descriptionFr: 'Gestion des tâches'
  },
  {
    id: 'projects',
    label: 'Projects',
    labelFr: 'Projets',
    icon: '📁',
    description: 'Project organization',
    descriptionFr: 'Organisation des projets'
  },
  {
    id: 'threads',
    label: 'Threads',
    labelFr: 'Fils (.chenu)',
    icon: '🧵',
    description: 'Persistent thought lines',
    descriptionFr: 'Lignes de pensée persistantes'
  },
  {
    id: 'meetings',
    label: 'Meetings',
    labelFr: 'Meetings',
    icon: '👥',
    description: 'Meeting spaces',
    descriptionFr: 'Espaces de réunion'
  },
  {
    id: 'data',
    label: 'Data',
    labelFr: 'Données',
    icon: '🗄️',
    description: 'Database and files',
    descriptionFr: 'Base de données et fichiers'
  },
  {
    id: 'agents',
    label: 'Agents',
    labelFr: 'Agents',
    icon: '🤖',
    description: 'AI agents management',
    descriptionFr: 'Gestion des agents IA'
  },
  {
    id: 'reports',
    label: 'Reports',
    labelFr: 'Rapports',
    icon: '📈',
    description: 'History and reports',
    descriptionFr: 'Historique et rapports'
  },
  {
    id: 'budget',
    label: 'Budget',
    labelFr: 'Budget & Gouvernance',
    icon: '💰',
    description: 'Token budget and governance',
    descriptionFr: 'Budget tokens et gouvernance'
  }
];

interface BureauCanonicalProps {
  sphereId: SphereId;
  userId: string;
  activeSection?: BureauSectionId;
  onSectionChange: (sectionId: BureauSectionId) => void;
  onBack: () => void;
  language?: 'en' | 'fr';
  children?: React.ReactNode;
}

export const BureauCanonical: React.FC<BureauCanonicalProps> = ({
  sphereId,
  userId,
  activeSection = 'dashboard',
  onSectionChange,
  onBack,
  language = 'fr',
  children
}) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // Get sphere data
  const sphere = useMemo(
    () => ALL_SPHERES.find(s => s.id === sphereId),
    [sphereId]
  );

  if (!sphere) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#8D8371' }}>
        {language === 'fr' ? 'Sphère non trouvée' : 'Sphere not found'}
      </div>
    );
  }

  const labels = {
    en: {
      back: 'Back to Universe',
      bureau: 'Bureau',
      sections: 'Sections'
    },
    fr: {
      back: 'Retour à l\'Univers',
      bureau: 'Bureau',
      sections: 'Sections'
    }
  };

  const t = labels[language];

  return (
    <div
      className="bureau-canonical"
      style={{
        display: 'flex',
        height: '100%',
        background: '#1E1F22',
        color: '#E9E4D6'
      }}
    >
      {/* Sidebar Navigation */}
      <nav
        style={{
          width: isNavCollapsed ? '60px' : '240px',
          background: '#2A2B2E',
          borderRight: '1px solid #3A3B3E',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease'
        }}
      >
        {/* Bureau Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #3A3B3E'
          }}
        >
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'transparent',
              border: '1px solid #3A3B3E',
              borderRadius: '6px',
              color: '#8D8371',
              cursor: 'pointer',
              fontSize: '12px',
              width: '100%',
              marginBottom: '12px'
            }}
          >
            ← {!isNavCollapsed && t.back}
          </button>

          {/* Sphere indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span
              style={{
                fontSize: '24px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: sphere.visual.color,
                borderRadius: '10px'
              }}
            >
              {sphere.visual.emoji}
            </span>
            {!isNavCollapsed && (
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {language === 'fr' ? sphere.labelFr : sphere.label}
                </div>
                <div style={{ fontSize: '11px', color: '#8D8371' }}>
                  {t.bureau}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Navigation */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '12px 8px'
          }}
        >
          {!isNavCollapsed && (
            <div
              style={{
                fontSize: '10px',
                color: '#8D8371',
                padding: '8px 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {t.sections}
            </div>
          )}

          {BUREAU_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: isNavCollapsed ? '12px' : '10px 12px',
                background: activeSection === section.id ? '#3A3B3E' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: activeSection === section.id ? '#E9E4D6' : '#8D8371',
                cursor: 'pointer',
                marginBottom: '4px',
                justifyContent: isNavCollapsed ? 'center' : 'flex-start',
                transition: 'all 0.2s ease'
              }}
              title={isNavCollapsed ? (language === 'fr' ? section.labelFr : section.label) : undefined}
            >
              <span style={{ fontSize: '16px' }}>{section.icon}</span>
              {!isNavCollapsed && (
                <span style={{ fontSize: '13px' }}>
                  {language === 'fr' ? section.labelFr : section.label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          style={{
            padding: '12px',
            background: 'transparent',
            border: 'none',
            borderTop: '1px solid #3A3B3E',
            color: '#8D8371',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {isNavCollapsed ? '→' : '←'}
        </button>
      </nav>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Section Header */}
        <header
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #3A3B3E',
            background: '#2A2B2E'
          }}
        >
          {(() => {
            const currentSection = BUREAU_SECTIONS.find(s => s.id === activeSection);
            return currentSection ? (
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{currentSection.icon}</span>
                  {language === 'fr' ? currentSection.labelFr : currentSection.label}
                </h2>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '13px',
                    color: '#8D8371'
                  }}
                >
                  {language === 'fr' ? currentSection.descriptionFr : currentSection.description}
                </p>
              </div>
            ) : null;
          })()}
        </header>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px'
          }}
        >
          {children || (
            <BureauSectionContent
              sphereId={sphereId}
              sectionId={activeSection}
              language={language}
            />
          )}
        </div>
      </main>
    </div>
  );
};

// Default Section Content Component
const BureauSectionContent: React.FC<{
  sphereId: SphereId;
  sectionId: BureauSectionId;
  language: 'en' | 'fr';
}> = ({ sphereId, sectionId, language }) => {
  const section = BUREAU_SECTIONS.find(s => s.id === sectionId);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center'
      }}
    >
      <span style={{ fontSize: '48px', marginBottom: '16px' }}>
        {section?.icon}
      </span>
      <h3 style={{ margin: '0 0 8px 0', color: '#E9E4D6' }}>
        {language === 'fr' ? section?.labelFr : section?.label}
      </h3>
      <p style={{ color: '#8D8371', fontSize: '14px' }}>
        {language === 'fr'
          ? `Section ${section?.labelFr} pour la sphère ${sphereId}`
          : `${section?.label} section for ${sphereId} sphere`
        }
      </p>
    </div>
  );
};

export default BureauCanonical;
