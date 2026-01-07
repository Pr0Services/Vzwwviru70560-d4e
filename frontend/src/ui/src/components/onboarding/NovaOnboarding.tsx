/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — Nova Onboarding Flow
 * Governed Intelligence Operating System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Nova guides new users through CHE·NU introduction.
 * Nova CANNOT execute — only explain, guide, and clarify.
 * 
 * UPDATED: 8 SPHERES (FROZEN) - IA Labs & Skills & Tools are in My Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface OnboardingStep {
  id: string;
  title: string;
  titleFr: string;
  novaMessage: string;
  novaMessageFr: string;
  component: React.ComponentType<StepProps>;
  canSkip: boolean;
}

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  lang: 'en' | 'fr';
}

interface UserPreferences {
  name: string;
  language: 'en' | 'fr';
  selectedSpheres: string[];
  primarySphere: string;
  xrEnabled: boolean;
  agreed: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants — 8 Sphères Officielles (FROZEN)
// ─────────────────────────────────────────────────────────────────────────────

const SPHERES = [
  { 
    id: 'personal', 
    name: 'Personal', 
    nameFr: 'Personnel', 
    emoji: '🏠', 
    color: '#3EB4A2', 
    description: 'Personal life, health, family, home', 
    descriptionFr: 'Vie personnelle, santé, famille, maison' 
  },
  { 
    id: 'business', 
    name: 'Business', 
    nameFr: 'Entreprise', 
    emoji: '💼', 
    color: '#D8B26A', 
    description: 'Professional operations, projects, clients', 
    descriptionFr: 'Opérations professionnelles, projets, clients' 
  },
  { 
    id: 'government', 
    name: 'Government & Institutions', 
    nameFr: 'Gouvernement & Institutions', 
    emoji: '🏛️', 
    color: '#8D8371', 
    description: 'Administrative, legal, governmental', 
    descriptionFr: 'Administratif, légal, gouvernemental' 
  },
  { 
    id: 'design_studio', 
    name: 'Creative Studio', 
    nameFr: 'Studio de Création', 
    emoji: '🎨', 
    color: '#7A593A', 
    description: 'Design, writing, music, video', 
    descriptionFr: 'Design, écriture, musique, vidéo' 
  },
  { 
    id: 'community', 
    name: 'Community', 
    nameFr: 'Communauté', 
    emoji: '👥', 
    color: '#3F7249', 
    description: 'Forums, groups, community, events', 
    descriptionFr: 'Forums, groupes, communauté, événements' 
  },
  { 
    id: 'social', 
    name: 'Social & Media', 
    nameFr: 'Social & Média', 
    emoji: '📱', 
    color: '#2F4C39', 
    description: 'Social networks, messaging, relationships', 
    descriptionFr: 'Réseaux sociaux, messagerie, relations' 
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    nameFr: 'Divertissement', 
    emoji: '🎬', 
    color: '#E9E4D6', 
    description: 'Media, streaming, games, leisure', 
    descriptionFr: 'Médias, streaming, jeux, loisirs' 
  },
  { 
    id: 'my_team', 
    name: 'My Team', 
    nameFr: 'Mon Équipe', 
    emoji: '🤝', 
    color: '#1E1F22', 
    description: 'Collaboration, IA Labs, Skills & Tools', 
    descriptionFr: 'Collaboration, IA Labs, Compétences & Outils' 
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Nova Avatar Component
// ─────────────────────────────────────────────────────────────────────────────

const NovaAvatar = ({ size = 64, speaking = false }: { size?: number; speaking?: boolean }) => (
  <motion.div
    className="relative"
    animate={speaking ? { scale: [1, 1.05, 1] } : {}}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #D8B26A 0%, #B8965A 100%)',
        boxShadow: speaking ? '0 0 30px rgba(216, 178, 106, 0.5)' : '0 0 20px rgba(216, 178, 106, 0.3)',
      }}
    >
      <span style={{ fontSize: size * 0.5 }}>✨</span>
    </div>
    {speaking && (
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#D8B26A]"
        animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
    )}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Nova Message Bubble
// ─────────────────────────────────────────────────────────────────────────────

const NovaMessage = ({ message, typing = false }: { message: string; typing?: boolean }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (typing) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < message.length) {
          setDisplayedText(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    } else {
      setDisplayedText(message);
    }
  }, [message, typing]);

