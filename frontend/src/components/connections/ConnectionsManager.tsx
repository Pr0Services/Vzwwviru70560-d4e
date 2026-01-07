/**
 * CHE·NU — External Connections Manager
 */

import React, { useState } from 'react';
import { ExternalConnection, ProviderInfo, ConnectionProvider } from '../../types/connection.types';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
  success: '#4ADE80',
  error: '#FF6B6B',
  warning: '#F39C12',
};

const PROVIDERS: ProviderInfo[] = [
  // Storage
  { id: 'google_drive', name: 'Google Drive', icon: '📁', color: '#4285F4', category: 'storage', description: 'Accédez à vos fichiers Google Drive', scopes: ['drive.file', 'drive.readonly'] },
  { id: 'dropbox', name: 'Dropbox', icon: '📦', color: '#0061FF', category: 'storage', description: 'Synchronisez vos fichiers Dropbox', scopes: ['files.read', 'files.write'] },
  { id: 'onedrive', name: 'OneDrive', icon: '☁️', color: '#0078D4', category: 'storage', description: 'Accédez à vos fichiers Microsoft', scopes: ['files.read', 'files.write'] },
  
  // Calendar
  { id: 'google_calendar', name: 'Google Calendar', icon: '📅', color: '#34A853', category: 'calendar', description: 'Gérez votre agenda Google', scopes: ['calendar.readonly', 'calendar.events'] },
  { id: 'outlook_calendar', name: 'Outlook Calendar', icon: '📅', color: '#0078D4', category: 'calendar', description: 'Gérez votre agenda Outlook', scopes: ['calendars.read', 'calendars.readwrite'] },
  
  // Email
  { id: 'gmail', name: 'Gmail', icon: '📧', color: '#EA4335', category: 'email', description: 'Accédez à vos emails Gmail', scopes: ['mail.read', 'mail.send'] },
  { id: 'outlook_mail', name: 'Outlook Mail', icon: '📧', color: '#0078D4', category: 'email', description: 'Accédez à vos emails Outlook', scopes: ['mail.read', 'mail.send'] },
  
  // Communication
  { id: 'slack', name: 'Slack', icon: '💬', color: '#4A154B', category: 'communication', description: 'Intégrez vos espaces Slack', scopes: ['channels.read', 'chat.write'] },
  { id: 'discord', name: 'Discord', icon: '🎮', color: '#5865F2', category: 'communication', description: 'Connectez vos serveurs Discord', scopes: ['guilds.read', 'messages.read'] },
  { id: 'teams', name: 'Microsoft Teams', icon: '👥', color: '#6264A7', category: 'communication', description: 'Intégrez Microsoft Teams', scopes: ['channel.read', 'chat.readwrite'] },
  
  // Productivity
  { id: 'notion', name: 'Notion', icon: '📝', color: '#000000', category: 'productivity', description: 'Synchronisez vos pages Notion', scopes: ['read_content', 'update_content'] },
  { id: 'trello', name: 'Trello', icon: '📋', color: '#0079BF', category: 'productivity', description: 'Gérez vos tableaux Trello', scopes: ['read', 'write'] },
  { id: 'asana', name: 'Asana', icon: '✓', color: '#F06A6A', category: 'productivity', description: 'Synchronisez vos tâches Asana', scopes: ['read', 'write'] },
  
  // Development
  { id: 'github', name: 'GitHub', icon: '🐙', color: '#24292E', category: 'development', description: 'Accédez à vos repos GitHub', scopes: ['repo', 'user'] },
  { id: 'gitlab', name: 'GitLab', icon: '🦊', color: '#FC6D26', category: 'development', description: 'Accédez à vos projets GitLab', scopes: ['read_api', 'read_repository'] },
];

const CATEGORIES = [
  { id: 'storage', name: 'Stockage', icon: '💾' },
  { id: 'calendar', name: 'Calendriers', icon: '📅' },
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'communication', name: 'Communication', icon: '💬' },
  { id: 'productivity', name: 'Productivité', icon: '📋' },
  { id: 'development', name: 'Développement', icon: '💻' },
];

interface ConnectionsManagerProps {
  connections: ExternalConnection[];
  onConnect: (provider: ConnectionProvider) => void;
  onDisconnect: (connectionId: string) => void;
  onRefresh: (connectionId: string) => void;
  onClose?: () => void;
}

