import React, { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════
// CHE·NU™ ONBOARDING & SPHERE MANAGEMENT
// Nova Guided Setup with Dynamic Image System
// ═══════════════════════════════════════════════════════════════════

// Brand Colors
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

// Sphere Configuration
const SPHERES = [
  { id: 'personal', symbol: '◇', name: 'Personal', emoji: '🏠', color: '#6B8E9F' },
  { id: 'business', symbol: '⬡', name: 'Business', emoji: '💼', color: '#D8B26A' },
  { id: 'government', symbol: '⏣', name: 'Government', emoji: '🏛️', color: '#8B7355' },
  { id: 'creative', symbol: '✦', name: 'Creative', emoji: '🎨', color: '#9B6B9E' },
  { id: 'community', symbol: '◉', name: 'Community', emoji: '👥', color: '#3F7249' },
  { id: 'social', symbol: '⊛', name: 'Social', emoji: '📱', color: '#3EB4A2' },
  { id: 'entertainment', symbol: '▷', name: 'Entertainment', emoji: '🎬', color: '#C17B5D' },
  { id: 'team', symbol: '⎔', name: 'My Team', emoji: '🤝', color: '#5D7A8C' },
];

// Theme Configuration
const THEMES = [
  { id: 'natural', name: 'Natural', emoji: '🌿', description: 'Tons terreux, bois, végétation luxuriante' },
  { id: 'atlantis', name: 'Atlantis', emoji: '🏛️', description: 'Pierre dorée, colonnes, lumière sous-marine' },
  { id: 'futuristic', name: 'Futuristic', emoji: '🚀', description: 'Néons, hologrammes, architecture high-tech' },
  { id: 'astral', name: 'Astral', emoji: '✨', description: 'Étoiles, constellations, cosmos infini' },
];

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC IMAGE GALLERY COMPONENT
// ═══════════════════════════════════════════════════════════════════

const DynamicImageGallery = ({ 
  folderPath, 
  onSelect, 
  selectedIndex,
  title,
  emptyMessage = "Aucune image disponible"
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Simulate loading images from folder
  // In production, this would be an API call to scan the folder
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        // API call to get images from folder
        // const response = await fetch(`/api/images?folder=${folderPath}`);
        // const data = await response.json();
        // setImages(data.images);
        
        // For now, generate placeholder data
        // This simulates what the API would return
        const placeholderImages = Array.from({ length: 12 }, (_, i) => ({
          id: `img-${i}`,
          index: i,
          url: null, // Will show placeholder
          name: `Room ${i + 1}`,
          thumbnail: null,
        }));
        
        setImages(placeholderImages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadImages();
  }, [folderPath]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div style={styles.galleryLoading}>
        <div style={styles.loadingSpinner} />
        <span>Chargement des images...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.galleryError}>
        <span>⚠️ {error}</span>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div style={styles.galleryEmpty}>
        <div style={styles.emptyIcon}>📁</div>
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div style={styles.galleryContainer}>
      {title && <div style={styles.galleryTitle}>{title}</div>}
      
      <div style={styles.galleryWrapper}>
        <button style={styles.scrollButton} onClick={scrollLeft}>
          ‹
        </button>
        
        <div ref={scrollRef} style={styles.galleryScroll}>
          {images.map((image, index) => (
            <div
              key={image.id}
              style={{
                ...styles.galleryItem,
                ...(selectedIndex === index ? styles.galleryItemSelected : {}),
              }}
              onClick={() => onSelect && onSelect(index, image)}
            >
              {image.url ? (
                <img src={image.url} alt={image.name} style={styles.galleryImage} />
              ) : (
                <div style={styles.imagePlaceholder}>
                  <div style={styles.placeholderIcon}>🖼️</div>
                  <div style={styles.placeholderText}>{image.name}</div>
                </div>
              )}
              {selectedIndex === index && (
                <div style={styles.selectedBadge}>✓</div>
              )}
            </div>
          ))}
        </div>
        
        <button style={styles.scrollButton} onClick={scrollRight}>
          ›
        </button>
      </div>
      
      <div style={styles.galleryInfo}>
        {images.length} images disponibles • Scroll pour voir plus
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// IMAGE PLACEHOLDER COMPONENT
// ═══════════════════════════════════════════════════════════════════

const ImagePlaceholder = ({ 
  width = '100%', 
  height = 200, 
  label = 'Image',
  icon = '🖼️',
  style = {}
}) => (
  <div style={{
    ...styles.placeholder,
    width,
    height,
    ...style,
  }}>
    <div style={styles.placeholderContent}>
      <span style={styles.placeholderEmoji}>{icon}</span>
      <span style={styles.placeholderLabel}>{label}</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// NOVA ASSISTANT COMPONENT
// ═══════════════════════════════════════════════════════════════════

const NovaAssistant = ({ 
  message, 
  actions = [], 
  onAction,
  isTyping = false,
  variant = 'default' // 'default', 'compact', 'fullscreen'
}) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (message && !isTyping) {
      setIsAnimating(true);
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedMessage(message.slice(0, index));
        index++;
        if (index > message.length) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 20);
      return () => clearInterval(interval);
    } else {
      setDisplayedMessage(message);
    }
  }, [message, isTyping]);

  const containerStyle = variant === 'compact' 
    ? styles.novaCompact 
    : variant === 'fullscreen' 
      ? styles.novaFullscreen 
      : styles.novaContainer;

  return (
    <div style={containerStyle}>
      <div style={styles.novaHeader}>
        <div style={styles.novaAvatar}>
          <span style={styles.novaIcon}>🤖</span>
        </div>
        <div style={styles.novaName}>NOVA</div>
        <div style={styles.novaStatus}>
          {isAnimating ? '●●●' : '●'}
        </div>
      </div>
      
      <div style={styles.novaMessage}>
        {displayedMessage}
        {isAnimating && <span style={styles.novaCursor}>|</span>}
      </div>
      
      {actions.length > 0 && !isAnimating && (
        <div style={styles.novaActions}>
          {actions.map((action, index) => (
            <button
              key={index}
              style={{
                ...styles.novaButton,
                ...(action.primary ? styles.novaButtonPrimary : {}),
              }}
              onClick={() => onAction && onAction(action.value)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// ONBOARDING WIZARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [roomAssignments, setRoomAssignments] = useState({});
  const [currentSphereIndex, setCurrentSphereIndex] = useState(0);
  const [userProfile, setUserProfile] = useState({});

  const steps = [
    'welcome',
    'discovery',
    'theme',
    'rooms',
    'tutorial',
    'connections',
    'summary',
  ];

  const currentStep = steps[step];

  const novaMessages = {
    welcome: `Bonjour! 👋 Je suis Nova, l'intelligence système de CHE·NU.

Je vais vous guider dans la configuration de votre espace personnel. Ensemble, nous allons:

• Comprendre vos besoins
• Choisir votre univers visuel
• Structurer vos 8 sphères de vie
• Personnaliser chaque espace

Cela prendra environ 10-15 minutes. Prêt à commencer?`,

    discovery: `Pour mieux vous aider, j'aimerais comprendre votre situation.

Comment décririez-vous principalement votre activité?`,

    theme: `Excellent! Maintenant, choisissons l'ambiance visuelle de votre CHE·NU.

Chaque univers a sa personnalité. Vous pourrez toujours changer plus tard.`,

    rooms: `Parfait! Attribuons maintenant une pièce à chaque sphère.

Chaque sphère de votre vie mérite son propre espace. La pièce que vous choisissez définit l'atmosphère visuelle de cette sphère.`,

    tutorial: `Excellent choix! 🎉

Laissez-moi vous expliquer comment CHE·NU fonctionne...`,

    connections: `Voulez-vous connecter des plateformes externes?

Ceci est optionnel - vous pouvez toujours le faire plus tard.`,

    summary: `Votre CHE·NU est presque prêt! 

Voici un résumé de votre configuration. Vous pouvez modifier n'importe quel élément.`,
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete && onComplete({
        theme: selectedTheme,
        rooms: roomAssignments,
        profile: userProfile,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRoomSelect = (roomIndex) => {
    const currentSphere = SPHERES[currentSphereIndex];
    setRoomAssignments({
      ...roomAssignments,
      [currentSphere.id]: roomIndex,
    });
  };

  const handleNextSphere = () => {
    if (currentSphereIndex < SPHERES.length - 1) {
      setCurrentSphereIndex(currentSphereIndex + 1);
    } else {
      handleNext();
    }
  };

  const handlePrevSphere = () => {
    if (currentSphereIndex > 0) {
      setCurrentSphereIndex(currentSphereIndex - 1);
    }
  };

  return (
    <div style={styles.wizardContainer}>
      {/* Logo Header */}
      <div style={styles.wizardHeader}>
        <ImagePlaceholder 
          width={120} 
          height={60} 
          label="LOGO CHE·NU" 
          icon="◈"
          style={{ background: 'transparent', border: 'none' }}
        />
      </div>

      {/* Progress Dots */}
      <div style={styles.progressDots}>
        {steps.map((_, index) => (
          <div
            key={index}
            style={{
              ...styles.progressDot,
              ...(index <= step ? styles.progressDotActive : {}),
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.wizardContent}>
        {/* Left Panel - Nova */}
        <div style={styles.wizardLeft}>
          <NovaAssistant
            message={novaMessages[currentStep]}
            variant="default"
          />
        </div>

        {/* Right Panel - Interactive Content */}
        <div style={styles.wizardRight}>
          {currentStep === 'welcome' && (
            <div style={styles.welcomePanel}>
              <ImagePlaceholder 
                width="100%" 
                height={300} 
                label="Animation de bienvenue" 
                icon="✨"
              />
              <button style={styles.primaryButton} onClick={handleNext}>
                Commencer avec Nova
              </button>
              <button style={styles.secondaryButton} onClick={() => setStep(6)}>
                Configurer seul (mode avancé)
              </button>
            </div>
          )}

          {currentStep === 'discovery' && (
            <div style={styles.discoveryPanel}>
              <div style={styles.optionsList}>
                {[
                  { value: 'employee', emoji: '👔', label: 'Employé(e) / Salarié(e)', desc: 'Vous travaillez pour une entreprise' },
                  { value: 'entrepreneur', emoji: '🚀', label: 'Entrepreneur / Fondateur', desc: 'Vous avez votre propre entreprise' },
                  { value: 'freelance', emoji: '💼', label: 'Freelance / Consultant', desc: 'Vous travaillez en indépendant' },
                  { value: 'student', emoji: '🎓', label: 'Étudiant(e) / En formation', desc: 'Vous êtes en cours d\'études' },
                  { value: 'other', emoji: '🏖️', label: 'Retraité(e) / Autre', desc: 'Autre situation' },
                ].map((option) => (
                  <div
                    key={option.value}
                    style={{
                      ...styles.optionCard,
                      ...(userProfile.activity === option.value ? styles.optionCardSelected : {}),
                    }}
                    onClick={() => setUserProfile({ ...userProfile, activity: option.value })}
                  >
                    <span style={styles.optionEmoji}>{option.emoji}</span>
                    <div style={styles.optionContent}>
                      <div style={styles.optionLabel}>{option.label}</div>
                      <div style={styles.optionDesc}>{option.desc}</div>
                    </div>
                    {userProfile.activity === option.value && (
                      <span style={styles.optionCheck}>✓</span>
                    )}
                  </div>
                ))}
              </div>
              <button 
                style={{
                  ...styles.primaryButton,
                  ...(userProfile.activity ? {} : styles.buttonDisabled),
                }}
                onClick={handleNext}
                disabled={!userProfile.activity}
              >
                Continuer →
              </button>
            </div>
          )}

          {currentStep === 'theme' && (
            <div style={styles.themePanel}>
              <div style={styles.themeGrid}>
                {THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    style={{
                      ...styles.themeCard,
                      ...(selectedTheme === theme.id ? styles.themeCardSelected : {}),
                    }}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <ImagePlaceholder 
                      width="100%" 
                      height={120} 
                      label={`Thème ${theme.name}`} 
                      icon={theme.emoji}
                    />
                    <div style={styles.themeInfo}>
                      <div style={styles.themeName}>
                        {theme.emoji} {theme.name}
                      </div>
                      <div style={styles.themeDesc}>{theme.description}</div>
                    </div>
                    {selectedTheme === theme.id && (
                      <div style={styles.themeBadge}>✓</div>
                    )}
                  </div>
                ))}
              </div>
              <button 
                style={{
                  ...styles.primaryButton,
                  ...(selectedTheme ? {} : styles.buttonDisabled),
                }}
                onClick={handleNext}
                disabled={!selectedTheme}
              >
                Continuer →
              </button>
            </div>
          )}

          {currentStep === 'rooms' && (
            <div style={styles.roomsPanel}>
              {/* Current Sphere Header */}
              <div style={styles.sphereHeader}>
                <span style={styles.sphereSymbol}>
                  {SPHERES[currentSphereIndex].symbol}
                </span>
                <span style={styles.sphereName}>
                  {SPHERES[currentSphereIndex].name}
                </span>
                <span style={styles.sphereProgress}>
                  ({currentSphereIndex + 1}/8)
                </span>
              </div>

              {/* Room Preview */}
              <ImagePlaceholder 
                width="100%" 
                height={200} 
                label={`Pièce pour ${SPHERES[currentSphereIndex].name}`}
                icon={SPHERES[currentSphereIndex].emoji}
              />

              {/* Room Selection Gallery */}
              <DynamicImageGallery
                folderPath={`/rooms/${selectedTheme}/${SPHERES[currentSphereIndex].id}`}
                selectedIndex={roomAssignments[SPHERES[currentSphereIndex].id]}
                onSelect={handleRoomSelect}
                title="Choisissez une pièce:"
                emptyMessage="Ajoutez des images dans le dossier des pièces"
              />

              {/* Sphere Progress */}
              <div style={styles.sphereProgress2}>
                {SPHERES.map((sphere, index) => (
                  <div
                    key={sphere.id}
                    style={{
                      ...styles.sphereProgressDot,
                      ...(roomAssignments[sphere.id] !== undefined ? styles.sphereProgressDotComplete : {}),
                      ...(index === currentSphereIndex ? styles.sphereProgressDotActive : {}),
                    }}
                    title={sphere.name}
                  >
                    {sphere.symbol}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div style={styles.roomNavigation}>
                <button 
                  style={styles.secondaryButton}
                  onClick={handlePrevSphere}
                  disabled={currentSphereIndex === 0}
                >
                  ← Précédent
                </button>
                <button 
                  style={styles.primaryButton}
                  onClick={handleNextSphere}
                >
                  {currentSphereIndex === SPHERES.length - 1 ? 'Terminer →' : 'Suivant →'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 'tutorial' && (
            <div style={styles.tutorialPanel}>
              <ImagePlaceholder 
                width="100%" 
                height={300} 
                label="Vidéo / Animation Tutorial" 
                icon="📖"
              />
              <div style={styles.tutorialConcepts}>
                <div style={styles.conceptCard}>
                  <div style={styles.conceptIcon}>◇⬡⏣✦</div>
                  <div style={styles.conceptTitle}>8 SPHÈRES</div>
                  <div style={styles.conceptDesc}>Votre vie en 8 contextes séparés</div>
                </div>
                <div style={styles.conceptCard}>
                  <div style={styles.conceptIcon}>📋</div>
                  <div style={styles.conceptTitle}>BUREAU UNIFIÉ</div>
                  <div style={styles.conceptDesc}>10 sections identiques par sphère</div>
                </div>
                <div style={styles.conceptCard}>
                  <div style={styles.conceptIcon}>🏠</div>
                  <div style={styles.conceptTitle}>PIÈCES</div>
                  <div style={styles.conceptDesc}>Repère visuel instantané</div>
                </div>
                <div style={styles.conceptCard}>
                  <div style={styles.conceptIcon}>💰</div>
                  <div style={styles.conceptTitle}>GOUVERNANCE</div>
                  <div style={styles.conceptDesc}>Contrôle total des coûts IA</div>
                </div>
              </div>
              <button style={styles.primaryButton} onClick={handleNext}>
                J'ai compris →
              </button>
            </div>
          )}

          {currentStep === 'connections' && (
            <div style={styles.connectionsPanel}>
              <div style={styles.connectionCategories}>
                <div style={styles.connectionCategory}>
                  <div style={styles.categoryTitle}>Productivité</div>
                  <div style={styles.connectionGrid}>
                    {['Google Calendar', 'Outlook', 'Notion', 'Slack', 'Teams'].map((name) => (
                      <div key={name} style={styles.connectionCard}>
                        <ImagePlaceholder width={40} height={40} label="" icon="📱" />
                        <span style={styles.connectionName}>{name}</span>
                        <button style={styles.connectButton}>Connecter</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={styles.connectionCategory}>
                  <div style={styles.categoryTitle}>Réseaux Sociaux</div>
                  <div style={styles.connectionGrid}>
                    {['LinkedIn', 'Twitter/X', 'Instagram', 'Facebook'].map((name) => (
                      <div key={name} style={styles.connectionCard}>
                        <ImagePlaceholder width={40} height={40} label="" icon="📱" />
                        <span style={styles.connectionName}>{name}</span>
                        <button style={styles.connectButton}>Connecter</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={styles.skipOption}>
                <button style={styles.secondaryButton} onClick={handleNext}>
                  Passer cette étape →
                </button>
              </div>
            </div>
          )}

          {currentStep === 'summary' && (
            <div style={styles.summaryPanel}>
              <div style={styles.summaryCard}>
                <div style={styles.summarySection}>
                  <div style={styles.summaryLabel}>UNIVERS</div>
                  <div style={styles.summaryValue}>
                    {THEMES.find(t => t.id === selectedTheme)?.emoji} {' '}
                    {THEMES.find(t => t.id === selectedTheme)?.name || 'Non sélectionné'}
                  </div>
                </div>
                <div style={styles.summarySection}>
                  <div style={styles.summaryLabel}>PIÈCES ASSIGNÉES</div>
                  <div style={styles.summaryRooms}>
                    {SPHERES.map((sphere) => (
                      <div key={sphere.id} style={styles.summaryRoom}>
                        <span>{sphere.symbol}</span>
                        <span>{sphere.name}</span>
                        <span style={styles.roomStatus}>
                          {roomAssignments[sphere.id] !== undefined ? '✓' : '○'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button style={styles.primaryButton} onClick={handleNext}>
                Accéder à CHE·NU →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      {step > 0 && currentStep !== 'rooms' && (
        <button style={styles.backButton} onClick={handleBack}>
          ← Retour
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SPHERE MANAGEMENT COMPONENT
// ═══════════════════════════════════════════════════════════════════

const SphereManagement = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [expandedSections, setExpandedSections] = useState({});

  const activeSphere = SPHERES.find(s => s.id === activeTab);

  const toggleSection = (sectionId) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId],
    });
  };

  const sphereSections = {
    personal: [
      { id: 'info', name: 'Informations Personnelles', icon: '📋', progress: 80 },
      { id: 'goals', name: 'Objectifs de Vie', icon: '🎯', progress: 40 },
      { id: 'health', name: 'Santé & Bien-être', icon: '💚', progress: 0 },
      { id: 'relations', name: 'Relations Proches', icon: '👨‍👩‍👧‍👦', progress: 20 },
      { id: 'finances', name: 'Finances Personnelles', icon: '💰', progress: 0 },
      { id: 'preferences', name: 'Préférences & Style', icon: '🎨', progress: 100 },
    ],
    business: [
      { id: 'companies', name: 'Entreprises', icon: '🏢', progress: 100 },
      { id: 'branches', name: 'Branches & Divisions', icon: '📊', progress: 75 },
      { id: 'clients', name: 'Clients', icon: '👥', progress: 60 },
      { id: 'partners', name: 'Partenaires', icon: '🤝', progress: 0 },
      { id: 'team', name: 'Équipe', icon: '💼', progress: 50 },
      { id: 'platforms', name: 'Plateformes Connectées', icon: '🔌', progress: 40 },
      { id: 'objectives', name: 'Objectifs Business', icon: '📈', progress: 0 },
    ],
    government: [
      { id: 'identity', name: 'Identité Officielle', icon: '🪪', progress: 0 },
      { id: 'institutions', name: 'Institutions', icon: '🏛️', progress: 0 },
      { id: 'deadlines', name: 'Échéances Importantes', icon: '📅', progress: 0 },
      { id: 'documents', name: 'Documents Officiels', icon: '📁', progress: 0 },
    ],
    creative: [
      { id: 'portfolio', name: 'Portfolio & Œuvres', icon: '🎨', progress: 0 },
      { id: 'skills', name: 'Compétences & Outils', icon: '🛠️', progress: 0 },
      { id: 'inspiration', name: 'Inspiration', icon: '💡', progress: 0 },
      { id: 'style', name: 'Style & Identité', icon: '📐', progress: 0 },
    ],
    community: [
      { id: 'groups', name: 'Associations & Groupes', icon: '👥', progress: 0 },
      { id: 'roles', name: 'Rôles Communautaires', icon: '🎭', progress: 0 },
      { id: 'events', name: 'Événements', icon: '📅', progress: 0 },
      { id: 'causes', name: 'Causes & Intérêts', icon: '🌍', progress: 0 },
    ],
    social: [
      { id: 'profiles', name: 'Profils Sociaux', icon: '📱', progress: 0 },
      { id: 'audiences', name: 'Audiences & Métriques', icon: '📊', progress: 0 },
      { id: 'strategy', name: 'Stratégie de Contenu', icon: '📝', progress: 0 },
      { id: 'network', name: 'Connexions Professionnelles', icon: '🔗', progress: 0 },
    ],
    entertainment: [
      { id: 'preferences', name: 'Préférences Média', icon: '🎬', progress: 0 },
      { id: 'subscriptions', name: 'Abonnements', icon: '📺', progress: 0 },
      { id: 'gaming', name: 'Gaming & Hobbies', icon: '🎮', progress: 0 },
      { id: 'events', name: 'Événements & Sorties', icon: '📅', progress: 0 },
    ],
    team: [
      { id: 'agents', name: 'Agents IA Actifs', icon: '🤖', progress: 0 },
      { id: 'tools', name: 'Outils & Skills', icon: '🛠️', progress: 0 },
      { id: 'labs', name: 'IA Labs', icon: '🧪', progress: 0 },
      { id: 'budget', name: 'Budget Tokens', icon: '💰', progress: 0 },
      { id: 'prefs', name: 'Préférences IA', icon: '⚙️', progress: 0 },
    ],
  };

  const currentSections = sphereSections[activeTab] || [];
  const overallProgress = currentSections.length > 0
    ? Math.round(currentSections.reduce((sum, s) => sum + s.progress, 0) / currentSections.length)
    : 0;

  return (
    <div style={styles.managementContainer}>
      {/* Header */}
      <div style={styles.managementHeader}>
        <h1 style={styles.managementTitle}>Gestion des Sphères</h1>
        <p style={styles.managementSubtitle}>
          Configurez chaque sphère selon vos besoins. Nova vous guide.
        </p>
      </div>

      {/* Sphere Tabs */}
      <div style={styles.sphereTabs}>
        {SPHERES.map((sphere) => (
          <button
            key={sphere.id}
            style={{
              ...styles.sphereTab,
              ...(activeTab === sphere.id ? styles.sphereTabActive : {}),
              borderColor: sphere.color,
            }}
            onClick={() => setActiveTab(sphere.id)}
          >
            <span style={styles.tabSymbol}>{sphere.symbol}</span>
            <span style={styles.tabName}>{sphere.name}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.managementContent}>
        {/* Left - Configuration */}
        <div style={styles.configPanel}>
          {/* Progress Header */}
          <div style={styles.progressHeader}>
            <div style={styles.progressLabel}>
              <span style={{ fontSize: '24px' }}>{activeSphere?.symbol}</span>
              <span>{activeSphere?.name}</span>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${overallProgress}%`,
                  backgroundColor: activeSphere?.color,
                }}
              />
            </div>
            <div style={styles.progressText}>{overallProgress}% configuré</div>
          </div>

          {/* Sections */}
          <div style={styles.sectionsList}>
            {currentSections.map((section) => (
              <div key={section.id} style={styles.sectionItem}>
                <div 
                  style={styles.sectionHeader}
                  onClick={() => toggleSection(section.id)}
                >
                  <span style={styles.sectionIcon}>{section.icon}</span>
                  <span style={styles.sectionName}>{section.name}</span>
                  <div style={styles.sectionProgress}>
                    <div 
                      style={{
                        ...styles.sectionProgressFill,
                        width: `${section.progress}%`,
                      }}
                    />
                  </div>
                  <span style={styles.sectionStatus}>
                    {section.progress === 100 ? '✓' : section.progress > 0 ? '◐' : '○'}
                  </span>
                  <span style={styles.sectionToggle}>
                    {expandedSections[section.id] ? '▼' : '▶'}
                  </span>
                </div>
                {expandedSections[section.id] && (
                  <div style={styles.sectionContent}>
                    <ImagePlaceholder 
                      width="100%" 
                      height={100} 
                      label={`Configuration: ${section.name}`}
                      icon="⚙️"
                    />
                    <button style={styles.configButton}>
                      Configurer avec Nova
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Nova */}
        <div style={styles.novaPanel}>
          <NovaAssistant
            message={`Bienvenue dans la configuration de votre sphère ${activeSphere?.name}! ${activeSphere?.emoji}

Cette sphère est configurée à ${overallProgress}%.

${overallProgress < 50 
  ? "Je vois qu'il reste plusieurs sections à compléter. Voulez-vous que je vous guide?"
  : overallProgress < 100 
    ? "Vous avez bien avancé! Continuons pour finaliser cette sphère."
    : "Excellent! Cette sphère est entièrement configurée. Voulez-vous revoir certains éléments?"
}`}
            actions={[
              { label: 'Oui, guide-moi', value: 'guide', primary: true },
              { label: 'Plus tard', value: 'later' },
            ]}
            onAction={(_action) => {}}
          />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════

const ChenuOnboardingApp = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [view, setView] = useState('onboarding'); // 'onboarding' | 'management'

  const handleOnboardingComplete = (config) => {
    // Onboarding complete - handled by callback
    setIsOnboardingComplete(true);
    setView('management');
  };

  return (
    <div style={styles.app}>
      {/* Navigation for demo */}
      <div style={styles.demoNav}>
        <button 
          style={{
            ...styles.demoButton,
            ...(view === 'onboarding' ? styles.demoButtonActive : {}),
          }}
          onClick={() => setView('onboarding')}
        >
          🎓 Onboarding
        </button>
        <button 
          style={{
            ...styles.demoButton,
            ...(view === 'management' ? styles.demoButtonActive : {}),
          }}
          onClick={() => setView('management')}
        >
          ⚙️ Gestion des Sphères
        </button>
      </div>

      {/* Content */}
      {view === 'onboarding' && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}
      {view === 'management' && (
        <SphereManagement />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = {
  // App
  app: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${COLORS.uiSlate} 0%, ${COLORS.deepBlack} 100%)`,
    color: COLORS.softSand,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },

  // Demo Navigation
  demoNav: {
    display: 'flex',
    gap: '10px',
    padding: '15px 20px',
    background: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.ancientStone}40`,
  },
  demoButton: {
    padding: '10px 20px',
    background: 'transparent',
    border: `1px solid ${COLORS.ancientStone}`,
    borderRadius: '8px',
    color: COLORS.softSand,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  demoButtonActive: {
    background: COLORS.sacredGold,
    color: COLORS.deepBlack,
    borderColor: COLORS.sacredGold,
  },

  // Gallery
  galleryContainer: {
    marginTop: '20px',
  },
  galleryTitle: {
    fontSize: '14px',
    color: COLORS.ancientStone,
    marginBottom: '10px',
  },
  galleryWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  galleryScroll: {
    display: 'flex',
    gap: '15px',
    overflowX: 'auto',
    padding: '10px 0',
    scrollBehavior: 'smooth',
    flex: 1,
  },
  galleryItem: {
    minWidth: '120px',
    height: '100px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: `2px solid transparent`,
    transition: 'all 0.2s',
    position: 'relative',
  },
  galleryItemSelected: {
    border: `2px solid ${COLORS.sacredGold}`,
    transform: 'scale(1.05)',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  scrollButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: COLORS.ancientStone + '40',
    border: 'none',
    color: COLORS.softSand,
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryInfo: {
    fontSize: '12px',
    color: COLORS.ancientStone,
    textAlign: 'center',
    marginTop: '10px',
  },
  galleryLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '40px',
    color: COLORS.ancientStone,
  },
  galleryError: {
    padding: '20px',
    background: '#8B000020',
    borderRadius: '8px',
    color: '#FF6B6B',
  },
  galleryEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    color: COLORS.ancientStone,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  selectedBadge: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: COLORS.sacredGold,
    color: COLORS.deepBlack,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },

  // Placeholder
  placeholder: {
    background: `linear-gradient(135deg, ${COLORS.ancientStone}20 0%, ${COLORS.ancientStone}40 100%)`,
    borderRadius: '12px',
    border: `2px dashed ${COLORS.ancientStone}60`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  placeholderEmoji: {
    fontSize: '32px',
  },
  placeholderLabel: {
    fontSize: '12px',
    color: COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    background: `linear-gradient(135deg, ${COLORS.ancientStone}30 0%, ${COLORS.ancientStone}50 100%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  placeholderIcon: {
    fontSize: '24px',
  },
  placeholderText: {
    fontSize: '11px',
    color: COLORS.ancientStone,
  },

  // Nova Assistant
  novaContainer: {
    background: `linear-gradient(135deg, ${COLORS.shadowMoss}40 0%, ${COLORS.jungleEmerald}20 100%)`,
    borderRadius: '16px',
    padding: '20px',
    border: `1px solid ${COLORS.jungleEmerald}40`,
  },
  novaCompact: {
    background: `${COLORS.shadowMoss}30`,
    borderRadius: '12px',
    padding: '15px',
  },
  novaFullscreen: {
    background: `linear-gradient(135deg, ${COLORS.shadowMoss} 0%, ${COLORS.deepBlack} 100%)`,
    borderRadius: '20px',
    padding: '30px',
  },
  novaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  novaAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  novaIcon: {
    fontSize: '20px',
  },
  novaName: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.cenoteTurquoise,
    letterSpacing: '2px',
  },
  novaStatus: {
    marginLeft: 'auto',
    color: COLORS.cenoteTurquoise,
    fontSize: '10px',
  },
  novaMessage: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: COLORS.softSand,
    whiteSpace: 'pre-line',
  },
  novaCursor: {
    animation: 'blink 1s infinite',
    color: COLORS.cenoteTurquoise,
  },
  novaActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  novaButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: `1px solid ${COLORS.cenoteTurquoise}60`,
    background: 'transparent',
    color: COLORS.softSand,
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  novaButtonPrimary: {
    background: COLORS.cenoteTurquoise,
    color: COLORS.deepBlack,
    border: 'none',
  },

  // Wizard
  wizardContainer: {
    minHeight: 'calc(100vh - 60px)',
    padding: '40px',
    position: 'relative',
  },
  wizardHeader: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  progressDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '40px',
  },
  progressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: COLORS.ancientStone + '40',
    transition: 'all 0.3s',
  },
  progressDotActive: {
    background: COLORS.sacredGold,
    transform: 'scale(1.2)',
  },
  wizardContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  wizardLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  wizardRight: {
    display: 'flex',
    flexDirection: 'column',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    background: 'transparent',
    border: `1px solid ${COLORS.ancientStone}`,
    borderRadius: '8px',
    color: COLORS.softSand,
    cursor: 'pointer',
  },

  // Panels
  welcomePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
  discoveryPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  themePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  roomsPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  tutorialPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  connectionsPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  summaryPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  // Buttons
  primaryButton: {
    padding: '15px 30px',
    background: COLORS.sacredGold,
    border: 'none',
    borderRadius: '10px',
    color: COLORS.deepBlack,
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  secondaryButton: {
    padding: '15px 30px',
    background: 'transparent',
    border: `1px solid ${COLORS.ancientStone}`,
    borderRadius: '10px',
    color: COLORS.softSand,
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // Options
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px 20px',
    background: COLORS.ancientStone + '20',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  optionCardSelected: {
    background: COLORS.sacredGold + '20',
    borderColor: COLORS.sacredGold,
  },
  optionEmoji: {
    fontSize: '24px',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontWeight: '600',
    marginBottom: '4px',
  },
  optionDesc: {
    fontSize: '13px',
    color: COLORS.ancientStone,
  },
  optionCheck: {
    color: COLORS.sacredGold,
    fontSize: '20px',
  },

  // Theme Cards
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  themeCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    background: COLORS.ancientStone + '20',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
    position: 'relative',
  },
  themeCardSelected: {
    borderColor: COLORS.sacredGold,
  },
  themeInfo: {
    padding: '15px',
  },
  themeName: {
    fontWeight: '600',
    marginBottom: '5px',
  },
  themeDesc: {
    fontSize: '12px',
    color: COLORS.ancientStone,
  },
  themeBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: COLORS.sacredGold,
    color: COLORS.deepBlack,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },

  // Rooms
  sphereHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  sphereSymbol: {
    fontSize: '28px',
    color: COLORS.sacredGold,
  },
  sphereName: {
    fontSize: '20px',
    fontWeight: '600',
  },
  sphereProgress: {
    color: COLORS.ancientStone,
    marginLeft: 'auto',
  },
  sphereProgress2: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '15px 0',
  },
  sphereProgressDot: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: COLORS.ancientStone + '40',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  sphereProgressDotComplete: {
    background: COLORS.jungleEmerald + '60',
  },
  sphereProgressDotActive: {
    background: COLORS.sacredGold,
    color: COLORS.deepBlack,
    transform: 'scale(1.1)',
  },
  roomNavigation: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },

  // Tutorial
  tutorialConcepts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  conceptCard: {
    background: COLORS.ancientStone + '20',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
  },
  conceptIcon: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  conceptTitle: {
    fontWeight: '600',
    marginBottom: '5px',
    color: COLORS.sacredGold,
  },
  conceptDesc: {
    fontSize: '12px',
    color: COLORS.ancientStone,
  },

  // Connections
  connectionCategories: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  connectionCategory: {
    background: COLORS.ancientStone + '10',
    borderRadius: '12px',
    padding: '15px',
  },
  categoryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '15px',
    color: COLORS.ancientStone,
  },
  connectionGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  connectionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 15px',
    background: COLORS.ancientStone + '20',
    borderRadius: '10px',
    minWidth: '150px',
  },
  connectionName: {
    fontSize: '13px',
    flex: 1,
  },
  connectButton: {
    padding: '5px 10px',
    background: COLORS.cenoteTurquoise,
    border: 'none',
    borderRadius: '6px',
    color: COLORS.deepBlack,
    fontSize: '11px',
    cursor: 'pointer',
  },
  skipOption: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },

  // Summary
  summaryCard: {
    background: COLORS.ancientStone + '20',
    borderRadius: '16px',
    padding: '25px',
  },
  summarySection: {
    marginBottom: '20px',
  },
  summaryLabel: {
    fontSize: '12px',
    color: COLORS.ancientStone,
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: '18px',
    fontWeight: '600',
  },
  summaryRooms: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  summaryRoom: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    background: COLORS.ancientStone + '20',
    borderRadius: '8px',
    fontSize: '13px',
  },
  roomStatus: {
    marginLeft: 'auto',
    color: COLORS.jungleEmerald,
  },

  // Management
  managementContainer: {
    padding: '30px',
  },
  managementHeader: {
    marginBottom: '30px',
  },
  managementTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: COLORS.softSand,
    marginBottom: '10px',
  },
  managementSubtitle: {
    color: COLORS.ancientStone,
  },
  sphereTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
  },
  sphereTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'transparent',
    border: '2px solid',
    borderRadius: '12px',
    color: COLORS.softSand,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
  },
  sphereTabActive: {
    background: COLORS.sacredGold + '20',
  },
  tabSymbol: {
    fontSize: '18px',
  },
  tabName: {
    fontWeight: '500',
  },
  managementContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '30px',
  },
  configPanel: {
    background: COLORS.ancientStone + '10',
    borderRadius: '16px',
    padding: '25px',
  },
  novaPanel: {
    position: 'sticky',
    top: '20px',
    alignSelf: 'start',
  },
  progressHeader: {
    marginBottom: '25px',
  },
  progressLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600',
  },
  progressBar: {
    height: '8px',
    background: COLORS.ancientStone + '40',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '13px',
    color: COLORS.ancientStone,
  },
  sectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionItem: {
    background: COLORS.ancientStone + '15',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  sectionIcon: {
    fontSize: '20px',
  },
  sectionName: {
    flex: 1,
    fontWeight: '500',
  },
  sectionProgress: {
    width: '60px',
    height: '4px',
    background: COLORS.ancientStone + '40',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  sectionProgressFill: {
    height: '100%',
    background: COLORS.jungleEmerald,
    borderRadius: '2px',
    transition: 'width 0.3s',
  },
  sectionStatus: {
    width: '20px',
    textAlign: 'center',
    color: COLORS.jungleEmerald,
  },
  sectionToggle: {
    color: COLORS.ancientStone,
    fontSize: '12px',
  },
  sectionContent: {
    padding: '15px',
    borderTop: `1px solid ${COLORS.ancientStone}30`,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  configButton: {
    padding: '12px 20px',
    background: COLORS.cenoteTurquoise,
    border: 'none',
    borderRadius: '8px',
    color: COLORS.deepBlack,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: `2px solid ${COLORS.ancientStone}`,
    borderTopColor: COLORS.sacredGold,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default ChenuOnboardingApp;