  return (
    <div 
      className="bg-[#111113] rounded-2xl p-6 border border-[#D8B26A]/20 max-w-xl"
      style={{ boxShadow: '0 0 20px rgba(216, 178, 106, 0.1)' }}
    >
      <p className="text-[#E9E4D6] text-lg leading-relaxed">
        {displayedText}
        {typing && displayedText.length < message.length && (
          <span className="animate-pulse">▋</span>
        )}
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sphere Selection Grid
// ─────────────────────────────────────────────────────────────────────────────

interface SphereGridProps {
  selectedSpheres: string[];
  onToggle: (id: string) => void;
  lang: 'en' | 'fr';
}

const SphereGrid: React.FC<SphereGridProps> = ({ selectedSpheres, onToggle, lang }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
    {SPHERES.map((sphere) => {
      const isSelected = selectedSpheres.includes(sphere.id);
      return (
        <motion.button
          key={sphere.id}
          onClick={() => onToggle(sphere.id)}
          className={`
            p-4 rounded-xl border-2 transition-all text-left
            ${isSelected 
              ? 'border-[#D8B26A] bg-[#D8B26A]/10' 
              : 'border-[#333] bg-[#111113] hover:border-[#D8B26A]/50'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-3xl">{sphere.emoji}</span>
          <p className="mt-2 font-semibold text-[#E9E4D6]">
            {lang === 'fr' ? sphere.nameFr : sphere.name}
          </p>
          <p className="text-sm text-[#8D8371] mt-1">
            {lang === 'fr' ? sphere.descriptionFr : sphere.description}
          </p>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-2 text-[#D8B26A] text-sm font-medium"
            >
              ✓ Selected
            </motion.div>
          )}
        </motion.button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────

export default function NovaOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: '',
    language: 'en',
    selectedSpheres: ['personal'],
    primarySphere: 'personal',
    xrEnabled: false,
    agreed: false,
  });

  const toggleSphere = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      selectedSpheres: prev.selectedSpheres.includes(id)
        ? prev.selectedSpheres.filter(s => s !== id)
        : [...prev.selectedSpheres, id]
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-8">
      {/* Nova Avatar */}
      <NovaAvatar size={80} speaking={true} />
      
      {/* Welcome Message */}
      <div className="mt-8 text-center">
        <h1 className="text-4xl font-bold text-[#D8B26A] mb-4">
          Welcome to CHE·NU™
        </h1>
        <p className="text-[#8D8371] text-lg">
          Governed Intelligence Operating System
        </p>
      </div>

      {/* Nova Message */}
      <div className="mt-8">
        <NovaMessage 
          message="Hello! I'm Nova, your governance guide. I'll help you set up your CHE·NU experience. Let's start by selecting the spheres that matter to you."
          typing={true}
        />
      </div>

      {/* Sphere Selection */}
      <SphereGrid 
        selectedSpheres={preferences.selectedSpheres}
        onToggle={toggleSphere}
        lang={preferences.language}
      />

      {/* Continue Button */}
      <motion.button
        className="mt-8 px-8 py-3 bg-[#D8B26A] text-black font-semibold rounded-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue →
      </motion.button>

      {/* Info Note */}
      <p className="mt-6 text-sm text-[#8D8371] max-w-md text-center">
        Note: IA Labs & Skills & Tools are included within "My Team" sphere.
        This keeps your workspace organized and focused.
      </p>
    </div>
  );
}

export { NovaAvatar, NovaMessage, SphereGrid, SPHERES };
