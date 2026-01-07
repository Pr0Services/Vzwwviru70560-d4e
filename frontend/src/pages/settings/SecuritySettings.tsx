/**
 * CHE·NU — Security Settings
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
  error: '#FF6B6B',
  warning: '#F39C12',
};

export const SecuritySettings: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [sessions] = useState([
    { id: '1', device: 'Chrome sur Windows', location: 'Montréal, QC', lastActive: 'Maintenant', current: true },
    { id: '2', device: 'Safari sur iPhone', location: 'Brossard, QC', lastActive: 'Il y a 2h', current: false },
    { id: '3', device: 'Claude App iOS', location: 'Montréal, QC', lastActive: 'Hier', current: false },
  ]);

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 20, marginBottom: 24 }}>
        🔐 Sécurité
      </h2>

      {/* Password Section */}
      <div style={{
        padding: 24,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{ color: COLORS.text, fontSize: 16, margin: '0 0 8px 0' }}>
              Mot de passe
            </h3>
            <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
              Dernière modification: il y a 30 jours
            </p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            style={{
              padding: '10px 20px',
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.text,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Modifier
          </button>
        </div>

        {showPasswordForm && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
                Mot de passe actuel
              </label>
              <input
                type="password"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  color: COLORS.text,
                  fontSize: 14,
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  color: COLORS.text,
                  fontSize: 14,
                }}
              />
            </div>
            <button style={{
              padding: '10px 20px',
              background: COLORS.sage,
              border: 'none',
              borderRadius: 8,
              color: 'white',
              cursor: 'pointer',
              fontSize: 14,
            }}>
              Mettre à jour
            </button>
          </div>
        )}
      </div>

      {/* MFA Section */}
      <div style={{
        padding: 24,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{ color: COLORS.text, fontSize: 16, margin: '0 0 8px 0' }}>
              Authentification à deux facteurs (MFA)
            </h3>
            <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
              {mfaEnabled ? '✅ Activée' : '⚠️ Non activée - Recommandé'}
            </p>
          </div>
          <button
            onClick={() => setMfaEnabled(!mfaEnabled)}
            style={{
              width: 52,
              height: 28,
              borderRadius: 14,
              background: mfaEnabled ? COLORS.sage : COLORS.border,
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: 3,
              left: mfaEnabled ? 27 : 3,
              transition: 'left 0.2s',
            }} />
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div style={{
        padding: 24,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
      }}>
        <h3 style={{ color: COLORS.text, fontSize: 16, marginBottom: 20 }}>
          Sessions actives
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sessions.map(session => (
            <div
              key={session.id}
              style={{
                padding: 16,
                background: session.current ? `${COLORS.sage}15` : COLORS.bg,
                border: `1px solid ${session.current ? COLORS.sage : COLORS.border}`,
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ color: COLORS.text, fontSize: 14, marginBottom: 4 }}>
                  {session.device}
                  {session.current && (
                    <span style={{
                      marginLeft: 8,
                      padding: '2px 8px',
                      background: COLORS.sage,
                      borderRadius: 10,
                      fontSize: 10,
                      color: 'white',
                    }}>
                      Cette session
                    </span>
                  )}
                </div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>
                  {session.location} • {session.lastActive}
                </div>
              </div>
              {!session.current && (
                <button style={{
                  padding: '6px 12px',
                  background: `${COLORS.error}20`,
                  border: `1px solid ${COLORS.error}40`,
                  borderRadius: 6,
                  color: COLORS.error,
                  cursor: 'pointer',
                  fontSize: 12,
                }}>
                  Déconnecter
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
