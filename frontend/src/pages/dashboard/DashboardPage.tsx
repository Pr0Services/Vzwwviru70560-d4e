/**
 * CHE·NU — Dashboard Avancé avec Widgets
 */

import React, { useState } from 'react';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sand: '#D8B26A',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
  success: '#4ADE80',
  warning: '#F39C12',
  error: '#FF6B6B',
};

interface DashboardPageProps {
  userName: string;
  enabledSpheres: string[];
  onNavigate: (path: string) => void;
  onOpenNova: () => void;
  onOpenMemory: () => void;
  onOpenConnections: () => void;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: string;
}

const SPHERES_CONFIG: Record<string, { name: string; icon: string; color: string }> = {
  personal: { name: 'Personal', icon: '👤', color: '#4A90D9' },
  enterprise: { name: 'Enterprise', icon: '🏢', color: '#2ECC71' },
  creative: { name: 'Creative', icon: '🎨', color: '#9B59B6' },
  architecture: { name: 'Architecture', icon: '📐', color: '#E67E22' },
  social: { name: 'Social', icon: '📱', color: '#E74C3C' },
  community: { name: 'Community', icon: '🏘️', color: '#1ABC9C' },
  entertainment: { name: 'Entertainment', icon: '🎬', color: '#F39C12' },
  'ai-labs': { name: 'AI Labs', icon: '🧪', color: '#00E5FF' },
  design: { name: 'Design', icon: '🎭', color: '#8E44AD' },
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userName,
  enabledSpheres,
  onNavigate,
  onOpenNova,
  onOpenMemory,
  onOpenConnections,
}) => {
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Finaliser module auth CHE·NU', dueDate: 'Aujourd\'hui', priority: 'high', completed: false },
    { id: '2', title: 'Réunion équipe Pro-Service', dueDate: 'Demain 10h', priority: 'medium', completed: false },
    { id: '3', title: 'Review PR GitHub', dueDate: 'Cette semaine', priority: 'low', completed: true },
  ]);

  const [activities] = useState<Activity[]>([
    { id: '1', type: 'agent', message: 'Nova a généré 3 recommandations', time: 'Il y a 5 min', icon: '🤖' },
    { id: '2', type: 'sync', message: 'Google Drive synchronisé', time: 'Il y a 2h', icon: '📁' },
    { id: '3', type: 'task', message: 'Tâche "Setup Docker" complétée', time: 'Il y a 4h', icon: '✅' },
  ]);

  const stats = {
    tasksToday: 3,
    completedToday: 1,
    activeProjects: 5,
    pendingMessages: 12,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: COLORS.text, fontSize: 28, margin: 0 }}>
          {getGreeting()}, {userName}! 👋
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
          {new Date().toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 32,
      }}>
        <div style={{
          padding: 20,
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
        }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>Tâches aujourd'hui</div>
          <div style={{ color: COLORS.cyan, fontSize: 32, fontWeight: 600 }}>{stats.tasksToday}</div>
          <div style={{ color: COLORS.success, fontSize: 12, marginTop: 4 }}>
            {stats.completedToday} complétée(s)
          </div>
        </div>
        <div style={{
          padding: 20,
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
        }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>Projets actifs</div>
          <div style={{ color: COLORS.sage, fontSize: 32, fontWeight: 600 }}>{stats.activeProjects}</div>
          <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>
            2 en cours
          </div>
        </div>
        <div style={{
          padding: 20,
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
        }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>Messages</div>
          <div style={{ color: COLORS.sand, fontSize: 32, fontWeight: 600 }}>{stats.pendingMessages}</div>
          <div style={{ color: COLORS.warning, fontSize: 12, marginTop: 4 }}>
            3 non lus
          </div>
        </div>
        <div style={{
          padding: 20,
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
        }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>Sphères actives</div>
          <div style={{ color: COLORS.text, fontSize: 32, fontWeight: 600 }}>{enabledSpheres.length}</div>
          <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>
            sur 9 disponibles
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 24,
      }}>
        {/* Left Column */}
        <div>
          {/* Quick Actions */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ color: COLORS.text, fontSize: 16, marginBottom: 16 }}>
              Actions rapides
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <button
                onClick={onOpenNova}
                style={{
                  padding: 20,
                  background: `linear-gradient(135deg, ${COLORS.cyan}20 0%, ${COLORS.sage}20 100%)`,
                  border: `1px solid ${COLORS.cyan}40`,
                  borderRadius: 16,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
                <h3 style={{ color: COLORS.text, margin: 0, fontSize: 14 }}>Parler à Nova</h3>
                <p style={{ color: COLORS.muted, fontSize: 12, margin: '4px 0 0' }}>
                  Votre assistant IA
                </p>
              </button>

              <button
                onClick={onOpenMemory}
                style={{
                  padding: 20,
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 16,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🧠</div>
                <h3 style={{ color: COLORS.text, margin: 0, fontSize: 14 }}>Mémoire</h3>
                <p style={{ color: COLORS.muted, fontSize: 12, margin: '4px 0 0' }}>
                  271 entrées
                </p>
              </button>

              <button
                onClick={onOpenConnections}
                style={{
                  padding: 20,
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 16,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔗</div>
                <h3 style={{ color: COLORS.text, margin: 0, fontSize: 14 }}>Connexions</h3>
                <p style={{ color: COLORS.muted, fontSize: 12, margin: '4px 0 0' }}>
                  3 services liés
                </p>
              </button>

              <button
                onClick={() => onNavigate('/tools/search')}
                style={{
                  padding: 20,
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 16,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                <h3 style={{ color: COLORS.text, margin: 0, fontSize: 14 }}>Recherche</h3>
                <p style={{ color: COLORS.muted, fontSize: 12, margin: '4px 0 0' }}>
                  ⌘K pour ouvrir
                </p>
              </button>
            </div>
          </div>

          {/* Tasks */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <h2 style={{ color: COLORS.text, fontSize: 16, margin: 0 }}>
                Tâches prioritaires
              </h2>
              <button
                onClick={() => onNavigate('/tools/tasks')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.cyan,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Voir tout →
              </button>
            </div>
            <div style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{
                    padding: 16,
                    borderBottom: index < tasks.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: task.completed ? 0.5 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    style={{ width: 18, height: 18 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: COLORS.text,
                      fontSize: 14,
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>
                      {task.dueDate}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    background: task.priority === 'high' ? `${COLORS.error}20` :
                               task.priority === 'medium' ? `${COLORS.warning}20` : `${COLORS.muted}20`,
                    color: task.priority === 'high' ? COLORS.error :
                           task.priority === 'medium' ? COLORS.warning : COLORS.muted,
                  }}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Spheres */}
          <div>
            <h2 style={{ color: COLORS.text, fontSize: 16, marginBottom: 16 }}>
              Vos Sphères
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 12,
            }}>
              {enabledSpheres.map(sphereId => {
                const config = SPHERES_CONFIG[sphereId];
                if (!config) return null;
                return (
                  <button
                    key={sphereId}
                    onClick={() => onNavigate(`/sphere/${sphereId}`)}
                    style={{
                      padding: 16,
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{config.icon}</div>
                    <div style={{ color: COLORS.text, fontSize: 13 }}>{config.name}</div>
                  </button>
                );
              })}
              <button
                onClick={() => onNavigate('/settings/spheres')}
                style={{
                  padding: 16,
                  background: 'transparent',
                  border: `1px dashed ${COLORS.border}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>➕</div>
                <div style={{ color: COLORS.muted, fontSize: 13 }}>Ajouter</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Activity Feed */}
          <div style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}>
            <h2 style={{ color: COLORS.text, fontSize: 16, margin: '0 0 16px 0' }}>
              Activité récente
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activities.map(activity => (
                <div
                  key={activity.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: 12,
                    background: COLORS.bg,
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{activity.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: COLORS.text, fontSize: 13 }}>
                      {activity.message}
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('/notifications')}
              style={{
                width: '100%',
                marginTop: 16,
                padding: 10,
                background: 'transparent',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.text,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Voir toute l'activité
            </button>
          </div>

          {/* Calendar Preview */}
          <div style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: 20,
          }}>
            <h2 style={{ color: COLORS.text, fontSize: 16, margin: '0 0 16px 0' }}>
              Aujourd'hui
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                padding: 12,
                background: `${COLORS.sage}20`,
                borderLeft: `3px solid ${COLORS.sage}`,
                borderRadius: '0 8px 8px 0',
              }}>
                <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 500 }}>
                  10:00 - Standup équipe
                </div>
                <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>
                  30 min · Google Meet
                </div>
              </div>
              <div style={{
                padding: 12,
                background: `${COLORS.sand}20`,
                borderLeft: `3px solid ${COLORS.sand}`,
                borderRadius: '0 8px 8px 0',
              }}>
                <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 500 }}>
                  14:00 - Review CHE·NU
                </div>
                <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>
                  1h · Bureau
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/tools/calendar')}
              style={{
                width: '100%',
                marginTop: 16,
                padding: 10,
                background: 'transparent',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.text,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Ouvrir le calendrier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
