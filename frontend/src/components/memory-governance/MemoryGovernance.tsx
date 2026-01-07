/**
 * CHE·NU™ Memory Governance System
 * User data control, retention policies, and privacy management
 * 
 * @module memory-governance
 * @version 33.0
 */

import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type DataCategory = 'conversations' | 'documents' | 'decisions' | 'analytics' | 'preferences' | 'agents';
type RetentionPeriod = '30_days' | '90_days' | '1_year' | '3_years' | 'indefinite';
type PrivacyLevel = 'public' | 'shared' | 'private' | 'encrypted';

interface MemoryItem {
  id: string;
  category: DataCategory;
  title: string;
  description?: string;
  size: number;
  createdAt: string;
  lastAccessedAt: string;
  retentionPolicy: RetentionPeriod;
  privacyLevel: PrivacyLevel;
  expiresAt?: string;
}

interface RetentionPolicy {
  category: DataCategory;
  defaultPeriod: RetentionPeriod;
  autoDelete: boolean;
  requiresApproval: boolean;
}

interface PrivacySettings {
  dataCollection: boolean;
  analyticsEnabled: boolean;
  agentMemoryEnabled: boolean;
  crossIdentitySharing: boolean;
  thirdPartyAccess: boolean;
}

interface MemoryStats {
  totalItems: number;
  totalSize: number;
  byCategory: Record<DataCategory, { count: number; size: number }>;
  expiringWithin30Days: number;
}

interface MemoryGovernanceProps {
  identityId: string;
  onExport?: () => void;
  onDeleteAll?: () => void;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const CATEGORY_INFO: Record<DataCategory, { label: string; icon: string; description: string }> = {
  conversations: { 
    label: 'Conversations', 
    icon: '💬', 
    description: 'Historique des conversations avec Nova et agents' 
  },
  documents: { 
    label: 'Documents', 
    icon: '📄', 
    description: 'Documents, fichiers et médias uploadés' 
  },
  decisions: { 
    label: 'Décisions', 
    icon: '✅', 
    description: 'Historique des décisions et approbations' 
  },
  analytics: { 
    label: 'Analytiques', 
    icon: '📊', 
    description: 'Données d\'utilisation et métriques' 
  },
  preferences: { 
    label: 'Préférences', 
    icon: '⚙️', 
    description: 'Paramètres et configurations personnalisées' 
  },
  agents: { 
    label: 'Mémoire Agents', 
    icon: '🤖', 
    description: 'Contexte et apprentissage des agents' 
  },
};

const RETENTION_LABELS: Record<RetentionPeriod, string> = {
  '30_days': '30 jours',
  '90_days': '90 jours',
  '1_year': '1 an',
  '3_years': '3 ans',
  'indefinite': 'Indéfini',
};

const PRIVACY_LABELS: Record<PrivacyLevel, { label: string; icon: string; color: string }> = {
  public: { label: 'Public', icon: '🌐', color: 'emerald' },
  shared: { label: 'Partagé', icon: '👥', color: 'blue' },
  private: { label: 'Privé', icon: '🔒', color: 'amber' },
  encrypted: { label: 'Chiffré', icon: '🔐', color: 'purple' },
};

// Mock data
const mockStats: MemoryStats = {
  totalItems: 1247,
  totalSize: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
  byCategory: {
    conversations: { count: 456, size: 0.3 * 1024 * 1024 * 1024 },
    documents: { count: 234, size: 1.5 * 1024 * 1024 * 1024 },
    decisions: { count: 189, size: 0.1 * 1024 * 1024 * 1024 },
    analytics: { count: 156, size: 0.2 * 1024 * 1024 * 1024 },
    preferences: { count: 45, size: 0.05 * 1024 * 1024 * 1024 },
    agents: { count: 167, size: 0.25 * 1024 * 1024 * 1024 },
  },
  expiringWithin30Days: 23,
};

const mockPolicies: RetentionPolicy[] = [
  { category: 'conversations', defaultPeriod: '90_days', autoDelete: false, requiresApproval: true },
  { category: 'documents', defaultPeriod: '3_years', autoDelete: false, requiresApproval: true },
  { category: 'decisions', defaultPeriod: 'indefinite', autoDelete: false, requiresApproval: true },
  { category: 'analytics', defaultPeriod: '1_year', autoDelete: true, requiresApproval: false },
  { category: 'preferences', defaultPeriod: 'indefinite', autoDelete: false, requiresApproval: false },
  { category: 'agents', defaultPeriod: '1_year', autoDelete: false, requiresApproval: true },
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}> = ({ label, value, icon, color = 'slate' }) => (
  <div className={`bg-${color}-900/30 border border-${color}-700/50 rounded-xl p-4`}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </div>
  </div>
);

const CategoryCard: React.FC<{
  category: DataCategory;
  stats: { count: number; size: number };
  policy: RetentionPolicy;
  onViewDetails: () => void;
}> = ({ category, stats, policy, onViewDetails }) => {
  const info = CATEGORY_INFO[category];
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{info.icon}</span>
          <div>
            <h3 className="font-semibold">{info.label}</h3>
            <p className="text-xs text-slate-500">{info.description}</p>
          </div>
        </div>
        <button 
          onClick={onViewDetails}
          className="text-xs text-amber-400 hover:text-amber-300"
        >
          Détails →
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-lg font-semibold">{stats.count}</div>
          <div className="text-xs text-slate-500">éléments</div>
        </div>
        <div>
          <div className="text-lg font-semibold">{formatSize(stats.size)}</div>
          <div className="text-xs text-slate-500">utilisé</div>
        </div>
      </div>
      
      <div className="pt-3 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Rétention:</span>
          <span className="text-slate-300">{RETENTION_LABELS[policy.defaultPeriod]}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-slate-500">Auto-suppression:</span>
          <span className={policy.autoDelete ? 'text-emerald-400' : 'text-slate-400'}>
            {policy.autoDelete ? 'Oui' : 'Non'}
          </span>
        </div>
      </div>
    </div>
  );
};

