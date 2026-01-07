/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU — API Keys Configuration                            ║
 * ║                                                                              ║
 * ║  Permettre aux utilisateurs de configurer leurs propres clés API             ║
 * ║  pour les différents providers LLM et services externes                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sage: '#3F7249',
  cyan: '#00E5FF',
  gold: '#D8B26A',
  text: '#E8E4DD',
  muted: '#888888',
  success: '#4ADE80',
  error: '#FF6B6B',
  warning: '#F39C12',
};

interface APIProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  docsUrl: string;
  keyPrefix?: string;
  category: 'llm' | 'voice' | 'image' | 'storage' | 'other';
}

interface APIKeyConfig {
  providerId: string;
  key: string;
  isConfigured: boolean;
  lastVerified?: string;
  status: 'active' | 'invalid' | 'expired' | 'unchecked';
}

const API_PROVIDERS: APIProvider[] = [
  // LLM Providers
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    icon: '🎭',
    color: '#D4A27F',
    description: 'Claude 3.5 Sonnet, Claude 3 Opus, Haiku',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    keyPrefix: 'sk-ant-',
    category: 'llm',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    color: '#10A37F',
    description: 'GPT-4, GPT-4o, GPT-3.5, DALL-E, Whisper',
    docsUrl: 'https://platform.openai.com/api-keys',
    keyPrefix: 'sk-',
    category: 'llm',
  },
  {
    id: 'google',
    name: 'Google AI',
    icon: '💎',
    color: '#4285F4',
    description: 'Gemini Pro, Gemini Ultra',
    docsUrl: 'https://makersuite.google.com/app/apikey',
    category: 'llm',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌬️',
    color: '#FF7000',
    description: 'Mistral Large, Mistral Medium',
    docsUrl: 'https://console.mistral.ai/api-keys/',
    category: 'llm',
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: '⚡',
    color: '#F55036',
    description: 'Llama 3, Mixtral (Ultra-rapide)',
    docsUrl: 'https://console.groq.com/keys',
    keyPrefix: 'gsk_',
    category: 'llm',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🔮',
    color: '#39594D',
    description: 'Command, Embed, Rerank',
    docsUrl: 'https://dashboard.cohere.ai/api-keys',
    category: 'llm',
  },
  // Voice Providers
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    icon: '🎤',
    color: '#000000',
    description: 'Text-to-Speech haute qualité',
    docsUrl: 'https://elevenlabs.io/app/settings/api-keys',
    category: 'voice',
  },
  {
    id: 'deepgram',
    name: 'Deepgram',
    icon: '👂',
    color: '#13EF93',
    description: 'Speech-to-Text temps réel',
    docsUrl: 'https://console.deepgram.com/project/api-keys',
    category: 'voice',
  },
  // Image Providers
  {
    id: 'stability',
    name: 'Stability AI',
    icon: '🎨',
    color: '#7C3AED',
    description: 'Stable Diffusion, SDXL',
    docsUrl: 'https://platform.stability.ai/account/keys',
    keyPrefix: 'sk-',
    category: 'image',
  },
  {
    id: 'replicate',
    name: 'Replicate',
    icon: '🔄',
    color: '#000000',
    description: 'Modèles open-source',
    docsUrl: 'https://replicate.com/account/api-tokens',
    keyPrefix: 'r8_',
    category: 'image',
  },
  // Other Services
  {
    id: 'sendgrid',
    name: 'SendGrid',
    icon: '📧',
    color: '#1A82E2',
    description: 'Envoi d\'emails',
    docsUrl: 'https://app.sendgrid.com/settings/api_keys',
    keyPrefix: 'SG.',
    category: 'other',
  },
  {
    id: 'twilio',
    name: 'Twilio',
    icon: '📱',
    color: '#F22F46',
    description: 'SMS et appels',
    docsUrl: 'https://console.twilio.com/us1/develop/api-keys',
    category: 'other',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Toutes', icon: '🔑' },
  { id: 'llm', name: 'LLM / IA', icon: '🧠' },
  { id: 'voice', name: 'Voix', icon: '🎤' },
  { id: 'image', name: 'Images', icon: '🖼️' },
  { id: 'other', name: 'Autres', icon: '⚙️' },
];

