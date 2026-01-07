/**
 * CHE·NU™ R&D Workspace
 * 
 * Interface universelle de Recherche & Développement
 * Composant principal avec header permanent et navigation des phases
 */

import React, { useState, useCallback } from 'react';
import {
  RnDPhase,
  RnDProject,
  RnDPhaseData,
  RND_PHASES,
  RND_DOMAINS,
  RnDIdea,
  RnDScenario,
  SelectionCriterion,
  IdeaSelection,
  ComparisonMatrix,
  RefinementIteration,
  RnDDecision,
  RnDOutput,
  DEFAULT_SELECTION_CRITERIA,
} from './rnd-workspace.types';
import { RnDPhase1Exploration } from './RnDPhase1Exploration';
import { RnDPhase2Selection } from './RnDPhase2Selection';
import { RnDPhase3Examples } from './RnDPhase3Examples';
import { RnDPhase4Comparison } from './RnDPhase4Comparison';
import { RnDPhase5Refinement } from './RnDPhase5Refinement';
import { RnDPhase6Decision } from './RnDPhase6Decision';
import { RnDAgentPanel } from './RnDAgentPanel';
import { QuantitativeModulesModal } from './QuantitativeModulesModal';

// ============================================================================
// DESIGN SYSTEM
// ============================================================================

const CHENU_COLORS = {
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  obsidianBlack: '#0A0A0B',
  templeWhite: '#FAF9F6',
  nightSlate: '#1E1F22',
  deepBlue: '#1E3A5F',
};

// ============================================================================
// MOCK DATA
// ============================================================================

const createMockProject = (): RnDProject => ({
  id: 'rnd-001',
  name: 'Architecture R&D Workspace',
  domain: 'product',
  objective: 'Définir l\'interface optimale pour la recherche structurée',
  currentPhase: 1,
  status: 'active',
  created_at: '2025-12-28T10:00:00Z',
  created_by: 'user-jonathan',
  updated_at: '2025-12-29T14:30:00Z',
  participants: [
    {
      id: 'user-jonathan',
      name: 'Jonathan',
      role: 'owner',
      joined_at: '2025-12-28T10:00:00Z',
    },
    {
      id: 'user-claude',
      name: 'Claude (Agent R&D)',
      role: 'researcher',
      joined_at: '2025-12-28T10:05:00Z',
    },
  ],
  phaseData: createEmptyPhaseData(),
});

