// CHE·NU™ Bureau Page — Sphere Bureau View with 10 Sections

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigationStore, useAuthStore } from '../../stores';
import { CHENU_COLORS, SPHERE_ICONS, SPHERE_COLORS, BUREAU_SECTIONS, type SphereCode, type BureauSection } from '../../types';
import { BureauContent } from '../../components/bureau/BureauSections';
import NovaPanel, { NovaTrigger } from '../../components/core/NovaPanel';

const BureauPage: React.FC = () => {
  const { sphereCode, section } = useParams<{ sphereCode: SphereCode; section?: BureauSection }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { currentSphere, currentSection, setCurrentSphere, setCurrentSection, novaOpen, toggleNova } = useNavigationStore();

  // Sync URL with store
  React.useEffect(() => {
    if (sphereCode && sphereCode !== currentSphere) {
      setCurrentSphere(sphereCode);
    }
    if (section && section !== currentSection) {
      setCurrentSection(section);
    }
  }, [sphereCode, section, currentSphere, currentSection, setCurrentSphere, setCurrentSection]);

  const activeSphere = (sphereCode || currentSphere) as SphereCode;
  const activeSection = (section || currentSection) as BureauSection;
  const sphereName = activeSphere.charAt(0).toUpperCase() + activeSphere.slice(1);

  const handleSphereChange = (code: SphereCode) => {
    setCurrentSphere(code);
    navigate(`/sphere/${code}/dashboard`);
  };

  const handleSectionChange = (sec: BureauSection) => {
    setCurrentSection(sec);
    navigate(`/sphere/${activeSphere}/${sec}`);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: CHENU_COLORS.uiSlate,
    }}>
      {/* Sphere Sidebar (Left) */}
      <div style={{
        width: '80px',
        backgroundColor: '#0a0a0b',
        borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
      }}>
        <div 
          onClick={() => navigate('/')}
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: CHENU_COLORS.sacredGold,
            marginBottom: '32px',
            cursor: 'pointer',
          }}
        >
          C
        </div>
        
        {(Object.keys(SPHERE_ICONS) as SphereCode[]).map((code) => (
          <button
            key={code}
            onClick={() => handleSphereChange(code)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeSphere === code ? SPHERE_COLORS[code] : 'transparent',
              cursor: 'pointer',
              fontSize: '20px',
              marginBottom: '8px',
              opacity: activeSphere === code ? 1 : 0.6,
              transform: activeSphere === code ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          >
            {SPHERE_ICONS[code]}
          </button>
        ))}
        
        <div style={{ flex: 1 }} />
        
        <button
          onClick={toggleNova}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: novaOpen ? CHENU_COLORS.cenoteTurquoise : 'transparent',
            cursor: 'pointer',
            fontSize: '20px',
            opacity: novaOpen ? 1 : 0.6,
          }}
        >
          ✨
        </button>
      </div>

      {/* Bureau Section Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: '#111113',
        borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
        padding: '24px 16px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <span style={{ fontSize: '24px' }}>{SPHERE_ICONS[activeSphere]}</span>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
              {sphereName}
            </h2>
            <p style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>Bureau</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {BUREAU_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleSectionChange(sec.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeSection === sec.id ? CHENU_COLORS.sacredGold + '22' : 'transparent',
                color: activeSection === sec.id ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                fontWeight: activeSection === sec.id ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              <span>{sec.icon}</span>
              <span>{sec.name_en}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: '64px',
          backgroundColor: '#111113',
          borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>{SPHERE_ICONS[activeSphere]}</span>
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
              {sphereName} — {BUREAU_SECTIONS.find(s => s.id === activeSection)?.name_en}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '14px' }}>
              {user?.email}
            </span>
            <button
              onClick={() => navigate('/settings')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${CHENU_COLORS.ancientStone}44`,
                backgroundColor: 'transparent',
                color: CHENU_COLORS.softSand,
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Settings
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <BureauContent section={activeSection} />
        </main>
      </div>

      {/* Nova Panel */}
      <NovaPanel
        isOpen={novaOpen}
        onClose={toggleNova}
        context={{ sphere: activeSphere, section: activeSection, recentActions: [] }}
        onNavigate={(sphere, sec) => navigate(`/sphere/${sphere}/${sec}`)}
      />
      
      {!novaOpen && <NovaTrigger onClick={toggleNova} />}
    </div>
  );
};

export default BureauPage;
