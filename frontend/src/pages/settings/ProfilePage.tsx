// CHE·NU™ Profile Page — User Profile Management

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useIdentityStore } from '../../stores';
import { CHENU_COLORS, SPHERE_ICONS, type SphereCode } from '../../types';
import { Card, Button, Avatar, Badge } from '../../components/core/UIComponents';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { identities, currentIdentity, switchIdentity } = useIdentityStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || '');

  const handleSave = async () => {
    // Save profile changes
    setIsEditing(false);
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
          Your Profile
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1000px' }}>
        {/* Profile Card */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <Avatar name={user?.display_name || 'User'} size="xl" status="online" />
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${CHENU_COLORS.sacredGold}`,
                    backgroundColor: '#0a0a0b',
                    color: CHENU_COLORS.softSand,
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                />
              ) : (
                <h2 style={{ fontSize: '22px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                  {user?.display_name}
                </h2>
              )}
              <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '14px' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </Card>

        {/* Account Info */}
        <Card title="Account Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '14px' }}>Member Since</span>
              <span style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '14px' }}>Last Login</span>
              <span style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>
                {user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '14px' }}>Status</span>
              <Badge variant={user?.is_active ? 'green' : 'red'}>
                {user?.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '14px' }}>Verified</span>
              <Badge variant={user?.is_verified ? 'green' : 'orange'}>
                {user?.is_verified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Identities */}
        <Card title="Your Identities" subtitle="Context-specific personas across spheres" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
            {identities.length > 0 ? identities.map((identity) => (
              <div
                key={identity.id}
                onClick={() => switchIdentity(identity.id)}
                style={{
                  padding: '16px',
                  backgroundColor: currentIdentity?.id === identity.id ? CHENU_COLORS.sacredGold + '22' : '#0a0a0b',
                  borderRadius: '10px',
                  border: `1px solid ${currentIdentity?.id === identity.id ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone}33`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>
                    {SPHERE_ICONS[identity.sphere_id as SphereCode] || '🆔'}
                  </span>
                  <span style={{ 
                    color: currentIdentity?.id === identity.id ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
                    fontWeight: 600,
                    fontSize: '14px',
                  }}>
                    {identity.name}
                  </span>
                </div>
                {identity.is_default && (
                  <Badge variant="gold" size="sm">Default</Badge>
                )}
              </div>
            )) : (
              // Mock identities if none exist
              (Object.keys(SPHERE_ICONS) as SphereCode[]).slice(0, 4).map((sphere) => (
                <div
                  key={sphere}
                  style={{
                    padding: '16px',
                    backgroundColor: '#0a0a0b',
                    borderRadius: '10px',
                    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{SPHERE_ICONS[sphere]}</span>
                    <span style={{ color: CHENU_COLORS.softSand, fontWeight: 600, fontSize: '14px', textTransform: 'capitalize' }}>
                      {sphere}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Statistics */}
        <Card title="Activity Statistics" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginTop: '16px' }}>
            {[
              { label: 'Total Threads', value: '127', icon: '💬' },
              { label: 'Decisions Made', value: '45', icon: '⚡' },
              { label: 'Tokens Used', value: '45.2K', icon: '🔥' },
              { label: 'Agent Executions', value: '89', icon: '🤖' },
              { label: 'Active Days', value: '32', icon: '📅' },
            ].map((stat, idx) => (
              <div key={idx} style={{
                padding: '16px',
                backgroundColor: '#0a0a0b',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: CHENU_COLORS.sacredGold }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
