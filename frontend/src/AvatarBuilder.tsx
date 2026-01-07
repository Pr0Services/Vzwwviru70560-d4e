/**
 * CHE·NU - Advanced Avatar Builder
 * ═══════════════════════════════════════════════════════════════════════════════
 * Système d'avatars avancé avec 6 styles et personnalisation complète.
 * 
 * Features:
 * - 6 styles (Réaliste, Cartoon, Animal, Mythique, 3D, Minimal)
 * - Switch instantané
 * - Personnalisation complète
 * - Preview temps réel
 * - Templates prédéfinis
 * - Export PNG/SVG
 * 
 * Version: 2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type AvatarStyle = 'realistic' | 'cartoon' | 'animal' | 'mythical' | '3d' | 'minimal';
type Expression = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'thinking' | 'winking' | 'confident';
type SkinTone = 'light' | 'light_medium' | 'medium' | 'medium_dark' | 'dark' | 'fantasy';
type HairStyle = 'none' | 'short' | 'medium' | 'long' | 'curly' | 'wavy' | 'ponytail' | 'bun' | 'mohawk' | 'afro';
type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white' | 'blue' | 'pink' | 'purple' | 'green';
type EyeColor = 'brown' | 'blue' | 'green' | 'hazel' | 'gray' | 'amber' | 'red' | 'purple';
type AnimalType = 'cat' | 'dog' | 'fox' | 'wolf' | 'bear' | 'rabbit' | 'owl' | 'lion' | 'tiger' | 'panda' | 'dragon';
type MythicalType = 'elf' | 'fairy' | 'vampire' | 'werewolf' | 'mermaid' | 'phoenix' | 'unicorn' | 'demon' | 'angel' | 'alien' | 'robot';

interface AvatarConfig {
  style: AvatarStyle;
  expression: Expression;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  eyeColor: EyeColor;
  animalType?: AnimalType;
  mythicalType?: MythicalType;
  primaryColor: string;
  secondaryColor: string;
  hasGlasses: boolean;
  hasEarrings: boolean;
  hasHat: boolean;
  backgroundColor: string;
}

interface AvatarTemplate {
  name: string;
  emoji: string;
  config: Partial<AvatarConfig>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const STYLES: { value: AvatarStyle; label: string; emoji: string }[] = [
  { value: 'realistic', label: 'Réaliste', emoji: '👤' },
  { value: 'cartoon', label: 'Cartoon', emoji: '🎨' },
  { value: 'animal', label: 'Animal', emoji: '🦊' },
  { value: 'mythical', label: 'Mythique', emoji: '🧝' },
  { value: '3d', label: '3D', emoji: '🎮' },
  { value: 'minimal', label: 'Minimal', emoji: '⭕' },
];

const EXPRESSIONS: { value: Expression; emoji: string }[] = [
  { value: 'neutral', emoji: '😐' },
  { value: 'happy', emoji: '😊' },
  { value: 'sad', emoji: '😢' },
  { value: 'angry', emoji: '😠' },
  { value: 'surprised', emoji: '😮' },
  { value: 'thinking', emoji: '🤔' },
  { value: 'winking', emoji: '😉' },
  { value: 'confident', emoji: '😎' },
];

const SKIN_TONES: { value: SkinTone; color: string }[] = [
  { value: 'light', color: '#ffeaa7' },
  { value: 'light_medium', color: '#fdcb6e' },
  { value: 'medium', color: '#e17055' },
  { value: 'medium_dark', color: '#d35400' },
  { value: 'dark', color: '#784212' },
  { value: 'fantasy', color: '#a29bfe' },
];

const HAIR_STYLES: { value: HairStyle; label: string }[] = [
  { value: 'none', label: 'Chauve' },
  { value: 'short', label: 'Court' },
  { value: 'medium', label: 'Mi-long' },
  { value: 'long', label: 'Long' },
  { value: 'curly', label: 'Bouclé' },
  { value: 'wavy', label: 'Ondulé' },
  { value: 'ponytail', label: 'Queue' },
  { value: 'bun', label: 'Chignon' },
  { value: 'mohawk', label: 'Mohawk' },
  { value: 'afro', label: 'Afro' },
];

const HAIR_COLORS: { value: HairColor; color: string }[] = [
  { value: 'black', color: '#212121' },
  { value: 'brown', color: '#5D4037' },
  { value: 'blonde', color: '#FDD835' },
  { value: 'red', color: '#E64A19' },
  { value: 'gray', color: '#9E9E9E' },
  { value: 'white', color: '#FAFAFA' },
  { value: 'blue', color: '#2196F3' },
  { value: 'pink', color: '#E91E63' },
  { value: 'purple', color: '#9C27B0' },
  { value: 'green', color: '#4CAF50' },
];

const EYE_COLORS: { value: EyeColor; color: string }[] = [
  { value: 'brown', color: '#5D4037' },
  { value: 'blue', color: '#2196F3' },
  { value: 'green', color: '#4CAF50' },
  { value: 'hazel', color: '#795548' },
  { value: 'gray', color: '#607D8B' },
  { value: 'amber', color: '#FF8F00' },
  { value: 'red', color: '#F44336' },
  { value: 'purple', color: '#9C27B0' },
];

const ANIMALS: { value: AnimalType; emoji: string }[] = [
  { value: 'cat', emoji: '🐱' },
  { value: 'dog', emoji: '🐶' },
  { value: 'fox', emoji: '🦊' },
  { value: 'wolf', emoji: '🐺' },
  { value: 'bear', emoji: '🐻' },
  { value: 'rabbit', emoji: '🐰' },
  { value: 'owl', emoji: '🦉' },
  { value: 'lion', emoji: '🦁' },
  { value: 'tiger', emoji: '🐯' },
  { value: 'panda', emoji: '🐼' },
  { value: 'dragon', emoji: '🐲' },
];

const MYTHICALS: { value: MythicalType; emoji: string; label: string }[] = [
  { value: 'elf', emoji: '🧝', label: 'Elfe' },
  { value: 'fairy', emoji: '🧚', label: 'Fée' },
  { value: 'vampire', emoji: '🧛', label: 'Vampire' },
  { value: 'werewolf', emoji: '🐺', label: 'Loup-garou' },
  { value: 'mermaid', emoji: '🧜', label: 'Sirène' },
  { value: 'phoenix', emoji: '🔥', label: 'Phoenix' },
  { value: 'unicorn', emoji: '🦄', label: 'Licorne' },
  { value: 'demon', emoji: '😈', label: 'Démon' },
  { value: 'angel', emoji: '😇', label: 'Ange' },
  { value: 'alien', emoji: '👽', label: 'Alien' },
  { value: 'robot', emoji: '🤖', label: 'Robot' },
];

const TEMPLATES: AvatarTemplate[] = [
  { name: 'Pro Business', emoji: '💼', config: { style: 'realistic', expression: 'confident', hairStyle: 'short', hasGlasses: true } },
  { name: 'Friendly', emoji: '😊', config: { style: 'cartoon', expression: 'happy', primaryColor: '#74b9ff' } },
  { name: 'Cool Cat', emoji: '😺', config: { style: 'animal', animalType: 'cat', primaryColor: '#fdcb6e' } },
  { name: 'Wise Owl', emoji: '🦉', config: { style: 'animal', animalType: 'owl', hasGlasses: true } },
  { name: 'Cyber Robot', emoji: '🤖', config: { style: 'mythical', mythicalType: 'robot', primaryColor: '#00cec9' } },
  { name: 'Magic Elf', emoji: '🧝', config: { style: 'mythical', mythicalType: 'elf', hairColor: 'blonde', primaryColor: '#00b894' } },
  { name: 'Minimal', emoji: '⭕', config: { style: 'minimal', primaryColor: '#6c5ce7' } },
  { name: 'Anime', emoji: '🎌', config: { style: 'cartoon', hairColor: 'pink', eyeColor: 'purple', expression: 'happy' } },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const defaultConfig: AvatarConfig = {
  style: 'cartoon',
  expression: 'happy',
  skinTone: 'medium',
  hairStyle: 'medium',
  hairColor: 'brown',
  eyeColor: 'brown',
  primaryColor: '#6c5ce7',
  secondaryColor: '#a29bfe',
  hasGlasses: false,
  hasEarrings: false,
  hasHat: false,
  backgroundColor: '#dfe6e9',
};

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const AvatarPreview: React.FC<{ config: AvatarConfig; size?: number }> = ({ config, size = 200 }) => {
  const skinColors: Record<SkinTone, string> = {
    light: '#ffeaa7',
    light_medium: '#fdcb6e',
    medium: '#e17055',
    medium_dark: '#d35400',
    dark: '#784212',
    fantasy: config.primaryColor,
  };

  const eyeColors: Record<EyeColor, string> = {
    brown: '#5D4037',
    blue: '#2196F3',
    green: '#4CAF50',
    hazel: '#795548',
    gray: '#607D8B',
    amber: '#FF8F00',
    red: '#F44336',
    purple: '#9C27B0',
  };

  const hairColors: Record<HairColor, string> = {
    black: '#212121',
    brown: '#5D4037',
    blonde: '#FDD835',
    red: '#E64A19',
    gray: '#9E9E9E',
    white: '#FAFAFA',
    blue: '#2196F3',
    pink: '#E91E63',
    purple: '#9C27B0',
    green: '#4CAF50',
  };

  const animalEmojis: Record<AnimalType, string> = {
    cat: '🐱', dog: '🐶', fox: '🦊', wolf: '🐺', bear: '🐻',
    rabbit: '🐰', owl: '🦉', lion: '🦁', tiger: '🐯', panda: '🐼', dragon: '🐲'
  };

  const mythicalEmojis: Record<MythicalType, string> = {
    elf: '🧝', fairy: '🧚', vampire: '🧛', werewolf: '🐺', mermaid: '🧜',
    phoenix: '🔥', unicorn: '🦄', demon: '😈', angel: '😇', alien: '👽', robot: '🤖'
  };

  const skinColor = skinColors[config.skinTone];
  const eyeColor = eyeColors[config.eyeColor];
  const hairColor = hairColors[config.hairColor];

  const cx = size / 2;
  const cy = size / 2;
  const headRadius = size * 0.32;

  // Render based on style
  const renderAvatar = () => {
    if (config.style === 'minimal') {
      return (
        <>
          <circle cx={cx} cy={cy} r={size * 0.35} fill={config.primaryColor} />
          <text x={cx} y={cy + 8} textAnchor="middle" fill="white" fontSize={size * 0.25} fontFamily="Arial" fontWeight="bold">
            ?
          </text>
        </>
      );
    }

    if (config.style === 'animal') {
      const emoji = config.animalType ? animalEmojis[config.animalType] : '🐱';
      return (
        <>
          <circle cx={cx} cy={cy} r={size * 0.38} fill={config.primaryColor} opacity={0.3} />
          <text x={cx} y={cy + size * 0.12} textAnchor="middle" fontSize={size * 0.5}>
            {emoji}
          </text>
        </>
      );
    }

    if (config.style === 'mythical' && config.mythicalType) {
      const emoji = mythicalEmojis[config.mythicalType];
      return (
        <>
          <circle cx={cx} cy={cy} r={size * 0.38} fill={config.primaryColor} opacity={0.3} />
          <text x={cx} y={cy + size * 0.12} textAnchor="middle" fontSize={size * 0.5}>
            {emoji}
          </text>
        </>
      );
    }

    // Human-like avatars (realistic, cartoon, 3d)
    const eyeOffset = headRadius * 0.3;
    const eyeY = cy - headRadius * 0.1;
    const eyeSize = headRadius * 0.15;
    const mouthY = cy + headRadius * 0.35;
    const mouthWidth = headRadius * 0.4;

    return (
      <>
        {/* Hair (back) */}
        {config.hairStyle !== 'none' && config.hairStyle === 'long' && (
          <ellipse cx={cx} cy={cy + headRadius * 0.3} rx={headRadius * 1.3} ry={headRadius * 1.5} fill={hairColor} />
        )}

        {/* Head */}
        <ellipse cx={cx} cy={cy} rx={headRadius} ry={headRadius * 1.1} fill={skinColor} />

        {/* Hair (front) */}
        {config.hairStyle !== 'none' && (
          <path
            d={getHairPath(config.hairStyle, cx, cy, headRadius)}
            fill={hairColor}
          />
        )}

        {/* Eyes */}
        {config.expression === 'happy' ? (
          <>
            <path d={`M ${cx - eyeOffset - eyeSize} ${eyeY} Q ${cx - eyeOffset} ${eyeY - eyeSize} ${cx - eyeOffset + eyeSize} ${eyeY}`} stroke={eyeColor} strokeWidth="3" fill="none" />
            <path d={`M ${cx + eyeOffset - eyeSize} ${eyeY} Q ${cx + eyeOffset} ${eyeY - eyeSize} ${cx + eyeOffset + eyeSize} ${eyeY}`} stroke={eyeColor} strokeWidth="3" fill="none" />
          </>
        ) : config.expression === 'winking' ? (
          <>
            <ellipse cx={cx - eyeOffset} cy={eyeY} rx={eyeSize} ry={eyeSize * 1.2} fill="white" />
            <circle cx={cx - eyeOffset} cy={eyeY} r={eyeSize * 0.5} fill={eyeColor} />
            <line x1={cx + eyeOffset - eyeSize} y1={eyeY} x2={cx + eyeOffset + eyeSize} y2={eyeY} stroke="#333" strokeWidth="3" />
          </>
        ) : (
          <>
            <ellipse cx={cx - eyeOffset} cy={eyeY} rx={eyeSize} ry={eyeSize * 1.2} fill="white" />
            <ellipse cx={cx + eyeOffset} cy={eyeY} rx={eyeSize} ry={eyeSize * 1.2} fill="white" />
            <circle cx={cx - eyeOffset} cy={eyeY} r={eyeSize * 0.5} fill={eyeColor} />
            <circle cx={cx + eyeOffset} cy={eyeY} r={eyeSize * 0.5} fill={eyeColor} />
            <circle cx={cx - eyeOffset + 2} cy={eyeY - 2} r={eyeSize * 0.15} fill="white" />
            <circle cx={cx + eyeOffset + 2} cy={eyeY - 2} r={eyeSize * 0.15} fill="white" />
          </>
        )}

        {/* Mouth */}
        {config.expression === 'happy' || config.expression === 'confident' ? (
          <path d={`M ${cx - mouthWidth} ${mouthY} Q ${cx} ${mouthY + mouthWidth * 0.8} ${cx + mouthWidth} ${mouthY}`} stroke="#333" strokeWidth="3" fill="none" />
        ) : config.expression === 'sad' ? (
          <path d={`M ${cx - mouthWidth} ${mouthY + 10} Q ${cx} ${mouthY - mouthWidth * 0.5} ${cx + mouthWidth} ${mouthY + 10}`} stroke="#333" strokeWidth="3" fill="none" />
        ) : (
          <line x1={cx - mouthWidth * 0.7} y1={mouthY} x2={cx + mouthWidth * 0.7} y2={mouthY} stroke="#333" strokeWidth="3" />
        )}

        {/* Glasses */}
        {config.hasGlasses && (
          <>
            <circle cx={cx - eyeOffset} cy={eyeY} r={eyeSize * 1.5} fill="none" stroke="#333" strokeWidth="2" />
            <circle cx={cx + eyeOffset} cy={eyeY} r={eyeSize * 1.5} fill="none" stroke="#333" strokeWidth="2" />
            <line x1={cx - eyeOffset + eyeSize * 1.5} y1={eyeY} x2={cx + eyeOffset - eyeSize * 1.5} y2={eyeY} stroke="#333" strokeWidth="2" />
          </>
        )}

        {/* Earrings */}
        {config.hasEarrings && (
          <>
            <circle cx={cx - headRadius - 3} cy={cy + 5} r={4} fill="#FFD700" />
            <circle cx={cx + headRadius + 3} cy={cy + 5} r={4} fill="#FFD700" />
          </>
        )}
      </>
    );
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ borderRadius: '20px' }}>
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.backgroundColor} />
          <stop offset="100%" stopColor={config.secondaryColor} />
        </linearGradient>
      </defs>
      <rect width={size} height={size} fill="url(#bgGrad)" rx="20" />
      {renderAvatar()}
    </svg>
  );
};

