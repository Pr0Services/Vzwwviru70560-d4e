/**
 * CHE·NU - Dynamic Modules Components
 * ====================================
 * Composants React pour afficher et gérer les modules dynamiques.
 * 
 * @version 1.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Puzzle, Plus, Check, X, Loader2, AlertCircle,
  ChevronRight, Settings, Trash2, Power, PowerOff,
  Bot, Sparkles, Info
} from 'lucide-react';

// Types
interface DynamicModule {
  id: string;
  scope: string;
  category: string;
  key: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
  actions: ModuleAction[];
  is_enabled: boolean;
  is_approved: boolean;
  created_by_agent?: string;
  usage_count: number;
  created_at: string;
}

interface ModuleAction {
  key: string;
  label: string;
  description?: string;
  icon: string;
}

interface ModuleProposal {
  id: string;
  scope: string;
  category: string;
  key: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
  reason: string;
  proposed_by_agent: string;
  expires_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

// Hooks
const useDynamicModules = (scope?: string) => {
  const [modules, setModules] = useState<DynamicModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      const url = scope ? `/api/v1/modules/dynamic/${scope}` : '/api/v1/modules/dynamic';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      setModules(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => { fetchModules(); }, [fetchModules]);
  return { modules, loading, error, refetch: fetchModules };
};

const useModuleProposals = () => {
  const [proposals, setProposals] = useState<ModuleProposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/modules/proposals');
      if (!response.ok) throw new Error('Erreur');
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (err) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  const approveProposal = async (proposalId: string) => {
    const response = await fetch(`/api/v1/modules/proposals/${proposalId}/approve`, { method: 'POST' });
    if (response.ok) await fetchProposals();
    return response.ok;
  };

  const rejectProposal = async (proposalId: string, reason?: string) => {
    const response = await fetch(`/api/v1/modules/proposals/${proposalId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (response.ok) await fetchProposals();
    return response.ok;
  };

  return { proposals, loading, refetch: fetchProposals, approveProposal, rejectProposal };
};

// Carte de module
const ModuleCard: React.FC<{
  module: DynamicModule;
  onSelect?: (module: DynamicModule) => void;
  onDisable?: (moduleId: string) => void;
  onEnable?: (moduleId: string) => void;
  compact?: boolean;
}> = ({ module, onSelect, onDisable, onEnable, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative group rounded-xl border transition-all duration-200 cursor-pointer
        ${module.is_enabled ? 'bg-ui-slate/50 border-ancient-stone/20 hover:border-sacred-gold/50' : 'bg-ui-slate/30 border-ancient-stone/10 opacity-60'}
        ${compact ? 'p-3' : 'p-4'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(module)}
    >
      {module.created_by_agent && (
        <div className="absolute -top-2 -right-2 bg-cenote-turquoise text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Bot size={10} /><span>IA</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${module.color}20` }}>
          <Puzzle size={20} style={{ color: module.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-soft-sand truncate">{module.label}</h4>
          {!compact && module.description && <p className="text-sm text-ancient-stone mt-1 line-clamp-2">{module.description}</p>}
          {!compact && module.actions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {module.actions.slice(0, 3).map(action => (
                <span key={action.key} className="text-xs bg-ui-slate px-2 py-0.5 rounded text-ancient-stone">{action.label}</span>
              ))}
              {module.actions.length > 3 && <span className="text-xs text-ancient-stone">+{module.actions.length - 3}</span>}
            </div>
          )}
          {!compact && (
            <div className="flex items-center gap-3 mt-2 text-xs text-ancient-stone">
              <span>{module.usage_count} utilisations</span>
              <span>•</span>
              <span>{module.category}</span>
            </div>
          )}
        </div>
        <div className={`flex items-center gap-1 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          {module.is_enabled ? (
            <button onClick={(e) => { e.stopPropagation(); onDisable?.(module.id); }} className="p-1.5 rounded hover:bg-red-500/20 text-ancient-stone hover:text-red-400" title="Désactiver">
              <PowerOff size={16} />
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onEnable?.(module.id); }} className="p-1.5 rounded hover:bg-green-500/20 text-ancient-stone hover:text-green-400" title="Activer">
              <Power size={16} />
            </button>
          )}
          <ChevronRight size={16} className="text-ancient-stone" />
        </div>
      </div>
    </div>
  );
};

// Carte de proposition IA
const ModuleProposalCard: React.FC<{
  proposal: ModuleProposal;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string, reason?: string) => Promise<boolean>;
}> = ({ proposal, onApprove, onReject }) => {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    setLoading('approve');
    await onApprove(proposal.id);
    setLoading(null);
  };

  const handleReject = async () => {
    setLoading('reject');
    await onReject(proposal.id, rejectReason || undefined);
    setLoading(null);
    setShowRejectReason(false);
  };

  const expiresIn = new Date(proposal.expires_at).getTime() - Date.now();
  const daysLeft = Math.ceil(expiresIn / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gradient-to-r from-cenote-turquoise/10 to-sacred-gold/10 border border-cenote-turquoise/30 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cenote-turquoise/20 flex items-center justify-center">
            <Bot size={16} className="text-cenote-turquoise" />
          </div>
          <div>
            <p className="text-sm text-cenote-turquoise font-medium">Proposition de {proposal.proposed_by_agent}</p>
            <p className="text-xs text-ancient-stone">Expire dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}</p>
          </div>
        </div>
        <Sparkles size={16} className="text-sacred-gold" />
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-soft-sand flex items-center gap-2">
          <Puzzle size={16} style={{ color: proposal.color }} />
          {proposal.label}
        </h4>
        {proposal.description && <p className="text-sm text-ancient-stone mt-1">{proposal.description}</p>}
        <div className="mt-3 p-3 bg-ui-slate/50 rounded-lg">
          <p className="text-xs text-ancient-stone mb-1 flex items-center gap-1"><Info size={12} />Pourquoi ce module ?</p>
          <p className="text-sm text-soft-sand">{proposal.reason}</p>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-ancient-stone">
          <span>Scope: {proposal.scope}</span><span>•</span><span>Catégorie: {proposal.category}</span>
        </div>
      </div>

      {showRejectReason ? (
        <div className="space-y-2">
          <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Raison du refus (optionnel)"
            className="w-full px-3 py-2 bg-ui-slate border border-ancient-stone/30 rounded-lg text-sm text-soft-sand placeholder:text-ancient-stone/50" />
          <div className="flex gap-2">
            <button onClick={handleReject} disabled={loading === 'reject'}
              className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 disabled:opacity-50">
              {loading === 'reject' ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Confirmer le refus'}
            </button>
            <button onClick={() => setShowRejectReason(false)} className="px-4 py-2 bg-ancient-stone/20 text-ancient-stone rounded-lg text-sm">Annuler</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={handleApprove} disabled={loading === 'approve'}
            className="flex-1 px-4 py-2 bg-cenote-turquoise text-ui-slate rounded-lg text-sm font-medium hover:bg-cenote-turquoise/90 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading === 'approve' ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} />Approuver</>}
          </button>
          <button onClick={() => setShowRejectReason(true)}
            className="px-4 py-2 bg-ancient-stone/20 text-ancient-stone rounded-lg text-sm hover:bg-ancient-stone/30 flex items-center gap-2">
            <X size={16} />Refuser
          </button>
        </div>
      )}
    </div>
  );
};

// Liste principale
export const DynamicModulesList: React.FC<{
  scope: string;
  scopeLabel: string;
  onModuleSelect?: (module: DynamicModule) => void;
}> = ({ scope, scopeLabel, onModuleSelect }) => {
  const { modules, loading, error, refetch } = useDynamicModules(scope);
  const { proposals, approveProposal, rejectProposal } = useModuleProposals();
  const [showDisabled, setShowDisabled] = useState(false);

  const scopeProposals = proposals.filter(p => p.scope === scope);
  const activeModules = modules.filter(m => m.is_enabled);
  const disabledModules = modules.filter(m => !m.is_enabled);

  const handleDisable = async (moduleId: string) => {
    await fetch(`/api/v1/modules/dynamic/${moduleId}`, { method: 'DELETE' });
    refetch();
  };

  const handleEnable = async (moduleId: string) => {
    await fetch(`/api/v1/modules/dynamic/${moduleId}/enable`, { method: 'POST' });
    refetch();
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-sacred-gold" /></div>;
  if (error) return <div className="flex items-center gap-2 text-red-400 py-8 justify-center"><AlertCircle size={20} /><span>{error}</span></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-soft-sand flex items-center gap-2">
            <Puzzle size={20} className="text-sacred-gold" />Modules personnalisés
          </h3>
          <p className="text-sm text-ancient-stone mt-1">{scopeLabel} • {activeModules.length} module{activeModules.length > 1 ? 's' : ''} actif{activeModules.length > 1 ? 's' : ''}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-sacred-gold/20 text-sacred-gold rounded-lg hover:bg-sacred-gold/30 transition-colors">
          <Plus size={16} />Nouveau module
        </button>
      </div>

      {scopeProposals.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-cenote-turquoise flex items-center gap-2">
            <Sparkles size={14} />Propositions de vos agents IA ({scopeProposals.length})
          </h4>
          {scopeProposals.map(proposal => (
            <ModuleProposalCard key={proposal.id} proposal={proposal}
              onApprove={async (id) => { const success = await approveProposal(id); if (success) refetch(); return success; }}
              onReject={rejectProposal} />
          ))}
        </div>
      )}

      {activeModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeModules.map(module => <ModuleCard key={module.id} module={module} onSelect={onModuleSelect} onDisable={handleDisable} />)}
        </div>
      ) : (
        <div className="text-center py-12 text-ancient-stone">
          <Puzzle size={48} className="mx-auto mb-4 opacity-30" />
          <p>Aucun module personnalisé</p>
          <p className="text-sm mt-1">Créez-en un ou laissez Nova vous en proposer !</p>
        </div>
      )}

      {disabledModules.length > 0 && (
        <div>
          <button onClick={() => setShowDisabled(!showDisabled)} className="text-sm text-ancient-stone hover:text-soft-sand flex items-center gap-2">
            <ChevronRight size={16} className={`transition-transform ${showDisabled ? 'rotate-90' : ''}`} />
            {disabledModules.length} module{disabledModules.length > 1 ? 's' : ''} désactivé{disabledModules.length > 1 ? 's' : ''}
          </button>
          {showDisabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {disabledModules.map(module => <ModuleCard key={module.id} module={module} onSelect={onModuleSelect} onEnable={handleEnable} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const DynamicModulesSection: React.FC<{ currentScope: string; scopeLabel: string; }> = ({ currentScope, scopeLabel }) => {
  const [selectedModule, setSelectedModule] = useState<DynamicModule | null>(null);

  return (
    <div className="bg-ui-slate/30 border border-ancient-stone/20 rounded-2xl p-6">
      <DynamicModulesList scope={currentScope} scopeLabel={scopeLabel} onModuleSelect={setSelectedModule} />
      {selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedModule(null)}>
          <div className="bg-ui-slate border border-ancient-stone/30 rounded-2xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-medium text-soft-sand">{selectedModule.label}</h3>
              <button onClick={() => setSelectedModule(null)} className="text-ancient-stone hover:text-soft-sand"><X size={20} /></button>
            </div>
            <p className="text-ancient-stone mb-4">{selectedModule.description}</p>
            <h4 className="text-sm font-medium text-soft-sand mb-2">Actions disponibles</h4>
            <div className="space-y-2">
              {selectedModule.actions.map(action => (
                <button key={action.key} className="w-full text-left px-4 py-3 bg-ancient-stone/10 rounded-lg hover:bg-ancient-stone/20 transition-colors">
                  <span className="text-soft-sand">{action.label}</span>
                  {action.description && <p className="text-xs text-ancient-stone mt-1">{action.description}</p>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicModulesList;
