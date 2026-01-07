/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — OneClick Page                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useQuickActions, useExecuteAction, useToggleFavorite } from '../hooks/useEngineAPIs';
import { QuickActionCard } from '../components/engines';
import { useOneClickStore, useGovernanceStore } from '../stores';
import type { ActionCategory } from '../types';

const categories: { value: ActionCategory | ''; label: string }[] = [
  { value: '', label: 'Toutes catégories' },
  { value: 'communication', label: '💬 Communication' },
  { value: 'productivity', label: '📊 Productivité' },
  { value: 'analysis', label: '🔍 Analyse' },
  { value: 'automation', label: '⚙️ Automation' },
  { value: 'integration', label: '🔗 Intégration' },
  { value: 'custom', label: '✨ Personnalisé' },
];

const OneClickPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: actions, isLoading, error } = useQuickActions(
    selectedCategory || undefined
  );
  const executeMutation = useExecuteAction();
  const favoriteMutation = useToggleFavorite();
  
  const { favorites, isExecuting, addExecution } = useOneClickStore();
  const { addCheckpoint } = useGovernanceStore();

  const handleExecute = async (actionId: string, parameters: Record<string, unknown>) => {
    try {
      const result = await executeMutation.mutateAsync({ actionId, parameters });
      addExecution(result);
      
      if (result.checkpoint_id) {
        // Action requires checkpoint approval
        addCheckpoint({
          id: result.checkpoint_id,
          identity_id: 'current_user',
          action_type: 'oneclick_action',
          description: `Exécution de l'action ${actionId}`,
          context: { parameters },
          status: 'pending',
          priority: 'normal',
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      logger.error('Execution failed:', err);
    }
  };

  const handleToggleFavorite = (actionId: string) => {
    favoriteMutation.mutate(actionId);
  };

  // Filter actions
  const filteredActions = actions?.filter((action) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        action.name.toLowerCase().includes(query) ||
        action.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Separate favorites
  const favoriteActions = filteredActions?.filter((a) => favorites.includes(a.id));
  const otherActions = filteredActions?.filter((a) => !favorites.includes(a.id));

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ui-slate">OneClick Actions</h1>
        <p className="text-gray-500">Exécutez des actions rapides en un clic</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Rechercher une action..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cenote-turquoise focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as ActionCategory | '')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cenote-turquoise"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Favorites Section */}
      {favoriteActions && favoriteActions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-ui-slate mb-4 flex items-center gap-2">
            ⭐ Favoris
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteActions.map((action) => (
              <QuickActionCard
                key={action.id}
                action={{ ...action, is_favorite: true }}
                onExecute={handleExecute}
                onToggleFavorite={handleToggleFavorite}
                isExecuting={isExecuting}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Actions */}
      <div>
        <h2 className="text-lg font-semibold text-ui-slate mb-4">
          {selectedCategory ? categories.find((c) => c.value === selectedCategory)?.label : 'Toutes les actions'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherActions?.map((action) => (
            <QuickActionCard
              key={action.id}
              action={{ ...action, is_favorite: favorites.includes(action.id) }}
              onExecute={handleExecute}
              onToggleFavorite={handleToggleFavorite}
              isExecuting={isExecuting}
            />
          ))}
        </div>
      </div>

      {filteredActions?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-4 block">⚡</span>
          Aucune action trouvée
        </div>
      )}
    </div>
  );
};

export default OneClickPage;
