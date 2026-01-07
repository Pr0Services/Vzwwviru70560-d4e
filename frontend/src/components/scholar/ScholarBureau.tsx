/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — SCHOLAR SPHERE BUREAU v39
   🎓 Knowledge Research, Learning & Information Synthesis
   Core of Governed Intelligence
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useMemo } from 'react';
import type { ReactNode } from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

interface ResearchProject {
  id: string;
  title: string;
  topic: string;
  status: 'active' | 'completed' | 'archived';
  sources: number;
  citations: number;
  lastUpdated: number;
}

interface LearningItem {
  id: string;
  title: string;
  type: 'flashcard_deck' | 'concept_map' | 'study_guide' | 'quiz';
  progress: number;
  dueDate?: number;
  nextReview?: number;
}

interface KnowledgeNode {
  id: string;
  title: string;
  type: 'fact' | 'concept' | 'source' | 'synthesis';
  connections: number;
  confidence: number;
}

interface ScholarStats {
  totalResearchProjects: number;
  activeLearning: number;
  knowledgeNodes: number;
  citationsManaged: number;
  tokensUsedToday: number;
  tokenBudget: number;
}

// ════════════════════════════════════════════════════════════════════════════════
// COLORS
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  scholarBlue: '#2980B9',
  scholarBlueDark: '#1A5276',
  scholarBlueLight: '#5DADE2',
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  background: '#0c0a09',
  cardBg: '#111113',
  border: 'rgba(141, 131, 113, 0.15)',
};

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    backgroundColor: COLORS.background,
    minHeight: '100vh',
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  sphereIcon: {
    fontSize: '32px',
  },
  
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: COLORS.softSand,
    margin: 0,
  },
  
  subtitle: {
    fontSize: '14px',
    color: COLORS.ancientStone,
    margin: 0,
  },
  
  statsBar: {
    display: 'flex',
    gap: '16px',
  },
  
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
  },
  
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: COLORS.scholarBlue,
  },
  
  statLabel: {
    fontSize: '11px',
    color: COLORS.ancientStone,
    textTransform: 'uppercase',
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '16px',
  },
  
  section: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
  },
  
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.softSand,
  },
  
  sectionIcon: {
    fontSize: '16px',
  },
  
  sectionContent: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '24px',
    color: COLORS.ancientStone,
  },
  
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  itemTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.softSand,
    margin: 0,
  },
  
  itemMeta: {
    fontSize: '12px',
    color: COLORS.ancientStone,
  },
  
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
  
  progressBar: {
    height: '4px',
    backgroundColor: COLORS.background,
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.scholarBlue,
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: COLORS.scholarBlue,
    color: COLORS.softSand,
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    backgroundColor: 'transparent',
    color: COLORS.scholarBlue,
    border: `1px solid ${COLORS.scholarBlue}`,
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    marginBottom: '16px',
  },
  
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: COLORS.softSand,
    fontSize: '14px',
  },
  
  toolGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  
  toolCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  
  toolIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  
  toolName: {
    fontSize: '12px',
    fontWeight: 500,
    color: COLORS.softSand,
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════════════════════════════════════════

const mockStats: ScholarStats = {
  totalResearchProjects: 12,
  activeLearning: 5,
  knowledgeNodes: 847,
  citationsManaged: 156,
  tokensUsedToday: 23450,
  tokenBudget: 100000,
};

const mockResearchProjects: ResearchProject[] = [
  {
    id: '1',
    title: 'AI Governance Frameworks',
    topic: 'Artificial Intelligence',
    status: 'active',
    sources: 34,
    citations: 28,
    lastUpdated: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'Quantum Computing Applications',
    topic: 'Physics',
    status: 'active',
    sources: 18,
    citations: 12,
    lastUpdated: Date.now() - 86400000,
  },
];

const mockLearningItems: LearningItem[] = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    type: 'flashcard_deck',
    progress: 72,
    nextReview: Date.now() + 3600000,
  },
  {
    id: '2',
    title: 'Constitutional Law Concepts',
    type: 'concept_map',
    progress: 45,
  },
];

