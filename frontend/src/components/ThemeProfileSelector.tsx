/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — THEME & PROFILE STYLE SELECTOR
 * Governed Intelligence Operating System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Composant de sélection du thème visuel et du style de profil
 * Utilise les vraies images maps isométriques
 * 
 * @version 2.0.0
 * @author CHE·NU Team
 */

import React, { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Theme {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  emoji: string;
  mapImage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  characteristics: string[];
}

interface ProfileStyle {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  icon: string;
  features: string[];
}

interface ThemeSelectorProps {
  onThemeSelect: (theme: Theme) => void;
  onStyleSelect: (style: ProfileStyle) => void;
  onComplete: (theme: Theme, style: ProfileStyle) => void;
  initialTheme?: string;
  initialStyle?: string;
  language?: 'en' | 'fr';
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND COLORS
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

// ═══════════════════════════════════════════════════════════════════════════════
// THEMES DATA (avec vraies images)
// ═══════════════════════════════════════════════════════════════════════════════

const THEMES: Theme[] = [
  {
    id: 'sacred-temple',
    name: 'Sacred Temple',
    nameFr: 'Temple Sacré',
    description: 'Ancient Mayan-inspired architecture with the sacred tree at center',
    descriptionFr: 'Architecture maya ancestrale avec l\'arbre sacré au centre',
    emoji: '🏛️',
    mapImage: '/assets/maps/map-isometric-0.png',
    primaryColor: '#D8B26A',
    secondaryColor: '#8D8371',
    accentColor: '#3EB4A2',
    characteristics: ['Ancient wisdom', 'Stone & gold', 'Sacred geometry', 'Mystical cenote'],
  },
  {
    id: 'cyber-nexus',
    name: 'Cyber Nexus',
    nameFr: 'Nexus Cyber',
    description: 'Futuristic hub with neon turquoise energy flows and holographic interfaces',
    descriptionFr: 'Hub futuriste avec flux d\'énergie turquoise néon et interfaces holographiques',
    emoji: '🌐',
    mapImage: '/assets/maps/map-aerial-1.png',
    primaryColor: '#00E5FF',
    secondaryColor: '#1E1F22',
    accentColor: '#D8B26A',
    characteristics: ['Neon energy', 'Holographic', 'High-tech', 'Connected'],
  },
  {
    id: 'nature-sanctuary',
    name: 'Nature Sanctuary',
    nameFr: 'Sanctuaire Naturel',
    description: 'Organic blend of technology and nature with the World Tree',
    descriptionFr: 'Fusion organique de technologie et nature avec l\'Arbre du Monde',
    emoji: '🌳',
    mapImage: '/assets/maps/map-isometric-1.png',
    primaryColor: '#3F7249',
    secondaryColor: '#7A593A',
    accentColor: '#3EB4A2',
    characteristics: ['Living systems', 'Organic growth', 'Natural harmony', 'Ecosystem'],
  },
  {
    id: 'atlantean-citadel',
    name: 'Atlantean Citadel',
    nameFr: 'Citadelle Atlante',
    description: 'Underwater-inspired crystal architecture with ancient technology',
    descriptionFr: 'Architecture cristalline sous-marine avec technologie ancienne',
    emoji: '🔮',
    mapImage: '/assets/maps/map-isometric-2.png',
    primaryColor: '#3EB4A2',
    secondaryColor: '#2F4C39',
    accentColor: '#D8B26A',
    characteristics: ['Crystal energy', 'Deep wisdom', 'Ancient tech', 'Underwater light'],
  },
  {
    id: 'cosmic-observatory',
    name: 'Cosmic Observatory',
    nameFr: 'Observatoire Cosmique',
    description: 'Stellar vista with constellation pathways connecting the spheres',
    descriptionFr: 'Vue stellaire avec chemins de constellations connectant les sphères',
    emoji: '✨',
    mapImage: '/assets/maps/map-aerial-3.png',
    primaryColor: '#E9E4D6',
    secondaryColor: '#1E1F22',
    accentColor: '#D8B26A',
    characteristics: ['Starlight', 'Cosmic scale', 'Infinite vision', 'Celestial'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE STYLES DATA
// ═══════════════════════════════════════════════════════════════════════════════

const PROFILE_STYLES: ProfileStyle[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    nameFr: 'Minimaliste',
    description: 'Clean, focused interface with essential elements only',
    descriptionFr: 'Interface épurée et focalisée avec éléments essentiels uniquement',
    icon: '◯',
    features: ['Reduced cognitive load', 'Fast navigation', 'Essential info only'],
  },
  {
    id: 'professional',
    name: 'Professional',
    nameFr: 'Professionnel',
    description: 'Business-oriented layout with detailed metrics and analytics',
    descriptionFr: 'Mise en page orientée business avec métriques et analytiques détaillés',
    icon: '📊',
    features: ['Dashboard widgets', 'KPI tracking', 'Reports integration'],
  },
  {
    id: 'creative',
    name: 'Creative',
    nameFr: 'Créatif',
    description: 'Visual-first design with mood boards and inspiration spaces',
    descriptionFr: 'Design visuel d\'abord avec mood boards et espaces d\'inspiration',
    icon: '🎨',
    features: ['Visual galleries', 'Color palettes', 'Inspiration feeds'],
  },
  {
    id: 'immersive',
    name: 'Immersive',
    nameFr: 'Immersif',
    description: '3D environments and VR-ready spaces for deep focus',
    descriptionFr: 'Environnements 3D et espaces VR pour une concentration profonde',
    icon: '🥽',
    features: ['3D navigation', 'VR compatible', 'Spatial audio'],
  },
  {
    id: 'balanced',
    name: 'Balanced',
    nameFr: 'Équilibré',
    description: 'Harmonious blend of all styles, adapting to your context',
    descriptionFr: 'Mélange harmonieux de tous les styles, s\'adaptant au contexte',
    icon: '⚖️',
    features: ['Context-aware', 'Adaptive layout', 'Smart defaults'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA ASSISTANT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const NovaAssistant: React.FC<{
  message: string;
  speaking?: boolean;
}> = ({ message, speaking = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (speaking) {
      let index = 0;
      setDisplayedText('');
      const timer = setInterval(() => {
        if (index < message.length) {
          setDisplayedText(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 25);
      return () => clearInterval(timer);
    } else {
      setDisplayedText(message);
    }
  }, [message, speaking]);

  return (
    <div style={styles.novaContainer}>
      {/* Nova Avatar */}
      <div style={styles.novaAvatar}>
        <div style={styles.novaGlow} />
        <div style={styles.novaCore}>✨</div>
      </div>
      
      {/* Message Bubble */}
      <div style={styles.novaBubble}>
        <div style={styles.novaName}>NOVA</div>
        <p style={styles.novaMessage}>
          {displayedText}
          {speaking && displayedText.length < message.length && (
            <span style={styles.cursor}>▋</span>
          )}
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// THEME CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ThemeCard: React.FC<{
  theme: Theme;
  isSelected: boolean;
  onClick: () => void;
  language: 'en' | 'fr';
}> = ({ theme, isSelected, onClick, language }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      style={{
        ...styles.themeCard,
        ...(isSelected ? styles.themeCardSelected : {}),
        ...(isHovered ? styles.themeCardHover : {}),
        borderColor: isSelected ? theme.primaryColor : 'transparent',
        boxShadow: isSelected 
          ? `0 0 30px ${theme.primaryColor}40, 0 0 60px ${theme.primaryColor}20`
          : isHovered 
            ? `0 10px 40px rgba(0,0,0,0.4)`
            : `0 4px 20px rgba(0,0,0,0.3)`,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Map Image */}
      <div style={styles.themeImageContainer}>
        {!imageLoaded && (
          <div style={styles.imagePlaceholder}>
            <span style={{ fontSize: 40 }}>{theme.emoji}</span>
            <span>Loading...</span>
          </div>
        )}
        <img
          src={theme.mapImage}
          alt={theme.name}
          style={{
            ...styles.themeImage,
            opacity: imageLoaded ? 1 : 0,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay gradient */}
        <div style={styles.themeOverlay} />
        
        {/* Selected badge */}
        {isSelected && (
          <div style={{
            ...styles.selectedBadge,
            background: theme.primaryColor,
          }}>
            ✓ Selected
          </div>
        )}
      </div>
      
      {/* Theme Info */}
      <div style={styles.themeInfo}>
        <div style={styles.themeHeader}>
          <span style={styles.themeEmoji}>{theme.emoji}</span>
          <h3 style={{
            ...styles.themeName,
            color: isSelected ? theme.primaryColor : COLORS.softSand,
          }}>
            {language === 'fr' ? theme.nameFr : theme.name}
          </h3>
        </div>
        
        <p style={styles.themeDescription}>
          {language === 'fr' ? theme.descriptionFr : theme.description}
        </p>
        
        {/* Color Palette Preview */}
        <div style={styles.colorPalette}>
          <div style={{ ...styles.colorDot, background: theme.primaryColor }} title="Primary" />
          <div style={{ ...styles.colorDot, background: theme.secondaryColor }} title="Secondary" />
          <div style={{ ...styles.colorDot, background: theme.accentColor }} title="Accent" />
        </div>
        
        {/* Characteristics */}
        <div style={styles.characteristics}>
          {theme.characteristics.map((char, i) => (
            <span key={i} style={styles.characteristicTag}>
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE STYLE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ProfileStyleCard: React.FC<{
  style: ProfileStyle;
  isSelected: boolean;
  onClick: () => void;
  language: 'en' | 'fr';
  accentColor: string;
}> = ({ style, isSelected, onClick, language, accentColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.styleCard,
        ...(isSelected ? { 
          borderColor: accentColor,
          background: `${accentColor}15`,
        } : {}),
        ...(isHovered && !isSelected ? styles.styleCardHover : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        ...styles.styleIcon,
        background: isSelected ? accentColor : COLORS.uiSlate,
        color: isSelected ? COLORS.deepBlack : COLORS.softSand,
      }}>
        {style.icon}
      </div>
      
      <div style={styles.styleContent}>
        <h4 style={{
          ...styles.styleName,
          color: isSelected ? accentColor : COLORS.softSand,
        }}>
          {language === 'fr' ? style.nameFr : style.name}
        </h4>
        
        <p style={styles.styleDescription}>
          {language === 'fr' ? style.descriptionFr : style.description}
        </p>
        
        <div style={styles.styleFeatures}>
          {style.features.map((feature, i) => (
            <span key={i} style={styles.featureTag}>
              • {feature}
            </span>
          ))}
        </div>
      </div>
      
      {isSelected && (
        <div style={{ ...styles.styleCheck, color: accentColor }}>✓</div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ThemeProfileSelector: React.FC<ThemeSelectorProps> = ({
  onThemeSelect,
  onStyleSelect,
  onComplete,
  initialTheme,
  initialStyle,
  language = 'fr',
}) => {
  const [step, setStep] = useState<'theme' | 'style' | 'preview'>('theme');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(
    initialTheme ? THEMES.find(t => t.id === initialTheme) || null : null
  );
  const [selectedStyle, setSelectedStyle] = useState<ProfileStyle | null>(
    initialStyle ? PROFILE_STYLES.find(s => s.id === initialStyle) || null : null
  );

  // Nova messages
  const novaMessages = {
    theme: {
      en: "Welcome to CHE·NU! Let's personalize your experience. First, choose a visual theme that resonates with you. Each theme represents a different energy - from ancient wisdom to futuristic innovation.",
      fr: "Bienvenue dans CHE·NU ! Personnalisons votre expérience. D'abord, choisissez un thème visuel qui vous parle. Chaque thème représente une énergie différente - de la sagesse ancienne à l'innovation futuriste.",
    },
    style: {
      en: `Excellent choice! Now, let's define how you'll interact with your spheres. Your profile style determines the layout and features you'll see. Choose what fits your workflow best.`,
      fr: `Excellent choix ! Maintenant, définissons comment vous interagirez avec vos sphères. Votre style de profil détermine la mise en page et les fonctionnalités. Choisissez ce qui correspond le mieux à votre façon de travailler.`,
    },
    preview: {
      en: `Perfect! Here's a preview of your personalized CHE·NU experience. The ${selectedTheme?.name || 'Sacred Temple'} theme combined with the ${selectedStyle?.name || 'Balanced'} style will create your unique workspace.`,
      fr: `Parfait ! Voici un aperçu de votre expérience CHE·NU personnalisée. Le thème ${selectedTheme?.nameFr || 'Temple Sacré'} combiné au style ${selectedStyle?.nameFr || 'Équilibré'} créera votre espace de travail unique.`,
    },
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    onThemeSelect(theme);
  };

  const handleStyleSelect = (style: ProfileStyle) => {
    setSelectedStyle(style);
    onStyleSelect(style);
  };

  const handleNext = () => {
    if (step === 'theme' && selectedTheme) {
      setStep('style');
    } else if (step === 'style' && selectedStyle) {
      setStep('preview');
    } else if (step === 'preview' && selectedTheme && selectedStyle) {
      onComplete(selectedTheme, selectedStyle);
    }
  };

  const handleBack = () => {
    if (step === 'style') setStep('theme');
    if (step === 'preview') setStep('style');
  };

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background}>
        {selectedTheme && (
          <img
            src={selectedTheme.mapImage}
            alt=""
            style={styles.backgroundImage}
          />
        )}
        <div style={styles.backgroundOverlay} />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>CHE·NU™</div>
        <div style={styles.stepIndicator}>
          <span style={{
            ...styles.stepDot,
            background: step === 'theme' ? COLORS.sacredGold : COLORS.ancientStone,
          }}>1</span>
          <span style={styles.stepLine} />
          <span style={{
            ...styles.stepDot,
            background: step === 'style' ? COLORS.sacredGold : 
                       step === 'preview' ? COLORS.ancientStone : COLORS.uiSlate,
          }}>2</span>
          <span style={styles.stepLine} />
          <span style={{
            ...styles.stepDot,
            background: step === 'preview' ? COLORS.sacredGold : COLORS.uiSlate,
          }}>3</span>
        </div>
      </div>

      {/* Nova Assistant */}
      <NovaAssistant 
        message={novaMessages[step][language]}
        speaking={true}
      />

      {/* Main Content */}
      <div style={styles.content}>
        {/* STEP 1: Theme Selection */}
        {step === 'theme' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              {language === 'fr' ? '🎨 Choisissez votre Univers' : '🎨 Choose your Universe'}
            </h2>
            <p style={styles.sectionSubtitle}>
              {language === 'fr' 
                ? 'Votre thème définit l\'ambiance visuelle de votre espace CHE·NU'
                : 'Your theme defines the visual atmosphere of your CHE·NU space'}
            </p>
            
            <div style={styles.themesGrid}>
              {THEMES.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme?.id === theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Profile Style Selection */}
        {step === 'style' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              {language === 'fr' ? '⚙️ Définissez votre Style' : '⚙️ Define your Style'}
            </h2>
            <p style={styles.sectionSubtitle}>
              {language === 'fr'
                ? 'Comment souhaitez-vous interagir avec vos sphères ?'
                : 'How would you like to interact with your spheres?'}
            </p>
            
            <div style={styles.stylesGrid}>
              {PROFILE_STYLES.map((style) => (
                <ProfileStyleCard
                  key={style.id}
                  style={style}
                  isSelected={selectedStyle?.id === style.id}
                  onClick={() => handleStyleSelect(style)}
                  language={language}
                  accentColor={selectedTheme?.primaryColor || COLORS.sacredGold}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Preview */}
        {step === 'preview' && selectedTheme && selectedStyle && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              {language === 'fr' ? '✨ Votre CHE·NU' : '✨ Your CHE·NU'}
            </h2>
            
            <div style={styles.previewContainer}>
              {/* Theme Preview */}
              <div style={styles.previewCard}>
                <img
                  src={selectedTheme.mapImage}
                  alt={selectedTheme.name}
                  style={styles.previewImage}
                />
                <div style={styles.previewOverlay}>
                  <div style={styles.previewInfo}>
                    <span style={styles.previewEmoji}>{selectedTheme.emoji}</span>
                    <h3 style={{ color: selectedTheme.primaryColor }}>
                      {language === 'fr' ? selectedTheme.nameFr : selectedTheme.name}
                    </h3>
                    <p>{language === 'fr' ? selectedTheme.descriptionFr : selectedTheme.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Style Summary */}
              <div style={styles.previewSummary}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>
                    {language === 'fr' ? 'Style de profil' : 'Profile Style'}
                  </span>
                  <span style={styles.summaryValue}>
                    {selectedStyle.icon} {language === 'fr' ? selectedStyle.nameFr : selectedStyle.name}
                  </span>
                </div>
                
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>
                    {language === 'fr' ? 'Couleur principale' : 'Primary Color'}
                  </span>
                  <div style={styles.colorPreview}>
                    <div style={{ 
                      ...styles.colorSwatch, 
                      background: selectedTheme.primaryColor 
                    }} />
                    <span>{selectedTheme.primaryColor}</span>
                  </div>
                </div>
                
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>
                    {language === 'fr' ? 'Fonctionnalités' : 'Features'}
                  </span>
                  <div style={styles.featuresList}>
                    {selectedStyle.features.map((f, i) => (
                      <span key={i} style={{
                        ...styles.featureTag,
                        background: `${selectedTheme.primaryColor}20`,
                        color: selectedTheme.primaryColor,
                      }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        {step !== 'theme' && (
          <button style={styles.backButton} onClick={handleBack}>
            ← {language === 'fr' ? 'Retour' : 'Back'}
          </button>
        )}
        
        <button
          style={{
            ...styles.nextButton,
            background: selectedTheme?.primaryColor || COLORS.sacredGold,
            opacity: (step === 'theme' && !selectedTheme) || 
                     (step === 'style' && !selectedStyle) ? 0.5 : 1,
          }}
          onClick={handleNext}
          disabled={(step === 'theme' && !selectedTheme) || 
                   (step === 'style' && !selectedStyle)}
        >
          {step === 'preview' 
            ? (language === 'fr' ? 'Commencer →' : 'Get Started →')
            : (language === 'fr' ? 'Continuer →' : 'Continue →')}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: COLORS.deepBlack,
    position: 'relative',
    overflow: 'hidden',
  },
  
  background: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  
  backgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.15,
    filter: 'blur(20px)',
  },
  
  backgroundOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(13,13,13,0.9) 0%, rgba(13,13,13,0.7) 50%, rgba(13,13,13,0.95) 100%)',
  },

  header: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 40px',
  },

  logo: {
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.sacredGold,
    letterSpacing: 2,
  },

  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  stepDot: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: COLORS.deepBlack,
    transition: 'all 0.3s ease',
  },

  stepLine: {
    width: 40,
    height: 2,
    background: COLORS.uiSlate,
  },

  // Nova
  novaContainer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: '0 40px',
    marginBottom: 32,
  },

  novaAvatar: {
    position: 'relative',
    width: 56,
    height: 56,
    flexShrink: 0,
  },

  novaGlow: {
    position: 'absolute',
    inset: -4,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${COLORS.sacredGold}40 0%, transparent 70%)`,
    animation: 'pulse 2s ease-in-out infinite',
  },

  novaCore: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${COLORS.sacredGold} 0%, ${COLORS.earthEmber} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
  },

  novaBubble: {
    flex: 1,
    maxWidth: 600,
    background: 'rgba(30, 31, 34, 0.9)',
    border: `1px solid ${COLORS.sacredGold}30`,
    borderRadius: 16,
    padding: '16px 20px',
    backdropFilter: 'blur(10px)',
  },

  novaName: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.sacredGold,
    letterSpacing: 2,
    marginBottom: 8,
  },

  novaMessage: {
    fontSize: 15,
    lineHeight: 1.6,
    color: COLORS.softSand,
    margin: 0,
  },

  cursor: {
    animation: 'blink 1s infinite',
    color: COLORS.sacredGold,
  },

  // Content
  content: {
    position: 'relative',
    zIndex: 10,
    padding: '0 40px 100px',
  },

  section: {
    maxWidth: 1400,
    margin: '0 auto',
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: COLORS.softSand,
    marginBottom: 8,
    textAlign: 'center' as const,
  },

  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.ancientStone,
    marginBottom: 32,
    textAlign: 'center' as const,
  },

  // Themes Grid
  themesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
  },

  themeCard: {
    background: 'rgba(30, 31, 34, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    backdropFilter: 'blur(10px)',
  },

  themeCardSelected: {
    transform: 'translateY(-4px)',
  },

  themeCardHover: {
    transform: 'translateY(-2px)',
  },

  themeImageContainer: {
    position: 'relative',
    height: 160,
    overflow: 'hidden',
  },

  themeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.5s ease',
  },

  themeOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, transparent 0%, rgba(13,13,13,0.8) 100%)',
  },

  imagePlaceholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: COLORS.uiSlate,
    color: COLORS.ancientStone,
    fontSize: 12,
  },

  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    color: COLORS.deepBlack,
  },

  themeInfo: {
    padding: 16,
  },

  themeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  themeEmoji: {
    fontSize: 20,
  },

  themeName: {
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
    transition: 'color 0.3s ease',
  },

  themeDescription: {
    fontSize: 12,
    color: COLORS.ancientStone,
    margin: '0 0 12px 0',
    lineHeight: 1.5,
  },

  colorPalette: {
    display: 'flex',
    gap: 6,
    marginBottom: 12,
  },

  colorDot: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
  },

  characteristics: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },

  characteristicTag: {
    fontSize: 10,
    padding: '3px 8px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    color: COLORS.ancientStone,
  },

  // Styles Grid
  stylesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
    maxWidth: 900,
    margin: '0 auto',
  },

  styleCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    background: 'rgba(30, 31, 34, 0.8)',
    border: '2px solid transparent',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },

  styleCardHover: {
    background: 'rgba(40, 41, 44, 0.9)',
    transform: 'translateX(4px)',
  },

  styleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },

  styleContent: {
    flex: 1,
  },

  styleName: {
    fontSize: 16,
    fontWeight: 600,
    margin: '0 0 4px 0',
    transition: 'color 0.3s ease',
  },

  styleDescription: {
    fontSize: 12,
    color: COLORS.ancientStone,
    margin: '0 0 10px 0',
    lineHeight: 1.5,
  },

  styleFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  featureTag: {
    fontSize: 11,
    color: COLORS.ancientStone,
  },

  styleCheck: {
    fontSize: 20,
    fontWeight: 700,
  },

  // Preview
  previewContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: 32,
    maxWidth: 1000,
    margin: '0 auto',
  },

  previewCard: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: '16/10',
  },

  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  previewOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, transparent 40%, rgba(13,13,13,0.95) 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    padding: 24,
  },

  previewInfo: {
    color: COLORS.softSand,
  },

  previewEmoji: {
    fontSize: 32,
  },

  previewSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    background: 'rgba(30, 31, 34, 0.8)',
    borderRadius: 16,
    padding: 24,
    backdropFilter: 'blur(10px)',
  },

  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },

  summaryLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: 600,
    color: COLORS.softSand,
  },

  colorPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: COLORS.softSand,
  },

  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },

  featuresList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },

  // Navigation
  navigation: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'linear-gradient(180deg, transparent 0%, rgba(13,13,13,0.95) 50%)',
    zIndex: 100,
  },

  backButton: {
    padding: '12px 24px',
    background: 'transparent',
    border: `1px solid ${COLORS.ancientStone}`,
    borderRadius: 8,
    color: COLORS.softSand,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  nextButton: {
    padding: '14px 32px',
    border: 'none',
    borderRadius: 8,
    color: COLORS.deepBlack,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: 'auto',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default ThemeProfileSelector;
export { THEMES, PROFILE_STYLES, COLORS };
export type { Theme, ProfileStyle, ThemeSelectorProps };
