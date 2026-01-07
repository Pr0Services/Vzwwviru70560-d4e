/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — OVERVIEW PAGE                                   ║
 * ║                    Centre de Commandement                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Page d'accueil principale après authentification.
 * Affiche une vue d'ensemble des 9 sphères et des accès rapides.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  sacredGold: '#D8B26A',
  cenoteTurquoise: '#3EB4A2',
  uiSlate: '#1E1F22',
  uiDark: '#141416',
  softSand: '#E9E4D6',
  ancientStone: '#8D8371',
  border: '#2A2A2E',
};

const SPHERES = [
  { id: 'personal', emoji: '🏠', name: 'Personnel', color: '#3EB4A2', tasks: 5 },
  { id: 'business', emoji: '💼', name: 'Affaires', color: '#D8B26A', tasks: 12 },
  { id: 'government', emoji: '🏛️', name: 'Gouvernement', color: '#8D8371', tasks: 3 },
  { id: 'studio', emoji: '🎨', name: 'Studio Créatif', color: '#E07B53', tasks: 8 },
  { id: 'community', emoji: '👥', name: 'Communauté', color: '#3F7249', tasks: 2 },
  { id: 'social', emoji: '📱', name: 'Social & Média', color: '#5B8DEE', tasks: 7 },
  { id: 'entertainment', emoji: '🎬', name: 'Divertissement', color: '#9B59B6', tasks: 4 },
  { id: 'team', emoji: '🤝', name: 'Mon Équipe', color: '#7A593A', tasks: 9 },
  { id: 'scholar', emoji: '📚', name: 'Académique', color: '#2F4C39', tasks: 1 },
];

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24, color: COLORS.softSand }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>
          🏝️ Centre de Commandement
        </h2>
        <p style={{ color: COLORS.ancientStone, marginTop: 8 }}>
          Bienvenue dans CHE·NU. Sélectionnez une sphère pour commencer à travailler.
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 32,
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Tâches actives', value: '51', icon: '✅', color: COLORS.cenoteTurquoise },
          { label: 'Réunions aujourd\'hui', value: '3', icon: '📅', color: COLORS.sacredGold },
          { label: 'Threads ouverts', value: '8', icon: '💬', color: '#E07B53' },
          { label: 'Agents actifs', value: '2', icon: '🤖', color: '#5B8DEE' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              flex: '1 1 200px',
              padding: 20,
              backgroundColor: `${stat.color}10`,
              border: `1px solid ${stat.color}30`,
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
              <span style={{ fontSize: 12, color: COLORS.ancientStone }}>{stat.label}</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Spheres Grid */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: COLORS.ancientStone }}>
          VOS 9 SPHÈRES
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}>
          {SPHERES.map(sphere => (
            <button
              key={sphere.id}
              onClick={() => navigate(`/${sphere.id}/dashboard`)}
              style={{
                padding: 20,
                backgroundColor: COLORS.uiSlate,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = sphere.color;
                e.currentTarget.style.backgroundColor = `${sphere.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.backgroundColor = COLORS.uiSlate;
              }}
            >
              <span style={{ fontSize: 32 }}>{sphere.emoji}</span>
              <p style={{ 
                color: COLORS.softSand, 
                fontSize: 14, 
                fontWeight: 600,
                marginTop: 12,
                marginBottom: 4,
              }}>
                {sphere.name}
              </p>
              <p style={{ color: COLORS.ancientStone, fontSize: 12, margin: 0 }}>
                {sphere.tasks} tâches
              </p>
              
              {/* Badge */}
              {sphere.tasks > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: sphere.color,
                    color: COLORS.uiDark,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {sphere.tasks}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: COLORS.ancientStone }}>
          ACTIVITÉ RÉCENTE
        </h3>
        <div style={{ 
          backgroundColor: COLORS.uiSlate,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
        }}>
          {[
            { time: 'Il y a 5 min', action: 'Tâche complétée', detail: 'Réviser le budget Q1', sphere: '💼' },
            { time: 'Il y a 15 min', action: 'Nouveau thread', detail: 'Discussion projet Alpha', sphere: '🤝' },
            { time: 'Il y a 1h', action: 'Réunion terminée', detail: 'Sync équipe design', sphere: '🎨' },
            { time: 'Il y a 2h', action: 'Document créé', detail: 'Plan de cours semestre', sphere: '📚' },
          ].map((activity, index) => (
            <div
              key={index}
              style={{
                padding: 16,
                borderBottom: index < 3 ? `1px solid ${COLORS.border}` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span style={{ fontSize: 24 }}>{activity.sphere}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, color: COLORS.softSand }}>
                  {activity.action}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: COLORS.ancientStone }}>
                  {activity.detail}
                </p>
              </div>
              <span style={{ fontSize: 11, color: COLORS.ancientStone }}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
