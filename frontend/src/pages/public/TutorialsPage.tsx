/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — TUTORIALS / GUIDES                              ║
 * ║                    PRE-LOGIN — Learn the Platform                            ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  CANONICAL DIRECTIVE:                                                        ║
 * ║  - Professional SaaS language only                                           ║
 * ║  - No mystical/esoteric terminology                                          ║
 * ║  - Focus on practical guidance                                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Play,
  Clock,
  BookOpen,
  Video,
  Code,
  Layers,
  Users,
  Shield,
  Zap,
  MessageSquare,
  Database,
  Settings,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { COLORS, SPHERES } from './constants';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: TutorialCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ReactNode;
  steps?: TutorialStep[];
  videoUrl?: string;
}

interface TutorialStep {
  title: string;
  content: string;
  tip?: string;
}

type TutorialCategory = 
  | 'getting-started' 
  | 'spheres' 
  | 'agents' 
  | 'threads' 
  | 'governance' 
  | 'integrations'
  | 'api';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIES: { id: TutorialCategory; name: string; icon: React.ReactNode }[] = [
  { id: 'getting-started', name: 'Démarrage', icon: <Zap className="w-4 h-4" /> },
  { id: 'spheres', name: 'Sphères', icon: <Layers className="w-4 h-4" /> },
  { id: 'agents', name: 'Agents', icon: <Users className="w-4 h-4" /> },
  { id: 'threads', name: 'Threads', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'governance', name: 'Gouvernance', icon: <Shield className="w-4 h-4" /> },
  { id: 'integrations', name: 'Intégrations', icon: <Database className="w-4 h-4" /> },
  { id: 'api', name: 'API', icon: <Code className="w-4 h-4" /> },
];