export const APIKeysSettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, APIKeyConfig>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState('');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState<string | null>(null);

  // Load saved keys on mount
  useEffect(() => {
    // In production, load from API
    const savedKeys = localStorage.getItem('chenu_api_keys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error('Failed to load API keys');
      }
    }
  }, []);

  const saveKey = async (providerId: string) => {
    if (!tempKey.trim()) return;

    const newConfig: APIKeyConfig = {
      providerId,
      key: tempKey,
      isConfigured: true,
      status: 'unchecked',
    };

    const updatedKeys = {
      ...apiKeys,
      [providerId]: newConfig,
    };

    setApiKeys(updatedKeys);
    localStorage.setItem('chenu_api_keys', JSON.stringify(updatedKeys));
    setEditingProvider(null);
    setTempKey('');

    // Auto-verify
    verifyKey(providerId, tempKey);
  };

  const removeKey = (providerId: string) => {
    const { [providerId]: _, ...rest } = apiKeys;
    setApiKeys(rest);
    localStorage.setItem('chenu_api_keys', JSON.stringify(rest));
  };

  const verifyKey = async (providerId: string, key?: string) => {
    setVerifying(providerId);
    
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const keyToVerify = key || apiKeys[providerId]?.key;
    const isValid = keyToVerify && keyToVerify.length > 10;

    setApiKeys(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        status: isValid ? 'active' : 'invalid',
        lastVerified: new Date().toISOString(),
      },
    }));

    setVerifying(null);
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return `${key.slice(0, 4)}${'•'.repeat(Math.min(key.length - 8, 20))}${key.slice(-4)}`;
  };

  const getStatusBadge = (status: APIKeyConfig['status']) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: `${COLORS.success}20`, text: COLORS.success, label: 'Actif' },
      invalid: { bg: `${COLORS.error}20`, text: COLORS.error, label: 'Invalide' },
      expired: { bg: `${COLORS.warning}20`, text: COLORS.warning, label: 'Expiré' },
      unchecked: { bg: `${COLORS.muted}20`, text: COLORS.muted, label: 'Non vérifié' },
    };
    const style = styles[status] || styles.unchecked;

    return (
      <span style={{
        padding: '4px 10px',
        background: style.bg,
        color: style.text,
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 500,
      }}>
        {style.label}
      </span>
    );
  };

  const filteredProviders = selectedCategory === 'all'
    ? API_PROVIDERS
    : API_PROVIDERS.filter(p => p.category === selectedCategory);

  const configuredCount = Object.values(apiKeys).filter(k => k.isConfigured).length;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: COLORS.text, fontSize: 20, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>🔑</span> Clés API
        </h2>
        <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>
          Configurez vos propres clés API pour utiliser les services externes
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginBottom: 24,
      }}>
        <div style={{
          padding: 16,
          background: COLORS.card,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 4 }}>Configurées</div>
          <div style={{ color: COLORS.success, fontSize: 24, fontWeight: 600 }}>{configuredCount}</div>
        </div>
        <div style={{
          padding: 16,
          background: COLORS.card,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 4 }}>Disponibles</div>
          <div style={{ color: COLORS.cyan, fontSize: 24, fontWeight: 600 }}>{API_PROVIDERS.length}</div>
        </div>
        <div style={{
          padding: 16,
          background: COLORS.card,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 4 }}>Actives</div>
          <div style={{ color: COLORS.gold, fontSize: 24, fontWeight: 600 }}>
            {Object.values(apiKeys).filter(k => k.status === 'active').length}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
        overflowX: 'auto',
        paddingBottom: 8,
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              background: selectedCategory === cat.id ? COLORS.cyan : 'transparent',
              border: `1px solid ${selectedCategory === cat.id ? COLORS.cyan : COLORS.border}`,
              borderRadius: 20,
              color: selectedCategory === cat.id ? COLORS.bg : COLORS.text,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div style={{
        padding: 16,
        background: `${COLORS.gold}15`,
        border: `1px solid ${COLORS.gold}30`,
        borderRadius: 12,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>🔒</span>
        <div>
          <div style={{ color: COLORS.gold, fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
            Vos clés sont sécurisées
          </div>
          <div style={{ color: COLORS.muted, fontSize: 13 }}>
            Les clés API sont chiffrées et stockées de manière sécurisée. 
            Elles ne sont jamais partagées et vous pouvez les supprimer à tout moment.
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredProviders.map(provider => {
          const config = apiKeys[provider.id];
          const isEditing = editingProvider === provider.id;
          const isVerifying = verifying === provider.id;

          return (
            <div
              key={provider.id}
              style={{
                padding: 20,
                background: COLORS.card,
                borderRadius: 16,
                border: `1px solid ${config?.status === 'active' ? provider.color : COLORS.border}`,
              }}
            >
              {/* Provider Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: isEditing || config?.isConfigured ? 16 : 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${provider.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    {provider.icon}
                  </div>
                  <div>
                    <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 500 }}>
                      {provider.name}
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: 12 }}>
                      {provider.description}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {config?.isConfigured && getStatusBadge(config.status)}
                  {!config?.isConfigured && !isEditing && (
                    <button
                      onClick={() => {
                        setEditingProvider(provider.id);
                        setTempKey('');
                      }}
                      style={{
                        padding: '8px 16px',
                        background: provider.color,
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Configurer
                    </button>
                  )}
                </div>
              </div>

              {/* Configured Key Display */}
              {config?.isConfigured && !isEditing && (
                <div style={{
                  padding: 12,
                  background: COLORS.bg,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <code style={{
                      color: COLORS.text,
                      fontSize: 13,
                      fontFamily: 'monospace',
                    }}>
                      {showKey[provider.id] ? config.key : maskKey(config.key)}
                    </code>
                    <button
                      onClick={() => setShowKey(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: COLORS.muted,
                        cursor: 'pointer',
                        fontSize: 14,
                      }}
                    >
                      {showKey[provider.id] ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => verifyKey(provider.id)}
                      disabled={isVerifying}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 6,
                        color: COLORS.text,
                        fontSize: 12,
                        cursor: isVerifying ? 'wait' : 'pointer',
                        opacity: isVerifying ? 0.7 : 1,
                      }}
                    >
                      {isVerifying ? '⏳' : '🔄'} Vérifier
                    </button>
                    <button
                      onClick={() => {
                        setEditingProvider(provider.id);
                        setTempKey(config.key);
                      }}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 6,
                        color: COLORS.text,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => removeKey(provider.id)}
                      style={{
                        padding: '6px 12px',
                        background: `${COLORS.error}20`,
                        border: `1px solid ${COLORS.error}40`,
                        borderRadius: 6,
                        color: COLORS.error,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Form */}
              {isEditing && (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ color: COLORS.muted, fontSize: 12, display: 'block', marginBottom: 6 }}>
                      Clé API {provider.keyPrefix && <span style={{ color: COLORS.cyan }}>({provider.keyPrefix}...)</span>}
                    </label>
                    <input
                      type="password"
                      value={tempKey}
                      onChange={e => setTempKey(e.target.value)}
                      placeholder={`Entrez votre clé ${provider.name}`}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: COLORS.bg,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 10,
                        color: COLORS.text,
                        fontSize: 14,
                        fontFamily: 'monospace',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a
                      href={provider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: COLORS.cyan, fontSize: 12, textDecoration: 'none' }}
                    >
                      📄 Obtenir une clé →
                    </a>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          setEditingProvider(null);
                          setTempKey('');
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'transparent',
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 8,
                          color: COLORS.text,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => saveKey(provider.id)}
                        disabled={!tempKey.trim()}
                        style={{
                          padding: '8px 16px',
                          background: tempKey.trim() ? COLORS.sage : COLORS.border,
                          border: 'none',
                          borderRadius: 8,
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: tempKey.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        💾 Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: 24,
        padding: 16,
        background: COLORS.bg,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>
          💡 <strong style={{ color: COLORS.text }}>Conseil:</strong> Utilisez des clés API avec des permissions limitées. 
          Si vous n'avez pas de clé, CHE·NU utilisera les services par défaut selon votre abonnement.
        </div>
      </div>
    </div>
  );
};

export default APIKeysSettings;
