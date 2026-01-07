/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — CANONICAL ONBOARDING WIZARD
 * Governed Intelligence Operating System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ⚠️ DIRECTIVE ABSOLUE:
 * - NE PAS changer l'ordre des états
 * - NE PAS fusionner des hubs
 * - NE PAS accélérer ou supprimer l'onboarding
 * - NE PAS centraliser les données sans validation utilisateur
 * 
 * ✅ RESPECTER:
 * - State machine formelle (6 états)
 * - Script Nova officiel
 * - 3 Hubs immutables
 * - Sensation de calme, maîtrise, confiance
 * 
 * @version 3.0.0 - Canonique Final
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  CANONICAL_COLORS,
  SPHERE_COLORS_CANONICAL,
  HUBS_CANONICAL,
  STATE_MACHINE,
  NOVA_SCRIPT,
  SPHERES_CANONICAL,
  VISUAL_THEMES,
  FUNDAMENTAL_LAWS,
} from '../constants/ui.canonical';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type OnboardingState = keyof typeof STATE_MACHINE;

interface OnboardingData {
  selectedTheme: string | null;
  personalNotes: string;
  personalGoals: string[];
  activatedSpheres: string[];
}

interface CanonicalOnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  initialState?: OnboardingState;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS (Canoniques)
// ═══════════════════════════════════════════════════════════════════════════════

