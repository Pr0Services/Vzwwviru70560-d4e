// CHE·NU™ Agents Page — AI Agent Management

import React, { useState } from 'react';
import { CHENU_COLORS, type Agent, type AgentLevel, type AgentType } from '../../types';
import { AgentGrid, AgentLevelFilter, AgentExecutionPanel } from '../../components/agents/AgentComponents';
import { Modal, Tabs, EmptyState, Card } from '../../components/core/UIComponents';

// Mock agents data (168 agents in the real system)
const mockAgents: Agent[] = [
  {
    id: 'nova',
    code: 'NOVA',
    name_fr: 'Nova',
    name_en: 'Nova',
    description: 'System intelligence. Handles guidance, memory, governance. Supervises databases and threads.',
    agent_level: 'L0',
    agent_type: 'orchestrator',
    sphere_id: null,
    domain_id: null,
    capabilities: ['Memory Management', 'Governance', 'Navigation', 'Supervision'],
    constraints: ['Always present', 'Cannot be disabled', 'System-level only'],
    llm_provider: 'anthropic',
    llm_model: 'claude-3-opus',
    is_active: true,
    is_system: true,
  },
  {
    id: 'user-orch',
    code: 'USER_ORCHESTRATOR',
    name_fr: 'Orchestrateur Utilisateur',
    name_en: 'User Orchestrator',
    description: 'Executes tasks, manages agents, respects scope, budget, and governance.',
    agent_level: 'L1',
    agent_type: 'orchestrator',
    sphere_id: null,
    domain_id: null,
    capabilities: ['Task Execution', 'Agent Coordination', 'Budget Management'],
    constraints: ['Budget limited', 'Scope restricted', 'User authorized'],
    llm_provider: 'anthropic',
    llm_model: 'claude-3-sonnet',
    is_active: true,
    is_system: false,
  },
  {
    id: 'doc-analyzer',
    code: 'DOC_ANALYZER',
    name_fr: 'Analyseur de Documents',
    name_en: 'Document Analyzer',
    description: 'Analyzes documents, extracts key information, summarizes content.',
    agent_level: 'L2',
    agent_type: 'specialist',
    sphere_id: null,
    domain_id: null,
    capabilities: ['Document Analysis', 'Text Extraction', 'Summarization', 'Key Points'],
    constraints: ['Read-only', 'Token budget per analysis'],
    llm_provider: 'anthropic',
    llm_model: 'claude-3-sonnet',
    is_active: true,
    is_system: false,
  },
  {
    id: 'task-planner',
    code: 'TASK_PLANNER',
    name_fr: 'Planificateur de Tâches',
    name_en: 'Task Planner',
    description: 'Creates task breakdowns, estimates effort, suggests priorities.',
    agent_level: 'L2',
    agent_type: 'specialist',
    sphere_id: null,
    domain_id: null,
    capabilities: ['Task Breakdown', 'Effort Estimation', 'Priority Setting', 'Dependencies'],
    constraints: ['Suggestions only', 'User approval required'],
    llm_provider: 'anthropic',
    llm_model: 'claude-3-haiku',
    is_active: true,
    is_system: false,
  },
  {
    id: 'meeting-prep',
    code: 'MEETING_PREP',
    name_fr: 'Préparateur de Réunions',
    name_en: 'Meeting Prep',
    description: 'Prepares meeting agendas, gathers context, creates briefs.',
    agent_level: 'L3',
    agent_type: 'support',
    sphere_id: null,
    domain_id: null,
    capabilities: ['Agenda Creation', 'Context Gathering', 'Brief Generation'],
    constraints: ['Support role', 'Limited autonomy'],
    llm_provider: 'anthropic',
    llm_model: 'claude-3-haiku',
    is_active: false,
    is_system: false,
  },
  {
    id: 'code-reviewer',
    code: 'CODE_REVIEWER',
    name_fr: 'Réviseur de Code',
    name_en: 'Code Reviewer',
    description: 'Reviews code, suggests improvements, identifies issues.',
    agent_level: 'L2',
    agent_type: 'analyzer',
    sphere_id: null,
    domain_id: null,
    capabilities: ['Code Review', 'Bug Detection', 'Style Suggestions', 'Security Analysis'],
    constraints: ['Read-only', 'No execution'],
    llm_provider: 'anthropic',
    llm_model: 'claude-3-sonnet',
    is_active: true,
    is_system: false,
  },
  {
    id: 'email-drafter',
    code: 'EMAIL_DRAFTER',
    name_fr: 'Rédacteur d\'Emails',
    name_en: 'Email Drafter',
    description: 'Drafts professional emails based on context and tone preferences.',
    agent_level: 'L3',
    agent_type: 'support',
    sphere_id: null,
    domain_id: null,
    capabilities: ['Email Drafting', 'Tone Adjustment', 'Template Usage'],
    constraints: ['Draft only', 'User sends'],
    llm_provider: 'anthropic',
    llm_model: 'claude-3-haiku',
    is_active: true,
    is_system: false,
  },
  {
    id: 'data-analyst',
    code: 'DATA_ANALYST',
    name_fr: 'Analyste de Données',
    name_en: 'Data Analyst',
    description: 'Analyzes data, creates reports, identifies trends.',
    agent_level: 'L2',
    agent_type: 'analyzer',
    sphere_id: null,
    domain_id: null,
    capabilities: ['Data Analysis', 'Report Generation', 'Trend Identification', 'Visualization'],
    constraints: ['Read-only access', 'No data modification'],
    llm_provider: 'anthropic',
    llm_model: 'claude-3-sonnet',
    is_active: true,
    is_system: false,
  },
];