const mockKnowledgeNodes: KnowledgeNode[] = [
  { id: '1', title: 'Neural Networks', type: 'concept', connections: 23, confidence: 0.95 },
  { id: '2', title: 'Transformer Architecture', type: 'concept', connections: 18, confidence: 0.88 },
  { id: '3', title: 'Attention Mechanism', type: 'fact', connections: 12, confidence: 0.92 },
];

// ════════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

const ScholarHeader: React.FC<{ stats: ScholarStats }> = ({ stats }) => (
  <div style={styles.header}>
    <div style={styles.headerTitle}>
      <span style={styles.sphereIcon}>🎓</span>
      <div>
        <h1 style={styles.title}>Scholar</h1>
        <p style={styles.subtitle}>Knowledge Research & Synthesis</p>
      </div>
    </div>
    <div style={styles.statsBar}>
      <div style={styles.stat}>
        <span style={styles.statValue}>{stats.totalResearchProjects}</span>
        <span style={styles.statLabel}>Projects</span>
      </div>
      <div style={styles.stat}>
        <span style={styles.statValue}>{stats.knowledgeNodes}</span>
        <span style={styles.statLabel}>Knowledge</span>
      </div>
      <div style={styles.stat}>
        <span style={styles.statValue}>{stats.citationsManaged}</span>
        <span style={styles.statLabel}>Citations</span>
      </div>
      <div style={styles.stat}>
        <span style={{ ...styles.statValue, color: COLORS.sacredGold }}>
          {Math.round((stats.tokensUsedToday / stats.tokenBudget) * 100)}%
        </span>
        <span style={styles.statLabel}>Tokens</span>
      </div>
    </div>
  </div>
);

