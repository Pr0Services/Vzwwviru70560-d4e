/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — EDUCATIONAL ONBOARDING WIZARD
 * Governed Intelligence Operating System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * PHILOSOPHY: Teach BEFORE asking
 * 
 * L'utilisateur doit comprendre la VALEUR de CHE·NU avant de donner ses informations.
 * 
 * PHASE 1 - DÉCOUVERTE (Éducation):
 *   1. Welcome - Le chaos numérique actuel
 *   2. Vision - CHE·NU comme solution
 *   3. 3 Hubs - Navigation / Bureau / Workspace
 *   4. 8 Sphères - Tour immersif interactif
 *   5. Bureau - Les 6 sections unifiées
 *   6. Nova - L'IA gouvernée
 *   7. Gouvernance - Tokens & contrôle
 * 
 * PHASE 2 - PERSONNALISATION (Après compréhension):
 *   8. Thème - Choix visuel
 *   9. Sphères - Activation
 *   10. Profil - Questions contextuelles
 *   11. Complete - Bienvenue!
 * 
 * @version 4.0.0 - Educational First
 */

import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type OnboardingStep = 
  // Phase 1: Discovery (Education)
  | 'welcome'
  | 'problem'
  | 'solution'
  | 'hubs'
  | 'spheres-tour'
  | 'bureau'
  | 'nova-intro'
  | 'governance'
  // Phase 2: Personalization
  | 'theme'
  | 'activate-spheres'
  | 'profile'
  | 'complete';

interface UserProfile {
  selectedTheme: string;
  profileStyle: string;
  activeSpheres: string[];
  primarySphere: string;
  sphereProfiles: Record<string, Record<string, any>>;
  language: 'en' | 'fr';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS (OFFICIAL CHE·NU UI - From CHENU_MASTER_REFERENCE)
// ═══════════════════════════════════════════════════════════════════════════════

// SPHERE COLORS - OFFICIAL (9 SPHERES - V52 FROZEN)
const SPHERE_COLORS = {
  personnel:       '#3EB4A2',  // Cenote Turquoise (Personal)
  entreprises:     '#D8B26A',  // Sacred Gold (Business)
  gouvernement:    '#8D8371',  // Ancient Stone (Government)
  creative_studio: '#3F7249',  // Jungle Emerald (Studio)
  community:       '#2F4C39',  // Shadow Moss (Community)
  social_media:    '#7A593A',  // Earth Ember (Social)
  entertainment:   '#E74C3C',  // Entertainment Red
  my_team:         '#3EB4A2',  // Cenote Turquoise (Team)
  scholar:         '#6B5B95',  // Scholar Purple (NEW - V52)
};

// HUB COLORS - OFFICIAL
const HUB_COLORS = {
  communication: '#6366F1',  // Indigo (Nova)
  navigation:    '#10B981',  // Emerald
  workspace:     '#F59E0B',  // Amber
};

// STATUS COLORS - OFFICIAL
const STATUS_COLORS = {
  success: '#27AE60',
  warning: '#F39C12',
  danger:  '#E74C3C',
  info:    '#3498DB',
  neutral: '#95A5A6',
};

// MODE COLORS - OFFICIAL (Dark Mode)
const COLORS = {
  background:   '#1A1A2E',
  backgroundAlt:'#252538',
  text:         '#E8E8E8',
  textMuted:    '#95A5A6',
  accent:       '#6366F1',
  border:       '#3D3D5C',
  nova:         '#6366F1',
  novaGlow:     '#6366F140',
  success:      '#27AE60',
  warning:      '#F39C12',
  danger:       '#E74C3C',
};

// 9 SPHERES OFFICIELLES (FROZEN - NON-NEGOTIABLE)
const SPHERES = [
  { id: 'personnel', name: 'Personnel', emoji: '🏠', color: SPHERE_COLORS.personnel, symbol: '◇',
    description: 'Votre vie privée, santé, famille, finances personnelles, objectifs de vie.',
    examples: ['Rendez-vous médicaux', 'Budget familial', 'Objectifs fitness', 'Journal personnel'] },
  { id: 'entreprises', name: 'Entreprises', emoji: '💼', color: SPHERE_COLORS.entreprises, symbol: '⬡',
    description: 'Multi-entreprise, multi-identité, domaines, départements, toutes APIs métier.',
    examples: ['Gestion de clients', 'Projets en cours', 'Facturation', 'Réunions d\'équipe'] },
  { id: 'gouvernement', name: 'Gouvernement', emoji: '🏛️', color: SPHERE_COLORS.gouvernement, symbol: '⏣',
    description: 'Administration publique, démarches, conformité réglementaire.',
    examples: ['Déclaration d\'impôts', 'Renouvellement de passeport', 'Permis', 'Assurances'] },
  { id: 'creative_studio', name: 'Studio Créatif', emoji: '🎨', color: SPHERE_COLORS.creative_studio, symbol: '✦',
    description: 'Expression artistique, design, médias, branding, portfolio.',
    examples: ['Projets design', 'Portfolio', 'Mood boards', 'Commandes créatives'] },
  { id: 'entertainment', name: 'Divertissement', emoji: '🎬', color: SPHERE_COLORS.entertainment, symbol: '▷',
    description: 'Loisirs, jeux, voyages, streaming, hobbies (non-addictif).',
    examples: ['Watchlist', 'Playlists', 'Jeux en cours', 'Événements culturels'] },
  { id: 'community', name: 'Communauté', emoji: '👥', color: SPHERE_COLORS.community, symbol: '◉',
    description: 'Relations EN PERSONNE, networking local, associations, voisinage.',
    examples: ['Associations', 'Événements communautaires', 'Bénévolat', 'Collectifs'] },
  { id: 'social_media', name: 'Social & Média', emoji: '📱', color: SPHERE_COLORS.social_media, symbol: '⊛',
    description: 'Réseaux sociaux EN LIGNE, présence média numérique.',
    examples: ['Posts planifiés', 'Analytics', 'Audience', 'Collaborations'] },
  { id: 'my_team', name: 'Mon Équipe', emoji: '🤝', color: SPHERE_COLORS.my_team, symbol: '⎔',
    description: 'Gestion d\'équipe, RH, agents IA, IA Labs, Skills & Tools.',
    examples: ['Agents actifs', 'Budget tokens', 'Automatisations', 'IA Labs'] },
  { id: 'scholar', name: 'Savoirs', emoji: '📚', color: SPHERE_COLORS.scholar, symbol: '✧',
    description: 'Recherche, apprentissage, ressources académiques, base de connaissances.',
    examples: ['Projets de recherche', 'Cours en ligne', 'Publications', 'Notes académiques'] },
];

// 3 HUBS OFFICIELS
const HUBS = [
  { 
    id: 'navigation',
    name: 'Navigation Hub',
    icon: '🧭',
    color: HUB_COLORS.navigation,
    description: 'Le centre de contrôle. Visualisez vos 9 sphères, passez de l\'une à l\'autre, voyez l\'état global de votre vie.',
    features: ['Vue carte isométrique', 'Indicateurs par sphère', 'Accès rapide', 'Notifications centralisées'],
  },
  {
    id: 'bureau',
    name: 'Bureau',
    icon: '🏢',
    color: HUB_COLORS.communication,
    description: 'Chaque sphère ouvre un bureau IDENTIQUE avec 6 sections. Même structure, contexte différent.',
    features: ['6 sections fixes', 'Dashboard', 'Notes', 'Tasks', 'Projects', 'Threads', 'Meetings', 'Data', 'Agents', 'Reports', 'Budget'],
  },
  {
    id: 'workspace',
    name: 'Workspace',
    icon: '⚡',
    color: HUB_COLORS.workspace,
    description: 'L\'espace transversal où vous travaillez avec Nova et vos agents. Accessible depuis n\'importe quelle sphère.',
    features: ['Nova toujours présente', 'Multi-sphère', 'Threads actifs', 'Exécution gouvernée'],
  },
];

const BUREAU_SECTIONS = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊', desc: 'Vue d\'ensemble et métriques clés' },
  { id: 'notes', name: 'Notes', icon: '📝', desc: 'Vos notes et idées' },
  { id: 'tasks', name: 'Tasks', icon: '✅', desc: 'Tâches à accomplir' },
  { id: 'projects', name: 'Projects', icon: '📁', desc: 'Projets en cours' },
  { id: 'threads', name: 'Threads', icon: '💬', desc: 'Fils de conversation .chenu' },
  { id: 'meetings', name: 'Meetings', icon: '📅', desc: 'Réunions et rendez-vous' },
  { id: 'data', name: 'Data', icon: '🗄️', desc: 'Base de données contextuelle' },
  { id: 'agents', name: 'Agents', icon: '🤖', desc: 'Agents IA assignés' },
  { id: 'reports', name: 'Reports', icon: '📈', desc: 'Historique et rapports' },
  { id: 'budget', name: 'Budget', icon: '💰', desc: 'Gouvernance et tokens' },
];

