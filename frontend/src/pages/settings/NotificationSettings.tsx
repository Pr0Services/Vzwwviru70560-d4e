/**
 * CHE·NU — Notification Settings
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

export const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    channels: {
      in_app: true,
      push: true,
      email: false,
      sms: false,
    },
    types: {
      ai: { enabled: true, push: true },
      task: { enabled: true, push: true },
      message: { enabled: true, push: true },
      system: { enabled: true, push: false },
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });

  const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? COLORS.sage : COLORS.border,
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
        left: checked ? 23 : 3,
        transition: 'left 0.2s',
      }} />
    </button>
  );

  return (
    <div>
      <h2 style={{ color: COLORS.text, fontSize: 20, marginBottom: 24 }}>
        🔔 Notifications
      </h2>

      {/* Global Toggle */}
      <div style={{
        padding: 20,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h3 style={{ color: COLORS.text, fontSize: 15, margin: '0 0 4px 0' }}>
            Notifications globales
          </h3>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
            Activer ou désactiver toutes les notifications
          </p>
        </div>
        <Toggle
          checked={settings.enabled}
          onChange={v => setSettings({ ...settings, enabled: v })}
        />
      </div>

      {/* Channels */}
      <div style={{
        padding: 20,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <h3 style={{ color: COLORS.text, fontSize: 15, marginBottom: 16 }}>
          Canaux de notification
        </h3>
        {[
          { key: 'in_app', label: 'Dans l\'application', icon: '📱' },
          { key: 'push', label: 'Push (navigateur)', icon: '🔔' },
          { key: 'email', label: 'Email', icon: '📧' },
          { key: 'sms', label: 'SMS', icon: '💬' },
        ].map(channel => (
          <div
            key={channel.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>{channel.icon}</span>
              <span style={{ color: COLORS.text, fontSize: 14 }}>{channel.label}</span>
            </div>
            <Toggle
              checked={settings.channels[channel.key as keyof typeof settings.channels]}
              onChange={v => setSettings({
                ...settings,
                channels: { ...settings.channels, [channel.key]: v },
              })}
            />
          </div>
        ))}
      </div>

      {/* Quiet Hours */}
      <div style={{
        padding: 20,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <div>
            <h3 style={{ color: COLORS.text, fontSize: 15, margin: '0 0 4px 0' }}>
              🌙 Heures silencieuses
            </h3>
            <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
              Désactiver les notifications pendant certaines heures
            </p>
          </div>
          <Toggle
            checked={settings.quietHours.enabled}
            onChange={v => setSettings({
              ...settings,
              quietHours: { ...settings.quietHours, enabled: v },
            })}
          />
        </div>
        {settings.quietHours.enabled && (
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.muted, fontSize: 12 }}>Début</label>
              <input
                type="time"
                value={settings.quietHours.start}
                onChange={e => setSettings({
                  ...settings,
                  quietHours: { ...settings.quietHours, start: e.target.value },
                })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  color: COLORS.text,
                  marginTop: 6,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.muted, fontSize: 12 }}>Fin</label>
              <input
                type="time"
                value={settings.quietHours.end}
                onChange={e => setSettings({
                  ...settings,
                  quietHours: { ...settings.quietHours, end: e.target.value },
                })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  color: COLORS.text,
                  marginTop: 6,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;
