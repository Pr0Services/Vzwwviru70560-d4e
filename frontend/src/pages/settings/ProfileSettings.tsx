/**
 * CHE·NU — Profile Settings
 */

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStoreConnected';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
};

export const ProfileSettings: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  
  const [profile, setProfile] = useState({
    firstName: user?.displayName?.split(' ')[0] || 'Jo',
    lastName: user?.displayName?.split(' ')[1] || 'User',
    displayName: user?.displayName || 'Jo U.',
    email: user?.email || 'jo@proservice.com',
    phone: '+1 514 555 1234',
    language: user?.preferences?.language || 'fr-CA',
    timezone: 'America/Toronto',
    avatar: user?.avatar || null as string | null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const success = await updateProfile({
        displayName: profile.displayName,
        avatar: profile.avatar || undefined,
        preferences: {
          ...user?.preferences,
          language: profile.language as 'en' | 'fr' | 'es',
        },
      });
      
      if (success) {
        setIsEditing(false);
      } else {
        setSaveError('Failed to save profile. Please try again.');
      }
    } catch (error: any) {
      setSaveError(error.message || 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    color: COLORS.text,
    fontSize: 14,
    outline: 'none',
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <h2 style={{ color: COLORS.text, fontSize: 20, margin: 0 }}>
          👤 Profil
        </h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          style={{
            padding: '10px 20px',
            background: isEditing ? COLORS.sage : 'transparent',
            border: `1px solid ${isEditing ? COLORS.sage : COLORS.border}`,
            borderRadius: 8,
            color: isEditing ? 'white' : COLORS.text,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          {isEditing ? '💾 Sauvegarder' : '✏️ Modifier'}
        </button>
      </div>

      {/* Avatar Section */}
      <div style={{
        padding: 24,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.sage} 0%, #D8B26A 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
          }}>
            👤
          </div>
          <div>
            <h3 style={{ color: COLORS.text, fontSize: 18, margin: '0 0 8px 0' }}>
              {profile.firstName} {profile.lastName}
            </h3>
            <p style={{ color: COLORS.muted, fontSize: 14, margin: '0 0 16px 0' }}>
              {profile.email}
            </p>
            {isEditing && (
              <button style={{
                padding: '8px 16px',
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.text,
                cursor: 'pointer',
                fontSize: 13,
              }}>
                📷 Changer la photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{
        padding: 24,
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
              Prénom
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={e => setProfile({ ...profile, firstName: e.target.value })}
              disabled={!isEditing}
              style={{ ...inputStyle, opacity: isEditing ? 1 : 0.7 }}
            />
          </div>
          <div>
            <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
              Nom
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={e => setProfile({ ...profile, lastName: e.target.value })}
              disabled={!isEditing}
              style={{ ...inputStyle, opacity: isEditing ? 1 : 0.7 }}
            />
          </div>
          <div>
            <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
              Nom d'affichage
            </label>
            <input
              type="text"
              value={profile.displayName}
              onChange={e => setProfile({ ...profile, displayName: e.target.value })}
              disabled={!isEditing}
              style={{ ...inputStyle, opacity: isEditing ? 1 : 0.7 }}
            />
          </div>
          <div>
            <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
              Téléphone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
              style={{ ...inputStyle, opacity: isEditing ? 1 : 0.7 }}
            />
          </div>
          <div>
            <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
              Langue
            </label>
            <select
              value={profile.language}
              onChange={e => setProfile({ ...profile, language: e.target.value })}
              disabled={!isEditing}
              style={{ ...inputStyle, opacity: isEditing ? 1 : 0.7, cursor: isEditing ? 'pointer' : 'default' }}
            >
              <option value="fr-CA">Français (Canada)</option>
              <option value="en-CA">English (Canada)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
          <div>
            <label style={{ color: COLORS.muted, fontSize: 13, display: 'block', marginBottom: 8 }}>
              Fuseau horaire
            </label>
            <select
              value={profile.timezone}
              onChange={e => setProfile({ ...profile, timezone: e.target.value })}
              disabled={!isEditing}
              style={{ ...inputStyle, opacity: isEditing ? 1 : 0.7, cursor: isEditing ? 'pointer' : 'default' }}
            >
              <option value="America/Toronto">Toronto (EST)</option>
              <option value="America/Montreal">Montréal (EST)</option>
              <option value="America/Vancouver">Vancouver (PST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
