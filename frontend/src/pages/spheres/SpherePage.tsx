/**
 * CHE·NU™ - SPHERE PAGE
 * Generic page component for any sphere
 * Renders the Bureau with 10 sections
 */

import React from 'react';
import { useSphere } from '../../contexts/SphereContext';
import { SphereId, BureauSectionId, BUREAU_SECTIONS } from '../../constants/spheres';
import { BureauNavigation } from '../../components/navigation/BureauNavigation';
import { BureauContent } from '../../components/bureau/BureauContent';
import { NovaOverlay } from '../../components/core/NovaOverlay';

// ═══════════════════════════════════════════════════════════════
// SPHERE PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface SpherePageProps {
  sphereId: SphereId;
  initialSection?: BureauSectionId;
}

export const SpherePage: React.FC<SpherePageProps> = ({ 
  sphereId,
  initialSection = 'dashboard'
}) => {
  const { 
    activeSphere, 
    activeSection, 
    activeSectionId,
    setSection 
  } = useSphere();

  return (
    <div 
      className="sphere-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#ffffff'
      }}
    >
      {/* Sphere Header */}
      <header 
        className="sphere-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: `2px solid ${activeSphere.color}`,
          background: `linear-gradient(135deg, ${activeSphere.color}15, transparent)`
        }}
      >
        <span style={{ fontSize: '32px', marginRight: '12px' }}>
          {activeSphere.icon}
        </span>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: 600,
            color: activeSphere.color 
          }}>
            {activeSphere.name}
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#888',
            marginTop: '4px'
          }}>
            {activeSphere.description}
          </p>
        </div>
        
        {/* Current Section Badge */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <span>{activeSection.icon}</span>
          <span style={{ fontWeight: 500 }}>{activeSection.name}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div 
        className="sphere-content"
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        {/* Bureau Navigation Sidebar */}
        <BureauNavigation 
          activeSectionId={activeSectionId}
          onSectionChange={setSection}
          sphereColor={activeSphere.color}
        />

        {/* Bureau Section Content */}
        <main 
          className="bureau-content"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px'
          }}
        >
          <BureauContent 
            sphereId={sphereId}
            sectionId={activeSectionId}
          />
        </main>
      </div>

      {/* Nova Overlay - Always Accessible */}
      <NovaOverlay sphereId={sphereId} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL SPHERE PAGES
// ═══════════════════════════════════════════════════════════════

export const PersonalSpherePage: React.FC = () => (
  <SpherePage sphereId="personal" />
);

export const BusinessSpherePage: React.FC = () => (
  <SpherePage sphereId="business" />
);

export const GovernmentSpherePage: React.FC = () => (
  <SpherePage sphereId="government" />
);

export const StudioSpherePage: React.FC = () => (
  <SpherePage sphereId="studio" />
);

export const CommunitySpherePage: React.FC = () => (
  <SpherePage sphereId="community" />
);

export const SocialSpherePage: React.FC = () => (
  <SpherePage sphereId="social" />
);

export const EntertainmentSpherePage: React.FC = () => (
  <SpherePage sphereId="entertainment" />
);

export const TeamSpherePage: React.FC = () => (
  <SpherePage sphereId="team" />
);

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default SpherePage;
