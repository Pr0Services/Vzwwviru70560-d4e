/**
 * CHEÂ·NU V25 - Avatar System Upgrade
 * 
 * 6 STYLES D'AVATARS:
 * 1. Humain rÃ©aliste - Portrait photographique ou stylisÃ©
 * 2. Cartoon - Simple, fun, expressif
 * 3. Animal - Animaux mignons, stylisÃ©s ou semi-rÃ©alistes
 * 4. CrÃ©ature mythique - Dragons, esprits, golems, anges
 * 5. Avatar 3D - Style jeu vidÃ©o ou Pixar
 * 6. Minimaliste - Silhouette, icÃ´ne stylisÃ©e
 * 
 * FONCTIONNALITÃ‰S:
 * - Switch instantanÃ© entre styles
 * - Morphing facial (sourire, yeux, nez, mÃ¢choire)
 * - Coiffures multiples (textures, couleurs, styles)
 * - Accessoires (lunettes, bijoux, casques, ailes)
 * - Costumes (pro, casual, fantasy, sportif)
 * - Expressions (neutre, joyeux, concentrÃ©, surpris)
 * - Preview en temps rÃ©el
 * 
 * @version 25.0
 */

import React, { useState, useCallback, useMemo } from 'react';

// Design Tokens CHEÂ·NU
const T = {
  bg: { main: '#0D0D0D', card: '#1A1A1A', elevated: '#242424', hover: '#2A2A2A' },
  text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
  border: '#2A2A2A',
  accent: { 
    gold: '#D8B26A', 
    emerald: '#3F7249', 
    turquoise: '#3EB4A2',
    purple: '#8B5CF6',
    coral: '#FF6B6B'
  }
};

// Types
interface AvatarStyle {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface AvatarFeatures {
  // Morphing facial
  smileIntensity: number;      // 0-100
  eyeSize: number;             // 0-100
  noseWidth: number;           // 0-100
  jawShape: number;            // 0-100
  
  // Apparence
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  
  // Accessoires
  glasses: string | null;
  jewelry: string | null;
  headwear: string | null;
  
  // Costume
  costume: string;
  
  // Expression
  expression: string;
}

interface AvatarConfig {
  style: string;
  features: AvatarFeatures;
}

// 6 Styles d'avatars
const AVATAR_STYLES: AvatarStyle[] = [
  { id: 'human', name: 'Humain RÃ©aliste', icon: 'ðŸ‘¤', description: 'Portrait photographique ou stylisÃ©' },
  { id: 'cartoon', name: 'Cartoon', icon: 'ðŸŽ¨', description: 'Simple, fun, expressif' },
  { id: 'animal', name: 'Animal', icon: 'ðŸ¾', description: 'Animaux mignons ou stylisÃ©s' },
  { id: 'mythical', name: 'CrÃ©ature Mythique', icon: 'ðŸ‰', description: 'Dragons, esprits, golems' },
  { id: '3d', name: 'Avatar 3D', icon: 'ðŸŽ®', description: 'Style jeu vidÃ©o ou Pixar' },
  { id: 'minimal', name: 'Minimaliste', icon: 'â¬¡', description: 'Silhouette, icÃ´ne flat' },
];

// Options de personnalisation
const HAIR_STYLES = ['Court', 'Mi-long', 'Long', 'BouclÃ©', 'RasÃ©', 'Mohawk', 'Tresses', 'Afro'];
const HAIR_COLORS = ['Noir', 'Brun', 'Blond', 'Roux', 'Gris', 'Blanc', 'Bleu', 'Rose', 'Vert'];
const EYE_COLORS = ['Brun', 'Bleu', 'Vert', 'Gris', 'Noisette', 'Violet', 'Rouge'];
const SKIN_TONES = ['#FFDFC4', '#F0C8A0', '#D8A878', '#C68642', '#8D5524', '#5C3A21'];
const GLASSES = ['Aucune', 'Rondes', 'CarrÃ©es', 'Aviator', 'Cat-eye', 'Sport', 'VR'];
const HEADWEAR = ['Aucun', 'Casquette', 'Chapeau', 'Bandana', 'Casque', 'Couronne', 'Cornes', 'Ailes'];
const COSTUMES = ['Professionnel', 'Casual', 'Fantasy', 'Sportif', 'Cyberpunk', 'MÃ©diÃ©val'];
const EXPRESSIONS = ['Neutre', 'Joyeux', 'ConcentrÃ©', 'Surpris', 'DÃ©terminÃ©', 'MystÃ©rieux'];

// Composant Slider
const Slider = ({ label, value, onChange, min = 0, max = 100 }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ color: T.text.secondary, fontSize: 12 }}>{label}</span>
      <span style={{ color: T.text.muted, fontSize: 12 }}>{value}%</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: '100%',
        height: 6,
        borderRadius: 3,
        background: `linear-gradient(to right, ${T.accent.gold} ${value}%, ${T.bg.elevated} ${value}%)`,
        cursor: 'pointer',
        appearance: 'none',
      }}
    />
  </div>
);

