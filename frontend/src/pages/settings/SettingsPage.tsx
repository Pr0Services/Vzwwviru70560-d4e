// CHE·NU™ Settings Page — User Settings

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore, useBudgetStore } from '../../stores';
import { CHENU_COLORS } from '../../types';
import { Card, Button, Tabs } from '../../components/core/UIComponents';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { theme, setTheme, locale, setLocale } = useUIStore();
  const budget = useBudgetStore();
  
  const [activeTab, setActiveTab] = useState('general');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: CHENU_COLORS.uiSlate,
      padding: '32px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
          ← Back
        </Button>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: CHENU_COLORS.softSand }}>
          Settings
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Sidebar Navigation */}
        <div style={{ width: '240px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'identity', label: 'Identities', icon: '🎭' },
              { id: 'budget', label: 'Token Budget', icon: '💰' },
              { id: 'governance', label: 'Governance', icon: '🛡️' },
              { id: 'notifications', label: 'Notifications', icon: '🔔' },
              { id: 'security', label: 'Security', icon: '🔐' },
              { id: 'data', label: 'Data & Privacy', icon: '📦' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === item.id ? CHENU_COLORS.sacredGold + '22' : 'transparent',
                  color: activeTab === item.id ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  fontWeight: activeTab === item.id ? 600 : 400,
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div style={{ flex: 1, maxWidth: '720px' }}>
          {activeTab === 'general' && (
            <Card title="General Settings" subtitle="Customize your CHE·NU experience">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
                {/* Theme */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: CHENU_COLORS.softSand, marginBottom: '8px' }}>
                    Theme
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['dark', 'light', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: `1px solid ${theme === t ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone}44`,
                          backgroundColor: theme === t ? CHENU_COLORS.sacredGold + '22' : 'transparent',
                          color: theme === t ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
                          cursor: 'pointer',
                          fontSize: '13px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: CHENU_COLORS.softSand, marginBottom: '8px' }}>
                    Language
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {([{ id: 'en', label: 'English' }, { id: 'fr', label: 'Français' }] as const).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLocale(l.id)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: `1px solid ${locale === l.id ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone}44`,
                          backgroundColor: locale === l.id ? CHENU_COLORS.sacredGold + '22' : 'transparent',
                          color: locale === l.id ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card title="Profile" subtitle="Manage your account information">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '6px' }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.display_name || ''}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${CHENU_COLORS.ancientStone}44`,
                      backgroundColor: '#0a0a0b',
                      color: CHENU_COLORS.softSand,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${CHENU_COLORS.ancientStone}44`,
                      backgroundColor: '#0a0a0b',
                      color: CHENU_COLORS.ancientStone,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'budget' && (
            <Card title="Token Budget" subtitle="Manage your intelligence energy allocation">
              <div style={{ marginTop: '20px' }}>
                <div style={{
                  padding: '24px',
                  backgroundColor: '#0a0a0b',
                  borderRadius: '12px',
                  marginBottom: '24px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Total Allocated</p>
                      <p style={{ fontSize: '28px', fontWeight: 'bold', color: CHENU_COLORS.softSand }}>
                        {budget.totalAllocated.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Used</p>
                      <p style={{ fontSize: '28px', fontWeight: 'bold', color: CHENU_COLORS.sacredGold }}>
                        {budget.totalUsed.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Remaining</p>
                      <p style={{ fontSize: '28px', fontWeight: 'bold', color: CHENU_COLORS.jungleEmerald }}>
                        {budget.totalRemaining.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ height: '12px', backgroundColor: '#111113', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(budget.totalUsed / budget.totalAllocated) * 100}%`,
                      height: '100%',
                      backgroundColor: CHENU_COLORS.sacredGold,
                      borderRadius: '6px',
                    }} />
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
                  border: `1px solid ${CHENU_COLORS.cenoteTurquoise}22`,
                  borderRadius: '8px',
                }}>
                  <p style={{ color: CHENU_COLORS.cenoteTurquoise, fontSize: '14px' }}>
                    ℹ️ Tokens are INTERNAL utility credits — NOT cryptocurrency. They represent intelligence energy and are governed, traceable, and budget-controlled.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'governance' && (
            <Card title="Governance Settings" subtitle="Control how CHE·NU operates for you">
              <div style={{ marginTop: '20px' }}>
                <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px', marginBottom: '20px' }}>
                  Governance is not a restriction — Governance is empowerment.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Require confirmation before agent execution', enabled: true },
                    { label: 'Enable token budget warnings at 80%', enabled: true },
                    { label: 'Log all agent activities', enabled: true },
                    { label: 'Allow cross-sphere data access', enabled: false },
                    { label: 'Enable encoding by default', enabled: true },
                  ].map((setting, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: '#0a0a0b',
                      borderRadius: '8px',
                    }}>
                      <span style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>{setting.label}</span>
                      <div style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: setting.enabled ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone + '44',
                        position: 'relative',
                        cursor: 'pointer',
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#fff',
                          position: 'absolute',
                          top: '2px',
                          left: setting.enabled ? '22px' : '2px',
                          transition: 'left 0.2s ease',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Security" subtitle="Protect your account">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                <Button variant="secondary">Change Password</Button>
                <Button variant="secondary">Enable Two-Factor Authentication</Button>
                <Button variant="secondary">View Active Sessions</Button>
                <div style={{ borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`, paddingTop: '16px', marginTop: '8px' }}>
                  <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