const TUTORIALS: Tutorial[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GETTING STARTED
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gs-intro',
    title: 'Introduction à CHE·NU',
    description: 'Découvrez les concepts fondamentaux du système et son fonctionnement.',
    duration: '5 min',
    category: 'getting-started',
    level: 'beginner',
    icon: <BookOpen className="w-5 h-5" />,
    steps: [
      {
        title: 'Qu\'est-ce que CHE·NU ?',
        content: 'CHE·NU est un système d\'exploitation à intelligence gouvernée. Il organise votre vie numérique en 9 sphères distinctes, chacune avec ses propres agents et outils.',
        tip: 'Pensez à CHE·NU comme à un assistant qui ne fait rien sans votre approbation.',
      },
      {
        title: 'Le Principe de Gouvernance',
        content: 'Contrairement aux systèmes autonomes, CHE·NU place l\'humain au centre. Chaque action significative requiert votre validation explicite.',
      },
      {
        title: 'Les 9 Sphères',
        content: 'Personnel, Entreprise, Gouvernement, Studio Créatif, Communauté, Social & Média, Divertissement, Mon Équipe, et Scholars. Chaque sphère organise un aspect de votre vie.',
      },
      {
        title: 'Le Bureau',
        content: 'Le Bureau est votre espace de travail principal dans chaque sphère. Il contient 10 sections : Dashboard, Notes, Tâches, Projets, Threads, Réunions, Données, Agents, Rapports, et Budget.',
      },
    ],
  },
  {
    id: 'gs-first-steps',
    title: 'Vos premiers pas',
    description: 'Guide étape par étape pour commencer à utiliser CHE·NU efficacement.',
    duration: '10 min',
    category: 'getting-started',
    level: 'beginner',
    icon: <Play className="w-5 h-5" />,
    steps: [
      {
        title: 'Créer votre compte',
        content: 'Inscrivez-vous avec votre email. Un processus d\'onboarding vous guidera pour configurer vos préférences initiales.',
      },
      {
        title: 'Configurer votre profil',
        content: 'Renseignez vos informations de base et sélectionnez les sphères que vous souhaitez activer.',
        tip: 'Commencez avec 2-3 sphères maximum pour vous familiariser.',
      },
      {
        title: 'Explorer le Bureau',
        content: 'Naviguez dans le Bureau et découvrez les différentes sections. Le Dashboard vous donne une vue d\'ensemble.',
      },
      {
        title: 'Activer votre premier Agent',
        content: 'Les Agents sont des assistants spécialisés. Activez un agent simple comme l\'Assistant Notes pour débuter.',
      },
    ],
  },
  {
    id: 'gs-navigation',
    title: 'Navigation et Interface',
    description: 'Maîtrisez l\'interface utilisateur et les raccourcis de navigation.',
    duration: '7 min',
    category: 'getting-started',
    level: 'beginner',
    icon: <Settings className="w-5 h-5" />,
    steps: [
      {
        title: 'La barre de navigation',
        content: 'En haut : services, identité, gouvernance. À gauche : navigation rapide auto-adaptative. À droite : panel de hub contextuel.',
      },
      {
        title: 'Raccourcis clavier',
        content: 'Cmd/Ctrl + K : Recherche globale. Cmd/Ctrl + / : Aide. Cmd/Ctrl + B : Basculer la sidebar.',
      },
      {
        title: 'Navigation par sphères',
        content: 'Cliquez sur l\'icône sphère ou utilisez le menu déroulant pour changer de contexte.',
      },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SPHERES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'sp-overview',
    title: 'Comprendre les Sphères',
    description: 'Vue d\'ensemble des 9 sphères et leur utilisation optimale.',
    duration: '8 min',
    category: 'spheres',
    level: 'beginner',
    icon: <Layers className="w-5 h-5" />,
    steps: [
      {
        title: 'Concept de Sphère',
        content: 'Une sphère est un contexte isolé avec ses propres données, agents et paramètres. Les données ne sont jamais partagées automatiquement entre sphères.',
      },
      {
        title: 'Sphère Personnel',
        content: 'Pour vos notes personnelles, tâches, projets privés, et organisation quotidienne.',
      },
      {
        title: 'Sphère Entreprise',
        content: 'Gestion business : CRM, facturation, projets clients, comptabilité.',
      },
      {
        title: 'Transferts Inter-Sphères',
        content: 'Pour transférer des données entre sphères, vous devez utiliser un workflow explicite avec validation.',
        tip: 'Les transferts sont toujours traçables et auditables.',
      },
    ],
  },
  {
    id: 'sp-personal',
    title: 'Sphère Personnel',
    description: 'Configuration et utilisation de votre espace personnel.',
    duration: '12 min',
    category: 'spheres',
    level: 'intermediate',
    icon: <BookOpen className="w-5 h-5" />,
    steps: [
      {
        title: 'Dashboard Personnel',
        content: 'Vue d\'ensemble de vos tâches, notes récentes, et activité.',
      },
      {
        title: 'Gestion des Notes',
        content: 'Créez des notes avec support Markdown, tags, et liens bidirectionnels.',
      },
      {
        title: 'Tâches et Projets',
        content: 'Organisez vos tâches avec priorités, dates d\'échéance, et projets.',
      },
      {
        title: 'Agents Personnels',
        content: 'Activez des agents comme l\'Organisateur ou l\'Analyste de Productivité.',
      },
    ],
  },
  {
    id: 'sp-business',
    title: 'Sphère Entreprise',
    description: 'Optimisez votre gestion business avec CHE·NU.',
    duration: '15 min',
    category: 'spheres',
    level: 'intermediate',
    icon: <Database className="w-5 h-5" />,
    steps: [
      {
        title: 'CRM Intégré',
        content: 'Gérez vos contacts, leads, et pipeline de vente.',
      },
      {
        title: 'Facturation',
        content: 'Créez des devis et factures, suivez les paiements.',
        tip: 'Configurez vos taxes (TPS/TVQ pour le Québec) dans les paramètres.',
      },
      {
        title: 'Gestion de Projets',
        content: 'Suivez vos projets clients avec timeline, budget, et livrables.',
      },
      {
        title: 'Rapports Business',
        content: 'Générez des rapports de performance, revenus, et analyse.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ag-intro',
    title: 'Introduction aux Agents',
    description: 'Comprendre le système d\'agents et leurs capacités.',
    duration: '10 min',
    category: 'agents',
    level: 'beginner',
    icon: <Users className="w-5 h-5" />,
    steps: [
      {
        title: 'Qu\'est-ce qu\'un Agent ?',
        content: 'Un agent est un assistant IA spécialisé qui exécute des tâches dans un domaine précis. Chaque agent a un scope défini et des capacités limitées.',
      },
      {
        title: 'Types d\'Agents',
        content: 'Agents de tâche (exécution), Agents d\'analyse (rapports), Agents de communication (rédaction), Agents de données (traitement).',
      },
      {
        title: 'Activation d\'un Agent',
        content: 'Allez dans la section Agents de votre Bureau et sélectionnez l\'agent à activer.',
        tip: 'Un agent inactif ne consomme aucun token.',
      },
      {
        title: 'Budget de Tokens',
        content: 'Chaque agent a un budget mensuel de tokens. Surveillez votre consommation dans le Dashboard.',
      },
    ],
  },
  {
    id: 'ag-config',
    title: 'Configurer vos Agents',
    description: 'Personnalisez le comportement de vos agents.',
    duration: '12 min',
    category: 'agents',
    level: 'intermediate',
    icon: <Settings className="w-5 h-5" />,
    steps: [
      {
        title: 'Paramètres de base',
        content: 'Définissez le nom, le scope, et le budget de chaque agent.',
      },
      {
        title: 'Règles et Contraintes',
        content: 'Configurez ce que l\'agent peut et ne peut pas faire.',
      },
      {
        title: 'Intégrations',
        content: 'Connectez vos agents à des services externes (calendrier, email, etc.).',
      },
      {
        title: 'Mémoire de l\'Agent',
        content: 'L\'agent peut mémoriser du contexte. Gérez ce qu\'il retient.',
        tip: 'Videz régulièrement la mémoire pour éviter les dérives.',
      },
    ],
  },
  {
    id: 'ag-advanced',
    title: 'Agents Avancés',
    description: 'Orchestration et workflows multi-agents.',
    duration: '20 min',
    category: 'agents',
    level: 'advanced',
    icon: <Zap className="w-5 h-5" />,
    steps: [
      {
        title: 'Chaînage d\'Agents',
        content: 'Créez des workflows où plusieurs agents collaborent séquentiellement.',
      },
      {
        title: 'Nova - L\'Intelligence Système',
        content: 'Nova coordonne les agents et gère le contexte global. Elle n\'est jamais "hired" - c\'est le système lui-même.',
      },
      {
        title: 'Orchestration',
        content: 'Définissez des règles pour l\'exécution automatique de workflows.',
        tip: 'Chaque exécution automatique requiert votre approbation initiale.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // THREADS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'th-intro',
    title: 'Travailler avec les Threads',
    description: 'Les Threads sont des conversations structurées et persistantes.',
    duration: '8 min',
    category: 'threads',
    level: 'beginner',
    icon: <MessageSquare className="w-5 h-5" />,
    steps: [
      {
        title: 'Concept de Thread',
        content: 'Un Thread (.chenu) est une conversation avec contexte persistant. Contrairement aux chats jetables, les Threads conservent leur mémoire.',
      },
      {
        title: 'Créer un Thread',
        content: 'Cliquez sur "Nouveau Thread" dans la section Threads de votre Bureau.',
      },
      {
        title: 'Inviter des Agents',
        content: 'Ajoutez des agents à votre Thread pour obtenir leur aide spécialisée.',
      },
      {
        title: 'Archivage',
        content: 'Les Threads peuvent être archivés pour référence future tout en libérant de l\'espace actif.',
      },
    ],
  },
  {
    id: 'th-advanced',
    title: 'Threads Multi-Participants',
    description: 'Collaboration avancée dans les Threads.',
    duration: '10 min',
    category: 'threads',
    level: 'intermediate',
    icon: <Users className="w-5 h-5" />,
    steps: [
      {
        title: 'Inviter des collaborateurs',
        content: 'Partagez un Thread avec d\'autres utilisateurs CHE·NU.',
      },
      {
        title: 'Rôles dans un Thread',
        content: 'Owner (propriétaire), Participant (peut écrire), Viewer (lecture seule).',
      },
      {
        title: 'Résolution de conflits',
        content: 'Si plusieurs modifications simultanées, le système propose une fusion.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GOVERNANCE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gov-principles',
    title: 'Principes de Gouvernance',
    description: 'Comprendre la gouvernance et le contrôle humain.',
    duration: '12 min',
    category: 'governance',
    level: 'beginner',
    icon: <Shield className="w-5 h-5" />,
    steps: [
      {
        title: 'Gouvernance > Exécution',
        content: 'Le principe fondamental : aucune action n\'est exécutée sans validation humaine explicite.',
      },
      {
        title: 'Points de Contrôle',
        content: 'Le système identifie les actions sensibles et vous demande confirmation.',
        tip: 'Vous pouvez configurer le niveau de sensibilité dans les paramètres.',
      },
      {
        title: 'Audit Trail',
        content: 'Chaque action est enregistrée avec horodatage, acteur, et justification.',
      },
      {
        title: 'Révocation',
        content: 'Vous pouvez annuler les actions récentes depuis le journal d\'audit.',
      },
    ],
  },
  {
    id: 'gov-privacy',
    title: 'Confidentialité et Sécurité',
    description: 'Protection de vos données et vie privée.',
    duration: '8 min',
    category: 'governance',
    level: 'beginner',
    icon: <Shield className="w-5 h-5" />,
    steps: [
      {
        title: 'Chiffrement',
        content: 'Toutes vos données sont chiffrées au repos et en transit.',
      },
      {
        title: 'Isolation des Sphères',
        content: 'Les données d\'une sphère ne sont jamais accessibles depuis une autre sans votre autorisation.',
      },
      {
        title: 'Export de Données',
        content: 'Vous pouvez exporter toutes vos données à tout moment dans des formats ouverts.',
      },
      {
        title: 'Suppression',
        content: 'Demandez la suppression complète de vos données à tout moment.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'int-overview',
    title: 'Intégrations Disponibles',
    description: 'Connectez CHE·NU à vos outils existants.',
    duration: '10 min',
    category: 'integrations',
    level: 'intermediate',
    icon: <Database className="w-5 h-5" />,
    steps: [
      {
        title: 'Calendrier',
        content: 'Synchronisez avec Google Calendar, Outlook, ou Apple Calendar.',
      },
      {
        title: 'Email',
        content: 'Connectez Gmail ou Outlook pour traiter vos emails depuis CHE·NU.',
      },
      {
        title: 'Stockage Cloud',
        content: 'Intégrez Dropbox, Google Drive, ou OneDrive.',
      },
      {
        title: 'Services Tiers',
        content: 'Zapier et webhooks pour des intégrations personnalisées.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // API
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'api-intro',
    title: 'Introduction à l\'API',
    description: 'Utilisez l\'API CHE·NU pour des intégrations personnalisées.',
    duration: '15 min',
    category: 'api',
    level: 'advanced',
    icon: <Code className="w-5 h-5" />,
    steps: [
      {
        title: 'Authentification',
        content: 'L\'API utilise des tokens JWT. Obtenez votre clé API dans les paramètres.',
      },
      {
        title: 'Endpoints Principaux',
        content: '/api/v1/spheres, /api/v1/threads, /api/v1/agents, /api/v1/tasks',
      },
      {
        title: 'Rate Limiting',
        content: 'Les requêtes sont limitées selon votre plan (voir Pricing).',
      },
      {
        title: 'Webhooks',
        content: 'Recevez des notifications en temps réel pour les événements.',
      },
    ],
  },
  {
    id: 'api-examples',
    title: 'Exemples d\'API',
    description: 'Exemples de code pour intégrer CHE·NU.',
    duration: '20 min',
    category: 'api',
    level: 'advanced',
    icon: <Code className="w-5 h-5" />,
    steps: [
      {
        title: 'Créer une Tâche',
        content: `POST /api/v1/tasks
{
  "title": "Ma tâche",
  "sphere": "personal",
  "priority": "high"
}`,
      },
      {
        title: 'Lister les Threads',
        content: `GET /api/v1/threads?sphere=business&limit=10`,
      },
      {
        title: 'Invoquer un Agent',
        content: `POST /api/v1/agents/{id}/invoke
{
  "prompt": "Analyse ce document",
  "context": {...}
}`,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const ChenuLogo: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={COLORS.sacredGold} />
        <stop offset="100%" stopColor={COLORS.earthEmber} />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="20" fill="url(#logoGrad)" />
    <text x="50" y="68" fontFamily="Georgia, serif" fontSize="36" fill={COLORS.uiSlate} textAnchor="middle" fontWeight="bold">C·N</text>
  </svg>
);

const Navigation: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E1F22]/95 backdrop-blur-md border-b border-[#D8B26A]/10">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <ChenuLogo size={40} />
        <span className="text-xl font-semibold text-[#E9E4D6]">CHE<span className="text-[#D8B26A]">·</span>NU</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/services" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Services</Link>
        <Link to="/tutorials" className="text-[#D8B26A] text-sm font-medium">Guides</Link>
        <Link to="/demo" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Démo</Link>
        <Link to="/faq" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">FAQ</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Connexion</Link>
        <Link to="/signup" className="px-4 py-2 bg-[#D8B26A]/10 border border-[#D8B26A]/30 text-[#D8B26A] text-sm rounded-lg hover:bg-[#D8B26A]/20 transition">Rejoindre</Link>
      </div>
    </div>
  </nav>
);

const Footer: React.FC = () => (
  <footer className="py-8 px-6 bg-[#1E1F22] border-t border-[#D8B26A]/10">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-[#8D8371] text-sm">© 2025 CHE·NU™ — Governed Intelligence Operating System</p>
      <div className="flex items-center gap-6">
        <Link to="/privacy" className="text-[#8D8371] hover:text-[#D8B26A] text-sm transition">Confidentialité</Link>
        <Link to="/terms" className="text-[#8D8371] hover:text-[#D8B26A] text-sm transition">Conditions</Link>
        <Link to="/security" className="text-[#8D8371] hover:text-[#D8B26A] text-sm transition">Sécurité</Link>
      </div>
    </div>
  </footer>
);

const LevelBadge: React.FC<{ level: Tutorial['level'] }> = ({ level }) => {
  const config = {
    beginner: { label: 'Débutant', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    intermediate: { label: 'Intermédiaire', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    advanced: { label: 'Avancé', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };
  const { label, color } = config[level];
  return (
    <span className={`px-2 py-0.5 text-xs rounded border ${color}`}>
      {label}
    </span>
  );
};

const TutorialCard: React.FC<{ 
  tutorial: Tutorial; 
  onClick: () => void;
  isActive?: boolean;
}> = ({ tutorial, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-lg border transition ${
      isActive 
        ? 'bg-[#D8B26A]/10 border-[#D8B26A]/50' 
        : 'bg-[#1E1F22] border-[#D8B26A]/10 hover:border-[#D8B26A]/30'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${isActive ? 'bg-[#D8B26A]/20' : 'bg-[#2A2B2F]'}`}>
        {tutorial.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-medium text-sm ${isActive ? 'text-[#D8B26A]' : 'text-[#E9E4D6]'}`}>
            {tutorial.title}
          </h3>
          <LevelBadge level={tutorial.level} />
        </div>
        <p className="text-[#8D8371] text-xs line-clamp-2 mb-2">
          {tutorial.description}
        </p>
        <div className="flex items-center gap-2 text-[#8D8371] text-xs">
          <Clock className="w-3 h-3" />
          <span>{tutorial.duration}</span>
        </div>
      </div>
    </div>
  </button>
);

const TutorialViewer: React.FC<{ tutorial: Tutorial }> = ({ tutorial }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = tutorial.steps || [];

  return (
    <div className="bg-[#1E1F22] rounded-xl border border-[#D8B26A]/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#D8B26A]/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#D8B26A]/10 rounded-lg">
            {tutorial.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#E9E4D6]">{tutorial.title}</h2>
            <p className="text-[#8D8371] text-sm">{tutorial.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LevelBadge level={tutorial.level} />
          <div className="flex items-center gap-1 text-[#8D8371] text-sm">
            <Clock className="w-4 h-4" />
            <span>{tutorial.duration}</span>
          </div>
          {steps.length > 0 && (
            <div className="text-[#8D8371] text-sm">
              Étape {currentStep + 1} / {steps.length}
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      {steps.length > 0 && (
        <div className="h-1 bg-[#2A2B2F]">
          <div 
            className="h-full bg-[#D8B26A] transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {steps.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#D8B26A]/20 flex items-center justify-center text-[#D8B26A] font-medium">
                {currentStep + 1}
              </div>
              <h3 className="text-lg font-medium text-[#E9E4D6]">
                {steps[currentStep].title}
              </h3>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-[#E9E4D6]/80 leading-relaxed whitespace-pre-wrap">
                {steps[currentStep].content}
              </p>
            </div>

            {steps[currentStep].tip && (
              <div className="flex items-start gap-3 p-4 bg-[#D8B26A]/5 rounded-lg border border-[#D8B26A]/20">
                <Zap className="w-5 h-5 text-[#D8B26A] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#D8B26A] mb-1">Conseil</p>
                  <p className="text-sm text-[#8D8371]">{steps[currentStep].tip}</p>
                </div>
              </div>
            )}

            {/* Step Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[#D8B26A]/10">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 text-sm text-[#8D8371] hover:text-[#E9E4D6] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Précédent
              </button>
              
              {/* Step dots */}
              <div className="flex items-center gap-2">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentStep 
                        ? 'bg-[#D8B26A]' 
                        : idx < currentStep 
                          ? 'bg-[#D8B26A]/50' 
                          : 'bg-[#8D8371]/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="px-4 py-2 text-sm text-[#D8B26A] hover:text-[#E9E4D6] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Suivant →
              </button>
            </div>

            {/* Completion */}
            {currentStep === steps.length - 1 && (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400">
                  Félicitations ! Vous avez terminé ce tutoriel.
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[#8D8371] text-center py-8">
            Ce tutoriel n'a pas encore de contenu détaillé.
          </p>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const TutorialsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | 'all'>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(TUTORIALS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTutorials = TUTORIALS.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#1E1F22]">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-[#E9E4D6] mb-4">
              Guides & Tutoriels
            </h1>
            <p className="text-[#8D8371] max-w-2xl mx-auto">
              Apprenez à utiliser CHE·NU efficacement avec nos guides étape par étape.
              Du débutant à l'expert, trouvez le tutoriel adapté à votre niveau.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D8371]" />
              <input
                type="text"
                placeholder="Rechercher un tutoriel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#2A2B2F] border border-[#D8B26A]/10 rounded-lg text-[#E9E4D6] placeholder-[#8D8371] focus:border-[#D8B26A]/30 focus:outline-none transition"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition ${
                  selectedCategory === 'all'
                    ? 'bg-[#D8B26A]/20 text-[#D8B26A] border border-[#D8B26A]/30'
                    : 'bg-[#2A2B2F] text-[#8D8371] border border-transparent hover:border-[#D8B26A]/20'
                }`}
              >
                Tous
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap flex items-center gap-2 transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#D8B26A]/20 text-[#D8B26A] border border-[#D8B26A]/30'
                      : 'bg-[#2A2B2F] text-[#8D8371] border border-transparent hover:border-[#D8B26A]/20'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Tutorial List */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-[#8D8371]">
                  {filteredTutorials.length} tutoriel{filteredTutorials.length > 1 ? 's' : ''}
                </h2>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {filteredTutorials.map(tutorial => (
                  <TutorialCard
                    key={tutorial.id}
                    tutorial={tutorial}
                    onClick={() => setSelectedTutorial(tutorial)}
                    isActive={selectedTutorial?.id === tutorial.id}
                  />
                ))}
              </div>
            </div>

            {/* Main - Tutorial Viewer */}
            <div className="lg:col-span-2">
              {selectedTutorial ? (
                <TutorialViewer tutorial={selectedTutorial} />
              ) : (
                <div className="bg-[#1E1F22] rounded-xl border border-[#D8B26A]/10 p-12 text-center">
                  <BookOpen className="w-12 h-12 text-[#8D8371] mx-auto mb-4" />
                  <p className="text-[#8D8371]">
                    Sélectionnez un tutoriel pour commencer.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/faq"
              className="p-6 bg-[#2A2B2F] rounded-xl border border-[#D8B26A]/10 hover:border-[#D8B26A]/30 transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#D8B26A]/10 rounded-lg group-hover:bg-[#D8B26A]/20 transition">
                  <MessageSquare className="w-5 h-5 text-[#D8B26A]" />
                </div>
                <h3 className="font-medium text-[#E9E4D6]">FAQ</h3>
              </div>
              <p className="text-[#8D8371] text-sm">
                Questions fréquentes et réponses rapides.
              </p>
            </Link>

            <Link
              to="/demo"
              className="p-6 bg-[#2A2B2F] rounded-xl border border-[#D8B26A]/10 hover:border-[#D8B26A]/30 transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#D8B26A]/10 rounded-lg group-hover:bg-[#D8B26A]/20 transition">
                  <Video className="w-5 h-5 text-[#D8B26A]" />
                </div>
                <h3 className="font-medium text-[#E9E4D6]">Démo Interactive</h3>
              </div>
              <p className="text-[#8D8371] text-sm">
                Découvrez CHE·NU en action avec notre démo guidée.
              </p>
            </Link>

            <a
              href="mailto:support@che-nu.com"
              className="p-6 bg-[#2A2B2F] rounded-xl border border-[#D8B26A]/10 hover:border-[#D8B26A]/30 transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#D8B26A]/10 rounded-lg group-hover:bg-[#D8B26A]/20 transition">
                  <Users className="w-5 h-5 text-[#D8B26A]" />
                </div>
                <h3 className="font-medium text-[#E9E4D6]">Support</h3>
              </div>
              <p className="text-[#8D8371] text-sm">
                Besoin d'aide ? Contactez notre équipe support.
              </p>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TutorialsPage;
