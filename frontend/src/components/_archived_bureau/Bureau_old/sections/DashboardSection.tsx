/**
 * CHE·NU™ — Dashboard Section
 * Vue d'ensemble et actions rapides
 */

import React from 'react';
import { SphereId, ALL_SPHERES } from '../../../canonical/SPHERES_CANONICAL_V2';

interface DashboardSectionProps {
  sphereId: SphereId;
  userId: string;
  language?: 'en' | 'fr';
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  sphereId,
  userId,
  language = 'fr'
}) => {
  const sphere = ALL_SPHERES.find(s => s.id === sphereId);

  const labels = {
    en: {
      welcome: 'Welcome to',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      stats: 'Statistics',
      newThread: 'New Thread',
      newTask: 'New Task',
      startMeeting: 'Start Meeting',
      viewAgents: 'View Agents'
    },
    fr: {
      welcome: 'Bienvenue dans',
      quickActions: 'Actions Rapides',
      recentActivity: 'Activité Récente',
      stats: 'Statistiques',
      newThread: 'Nouveau Fil',
      newTask: 'Nouvelle Tâche',
      startMeeting: 'Démarrer Meeting',
      viewAgents: 'Voir Agents'
    }
  };

  const t = labels[language];

  const quickActions = [
    { icon: '🧵', label: t.newThread, action: 'new_thread' },
    { icon: '✓', label: t.newTask, action: 'new_task' },
    { icon: '👥', label: t.startMeeting, action: 'start_meeting' },
    { icon: '🤖', label: t.viewAgents, action: 'view_agents' }
  ];

  return (
    <div className="dashboard-section">
      {/* Welcome Header */}
      <div
        style={{
          padding: '24px',
          background: `linear-gradient(135deg, ${sphere?.visual.color}40 0%, #1E1F22 100%)`,
          borderRadius: '12px',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '24px', color: '#E9E4D6' }}>
          {t.welcome} <span style={{ color: sphere?.visual.color }}>{language === 'fr' ? sphere?.labelFr : sphere?.label}</span>
        </h2>
        <p style={{ margin: '8px 0 0 0', color: '#8D8371' }}>
          {sphere?.visual.emoji} {language === 'fr' ? sphere?.descriptionFr : sphere?.description}
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#8D8371' }}>
          {t.quickActions}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {quickActions.map(action => (
            <button
              key={action.action}
              style={{
                padding: '20px',
                background: '#2A2B2E',
                border: '1px solid #3A3B3E',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '24px' }}>{action.icon}</span>
              <span style={{ color: '#E9E4D6', fontSize: '12px' }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', background: '#2A2B2E', borderRadius: '12px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#D8B26A' }}>12</div>
          <div style={{ color: '#8D8371', fontSize: '13px' }}>{language === 'fr' ? 'Fils Actifs' : 'Active Threads'}</div>
        </div>
        <div style={{ padding: '20px', background: '#2A2B2E', borderRadius: '12px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#3F7249' }}>8</div>
          <div style={{ color: '#8D8371', fontSize: '13px' }}>{language === 'fr' ? 'Tâches' : 'Tasks'}</div>
        </div>
        <div style={{ padding: '20px', background: '#2A2B2E', borderRadius: '12px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#3B82F6' }}>3</div>
          <div style={{ color: '#8D8371', fontSize: '13px' }}>{language === 'fr' ? 'Agents' : 'Agents'}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#8D8371' }}>
          {t.recentActivity}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                background: '#2A2B2E',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>📝</span>
                <span style={{ color: '#E9E4D6', fontSize: '13px' }}>
                  {language === 'fr' ? `Activité ${i}` : `Activity ${i}`}
                </span>
              </div>
              <span style={{ color: '#8D8371', fontSize: '11px' }}>
                {language === 'fr' ? 'Il y a 2h' : '2h ago'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
