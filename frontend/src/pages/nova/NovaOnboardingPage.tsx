/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA ONBOARDING PAGE                            ║
 * ║                    Page d'onboarding complète avec 7 étapes                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNovaOnboarding } from '../nova/hooks/useNovaOnboarding';
import { NovaDialogue } from '../nova/components/NovaDialogue';
import { NovaThemeSelector } from '../nova/components/NovaThemeSelector';
import { NovaSphereOverview } from '../nova/components/NovaSphereOverview';
import { NovaBureauIntro } from '../nova/components/NovaBureauIntro';
import { NovaAction, NOVA_SCRIPTS } from '../nova/scripts/NovaOnboardingScripts';
import { SPHERES } from '../hooks/useRouterNavigation';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  cenoteTurquoise: '#3EB4A2',
  sacredGold: '#D8B26A',
  uiSlate: '#1E1F22',
  uiDark: '#141416',
  softSand: '#E9E4D6',
  ancientStone: '#8D8371',
  border: '#2A2A2E',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const NovaOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    currentScript,
    progress,
    startOnboarding,
    nextMessage,
    nextScript,
    skipScript,
    selectTheme,
    triggerScript,
    isOnboardingComplete,
    isFirstLogin,
  } = useNovaOnboarding();

  // Auto-start onboarding on first visit
  useEffect(() => {
    if (isFirstLogin && !state.isActive) {
      startOnboarding();
    }
  }, [isFirstLogin, state.isActive, startOnboarding]);

  // Redirect when complete
  useEffect(() => {
    if (isOnboardingComplete) {
      navigate('/personal/dashboard');
    }
  }, [isOnboardingComplete, navigate]);

  // Handle action from dialogue
  const handleAction = useCallback((action: NovaAction) => {
    switch (action.action) {
      case 'continue':
      case 'done':
        nextScript();
        break;
      case 'skip':
        skipScript();
        break;
    }
  }, [nextScript, skipScript]);

  // Handle theme selection
  const handleThemeSelect = useCallback((themeId: string) => {
    selectTheme(themeId);
  }, [selectTheme]);

  // Handle sphere click in overview
  const handleSphereClick = useCallback((sphereId: string) => {
    if (sphereId === 'personal') {
      triggerScript('enter_first_sphere');
    }
  }, [triggerScript]);

  // Get current sphere data for bureau intro
  const personalSphere = SPHERES.find(s => s.id === 'personal');

  // Render content based on current script
  const renderContent = () => {
    if (!currentScript) return null;

    switch (currentScript.id) {
      case 'welcome':
        return (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh',
          }}>
            <div
              style={{
                textAlign: 'center',
                animation: 'fadeIn 1s ease',
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 32px',
                  borderRadius: 32,
                  background: `linear-gradient(135deg, ${COLORS.sacredGold}, ${COLORS.cenoteTurquoise})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 32px ${COLORS.sacredGold}40`,
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <span style={{ fontSize: 56, color: 'white', fontWeight: 700 }}>C·N</span>
              </div>
              <h1
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: COLORS.softSand,
                  marginBottom: 8,
                }}
              >
                CHE<span style={{ color: COLORS.sacredGold }}>·</span>NU
              </h1>
              <p style={{ color: COLORS.ancientStone, fontSize: 14 }}>
                Governed Intelligence Operating System
              </p>
            </div>
          </div>
        );

      case 'theme_selection':
        return (
          <div style={{ padding: 24 }}>
            <h2 style={{ textAlign: 'center', color: COLORS.softSand, marginBottom: 24 }}>
              Choisis ton environnement
            </h2>
            <NovaThemeSelector
              onSelect={handleThemeSelect}
              selectedTheme={state.selectedTheme}
              showLabels={false}
            />
          </div>
        );

      case 'sphere_overview':
        return (
          <div style={{ padding: 24 }}>
            <h2 style={{ textAlign: 'center', color: COLORS.softSand, marginBottom: 24 }}>
              Les 9 Sphères de CHE·NU
            </h2>
            <NovaSphereOverview
              unlockedSpheres={['personal']}
              showDescriptions={true}
            />
          </div>
        );

      case 'sphere_personal':
        return (
          <div style={{ padding: 24 }}>
            <NovaSphereOverview
              unlockedSpheres={['personal']}
              activeSphere="personal"
              onSphereClick={handleSphereClick}
              showDescriptions={false}
              compact={true}
            />
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p style={{ color: COLORS.ancientStone, fontSize: 13 }}>
                Clique sur la sphère 🏠 Personnel pour continuer
              </p>
            </div>
          </div>
        );

      case 'bureau_intro':
        return (
          <div style={{ padding: 24 }}>
            <NovaBureauIntro
              sphereName={personalSphere?.nameFr}
              sphereColor={personalSphere?.color}
              sphereEmoji={personalSphere?.emoji}
              animated={true}
            />
          </div>
        );

      case 'first_task':
        return (
          <div style={{ padding: 24 }}>
            <NovaBureauIntro
              sphereName={personalSphere?.nameFr}
              sphereColor={personalSphere?.color}
              sphereEmoji={personalSphere?.emoji}
              highlightSection="notes"
              animated={false}
            />
          </div>
        );

      case 'free_exploration':
        return (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh',
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 64, display: 'block', marginBottom: 24 }}>🎉</span>
              <h2 style={{ color: COLORS.softSand, marginBottom: 8 }}>
                Bienvenue dans CHE·NU!
              </h2>
              <p style={{ color: COLORS.ancientStone, fontSize: 14 }}>
                Tu es prêt à explorer ton nouvel espace de travail
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.uiDark,
        color: COLORS.softSand,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          height: 4,
          backgroundColor: COLORS.border,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: COLORS.cenoteTurquoise,
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, color: COLORS.cenoteTurquoise }}>✨</span>
          <span style={{ fontSize: 12, color: COLORS.ancientStone }}>
            Onboarding Nova
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, color: COLORS.ancientStone }}>
            {progress}% complété
          </span>
          <button
            onClick={() => navigate('/personal/dashboard')}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              color: COLORS.ancientStone,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Passer
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </main>

      {/* Nova Dialogue */}
      {currentScript && state.isActive && !state.isPaused && (
        <NovaDialogue
          script={currentScript}
          messageIndex={state.messageIndex}
          onNextMessage={nextMessage}
          onAction={handleAction}
          position="bottom-right"
          compact={false}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default NovaOnboardingPage;
