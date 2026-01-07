/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — ACTIVE AGENTS SECTION                                 ║
 * ║              Bureau Section L2-5: 🤖 Agents Actifs                           ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  FEATURES:                                                                   ║
 * ║  - Agent list                                                                ║
 * ║  - Agent control                                                             ║
 * ║  - Execution status                                                          ║
 * ║  - Checkpoints (GOUVERNANCE > EXÉCUTION)                                     ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  REMEMBER:                                                                   ║
 * ║  - Nova is SYSTEM intelligence (always present, never hired)                 ║
 * ║  - User Orchestrator is hired by user                                        ║
 * ║  - Agents have costs, scopes, encoding compatibility                         ║
 * ║  - Agents act only when authorized                                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
import { CHENU_COLORS } from '../../constants/colors';
import { BUREAU_SECTIONS } from '../../types/bureau.types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type AgentStatus = 'idle' | 'running' | 'waiting_checkpoint' | 'paused' | 'error' | 'completed';
type AgentType = 'system' | 'orchestrator' | 'specialist' | 'task';
type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

interface Checkpoint {
  id: string;
  type: 'approval' | 'review' | 'decision' | 'cost';
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  tokenCost?: number;
}

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  level: AgentLevel;
  status: AgentStatus;
  sphereId: string;
  
  // Execution
  currentTask?: string;
  progress?: number;
  
  // Cost
  tokenBudget: number;
  tokenUsed: number;
  
  // Checkpoints
  pendingCheckpoints: Checkpoint[];
  
  // Meta
  isNova?: boolean;
  lastActivityAt: Date;
}