const ResearchSection: React.FC<{ projects: ResearchProject[] }> = ({ projects }) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <span style={styles.sectionTitle}>
        <span style={styles.sectionIcon}>🔬</span>
        Research Projects
      </span>
      <button style={styles.secondaryButton}>+ New Research</button>
    </div>
    <div style={styles.sectionContent}>
      {projects.map((project) => (
        <div key={project.id} style={styles.itemCard}>
          <div>
            <p style={styles.itemTitle}>{project.title}</p>
            <span style={styles.itemMeta}>
              {project.sources} sources · {project.citations} citations
            </span>
          </div>
          <span
            style={{
              ...styles.badge,
              backgroundColor: project.status === 'active' 
                ? `${COLORS.jungleEmerald}20` 
                : `${COLORS.ancientStone}20`,
              color: project.status === 'active' 
                ? COLORS.jungleEmerald 
                : COLORS.ancientStone,
            }}
          >
            {project.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const LearningSection: React.FC<{ items: LearningItem[] }> = ({ items }) => {
  const typeIcons: Record<LearningItem['type'], string> = {
    flashcard_deck: '🃏',
    concept_map: '🗺️',
    study_guide: '📖',
    quiz: '❓',
  };
  
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>📚</span>
          Learning
        </span>
        <button style={styles.secondaryButton}>+ Create</button>
      </div>
      <div style={styles.sectionContent}>
        {items.map((item) => (
          <div key={item.id} style={styles.itemCard}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{typeIcons[item.type]}</span>
                <p style={styles.itemTitle}>{item.title}</p>
              </div>
              <div style={styles.progressBar}>
                <div 
                  style={{ 
                    ...styles.progressFill, 
                    width: `${item.progress}%` 
                  }} 
                />
              </div>
            </div>
            <span style={{ ...styles.badge, backgroundColor: `${COLORS.scholarBlue}20`, color: COLORS.scholarBlue }}>
              {item.progress}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const KnowledgeGraphSection: React.FC<{ nodes: KnowledgeNode[] }> = ({ nodes }) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <span style={styles.sectionTitle}>
        <span style={styles.sectionIcon}>🧠</span>
        Knowledge Graph
      </span>
      <button style={styles.secondaryButton}>Explore</button>
    </div>
    <div style={styles.sectionContent}>
      {nodes.map((node) => (
        <div key={node.id} style={styles.itemCard}>
          <div>
            <p style={styles.itemTitle}>{node.title}</p>
            <span style={styles.itemMeta}>
              {node.connections} connections · {Math.round(node.confidence * 100)}% confidence
            </span>
          </div>
          <span
            style={{
              ...styles.badge,
              backgroundColor: `${COLORS.cenoteTurquoise}20`,
              color: COLORS.cenoteTurquoise,
            }}
          >
            {node.type}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ToolsSection: React.FC = () => {
  const tools = [
    { icon: '🔍', name: 'Web Search' },
    { icon: '📄', name: 'Document Analysis' },
    { icon: '📊', name: 'Data Synthesis' },
    { icon: '✅', name: 'Fact Check' },
    { icon: '📝', name: 'Summarize' },
    { icon: '🔗', name: 'Citations' },
  ];
  
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>🛠️</span>
          Scholar Tools
        </span>
      </div>
      <div style={{ ...styles.sectionContent }}>
        <div style={styles.toolGrid}>
          {tools.map((tool) => (
            <div key={tool.name} style={styles.toolCard}>
              <span style={styles.toolIcon}>{tool.icon}</span>
              <span style={styles.toolName}>{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuickSearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>⚡</span>
          Quick Research
        </span>
      </div>
      <div style={styles.sectionContent}>
        <div style={styles.searchBar}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Ask anything or search your knowledge base..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.actionButton}>
            Search
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['AI Ethics', 'Climate Science', 'Economics'].map((tag) => (
            <span
              key={tag}
              style={{
                padding: '4px 12px',
                backgroundColor: COLORS.background,
                borderRadius: '16px',
                fontSize: '12px',
                color: COLORS.ancientStone,
                cursor: 'pointer',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const ScholarBureau: React.FC = () => {
  return (
    <div style={styles.container}>
      <ScholarHeader stats={mockStats} />
      
      <QuickSearchSection />
      
      <div style={styles.grid}>
        <ResearchSection projects={mockResearchProjects} />
        <LearningSection items={mockLearningItems} />
        <KnowledgeGraphSection nodes={mockKnowledgeNodes} />
        <ToolsSection />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// SCHOLAR SPECIFIC HOOKS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Hook for managing research projects
 */
export function useResearchProjects() {
  const [projects, setProjects] = useState<ResearchProject[]>(mockResearchProjects);
  
  const createProject = (title: string, topic: string) => {
    const newProject: ResearchProject = {
      id: crypto.randomUUID(),
      title,
      topic,
      status: 'active',
      sources: 0,
      citations: 0,
      lastUpdated: Date.now(),
    };
    setProjects([newProject, ...projects]);
    return newProject;
  };
  
  const archiveProject = (id: string) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, status: 'archived' as const } : p
    ));
  };
  
  return { projects, createProject, archiveProject };
}

/**
 * Hook for spaced repetition learning
 */
export function useSpacedRepetition() {
  const [items, setItems] = useState<LearningItem[]>(mockLearningItems);
  
  const getDueItems = () => {
    const now = Date.now();
    return items.filter(item => 
      item.nextReview && item.nextReview <= now
    );
  };
  
  const markReviewed = (id: string, quality: number) => {
    // Simplified SM-2 algorithm
    const interval = quality >= 3 ? Math.pow(2, quality - 2) : 1;
    const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
    
    setItems(items.map(item =>
      item.id === id ? { ...item, nextReview } : item
    ));
  };
  
  return { items, getDueItems, markReviewed };
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default ScholarBureau;
