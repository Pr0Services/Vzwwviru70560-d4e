/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — COMPLETE ONBOARDING WIZARD
 * Governed Intelligence Operating System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Wizard complet d'onboarding en 5 étapes:
 * 1. Welcome - Introduction avec Nova
 * 2. Theme - Sélection du thème visuel (avec vraies images maps)
 * 3. Profile Style - Style d'interface
 * 4. Spheres - Configuration des 8 sphères
 * 5. Profile - Questions par sphère pour établir le profil
 * 
 * @version 3.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface UserProfile {
  // Identity
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  
  // Theme & Style
  selectedTheme: string;
  profileStyle: string;
  
  // Spheres
  activeSpheres: string[];
  primarySphere: string;
  
  // Sphere-specific data
  sphereProfiles: Record<string, SphereProfileData>;
  
  // Preferences
  language: 'en' | 'fr';
  timezone: string;
  notifications: boolean;
}

interface SphereProfileData {
  isConfigured: boolean;
  progress: number;
  data: Record<string, any>;
}

type OnboardingStep = 'welcome' | 'theme' | 'style' | 'spheres' | 'profile' | 'complete';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  deepBlack: '#0D0D0D',
  pureWhite: '#FFFFFF',
};

const THEMES = [
  {
    id: 'sacred-temple',
    name: 'Temple Sacré',
    emoji: '🏛️',
    image: '/assets/maps/map-isometric-0.png',
    color: '#D8B26A',
    description: 'Architecture maya ancestrale avec l\'arbre sacré au centre',
  },
  {
    id: 'cyber-nexus',
    name: 'Nexus Cyber',
    emoji: '🌐',
    image: '/assets/maps/map-aerial-1.png',
    color: '#00E5FF',
    description: 'Hub futuriste avec énergie turquoise néon',
  },
  {
    id: 'nature-sanctuary',
    name: 'Sanctuaire Naturel',
    emoji: '🌳',
    image: '/assets/maps/map-isometric-1.png',
    color: '#3F7249',
    description: 'Fusion organique technologie et nature',
  },
  {
    id: 'atlantean-citadel',
    name: 'Citadelle Atlante',
    emoji: '🔮',
    image: '/assets/maps/map-isometric-2.png',
    color: '#3EB4A2',
    description: 'Architecture cristalline sous-marine',
  },
  {
    id: 'cosmic-observatory',
    name: 'Observatoire Cosmique',
    emoji: '✨',
    image: '/assets/maps/map-aerial-3.png',
    color: '#E9E4D6',
    description: 'Vue stellaire avec constellations',
  },
];

const PROFILE_STYLES = [
  { id: 'minimalist', name: 'Minimaliste', icon: '◯', desc: 'Interface épurée et focalisée' },
  { id: 'professional', name: 'Professionnel', icon: '📊', desc: 'Métriques et analytiques' },
  { id: 'creative', name: 'Créatif', icon: '🎨', desc: 'Mood boards et inspiration' },
  { id: 'immersive', name: 'Immersif', icon: '🥽', desc: 'Environnements 3D et VR' },
  { id: 'balanced', name: 'Équilibré', icon: '⚖️', desc: 'Adaptatif au contexte' },
];

const SPHERES = [
  { id: 'personal', name: 'Personnel', emoji: '🏠', color: '#3EB4A2', symbol: '◇' },
  { id: 'business', name: 'Entreprise', emoji: '💼', color: '#D8B26A', symbol: '⬡' },
  { id: 'government', name: 'Gouvernement', emoji: '🏛️', color: '#8D8371', symbol: '⏣' },
  { id: 'creative', name: 'Studio Créatif', emoji: '🎨', color: '#7A593A', symbol: '✦' },
  { id: 'community', name: 'Communauté', emoji: '👥', color: '#3F7249', symbol: '◉' },
  { id: 'social', name: 'Social & Média', emoji: '📱', color: '#2F4C39', symbol: '⊛' },
  { id: 'entertainment', name: 'Divertissement', emoji: '🎬', color: '#E9E4D6', symbol: '▷' },
  { id: 'my_team', name: 'Mon Équipe', emoji: '🤝', color: '#1E1F22', symbol: '⎔' },
];

