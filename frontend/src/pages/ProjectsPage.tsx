/**
 * CHE·NU — PROJECTS PAGE
 * ======================
 * Gestion complète des projets avec filtres, recherche et vues multiples
 * 
 * @version 1.0.0
 * @safe true
 */

import React, { useState, useMemo, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

type ProjectStatus = 'active' | 'completed' | 'paused' | 'planning' | 'archived';
type ProjectType = 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation';
type ViewMode = 'grid' | 'list' | 'kanban';

interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  type: ProjectType;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  teamSize: number;
  tasksCompleted: number;
  totalTasks: number;
  location: string;
  manager: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

interface FilterState {
  search: string;
  status: ProjectStatus | 'all';
  type: ProjectType | 'all';
  priority: 'all' | 'low' | 'medium' | 'high' | 'critical';
}

// =============================================================================
// MOCK DATA
// =============================================================================

const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Résidence Mont-Royal Phase 2',
    description: 'Construction de 48 unités résidentielles de luxe avec stationnement souterrain',
    client: 'Groupe Immobilier Montréal',
    type: 'residential',
    status: 'active',
    progress: 72,
    budget: 12500000,
    spent: 8750000,
    startDate: new Date('2024-03-15'),
    endDate: new Date('2025-08-30'),
    teamSize: 24,
    tasksCompleted: 156,
    totalTasks: 218,
    location: 'Montréal, QC',
    manager: 'Marc Tremblay',
    priority: 'high',
    tags: ['RBQ', 'LEED', 'Résidentiel'],
  },
  {
    id: 'proj-002',
    name: 'Tour Viger - Centre-Ville',
    description: 'Tour de bureaux de 25 étages avec certification LEED Platine',
    client: 'Investissements Québec Inc.',
    type: 'commercial',
    status: 'active',
    progress: 45,
    budget: 45000000,
    spent: 18500000,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2026-12-15'),
    teamSize: 48,
    tasksCompleted: 89,
    totalTasks: 312,
    location: 'Montréal, QC',
    manager: 'Sophie Martin',
    priority: 'critical',
    tags: ['LEED Platine', 'Commercial', 'Gratte-ciel'],
  },
  {
    id: 'proj-003',
    name: 'Centre Commercial Laval',
    description: 'Rénovation majeure et expansion du centre commercial existant',
    client: 'Centres d\'Achat du Québec',
    type: 'commercial',
    status: 'active',
    progress: 28,
    budget: 8500000,
    spent: 2125000,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-05-30'),
    teamSize: 18,
    tasksCompleted: 34,
    totalTasks: 145,
    location: 'Laval, QC',
    manager: 'Jean-Pierre Gagnon',
    priority: 'medium',
    tags: ['Rénovation', 'Commercial'],
  },
  {
    id: 'proj-004',
    name: 'Condos Fleury',
    description: 'Complexe de 32 condos avec espaces verts et piscine',
    client: 'Développements Ahuntsic',
    type: 'residential',
    status: 'active',
    progress: 91,
    budget: 6800000,
    spent: 6120000,
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-12-20'),
    teamSize: 16,
    tasksCompleted: 187,
    totalTasks: 198,
    location: 'Montréal, QC',
    manager: 'Marie-Ève Côté',
    priority: 'high',
    tags: ['Résidentiel', 'Condos'],
  },
  {
    id: 'proj-005',
    name: 'Entrepôt Logistique Mirabel',
    description: 'Construction d\'un entrepôt de 50 000 pi² avec quais de chargement',
    client: 'Transport Express Québec',
    type: 'industrial',
    status: 'planning',
    progress: 5,
    budget: 15000000,
    spent: 450000,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2026-03-30'),
    teamSize: 8,
    tasksCompleted: 12,
    totalTasks: 267,
    location: 'Mirabel, QC',
    manager: 'Pierre Lavoie',
    priority: 'medium',
    tags: ['Industriel', 'Entrepôt'],
  },
  {
    id: 'proj-006',
    name: 'Pont Sainte-Anne',
    description: 'Réfection complète du pont et renforcement structural',
    client: 'MTQ - Ministère des Transports',
    type: 'infrastructure',
    status: 'paused',
    progress: 35,
    budget: 22000000,
    spent: 7700000,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2025-11-30'),
    teamSize: 32,
    tasksCompleted: 67,
    totalTasks: 189,
    location: 'Sainte-Anne-de-Bellevue, QC',
    manager: 'François Dubois',
    priority: 'high',
    tags: ['Infrastructure', 'MTQ', 'Pont'],
  },
  {
    id: 'proj-007',
    name: 'Rénovation Maison Historique',
    description: 'Restauration d\'une maison patrimoniale de 1875',
    client: 'Patrimoine Québec',
    type: 'renovation',
    status: 'completed',
    progress: 100,
    budget: 1200000,
    spent: 1150000,
    startDate: new Date('2023-05-01'),
    endDate: new Date('2024-08-15'),
    teamSize: 8,
    tasksCompleted: 89,
    totalTasks: 89,
    location: 'Québec, QC',
    manager: 'Catherine Roy',
    priority: 'medium',
    tags: ['Rénovation', 'Patrimoine', 'Historique'],
  },
  {
    id: 'proj-008',
    name: 'École Primaire Greenfield',
    description: 'Construction d\'une nouvelle école primaire pour 450 élèves',
    client: 'Commission Scolaire de Montréal',
    type: 'commercial',
    status: 'active',
    progress: 58,
    budget: 18500000,
    spent: 9800000,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2025-08-01'),
    teamSize: 28,
    tasksCompleted: 124,
    totalTasks: 234,
    location: 'Montréal, QC',
    manager: 'Alain Bergeron',
    priority: 'high',
    tags: ['Institutionnel', 'École', 'LEED'],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M $`;
  }
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 }).format(value);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDaysRemaining(endDate: Date): number {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Actif', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  completed: { label: 'Terminé', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  paused: { label: 'En pause', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  planning: { label: 'Planification', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  archived: { label: 'Archivé', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
};

const typeConfig: Record<ProjectType, { label: string; icon: string }> = {
  residential: { label: 'Résidentiel', icon: '🏠' },
  commercial: { label: 'Commercial', icon: '🏢' },
  industrial: { label: 'Industriel', icon: '🏭' },
  infrastructure: { label: 'Infrastructure', icon: '🌉' },
  renovation: { label: 'Rénovation', icon: '🔧' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Basse', color: '#6b7280' },
  medium: { label: 'Moyenne', color: '#3b82f6' },
  high: { label: 'Haute', color: '#f59e0b' },
  critical: { label: 'Critique', color: '#ef4444' },
};

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
    padding: '24px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  } as React.CSSProperties,
  
  container: {
    maxWidth: '1600px',
    margin: '0 auto',
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  } as React.CSSProperties,
  
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,
  
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  } as React.CSSProperties,
  
  searchInput: {
    flex: '1',
    minWidth: '280px',
    padding: '12px 16px',
    paddingLeft: '44px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  } as React.CSSProperties,
  
  select: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '140px',
  } as React.CSSProperties,
  
  viewToggle: {
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '4px',
  } as React.CSSProperties,
  
  viewButton: (active: boolean) => ({
    padding: '8px 16px',
    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: active ? '#ffffff' : '#6b7280',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }) as React.CSSProperties,
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  
  card: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  cardHeader: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  } as React.CSSProperties,
  
  cardBody: {
    padding: '20px',
  } as React.CSSProperties,
  
  button: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  
  badge: (bg: string, color: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    background: bg,
    color: color,
  }) as React.CSSProperties,
  
  progressBar: {
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  progressFill: (percent: number, color: string) => ({
    height: '100%',
    width: `${percent}%`,
    background: color,
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  }) as React.CSSProperties,
  
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  } as React.CSSProperties,
  
  tag: {
    display: 'inline-flex',
    padding: '2px 8px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#9ca3af',
    marginRight: '6px',
    marginBottom: '4px',
  } as React.CSSProperties,
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const status = statusConfig[project.status];
  const type = typeConfig[project.type];
  const priority = priorityConfig[project.priority];
  const daysRemaining = getDaysRemaining(project.endDate);
  const budgetPercent = Math.round((project.spent / project.budget) * 100);
  
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.cardHeader}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{type.icon}</span>
            <span style={styles.badge(status.bg, status.color)}>{status.label}</span>
          </div>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: priority.color,
          }} title={`Priorité ${priority.label}`} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px' }}>
          {project.name}
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
          {project.description.slice(0, 100)}...
        </p>
      </div>
      
      <div style={styles.cardBody}>
        {/* Progress */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>Progression</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{project.progress}%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(project.progress, status.color)} />
          </div>
        </div>
        
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
              {formatCurrency(project.budget)}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Budget total</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: budgetPercent > 90 ? '#f59e0b' : '#10b981' }}>
              {budgetPercent}%
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Dépensé</div>
          </div>
        </div>
        
        {/* Info Row */}
        <div style={styles.statRow}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>📍 {project.location}</span>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>👤 {project.manager}</span>
        </div>
        <div style={styles.statRow}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>👥 {project.teamSize} membres</span>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>✅ {project.tasksCompleted}/{project.totalTasks}</span>
        </div>
        <div style={{ ...styles.statRow, borderBottom: 'none' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>📅 {formatDate(project.endDate)}</span>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: 500,
            color: daysRemaining < 30 ? '#f59e0b' : daysRemaining < 0 ? '#ef4444' : '#10b981',
          }}>
            {daysRemaining > 0 ? `${daysRemaining}j restants` : daysRemaining === 0 ? "Aujourd'hui" : 'En retard'}
          </span>
        </div>
        
        {/* Tags */}
        <div style={{ marginTop: '12px' }}>
          {project.tags.map((tag, i) => (
            <span key={i} style={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatsBarProps {
  projects: Project[];
}

function StatsBar({ projects }: StatsBarProps) {
  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
  }), [projects]);
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {[
        { label: 'Total Projets', value: stats.total, icon: '📁', color: '#3b82f6' },
        { label: 'Actifs', value: stats.active, icon: '🚧', color: '#10b981' },
        { label: 'Terminés', value: stats.completed, icon: '✅', color: '#8b5cf6' },
        { label: 'Budget Total', value: formatCurrency(stats.totalBudget), icon: '💰', color: '#f59e0b' },
        { label: 'Dépensé', value: formatCurrency(stats.totalSpent), icon: '📊', color: '#ef4444' },
      ].map((stat, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `${stat.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}>
            {stat.icon}
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    type: 'all',
    priority: 'all',
  });
  
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      if (filters.search && !project.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !project.client.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.status !== 'all' && project.status !== filters.status) return false;
      if (filters.type !== 'all' && project.type !== filters.type) return false;
      if (filters.priority !== 'all' && project.priority !== filters.priority) return false;
      return true;
    });
  }, [filters]);
  
  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <span style={{ fontSize: '32px' }}>📁</span>
              Projets
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0 0' }}>
              Gérez et suivez vos projets de construction
            </p>
          </div>
          <button style={styles.button}>
            <span>+</span> Nouveau Projet
          </button>
        </div>
        
        {/* Stats Bar */}
        <StatsBar projects={mockProjects} />
        
        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher un projet..."
              style={styles.searchInput}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <select
            style={styles.select}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="completed">Terminés</option>
            <option value="paused">En pause</option>
            <option value="planning">Planification</option>
            <option value="archived">Archivés</option>
          </select>
          
          <select
            style={styles.select}
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Tous les types</option>
            <option value="residential">Résidentiel</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industriel</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="renovation">Rénovation</option>
          </select>
          
          <select
            style={styles.select}
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="all">Toutes priorités</option>
            <option value="critical">Critique</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
          
          <div style={styles.viewToggle}>
            {(['grid', 'list', 'kanban'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                style={styles.viewButton(viewMode === mode)}
                onClick={() => setViewMode(mode)}
              >
                {mode === 'grid' ? '⊞' : mode === 'list' ? '☰' : '▦'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results Count */}
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
          {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
        </div>
        
        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div style={styles.grid}>
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onClick={() => console.log('Open project:', project.id)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '18px', color: '#ffffff', margin: '0 0 8px' }}>Aucun projet trouvé</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Essayez de modifier vos filtres ou créez un nouveau projet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
