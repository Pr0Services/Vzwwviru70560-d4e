// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — DEMO LAUNCHER
// Page de lancement pour Demo Mode et Investor Mode
// DELTA APRÈS v38.2
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type DemoMode = 'demo' | 'investor';

interface DemoLauncherProps {
  onStart: (mode: DemoMode) => void;
  onSkip?: () => void;
}

// ═══════════════════════════════════════════════════════════════
// DEMO MODES CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const DEMO_MODES = {
  demo: {
    id: 'demo' as const,
    title: 'Demo Mode',
    titleFr: 'Mode Démo',
    description: 'Explore CHE·NU with guided tour',
    descriptionFr: 'Explorez CHE·NU avec une visite guidée',
    duration: '5-10 min',
    icon: '🧪',
    color: '#3EB4A2',
    scenes: 7,
  },
  investor: {
    id: 'investor' as const,
    title: 'Investor Mode',
    titleFr: 'Mode Investisseur',
    description: 'Complete pitch with slides and narration',
    descriptionFr: 'Pitch complet avec slides et narration',
    duration: '8-12 min',
    icon: '🎯',
    color: '#D8B26A',
    scenes: 11,
  },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function DemoLauncher({ onStart, onSkip }: DemoLauncherProps) {
  const [selectedMode, setSelectedMode] = useState<DemoMode | null>(null);
  const [lang, setLang] = useState<'en' | 'fr'>('fr');

  const handleStart = () => {
    if (selectedMode) {
      onStart(selectedMode);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1F22] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1 }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#D8B26A] to-[#8D8371] flex items-center justify-center shadow-[0_0_40px_rgba(216,178,106,0.3)]">
          <span className="text-4xl font-bold text-white">C·N</span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-[#E9E4D6] mb-2"
      >
        CHE·NU™
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-[#8D8371] mb-8"
      >
        Governed Intelligence Operating System
      </motion.p>

      {/* Language Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2 mb-8"
      >
        {(['fr', 'en'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              lang === l
                ? 'bg-[#D8B26A] text-[#1E1F22]'
                : 'bg-[#2A2B2F] text-[#8D8371] hover:bg-[#3A3B3F]'
            }`}
          >
            {l === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
          </button>
        ))}
      </motion.div>

      {/* Mode Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 mb-8"
      >
        {Object.values(DEMO_MODES).map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`p-6 rounded-xl border-2 transition-all min-w-[200px] ${
              selectedMode === mode.id
                ? 'border-[#D8B26A] bg-[#D8B26A]/10'
                : 'border-[#3A3B3F] bg-[#2A2B2F] hover:border-[#8D8371]'
            }`}
          >
            <div className="text-4xl mb-3">{mode.icon}</div>
            <div className="text-lg font-semibold text-[#E9E4D6] mb-1">
              {lang === 'fr' ? mode.titleFr : mode.title}
            </div>
            <div className="text-sm text-[#8D8371] mb-3">
              {lang === 'fr' ? mode.descriptionFr : mode.description}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-[#8D8371]">
              <span>⏱️ {mode.duration}</span>
              <span>📊 {mode.scenes} {lang === 'fr' ? 'scènes' : 'scenes'}</span>
            </div>
          </button>
        ))}
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4"
      >
        <button
          onClick={handleStart}
          disabled={!selectedMode}
          className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
            selectedMode
              ? 'bg-gradient-to-r from-[#D8B26A] to-[#B8965A] text-[#1E1F22] hover:shadow-[0_0_30px_rgba(216,178,106,0.4)]'
              : 'bg-[#3A3B3F] text-[#8D8371] cursor-not-allowed'
          }`}
        >
          {lang === 'fr' ? 'Démarrer' : 'Start'} →
        </button>

        {onSkip && (
          <button
            onClick={onSkip}
            className="px-8 py-4 rounded-xl border border-[#3A3B3F] text-[#8D8371] hover:border-[#8D8371] hover:text-[#E9E4D6] transition-all"
          >
            {lang === 'fr' ? 'Passer' : 'Skip'}
          </button>
        )}
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 text-center text-xs text-[#8D8371]"
      >
        <div className="mb-2">
          {lang === 'fr' 
            ? 'Nova vous guidera à travers la démonstration'
            : 'Nova will guide you through the demonstration'
          }
        </div>
        <div className="flex items-center justify-center gap-4">
          <span>🔐 {lang === 'fr' ? 'Gouverné' : 'Governed'}</span>
          <span>🛡️ {lang === 'fr' ? 'Non-Autonome' : 'Non-Autonomous'}</span>
          <span>✨ {lang === 'fr' ? 'Représentationnel' : 'Representational'}</span>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT TYPES
// ═══════════════════════════════════════════════════════════════

export type { DemoMode, DemoLauncherProps };
