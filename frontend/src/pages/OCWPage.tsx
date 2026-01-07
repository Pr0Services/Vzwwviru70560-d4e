/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — OCW Page                                    ║
 * ║                    Orchestrated Collaborative Workspace                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import {
  useWorkspaces,
  useCreateWorkspace,
} from '../hooks/useEngineAPIs';
import { WorkspaceCard } from '../components/engines';
import { useOCWStore } from '../stores';
import type { WorkspaceType, WorkspaceVisibility } from '../types';

const OCWPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<WorkspaceType | ''>('');
  const [showArchived, setShowArchived] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: workspaces, isLoading, error } = useWorkspaces();
  const createMutation = useCreateWorkspace();
  const { setCurrentWorkspace } = useOCWStore();

  const handleOpen = (workspaceId: string) => {
    const workspace = workspaces?.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      window.location.href = `/ocw/${workspaceId}`;
    }
  };

  const handleArchive = async (workspaceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir archiver ce workspace?')) {
      logger.debug('Archive:', workspaceId);
    }
  };

  // Filter workspaces
  const filteredWorkspaces = workspaces?.filter((workspace) => {
    if (!showArchived && workspace.is_archived) return false;
    if (typeFilter && workspace.type !== typeFilter) return false;
    return true;
  });

  // Group by type
  const groupedWorkspaces = filteredWorkspaces?.reduce((acc, workspace) => {
    const type = workspace.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(workspace);
    return acc;
  }, {} as Record<WorkspaceType, typeof workspaces>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Erreur: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ui-slate">
            Espaces Collaboratifs
          </h1>
          <p className="text-gray-500">
            Orchestrated Collaborative Workspace (OCW)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-cenote-turquoise text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          + Nouveau workspace
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-chenu shadow-chenu text-center">
          <div className="text-3xl font-bold text-ui-slate">
            {workspaces?.length || 0}
          </div>
          <div className="text-sm text-gray-500">Total Workspaces</div>
        </div>
        <div className="bg-white p-4 rounded-chenu shadow-chenu text-center">
          <div className="text-3xl font-bold text-cenote-turquoise">
            {workspaces?.filter((w) => !w.is_archived).length || 0}
          </div>
          <div className="text-sm text-gray-500">Actifs</div>
        </div>
        <div className="bg-white p-4 rounded-chenu shadow-chenu text-center">
          <div className="text-3xl font-bold text-jungle-emerald">
            {workspaces?.reduce((sum, w) => sum + w.stats.member_count, 0) || 0}
          </div>
          <div className="text-sm text-gray-500">Membres totaux</div>
        </div>
        <div className="bg-white p-4 rounded-chenu shadow-chenu text-center">
          <div className="text-3xl font-bold text-sacred-gold">
            {workspaces?.reduce((sum, w) => sum + w.stats.active_agent_count, 0) || 0}
          </div>
          <div className="text-sm text-gray-500">Agents actifs</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as WorkspaceType | '')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cenote-turquoise"
        >
          <option value="">Tous les types</option>
          <option value="project">📁 Projet</option>
          <option value="team">👥 Équipe</option>
          <option value="department">🏢 Département</option>
          <option value="organization">🌐 Organisation</option>
          <option value="temporary">⏰ Temporaire</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-cenote-turquoise focus:ring-cenote-turquoise"
          />
          <span className="text-gray-600">Afficher archivés</span>
        </label>
      </div>

      {/* Workspaces by Type */}
      {groupedWorkspaces && Object.entries(groupedWorkspaces).map(([type, items]) => (
        <div key={type} className="mb-8">
          <h2 className="text-lg font-semibold text-ui-slate mb-4 capitalize">
            {type === 'project' && '📁 Projets'}
            {type === 'team' && '👥 Équipes'}
            {type === 'department' && '🏢 Départements'}
            {type === 'organization' && '🌐 Organisations'}
            {type === 'temporary' && '⏰ Temporaires'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items?.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onOpen={handleOpen}
                onSettings={(id) => logger.debug('Settings:', id)}
                onArchive={handleArchive}
                currentUserId="current_user"
              />
            ))}
          </div>
        </div>
      ))}

      {filteredWorkspaces?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-4 block">📁</span>
          Aucun workspace trouvé
        </div>
      )}
    </div>
  );
};

export default OCWPage;