const createEmptyPhaseData = (): RnDPhaseData => ({
  phase1: {
    ideas: [],
    themes: [],
  },
  phase2: {
    criteria: DEFAULT_SELECTION_CRITERIA,
    selections: [],
    shortlist: [],
  },
  phase3: {
    scenarios: [],
  },
  phase4: {
    matrix: {
      criteria: [],
      solutions: [],
      evaluations: [],
      disagreements: [],
    },
    rankings: [],
  },
  phase5: {
    focusedSolutions: [],
    iterations: [],
  },
  phase6: {
    decision: undefined,
    outputs: [],
  },
});

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    backgroundColor: '#111113',
    color: '#E8E6E1',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  // HEADER PERMANENT (TOUJOURS VISIBLE)
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}40`,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '8px',
    color: '#9CA3AF',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  projectInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  projectName: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#E8E6E1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  domainBadge: {
    padding: '2px 8px',
    backgroundColor: `${CHENU_COLORS.deepBlue}40`,
    borderRadius: '4px',
    fontSize: '12px',
    color: CHENU_COLORS.cenoteTurquoise,
  },
  objective: {
    fontSize: '13px',
    color: '#9CA3AF',
    fontStyle: 'italic' as const,
  },
  headerCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  phaseIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#111113',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}60`,
  },
  phaseNumber: {
    fontSize: '24px',
    fontWeight: 700,
  },
  phaseInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  phaseName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#E8E6E1',
  },
  phaseObjective: {
    fontSize: '11px',
    color: '#9CA3AF',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: CHENU_COLORS.deepBlue,
    border: 'none',
    borderRadius: '8px',
    color: '#E8E6E1',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  agentButton: {
    backgroundColor: `${CHENU_COLORS.sacredGold}20`,
    border: `1px solid ${CHENU_COLORS.sacredGold}40`,
    color: CHENU_COLORS.sacredGold,
  },
  quantButton: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}20`,
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}40`,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  
  // PHASE NAVIGATION
  phaseNav: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#0D0D0E',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}30`,
    gap: '8px',
    overflowX: 'auto' as const,
  },
  phaseStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
  },
  phaseStepActive: {
    backgroundColor: `${CHENU_COLORS.nightSlate}`,
    border: `1px solid ${CHENU_COLORS.ancientStone}60`,
  },
  phaseStepCompleted: {
    opacity: 0.7,
  },
  phaseStepLocked: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  phaseIcon: {
    fontSize: '16px',
  },
  phaseLabel: {
    fontSize: '13px',
    color: '#9CA3AF',
  },
  phaseLabelActive: {
    color: '#E8E6E1',
    fontWeight: 600,
  },
  phaseConnector: {
    width: '24px',
    height: '2px',
    backgroundColor: `${CHENU_COLORS.ancientStone}40`,
    borderRadius: '1px',
  },
  phaseConnectorCompleted: {
    backgroundColor: CHENU_COLORS.sacredGold,
  },
  
  // MAIN CONTENT
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto' as const,
  },
  
  // TRACEABILITY FOOTER
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 24px',
    backgroundColor: '#0D0D0E',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}30`,
    fontSize: '12px',
    color: '#6B7280',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  traceabilityLink: {
    color: CHENU_COLORS.sacredGold,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

interface RnDWorkspaceProps {
  projectId?: string;
  onBack?: () => void;
}

export const RnDWorkspace: React.FC<RnDWorkspaceProps> = ({
  projectId,
  onBack,
}) => {
  // State
  const [project, setProject] = useState<RnDProject>(createMockProject());
  const [currentPhase, setCurrentPhase] = useState<RnDPhase>(1);
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [quantModalOpen, setQuantModalOpen] = useState(false);
  
  const phaseInfo = RND_PHASES[currentPhase];
  const domainInfo = RND_DOMAINS[project.domain];
  
  // Phase navigation
  const canGoToPhase = useCallback((phase: RnDPhase): boolean => {
    // Can always go back
    if (phase < currentPhase) return true;
    // Can go to next if current has required data
    if (phase === currentPhase + 1) {
      switch (currentPhase) {
        case 1: return project.phaseData.phase1.ideas.length >= 3;
        case 2: return project.phaseData.phase2.shortlist.length >= 1;
        case 3: return project.phaseData.phase3.scenarios.length >= 2;
        case 4: return project.phaseData.phase4.rankings.length >= 1;
        case 5: return project.phaseData.phase5.iterations.length >= 1;
        default: return false;
      }
    }
    // Can't skip phases
    return false;
  }, [currentPhase, project.phaseData]);
  
  const handlePhaseClick = (phase: RnDPhase) => {
    if (phase <= currentPhase || canGoToPhase(phase)) {
      setCurrentPhase(phase);
      setProject(prev => ({ ...prev, currentPhase: phase }));
    }
  };
  
  // Phase data updates
  const updatePhaseData = <K extends keyof RnDPhaseData>(
    phaseKey: K,
    data: Partial<RnDPhaseData[K]>
  ) => {
    setProject(prev => ({
      ...prev,
      phaseData: {
        ...prev.phaseData,
        [phaseKey]: {
          ...prev.phaseData[phaseKey],
          ...data,
        },
      },
      updated_at: new Date().toISOString(),
    }));
  };
  
  // Render phase content
  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 1:
        return (
          <RnDPhase1Exploration
            ideas={project.phaseData.phase1.ideas}
            themes={project.phaseData.phase1.themes}
            onAddIdea={(idea) => {
              updatePhaseData('phase1', {
                ideas: [...project.phaseData.phase1.ideas, idea],
              });
            }}
            onUpdateThemes={(themes) => {
              updatePhaseData('phase1', { themes });
            }}
            onAskAgent={() => setAgentPanelOpen(true)}
          />
        );
      case 2:
        return (
          <RnDPhase2Selection
            ideas={project.phaseData.phase1.ideas}
            criteria={project.phaseData.phase2.criteria}
            selections={project.phaseData.phase2.selections}
            shortlist={project.phaseData.phase2.shortlist}
            onUpdateCriteria={(criteria) => {
              updatePhaseData('phase2', { criteria });
            }}
            onUpdateSelections={(selections) => {
              updatePhaseData('phase2', { selections });
            }}
            onUpdateShortlist={(shortlist) => {
              updatePhaseData('phase2', { shortlist });
            }}
            onAskAgent={() => setAgentPanelOpen(true)}
          />
        );
      case 3:
        return (
          <RnDPhase3Examples
            selectedIdeas={project.phaseData.phase1.ideas.filter(
              i => project.phaseData.phase2.shortlist.includes(i.id)
            )}
            scenarios={project.phaseData.phase3.scenarios}
            onAddScenario={(scenario) => {
              updatePhaseData('phase3', {
                scenarios: [...project.phaseData.phase3.scenarios, scenario],
              });
            }}
            onAskAgent={() => setAgentPanelOpen(true)}
            onOpenQuantitative={() => setQuantModalOpen(true)}
          />
        );
      case 4:
        return (
          <RnDPhase4Comparison
            solutions={project.phaseData.phase1.ideas.filter(
              i => project.phaseData.phase2.shortlist.includes(i.id)
            )}
            matrix={project.phaseData.phase4.matrix}
            rankings={project.phaseData.phase4.rankings}
            onUpdateMatrix={(matrix) => {
              updatePhaseData('phase4', { matrix });
            }}
            onUpdateRankings={(rankings) => {
              updatePhaseData('phase4', { rankings });
            }}
            onAskAgent={() => setAgentPanelOpen(true)}
            onOpenQuantitative={() => setQuantModalOpen(true)}
          />
        );
      case 5:
        return (
          <RnDPhase5Refinement
            focusedSolutions={project.phaseData.phase5.focusedSolutions}
            iterations={project.phaseData.phase5.iterations}
            allSolutions={project.phaseData.phase1.ideas.filter(
              i => project.phaseData.phase2.shortlist.includes(i.id)
            )}
            rankings={project.phaseData.phase4.rankings}
            onUpdateFocused={(focused) => {
              updatePhaseData('phase5', { focusedSolutions: focused });
            }}
            onAddIteration={(iteration) => {
              updatePhaseData('phase5', {
                iterations: [...project.phaseData.phase5.iterations, iteration],
              });
            }}
            onAskAgent={() => setAgentPanelOpen(true)}
            onOpenQuantitative={() => setQuantModalOpen(true)}
          />
        );
      case 6:
        return (
          <RnDPhase6Decision
            decision={project.phaseData.phase6.decision}
            outputs={project.phaseData.phase6.outputs}
            allIdeas={project.phaseData.phase1.ideas}
            shortlist={project.phaseData.phase2.shortlist}
            focusedSolutions={project.phaseData.phase5.focusedSolutions}
            onSetDecision={(decision) => {
              updatePhaseData('phase6', { decision });
            }}
            onAddOutput={(output) => {
              updatePhaseData('phase6', {
                outputs: [...project.phaseData.phase6.outputs, output],
              });
            }}
            onAskAgent={() => setAgentPanelOpen(true)}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div style={styles.container}>
      {/* HEADER PERMANENT */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.backButton}
            onClick={onBack}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = CHENU_COLORS.ancientStone;
              e.currentTarget.style.color = '#E8E6E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${CHENU_COLORS.ancientStone}40`;
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            ← Retour
          </button>
          
          <div style={styles.projectInfo}>
            <div style={styles.projectName}>
              {project.name}
              <span style={styles.domainBadge}>
                {domainInfo.icon} {domainInfo.label}
              </span>
            </div>
            <div style={styles.objective}>
              "{project.objective}"
            </div>
          </div>
        </div>
        
        <div style={styles.headerCenter}>
          <div style={{
            ...styles.phaseIndicator,
            borderColor: phaseInfo.color,
          }}>
            <span style={{
              ...styles.phaseNumber,
              color: phaseInfo.color,
            }}>
              {phaseInfo.icon}
            </span>
            <div style={styles.phaseInfo}>
              <span style={styles.phaseName}>
                Phase {currentPhase}: {phaseInfo.name}
              </span>
              <span style={styles.phaseObjective}>
                {phaseInfo.objective}
              </span>
            </div>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <button
            style={{
              ...styles.actionButton,
              ...styles.agentButton,
            }}
            onClick={() => setAgentPanelOpen(true)}
          >
            🤖 Ask R&D Agent
          </button>
          
          {phaseInfo.quantitativeModulesAvailable && (
            <button
              style={{
                ...styles.actionButton,
                ...styles.quantButton,
              }}
              onClick={() => setQuantModalOpen(true)}
            >
              📐 Modules Quantitatifs
            </button>
          )}
        </div>
      </header>
      
      {/* PHASE NAVIGATION */}
      <nav style={styles.phaseNav}>
        {([1, 2, 3, 4, 5, 6] as RnDPhase[]).map((phase, index) => {
          const info = RND_PHASES[phase];
          const isActive = phase === currentPhase;
          const isCompleted = phase < currentPhase;
          const isLocked = phase > currentPhase && !canGoToPhase(phase);
          
          return (
            <React.Fragment key={phase}>
              <button
                style={{
                  ...styles.phaseStep,
                  ...(isActive ? styles.phaseStepActive : {}),
                  ...(isCompleted ? styles.phaseStepCompleted : {}),
                  ...(isLocked ? styles.phaseStepLocked : {}),
                  borderColor: isActive ? info.color : 'transparent',
                }}
                onClick={() => handlePhaseClick(phase)}
                disabled={isLocked}
              >
                <span style={styles.phaseIcon}>{info.icon}</span>
                <span style={{
                  ...styles.phaseLabel,
                  ...(isActive ? styles.phaseLabelActive : {}),
                  color: isActive ? info.color : undefined,
                }}>
                  {info.name}
                </span>
                {isCompleted && <span>✓</span>}
              </button>
              
              {index < 5 && (
                <div style={{
                  ...styles.phaseConnector,
                  ...(isCompleted ? styles.phaseConnectorCompleted : {}),
                }} />
              )}
            </React.Fragment>
          );
        })}
      </nav>
      
      {/* MAIN CONTENT */}
      <main style={styles.mainContent}>
        <div style={styles.contentArea}>
          {renderPhaseContent()}
        </div>
        
        {agentPanelOpen && (
          <RnDAgentPanel
            currentPhase={currentPhase}
            phaseInfo={phaseInfo}
            onClose={() => setAgentPanelOpen(false)}
          />
        )}
      </main>
      
      {/* TRACEABILITY FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerLeft}>
          <span>
            Créé le {new Date(project.created_at).toLocaleDateString('fr-CA')}
          </span>
          <span>•</span>
          <span>
            Dernière modification: {new Date(project.updated_at).toLocaleString('fr-CA')}
          </span>
        </div>
        <div style={styles.footerRight}>
          <span>🧠 Mémoire du raisonnement</span>
          <span style={styles.traceabilityLink}>
            Voir l'historique complet
          </span>
        </div>
      </footer>
      
      {/* QUANTITATIVE MODULES MODAL */}
      {quantModalOpen && (
        <QuantitativeModulesModal
          currentPhase={currentPhase}
          onClose={() => setQuantModalOpen(false)}
          onSelectModule={(moduleType) => {
            logger.debug('Selected module:', moduleType);
            setQuantModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default RnDWorkspace;