// THEMES avec couleurs officielles
const THEMES = [
  { id: 'sacred-temple', name: 'Temple Sacré', emoji: '🏛️', image: '/assets/maps/map-isometric-0.png', color: SPHERE_COLORS.gouvernement },
  { id: 'cyber-nexus', name: 'Nexus Cyber', emoji: '🌐', image: '/assets/maps/map-aerial-1.png', color: SPHERE_COLORS.entreprises },
  { id: 'nature-sanctuary', name: 'Sanctuaire Naturel', emoji: '🌳', image: '/assets/maps/map-isometric-1.png', color: SPHERE_COLORS.community },
  { id: 'atlantean-citadel', name: 'Citadelle Atlante', emoji: '🔮', image: '/assets/maps/map-isometric-2.png', color: SPHERE_COLORS.personnel },
  { id: 'cosmic-observatory', name: 'Observatoire Cosmique', emoji: '✨', image: '/assets/maps/map-aerial-3.png', color: SPHERE_COLORS.entertainment },
];

// Nova messages for each step
const NOVA_MESSAGES: Record<OnboardingStep, { title: string; message: string }> = {
  welcome: {
    title: 'Bienvenue',
    message: 'Je suis Nova, votre guide de gouvernance. Avant de personnaliser votre espace, laissez-moi vous montrer pourquoi CHE·NU va transformer votre façon de gérer votre vie.',
  },
  problem: {
    title: 'Le Problème',
    message: 'Aujourd\'hui, votre vie numérique est fragmentée. Emails ici, tâches là, documents ailleurs... Vous passez plus de temps à chercher qu\'à agir. CHE·NU résout ce chaos.',
  },
  solution: {
    title: 'La Solution',
    message: 'CHE·NU n\'est pas une app de plus. C\'est un SYSTÈME D\'EXPLOITATION pour votre vie. Il organise TOUT en 8 contextes clairs appelés Sphères, chacun avec la même structure.',
  },
  hubs: {
    title: 'Les 3 Hubs',
    message: 'CHE·NU fonctionne avec 3 espaces principaux: le Hub de Navigation pour voir l\'ensemble, le Bureau pour travailler dans une sphère, et le Workspace pour l\'exécution avec l\'IA.',
  },
  'spheres-tour': {
    title: 'Les 8 Sphères',
    message: 'Chaque sphère représente un CONTEXTE de votre vie. Pas un dossier, pas une catégorie - un contexte complet avec ses propres agents, données et gouvernance.',
  },
  bureau: {
    title: 'Le Bureau Unifié',
    message: 'Voici la magie: chaque sphère ouvre le MÊME bureau avec 6 sections identiques. Notes, Tasks, Projects, Meetings... Vous n\'apprenez qu\'une fois, vous maîtrisez tout.',
  },
  'nova-intro': {
    title: 'Nova & Vos Agents',
    message: 'Je suis toujours là pour vous guider. Mais vous pouvez aussi engager des agents spécialisés - comptable, designer, assistant... Chacun avec son propre budget et ses limites.',
  },
  governance: {
    title: 'Gouvernance & Tokens',
    message: 'CHE·NU vous donne le CONTRÔLE. Chaque action IA a un coût en tokens. Vous définissez les budgets, les limites, les permissions. Transparence totale, zéro surprise.',
  },
  theme: {
    title: 'Votre Univers',
    message: 'Maintenant que vous comprenez CHE·NU, personnalisons-le! Choisissez l\'univers visuel qui vous inspire. Chaque thème a son ambiance unique.',
  },
  'activate-spheres': {
    title: 'Vos Sphères',
    message: 'Quelles sphères voulez-vous activer? Commencez par celles qui sont prioritaires pour vous. Vous pourrez toujours en ajouter plus tard.',
  },
  profile: {
    title: 'Votre Profil',
    message: 'Dernière étape! Ces informations m\'aideront à personnaliser votre expérience. Plus je vous connais, mieux je peux vous assister.',
  },
  complete: {
    title: 'Bienvenue!',
    message: 'Votre CHE·NU est prêt. Vous avez maintenant un système gouverné, personnalisé et intelligent pour gérer votre vie. Je serai toujours là pour vous guider.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Nova Assistant with typing effect
const Nova: React.FC<{ 
  title: string; 
  message: string; 
  showAvatar?: boolean;
}> = ({ title, message, showAvatar = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const timer = setInterval(() => {
      if (i < message.length) {
        setDisplayedText(message.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 15);
    return () => clearInterval(timer);
  }, [message]);

  return (
    <div style={styles.novaContainer}>
      {showAvatar && (
        <div style={styles.novaAvatar}>
          <div style={styles.novaGlow} />
          <div style={styles.novaCore}>✨</div>
        </div>
      )}
      <div style={styles.novaBubble}>
        <div style={styles.novaHeader}>
          <span style={styles.novaLabel}>NOVA</span>
          <span style={styles.novaTitle}>{title}</span>
        </div>
        <p style={styles.novaText}>
          {displayedText}
          {isTyping && <span style={styles.cursor}>▋</span>}
        </p>
      </div>
    </div>
  );
};

// Progress indicator
const Progress: React.FC<{ step: OnboardingStep }> = ({ step }) => {
  const allSteps: OnboardingStep[] = [
    'welcome', 'problem', 'solution', 'hubs', 'spheres-tour', 'bureau', 'nova-intro', 'governance',
    'theme', 'activate-spheres', 'profile', 'complete'
  ];
  const currentIndex = allSteps.indexOf(step);
  const phase1End = 7; // governance is last of phase 1
  
  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressPhase}>
        <span style={{
          ...styles.phaseLabel,
          color: currentIndex <= phase1End ? COLORS.nova : COLORS.textMuted,
        }}>
          Phase 1: Découverte
        </span>
        <div style={styles.progressDots}>
          {allSteps.slice(0, 8).map((s, i) => (
            <div
              key={s}
              style={{
                ...styles.progressDot,
                background: i <= currentIndex ? COLORS.nova : COLORS.border,
                transform: i === currentIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
      <div style={styles.progressDivider}>→</div>
      <div style={styles.progressPhase}>
        <span style={{
          ...styles.phaseLabel,
          color: currentIndex > phase1End ? SPHERE_COLORS.personnel : COLORS.textMuted,
        }}>
          Phase 2: Personnalisation
        </span>
        <div style={styles.progressDots}>
          {allSteps.slice(8).map((s, i) => (
            <div
              key={s}
              style={{
                ...styles.progressDot,
                background: (i + 8) <= currentIndex ? SPHERE_COLORS.personnel : COLORS.border,
                transform: (i + 8) === currentIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Animated card for problems
const ProblemCard: React.FC<{ icon: string; title: string; desc: string; delay: number }> = ({ 
  icon, title, desc, delay 
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div style={{
      ...styles.problemCard,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
    }}>
      <span style={styles.problemIcon}>{icon}</span>
      <div>
        <div style={styles.problemTitle}>{title}</div>
        <div style={styles.problemDesc}>{desc}</div>
      </div>
    </div>
  );
};

// Hub card
const HubCard: React.FC<{ hub: typeof HUBS[0]; active: boolean; onClick: () => void }> = ({ 
  hub, active, onClick 
}) => (
  <div
    style={{
      ...styles.hubCard,
      borderColor: active ? hub.color : 'transparent',
      background: active ? `${hub.color}15` : 'rgba(30,31,34,0.8)',
    }}
    onClick={onClick}
  >
    <div style={{ ...styles.hubIcon, background: hub.color }}>{hub.icon}</div>
    <div style={styles.hubContent}>
      <div style={{ ...styles.hubName, color: active ? hub.color : COLORS.softSand }}>{hub.name}</div>
      <p style={styles.hubDesc}>{hub.description}</p>
      {active && (
        <div style={styles.hubFeatures}>
          {hub.features.map((f, i) => (
            <span key={i} style={{ ...styles.hubFeature, borderColor: hub.color }}>✓ {f}</span>
          ))}
        </div>
      )}
    </div>
  </div>
);

// Sphere tour card
const SphereTourCard: React.FC<{ 
  sphere: typeof SPHERES[0]; 
  active: boolean; 
  onClick: () => void;
}> = ({ sphere, active, onClick }) => (
  <div
    style={{
      ...styles.sphereTourCard,
      borderColor: active ? sphere.color : 'transparent',
      background: active ? `${sphere.color}10` : 'rgba(30,31,34,0.6)',
      transform: active ? 'scale(1.02)' : 'scale(1)',
    }}
    onClick={onClick}
  >
    <div style={styles.sphereTourHeader}>
      <span style={styles.sphereTourEmoji}>{sphere.emoji}</span>
      <span style={styles.sphereTourSymbol}>{sphere.symbol}</span>
    </div>
    <div style={{ ...styles.sphereTourName, color: active ? sphere.color : COLORS.softSand }}>
      {sphere.name}
    </div>
    {active && (
      <>
        <p style={styles.sphereTourDesc}>{sphere.description}</p>
        <div style={styles.sphereTourExamples}>
          {sphere.examples.map((ex, i) => (
            <span key={i} style={{ ...styles.sphereTourExample, background: `${sphere.color}20`, color: sphere.color }}>
              {ex}
            </span>
          ))}
        </div>
      </>
    )}
  </div>
);

// Bureau section card
const BureauSection: React.FC<{ section: typeof BUREAU_SECTIONS[0]; index: number }> = ({ 
  section, index 
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div style={{
      ...styles.bureauSection,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-20px)',
    }}>
      <span style={styles.bureauIcon}>{section.icon}</span>
      <div>
        <div style={styles.bureauName}>{section.name}</div>
        <div style={styles.bureauDesc}>{section.desc}</div>
      </div>
    </div>
  );
};

// Theme selection card
const ThemeCard: React.FC<{
  theme: typeof THEMES[0];
  selected: boolean;
  onClick: () => void;
}> = ({ theme, selected, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        ...styles.themeCard,
        borderColor: selected ? theme.color : 'transparent',
        boxShadow: selected ? `0 0 30px ${theme.color}40` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
      onClick={onClick}
    >
      <div style={styles.themeImageWrap}>
        {!loaded && <div style={styles.themePlaceholder}>{theme.emoji}</div>}
        <img
          src={theme.image}
          alt={theme.name}
          style={{ ...styles.themeImage, opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
        />
        <div style={styles.themeGradient} />
        {selected && <div style={{ ...styles.selectedBadge, background: theme.color }}>✓</div>}
      </div>
      <div style={styles.themeInfo}>
        <span style={styles.themeEmoji}>{theme.emoji}</span>
        <span style={{ ...styles.themeName, color: selected ? theme.color : COLORS.softSand }}>
          {theme.name}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WIZARD
// ═══════════════════════════════════════════════════════════════════════════════

export const EducationalOnboardingWizard: React.FC<{
  onComplete: (profile: UserProfile) => void;
}> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [activeHub, setActiveHub] = useState(0);
  const [activeSphere, setActiveSphere] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    selectedTheme: '',
    profileStyle: 'balanced',
    activeSpheres: ['personal'],
    primarySphere: 'personal',
    sphereProfiles: {},
    language: 'fr',
  });

  const selectedTheme = THEMES.find(t => t.id === profile.selectedTheme);
  const accentColor = selectedTheme?.color || COLORS.sacredGold;

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const steps: OnboardingStep[] = [
      'welcome', 'problem', 'solution', 'hubs', 'spheres-tour', 'bureau', 'nova-intro', 'governance',
      'theme', 'activate-spheres', 'profile', 'complete'
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    } else {
      onComplete(profile);
    }
  };

  const prevStep = () => {
    const steps: OnboardingStep[] = [
      'welcome', 'problem', 'solution', 'hubs', 'spheres-tour', 'bureau', 'nova-intro', 'governance',
      'theme', 'activate-spheres', 'profile', 'complete'
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const toggleSphere = (id: string) => {
    const active = profile.activeSpheres.includes(id);
    if (active && profile.activeSpheres.length === 1) return;
    updateProfile({
      activeSpheres: active
        ? profile.activeSpheres.filter(s => s !== id)
        : [...profile.activeSpheres, id],
    });
  };

  const canProceed = () => {
    if (step === 'theme') return !!profile.selectedTheme;
    if (step === 'activate-spheres') return profile.activeSpheres.length > 0;
    return true;
  };

  const novaContent = NOVA_MESSAGES[step];

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background}>
        {selectedTheme && <img src={selectedTheme.image} alt="" style={styles.bgImage} />}
        <div style={styles.bgOverlay} />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>CHE·NU™</div>
        <Progress step={step} />
      </div>

      {/* Nova */}
      <Nova title={novaContent.title} message={novaContent.message} />

      {/* Content */}
      <div style={styles.content}>
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PHASE 1: DISCOVERY */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        {/* WELCOME */}
        {step === 'welcome' && (
          <div style={styles.centerContent}>
            <div style={styles.welcomeCard}>
              <div style={styles.welcomeLogo}>CHE·NU™</div>
              <div style={styles.welcomeTagline}>Governed Intelligence Operating System</div>
              <div style={styles.welcomeDivider} />
              <p style={styles.welcomeText}>
                Découvrez comment CHE·NU transforme le chaos numérique en clarté gouvernée.
              </p>
              <div style={styles.welcomeStats}>
                <div style={styles.welcomeStat}>
                  <span style={styles.statNumber}>8</span>
                  <span style={styles.statLabel}>Sphères de vie</span>
                </div>
                <div style={styles.welcomeStat}>
                  <span style={styles.statNumber}>10</span>
                  <span style={styles.statLabel}>Sections par bureau</span>
                </div>
                <div style={styles.welcomeStat}>
                  <span style={styles.statNumber}>226</span>
                  <span style={styles.statLabel}>Agents IA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROBLEM */}
        {step === 'problem' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>😵 Le Chaos Numérique Actuel</h2>
            <div style={styles.problemGrid}>
              <ProblemCard icon="📧" title="Emails éparpillés" desc="Gmail, Outlook, iCloud... Rien n'est centralisé" delay={0} />
              <ProblemCard icon="📋" title="Tâches dispersées" desc="Trello, Notion, Asana, Notes... Vous oubliez des choses" delay={200} />
              <ProblemCard icon="📁" title="Documents perdus" desc="Google Drive, Dropbox, Desktop... Où est ce fichier?" delay={400} />
              <ProblemCard icon="🤖" title="IA non gouvernée" desc="ChatGPT, Claude, Gemini... Sans contexte ni limites" delay={600} />
              <ProblemCard icon="💸" title="Coûts invisibles" desc="Abonnements multiples, tokens gaspillés" delay={800} />
              <ProblemCard icon="🧠" title="Surcharge cognitive" desc="Trop d'apps, trop d'onglets, trop de contextes" delay={1000} />
            </div>
            <div style={styles.problemConclusion}>
              <span style={{ color: COLORS.danger }}>✗</span> Résultat: Vous passez <strong>70% de votre temps</strong> à chercher et organiser au lieu d'agir.
            </div>
          </div>
        )}

        {/* SOLUTION */}
        {step === 'solution' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>✨ CHE·NU: La Solution</h2>
            <div style={styles.solutionContainer}>
              <div style={styles.solutionCard}>
                <div style={styles.solutionIcon}>🌐</div>
                <h3 style={styles.solutionTitle}>UN système pour TOUT</h3>
                <p style={styles.solutionDesc}>
                  Plus besoin de jongler entre 20 applications. CHE·NU centralise votre vie entière 
                  dans un seul environnement gouverné.
                </p>
              </div>
              <div style={styles.solutionCard}>
                <div style={styles.solutionIcon}>◇⬡⏣✦◉⊛▷⎔</div>
                <h3 style={styles.solutionTitle}>8 Contextes, 1 Structure</h3>
                <p style={styles.solutionDesc}>
                  Votre vie est organisée en 9 sphères distinctes. Chacune avec le même bureau, 
                  les mêmes outils, mais un contexte différent.
                </p>
              </div>
              <div style={styles.solutionCard}>
                <div style={styles.solutionIcon}>🔐</div>
                <h3 style={styles.solutionTitle}>Gouvernance Totale</h3>
                <p style={styles.solutionDesc}>
                  Chaque action IA est tracée et budgétée. Vous définissez les limites. 
                  Transparence totale, contrôle absolu.
                </p>
              </div>
            </div>
            <div style={styles.solutionConclusion}>
              <span style={{ color: COLORS.success }}>✓</span> CHE·NU: <strong>Clarté sur Features</strong> — Un système d'opération pour votre vie.
            </div>
          </div>
        )}

        {/* HUBS */}
        {step === 'hubs' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🏗️ Les 3 Hubs de CHE·NU</h2>
            <p style={styles.sectionSubtitle}>Cliquez sur chaque hub pour en savoir plus</p>
            <div style={styles.hubsGrid}>
              {HUBS.map((hub, i) => (
                <HubCard
                  key={hub.id}
                  hub={hub}
                  active={activeHub === i}
                  onClick={() => setActiveHub(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* SPHERES TOUR */}
        {step === 'spheres-tour' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🌐 Les 8 Sphères de Vie</h2>
            <p style={styles.sectionSubtitle}>Cliquez sur chaque sphère pour découvrir son contexte</p>
            <div style={styles.spheresTourGrid}>
              {SPHERES.map((sphere, i) => (
                <SphereTourCard
                  key={sphere.id}
                  sphere={sphere}
                  active={activeSphere === i}
                  onClick={() => setActiveSphere(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* BUREAU */}
        {step === 'bureau' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🏢 Le Bureau Unifié</h2>
            <p style={styles.sectionSubtitle}>
              Chaque sphère ouvre le MÊME bureau avec ces 6 sections
            </p>
            <div style={styles.bureauDemo}>
              <div style={styles.bureauHeader}>
                <span style={styles.bureauSphereEmoji}>{SPHERES[activeSphere].emoji}</span>
                <span style={styles.bureauSphereName}>{SPHERES[activeSphere].name}</span>
              </div>
              <div style={styles.bureauSections}>
                {BUREAU_SECTIONS.map((section, i) => (
                  <BureauSection key={section.id} section={section} index={i} />
                ))}
              </div>
            </div>
            <div style={styles.bureauNote}>
              💡 Même structure pour les 9 sphères. Apprenez une fois, maîtrisez tout!
            </div>
          </div>
        )}

        {/* NOVA INTRO */}
        {step === 'nova-intro' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🤖 Nova & Vos Agents</h2>
            <div style={styles.novaIntroGrid}>
              <div style={styles.novaIntroCard}>
                <div style={styles.novaIntroAvatar}>✨</div>
                <h3 style={styles.novaIntroTitle}>NOVA</h3>
                <p style={styles.novaIntroRole}>Système Intelligence</p>
                <ul style={styles.novaIntroList}>
                  <li>Toujours présente</li>
                  <li>Guide et conseille</li>
                  <li>Gère la mémoire globale</li>
                  <li>Supervise la gouvernance</li>
                </ul>
                <div style={styles.novaIntroBadge}>GRATUIT</div>
              </div>
              <div style={styles.novaIntroCard}>
                <div style={{ ...styles.novaIntroAvatar, background: COLORS.cenoteTurquoise }}>👤</div>
                <h3 style={styles.novaIntroTitle}>ORCHESTRATOR</h3>
                <p style={styles.novaIntroRole}>Votre Agent Personnel</p>
                <ul style={styles.novaIntroList}>
                  <li>Exécute vos tâches</li>
                  <li>Gère vos agents</li>
                  <li>Respecte votre budget</li>
                  <li>Personnalisable</li>
                </ul>
                <div style={{ ...styles.novaIntroBadge, background: COLORS.cenoteTurquoise }}>TOKENS</div>
              </div>
              <div style={styles.novaIntroCard}>
                <div style={{ ...styles.novaIntroAvatar, background: COLORS.jungleEmerald }}>🤖</div>
                <h3 style={styles.novaIntroTitle}>AGENTS SPÉCIALISÉS</h3>
                <p style={styles.novaIntroRole}>Experts par Domaine</p>
                <ul style={styles.novaIntroList}>
                  <li>Comptable, Designer, etc.</li>
                  <li>Engagés à la demande</li>
                  <li>Budget défini par vous</li>
                  <li>226 agents disponibles</li>
                </ul>
                <div style={{ ...styles.novaIntroBadge, background: COLORS.jungleEmerald }}>TOKENS</div>
              </div>
            </div>
          </div>
        )}

        {/* GOVERNANCE */}
        {step === 'governance' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🔐 Gouvernance & Tokens</h2>
            <div style={styles.governanceContainer}>
              <div style={styles.governanceCard}>
                <div style={styles.governanceIcon}>💰</div>
                <h3>Tokens = Énergie IA</h3>
                <p>Chaque action IA a un coût visible. Pas de crypto, juste de la transparence.</p>
              </div>
              <div style={styles.governanceCard}>
                <div style={styles.governanceIcon}>📊</div>
                <h3>Budget par Sphère</h3>
                <p>Définissez combien chaque sphère peut dépenser. Contrôle total.</p>
              </div>
              <div style={styles.governanceCard}>
                <div style={styles.governanceIcon}>🚫</div>
                <h3>Limites & Permissions</h3>
                <p>Les agents ne peuvent agir que dans leur scope. Aucune surprise.</p>
              </div>
              <div style={styles.governanceCard}>
                <div style={styles.governanceIcon}>📜</div>
                <h3>Audit & Historique</h3>
                <p>Chaque décision est tracée. Vous savez exactement ce qui s'est passé.</p>
              </div>
            </div>
            <div style={styles.governanceNote}>
              🛡️ <strong>Gouvernance = Empowerment</strong>, pas restriction. Vous êtes en contrôle.
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PHASE 2: PERSONALIZATION */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        {/* THEME */}
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

        {/* ACTIVATE SPHERES */}
        {step === 'activate-spheres' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🌐 Activez vos Sphères</h2>
            <p style={styles.sectionSubtitle}>Sélectionnez les sphères à activer maintenant (minimum 1)</p>
            <div style={styles.activateGrid}>
              {SPHERES.map((sphere) => {
                const isActive = profile.activeSpheres.includes(sphere.id);
                return (
                  <div
                    key={sphere.id}
                    style={{
                      ...styles.activateCard,
                      borderColor: isActive ? sphere.color : 'transparent',
                      background: isActive ? `${sphere.color}15` : 'rgba(30,31,34,0.6)',
                    }}
                    onClick={() => toggleSphere(sphere.id)}
                  >
                    <span style={styles.activateEmoji}>{sphere.emoji}</span>
                    <span style={{ ...styles.activateName, color: isActive ? sphere.color : COLORS.softSand }}>
                      {sphere.name}
                    </span>
                    {isActive && <span style={{ ...styles.activateCheck, color: sphere.color }}>✓</span>}
                  </div>
                );
              })}
            </div>
            <div style={styles.activateNote}>
              ✨ Sphères actives: <strong>{profile.activeSpheres.length}</strong> — Vous pourrez en ajouter plus tard
            </div>
          </div>
        )}

        {/* PROFILE */}
        {step === 'profile' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>👤 Configuration Rapide</h2>
            <p style={styles.sectionSubtitle}>Ces informations aideront Nova à mieux vous assister</p>
            <div style={styles.profileForm}>
              <div style={styles.profileNote}>
                🚀 <strong>Vous pouvez sauter cette étape!</strong> Configurez votre profil plus tard depuis chaque sphère.
              </div>
            </div>
          </div>
        )}

        {/* COMPLETE */}
        {step === 'complete' && selectedTheme && (
          <div style={styles.centerContent}>
            <div style={styles.completeCard}>
              <img src={selectedTheme.image} alt="" style={styles.completeImage} />
              <div style={styles.completeOverlay}>
                <div style={styles.completeEmoji}>🎉</div>
                <h2 style={styles.completeTitle}>Bienvenue dans CHE·NU!</h2>
                <div style={styles.completeSummary}>
                  <div>
                    <strong>Thème:</strong> {selectedTheme.emoji} {selectedTheme.name}
                  </div>
                  <div>
                    <strong>Sphères actives:</strong> {profile.activeSpheres.length} / 8
                  </div>
                </div>
                <p style={styles.completeText}>
                  Votre système d'opération de vie est prêt. Nova vous attend.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        {step !== 'welcome' && (
          <button style={styles.backBtn} onClick={prevStep}>
            ← Retour
          </button>
        )}
        <button
          style={{
            ...styles.nextBtn,
            background: accentColor,
            opacity: canProceed() ? 1 : 0.5,
          }}
          onClick={nextStep}
          disabled={!canProceed()}
        >
          {step === 'complete' ? 'Entrer dans CHE·NU →' : 
           step === 'governance' ? 'Personnaliser →' : 'Continuer →'}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES (Using Official Dark Mode Colors)
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', background: COLORS.background, position: 'relative' },
  background: { position: 'absolute', inset: 0, zIndex: 0 },
  bgImage: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1, filter: 'blur(30px)' },
  bgOverlay: { position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${COLORS.background}F2 0%, ${COLORS.background}CC 50%, ${COLORS.background}F2 100%)` },

  header: { position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px' },
  logo: { fontSize: 20, fontWeight: 700, color: COLORS.nova, letterSpacing: 2 },

  progressContainer: { display: 'flex', alignItems: 'center', gap: 16 },
  progressPhase: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  phaseLabel: { fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' },
  progressDots: { display: 'flex', gap: 4 },
  progressDot: { width: 8, height: 8, borderRadius: '50%', transition: 'all 0.3s' },
  progressDivider: { color: COLORS.textMuted, fontSize: 12 },

  novaContainer: { position: 'relative', zIndex: 10, display: 'flex', alignItems: 'flex-start', gap: 12, padding: '0 32px', marginBottom: 20 },
  novaAvatar: { position: 'relative', width: 44, height: 44, flexShrink: 0 },
  novaGlow: { position: 'absolute', inset: -3, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.novaGlow} 0%, transparent 70%)` },
  novaCore: { width: '100%', height: '100%', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.nova} 0%, ${HUB_COLORS.workspace} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  novaBubble: { flex: 1, maxWidth: 700, background: COLORS.backgroundAlt, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '10px 14px' },
  novaHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 },
  novaLabel: { fontSize: 8, fontWeight: 700, color: COLORS.nova, letterSpacing: 2 },
  novaTitle: { fontSize: 12, fontWeight: 600, color: COLORS.text },
  novaText: { fontSize: 13, lineHeight: 1.5, color: COLORS.text, margin: 0 },
  cursor: { color: COLORS.nova },

  content: { position: 'relative', zIndex: 10, padding: '0 32px 100px', maxWidth: 1100, margin: '0 auto' },
  centerContent: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 },
  section: {},
  sectionTitle: { fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 6, textAlign: 'center' },
  sectionSubtitle: { fontSize: 13, color: COLORS.textMuted, marginBottom: 24, textAlign: 'center' },

  // Welcome
  welcomeCard: { background: COLORS.backgroundAlt, borderRadius: 20, padding: '40px 50px', textAlign: 'center', border: `1px solid ${COLORS.border}`, maxWidth: 500 },
  welcomeLogo: { fontSize: 36, fontWeight: 700, color: COLORS.nova, letterSpacing: 4, marginBottom: 4 },
  welcomeTagline: { fontSize: 12, color: COLORS.textMuted, letterSpacing: 2, marginBottom: 24 },
  welcomeDivider: { width: 60, height: 2, background: COLORS.nova, margin: '0 auto 24px' },
  welcomeText: { fontSize: 14, color: COLORS.text, lineHeight: 1.6, marginBottom: 32 },
  welcomeStats: { display: 'flex', justifyContent: 'center', gap: 32 },
  welcomeStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 700, color: COLORS.nova },
  statLabel: { fontSize: 10, color: COLORS.textMuted },

  // Problem
  problemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 24 },
  problemCard: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, background: COLORS.backgroundAlt, borderRadius: 10, border: `1px solid ${STATUS_COLORS.danger}30`, transition: 'all 0.5s' },
  problemIcon: { fontSize: 24, flexShrink: 0 },
  problemTitle: { fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 },
  problemDesc: { fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4 },
  problemConclusion: { textAlign: 'center', fontSize: 14, color: COLORS.text, padding: 16, background: `${STATUS_COLORS.danger}15`, borderRadius: 10 },

  // Solution
  solutionContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 },
  solutionCard: { padding: 20, background: COLORS.backgroundAlt, borderRadius: 12, border: `1px solid ${STATUS_COLORS.success}30`, textAlign: 'center' },
  solutionIcon: { fontSize: 28, marginBottom: 12 },
  solutionTitle: { fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 8 },
  solutionDesc: { fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 },
  solutionConclusion: { textAlign: 'center', fontSize: 14, color: COLORS.text, padding: 16, background: `${STATUS_COLORS.success}15`, borderRadius: 10 },

  // Hubs
  hubsGrid: { display: 'flex', flexDirection: 'column', gap: 12 },
  hubCard: { display: 'flex', alignItems: 'flex-start', gap: 16, padding: 16, borderRadius: 12, border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.3s' },
  hubIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: COLORS.background, flexShrink: 0 },
  hubContent: { flex: 1 },
  hubName: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
  hubDesc: { fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5, margin: 0 },
  hubFeatures: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  hubFeature: { fontSize: 10, padding: '3px 8px', border: '1px solid', borderRadius: 12, color: COLORS.text },

  // Spheres Tour
  spheresTourGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 },
  sphereTourCard: { padding: 14, borderRadius: 12, border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center' },
  sphereTourHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sphereTourEmoji: { fontSize: 26 },
  sphereTourSymbol: { fontSize: 14, color: COLORS.textMuted },
  sphereTourName: { fontSize: 12, fontWeight: 600, marginBottom: 6 },
  sphereTourDesc: { fontSize: 10, color: COLORS.textMuted, lineHeight: 1.4, marginBottom: 8, textAlign: 'left' },
  sphereTourExamples: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  sphereTourExample: { fontSize: 9, padding: '2px 6px', borderRadius: 8 },

  // Bureau
  bureauDemo: { background: COLORS.backgroundAlt, borderRadius: 16, overflow: 'hidden', border: `1px solid ${COLORS.border}` },
  bureauHeader: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderBottom: `1px solid ${COLORS.border}` },
  bureauSphereEmoji: { fontSize: 20 },
  bureauSphereName: { fontSize: 14, fontWeight: 600, color: COLORS.text },
  bureauSections: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, padding: 1, background: 'rgba(0,0,0,0.2)' },
  bureauSection: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: COLORS.backgroundAlt, transition: 'all 0.3s' },
  bureauIcon: { fontSize: 18 },
  bureauName: { fontSize: 12, fontWeight: 600, color: COLORS.text },
  bureauDesc: { fontSize: 10, color: COLORS.textMuted },
  bureauNote: { textAlign: 'center', fontSize: 12, color: COLORS.nova, marginTop: 16, padding: 12, background: `${COLORS.nova}15`, borderRadius: 8 },

  // Nova Intro
  novaIntroGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  novaIntroCard: { padding: 20, background: COLORS.backgroundAlt, borderRadius: 14, textAlign: 'center', position: 'relative' },
  novaIntroAvatar: { width: 56, height: 56, borderRadius: '50%', background: COLORS.nova, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px', color: COLORS.background },
  novaIntroTitle: { fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 2 },
  novaIntroRole: { fontSize: 10, color: COLORS.textMuted, marginBottom: 12 },
  novaIntroList: { textAlign: 'left', fontSize: 11, color: COLORS.text, lineHeight: 1.8, paddingLeft: 16, margin: 0 },
  novaIntroBadge: { position: 'absolute', top: 12, right: 12, fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: COLORS.nova, color: COLORS.background },

  // Governance
  governanceContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 },
  governanceCard: { padding: 18, background: COLORS.backgroundAlt, borderRadius: 12, textAlign: 'center' },
  governanceIcon: { fontSize: 28, marginBottom: 10 },
  governanceNote: { textAlign: 'center', fontSize: 13, color: COLORS.text, marginTop: 20, padding: 14, background: `${SPHERE_COLORS.personnel}15`, borderRadius: 10 },

  // Themes
  themesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 },
  themeCard: { background: COLORS.backgroundAlt, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', border: '2px solid transparent' },
  themeImageWrap: { position: 'relative', height: 120, overflow: 'hidden' },
  themeImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s' },
  themePlaceholder: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.backgroundAlt, fontSize: 36 },
  themeGradient: { position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 0%, ${COLORS.background}CC 100%)` },
  selectedBadge: { position: 'absolute', top: 8, right: 8, padding: '4px 10px', borderRadius: 10, fontSize: 10, fontWeight: 600, color: COLORS.background },
  themeInfo: { padding: 10, display: 'flex', alignItems: 'center', gap: 8 },
  themeEmoji: { fontSize: 18 },
  themeName: { fontSize: 13, fontWeight: 600 },

  // Activate Spheres
  activateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 },
  activateCard: { padding: 16, borderRadius: 12, border: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', position: 'relative' },
  activateEmoji: { fontSize: 28, display: 'block', marginBottom: 6 },
  activateName: { fontSize: 12, fontWeight: 600 },
  activateCheck: { position: 'absolute', top: 8, right: 8, fontSize: 14 },
  activateNote: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginTop: 20 },

  // Profile
  profileForm: { maxWidth: 500, margin: '0 auto' },
  profileNote: { padding: 16, background: `${SPHERE_COLORS.personnel}15`, borderRadius: 10, textAlign: 'center', fontSize: 13, color: COLORS.text },

  // Complete
  completeCard: { position: 'relative', borderRadius: 16, overflow: 'hidden', width: '100%', maxWidth: 600 },
  completeImage: { width: '100%', height: 300, objectFit: 'cover' },
  completeOverlay: { position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 20%, ${COLORS.background}F2 100%)`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 28, textAlign: 'center' },
  completeEmoji: { fontSize: 48, marginBottom: 12 },
  completeTitle: { fontSize: 24, fontWeight: 700, color: COLORS.nova, marginBottom: 16 },
  completeSummary: { display: 'flex', justifyContent: 'center', gap: 24, color: COLORS.text, fontSize: 13, marginBottom: 16 },
  completeText: { fontSize: 13, color: COLORS.textMuted },

  // Navigation
  navigation: { position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '16px 32px', background: `linear-gradient(180deg, transparent 0%, ${COLORS.background}FA 50%)`, zIndex: 100 },
  backBtn: { padding: '10px 20px', background: 'transparent', border: `1px solid ${COLORS.textMuted}`, borderRadius: 8, color: COLORS.text, fontSize: 13, cursor: 'pointer' },
  nextBtn: { padding: '12px 28px', border: 'none', borderRadius: 8, color: COLORS.background, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' },
};

export default EducationalOnboardingWizard;
