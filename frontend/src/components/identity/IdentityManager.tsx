/**
 * CHE·NU™ Identity Management System
 * Multi-identity management with isolation and governance
 * 
 * @module identity
 * @version 33.0
 */

import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type IdentityType = 'personal' | 'business' | 'organization' | 'trust';

interface Identity {
  id: string;
  name: string;
  type: IdentityType;
  description?: string;
  avatarUrl?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  lastAccessedAt: string;
  stats: {
    spheresActive: number;
    projectsActive: number;
    agentsAssigned: number;
    tokensUsed: number;
    tokensRemaining: number;
  };
  settings: {
    defaultSphere?: string;
    notificationsEnabled: boolean;
    governanceLevel: 'standard' | 'strict' | 'enterprise';
  };
}

interface IdentityPermission {
  id: string;
  identityId: string;
  sphereId: string;
  permissions: string[];
}

interface IdentityManagerProps {
  userId: string;
  currentIdentityId?: string;
  onIdentityChange?: (identityId: string) => void;
  onCreateIdentity?: () => void;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const IDENTITY_TYPE_INFO: Record<IdentityType, { label: string; icon: string; description: string }> = {
  personal: { 
    label: 'Personnel', 
    icon: '🏠', 
    description: 'Identité personnelle pour usage individuel' 
  },
  business: { 
    label: 'Entreprise', 
    icon: '💼', 
    description: 'Identité d\'entreprise ou professionnelle' 
  },
  organization: { 
    label: 'Organisation', 
    icon: '🏢', 
    description: 'Identité d\'organisation ou association' 
  },
  trust: { 
    label: 'Fiducie', 
    icon: '🏛️', 
    description: 'Identité de fiducie ou holding' 
  },
};

// Mock data
const mockIdentities: Identity[] = [
  {
    id: 'id-personal',
    name: 'Jo Rodrigue',
    type: 'personal',
    description: 'Mon identité personnelle principale',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01',
    lastAccessedAt: '2025-01-15T10:30:00',
    stats: {
      spheresActive: 5,
      projectsActive: 12,
      agentsAssigned: 8,
      tokensUsed: 45000,
      tokensRemaining: 55000,
    },
    settings: {
      defaultSphere: 'personal',
      notificationsEnabled: true,
      governanceLevel: 'standard',
    }
  },
  {
    id: 'id-business',
    name: 'Pr0 Services Inc.',
    type: 'business',
    description: 'Mon entreprise de consultation',
    isDefault: false,
    isActive: true,
    createdAt: '2024-03-15',
    lastAccessedAt: '2025-01-14T16:00:00',
    stats: {
      spheresActive: 4,
      projectsActive: 8,
      agentsAssigned: 5,
      tokensUsed: 32000,
      tokensRemaining: 68000,
    },
    settings: {
      defaultSphere: 'business',
      notificationsEnabled: true,
      governanceLevel: 'enterprise',
    }
  },
  {
    id: 'id-holding',
    name: 'Famille Rodrigue Trust',
    type: 'trust',
    description: 'Fiducie familiale pour gestion patrimoniale',
    isDefault: false,
    isActive: false,
    createdAt: '2024-06-01',
    lastAccessedAt: '2024-12-20T09:00:00',
    stats: {
      spheresActive: 2,
      projectsActive: 3,
      agentsAssigned: 2,
      tokensUsed: 8500,
      tokensRemaining: 41500,
    },
    settings: {
      defaultSphere: 'government',
      notificationsEnabled: false,
      governanceLevel: 'strict',
    }
  }
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const IdentityCard: React.FC<{
  identity: Identity;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}> = ({ identity, isSelected, onSelect, onEdit }) => {
  const typeInfo = IDENTITY_TYPE_INFO[identity.type];
  
  return (
    <div 
      className={`bg-slate-800 rounded-xl border transition-all cursor-pointer ${
        isSelected 
          ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
          : 'border-slate-700 hover:border-slate-600'
      }`}
    >
      {/* Header */}
      <div className="p-4" onClick={onSelect}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
            identity.isActive ? 'bg-gradient-to-br from-amber-600 to-amber-800' : 'bg-slate-700'
          }`}>
            {typeInfo.icon}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{identity.name}</h3>
              {identity.isDefault && (
                <span className="text-xs bg-amber-500 px-2 py-0.5 rounded">Par défaut</span>
              )}
              {!identity.isActive && (
                <span className="text-xs bg-slate-600 px-2 py-0.5 rounded">Inactif</span>
              )}
            </div>
            <div className="text-sm text-slate-400">{typeInfo.label}</div>
            {identity.description && (
              <div className="text-xs text-slate-500 mt-1 truncate">{identity.description}</div>
            )}
          </div>
          
          {/* Edit button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 hover:bg-slate-700 rounded-lg"
          >
            ⚙️
          </button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-amber-400">{identity.stats.spheresActive}</div>
            <div className="text-xs text-slate-500">Sphères</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{identity.stats.projectsActive}</div>
            <div className="text-xs text-slate-500">Projets</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{identity.stats.agentsAssigned}</div>
            <div className="text-xs text-slate-500">Agents</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-emerald-400">
              {Math.round(identity.stats.tokensRemaining / 1000)}k
            </div>
            <div className="text-xs text-slate-500">Tokens</div>
          </div>
        </div>
      </div>
      
      {/* Token usage bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Tokens utilisés</span>
          <span>
            {Math.round(identity.stats.tokensUsed / 1000)}k / 
            {Math.round((identity.stats.tokensUsed + identity.stats.tokensRemaining) / 1000)}k
          </span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
            style={{ 
              width: `${(identity.stats.tokensUsed / (identity.stats.tokensUsed + identity.stats.tokensRemaining)) * 100}%` 
            }}
          />
        </div>
      </div>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="bg-amber-600 text-center py-2 text-sm font-medium rounded-b-xl">
          ✓ Identité Active
        </div>
      )}
    </div>
  );
};

const CreateIdentityForm: React.FC<{
  onClose: () => void;
  onCreate: (data: unknown) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<IdentityType>('personal');
  const [description, setDescription] = useState('');
  
  const handleSubmit = () => {
    if (name.trim()) {
      onCreate({ name, type, description });
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Créer une Identité</h2>
        
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Mon Entreprise Inc."
            className="w-full bg-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        {/* Type */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(IDENTITY_TYPE_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setType(key as IdentityType)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  type === key 
                    ? 'border-amber-500 bg-amber-900/30' 
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <span className="text-xl mr-2">{info.icon}</span>
                <span className="text-sm">{info.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-1">Description (optionnel)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez cette identité..."
            className="w-full bg-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500 h-20 resize-none"
          />
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            Annuler
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 rounded-lg"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const IdentityManager: React.FC<IdentityManagerProps> = ({
  userId,
  currentIdentityId,
  onIdentityChange,
  onCreateIdentity
}) => {
  const [identities, setIdentities] = useState<Identity[]>(mockIdentities);
  const [selectedId, setSelectedId] = useState(currentIdentityId || identities[0]?.id);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState<string | null>(null);
  
  const handleSelectIdentity = (identityId: string) => {
    setSelectedId(identityId);
    onIdentityChange?.(identityId);
  };
  
  const handleCreateIdentity = (data: unknown) => {
    const newIdentity: Identity = {
      id: `id-${Date.now()}`,
      name: data.name,
      type: data.type,
      description: data.description,
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      stats: {
        spheresActive: 0,
        projectsActive: 0,
        agentsAssigned: 0,
        tokensUsed: 0,
        tokensRemaining: 50000,
      },
      settings: {
        notificationsEnabled: true,
        governanceLevel: 'standard',
      }
    };
    setIdentities([...identities, newIdentity]);
  };
  
  const selectedIdentity = identities.find(i => i.id === selectedId);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>👤</span>
            <span>Gestion des Identités</span>
          </h1>
          <p className="text-slate-400">Multi-identité avec isolation et gouvernance</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center gap-2"
        >
          <span>➕</span>
          <span>Nouvelle Identité</span>
        </button>
      </div>
      
      {/* Info Banner */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="font-semibold text-blue-300">Isolation des Identités</h3>
            <p className="text-sm text-blue-200/70">
              Chaque identité est complètement isolée. Les données, agents, et budgets 
              ne peuvent pas être partagés entre identités sans autorisation explicite.
            </p>
          </div>
        </div>
      </div>
      
      {/* Identities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {identities.map(identity => (
          <IdentityCard
            key={identity.id}
            identity={identity}
            isSelected={identity.id === selectedId}
            onSelect={() => handleSelectIdentity(identity.id)}
            onEdit={() => setEditingIdentity(identity.id)}
          />
        ))}
      </div>
      
      {/* Selected Identity Details */}
      {selectedIdentity && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold mb-4">📋 Détails de l'Identité Active</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spheres Access */}
            <div>
              <h3 className="text-sm text-slate-400 mb-2">Sphères Accessibles</h3>
              <div className="flex flex-wrap gap-2">
                {['🏠 Personal', '💼 Business', '🏛️ Government', '🎨 Studio', '👥 Community'].map(sphere => (
                  <span key={sphere} className="px-3 py-1 bg-slate-700 rounded-lg text-sm">
                    {sphere}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Governance */}
            <div>
              <h3 className="text-sm text-slate-400 mb-2">Niveau de Gouvernance</h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-sm ${
                  selectedIdentity.settings.governanceLevel === 'enterprise' 
                    ? 'bg-purple-500' 
                    : selectedIdentity.settings.governanceLevel === 'strict' 
                      ? 'bg-amber-500' 
                      : 'bg-slate-600'
                }`}>
                  {selectedIdentity.settings.governanceLevel.toUpperCase()}
                </span>
                <span className="text-sm text-slate-500">
                  {selectedIdentity.settings.governanceLevel === 'enterprise' 
                    ? 'Validation à 2 étapes' 
                    : selectedIdentity.settings.governanceLevel === 'strict' 
                      ? 'Approbation requise' 
                      : 'Exécution automatique'}
                </span>
              </div>
            </div>
            
            {/* Last Access */}
            <div>
              <h3 className="text-sm text-slate-400 mb-2">Dernier Accès</h3>
              <p className="text-sm">
                {new Date(selectedIdentity.lastAccessedAt).toLocaleString('fr-CA', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                })}
              </p>
            </div>
            
            {/* Created */}
            <div>
              <h3 className="text-sm text-slate-400 mb-2">Créée le</h3>
              <p className="text-sm">
                {new Date(selectedIdentity.createdAt).toLocaleDateString('fr-CA', {
                  dateStyle: 'long'
                })}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateIdentityForm
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreateIdentity}
        />
      )}
    </div>
  );
};

export default IdentityManager;