const PrivacyToggle: React.FC<{
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  dangerous?: boolean;
}> = ({ label, description, enabled, onChange, dangerous }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg ${
    dangerous ? 'bg-red-900/20 border border-red-700/50' : 'bg-slate-800'
  }`}>
    <div>
      <div className={`font-medium ${dangerous ? 'text-red-300' : ''}`}>{label}</div>
      <div className="text-xs text-slate-500">{description}</div>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-emerald-500' : 'bg-slate-600'
      }`}
    >
      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`} />
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const MemoryGovernance: React.FC<MemoryGovernanceProps> = ({
  identityId,
  onExport,
  onDeleteAll
}) => {
  const [stats] = useState<MemoryStats>(mockStats);
  const [policies, setPolicies] = useState<RetentionPolicy[]>(mockPolicies);
  const [activeTab, setActiveTab] = useState<'overview' | 'retention' | 'privacy' | 'export'>('overview');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataCollection: true,
    analyticsEnabled: true,
    agentMemoryEnabled: true,
    crossIdentitySharing: false,
    thirdPartyAccess: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean) => {
    setPrivacySettings({ ...privacySettings, [key]: value });
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🧠</span>
            <span>Memory Governance</span>
          </h1>
          <p className="text-slate-400">Contrôle de vos données, rétention et confidentialité</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onExport}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2"
          >
            <span>📤</span>
            <span>Exporter</span>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'overview', label: 'Aperçu', icon: '📊' },
          { id: 'retention', label: 'Rétention', icon: '🗓️' },
          { id: 'privacy', label: 'Confidentialité', icon: '🔒' },
          { id: 'export', label: 'Export & Suppression', icon: '📦' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === tab.id 
                ? 'bg-amber-600' 
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              label="Total Éléments" 
              value={stats.totalItems.toLocaleString()} 
              icon="📁"
            />
            <StatCard 
              label="Stockage Utilisé" 
              value={formatSize(stats.totalSize)} 
              icon="💾"
              color="blue"
            />
            <StatCard 
              label="Expire dans 30j" 
              value={stats.expiringWithin30Days} 
              icon="⏰"
              color="amber"
            />
            <StatCard 
              label="Catégories" 
              value={Object.keys(stats.byCategory).length} 
              icon="📂"
            />
          </div>
          
          {/* Categories */}
          <h2 className="text-lg font-semibold mb-4">📁 Par Catégorie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.byCategory).map(([category, categoryStats]) => (
              <CategoryCard
                key={category}
                category={category as DataCategory}
                stats={categoryStats}
                policy={policies.find(p => p.category === category)!}
                onViewDetails={() => {}}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Retention Tab */}
      {activeTab === 'retention' && (
        <div className="space-y-4">
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-300">Politique de Rétention</h3>
                <p className="text-sm text-blue-200/70">
                  Configurez combien de temps vos données sont conservées. Les données expirées 
                  peuvent être supprimées automatiquement ou nécessiter votre approbation.
                </p>
              </div>
            </div>
          </div>
          
          {policies.map(policy => {
            const info = CATEGORY_INFO[policy.category];
            return (
              <div key={policy.category} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <h3 className="font-semibold">{info.label}</h3>
                      <p className="text-xs text-slate-500">{info.description}</p>
                    </div>
                  </div>
                  <select
                    value={policy.defaultPeriod}
                    onChange={(e) => {
                      const updated = policies.map(p => 
                        p.category === policy.category 
                          ? { ...p, defaultPeriod: e.target.value as RetentionPeriod }
                          : p
                      );
                      setPolicies(updated);
                    }}
                    className="bg-slate-700 rounded-lg px-3 py-2 text-sm"
                  >
                    {Object.entries(RETENTION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700">
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      checked={policy.autoDelete}
                      onChange={(e) => {
                        const updated = policies.map(p => 
                          p.category === policy.category 
                            ? { ...p, autoDelete: e.target.checked }
                            : p
                        );
                        setPolicies(updated);
                      }}
                      className="rounded"
                    />
                    Auto-suppression
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      checked={policy.requiresApproval}
                      onChange={(e) => {
                        const updated = policies.map(p => 
                          p.category === policy.category 
                            ? { ...p, requiresApproval: e.target.checked }
                            : p
                        );
                        setPolicies(updated);
                      }}
                      className="rounded"
                    />
                    Approbation requise
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-4">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-purple-300">Confidentialité</h3>
                <p className="text-sm text-purple-200/70">
                  Contrôlez comment vos données sont collectées, utilisées et partagées.
                  CHE·NU ne vend jamais vos données.
                </p>
              </div>
            </div>
          </div>
          
          <PrivacyToggle
            label="Collecte de données"
            description="Permettre la collecte de données pour améliorer votre expérience"
            enabled={privacySettings.dataCollection}
            onChange={(v) => handlePrivacyChange('dataCollection', v)}
          />
          <PrivacyToggle
            label="Analytiques"
            description="Collecter des métriques d'utilisation anonymisées"
            enabled={privacySettings.analyticsEnabled}
            onChange={(v) => handlePrivacyChange('analyticsEnabled', v)}
          />
          <PrivacyToggle
            label="Mémoire des agents"
            description="Permettre aux agents d'apprendre de vos interactions"
            enabled={privacySettings.agentMemoryEnabled}
            onChange={(v) => handlePrivacyChange('agentMemoryEnabled', v)}
          />
          <PrivacyToggle
            label="Partage cross-identité"
            description="Permettre le partage de données entre vos identités"
            enabled={privacySettings.crossIdentitySharing}
            onChange={(v) => handlePrivacyChange('crossIdentitySharing', v)}
            dangerous
          />
          <PrivacyToggle
            label="Accès tiers"
            description="Permettre l'accès aux applications tierces autorisées"
            enabled={privacySettings.thirdPartyAccess}
            onChange={(v) => handlePrivacyChange('thirdPartyAccess', v)}
            dangerous
          />
        </div>
      )}
      
      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          {/* Export Section */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📤</span>
              <span>Exporter vos données</span>
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Téléchargez une copie complète de toutes vos données au format JSON ou CSV.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
                Export JSON
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Delete Section */}
          <div className="bg-red-900/20 rounded-xl border border-red-700/50 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-300">
              <span>⚠️</span>
              <span>Zone Dangereuse</span>
            </h2>
            <p className="text-red-200/70 text-sm mb-4">
              Supprimer définitivement toutes vos données. Cette action est irréversible.
            </p>
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
              >
                Supprimer toutes mes données
              </button>
            ) : (
              <div className="bg-red-900/50 rounded-lg p-4">
                <p className="text-red-200 mb-3">
                  Êtes-vous sûr? Tapez "SUPPRIMER" pour confirmer.
                </p>
                <input 
                  type="text" 
                  placeholder="SUPPRIMER"
                  className="bg-red-950 border border-red-700 rounded px-3 py-2 w-full mb-3"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={onDeleteAll}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
                  >
                    Confirmer Suppression
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGovernance;
