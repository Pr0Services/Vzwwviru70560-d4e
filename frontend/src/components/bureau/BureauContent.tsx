/**
 * CHE·NU™ - BUREAU CONTENT
 * Renders the appropriate content for each Bureau section
 * This is the main content area within a Sphere
 */

import React, { Suspense, lazy } from 'react';
import { SphereId, BureauSectionId, BUREAU_SECTIONS } from '../../constants/spheres';

// ═══════════════════════════════════════════════════════════════
// LAZY LOADED SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Import existing components
import { DashboardSection } from './DashboardSection';
import { NotesSection } from './NotesSection';
import { TasksSection } from './TasksSection';
import { ProjectsSection } from './ProjectsSection';
import { ThreadsSection } from './ThreadsSection';
import { MeetingsSection } from './MeetingsSection';
import { DataSection } from './DataSection';
import { AgentsSection } from './AgentsSection';
import { ReportsSection } from './ReportsSection';
import { BudgetGovernanceSection } from './BudgetGovernanceSection';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface BureauContentProps {
  sphereId: SphereId;
  sectionId: BureauSectionId;
}

// ═══════════════════════════════════════════════════════════════
// LOADING COMPONENT
// ═══════════════════════════════════════════════════════════════

const SectionLoading: React.FC = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: '#666'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #333',
      borderTopColor: '#D8B26A',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
    <p style={{ marginTop: '16px' }}>Loading section...</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SECTION RENDERER
// ═══════════════════════════════════════════════════════════════

export const BureauContent: React.FC<BureauContentProps> = ({
  sphereId,
  sectionId
}) => {
  const section = BUREAU_SECTIONS[sectionId];

  const renderSection = () => {
    switch (sectionId) {
      case 'dashboard':
        return <DashboardSection sphereId={sphereId} />;
      
      case 'notes':
        return <NotesSection sphereId={sphereId} />;
      
      case 'tasks':
        return <TasksSection sphereId={sphereId} />;
      
      case 'projects':
        return <ProjectsSection sphereId={sphereId} />;
      
      case 'threads':
        return <ThreadsSection sphereId={sphereId} />;
      
      case 'meetings':
        return <MeetingsSection sphereId={sphereId} />;
      
      case 'data':
        return <DataSection sphereId={sphereId} />;
      
      case 'agents':
        return <AgentsSection sphereId={sphereId} />;
      
      case 'reports':
        return <ReportsSection sphereId={sphereId} />;
      
      case 'budget':
        return <BudgetGovernanceSection sphereId={sphereId} />;
      
      default:
        return <DefaultSection sectionId={sectionId} sphereId={sphereId} />;
    }
  };

  return (
    <div className="bureau-content-wrapper">
      {/* Section Header */}
      <div style={{
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #222'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '28px' }}>{section.icon}</span>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: 600 
            }}>
              {section.name}
            </h2>
            <p style={{ 
              margin: 0, 
              marginTop: '4px',
              fontSize: '14px', 
              color: '#666' 
            }}>
              {section.description}
            </p>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <Suspense fallback={<SectionLoading />}>
        {renderSection()}
      </Suspense>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DEFAULT SECTION (Fallback)
// ═══════════════════════════════════════════════════════════════

interface DefaultSectionProps {
  sectionId: BureauSectionId;
  sphereId: SphereId;
}

const DefaultSection: React.FC<DefaultSectionProps> = ({ sectionId, sphereId }) => (
  <div style={{
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
    <h3 style={{ margin: 0, marginBottom: '8px', color: '#888' }}>
      Section: {sectionId}
    </h3>
    <p style={{ margin: 0 }}>
      Content for {sectionId} in {sphereId} sphere
    </p>
    <p style={{ margin: 0, marginTop: '24px', fontSize: '13px' }}>
      This section is ready for implementation
    </p>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SECTION WRAPPER (HOC for common functionality)
// ═══════════════════════════════════════════════════════════════

interface SectionWrapperProps {
  sphereId: SphereId;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  sphereId,
  children,
  actions
}) => (
  <div className="section-wrapper">
    {/* Actions Bar */}
    {actions && (
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px'
      }}>
        {actions}
      </div>
    )}
    
    {/* Content */}
    <div className="section-content">
      {children}
    </div>
  </div>
);

export default BureauContent;