interface ActiveAgentsSectionProps {
  sphereId: string;
  onApproveCheckpoint?: (agentId: string, checkpointId: string) => void;
  onRejectCheckpoint?: (agentId: string, checkpointId: string) => void;
  onPauseAgent?: (agentId: string) => void;
  onResumeAgent?: (agentId: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SECTION_CONFIG = BUREAU_SECTIONS.activeagents;

const STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; icon: string }> = {
  idle: { label: 'Inactif', color: CHENU_COLORS.ancientStone, icon: '⏸️' },
  running: { label: 'En cours', color: CHENU_COLORS.jungleEmerald, icon: '▶️' },
  waiting_checkpoint: { label: 'Attente approbation', color: CHENU_COLORS.sacredGold, icon: '⏳' },
  paused: { label: 'Pausé', color: CHENU_COLORS.earthEmber, icon: '⏸️' },
  error: { label: 'Erreur', color: '#ef4444', icon: '❌' },
  completed: { label: 'Terminé', color: CHENU_COLORS.cenoteTurquoise, icon: '✅' },
};

const LEVEL_CONFIG: Record<AgentLevel, { label: string; description: string }> = {
  L0: { label: 'Système', description: 'Agents système (Nova, Core)' },
  L1: { label: 'Directeur', description: 'Directeurs de domaine' },
  L2: { label: 'Spécialiste', description: 'Agents spécialisés' },
  L3: { label: 'Tâche', description: 'Agents de tâche' },
};

// Mock data
const MOCK_AGENTS: Agent[] = [
  {
    id: 'nova',
    name: 'Nova',
    type: 'system',
    level: 'L0',
    status: 'running',
    sphereId: 'all',
    currentTask: 'Surveillance système et gouvernance',
    tokenBudget: Infinity,
    tokenUsed: 0,
    pendingCheckpoints: [],
    isNova: true,
    lastActivityAt: new Date(),
  },
  {
    id: 'orchestrator-1',
    name: 'Orchestrateur Personnel',
    type: 'orchestrator',
    level: 'L1',
    status: 'waiting_checkpoint',
    sphereId: 'business',
    currentTask: 'Génération rapport Q4',
    progress: 65,
    tokenBudget: 5000,
    tokenUsed: 3250,
    pendingCheckpoints: [
      {
        id: 'cp-1',
        type: 'approval',
        description: 'Valider les conclusions du rapport avant finalisation',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
        tokenCost: 500,
      },
    ],
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'agent-analysis',
    name: 'Agent Analyse Données',
    type: 'specialist',
    level: 'L2',
    status: 'running',
    sphereId: 'business',
    currentTask: 'Analyse des métriques de vente',
    progress: 40,
    tokenBudget: 2000,
    tokenUsed: 800,
    pendingCheckpoints: [],
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: 'agent-writer',
    name: 'Agent Rédaction',
    type: 'task',
    level: 'L3',
    status: 'paused',
    sphereId: 'business',
    tokenBudget: 1000,
    tokenUsed: 450,
    pendingCheckpoints: [],
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  governanceBadge: {
    padding: '6px 12px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    borderRadius: '16px',
    fontSize: '11px',
    color: CHENU_COLORS.sacredGold,
    fontWeight: 600,
  },
  checkpointAlert: {
    backgroundColor: CHENU_COLORS.sacredGold + '11',
    border: `1px solid ${CHENU_COLORS.sacredGold}44`,
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  alertIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '4px',
  },
  alertText: {
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
  },
  alertActions: {
    display: 'flex',
    gap: '8px',
  },
  approveBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: CHENU_COLORS.jungleEmerald,
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  rejectBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    cursor: 'pointer',
  },
  agentsList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    overflowY: 'auto' as const,
  },
  agentCard: (isNova: boolean) => ({
    backgroundColor: isNova ? '#111118' : '#111113',
    borderRadius: '12px',
    border: `1px solid ${isNova ? CHENU_COLORS.cenoteTurquoise + '44' : CHENU_COLORS.ancientStone + '22'}`,
    padding: '16px',
  }),
  agentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  agentInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  agentAvatar: (isNova: boolean) => ({
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: isNova ? CHENU_COLORS.cenoteTurquoise + '22' : CHENU_COLORS.sacredGold + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  }),
  agentName: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  agentMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  levelBadge: {
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    fontSize: '10px',
  },
  statusBadge: (status: AgentStatus) => ({
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: STATUS_CONFIG[status].color + '22',
    color: STATUS_CONFIG[status].color,
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }),
  taskRow: {
    marginBottom: '12px',
  },
  taskLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '4px',
  },
  taskText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
  progressBar: {
    height: '6px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: (progress: number, status: AgentStatus) => ({
    height: '100%',
    width: `${progress}%`,
    backgroundColor: STATUS_CONFIG[status].color,
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  }),
  tokenRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  controlBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '14px',
  },
  novaIndicator: {
    fontSize: '10px',
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ActiveAgentsSection: React.FC<ActiveAgentsSectionProps> = ({
  sphereId,
  onApproveCheckpoint,
  onRejectCheckpoint,
  onPauseAgent,
  onResumeAgent,
}) => {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);

  // Agents with pending checkpoints
  const agentsWithCheckpoints = useMemo(() => 
    agents.filter(a => a.pendingCheckpoints.length > 0),
    [agents]
  );

  // Handlers
  const handleApprove = useCallback((agentId: string, checkpointId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          status: 'running' as AgentStatus,
          pendingCheckpoints: a.pendingCheckpoints.filter(cp => cp.id !== checkpointId),
        };
      }
      return a;
    }));
    onApproveCheckpoint?.(agentId, checkpointId);
  }, [onApproveCheckpoint]);

  const handleReject = useCallback((agentId: string, checkpointId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          status: 'paused' as AgentStatus,
          pendingCheckpoints: a.pendingCheckpoints.filter(cp => cp.id !== checkpointId),
        };
      }
      return a;
    }));
    onRejectCheckpoint?.(agentId, checkpointId);
  }, [onRejectCheckpoint]);

  const handleTogglePause = useCallback((agent: Agent) => {
    if (agent.status === 'paused') {
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, status: 'running' as AgentStatus } : a
      ));
      onResumeAgent?.(agent.id);
    } else if (agent.status === 'running') {
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, status: 'paused' as AgentStatus } : a
      ));
      onPauseAgent?.(agent.id);
    }
  }, [onPauseAgent, onResumeAgent]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>{SECTION_CONFIG.icon}</span>
          <span>{SECTION_CONFIG.nameFr}</span>
        </div>
        <div style={styles.governanceBadge}>
          ⚖️ GOUVERNANCE {'>'} EXÉCUTION
        </div>
      </div>

      {/* Checkpoint Alerts */}
      <AnimatePresence>
        {agentsWithCheckpoints.map(agent => 
          agent.pendingCheckpoints.map(checkpoint => (
            <motion.div
              key={`${agent.id}-${checkpoint.id}`}
              style={styles.checkpointAlert}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div style={styles.alertIcon}>⏳</div>
              <div style={styles.alertContent}>
                <div style={styles.alertTitle}>
                  Checkpoint: {agent.name}
                </div>
                <div style={styles.alertText}>
                  {checkpoint.description}
                  {checkpoint.tokenCost && (
                    <span> • Coût: {checkpoint.tokenCost} tokens</span>
                  )}
                </div>
              </div>
              <div style={styles.alertActions}>
                <motion.button
                  style={styles.approveBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApprove(agent.id, checkpoint.id)}
                >
                  ✓ Approuver
                </motion.button>
                <motion.button
                  style={styles.rejectBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReject(agent.id, checkpoint.id)}
                >
                  ✕ Rejeter
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* Agents List */}
      <div style={styles.agentsList}>
        {agents.map(agent => (
          <motion.div
            key={agent.id}
            style={styles.agentCard(agent.isNova || false)}
            whileHover={{ borderColor: agent.isNova ? CHENU_COLORS.cenoteTurquoise : CHENU_COLORS.sacredGold + '44' }}
          >
            <div style={styles.agentHeader}>
              <div style={styles.agentInfo}>
                <div style={styles.agentAvatar(agent.isNova || false)}>
                  {agent.isNova ? '✦' : '🤖'}
                </div>
                <div>
                  <div style={styles.agentName}>{agent.name}</div>
                  <div style={styles.agentMeta}>
                    <span style={styles.levelBadge}>{agent.level}</span>
                    <span>{LEVEL_CONFIG[agent.level].description}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={styles.statusBadge(agent.status)}>
                  {STATUS_CONFIG[agent.status].icon}
                  {STATUS_CONFIG[agent.status].label}
                </div>
                {!agent.isNova && (agent.status === 'running' || agent.status === 'paused') && (
                  <motion.button
                    style={styles.controlBtn}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTogglePause(agent)}
                    title={agent.status === 'paused' ? 'Reprendre' : 'Pause'}
                  >
                    {agent.status === 'paused' ? '▶️' : '⏸️'}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Current Task */}
            {agent.currentTask && (
              <div style={styles.taskRow}>
                <div style={styles.taskLabel}>Tâche en cours:</div>
                <div style={styles.taskText}>{agent.currentTask}</div>
                {agent.progress !== undefined && (
                  <div style={styles.progressBar}>
                    <motion.div 
                      style={styles.progressFill(agent.progress, agent.status)}
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Token Usage */}
            {!agent.isNova && (
              <div style={styles.tokenRow}>
                <span>💎 Tokens: {agent.tokenUsed.toLocaleString()} / {agent.tokenBudget.toLocaleString()}</span>
                <span>{Math.round((agent.tokenUsed / agent.tokenBudget) * 100)}% utilisé</span>
              </div>
            )}

            {/* Nova Indicator */}
            {agent.isNova && (
              <div style={styles.novaIndicator}>
                ✦ Intelligence système — Toujours active — Jamais embauchée
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActiveAgentsSection;