const C = CANONICAL_COLORS;

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES (Palette canonique - bleu nuit profond, cyan, ambre)
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  // Container principal
  container: {
    minHeight: '100vh',
    background: `linear-gradient(180deg, ${C.background.primary} 0%, ${C.background.secondary} 100%)`,
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Background avec glow subtil
  backgroundGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '800px',
    background: `radial-gradient(circle, ${C.accent.primaryMuted} 0%, transparent 70%)`,
    pointerEvents: 'none',
  },
  
  // Header minimal
  header: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px 32px',
  },
  logo: {
    fontSize: 24,
    fontWeight: 700,
    color: C.accent.primary,
    letterSpacing: 4,
  },
  
  // Contenu principal
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '0 32px',
  },
  
  // Nova container
  novaContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    maxWidth: 600,
    textAlign: 'center',
  },
  novaAvatar: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  novaGlow: {
    position: 'absolute',
    inset: -10,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${C.accent.primaryMuted} 0%, transparent 70%)`,
    animation: 'pulse 3s ease-in-out infinite',
  },
  novaCore: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${C.accent.primary} 0%, ${C.accent.primaryBright} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    boxShadow: C.glow.cyan,
  },
  novaText: {
    fontSize: 18,
    lineHeight: 1.8,
    color: C.text.primary,
    fontWeight: 300,
  },
  novaTextHighlight: {
    color: C.accent.primary,
    fontWeight: 500,
  },
  
  // Card générique
  card: {
    background: C.background.tertiary,
    borderRadius: 16,
    border: `1px solid ${C.border.subtle}`,
    padding: 32,
    maxWidth: 500,
    width: '100%',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: C.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: C.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  
  // Thèmes (scroll horizontal)
  themesContainer: {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    padding: '16px 0',
    scrollSnapType: 'x mandatory',
    width: '100%',
    maxWidth: 800,
  },
  themeCard: {
    flex: '0 0 200px',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    scrollSnapAlign: 'center',
    position: 'relative',
    border: `2px solid transparent`,
  },
  themeCardSelected: {
    border: `2px solid ${C.accent.primary}`,
    boxShadow: C.glow.cyan,
  },
  themeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  themePlaceholder: {
    width: '100%',
    height: '100%',
    background: `linear-gradient(135deg, ${C.background.tertiary} 0%, ${C.background.elevated} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
  },
  themeSelectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: C.accent.primary,
    color: C.text.inverse,
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  
  // Sphères
  spheresGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 600,
  },
  sphereCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    background: C.background.tertiary,
    borderRadius: 12,
    border: `1px solid ${C.border.subtle}`,
    transition: 'all 0.5s ease',
    opacity: 0.3,
  },
  sphereCardVisible: {
    opacity: 1,
    border: `1px solid ${C.border.default}`,
  },
  sphereCardActive: {
    border: `2px solid`,
    boxShadow: '0 0 20px rgba(46, 211, 198, 0.2)',
  },
  sphereEmoji: {
    fontSize: 32,
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  sphereName: {
    fontSize: 16,
    fontWeight: 600,
    color: C.text.primary,
    marginBottom: 2,
  },
  sphereDesc: {
    fontSize: 13,
    color: C.text.secondary,
    lineHeight: 1.4,
  },
  sphereLocked: {
    marginLeft: 'auto',
    fontSize: 18,
    opacity: 0.5,
  },
  
  // Personal Init
  personalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: '100%',
    maxWidth: 500,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: C.text.primary,
  },
  input: {
    padding: '12px 16px',
    background: C.background.secondary,
    border: `1px solid ${C.border.subtle}`,
    borderRadius: 8,
    color: C.text.primary,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '12px 16px',
    background: C.background.secondary,
    border: `1px solid ${C.border.subtle}`,
    borderRadius: 8,
    color: C.text.primary,
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    minHeight: 100,
  },
  skipButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: 'none',
    color: C.text.muted,
    fontSize: 13,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  
  // Dashboard activation
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 12,
    width: '100%',
    maxWidth: 600,
  },
  dashboardCard: {
    padding: 20,
    background: C.background.tertiary,
    borderRadius: 12,
    border: `2px solid transparent`,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  dashboardCardActive: {
    border: `2px solid`,
  },
  dashboardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  dashboardName: {
    fontSize: 12,
    fontWeight: 600,
    color: C.text.primary,
  },
  
  // Navigation
  navigation: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    padding: '20px 32px',
    background: `linear-gradient(180deg, transparent 0%, ${C.background.primary}FA 50%)`,
    zIndex: 100,
  },
  continueBtn: {
    padding: '14px 32px',
    background: `linear-gradient(135deg, ${C.accent.primary} 0%, ${C.accent.primaryBright} 100%)`,
    border: 'none',
    borderRadius: 10,
    color: C.text.inverse,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: C.glow.soft,
  },
  skipLink: {
    padding: '14px 24px',
    background: 'transparent',
    border: `1px solid ${C.border.default}`,
    borderRadius: 10,
    color: C.text.secondary,
    fontSize: 14,
    cursor: 'pointer',
  },
  
  // Pause indicator
  pauseIndicator: {
    width: 40,
    height: 4,
    background: C.border.subtle,
    borderRadius: 2,
    margin: '24px auto',
    position: 'relative',
    overflow: 'hidden',
  },
  pauseProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    background: C.accent.primary,
    borderRadius: 2,
    animation: 'progress 2s ease-out forwards',
  },
  
  // State indicator
  stateIndicator: {
    position: 'absolute',
    top: 24,
    right: 32,
    display: 'flex',
    gap: 8,
  },
  stateDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    transition: 'all 0.3s',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA TEXT COMPONENT (Animation de frappe)
// ═══════════════════════════════════════════════════════════════════════════════

