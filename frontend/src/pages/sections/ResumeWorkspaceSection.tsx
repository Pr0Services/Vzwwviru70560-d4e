/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — RESUME WORKSPACE SECTION                        ║
 * ║                    📋 Espace de Travail — Reprise des travaux               ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Interface pour reprendre le travail en cours:                               ║
 * ║  • Projets actifs                                                            ║
 * ║  • Documents récents                                                         ║
 * ║  • Tâches en cours                                                           ║
 * ║  • Sessions précédentes                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

interface ResumeWorkspaceSectionProps {
  sphereId: string;
  sphereName: string;
  sphereColor: string;
}

interface WorkItem {
  id: string;
  type: 'project' | 'document' | 'task' | 'thread';
  title: string;
  description?: string;
  lastModified: Date;
  progress?: number;
  priority?: 'low' | 'medium' | 'high';
  status: 'active' | 'paused' | 'blocked';
}

export const ResumeWorkspaceSection: React.FC<ResumeWorkspaceSectionProps> = ({
  sphereId,
  sphereName,
  sphereColor,
}) => {
  const [filter, setFilter] = useState<'all' | 'projects' | 'documents' | 'tasks'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'priority' | 'progress'>('recent');

  // Demo data
  const [workItems] = useState<WorkItem[]>([
    {
      id: '1',
      type: 'project',
      title: 'Refonte Site Web',
      description: 'Modernisation du site corporate avec nouveau design',
      lastModified: new Date(Date.now() - 3600000),
      progress: 65,
      priority: 'high',
      status: 'active',
    },
    {
      id: '2',
      type: 'document',
      title: 'Rapport Q4 2025',
      description: 'Rapport trimestriel des performances',
      lastModified: new Date(Date.now() - 7200000),
      progress: 80,
      status: 'active',
    },
    {
      id: '3',
      type: 'task',
      title: 'Réviser proposition client',
      lastModified: new Date(Date.now() - 86400000),
      priority: 'medium',
      status: 'paused',
    },
    {
      id: '4',
      type: 'thread',
      title: 'Discussion stratégie 2026',
      description: '5 participants',
      lastModified: new Date(Date.now() - 172800000),
      status: 'active',
    },
  ]);

  const filteredItems = workItems
    .filter(item => filter === 'all' || 
      (filter === 'projects' && item.type === 'project') ||
      (filter === 'documents' && item.type === 'document') ||
      (filter === 'tasks' && (item.type === 'task' || item.type === 'thread'))
    )
    .sort((a, b) => {
      if (sortBy === 'recent') return b.lastModified.getTime() - a.lastModified.getTime();
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
        return (priorityOrder[a.priority!] ?? 3) - (priorityOrder[b.priority!] ?? 3);
      }
      if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0);
      return 0;
    });

  const getTypeIcon = (type: WorkItem['type']) => {
    switch (type) {
      case 'project': return '📁';
      case 'document': return '📄';
      case 'task': return '✅';
      case 'thread': return '💬';
    }
  };

  const getStatusBadge = (status: WorkItem['status']) => {
    switch (status) {
      case 'active': return { label: 'Actif', color: '#4ade80' };
      case 'paused': return { label: 'En pause', color: '#f59e0b' };
      case 'blocked': return { label: 'Bloqué', color: '#ef4444' };
    }
  };

  return (
    <div className="resume-workspace-section">
      {/* Header */}
      <div className="section-header">
        <div className="header-title">
          <span className="header-icon">📋</span>
          <h2>Espace de Travail</h2>
          <span className="sphere-badge" style={{ background: sphereColor }}>
            {sphereName}
          </span>
        </div>
        <div className="header-actions">
          <button className="new-btn" style={{ background: sphereColor }}>
            + Nouveau
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-value">{workItems.filter(i => i.status === 'active').length}</span>
          <span className="stat-label">En cours</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{workItems.filter(i => i.priority === 'high').length}</span>
          <span className="stat-label">Prioritaires</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {Math.round(workItems.reduce((sum, i) => sum + (i.progress || 0), 0) / workItems.length)}%
          </span>
          <span className="stat-label">Progression moy.</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{workItems.filter(i => i.status === 'blocked').length}</span>
          <span className="stat-label">Bloqués</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          {(['all', 'projects', 'documents', 'tasks'] as const).map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              style={{ '--accent': sphereColor } as React.CSSProperties}
            >
              {f === 'all' && 'Tout'}
              {f === 'projects' && '📁 Projets'}
              {f === 'documents' && '📄 Documents'}
              {f === 'tasks' && '✅ Tâches'}
            </button>
          ))}
        </div>
        <div className="sort-group">
          <span className="sort-label">Trier par:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="recent">Plus récent</option>
            <option value="priority">Priorité</option>
            <option value="progress">Progression</option>
          </select>
        </div>
      </div>

      {/* Work Items Grid */}
      <div className="work-items-grid">
        {filteredItems.map(item => {
          const status = getStatusBadge(item.status);
          return (
            <div key={item.id} className="work-card" style={{ '--accent': sphereColor } as React.CSSProperties}>
              <div className="card-header">
                <span className="card-type">{getTypeIcon(item.type)}</span>
                <span className="card-status" style={{ background: status.color }}>
                  {status.label}
                </span>
              </div>
              
              <h3 className="card-title">{item.title}</h3>
              {item.description && (
                <p className="card-description">{item.description}</p>
              )}
              
              {item.progress !== undefined && (
                <div className="card-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${item.progress}%`, background: sphereColor }}
                    />
                  </div>
                  <span className="progress-text">{item.progress}%</span>
                </div>
              )}
              
              <div className="card-footer">
                <span className="card-time">
                  Modifié {formatRelativeTime(item.lastModified)}
                </span>
                {item.priority && (
                  <span className={`card-priority priority-${item.priority}`}>
                    {item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟠' : '🟢'}
                  </span>
                )}
              </div>
              
              <div className="card-actions">
                <button className="action-btn primary" style={{ background: sphereColor }}>
                  Reprendre →
                </button>
                <button className="action-btn secondary">⋮</button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>Aucun élément de travail</p>
          <button className="empty-btn" style={{ background: sphereColor }}>
            Créer un nouveau projet
          </button>
        </div>
      )}

      <style>{`
        .resume-workspace-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon { font-size: 28px; }

        .header-title h2 {
          font-size: 24px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0;
        }

        .sphere-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: #000;
        }

        .new-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .new-btn:hover { transform: scale(1.02); }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #1e2420;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #e8e4dc;
        }

        .stat-label {
          font-size: 14px;
          color: #6b6560;
        }

        .filters-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 12px;
          background: #1e2420;
          border-radius: 12px;
        }

        .filter-group {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
          background: transparent;
          color: #a8a29e;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: var(--accent);
          color: #e8e4dc;
        }

        .filter-btn.active {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
        }

        .sort-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-label {
          font-size: 14px;
          color: #6b6560;
        }

        .sort-group select {
          background: #121614;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 8px 12px;
          color: #e8e4dc;
          cursor: pointer;
        }

        .work-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .work-card {
          background: #1e2420;
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .work-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .card-type { font-size: 24px; }

        .card-status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #000;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0 0 8px;
        }

        .card-description {
          font-size: 14px;
          color: #6b6560;
          margin: 0 0 16px;
        }

        .card-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: #2a2a2a;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 12px;
          color: #a8a29e;
          font-weight: 600;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-time {
          font-size: 12px;
          color: #6b6560;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-btn.primary {
          flex: 1;
          color: #000;
        }

        .action-btn.primary:hover { transform: scale(1.02); }

        .action-btn.secondary {
          background: #2a2a2a;
          color: #a8a29e;
          padding: 8px 12px;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          color: #6b6560;
        }

        .empty-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 16px;
        }

        .empty-btn {
          margin-top: 16px;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .quick-stats { grid-template-columns: repeat(2, 1fr); }
          .filters-bar { flex-direction: column; gap: 12px; }
          .work-items-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export default ResumeWorkspaceSection;
