/**
 * CHE·NU — AI & Nova Settings
 */

import React, { useState } from 'react';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
};

const LLM_MODELS = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', tier: 'Premium' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tier: 'Premium' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', tier: 'Premium' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Meta/Groq', tier: 'Speed' },
];

export const AISettings: React.FC = () => {
  const [settings, setSettings] = useState({
    defaultModel: 'claude-3-5-sonnet',
    temperature: 0.7,
    memoryEnabled: true,
    contextLength: 'auto',
    streamingEnabled: true,
    novaPersonality: 'helpful',
  });

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 20, marginBottom: 24 }}>
        🤖 IA & Nova
      </h2>

      {/* Default Model */}
      <div style={{
        padding: 20,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 16 }}>
          Modèle par défaut
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LLM_MODELS.map(model => (
            <label
              key={model.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: settings.defaultModel === model.id ? `${COLORS.cyan}15` : COLORS.bg,
                border: `1px solid ${settings.defaultModel === model.id ? COLORS.cyan : COLORS.border}`,
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="model"
                checked={settings.defaultModel === model.id}
                onChange={() => setSettings({ ...settings, defaultModel: model.id })}
              />
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.text, fontSize: 14 }}>{model.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{model.provider}</div>
              </div>
              <span style={{
                padding: '2px 8px',
                background: model.tier === 'Premium' ? `${COLORS.sage}30` : `${COLORS.cyan}30`,
                borderRadius: 10,
                fontSize: 10,
                color: model.tier === 'Premium' ? COLORS.sage : COLORS.cyan,
              }}>
                {model.tier}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Temperature */}
      <div style={{
        padding: 20,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ color: COLORS.text, fontSize: 15, margin: 0 }}>
            Créativité (Temperature)
          </h3>
          <span style={{ color: COLORS.cyan }}>{settings.temperature}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.temperature}
          onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: COLORS.muted, fontSize: 11, marginTop: 8 }}>
          <span>Précis</span>
          <span>Équilibré</span>
          <span>Créatif</span>
        </div>
      </div>

      {/* Memory */}
      <div style={{
        padding: 20,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: COLORS.text, fontSize: 15, margin: '0 0 4px 0' }}>
              🧠 Mémoire contextuelle
            </h3>
            <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
              Permettre à Nova de se souvenir de vos conversations
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, memoryEnabled: !settings.memoryEnabled })}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: settings.memoryEnabled ? COLORS.sage : COLORS.border,
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: 3,
              left: settings.memoryEnabled ? 23 : 3,
              transition: 'left 0.2s',
            }} />
          </button>
        </div>
      </div>

      {/* Nova Personality */}
      <div style={{
        padding: 20,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
      }}>
        <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 16 }}>
          Personnalité de Nova
        </h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { id: 'helpful', label: 'Serviable', icon: '🤝' },
            { id: 'professional', label: 'Professionnel', icon: '👔' },
            { id: 'friendly', label: 'Amical', icon: '😊' },
            { id: 'concise', label: 'Concis', icon: '📝' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSettings({ ...settings, novaPersonality: p.id })}
              style={{
                flex: 1,
                padding: 16,
                background: settings.novaPersonality === p.id ? `${COLORS.cyan}15` : COLORS.bg,
                border: `1px solid ${settings.novaPersonality === p.id ? COLORS.cyan : COLORS.border}`,
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
              <div style={{ color: COLORS.text, fontSize: 12 }}>{p.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISettings;