// Questions par sphère pour établir le profil
const SPHERE_QUESTIONS: Record<string, Array<{
  id: string;
  question: string;
  type: 'text' | 'select' | 'multi' | 'number' | 'date';
  options?: string[];
  placeholder?: string;
}>> = {
  personal: [
    { id: 'life_goals', question: 'Quels sont vos principaux objectifs de vie ?', type: 'text', placeholder: 'Santé, famille, développement personnel...' },
    { id: 'interests', question: 'Quels sont vos centres d\'intérêt ?', type: 'multi', options: ['Sport', 'Lecture', 'Voyage', 'Musique', 'Cuisine', 'Art', 'Tech', 'Nature'] },
    { id: 'family_status', question: 'Situation familiale ?', type: 'select', options: ['Célibataire', 'En couple', 'Marié(e)', 'Famille avec enfants'] },
  ],
  business: [
    { id: 'company_name', question: 'Nom de votre entreprise principale ?', type: 'text', placeholder: 'Nom de l\'entreprise...' },
    { id: 'role', question: 'Votre rôle ?', type: 'select', options: ['Fondateur/CEO', 'Directeur', 'Manager', 'Employé', 'Freelance', 'Consultant'] },
    { id: 'industry', question: 'Secteur d\'activité ?', type: 'select', options: ['Tech', 'Finance', 'Construction', 'Santé', 'Commerce', 'Services', 'Autre'] },
    { id: 'team_size', question: 'Taille de votre équipe ?', type: 'select', options: ['Solo', '2-10', '11-50', '51-200', '200+'] },
  ],
  government: [
    { id: 'country', question: 'Pays de résidence ?', type: 'text', placeholder: 'Canada, France...' },
    { id: 'tax_status', question: 'Statut fiscal ?', type: 'select', options: ['Particulier', 'Travailleur autonome', 'Société', 'Autre'] },
    { id: 'important_deadlines', question: 'Dates importantes à retenir ?', type: 'text', placeholder: 'Impôts, renouvellements...' },
  ],
  creative: [
    { id: 'creative_domains', question: 'Domaines créatifs ?', type: 'multi', options: ['Design', 'Écriture', 'Musique', 'Vidéo', 'Photo', 'Art', '3D', 'Code'] },
    { id: 'tools', question: 'Outils principaux ?', type: 'text', placeholder: 'Figma, Adobe, etc...' },
    { id: 'portfolio_link', question: 'Lien vers votre portfolio ?', type: 'text', placeholder: 'https://...' },
  ],
  community: [
    { id: 'groups', question: 'Groupes ou associations ?', type: 'text', placeholder: 'Noms des groupes...' },
    { id: 'roles', question: 'Rôles communautaires ?', type: 'multi', options: ['Membre', 'Organisateur', 'Modérateur', 'Fondateur', 'Bénévole'] },
    { id: 'causes', question: 'Causes qui vous tiennent à cœur ?', type: 'text', placeholder: 'Environnement, éducation...' },
  ],
  social: [
    { id: 'platforms', question: 'Plateformes actives ?', type: 'multi', options: ['LinkedIn', 'Twitter/X', 'Instagram', 'TikTok', 'YouTube', 'Facebook'] },
    { id: 'content_type', question: 'Type de contenu ?', type: 'multi', options: ['Professionnel', 'Personnel', 'Éducatif', 'Divertissement'] },
    { id: 'followers', question: 'Audience totale approximative ?', type: 'select', options: ['< 1K', '1K-10K', '10K-100K', '100K+'] },
  ],
  entertainment: [
    { id: 'preferences', question: 'Préférences média ?', type: 'multi', options: ['Films', 'Séries', 'Musique', 'Podcasts', 'Jeux vidéo', 'Sports', 'Livres'] },
    { id: 'subscriptions', question: 'Abonnements actifs ?', type: 'multi', options: ['Netflix', 'Spotify', 'Disney+', 'YouTube Premium', 'PlayStation', 'Xbox'] },
    { id: 'hobbies', question: 'Hobbies principaux ?', type: 'text', placeholder: 'Gaming, lecture, sport...' },
  ],
  team: [
    { id: 'ai_experience', question: 'Expérience avec l\'IA ?', type: 'select', options: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'] },
    { id: 'main_use', question: 'Usage principal de CHE·NU ?', type: 'multi', options: ['Productivité', 'Créativité', 'Business', 'Personnel', 'Recherche'] },
    { id: 'budget_preference', question: 'Budget tokens mensuel préféré ?', type: 'select', options: ['Économique', 'Standard', 'Premium', 'Illimité'] },
  ],
};

// Nova messages par étape
const NOVA_MESSAGES: Record<OnboardingStep, string> = {
  welcome: "Bienvenue dans CHE·NU ! Je suis Nova, votre guide de gouvernance. Je vais vous aider à créer votre espace personnel. CHE·NU organise votre vie en 8 sphères distinctes, chacune avec son propre contexte et ses agents IA. Prêt à commencer ?",
  theme: "Choisissez l'univers visuel qui vous inspire. Chaque thème représente une énergie différente — de la sagesse ancienne des temples à l'innovation futuriste du cyber nexus. Votre choix définira l'atmosphère de votre espace.",
  style: "Excellent ! Maintenant, définissons comment vous interagirez avec vos sphères. Votre style de profil détermine la mise en page et les fonctionnalités. Choisissez ce qui correspond à votre façon de travailler.",
  spheres: "Parfait ! CHE·NU possède 8 sphères. Sélectionnez celles que vous souhaitez activer maintenant. Vous pourrez toujours en ajouter plus tard. Chaque sphère aura son propre bureau avec les mêmes 10 sections.",
  profile: "Dernière étape ! Pour que je puisse mieux vous assister, répondez à quelques questions sur chaque sphère active. Cela me permettra de personnaliser votre expérience et de mieux comprendre votre contexte.",
  complete: "Félicitations ! Votre CHE·NU est prêt. Vous avez créé un espace gouverné, personnalisé et intelligent. Je serai toujours là pour vous guider. Bienvenue dans votre nouveau système d'opération de vie !",
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Nova Assistant
const Nova: React.FC<{ message: string; speaking?: boolean }> = ({ message, speaking = true }) => {
  const [text, setText] = useState('');
  
  useEffect(() => {
    if (speaking) {
      let i = 0;
      setText('');
      const timer = setInterval(() => {
        if (i < message.length) {
          setText(message.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 20);
      return () => clearInterval(timer);
    } else {
      setText(message);
    }
  }, [message, speaking]);

  return (
    <div style={styles.novaContainer}>
      <div style={styles.novaAvatar}>
        <div style={styles.novaGlow} />
        <div style={styles.novaCore}>✨</div>
      </div>
      <div style={styles.novaBubble}>
        <div style={styles.novaLabel}>NOVA</div>
        <p style={styles.novaText}>{text}{speaking && text.length < message.length && <span style={styles.cursor}>▋</span>}</p>
      </div>
    </div>
  );
};

// Progress Bar
const ProgressBar: React.FC<{ step: OnboardingStep }> = ({ step }) => {
  const steps: OnboardingStep[] = ['welcome', 'theme', 'style', 'spheres', 'profile', 'complete'];
  const currentIndex = steps.indexOf(step);
  
  return (
    <div style={styles.progressContainer}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{
            ...styles.progressDot,
            background: i <= currentIndex ? COLORS.sacredGold : COLORS.uiSlate,
          }}>
            {i < currentIndex ? '✓' : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div style={{
              ...styles.progressLine,
              background: i < currentIndex ? COLORS.sacredGold : COLORS.uiSlate,
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Theme Card
const ThemeCard: React.FC<{
  theme: typeof THEMES[0];
  selected: boolean;
  onClick: () => void;
}> = ({ theme, selected, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.themeCard,
        borderColor: selected ? theme.color : 'transparent',
        transform: selected ? 'translateY(-4px)' : hovered ? 'translateY(-2px)' : 'none',
        boxShadow: selected ? `0 0 30px ${theme.color}40` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.themeImageWrap}>
        {!loaded && <div style={styles.themePlaceholder}>{theme.emoji}</div>}
        <img
          src={theme.image}
          alt={theme.name}
          style={{ ...styles.themeImage, opacity: loaded ? 1 : 0, transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          onLoad={() => setLoaded(true)}
        />
        <div style={styles.themeGradient} />
        {selected && <div style={{ ...styles.selectedBadge, background: theme.color }}>✓</div>}
      </div>
      <div style={styles.themeInfo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{theme.emoji}</span>
          <span style={{ ...styles.themeName, color: selected ? theme.color : COLORS.softSand }}>{theme.name}</span>
        </div>
        <p style={styles.themeDesc}>{theme.description}</p>
        <div style={{ ...styles.colorDot, background: theme.color }} />
      </div>
    </div>
  );
};

// Style Card
const StyleCard: React.FC<{
  style: typeof PROFILE_STYLES[0];
  selected: boolean;
  onClick: () => void;
  accentColor: string;
}> = ({ style, selected, onClick, accentColor }) => (
  <div
    style={{
      ...styles.styleCard,
      borderColor: selected ? accentColor : 'transparent',
      background: selected ? `${accentColor}15` : 'rgba(30,31,34,0.8)',
    }}
    onClick={onClick}
  >
    <div style={{
      ...styles.styleIcon,
      background: selected ? accentColor : COLORS.uiSlate,
      color: selected ? COLORS.deepBlack : COLORS.softSand,
    }}>
      {style.icon}
    </div>
    <div>
      <div style={{ ...styles.styleName, color: selected ? accentColor : COLORS.softSand }}>{style.name}</div>
      <div style={styles.styleDesc}>{style.desc}</div>
    </div>
    {selected && <div style={{ marginLeft: 'auto', color: accentColor, fontSize: 18 }}>✓</div>}
  </div>
);

// Sphere Toggle
const SphereToggle: React.FC<{
  sphere: typeof SPHERES[0];
  active: boolean;
  primary: boolean;
  onToggle: () => void;
  onSetPrimary: () => void;
}> = ({ sphere, active, primary, onToggle, onSetPrimary }) => (
  <div
    style={{
      ...styles.sphereCard,
      borderColor: active ? sphere.color : 'transparent',
      background: active ? `${sphere.color}15` : 'rgba(30,31,34,0.6)',
      opacity: active ? 1 : 0.7,
    }}
    onClick={onToggle}
  >
    <div style={styles.sphereTop}>
      <span style={styles.sphereEmoji}>{sphere.emoji}</span>
      <span style={styles.sphereSymbol}>{sphere.symbol}</span>
    </div>
    <div style={{ ...styles.sphereName, color: active ? sphere.color : COLORS.ancientStone }}>{sphere.name}</div>
    {active && (
      <button
        style={{
          ...styles.primaryBtn,
          background: primary ? sphere.color : 'transparent',
          color: primary ? COLORS.deepBlack : COLORS.ancientStone,
          borderColor: primary ? sphere.color : COLORS.ancientStone,
        }}
        onClick={(e) => { e.stopPropagation(); onSetPrimary(); }}
      >
        {primary ? '★ Principal' : 'Définir principal'}
      </button>
    )}
    {active && <div style={{ ...styles.sphereCheck, color: sphere.color }}>✓</div>}
  </div>
);

// Question Form
const QuestionForm: React.FC<{
  sphereId: string;
  questions: typeof SPHERE_QUESTIONS['personal'];
  answers: Record<string, any>;
  onChange: (id: string, value: unknown) => void;
  accentColor: string;
}> = ({ sphereId, questions, answers, onChange, accentColor }) => (
  <div style={styles.questionsContainer}>
    {questions.map((q) => (
      <div key={q.id} style={styles.questionBlock}>
        <label style={styles.questionLabel}>{q.question}</label>
        
        {q.type === 'text' && (
          <input
            type="text"
            value={answers[q.id] || ''}
            onChange={(e) => onChange(q.id, e.target.value)}
            placeholder={q.placeholder}
            style={{ ...styles.input, borderColor: answers[q.id] ? accentColor : COLORS.uiSlate }}
          />
        )}
        
        {q.type === 'select' && (
          <select
            value={answers[q.id] || ''}
            onChange={(e) => onChange(q.id, e.target.value)}
            style={{ ...styles.select, borderColor: answers[q.id] ? accentColor : COLORS.uiSlate }}
          >
            <option value="">Sélectionner...</option>
            {q.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        
        {q.type === 'multi' && (
          <div style={styles.multiOptions}>
            {q.options?.map((opt) => {
              const selected = (answers[q.id] || []).includes(opt);
              return (
                <button
                  key={opt}
                  style={{
                    ...styles.multiOption,
                    background: selected ? `${accentColor}20` : 'transparent',
                    borderColor: selected ? accentColor : COLORS.uiSlate,
                    color: selected ? accentColor : COLORS.softSand,
                  }}
                  onClick={() => {
                    const current = answers[q.id] || [];
                    const newVal = selected 
                      ? current.filter((v: string) => v !== opt)
                      : [...current, opt];
                    onChange(q.id, newVal);
                  }}
                >
                  {selected && '✓ '}{opt}
                </button>
              );
            })}
          </div>
        )}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WIZARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const OnboardingWizard: React.FC<{
  onComplete: (profile: UserProfile) => void;
}> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    selectedTheme: '',
    profileStyle: '',
    activeSpheres: ['personal'],
    primarySphere: 'personal',
    sphereProfiles: {},
    language: 'fr',
    timezone: 'America/Toronto',
    notifications: true,
  });
  
  const [currentSphereIndex, setCurrentSphereIndex] = useState(0);
  const [sphereAnswers, setSphereAnswers] = useState<Record<string, Record<string, any>>>({});

  const selectedThemeData = THEMES.find(t => t.id === profile.selectedTheme);
  const accentColor = selectedThemeData?.color || COLORS.sacredGold;
  
  const activeSpheresList = SPHERES.filter(s => profile.activeSpheres.includes(s.id));
  const currentSphere = activeSpheresList[currentSphereIndex];

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    switch (step) {
      case 'welcome': setStep('theme'); break;
      case 'theme': if (profile.selectedTheme) setStep('style'); break;
      case 'style': if (profile.profileStyle) setStep('spheres'); break;
      case 'spheres': if (profile.activeSpheres.length > 0) setStep('profile'); break;
      case 'profile':
        if (currentSphereIndex < activeSpheresList.length - 1) {
          setCurrentSphereIndex(i => i + 1);
        } else {
          setStep('complete');
        }
        break;
      case 'complete':
        onComplete({
          ...profile,
          sphereProfiles: Object.fromEntries(
            profile.activeSpheres.map(id => [id, {
              isConfigured: true,
              progress: 100,
              data: sphereAnswers[id] || {},
            }])
          ),
        });
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'theme': setStep('welcome'); break;
      case 'style': setStep('theme'); break;
      case 'spheres': setStep('style'); break;
      case 'profile':
        if (currentSphereIndex > 0) {
          setCurrentSphereIndex(i => i - 1);
        } else {
          setStep('spheres');
        }
        break;
      case 'complete': setStep('profile'); break;
    }
  };

  const toggleSphere = (id: string) => {
    const active = profile.activeSpheres.includes(id);
    if (active && profile.activeSpheres.length === 1) return; // Keep at least one
    
    updateProfile({
      activeSpheres: active 
        ? profile.activeSpheres.filter(s => s !== id)
        : [...profile.activeSpheres, id],
      primarySphere: active && profile.primarySphere === id 
        ? profile.activeSpheres.filter(s => s !== id)[0] 
        : profile.primarySphere,
    });
  };

  const canProceed = () => {
    switch (step) {
      case 'welcome': return true;
      case 'theme': return !!profile.selectedTheme;
      case 'style': return !!profile.profileStyle;
      case 'spheres': return profile.activeSpheres.length > 0;
      case 'profile': return true; // Questions are optional
      case 'complete': return true;
    }
  };

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background}>
        {selectedThemeData && (
          <img src={selectedThemeData.image} alt="" style={styles.bgImage} />
        )}
        <div style={styles.bgOverlay} />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>CHE·NU™</div>
        <ProgressBar step={step} />
      </div>

      {/* Nova */}
      <Nova message={NOVA_MESSAGES[step]} />

      {/* Content */}
      <div style={styles.content}>
        {/* WELCOME */}
        {step === 'welcome' && (
          <div style={styles.welcomeContainer}>
            <div style={styles.welcomeCard}>
              <h1 style={styles.welcomeTitle}>Bienvenue dans CHE·NU™</h1>
              <p style={styles.welcomeSubtitle}>Governed Intelligence Operating System</p>
              <div style={styles.welcomeFeatures}>
                <div style={styles.welcomeFeature}>
                  <span style={styles.featureIcon}>◇⬡⏣✦◉⊛▷⎔</span>
                  <span>8 Sphères de vie</span>
                </div>
                <div style={styles.welcomeFeature}>
                  <span style={styles.featureIcon}>🏛️</span>
                  <span>Bureau unifié par sphère</span>
                </div>
                <div style={styles.welcomeFeature}>
                  <span style={styles.featureIcon}>🤖</span>
                  <span>226 agents IA gouvernés</span>
                </div>
                <div style={styles.welcomeFeature}>
                  <span style={styles.featureIcon}>💰</span>
                  <span>Gouvernance des coûts</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* THEME SELECTION */}
        {step === 'theme' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🎨 Choisissez votre Univers</h2>
            <div style={styles.themesGrid}>
              {THEMES.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  selected={profile.selectedTheme === theme.id}
                  onClick={() => updateProfile({ selectedTheme: theme.id })}
                />
              ))}
            </div>
          </div>
        )}

        {/* STYLE SELECTION */}
        {step === 'style' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>⚙️ Définissez votre Style</h2>
            <div style={styles.stylesGrid}>
              {PROFILE_STYLES.map((s) => (
                <StyleCard
                  key={s.id}
                  style={s}
                  selected={profile.profileStyle === s.id}
                  onClick={() => updateProfile({ profileStyle: s.id })}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* SPHERES SELECTION */}
        {step === 'spheres' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🌐 Activez vos Sphères</h2>
            <p style={styles.sectionSubtitle}>Minimum 1 sphère. Vous pourrez en ajouter plus tard.</p>
            <div style={styles.spheresGrid}>
              {SPHERES.map((sphere) => (
                <SphereToggle
                  key={sphere.id}
                  sphere={sphere}
                  active={profile.activeSpheres.includes(sphere.id)}
                  primary={profile.primarySphere === sphere.id}
                  onToggle={() => toggleSphere(sphere.id)}
                  onSetPrimary={() => updateProfile({ primarySphere: sphere.id })}
                />
              ))}
            </div>
          </div>
        )}

        {/* PROFILE QUESTIONS */}
        {step === 'profile' && currentSphere && (
          <div style={styles.section}>
            <div style={styles.sphereHeader}>
              <span style={{ fontSize: 32 }}>{currentSphere.emoji}</span>
              <h2 style={{ ...styles.sectionTitle, color: currentSphere.color }}>{currentSphere.name}</h2>
              <span style={styles.sphereProgress}>({currentSphereIndex + 1}/{activeSpheresList.length})</span>
            </div>
            <p style={styles.sectionSubtitle}>Ces informations aident Nova à mieux vous assister. Optionnel.</p>
            
            <QuestionForm
              sphereId={currentSphere.id}
              questions={SPHERE_QUESTIONS[currentSphere.id] || []}
              answers={sphereAnswers[currentSphere.id] || {}}
              onChange={(qId, val) => {
                setSphereAnswers(prev => ({
                  ...prev,
                  [currentSphere.id]: { ...(prev[currentSphere.id] || {}), [qId]: val },
                }));
              }}
              accentColor={currentSphere.color}
            />
          </div>
        )}

        {/* COMPLETE */}
        {step === 'complete' && selectedThemeData && (
          <div style={styles.completeContainer}>
            <div style={styles.completeCard}>
              <img src={selectedThemeData.image} alt="" style={styles.completeImage} />
              <div style={styles.completeOverlay}>
                <h2 style={styles.completeTitle}>🎉 CHE·NU est prêt !</h2>
                <div style={styles.completeSummary}>
                  <div><strong>Thème:</strong> {selectedThemeData.emoji} {selectedThemeData.name}</div>
                  <div><strong>Style:</strong> {PROFILE_STYLES.find(s => s.id === profile.profileStyle)?.name}</div>
                  <div><strong>Sphères:</strong> {profile.activeSpheres.length} activées</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        {step !== 'welcome' && (
          <button style={styles.backBtn} onClick={handleBack}>
            ← Retour
          </button>
        )}
        <button
          style={{
            ...styles.nextBtn,
            background: accentColor,
            opacity: canProceed() ? 1 : 0.5,
          }}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === 'complete' ? 'Entrer dans CHE·NU →' : 'Continuer →'}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', background: COLORS.deepBlack, position: 'relative' },
  background: { position: 'absolute', inset: 0, zIndex: 0 },
  bgImage: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, filter: 'blur(20px)' },
  bgOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,13,0.9) 0%, rgba(13,13,13,0.7) 50%, rgba(13,13,13,0.95) 100%)' },
  
  header: { position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' },
  logo: { fontSize: 22, fontWeight: 700, color: COLORS.sacredGold, letterSpacing: 2 },
  
  progressContainer: { display: 'flex', alignItems: 'center', gap: 4 },
  progressDot: { width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: COLORS.deepBlack },
  progressLine: { width: 24, height: 2 },
  
  novaContainer: { position: 'relative', zIndex: 10, display: 'flex', alignItems: 'flex-start', gap: 16, padding: '0 40px', marginBottom: 24 },
  novaAvatar: { position: 'relative', width: 48, height: 48, flexShrink: 0 },
  novaGlow: { position: 'absolute', inset: -4, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.sacredGold}40 0%, transparent 70%)` },
  novaCore: { width: '100%', height: '100%', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.sacredGold} 0%, ${COLORS.earthEmber} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  novaBubble: { flex: 1, maxWidth: 600, background: 'rgba(30,31,34,0.9)', border: `1px solid ${COLORS.sacredGold}30`, borderRadius: 12, padding: '12px 16px' },
  novaLabel: { fontSize: 9, fontWeight: 700, color: COLORS.sacredGold, letterSpacing: 2, marginBottom: 6 },
  novaText: { fontSize: 14, lineHeight: 1.6, color: COLORS.softSand, margin: 0 },
  cursor: { color: COLORS.sacredGold },
  
  content: { position: 'relative', zIndex: 10, padding: '0 40px 100px', maxWidth: 1200, margin: '0 auto' },
  section: {},
  sectionTitle: { fontSize: 24, fontWeight: 700, color: COLORS.softSand, marginBottom: 8, textAlign: 'center' as const },
  sectionSubtitle: { fontSize: 14, color: COLORS.ancientStone, marginBottom: 24, textAlign: 'center' as const },
  
  // Welcome
  welcomeContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 },
  welcomeCard: { background: 'rgba(30,31,34,0.9)', borderRadius: 20, padding: 40, textAlign: 'center' as const, maxWidth: 500, border: `1px solid ${COLORS.sacredGold}30` },
  welcomeTitle: { fontSize: 32, color: COLORS.sacredGold, marginBottom: 8 },
  welcomeSubtitle: { fontSize: 14, color: COLORS.ancientStone, marginBottom: 32 },
  welcomeFeatures: { display: 'flex', flexDirection: 'column' as const, gap: 16 },
  welcomeFeature: { display: 'flex', alignItems: 'center', gap: 12, color: COLORS.softSand, fontSize: 14 },
  featureIcon: { fontSize: 18 },
  
  // Themes
  themesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  themeCard: { background: 'rgba(30,31,34,0.8)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', border: '2px solid transparent' },
  themeImageWrap: { position: 'relative', height: 140, overflow: 'hidden' },
  themeImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s' },
  themePlaceholder: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.uiSlate, fontSize: 40 },
  themeGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(13,13,13,0.8) 100%)' },
  selectedBadge: { position: 'absolute', top: 8, right: 8, padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 600, color: COLORS.deepBlack },
  themeInfo: { padding: 12 },
  themeName: { fontSize: 14, fontWeight: 600 },
  themeDesc: { fontSize: 11, color: COLORS.ancientStone, margin: '6px 0 10px', lineHeight: 1.4 },
  colorDot: { width: 12, height: 12, borderRadius: '50%' },
  
  // Styles
  stylesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, maxWidth: 800, margin: '0 auto' },
  styleCard: { display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' },
  styleIcon: { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  styleName: { fontSize: 14, fontWeight: 600, marginBottom: 2 },
  styleDesc: { fontSize: 11, color: COLORS.ancientStone },
  
  // Spheres
  spheresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 },
  sphereCard: { padding: 16, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent', position: 'relative' },
  sphereTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sphereEmoji: { fontSize: 28 },
  sphereSymbol: { fontSize: 16, color: COLORS.ancientStone },
  sphereName: { fontSize: 12, fontWeight: 600, marginBottom: 10 },
  primaryBtn: { fontSize: 9, padding: '4px 8px', borderRadius: 10, border: '1px solid', cursor: 'pointer', transition: 'all 0.2s' },
  sphereCheck: { position: 'absolute', top: 8, right: 8, fontSize: 14 },
  
  // Profile Questions
  sphereHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 },
  sphereProgress: { fontSize: 12, color: COLORS.ancientStone },
  questionsContainer: { display: 'flex', flexDirection: 'column' as const, gap: 20, maxWidth: 600, margin: '0 auto' },
  questionBlock: { display: 'flex', flexDirection: 'column' as const, gap: 8 },
  questionLabel: { fontSize: 13, color: COLORS.softSand, fontWeight: 500 },
  input: { padding: '12px 14px', background: 'rgba(30,31,34,0.8)', border: '1px solid', borderRadius: 8, color: COLORS.softSand, fontSize: 14, outline: 'none' },
  select: { padding: '12px 14px', background: 'rgba(30,31,34,0.8)', border: '1px solid', borderRadius: 8, color: COLORS.softSand, fontSize: 14, outline: 'none' },
  multiOptions: { display: 'flex', flexWrap: 'wrap' as const, gap: 8 },
  multiOption: { padding: '8px 14px', borderRadius: 20, border: '1px solid', cursor: 'pointer', fontSize: 12, transition: 'all 0.2s' },
  
  // Complete
  completeContainer: { display: 'flex', justifyContent: 'center' },
  completeCard: { position: 'relative', borderRadius: 16, overflow: 'hidden', width: '100%', maxWidth: 700, aspectRatio: '16/9' },
  completeImage: { width: '100%', height: '100%', objectFit: 'cover' },
  completeOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(13,13,13,0.95) 100%)', display: 'flex', flexDirection: 'column' as const, justifyContent: 'flex-end', padding: 32 },
  completeTitle: { color: COLORS.sacredGold, fontSize: 28, marginBottom: 16 },
  completeSummary: { display: 'flex', flexDirection: 'column' as const, gap: 8, color: COLORS.softSand, fontSize: 14 },
  
  // Navigation
  navigation: { position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '20px 40px', background: 'linear-gradient(180deg, transparent 0%, rgba(13,13,13,0.95) 50%)', zIndex: 100 },
  backBtn: { padding: '12px 24px', background: 'transparent', border: `1px solid ${COLORS.ancientStone}`, borderRadius: 8, color: COLORS.softSand, fontSize: 14, cursor: 'pointer' },
  nextBtn: { padding: '14px 32px', border: 'none', borderRadius: 8, color: COLORS.deepBlack, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' },
};

export default OnboardingWizard;
