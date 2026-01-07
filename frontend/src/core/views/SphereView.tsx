/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — SPHERE VIEW                                  ║
 * ║                       Vue Bureau - Intérieur d'une Sphère                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Vue intérieure d'une sphère CHE·NU avec les 6 sections du Bureau:
 * 1. Dashboard
 * 2. Notes  
 * 3. Tasks
 * 4. Projects
 * 5. Threads (.chenu)
 * 6. Meetings
 * 
 * + Sections additionnelles selon contexte:
 * - Data / Database
 * - Agents
 * - Reports / History
 * - Budget & Governance
 * 
 * @version 2.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

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

interface BureauSection {
  id: BureauSectionId;
  label: string;
  labelFr: string;
  icon: string;
  description: string;
  itemCount?: number;
  isCore: boolean; // Les 6 sections principales
}

interface SphereConfig {
  id: SphereId;
  label: string;
  labelFr: string;
  color: string;
  icon: string;
}

export interface SphereViewProps {
  /** ID de la sphère */
  sphereId: SphereId;
  /** Section active */
  activeSection?: BureauSectionId;
  /** Données des sections */
  sectionData?: Partial<Record<BureauSectionId, { itemCount?: number; hasUpdates?: boolean }>>;
  /** Afficher les sections étendues (Data, Agents, etc.) */
  showExtendedSections?: boolean;
  /** Callbacks */
  onSectionClick?: (sectionId: BureauSectionId) => void;
  onBackToUniverse?: () => void;
  /** Mode d'affichage */
  layout?: 'grid' | 'list' | 'cards';
  /** Dimensions */
  width?: number;
  height?: number;
  /** Classes CSS */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const SPHERE_CONFIGS: Record<SphereId, SphereConfig> = {
  personal:      { id: 'personal',      label: 'Personal',      labelFr: 'Personnel',    color: '#3EB4A2', icon: '🏠' },
  business:      { id: 'business',      label: 'Business',      labelFr: 'Business',     color: '#D8B26A', icon: '💼' },
  government:    { id: 'government',    label: 'Government',    labelFr: 'Institutions', color: '#8D8371', icon: '🏛️' },
  studio:        { id: 'design_studio',        label: 'Studio',        labelFr: 'Studio',       color: '#7A593A', icon: '🎨' },
  community:     { id: 'community',     label: 'Community',     labelFr: 'Communauté',   color: '#3F7249', icon: '👥' },
  social:        { id: 'social',        label: 'Social',        labelFr: 'Social',       color: '#2F4C39', icon: '📱' },
  entertainment: { id: 'entertainment', label: 'Entertainment', labelFr: 'Loisirs',      color: '#E9E4D6', icon: '🎬' },
  team:          { id: 'my_team',          label: 'Team',          labelFr: 'Équipe',       color: '#5ED8FF', icon: '🤝' },
  scholar:       { id: 'scholars',       label: 'Scholar',       labelFr: 'Savoir',       color: '#9B59B6', icon: '📚' },
};

const BUREAU_SECTIONS: BureauSection[] = [
  // 6 Sections principales (CORE)
  { id: 'dashboard', label: 'Dashboard',  labelFr: 'Tableau de bord', icon: '📊', description: 'Vue d\'ensemble et métriques', isCore: true },
  { id: 'notes',     label: 'Notes',      labelFr: 'Notes',           icon: '📝', description: 'Capture rapide et organisation', isCore: true },
  { id: 'tasks',     label: 'Tasks',      labelFr: 'Tâches',          icon: '✅', description: 'Gestion des tâches et to-dos', isCore: true },
  { id: 'projects',  label: 'Projects',   labelFr: 'Projets',         icon: '📁', description: 'Projets et initiatives', isCore: true },
  { id: 'threads',   label: 'Threads',    labelFr: 'Threads',         icon: '🧵', description: 'Fils de discussion .chenu', isCore: true },
  { id: 'meetings',  label: 'Meetings',   labelFr: 'Réunions',        icon: '📅', description: 'Calendrier et réunions', isCore: true },
  // Sections étendues
  { id: 'data',      label: 'Data',       labelFr: 'Données',         icon: '🗄️', description: 'Base de données et fichiers', isCore: false },
  { id: 'agents',    label: 'Agents',     labelFr: 'Agents',          icon: '🤖', description: 'Agents IA actifs', isCore: false },
  { id: 'reports',   label: 'Reports',    labelFr: 'Rapports',        icon: '📈', description: 'Historique et rapports', isCore: false },
  { id: 'budget',    label: 'Budget',     labelFr: 'Budget',          icon: '💰', description: 'Gouvernance et tokens', isCore: false },
];

const COLORS = {
  gold: '#D8B26A',
  turquoise: '#3EB4A2',
  emerald: '#3F7249',
  bgDark: '#0a0a0c',
  bgCard: '#151A18',
  bgCardHover: '#1a201e',
  border: '#2A3530',
  borderActive: '#3EB4A2',
  textPrimary: '#E8E4DD',
  textSecondary: '#888888',
  textMuted: '#555555',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: SECTION CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionCardProps {
  section: BureauSection;
  sphereColor: string;
  isActive: boolean;
  itemCount?: number;
  hasUpdates?: boolean;
  onClick: () => void;
  layout: 'grid' | 'list' | 'cards';
}

const SectionCard: React.FC<SectionCardProps> = ({
  section, sphereColor, isActive, itemCount, hasUpdates, onClick, layout,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (layout === 'list') {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          width: '100%',
          padding: '16px 20px',
          backgroundColor: isActive ? `${sphereColor}15` : isHovered ? COLORS.bgCardHover : COLORS.bgCard,
          border: `1px solid ${isActive ? sphereColor : COLORS.border}`,
          borderRadius: 12,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 24 }}>{section.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.textPrimary }}>
            {section.labelFr}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textSecondary }}>
            {section.description}
          </div>
        </div>
        {itemCount !== undefined && itemCount > 0 && (
          <span style={{
            padding: '4px 10px',
            backgroundColor: `${sphereColor}22`,
            color: sphereColor,
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 12,
          }}>
            {itemCount}
          </span>
        )}
        {hasUpdates && (
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: COLORS.turquoise,
          }} />
        )}
      </button>
    );
  }

  // Grid/Cards layout
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: layout === 'cards' ? 24 : 20,
        backgroundColor: isActive ? `${sphereColor}15` : isHovered ? COLORS.bgCardHover : COLORS.bgCard,
        border: `1px solid ${isActive ? sphereColor : isHovered ? `${sphereColor}66` : COLORS.border}`,
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
        minHeight: layout === 'cards' ? 160 : 120,
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered ? `0 8px 24px ${sphereColor}22` : 'none',
      }}
    >
      {/* Update indicator */}
      {hasUpdates && (
        <span style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: COLORS.turquoise,
          boxShadow: `0 0 8px ${COLORS.turquoise}`,
        }} />
      )}

      {/* Icon */}
      <span style={{ 
        fontSize: layout === 'cards' ? 36 : 28,
        filter: isActive ? `drop-shadow(0 0 8px ${sphereColor})` : 'none',
      }}>
        {section.icon}
      </span>

      {/* Label */}
      <span style={{
        fontSize: 14,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? sphereColor : COLORS.textPrimary,
      }}>
        {section.labelFr}
      </span>

      {/* Count badge */}
      {itemCount !== undefined && itemCount > 0 && (
        <span style={{
          position: 'absolute',
          top: 12,
          left: 12,
          padding: '2px 8px',
          backgroundColor: `${sphereColor}22`,
          color: sphereColor,
          fontSize: 11,
          fontWeight: 600,
          borderRadius: 10,
        }}>
          {itemCount}
        </span>
      )}

      {/* Description on hover */}
      {layout === 'cards' && isHovered && (
        <span style={{
          fontSize: 11,
          color: COLORS.textSecondary,
          textAlign: 'center',
          maxWidth: '90%',
        }}>
          {section.description}
        </span>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: SPHERE HEADER
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereHeaderProps {
  sphere: SphereConfig;
  onBack?: () => void;
}

const SphereHeader: React.FC<SphereHeaderProps> = ({ sphere, onBack }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: `1px solid ${COLORS.border}`,
        background: `linear-gradient(135deg, ${sphere.color}11 0%, transparent 100%)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.bgCard,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textSecondary,
              fontSize: 18,
              transition: 'all 0.2s',
            }}
            aria-label="Retour à l'univers"
          >
            ←
          </button>
        )}

        {/* Sphere icon and title */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: `${sphere.color}22`,
            border: `2px solid ${sphere.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          {sphere.icon}
        </div>
        
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 600,
            color: COLORS.textPrimary,
          }}>
            {sphere.labelFr}
          </h1>
          <p style={{
            margin: 0,
            fontSize: 13,
            color: COLORS.textSecondary,
          }}>
            Bureau • 6 sections
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.bgCard,
            color: COLORS.textSecondary,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          🔍 Rechercher
        </button>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: sphere.color,
            color: COLORS.bgDark,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Nouveau
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: LAYOUT TOGGLE
// ═══════════════════════════════════════════════════════════════════════════════

interface LayoutToggleProps {
  layout: 'grid' | 'list' | 'cards';
  onChange: (layout: 'grid' | 'list' | 'cards') => void;
}

const LayoutToggle: React.FC<LayoutToggleProps> = ({ layout, onChange }) => {
  const options: Array<{ value: 'grid' | 'list' | 'cards'; icon: string }> = [
    { value: 'grid', icon: '▦' },
    { value: 'cards', icon: '▢' },
    { value: 'list', icon: '☰' },
  ];

  return (
    <div style={{
      display: 'flex',
      backgroundColor: COLORS.bgCard,
      borderRadius: 8,
      padding: 4,
      border: `1px solid ${COLORS.border}`,
    }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            width: 32,
            height: 28,
            borderRadius: 6,
            border: 'none',
            backgroundColor: layout === opt.value ? COLORS.turquoise : 'transparent',
            color: layout === opt.value ? COLORS.bgDark : COLORS.textSecondary,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s',
          }}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL: SPHERE VIEW
// ═══════════════════════════════════════════════════════════════════════════════

export const SphereView: React.FC<SphereViewProps> = ({
  sphereId,
  activeSection,
  sectionData = {},
  showExtendedSections = false,
  onSectionClick,
  onBackToUniverse,
  layout: initialLayout = 'grid',
  width = 1000,
  height = 700,
  className,
}) => {
  const [layout, setLayout] = useState<'grid' | 'list' | 'cards'>(initialLayout);
  
  const sphere = SPHERE_CONFIGS[sphereId];
  
  // Filter sections based on showExtendedSections
  const sections = useMemo(() => {
    if (showExtendedSections) return BUREAU_SECTIONS;
    return BUREAU_SECTIONS.filter(s => s.isCore);
  }, [showExtendedSections]);

  // Grid columns based on layout
  const gridColumns = layout === 'grid' ? 3 : layout === 'cards' ? 2 : 1;

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: COLORS.bgDark,
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <SphereHeader sphere={sphere} onBack={onBackToUniverse} />

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: COLORS.textSecondary }}>
            {sections.length} sections
          </span>
          {!showExtendedSections && (
            <button
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: `1px solid ${COLORS.border}`,
                backgroundColor: 'transparent',
                color: COLORS.textSecondary,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              + Voir plus
            </button>
          )}
        </div>
        
        <LayoutToggle layout={layout} onChange={setLayout} />
      </div>

      {/* Sections Grid */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: layout === 'list' ? 12 : 16,
          }}
        >
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              sphereColor={sphere.color}
              isActive={activeSection === section.id}
              itemCount={sectionData[section.id]?.itemCount}
              hasUpdates={sectionData[section.id]?.hasUpdates}
              onClick={() => onSectionClick?.(section.id)}
              layout={layout}
            />
          ))}
        </div>

        {/* Core vs Extended separator */}
        {showExtendedSections && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              margin: '24px 0',
              color: COLORS.textMuted,
              fontSize: 12,
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <span>Sections étendues</span>
            <div style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: `1px solid ${COLORS.border}`,
          backgroundColor: `${COLORS.bgCard}88`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Tâches actives</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: sphere.color }}>
              {sectionData.tasks?.itemCount || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Projets</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.textPrimary }}>
              {sectionData.projects?.itemCount || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Threads</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.textPrimary }}>
              {sectionData.threads?.itemCount || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.textSecondary, fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.turquoise }} />
          Nova active
        </div>
      </div>
    </div>
  );
};

export default SphereView;