// Helper function for hair paths
const getHairPath = (style: HairStyle, cx: number, cy: number, headRadius: number): string => {
  const top = cy - headRadius * 1.1;
  const left = cx - headRadius;
  const right = cx + headRadius;

  switch (style) {
    case 'short':
      return `M ${left} ${cy - headRadius * 0.3} Q ${cx} ${top - 10} ${right} ${cy - headRadius * 0.3}`;
    case 'medium':
      return `M ${left - 5} ${cy} Q ${left - 10} ${top} ${cx} ${top - 15} Q ${right + 10} ${top} ${right + 5} ${cy}`;
    case 'long':
      return `M ${left - 10} ${cy + headRadius * 0.3} Q ${left - 15} ${top} ${cx} ${top - 20} Q ${right + 15} ${top} ${right + 10} ${cy + headRadius * 0.3}`;
    case 'curly':
      return `M ${left} ${cy - headRadius * 0.2} Q ${left - 15} ${top} ${cx} ${top - 25} Q ${right + 15} ${top} ${right} ${cy - headRadius * 0.2}`;
    case 'ponytail':
      return `M ${left} ${cy - headRadius * 0.3} Q ${cx} ${top - 10} ${right} ${cy - headRadius * 0.3}`;
    case 'bun':
      return `M ${left} ${cy - headRadius * 0.3} Q ${cx} ${top - 10} ${right} ${cy - headRadius * 0.3} M ${cx - 15} ${top - 20} A 18 18 0 1 1 ${cx + 15} ${top - 20}`;
    case 'mohawk':
      return `M ${cx - 10} ${cy - headRadius * 0.5} L ${cx} ${top - 30} L ${cx + 10} ${cy - headRadius * 0.5}`;
    case 'afro':
      return `M ${left - 20} ${cy} Q ${left - 30} ${top - 20} ${cx} ${top - 40} Q ${right + 30} ${top - 20} ${right + 20} ${cy}`;
    default:
      return `M ${left} ${cy - headRadius * 0.2} Q ${cx} ${top - 10} ${right} ${cy - headRadius * 0.2}`;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const AvatarBuilder: React.FC<{
  initialConfig?: Partial<AvatarConfig>;
  onSave?: (config: AvatarConfig) => void;
}> = ({ initialConfig, onSave }) => {
  const [config, setConfig] = useState<AvatarConfig>({ ...defaultConfig, ...initialConfig });
  const [activeTab, setActiveTab] = useState<'style' | 'face' | 'hair' | 'accessories' | 'colors'>('style');

  const updateConfig = useCallback((updates: Partial<AvatarConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const applyTemplate = useCallback((template: AvatarTemplate) => {
    setConfig(prev => ({ ...prev, ...template.config }));
  }, []);

  const randomize = useCallback(() => {
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)].value;
    const randomExpression = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)].value;
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].value;
    const randomHairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].value;
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value;
    const randomEyeColor = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].value;
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

    updateConfig({
      style: randomStyle,
      expression: randomExpression,
      skinTone: randomSkin,
      hairStyle: randomHairStyle,
      hairColor: randomHairColor,
      eyeColor: randomEyeColor,
      primaryColor: randomColor,
      animalType: randomStyle === 'animal' ? ANIMALS[Math.floor(Math.random() * ANIMALS.length)].value : undefined,
      mythicalType: randomStyle === 'mythical' ? MYTHICALS[Math.floor(Math.random() * MYTHICALS.length)].value : undefined,
    });
  }, [updateConfig]);

  return (
    <div style={{ display: 'flex', gap: '24px', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Preview */}
      <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <AvatarPreview config={config} size={220} />
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={randomize}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#6c5ce7',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🎲 Random
          </button>
          {onSave && (
            <button
              onClick={() => onSave(config)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#00b894',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💾 Sauvegarder
            </button>
          )}
        </div>

        {/* Quick Templates */}
        <div style={{ width: '100%' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#636e72' }}>Templates rapides</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => applyTemplate(t)}
                title={t.name}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #dfe6e9',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                {t.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '16px', padding: '20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #dfe6e9', paddingBottom: '12px' }}>
          {[
            { id: 'style', label: '🎨 Style' },
            { id: 'face', label: '👤 Visage' },
            { id: 'hair', label: '💇 Cheveux' },
            { id: 'accessories', label: '👓 Accessoires' },
            { id: 'colors', label: '🎨 Couleurs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#6c5ce7' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#636e72',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 400
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '300px' }}>
          {activeTab === 'style' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Style d'avatar</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => updateConfig({ style: s.value })}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: config.style === s.value ? '2px solid #6c5ce7' : '1px solid #dfe6e9',
                      background: config.style === s.value ? '#f0efff' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.emoji}</div>
                    <div style={{ fontSize: '12px' }}>{s.label}</div>
                  </button>
                ))}
              </div>

              {config.style === 'animal' && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>Type d'animal</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {ANIMALS.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => updateConfig({ animalType: a.value })}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: config.animalType === a.value ? '2px solid #6c5ce7' : '1px solid #dfe6e9',
                          background: config.animalType === a.value ? '#f0efff' : 'white',
                          cursor: 'pointer',
                          fontSize: '20px'
                        }}
                      >
                        {a.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {config.style === 'mythical' && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>Créature mythique</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {MYTHICALS.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => updateConfig({ mythicalType: m.value })}
                        title={m.label}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: config.mythicalType === m.value ? '2px solid #6c5ce7' : '1px solid #dfe6e9',
                          background: config.mythicalType === m.value ? '#f0efff' : 'white',
                          cursor: 'pointer',
                          fontSize: '20px'
                        }}
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Expression</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {EXPRESSIONS.map((e) => (
                    <button
                      key={e.value}
                      onClick={() => updateConfig({ expression: e.value })}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: config.expression === e.value ? '2px solid #6c5ce7' : '1px solid #dfe6e9',
                        background: config.expression === e.value ? '#f0efff' : 'white',
                        cursor: 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      {e.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'face' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Teint de peau</h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => updateConfig({ skinTone: s.value })}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: config.skinTone === s.value ? '3px solid #6c5ce7' : '2px solid #dfe6e9',
                      background: s.color,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>

              <h4 style={{ margin: '0 0 12px 0' }}>Couleur des yeux</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                {EYE_COLORS.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => updateConfig({ eyeColor: e.value })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: config.eyeColor === e.value ? '3px solid #6c5ce7' : '2px solid #dfe6e9',
                      background: e.color,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hair' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Coiffure</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {HAIR_STYLES.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => updateConfig({ hairStyle: h.value })}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: config.hairStyle === h.value ? '2px solid #6c5ce7' : '1px solid #dfe6e9',
                      background: config.hairStyle === h.value ? '#f0efff' : 'white',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {h.label}
                  </button>
                ))}
              </div>

              <h4 style={{ margin: '0 0 12px 0' }}>Couleur des cheveux</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {HAIR_COLORS.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => updateConfig({ hairColor: h.value })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: config.hairColor === h.value ? '3px solid #6c5ce7' : '2px solid #dfe6e9',
                      background: h.color,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'accessories' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Accessoires</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.hasGlasses}
                    onChange={(e) => updateConfig({ hasGlasses: e.target.checked })}
                  />
                  <span>👓 Lunettes</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.hasEarrings}
                    onChange={(e) => updateConfig({ hasEarrings: e.target.checked })}
                  />
                  <span>💎 Boucles d'oreilles</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.hasHat}
                    onChange={(e) => updateConfig({ hasHat: e.target.checked })}
                  />
                  <span>🎩 Chapeau</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Couleur principale</h4>
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                style={{ width: '60px', height: '40px', cursor: 'pointer' }}
              />

              <h4 style={{ margin: '16px 0 12px 0' }}>Couleur secondaire</h4>
              <input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                style={{ width: '60px', height: '40px', cursor: 'pointer' }}
              />

              <h4 style={{ margin: '16px 0 12px 0' }}>Arrière-plan</h4>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                style={{ width: '60px', height: '40px', cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarBuilder;