const AgentsPage: React.FC = () => {
  const [agents] = useState<Agent[]>(mockAgents);
  const [selectedLevels, setSelectedLevels] = useState<AgentLevel[]>(['L0', 'L1', 'L2', 'L3']);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [executingAgent, setExecutingAgent] = useState<Agent | null>(null);

  const filteredAgents = agents.filter(agent => {
    const levelMatch = selectedLevels.includes(agent.agent_level);
    const statusMatch = activeTab === 'all' || 
      (activeTab === 'active' && agent.is_active) ||
      (activeTab === 'inactive' && !agent.is_active);
    return levelMatch && statusMatch;
  });

  const agentCounts = {
    L0: agents.filter(a => a.agent_level === 'L0').length,
    L1: agents.filter(a => a.agent_level === 'L1').length,
    L2: agents.filter(a => a.agent_level === 'L2').length,
    L3: agents.filter(a => a.agent_level === 'L3').length,
  };

  const handleExecute = async (inputData: any) => {
    console.log('Executing agent:', executingAgent?.code, 'with input:', inputData);
    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExecutingAgent(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: CHENU_COLORS.uiSlate,
      padding: '32px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: CHENU_COLORS.softSand, marginBottom: '4px' }}>
          AI Agents
        </h1>
        <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '15px' }}>
          168 hierarchical agents organized by level (L0-L3) and type
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {(['L0', 'L1', 'L2', 'L3'] as AgentLevel[]).map((level) => {
          const colors: Record<AgentLevel, string> = {
            L0: CHENU_COLORS.sacredGold,
            L1: CHENU_COLORS.cenoteTurquoise,
            L2: CHENU_COLORS.jungleEmerald,
            L3: CHENU_COLORS.ancientStone,
          };
          const labels: Record<AgentLevel, string> = {
            L0: 'Nova (System)',
            L1: 'Orchestrators',
            L2: 'Specialists',
            L3: 'Support',
          };
          return (
            <Card key={level} accent={colors[level]}>
              <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>{labels[level]}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: colors[level] }}>{agentCounts[level]}</p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <AgentLevelFilter
        selectedLevels={selectedLevels}
        onChange={setSelectedLevels}
      />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Agents', icon: '🤖' },
          { id: 'active', label: 'Active', icon: '🟢' },
          { id: 'inactive', label: 'Inactive', icon: '⚪' },
        ]}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
      />

      {/* Agent Grid */}
      {filteredAgents.length > 0 ? (
        <AgentGrid
          agents={filteredAgents}
          onExecute={(agent) => setExecutingAgent(agent)}
          onSelect={(agent) => console.log('Selected:', agent.code)}
        />
      ) : (
        <EmptyState
          icon="🤖"
          title="No agents found"
          description="Adjust your filters to see agents"
        />
      )}

      {/* Governance Notice */}
      <div style={{
        marginTop: '32px',
        padding: '20px',
        backgroundColor: CHENU_COLORS.earthEmber + '11',
        border: `1px solid ${CHENU_COLORS.earthEmber}22`,
        borderRadius: '12px',
      }}>
        <h4 style={{ color: CHENU_COLORS.earthEmber, fontSize: '14px', marginBottom: '8px' }}>
          ⚠️ Law 7: No Self-Directed Agent Learning
        </h4>
        <p style={{ color: CHENU_COLORS.softSand, fontSize: '13px' }}>
          Agents cannot take autonomous actions. All executions are governed by your budget, scope, and explicit authorization. 
          Nova supervises all agent activities.
        </p>
      </div>

      {/* Execution Modal */}
      <Modal
        isOpen={!!executingAgent}
        onClose={() => setExecutingAgent(null)}
        title="Execute Agent"
        size="lg"
      >
        {executingAgent && (
          <AgentExecutionPanel
            agent={executingAgent}
            onExecute={handleExecute}
            onCancel={() => setExecutingAgent(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default AgentsPage;
