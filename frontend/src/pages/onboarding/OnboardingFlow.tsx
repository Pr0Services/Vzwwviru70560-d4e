/**
 * CHE·NU — Onboarding Flow Complet (6 Étapes)
 */

import React, { useState, useRef } from 'react';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sand: '#D8B26A',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
  error: '#FF6B6B',
  success: '#4ADE80',
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface OnboardingData {
  // Étape 1: Identité
  firstName: string;
  lastName: string;
  displayName: string;
  language: string;
  timezone: string;
  
  // Étape 2: Photo
  avatarType: 'upload' | 'camera' | 'generated' | null;
  avatarFile: File | null;
  avatarPreview: string | null;
  
  // Étape 3: Contact
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Étape 4: Professionnel
  status: string;
  companyName: string;
  jobTitle: string;
  industry: string;
  teamSize: string;
  
  // Étape 5: Sphères
  enabledSpheres: string[];
  defaultSphere: string;
  
  // Étape 6: Connexions
  connections: string[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  initialStep?: number;
}

// ═══════════════════════════════════════════════════════════════
// DONNÉES CONSTANTES
// ═══════════════════════════════════════════════════════════════

const LANGUAGES = [
  { value: 'fr-CA', label: 'Français (Canada)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-CA', label: 'English (Canada)' },
  { value: 'es-ES', label: 'Español' },
];

const TIMEZONES = [
  { value: 'America/Toronto', label: 'Toronto (EST)' },
  { value: 'America/Montreal', label: 'Montréal (EST)' },
  { value: 'America/Vancouver', label: 'Vancouver (PST)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
];

const COUNTRIES = [
  { value: 'CA', label: 'Canada' },
  { value: 'US', label: 'États-Unis' },
  { value: 'FR', label: 'France' },
];

const PROVINCES = {
  CA: [
    { value: 'QC', label: 'Québec' },
    { value: 'ON', label: 'Ontario' },
    { value: 'BC', label: 'Colombie-Britannique' },
    { value: 'AB', label: 'Alberta' },
  ],
  US: [
    { value: 'NY', label: 'New York' },
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
  ],
  FR: [
    { value: 'IDF', label: 'Île-de-France' },
    { value: 'PAC', label: 'Provence-Alpes-Côte d\'Azur' },
  ],
};

const PROFESSIONAL_STATUS = [
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'employee', label: 'Employé' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'student', label: 'Étudiant' },
  { value: 'retired', label: 'Retraité' },
  { value: 'searching', label: 'En recherche' },
  { value: 'other', label: 'Autre' },
];

const INDUSTRIES = [
  { value: 'construction', label: 'Construction' },
  { value: 'tech', label: 'Technologie' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Autre' },
];

const TEAM_SIZES = [
  { value: 'solo', label: 'Solo' },
  { value: '2-10', label: '2-10 personnes' },
  { value: '11-50', label: '11-50 personnes' },
  { value: '51-200', label: '51-200 personnes' },
  { value: '200+', label: '200+ personnes' },
];

const SPHERES = [
  { id: 'personal', name: 'Personal', icon: '👤', description: 'Gestion personnelle, finances, tâches', color: '#4A90D9' },
  { id: 'enterprise', name: 'Enterprise', icon: '🏢', description: 'Multi-entreprises, départements', color: '#2ECC71' },
  { id: 'creative', name: 'Creative Studio', icon: '🎨', description: 'Production créative, contenu', color: '#9B59B6' },
  { id: 'architecture', name: 'Architecture', icon: '📐', description: 'Design architectural, BIM', color: '#E67E22' },
  { id: 'social', name: 'Social Media', icon: '📱', description: 'Réseaux sociaux, posts', color: '#E74C3C' },
  { id: 'community', name: 'Community', icon: '🏘️', description: 'Marketplace, forum, groupes', color: '#1ABC9C' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', description: 'Streaming, médias', color: '#F39C12' },
  { id: 'ai-labs', name: 'AI Labs', icon: '🧪', description: 'Laboratoire IA, agents', color: '#00E5FF' },
  { id: 'design', name: 'Design Studio', icon: '🎭', description: 'Systèmes visuels, UI/UX', color: '#8E44AD' },
];

const EXTERNAL_CONNECTIONS = [
  { id: 'google_drive', name: 'Google Drive', icon: '📁', color: '#4285F4' },
  { id: 'google_calendar', name: 'Google Calendar', icon: '📅', color: '#34A853' },
  { id: 'dropbox', name: 'Dropbox', icon: '📦', color: '#0061FF' },
  { id: 'slack', name: 'Slack', icon: '💬', color: '#4A154B' },
  { id: 'notion', name: 'Notion', icon: '📝', color: '#000000' },
  { id: 'github', name: 'GitHub', icon: '🐙', color: '#24292E' },
];

// ═══════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, initialStep = 1 }) => {
  const [step, setStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    displayName: '',
    language: 'fr-CA',
    timezone: 'America/Toronto',
    avatarType: null,
    avatarFile: null,
    avatarPreview: null,
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'CA',
    status: '',
    companyName: '',
    jobTitle: '',
    industry: '',
    teamSize: '',
    enabledSpheres: ['personal'],
    defaultSphere: 'personal',
    connections: [],
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.firstName.trim() && data.lastName.trim();
      case 2:
        return true; // Photo optionnelle
      case 3:
        return true; // Contact optionnel
      case 4:
        return true; // Professionnel optionnel
      case 5:
        return data.enabledSpheres.length > 0;
      case 6:
        return true; // Connexions optionnelles
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateData({
          avatarType: 'upload',
          avatarFile: file,
          avatarPreview: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSphere = (sphereId: string) => {
    const current = data.enabledSpheres;
    if (current.includes(sphereId)) {
      if (current.length > 1) {
        const newSpheres = current.filter(s => s !== sphereId);
        updateData({
          enabledSpheres: newSpheres,
          defaultSphere: newSpheres.includes(data.defaultSphere) ? data.defaultSphere : newSpheres[0],
        });
      }
    } else {
      updateData({ enabledSpheres: [...current, sphereId] });
    }
  };

  const toggleConnection = (connId: string) => {
    const current = data.connections;
    if (current.includes(connId)) {
      updateData({ connections: current.filter(c => c !== connId) });
    } else {
      updateData({ connections: [...current, connId] });
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    color: COLORS.text,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    color: COLORS.muted,
    fontSize: 13,
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(145deg, ${COLORS.bg} 0%, #121816 50%, #0F1512 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 560,
        background: COLORS.card,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        padding: 40,
      }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}>
              Étape {step}/6
            </span>
            <span style={{ color: COLORS.muted, fontSize: 14 }}>
              {Math.round((step / 6) * 100)}%
            </span>
          </div>
          <div style={{ height: 4, background: COLORS.border, borderRadius: 2 }}>
            <div style={{
              height: '100%',
              width: `${(step / 6) * 100}%`,
              background: `linear-gradient(90deg, ${COLORS.sage} 0%, ${COLORS.cyan} 100%)`,
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {['Identité', 'Photo', 'Contact', 'Pro', 'Sphères', 'Connexions'].map((label, i) => (
              <span key={label} style={{
                fontSize: 10,
                color: i + 1 === step ? COLORS.cyan : i + 1 < step ? COLORS.sage : COLORS.muted,
                fontWeight: i + 1 === step ? 600 : 400,
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ÉTAPE 1: IDENTITÉ */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div>
            <h2 style={{ color: COLORS.text, fontSize: 22, margin: '0 0 8px 0' }}>
              👤 Identité de base
            </h2>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
              Comment voulez-vous être appelé?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Prénom *</label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={e => updateData({ firstName: e.target.value })}
                  style={inputStyle}
                  placeholder="Jo"
                />
              </div>
              <div>
                <label style={labelStyle}>Nom *</label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={e => updateData({ lastName: e.target.value })}
                  style={inputStyle}
                  placeholder="Tremblay"
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Nom d'affichage</label>
              <input
                type="text"
                value={data.displayName}
                onChange={e => updateData({ displayName: e.target.value })}
                style={inputStyle}
                placeholder={data.firstName ? `${data.firstName} ${data.lastName.charAt(0)}.` : 'Jo T.'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Langue</label>
                <select
                  value={data.language}
                  onChange={e => updateData({ language: e.target.value })}
                  style={selectStyle}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Fuseau horaire</label>
                <select
                  value={data.timezone}
                  onChange={e => updateData({ timezone: e.target.value })}
                  style={selectStyle}
                >
                  {TIMEZONES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ÉTAPE 2: PHOTO */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div>
            <h2 style={{ color: COLORS.text, fontSize: 22, margin: '0 0 8px 0' }}>
              📷 Photo de profil
            </h2>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
              Ajoutez une photo pour personnaliser votre profil
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: data.avatarPreview ? `url(${data.avatarPreview}) center/cover` : COLORS.bg,
                border: `3px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
              }}>
                {!data.avatarPreview && '👤'}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '14px 20px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  color: COLORS.text,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                📤 Télécharger une photo
              </button>
              <button
                onClick={() => {
                  // Simulate camera capture
                  updateData({
                    avatarType: 'generated',
                    avatarPreview: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
                  });
                }}
                style={{
                  padding: '14px 20px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  color: COLORS.text,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                🎨 Utiliser un avatar généré
              </button>
            </div>

            <p style={{ color: COLORS.muted, fontSize: 12, textAlign: 'center', marginTop: 16 }}>
              Format: JPG, PNG | Max: 5MB | Dimensions: 400x400 min
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ÉTAPE 3: CONTACT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div>
            <h2 style={{ color: COLORS.text, fontSize: 22, margin: '0 0 8px 0' }}>
              📍 Informations de contact
            </h2>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
              Ces informations sont optionnelles
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Téléphone</label>
              <input
                type="tel"
                value={data.phone}
                onChange={e => updateData({ phone: e.target.value })}
                style={inputStyle}
                placeholder="+1 514 555 1234"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Adresse</label>
              <input
                type="text"
                value={data.street}
                onChange={e => updateData({ street: e.target.value })}
                style={inputStyle}
                placeholder="123 Rue Principale"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Ville</label>
                <input
                  type="text"
                  value={data.city}
                  onChange={e => updateData({ city: e.target.value })}
                  style={inputStyle}
                  placeholder="Brossard"
                />
              </div>
              <div>
                <label style={labelStyle}>Code postal</label>
                <input
                  type="text"
                  value={data.postalCode}
                  onChange={e => updateData({ postalCode: e.target.value })}
                  style={inputStyle}
                  placeholder="J4W 1A1"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Pays</label>
                <select
                  value={data.country}
                  onChange={e => updateData({ country: e.target.value, state: '' })}
                  style={selectStyle}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Province/État</label>
                <select
                  value={data.state}
                  onChange={e => updateData({ state: e.target.value })}
                  style={selectStyle}
                >
                  <option value="">Sélectionner...</option>
                  {(PROVINCES[data.country as keyof typeof PROVINCES] || []).map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ÉTAPE 4: PROFESSIONNEL */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div>
            <h2 style={{ color: COLORS.text, fontSize: 22, margin: '0 0 8px 0' }}>
              💼 Contexte professionnel
            </h2>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
              Aidez-nous à personnaliser votre expérience
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Situation</label>
              <select
                value={data.status}
                onChange={e => updateData({ status: e.target.value })}
                style={selectStyle}
              >
                <option value="">Sélectionner...</option>
                {PROFESSIONAL_STATUS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Nom de l'entreprise</label>
              <input
                type="text"
                value={data.companyName}
                onChange={e => updateData({ companyName: e.target.value })}
                style={inputStyle}
                placeholder="Pro-Service Construction"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Titre / Poste</label>
              <input
                type="text"
                value={data.jobTitle}
                onChange={e => updateData({ jobTitle: e.target.value })}
                style={inputStyle}
                placeholder="Fondateur & Développeur"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Secteur d'activité</label>
                <select
                  value={data.industry}
                  onChange={e => updateData({ industry: e.target.value })}
                  style={selectStyle}
                >
                  <option value="">Sélectionner...</option>
                  {INDUSTRIES.map(i => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Taille équipe</label>
                <select
                  value={data.teamSize}
                  onChange={e => updateData({ teamSize: e.target.value })}
                  style={selectStyle}
                >
                  <option value="">Sélectionner...</option>
                  {TEAM_SIZES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ÉTAPE 5: SPHÈRES */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {step === 5 && (
          <div>
            <h2 style={{ color: COLORS.text, fontSize: 22, margin: '0 0 8px 0' }}>
              🌐 Sphères initiales
            </h2>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
              Sélectionnez les sphères que vous souhaitez activer (minimum 1)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {SPHERES.map(sphere => {
                const isEnabled = data.enabledSpheres.includes(sphere.id);
                const isDefault = data.defaultSphere === sphere.id;
                return (
                  <div
                    key={sphere.id}
                    onClick={() => toggleSphere(sphere.id)}
                    style={{
                      padding: 16,
                      background: isEnabled ? `${sphere.color}15` : COLORS.bg,
                      border: `2px solid ${isEnabled ? sphere.color : COLORS.border}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{sphere.icon}</div>
                    <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 500 }}>
                      {sphere.name}
                    </div>
                    {isEnabled && (
                      <div style={{
                        marginTop: 8,
                        fontSize: 10,
                        color: sphere.color,
                        fontWeight: 600,
                      }}>
                        ✓ Activée
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {data.enabledSpheres.length > 1 && (
              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Sphère par défaut</label>
                <select
                  value={data.defaultSphere}
                  onChange={e => updateData({ defaultSphere: e.target.value })}
                  style={selectStyle}
                >
                  {data.enabledSpheres.map(id => {
                    const sphere = SPHERES.find(s => s.id === id);
                    return (
                      <option key={id} value={id}>
                        {sphere?.icon} {sphere?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 16 }}>
              💡 Vous pourrez modifier ces choix plus tard dans les paramètres
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ÉTAPE 6: CONNEXIONS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {step === 6 && (
          <div>
            <h2 style={{ color: COLORS.text, fontSize: 22, margin: '0 0 8px 0' }}>
              🔗 Connexions externes
            </h2>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
              Connectez vos comptes existants (optionnel)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {EXTERNAL_CONNECTIONS.map(conn => {
                const isConnected = data.connections.includes(conn.id);
                return (
                  <button
                    key={conn.id}
                    onClick={() => toggleConnection(conn.id)}
                    style={{
                      padding: '14px 20px',
                      background: isConnected ? `${conn.color}15` : COLORS.bg,
                      border: `1px solid ${isConnected ? conn.color : COLORS.border}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{conn.icon}</span>
                      <span style={{ color: COLORS.text, fontSize: 14 }}>{conn.name}</span>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      background: isConnected ? COLORS.success : 'transparent',
                      border: isConnected ? 'none' : `1px solid ${COLORS.border}`,
                      borderRadius: 20,
                      color: isConnected ? 'white' : COLORS.muted,
                      fontSize: 12,
                    }}>
                      {isConnected ? '✓ Connecté' : 'Connecter'}
                    </span>
                  </button>
                );
              })}
            </div>

            <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 16, textAlign: 'center' }}>
              Vous pourrez connecter d'autres services plus tard
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* NAVIGATION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              color: step === 1 ? COLORS.muted : COLORS.text,
              fontSize: 14,
              cursor: step === 1 ? 'default' : 'pointer',
              opacity: step === 1 ? 0.5 : 1,
            }}
          >
            ← Précédent
          </button>

          <div style={{ display: 'flex', gap: 12 }}>
            {step > 1 && step < 6 && (
              <button
                onClick={handleSkip}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  color: COLORS.muted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Passer
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              style={{
                padding: '12px 24px',
                background: canProceed() ? `linear-gradient(135deg, ${COLORS.sage} 0%, #2D5233 100%)` : COLORS.border,
                border: 'none',
                borderRadius: 10,
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: canProceed() && !isLoading ? 'pointer' : 'not-allowed',
              }}
            >
              {isLoading ? 'Finalisation...' : step === 6 ? 'Terminer ✓' : 'Suivant →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