// Composant Select
const Select = ({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ color: T.text.secondary, fontSize: 12, display: 'block', marginBottom: 4 }}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '8px 12px',
        background: T.bg.elevated,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        color: T.text.primary,
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// Composant ColorPicker
const ColorPicker = ({ label, colors, value, onChange }: {
  label: string;
  colors: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ color: T.text.secondary, fontSize: 12, display: 'block', marginBottom: 8 }}>
      {label}
    </label>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: color.startsWith('#') ? color : undefined,
            border: value === color ? `2px solid ${T.accent.gold}` : `2px solid ${T.border}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            color: T.text.primary,
          }}
        >
          {!color.startsWith('#') && color.slice(0, 2)}
        </button>
      ))}
    </div>
  </div>
);

// Preview Avatar (placeholder - Ã  remplacer par gÃ©nÃ©ration IA)
const AvatarPreview = ({ config }: { config: AvatarConfig }) => {
  const styleEmoji = AVATAR_STYLES.find(s => s.id === config.style)?.icon || 'ðŸ‘¤';
  
  return (
    <div style={{
      width: '100%',
      aspectRatio: '1',
      background: `linear-gradient(135deg, ${T.bg.card} 0%, ${T.bg.elevated} 100%)`,
      borderRadius: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${T.border}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Placeholder - Remplacer par gÃ©nÃ©ration IA */}
      <div style={{
        fontSize: 120,
        filter: `hue-rotate(${config.features.smileIntensity}deg)`,
        transform: `scale(${0.8 + config.features.eyeSize / 500})`,
        transition: 'all 0.3s ease',
      }}>
        {styleEmoji}
      </div>
      
      {/* Info overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
      }}>
        <p style={{ color: T.text.primary, margin: 0, fontWeight: 600, fontSize: 14 }}>
          {AVATAR_STYLES.find(s => s.id === config.style)?.name}
        </p>
        <p style={{ color: T.text.muted, margin: '4px 0 0', fontSize: 12 }}>
          {config.features.expression} â€¢ {config.features.costume}
        </p>
      </div>
      
      {/* Accessoires indicators */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        display: 'flex',
        gap: 4,
      }}>
        {config.features.glasses !== 'Aucune' && <span>ðŸ‘“</span>}
        {config.features.headwear !== 'Aucun' && <span>ðŸŽ©</span>}
        {config.features.jewelry && <span>ðŸ’Ž</span>}
      </div>
    </div>
  );
};

// Composant Principal
export default function AvatarBuilderUpgrade() {
  const [activeStyle, setActiveStyle] = useState<string>('human');
  const [activeTab, setActiveTab] = useState<'style' | 'face' | 'hair' | 'accessories' | 'costume'>('style');
  
  const [features, setFeatures] = useState<AvatarFeatures>({
    smileIntensity: 50,
    eyeSize: 50,
    noseWidth: 50,
    jawShape: 50,
    skinTone: SKIN_TONES[2],
    hairStyle: HAIR_STYLES[0],
    hairColor: HAIR_COLORS[0],
    eyeColor: EYE_COLORS[0],
    glasses: 'Aucune',
    jewelry: null,
    headwear: 'Aucun',
    costume: COSTUMES[0],
    expression: EXPRESSIONS[0],
  });

  const updateFeature = useCallback((key: keyof AvatarFeatures, value: unknown) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  }, []);

  const config: AvatarConfig = useMemo(() => ({
    style: activeStyle,
    features,
  }), [activeStyle, features]);

  const tabs = [
    { id: 'style', label: 'Style', icon: 'ðŸŽ¨' },
    { id: 'face', label: 'Visage', icon: 'ðŸ˜Š' },
    { id: 'hair', label: 'Cheveux', icon: 'ðŸ’‡' },
    { id: 'accessories', label: 'Accessoires', icon: 'ðŸ‘“' },
    { id: 'costume', label: 'Costume', icon: 'ðŸ‘”' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg.main,
      color: T.text.primary,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 32px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            ðŸŽ­ Avatar Studio
          </h1>
          <p style={{ margin: '4px 0 0', color: T.text.muted, fontSize: 14 }}>
            CrÃ©ez votre identitÃ© visuelle unique
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 20px',
            background: T.bg.card,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            color: T.text.primary,
            cursor: 'pointer',
            fontSize: 14,
          }}>
            ðŸ”„ GÃ©nÃ©rer IA
          </button>
          <button style={{
            padding: '10px 20px',
            background: T.accent.gold,
            border: 'none',
            borderRadius: 10,
            color: '#000',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
          }}>
            ðŸ’¾ Sauvegarder
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: 'calc(100vh - 80px)' }}>
        {/* Left: Preview */}
        <div style={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 400, width: '100%' }}>
            <AvatarPreview config={config} />
            
            {/* Style switcher rapide */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 20,
            }}>
              {AVATAR_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  title={style.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: activeStyle === style.id ? T.accent.gold : T.bg.card,
                    border: `2px solid ${activeStyle === style.id ? T.accent.gold : T.border}`,
                    cursor: 'pointer',
                    fontSize: 24,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {style.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div style={{
          background: T.bg.card,
          borderLeft: `1px solid ${T.border}`,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${T.border}`,
            overflowX: 'auto',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  padding: '14px 12px',
                  background: activeTab === tab.id ? T.bg.elevated : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? `2px solid ${T.accent.gold}` : '2px solid transparent',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? T.text.primary : T.text.muted,
                  fontSize: 12,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ marginRight: 4 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            {activeTab === 'style' && (
              <div>
                <h3 style={{ color: T.text.primary, margin: '0 0 16px', fontSize: 16 }}>
                  Choisir un style
                </h3>
                {AVATAR_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setActiveStyle(style.id)}
                    style={{
                      width: '100%',
                      padding: 16,
                      marginBottom: 8,
                      background: activeStyle === style.id ? T.accent.gold + '20' : T.bg.elevated,
                      border: `2px solid ${activeStyle === style.id ? T.accent.gold : T.border}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 32 }}>{style.icon}</span>
                    <div>
                      <p style={{ color: T.text.primary, margin: 0, fontWeight: 600 }}>{style.name}</p>
                      <p style={{ color: T.text.muted, margin: '4px 0 0', fontSize: 12 }}>{style.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'face' && (
              <div>
                <h3 style={{ color: T.text.primary, margin: '0 0 16px', fontSize: 16 }}>
                  Morphing Facial
                </h3>
                <Slider
                  label="IntensitÃ© du sourire"
                  value={features.smileIntensity}
                  onChange={(v) => updateFeature('smileIntensity', v)}
                />
                <Slider
                  label="Taille des yeux"
                  value={features.eyeSize}
                  onChange={(v) => updateFeature('eyeSize', v)}
                />
                <Slider
                  label="Largeur du nez"
                  value={features.noseWidth}
                  onChange={(v) => updateFeature('noseWidth', v)}
                />
                <Slider
                  label="Forme de la mÃ¢choire"
                  value={features.jawShape}
                  onChange={(v) => updateFeature('jawShape', v)}
                />
                
                <ColorPicker
                  label="Teint de peau"
                  colors={SKIN_TONES}
                  value={features.skinTone}
                  onChange={(v) => updateFeature('skinTone', v)}
                />
                
                <Select
                  label="Couleur des yeux"
                  value={features.eyeColor}
                  options={EYE_COLORS}
                  onChange={(v) => updateFeature('eyeColor', v)}
                />
                
                <Select
                  label="Expression"
                  value={features.expression}
                  options={EXPRESSIONS}
                  onChange={(v) => updateFeature('expression', v)}
                />
              </div>
            )}

            {activeTab === 'hair' && (
              <div>
                <h3 style={{ color: T.text.primary, margin: '0 0 16px', fontSize: 16 }}>
                  Coiffure
                </h3>
                <Select
                  label="Style de coiffure"
                  value={features.hairStyle}
                  options={HAIR_STYLES}
                  onChange={(v) => updateFeature('hairStyle', v)}
                />
                <Select
                  label="Couleur des cheveux"
                  value={features.hairColor}
                  options={HAIR_COLORS}
                  onChange={(v) => updateFeature('hairColor', v)}
                />
              </div>
            )}

            {activeTab === 'accessories' && (
              <div>
                <h3 style={{ color: T.text.primary, margin: '0 0 16px', fontSize: 16 }}>
                  Accessoires
                </h3>
                <Select
                  label="Lunettes"
                  value={features.glasses || 'Aucune'}
                  options={GLASSES}
                  onChange={(v) => updateFeature('glasses', v)}
                />
                <Select
                  label="Couvre-chef"
                  value={features.headwear || 'Aucun'}
                  options={HEADWEAR}
                  onChange={(v) => updateFeature('headwear', v)}
                />
              </div>
            )}

            {activeTab === 'costume' && (
              <div>
                <h3 style={{ color: T.text.primary, margin: '0 0 16px', fontSize: 16 }}>
                  Costume
                </h3>
                <Select
                  label="Style vestimentaire"
                  value={features.costume}
                  options={COSTUMES}
                  onChange={(v) => updateFeature('costume', v)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Exports pour les autres composants
export { AVATAR_STYLES, AvatarPreview };
export type { AvatarStyle, AvatarFeatures, AvatarConfig };