const NovaText: React.FC<{ 
  lines: readonly string[]; 
  onComplete?: () => void;
  speed?: number;
}> = ({ lines, onComplete, speed = 40 }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }
    
    const currentLine = lines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(c => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLineIndex(i => i + 1);
        setCurrentCharIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines, onComplete, speed]);
  
  return (
    <div style={styles.novaText}>
      {displayedLines.map((line, i) => (
        <p key={i} style={{ margin: '0 0 12px 0' }}>
          {line}
          {i === currentLineIndex && !isComplete && (
            <span style={{ color: C.accent.primary, animation: 'blink 1s infinite' }}>▊</span>
          )}
        </p>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const CanonicalOnboardingWizard: React.FC<CanonicalOnboardingWizardProps> = ({
  onComplete,
  initialState = 'STATE_PRE_ACCOUNT',
}) => {
  // State machine
  const [currentState, setCurrentState] = useState<OnboardingState>(initialState);
  const [canProceed, setCanProceed] = useState(false);
  
  // Data
  const [data, setData] = useState<OnboardingData>({
    selectedTheme: null,
    personalNotes: '',
    personalGoals: [],
    activatedSpheres: ['personnel'], // Personnel toujours actif
  });
  
  // UI state
  const [visibleSphereIndex, setVisibleSphereIndex] = useState(0);
  const [novaComplete, setNovaComplete] = useState(false);
  
  // Transition vers l'état suivant
  const goToNextState = useCallback(() => {
    const current = STATE_MACHINE[currentState];
    if (current.next) {
      setCurrentState(current.next as OnboardingState);
      setCanProceed(false);
      setNovaComplete(false);
      setVisibleSphereIndex(0);
    }
  }, [currentState]);
  
  // Handle completion
  const handleComplete = () => {
    onComplete(data);
  };
  
  // Animation des sphères
  useEffect(() => {
    if (currentState === 'STATE_ONBOARDING_SPHERES' && novaComplete) {
      if (visibleSphereIndex < SPHERES_CANONICAL.length) {
        const timer = setTimeout(() => {
          setVisibleSphereIndex(i => i + 1);
        }, 400);
        return () => clearTimeout(timer);
      } else {
        setCanProceed(true);
      }
    }
  }, [currentState, novaComplete, visibleSphereIndex]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER: STATE_PRE_ACCOUNT
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const renderPreAccount = () => (
    <div style={styles.novaContainer}>
      <div style={styles.novaAvatar}>
        <div style={styles.novaGlow} />
        <div style={styles.novaCore}>✦</div>
      </div>
      
      <NovaText 
        lines={NOVA_SCRIPT.welcome.lines}
        onComplete={() => setCanProceed(true)}
      />
      
      {canProceed && (
        <div style={styles.pauseIndicator}>
          <div style={styles.pauseProgress} />
        </div>
      )}
    </div>
  );
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER: STATE_ONBOARDING_THEME
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const renderThemeSelection = () => (
    <div style={styles.novaContainer}>
      <div style={styles.novaAvatar}>
        <div style={styles.novaGlow} />
        <div style={styles.novaCore}>✦</div>
      </div>
      
      {!novaComplete ? (
        <NovaText 
          lines={[...NOVA_SCRIPT.theme_intro.lines, ...NOVA_SCRIPT.theme_selection.lines]}
          onComplete={() => setNovaComplete(true)}
        />
      ) : (
        <>
          <p style={{ ...styles.novaText, marginBottom: 24 }}>
            {NOVA_SCRIPT.theme_selection.lines[0]}
          </p>
          
          {/* Scroll horizontal des thèmes - SANS LABELS */}
          <div style={styles.themesContainer}>
            {VISUAL_THEMES.map((theme, index) => (
              <div
                key={theme.id}
                style={{
                  ...styles.themeCard,
                  ...(data.selectedTheme === theme.id ? styles.themeCardSelected : {}),
                }}
                onClick={() => {
                  setData(d => ({ ...d, selectedTheme: theme.id }));
                  setCanProceed(true);
                }}
              >
                <div style={styles.themePlaceholder}>
                  {['🏛️', '🌳', '🌐', '✨'][index]}
                </div>
                {data.selectedTheme === theme.id && (
                  <div style={styles.themeSelectedBadge}>✓</div>
                )}
              </div>
            ))}
          </div>
          
          <p style={{ ...styles.novaText, fontSize: 14, color: C.text.muted, marginTop: 12 }}>
            {NOVA_SCRIPT.theme_selection.lines[2]}
          </p>
        </>
      )}
    </div>
  );
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER: STATE_ONBOARDING_SPHERES
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const renderSpheresIntro = () => (
    <div style={styles.novaContainer}>
      <div style={styles.novaAvatar}>
        <div style={styles.novaGlow} />
        <div style={styles.novaCore}>✦</div>
      </div>
      
      {!novaComplete ? (
        <NovaText 
          lines={[...NOVA_SCRIPT.spheres_intro.lines, ...NOVA_SCRIPT.spheres_start.lines]}
          onComplete={() => setNovaComplete(true)}
        />
      ) : (
        <>
          <p style={{ ...styles.novaText, marginBottom: 24 }}>
            Les 8 sphères de ton univers:
          </p>
          
          <div style={styles.spheresGrid}>
            {SPHERES_CANONICAL.map((sphere, index) => (
              <div
                key={sphere.id}
                style={{
                  ...styles.sphereCard,
                  ...(index < visibleSphereIndex ? styles.sphereCardVisible : {}),
                  ...(sphere.isStartingSphere && index < visibleSphereIndex ? {
                    ...styles.sphereCardActive,
                    borderColor: sphere.color,
                  } : {}),
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                <div style={{
                  ...styles.sphereEmoji,
                  background: `${sphere.color}20`,
                }}>
                  {sphere.emoji}
                </div>
                <div>
                  <div style={styles.sphereName}>{sphere.name}</div>
                  <div style={styles.sphereDesc}>{sphere.descriptionFr}</div>
                </div>
                {!sphere.isStartingSphere && (
                  <div style={styles.sphereLocked}>🔒</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER: STATE_PERSONAL_INIT
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const renderPersonalInit = () => (
    <div style={styles.novaContainer}>
      <div style={styles.novaAvatar}>
        <div style={styles.novaGlow} />
        <div style={styles.novaCore}>✦</div>
      </div>
      
      {!novaComplete ? (
        <NovaText 
          lines={[
            ...NOVA_SCRIPT.personal_intro.lines,
            ...NOVA_SCRIPT.personal_explain.lines,
            ...NOVA_SCRIPT.data_collection.lines,
            ...NOVA_SCRIPT.data_optional.lines,
          ]}
          onComplete={() => {
            setNovaComplete(true);
            setCanProceed(true);
          }}
        />
      ) : (
        <div style={styles.personalForm}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🏠 Ta sphère Personnel</h3>
            <p style={styles.cardSubtitle}>
              Chaque information débloque des capacités. Rien n'est obligatoire.
            </p>
            
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Qu'est-ce qui t'amène sur CHE·NU?</label>
              <textarea
                style={styles.textarea}
                placeholder="Organiser ma vie, gérer mes projets, déléguer à l'IA..."
                value={data.personalNotes}
                onChange={e => setData(d => ({ ...d, personalNotes: e.target.value }))}
              />
            </div>
            
            <button 
              style={styles.skipButton}
              onClick={() => setCanProceed(true)}
            >
              Plus tard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER: STATE_DASHBOARD_ACTIVATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const renderDashboardActivation = () => (
    <div style={styles.novaContainer}>
      <div style={styles.novaAvatar}>
        <div style={styles.novaGlow} />
        <div style={styles.novaCore}>✦</div>
      </div>
      
      {!novaComplete ? (
        <NovaText 
          lines={[...NOVA_SCRIPT.unlock_spheres.lines, ...NOVA_SCRIPT.unlock_explain.lines]}
          onComplete={() => {
            setNovaComplete(true);
            setCanProceed(true);
          }}
        />
      ) : (
        <>
          <p style={{ ...styles.novaText, marginBottom: 24 }}>
            Quelles sphères souhaites-tu activer maintenant?
          </p>
          
          <div style={styles.dashboardGrid}>
            {SPHERES_CANONICAL.map(sphere => (
              <div
                key={sphere.id}
                style={{
                  ...styles.dashboardCard,
                  ...(data.activatedSpheres.includes(sphere.id) ? {
                    ...styles.dashboardCardActive,
                    borderColor: sphere.color,
                    background: `${sphere.color}10`,
                  } : {}),
                }}
                onClick={() => {
                  if (sphere.id === 'personnel') return; // Toujours actif
                  setData(d => ({
                    ...d,
                    activatedSpheres: d.activatedSpheres.includes(sphere.id)
                      ? d.activatedSpheres.filter(id => id !== sphere.id)
                      : [...d.activatedSpheres, sphere.id],
                  }));
                }}
              >
                <div style={styles.dashboardEmoji}>{sphere.emoji}</div>
                <div style={styles.dashboardName}>{sphere.name}</div>
                {data.activatedSpheres.includes(sphere.id) && (
                  <div style={{ color: sphere.color, marginTop: 4 }}>✓</div>
                )}
              </div>
            ))}
          </div>
          
          <p style={{ ...styles.novaText, fontSize: 13, color: C.text.muted, marginTop: 16 }}>
            Tu pourras en activer d'autres plus tard.
          </p>
        </>
      )}
    </div>
  );
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER: STATE_OPERATIONAL (Complete)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const renderOperational = () => (
    <div style={styles.novaContainer}>
      <div style={styles.novaAvatar}>
        <div style={{
          ...styles.novaGlow,
          background: `radial-gradient(circle, ${C.gold.muted} 0%, transparent 70%)`,
        }} />
        <div style={{
          ...styles.novaCore,
          background: `linear-gradient(135deg, ${C.gold.primary} 0%, ${C.gold.bright} 100%)`,
          boxShadow: C.glow.gold,
        }}>✦</div>
      </div>
      
      <h2 style={{ 
        fontSize: 28, 
        fontWeight: 600, 
        color: C.gold.primary,
        marginBottom: 8,
      }}>
        Bienvenue dans CHE·NU
      </h2>
      
      <p style={styles.novaText}>
        Ton univers est prêt.
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginTop: 24,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <div style={{ 
          padding: '8px 16px', 
          background: C.background.tertiary, 
          borderRadius: 8,
          color: C.text.secondary,
          fontSize: 14,
        }}>
          <strong style={{ color: C.accent.primary }}>{data.activatedSpheres.length}</strong> sphères activées
        </div>
        {data.selectedTheme && (
          <div style={{ 
            padding: '8px 16px', 
            background: C.background.tertiary, 
            borderRadius: 8,
            color: C.text.secondary,
            fontSize: 14,
          }}>
            Thème sélectionné ✓
          </div>
        )}
      </div>
    </div>
  );
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // STATE INDICATOR
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const renderStateIndicator = () => {
    const states = Object.keys(STATE_MACHINE) as OnboardingState[];
    const currentIndex = states.indexOf(currentState);
    
    return (
      <div style={styles.stateIndicator}>
        {states.map((state, index) => (
          <div
            key={state}
            style={{
              ...styles.stateDot,
              background: index <= currentIndex ? C.accent.primary : C.border.subtle,
              transform: index === currentIndex ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    );
  };
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER CURRENT STATE
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const renderCurrentState = () => {
    switch (currentState) {
      case 'STATE_PRE_ACCOUNT':
        return renderPreAccount();
      case 'STATE_ONBOARDING_THEME':
        return renderThemeSelection();
      case 'STATE_ONBOARDING_SPHERES':
        return renderSpheresIntro();
      case 'STATE_PERSONAL_INIT':
        return renderPersonalInit();
      case 'STATE_DASHBOARD_ACTIVATION':
        return renderDashboardActivation();
      case 'STATE_OPERATIONAL':
        return renderOperational();
      default:
        return null;
    }
  };
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  
  return (
    <div style={styles.container}>
      {/* Background glow */}
      <div style={styles.backgroundGlow} />
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>CHE·NU</div>
      </header>
      
      {/* State indicator */}
      {renderStateIndicator()}
      
      {/* Main content */}
      <main style={styles.content}>
        {renderCurrentState()}
      </main>
      
      {/* Navigation */}
      <nav style={styles.navigation}>
        {currentState !== 'STATE_OPERATIONAL' ? (
          <button
            style={{
              ...styles.continueBtn,
              opacity: canProceed ? 1 : 0.5,
              cursor: canProceed ? 'pointer' : 'not-allowed',
            }}
            onClick={canProceed ? goToNextState : undefined}
          >
            Continuer
          </button>
        ) : (
          <button
            style={styles.continueBtn}
            onClick={handleComplete}
          >
            Entrer dans CHE·NU
          </button>
        )}
      </nav>
      
      {/* Animations CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default CanonicalOnboardingWizard;
