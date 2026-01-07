/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — Landing Page
 * Governed Intelligence Operating System
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Sparkles, Zap, Lock, Eye, Users, 
  ArrowRight, Check, Play, ChevronDown,
  Home, Briefcase, Building2, Palette, Wrench,
  Gamepad2, Users2, Smartphone, Bot, UserCircle2
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SPHERES = [
  { id: 'personal', name: 'Personal', nameFr: 'Personnel', emoji: '🏠', color: '#3EB4A2', icon: Home },
  { id: 'business', name: 'Business', nameFr: 'Entreprise', emoji: '💼', color: '#D8B26A', icon: Briefcase },
  { id: 'government', name: 'Government & Institutions', nameFr: 'Gouvernement', emoji: '🏛️', color: '#8D8371', icon: Building2 },
  { id: 'design_studio', name: 'Creative Studio', nameFr: 'Studio', emoji: '🎨', color: '#7A593A', icon: Palette },
  { id: 'community', name: 'Community', nameFr: 'Communauté', emoji: '👥', color: '#3F7249', icon: Users2 },
  { id: 'social', name: 'Social & Media', nameFr: 'Social', emoji: '📱', color: '#2F4C39', icon: Smartphone },
  { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement', emoji: '🎬', color: '#E9E4D6', icon: Gamepad2 },
  { id: 'my_team', name: 'My Team', nameFr: 'Mon Équipe', emoji: '🤝', color: '#5ED8FF', icon: UserCircle2 },
];

const PIPELINE_STAGES = [
  'Intent Capture',
  'Semantic Encoding',
  'Validation',
  'Cost Estimation',
  'Scope Lock',
  'Budget Check',
  'ACM Check',
  'Execution',
  'Result Capture',
  'Audit Trail',
];

const TREE_LAWS = [
  { icon: Shield, name: 'SAFE', desc: 'Système toujours sécurisé' },
  { icon: Lock, name: 'NON-AUTONOMOUS', desc: 'Aucune action sans approbation' },
  { icon: Eye, name: 'REPRESENTATIONAL', desc: 'Structure uniquement' },
  { icon: Shield, name: 'PRIVACY', desc: 'Protection absolue des données' },
  { icon: Eye, name: 'TRANSPARENCY', desc: 'Traçabilité complète' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

const Logo = ({ size = 48 }: { size?: number }) => (
  <div 
    className="flex items-center justify-center rounded-xl"
    style={{ 
      width: size, 
      height: size,
      background: 'linear-gradient(135deg, #D8B26A 0%, #8D8371 100%)',
    }}
  >
    <span className="font-bold text-white" style={{ fontSize: size * 0.4 }}>C·N</span>
  </div>
);

const GlowButton = ({ 
  children, 
  primary = false,
  onClick,
}: { 
  children: React.ReactNode; 
  primary?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
      ${primary 
        ? 'bg-gradient-to-r from-[#D8B26A] to-[#B8965A] text-[#1E1F22] hover:shadow-[0_0_30px_rgba(216,178,106,0.4)]' 
        : 'bg-[#2A2B2F] text-[#E9E4D6] border border-[#3A3B3F] hover:border-[#D8B26A] hover:shadow-[0_0_20px_rgba(216,178,106,0.2)]'
      }
    `}
  >
    {children}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// Sections
// ─────────────────────────────────────────────────────────────────────────────

const HeroSection = () => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % PIPELINE_STAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D8B26A] opacity-5 rounded-full blur-[200px]" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Logo size={64} />
          <h1 className="text-5xl md:text-7xl font-bold text-[#E9E4D6]">
            CHE·NU<span className="text-[#D8B26A]">™</span>
          </h1>
        </div>

        <p className="text-2xl md:text-3xl text-[#8D8371] mb-4">
          Governed Intelligence Operating System
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-[#E9E4D6] mb-8 leading-tight">
          L'IA au service de l'humain,<br />
          <span className="text-[#D8B26A]">gouvernée par l'humain.</span>
        </h2>

        <p className="text-xl text-[#8D8371] mb-12 max-w-3xl mx-auto">
          CHE·NU restaure le contrôle humain sur l'intelligence artificielle à travers
          la clarification d'intention, l'encodage sémantique, la gouvernance et l'orchestration éthique.
        </p>

        {/* Pipeline Animation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {PIPELINE_STAGES.map((stage, i) => (
            <div
              key={stage}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${i === activeStage 
                  ? 'bg-[#D8B26A] text-[#1E1F22] scale-110' 
                  : i < activeStage 
                    ? 'bg-[#3F7249] text-white' 
                    : 'bg-[#2A2B2F] text-[#8D8371]'
                }
              `}
            >
              {i + 1}. {stage}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GlowButton primary>
            Commencer <ArrowRight className="inline ml-2 w-5 h-5" />
          </GlowButton>
          <GlowButton>
            <Play className="inline mr-2 w-5 h-5" /> Voir la démo
          </GlowButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-[#D8B26A]" />
      </div>
    </section>
  );
};

const SpheresSection = () => (
  <section className="py-20 px-6" id="spheres">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#E9E4D6] mb-4">
          10 Sphères, Un Univers
        </h2>
        <p className="text-xl text-[#8D8371]">
          Organisez votre vie numérique dans des espaces contextuels intelligents
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {SPHERES.map((sphere) => (
          <div
            key={sphere.id}
            className="relative p-6 rounded-2xl bg-[#2A2B2F] border-2 border-[#3A3B3F] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(216,178,106,0.2)] cursor-pointer"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${sphere.color}20` }}
            >
              <sphere.icon className="w-6 h-6" style={{ color: sphere.color }} />
            </div>
            <div className="text-2xl mb-2">{sphere.emoji}</div>
            <h3 className="text-lg font-semibold text-[#E9E4D6]">{sphere.name}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const GovernanceSection = () => (
  <section className="py-20 px-6 bg-[#1A1B1E]" id="governance">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#E9E4D6] mb-4">
          Gouvernance par Design
        </h2>
        <p className="text-xl text-[#8D8371]">
          5 lois fondamentales garantissent le contrôle humain
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {TREE_LAWS.map((law, i) => (
          <div
            key={law.name}
            className="p-6 rounded-2xl bg-[#2A2B2F] border border-[#3A3B3F] text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#D8B26A]/10 flex items-center justify-center mx-auto mb-4">
              <law.icon className="w-8 h-8 text-[#D8B26A]" />
            </div>
            <h3 className="text-lg font-bold text-[#E9E4D6] mb-2">{law.name}</h3>
            <p className="text-sm text-[#8D8371]">{law.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#D8B26A]/10 to-[#3EB4A2]/10 border border-[#D8B26A]/30">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#E9E4D6] mb-4">
              Pipeline d'Exécution Gouverné
            </h3>
            <p className="text-[#8D8371] mb-4">
              Chaque action IA passe par <span className="text-[#D8B26A] font-semibold">10 étapes de validation</span> avant exécution.
              Budget vérifié. Scope verrouillé. Agent compatible. Audit complet.
            </p>
            <ul className="space-y-2">
              {['Estimation des coûts AVANT exécution', 'Verrouillage du scope (SEL/DOC/WS)', 'Vérification de compatibilité agent', 'Trail d\'audit complet'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[#E9E4D6]">
                  <Check className="w-5 h-5 text-[#3F7249]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-4 border-[#D8B26A] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#D8B26A]">10</div>
                  <div className="text-sm text-[#8D8371]">étapes</div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#3F7249] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const NovaSection = () => (
  <section className="py-20 px-6" id="nova">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D8B26A]/10 border border-[#D8B26A]/30 mb-6">
            <Sparkles className="w-5 h-5 text-[#D8B26A]" />
            <span className="text-[#D8B26A] font-semibold">Rencontrez Nova</span>
          </div>
          
          <h2 className="text-4xl font-bold text-[#E9E4D6] mb-6">
            Votre Guide Intelligent
          </h2>
          
          <p className="text-xl text-[#8D8371] mb-6">
            Nova est votre narratrice, guide et assistante personnelle. 
            Elle clarifie vos intentions et vous accompagne dans CHE·NU.
          </p>

          <div className="p-6 rounded-2xl bg-[#2A2B2F] border border-[#3A3B3F] mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D8B26A] to-[#B8965A] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#E9E4D6] italic">
                  "Je suis Nova, votre guide dans l'univers CHE·NU. Je clarifie vos intentions, 
                  explique les concepts et vous accompagne — mais je ne peux <span className="text-[#EF4444] font-semibold">jamais</span> exécuter à votre place."
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#3F7249]/20 border border-[#3F7249]/30">
              <Check className="w-6 h-6 text-[#3F7249] mb-2" />
              <div className="text-[#E9E4D6] font-semibold">Clarifier</div>
              <div className="text-sm text-[#8D8371]">Comprendre vos intentions</div>
            </div>
            <div className="p-4 rounded-xl bg-[#3F7249]/20 border border-[#3F7249]/30">
              <Check className="w-6 h-6 text-[#3F7249] mb-2" />
              <div className="text-[#E9E4D6] font-semibold">Guider</div>
              <div className="text-sm text-[#8D8371]">Accompagner chaque étape</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/30">
              <Lock className="w-6 h-6 text-[#EF4444] mb-2" />
              <div className="text-[#E9E4D6] font-semibold">Pas d'Exécution</div>
              <div className="text-sm text-[#8D8371]">Nova ne peut PAS exécuter</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/30">
              <Shield className="w-6 h-6 text-[#EF4444] mb-2" />
              <div className="text-[#E9E4D6] font-semibold">Pas de Bypass</div>
              <div className="text-sm text-[#8D8371]">Gouvernance respectée</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D8B26A]/20 to-transparent rounded-3xl blur-3xl" />
          <div className="relative bg-[#2A2B2F] rounded-3xl border border-[#3A3B3F] p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#3A3B3F]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D8B26A] to-[#B8965A] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-[#E9E4D6]">Nova</div>
                <div className="text-sm text-[#8D8371]">Guide • En ligne</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] p-4 rounded-2xl rounded-br-sm bg-[#D8B26A] text-[#1E1F22]">
                  Je veux analyser mes finances du mois
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-2xl rounded-bl-sm bg-[#3A3B3F] text-[#E9E4D6]">
                  Je comprends ! Vous souhaitez une analyse de vos finances. 
                  Voulez-vous que je prépare l'exécution pour la sphère <span className="text-[#76E6C7] font-semibold">Personnel</span> ?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] p-4 rounded-2xl rounded-br-sm bg-[#D8B26A] text-[#1E1F22]">
                  Oui, lance le pipeline
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-2xl rounded-bl-sm bg-[#3A3B3F] text-[#E9E4D6]">
                  <Zap className="w-4 h-4 inline text-[#D8B26A] mr-1" />
                  Pipeline démarré ! Estimation: <span className="text-[#D8B26A] font-semibold">~500 tokens</span>. 
                  L'orchestrateur va exécuter dans le Workspace.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PricingSection = () => (
  <section className="py-20 px-6 bg-[#1A1B1E]" id="pricing">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#E9E4D6] mb-4">
          Tarifs Simples
        </h2>
        <p className="text-xl text-[#8D8371]">
          Commencez gratuitement, évoluez selon vos besoins
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Free */}
        <div className="p-8 rounded-2xl bg-[#2A2B2F] border border-[#3A3B3F]">
          <h3 className="text-2xl font-bold text-[#E9E4D6] mb-2">Starter</h3>
          <div className="text-4xl font-bold text-[#D8B26A] mb-4">
            Gratuit
          </div>
          <p className="text-[#8D8371] mb-6">Pour découvrir CHE·NU</p>
          <ul className="space-y-3 mb-8">
            {['5,000 tokens/mois', '3 sphères actives', 'Nova assistant', 'Pipeline gouverné'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[#E9E4D6]">
                <Check className="w-5 h-5 text-[#3F7249]" />
                {item}
              </li>
            ))}
          </ul>
          <GlowButton>Commencer</GlowButton>
        </div>

        {/* Pro */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-[#D8B26A]/10 to-[#2A2B2F] border-2 border-[#D8B26A] relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D8B26A] text-[#1E1F22] font-bold rounded-full text-sm">
            POPULAIRE
          </div>
          <h3 className="text-2xl font-bold text-[#E9E4D6] mb-2">Pro</h3>
          <div className="text-4xl font-bold text-[#D8B26A] mb-4">
            29€<span className="text-lg text-[#8D8371]">/mois</span>
          </div>
          <p className="text-[#8D8371] mb-6">Pour les professionnels</p>
          <ul className="space-y-3 mb-8">
            {['100,000 tokens/mois', '10 sphères complètes', 'Orchestrateurs L3', 'XR Mode', 'Support prioritaire'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[#E9E4D6]">
                <Check className="w-5 h-5 text-[#3F7249]" />
                {item}
              </li>
            ))}
          </ul>
          <GlowButton primary>Choisir Pro</GlowButton>
        </div>

        {/* Enterprise */}
        <div className="p-8 rounded-2xl bg-[#2A2B2F] border border-[#3A3B3F]">
          <h3 className="text-2xl font-bold text-[#E9E4D6] mb-2">Enterprise</h3>
          <div className="text-4xl font-bold text-[#D8B26A] mb-4">
            Sur mesure
          </div>
          <p className="text-[#8D8371] mb-6">Pour les organisations</p>
          <ul className="space-y-3 mb-8">
            {['Tokens illimités', 'Multi-équipes', 'BYOLLM (votre LLM)', 'SSO & SAML', 'SLA dédié', 'Déploiement on-premise'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[#E9E4D6]">
                <Check className="w-5 h-5 text-[#3F7249]" />
                {item}
              </li>
            ))}
          </ul>
          <GlowButton>Nous contacter</GlowButton>
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-[#E9E4D6] mb-6">
        Prêt à reprendre le contrôle ?
      </h2>
      <p className="text-xl text-[#8D8371] mb-8">
        Rejoignez les pionniers de l'intelligence gouvernée.
        Commencez gratuitement aujourd'hui.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <GlowButton primary>
          Créer mon compte <ArrowRight className="inline ml-2 w-5 h-5" />
        </GlowButton>
        <GlowButton>
          Parler à Nova
        </GlowButton>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 px-6 border-t border-[#3A3B3F]">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Logo size={40} />
            <span className="text-xl font-bold text-[#E9E4D6]">CHE·NU</span>
          </div>
          <p className="text-[#8D8371] text-sm">
            Governed Intelligence Operating System
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-[#E9E4D6] mb-4">Produit</h4>
          <ul className="space-y-2 text-[#8D8371] text-sm">
            <li><a href="#spheres" className="hover:text-[#D8B26A]">Sphères</a></li>
            <li><a href="#governance" className="hover:text-[#D8B26A]">Gouvernance</a></li>
            <li><a href="#nova" className="hover:text-[#D8B26A]">Nova</a></li>
            <li><a href="#pricing" className="hover:text-[#D8B26A]">Tarifs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#E9E4D6] mb-4">Développeurs</h4>
          <ul className="space-y-2 text-[#8D8371] text-sm">
            <li><a href="#" className="hover:text-[#D8B26A]">Documentation</a></li>
            <li><a href="#" className="hover:text-[#D8B26A]">API Reference</a></li>
            <li><a href="#" className="hover:text-[#D8B26A]">SDK</a></li>
            <li><a href="#" className="hover:text-[#D8B26A]">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#E9E4D6] mb-4">Entreprise</h4>
          <ul className="space-y-2 text-[#8D8371] text-sm">
            <li><a href="#" className="hover:text-[#D8B26A]">À propos</a></li>
            <li><a href="#" className="hover:text-[#D8B26A]">Contact</a></li>
            <li><a href="#" className="hover:text-[#D8B26A]">Confidentialité</a></li>
            <li><a href="#" className="hover:text-[#D8B26A]">Conditions</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-[#3A3B3F] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#8D8371] text-sm">
          © 2024-2025 Jonathan Emmanuel Rodrigue / Pro Service. Tous droits réservés.
        </p>
        <p className="text-[#8D8371] text-sm">
          CHE·NU™ — Governed Intelligence Operating System
        </p>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1F22] text-[#E9E4D6]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1E1F22]/90 backdrop-blur-lg border-b border-[#3A3B3F]' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="text-xl font-bold">CHE·NU</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#spheres" className="text-[#8D8371] hover:text-[#D8B26A] transition-colors">Sphères</a>
            <a href="#governance" className="text-[#8D8371] hover:text-[#D8B26A] transition-colors">Gouvernance</a>
            <a href="#nova" className="text-[#8D8371] hover:text-[#D8B26A] transition-colors">Nova</a>
            <a href="#pricing" className="text-[#8D8371] hover:text-[#D8B26A] transition-colors">Tarifs</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#8D8371] hover:text-[#E9E4D6] transition-colors">
              Connexion
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#D8B26A] text-[#1E1F22] font-semibold hover:bg-[#B8965A] transition-colors">
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <HeroSection />
      <SpheresSection />
      <GovernanceSection />
      <NovaSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
