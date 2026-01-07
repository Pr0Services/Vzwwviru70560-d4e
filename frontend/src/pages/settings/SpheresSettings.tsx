/**
 * CHE·NU — Spheres Settings
 */

import React, { useState } from 'react';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  text: '#E8E4DD',
  muted: '#888888',
};

const ALL_SPHERES = [
  { id: 'personal', name: 'Personal', icon: '👤', color: '#4A90D9', description: 'Gestion personnelle' },
  { id: 'enterprise', name: 'Enterprise', icon: '🏢', color: '#2ECC71', description: 'Multi-entreprises' },
  { id: 'creative', name: 'Creative Studio', icon: '🎨', color: '#9B59B6', description: 'Production créative' },
  { id: 'architecture', name: 'Architecture', icon: '📐', color: '#E67E22', description: 'Design architectural' },
  { id: 'social', name: 'Social Media', icon: '📱', color: '#E74C3C', description: 'Réseaux sociaux' },
  { id: 'community', name: 'Community', icon: '🏘️', color: '#1ABC9C', description: 'Marketplace, forum' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#F39C12', description: 'Streaming, médias' },
  { id: 'ai-labs', name: 'AI Labs', icon: '🧪', color: '#00E5FF', description: 'Laboratoire IA' },
  { id: 'design', name: 'Design Studio', icon: '🎭', color: '#8E44AD', description: 'UI/UX Design' },
];

export const SpheresSettings: React.FC = () => {
  const [enabledSpheres, setEnabledSpheres] = useState(['personal', 'enterprise', 'ai-labs']);
  const [defaultSphere, setDefaultSphere] = useState('personal');

  const toggleSphere = (id: string) => {
    if (enabledSpheres.includes(id)) {
      if (enabledSpheres.length > 1) {
        const newEnabled = enabledSpheres.filter(s => s !== id);
        setEnabledSpheres(newEnabled);
        if (defaultSphere === id) setDefaultSphere(newEnabled[0]);
      }
    } else {
      setEnabledSpheres([...enabledSpheres, id]);
    }
  };

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 20, marginBottom: 8 }}>
        🌐 Sphères
      </h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
        Activez les sphères que vous souhaitez utiliser
      </p>

      {/* Default Sphere */}
      <div style={{
        padding: 20,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
          Sphère par défaut
        </label>
        <select
          value={defaultSphere}
          onChange={e => setDefaultSphere(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            color: COLORS.text,
            fontSize: 14,
          }}
        >
          {enabledSpheres.map(id => {
            const sphere = ALL_SPHERES.find(s => s.id === id)!;
            return (
              <option key={id} value={id}>
                {sphere.icon} {sphere.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* All Spheres */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {ALL_SPHERES.map(sphere => {
          const isEnabled = enabledSpheres.includes(sphere.id);
          return (
            <div
              key={sphere.id}
              onClick={() => toggleSphere(sphere.id)}
              style={{
                padding: 20,
                background: isEnabled ? `${sphere.color}15` : COLORS.card,
                border: `2px solid ${isEnabled ? sphere.color : COLORS.border}`,
                borderRadius: 16,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32 }}>{sphere.icon}</span>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: isEnabled ? sphere.color : COLORS.border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 14,
                }}>
                  {isEnabled ? '✓' : ''}
                </div>
              </div>
              <h3 style={{ color: COLORS.text, fontSize: 15, margin: '12px 0 4px 0' }}>
                {sphere.name}
              </h3>
              <p style={{ color: COLORS.muted, fontSize: 12, margin: 0 }}>
                {sphere.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpheresSettings;
