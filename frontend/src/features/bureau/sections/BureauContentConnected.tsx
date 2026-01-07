/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — BUREAU CONTENT CONNECTED                        ║
 * ║                    Router vers les versions COMPLÈTES et CONNECTÉES           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Ce composant remplace BureauContent pour utiliser:
 * - Les versions complètes des sections (fichiers séparés, pas inline)
 * - Les versions connectées aux stores Zustand quand disponibles
 * 
 * DIFFÉRENCE avec BureauContent:
 * - BureauContent: utilise les versions inline simples (dans BureauSections.tsx)
 * - BureauContentConnected: utilise les fichiers séparés complets + stores
 */

import React, { Suspense, lazy } from 'react';
import { CHENU_COLORS } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type BureauSection = 
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

interface BureauContentConnectedProps {
  section: BureauSection;
  sphereId: string;
  projectId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORTS — Versions COMPLÈTES depuis fichiers séparés
// ═══════════════════════════════════════════════════════════════════════════════

// Sections standards (fichiers séparés complets)
import DashboardSection from './DashboardSection';
import NotesSection from './NotesSection';
import TasksSection from './TasksSection';
import ProjectsSection from './ProjectsSection';
import MeetingsSection from './MeetingsSection';
import DataSection from './DataSection';
import AgentsSection from './AgentsSection';
import ReportsSection from './ReportsSection';
import BudgetGovernanceSection from './BudgetGovernanceSection';

// Version CONNECTÉE au store (nouvellement créée)
import ThreadsSectionConnected from './ThreadsSectionConnected';
import TasksSectionConnected from './TasksSectionConnected';
import MeetingsSectionConnected from './MeetingsSectionConnected';
import AgentsSectionConnected from './AgentsSectionConnected';

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════

const SectionLoader: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: CHENU_COLORS.ancientStone,
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
      <div>Chargement...</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAPPING SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionConfig {
  component: React.FC<any>;
  title: string;
  icon: string;
  description: string;
  connected: boolean; // True si connecté au store
}

const SECTION_CONFIG: Record<BureauSection, SectionConfig> = {
  dashboard: {
    component: DashboardSection,
    title: 'Dashboard',
    icon: '📊',
    description: 'Vue d\'ensemble de la sphère',
    connected: false,
  },
  notes: {
    component: NotesSection,
    title: 'Notes',
    icon: '📝',
    description: 'Capture rapide de pensées',
    connected: false,
  },
  tasks: {
    component: TasksSectionConnected, // ✅ VERSION CONNECTÉE
    title: 'Tasks',
    icon: '✅',
    description: 'Gestion des tâches',
    connected: true, // Maintenant connecté au taskStore
  },
  projects: {
    component: ProjectsSection,
    title: 'Projects',
    icon: '📁',
    description: 'Projets complexes',
    connected: false,
  },
  threads: {
    component: ThreadsSectionConnected, // ✅ VERSION CONNECTÉE
    title: 'Threads (.chenu)',
    icon: '💬',
    description: 'Lignes de pensée persistantes',
    connected: true,
  },
  meetings: {
    component: MeetingsSectionConnected, // ✅ VERSION CONNECTÉE
    title: 'Meetings',
    icon: '📅',
    description: 'Réunions gouvernées',
    connected: true, // Maintenant connecté au meetingStore
  },
  data: {
    component: DataSection,
    title: 'Data',
    icon: '🗄️',
    description: 'Données structurées',
    connected: false,
  },
  agents: {
    component: AgentsSectionConnected, // ✅ VERSION CONNECTÉE
    title: 'Agents',
    icon: '🤖',
    description: 'Agents IA assignés',
    connected: true, // Maintenant connecté au agentStore
  },
  reports: {
    component: ReportsSection,
    title: 'Reports',
    icon: '📈',
    description: 'Rapports et historique',
    connected: false,
  },
  budget: {
    component: BudgetGovernanceSection,
    title: 'Budget & Governance',
    icon: '💰',
    description: 'Tokens et gouvernance',
    connected: false, // Utilise tokenStore + governanceStore
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const BureauContentConnected: React.FC<BureauContentConnectedProps> = ({
  section,
  sphereId,
  projectId,
}) => {
  const config = SECTION_CONFIG[section];
  
  if (!config) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: CHENU_COLORS.ancientStone,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
        <h2>Section non trouvée</h2>
        <p>La section "{section}" n'existe pas.</p>
      </div>
    );
  }

  const { component: SectionComponent, title, icon, connected } = config;

  return (
    <div>
      {/* Header de section avec indicateur de connexion */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{icon}</span>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: CHENU_COLORS.softSand,
            margin: 0,
          }}>
            {title}
          </h1>
        </div>
        
        {/* Indicateur de connexion store */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          backgroundColor: connected 
            ? CHENU_COLORS.jungleEmerald + '22' 
            : CHENU_COLORS.ancientStone + '22',
          borderRadius: '12px',
          fontSize: '10px',
          color: connected ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone,
        }}>
          {connected ? '🔗 Store connecté' : '📋 Données locales'}
        </div>
      </div>

      {/* Contenu de la section */}
      <Suspense fallback={<SectionLoader />}>
        <SectionComponent 
          sphereId={sphereId} 
          projectId={projectId}
        />
      </Suspense>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { SECTION_CONFIG };
export default BureauContentConnected;