export const ConnectionsManager: React.FC<ConnectionsManagerProps> = ({
  connections,
  onConnect,
  onDisconnect,
  onRefresh,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState<string | null>(null);

  const getConnection = (providerId: ConnectionProvider) => {
    return connections.find(c => c.provider === providerId);
  };

  const filteredProviders = selectedCategory === 'all'
    ? PROVIDERS
    : PROVIDERS.filter(p => p.category === selectedCategory);

  const getStatusColor = (status: ExternalConnection['status']) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'expired': return COLORS.warning;
      case 'error':
      case 'revoked': return COLORS.error;
      default: return COLORS.muted;
    }
  };

  const getStatusLabel = (status: ExternalConnection['status']) => {
    switch (status) {
      case 'active': return 'Connecté';
      case 'expired': return 'Expiré';
      case 'error': return 'Erreur';
      case 'revoked': return 'Révoqué';
      default: return 'Inconnu';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 900,
        maxHeight: '90vh',
        background: COLORS.card,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🔗</span>
            <div>
              <h2 style={{ color: COLORS.text, fontSize: 18, margin: 0 }}>Connexions Externes</h2>
              <p style={{ color: COLORS.muted, fontSize: 12, margin: 0 }}>
                Connectez vos comptes et services externes
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.muted,
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px',
              background: selectedCategory === 'all' ? COLORS.cyan : 'transparent',
              border: `1px solid ${selectedCategory === 'all' ? COLORS.cyan : COLORS.border}`,
              borderRadius: 20,
              color: selectedCategory === 'all' ? COLORS.bg : COLORS.text,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Toutes
          </button>
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

        {/* Connections Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {filteredProviders.map(provider => {
              const connection = getConnection(provider.id);
              const isConnected = connection && connection.status === 'active';

              return (
                <div
                  key={provider.id}
                  style={{
                    padding: 20,
                    background: COLORS.bg,
                    border: `1px solid ${isConnected ? provider.color : COLORS.border}`,
                    borderRadius: 16,
                  }}
                >
                  {/* Provider Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: `${provider.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                      }}>
                        {provider.icon}
                      </div>
                      <div>
                        <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 500 }}>
                          {provider.name}
                        </div>
                        {connection && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            marginTop: 4,
                          }}>
                            <div style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: getStatusColor(connection.status),
                            }} />
                            <span style={{ color: COLORS.muted, fontSize: 12 }}>
                              {getStatusLabel(connection.status)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>
                    {provider.description}
                  </p>

                  {/* Connected Info */}
                  {connection && (
                    <div style={{
                      padding: 12,
                      background: COLORS.card,
                      borderRadius: 8,
                      marginBottom: 16,
                    }}>
                      {connection.provider_email && (
                        <div style={{ color: COLORS.text, fontSize: 13, marginBottom: 4 }}>
                          {connection.provider_email}
                        </div>
                      )}
                      {connection.last_sync && (
                        <div style={{ color: COLORS.muted, fontSize: 11 }}>
                          Dernière sync: {new Date(connection.last_sync).toLocaleString('fr-CA')}
                        </div>
                      )}
                      {connection.last_error && (
                        <div style={{ color: COLORS.error, fontSize: 11, marginTop: 4 }}>
                          ⚠️ {connection.last_error}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {connection ? (
                      <>
                        <button
                          onClick={() => onRefresh(connection.id)}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            background: 'transparent',
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 8,
                            color: COLORS.text,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          🔄 Actualiser
                        </button>
                        <button
                          onClick={() => setShowConfirmDisconnect(connection.id)}
                          style={{
                            padding: '10px 16px',
                            background: `${COLORS.error}20`,
                            border: `1px solid ${COLORS.error}40`,
                            borderRadius: 8,
                            color: COLORS.error,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          Déconnecter
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onConnect(provider.id)}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          background: provider.color,
                          border: 'none',
                          borderRadius: 8,
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Connecter
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>
            {connections.filter(c => c.status === 'active').length} connexion(s) active(s)
          </span>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>
            🔒 Vos données restent privées et chiffrées
          </span>
        </div>

        {/* Confirm Disconnect Modal */}
        {showConfirmDisconnect && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              padding: 24,
              background: COLORS.card,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              maxWidth: 400,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔌</div>
              <h3 style={{ color: COLORS.text, marginBottom: 8 }}>Déconnecter?</h3>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
                CHE·NU n'aura plus accès à ce service. Vous pourrez le reconnecter plus tard.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => setShowConfirmDisconnect(null)}
                  style={{
                    padding: '10px 24px',
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    color: COLORS.text,
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    onDisconnect(showConfirmDisconnect);
                    setShowConfirmDisconnect(null);
                  }}
                  style={{
                    padding: '10px 24px',
                    background: COLORS.error,
                    border: 'none',
                    borderRadius: 8,
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Déconnecter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsManager;
