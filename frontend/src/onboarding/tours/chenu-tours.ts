/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — PREDEFINED TOURS
 * Phase 4: Onboarding Experience
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Tours guidés prédéfinis pour CHE·NU™.
 * 
 * Créé: 20 Décembre 2025
 * Version: 1.0.0
 */

import { TourStep } from '../components/GuidedTour';

/**
 * Tour: Introduction aux 9 Spheres
 */
export const sphereIntroductionTour: TourStep[] = [
  {
    target: '[data-tour="sphere-selector"]',
    title: 'Bienvenue dans CHE·NU™',
    content: 'CHE·NU organise votre vie en 9 Spheres. Chaque Sphere représente un contexte distinct de votre existence.',
    placement: 'bottom',
    showSkip: true,
  },
  {
    target: '[data-tour="sphere-personal"]',
    title: 'Personal 🏠',
    content: 'Votre vie personnelle: santé, bien-être, objectifs personnels.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-business"]',
    title: 'Business 💼',
    content: 'Votre activité professionnelle: projets, clients, stratégie.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-government"]',
    title: 'Government & Institutions 🏛️',
    content: 'Relations avec administrations, institutions, associations.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-studio"]',
    title: 'Studio de création 🎨',
    content: 'Vos projets créatifs: design, art, contenu.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-community"]',
    title: 'Community 👥',
    content: 'Communautés auxquelles vous participez.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-social"]',
    title: 'Social & Media 📱',
    content: 'Présence sur réseaux sociaux et médias.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-entertainment"]',
    title: 'Entertainment 🎬',
    content: 'Loisirs, divertissement, hobbies.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-team"]',
    title: 'My Team 🤝',
    content: 'Vos agents IA, outils et compétences.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-scholars"]',
    title: 'Scholars 📚',
    content: 'Apprentissage, recherche, développement personnel.',
    placement: 'right',
  },
  {
    target: '[data-tour="sphere-selector"]',
    title: 'Une Sphere à la fois',
    content: 'Principe de CHE·NU: UNE seule Sphere active. Cela réduit la charge cognitive et augmente la clarté.',
    placement: 'bottom',
  },
];

/**
 * Tour: Structure d'un Bureau
 */
export const bureauStructureTour: TourStep[] = [
  {
    target: '[data-tour="bureau-header"]',
    title: 'Le Bureau',
    content: 'Chaque Sphere ouvre un Bureau avec une structure hiérarchique fixe.',
    placement: 'bottom',
    showSkip: true,
  },
  {
    target: '[data-tour="section-dashboard"]',
    title: 'Dashboard',
    content: 'Vue d\'ensemble de cette Sphere avec métriques clés.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-notes"]',
    title: 'Notes',
    content: 'Capturez rapidement vos pensées et idées.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-tasks"]',
    title: 'Tasks',
    content: 'Gérez vos tâches avec priorités et échéances.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-projects"]',
    title: 'Projects',
    content: 'Organisez vos projets complexes.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-threads"]',
    title: 'Threads (.chenu)',
    content: 'Lignes de pensée persistantes - le cœur de CHE·NU.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-meetings"]',
    title: 'Meetings',
    content: 'Réunions gouvernées avec agents et budget.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-data"]',
    title: 'Data',
    content: 'Vos données structurées pour cette Sphere.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-agents"]',
    title: 'Agents',
    content: 'Agents IA assignés à cette Sphere.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-reports"]',
    title: 'Reports',
    content: 'Historique et rapports de cette Sphere.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-budget"]',
    title: 'Budget & Governance',
    content: 'Contrôle des tokens et gouvernance.',
    placement: 'right',
  },
];

/**
 * Tour: Création d'un Thread
 */
export const firstThreadTour: TourStep[] = [
  {
    target: '[data-tour="threads-section"]',
    title: 'Les Threads (.chenu)',
    content: 'Un Thread est une ligne de pensée persistante. C\'est l\'unité fondamentale de travail dans CHE·NU.',
    placement: 'bottom',
    showSkip: false,
  },
  {
    target: '[data-tour="create-thread-btn"]',
    title: 'Créer un Thread',
    content: 'Cliquez ici pour créer votre premier Thread.',
    placement: 'left',
    action: () => {
      const btn = document.querySelector('[data-tour="create-thread-btn"]') as HTMLButtonElement;
      if (btn) btn.click();
    },
  },
  {
    target: '[data-tour="thread-title"]',
    title: 'Titre du Thread',
    content: 'Donnez un titre clair à votre Thread. Ex: "Planifier vacances 2025"',
    placement: 'bottom',
  },
  {
    target: '[data-tour="thread-scope"]',
    title: 'Scope (Sphere)',
    content: 'Le Thread appartient à cette Sphere. Il hérite de son contexte.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="thread-budget"]',
    title: 'Budget Tokens',
    content: 'Allouez un budget de tokens pour ce Thread. Les agents consommeront ces tokens.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="thread-encoding"]',
    title: 'Encoding Rules',
    content: 'Règles d\'encodage pour optimiser les interactions IA. (Optionnel)',
    placement: 'bottom',
  },
  {
    target: '[data-tour="create-submit"]',
    title: 'Créer',
    content: 'Validez pour créer votre Thread!',
    placement: 'top',
  },
];

/**
 * Tour: Hiérarchie des Agents
 */
export const agentHierarchyTour: TourStep[] = [
  {
    target: '[data-tour="agents-panel"]',
    title: 'Les Agents CHE·NU',
    content: 'CHE·NU utilise une hiérarchie stricte d\'agents IA.',
    placement: 'bottom',
    showSkip: true,
  },
  {
    target: '[data-tour="agent-nova"]',
    title: 'Nova (L0)',
    content: 'L\'intelligence système. Nova est toujours présente, gère la mémoire et la gouvernance.',
    placement: 'right',
  },
  {
    target: '[data-tour="agent-orchestrator"]',
    title: 'User Orchestrator (L1)',
    content: 'Votre chef d\'orchestre personnel. Il coordonne les autres agents.',
    placement: 'right',
  },
  {
    target: '[data-tour="agent-specialists"]',
    title: 'Specialist Agents (L2)',
    content: 'Experts dans des domaines spécifiques. Ex: Data Analyst, Content Writer.',
    placement: 'right',
  },
  {
    target: '[data-tour="agent-utilities"]',
    title: 'Utility Agents (L3)',
    content: 'Agents simples pour tâches spécifiques. Ex: Email Formatter, Calculator.',
    placement: 'right',
  },
  {
    target: '[data-tour="hire-agent-btn"]',
    title: 'Embaucher un Agent',
    content: 'Créez votre premier agent pour vous assister!',
    placement: 'left',
  },
];

/**
 * Tour: Système de Tokens
 */
export const tokenSystemTour: TourStep[] = [
  {
    target: '[data-tour="token-balance"]',
    title: 'Vos Tokens',
    content: 'Les tokens représentent l\'énergie d\'intelligence. Ce ne sont PAS des cryptomonnaies.',
    placement: 'bottom',
    showSkip: true,
  },
  {
    target: '[data-tour="token-balance"]',
    title: 'Balance Actuelle',
    content: 'Voici votre balance de tokens disponibles.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="token-allocation"]',
    title: 'Allocation',
    content: 'Allouez des tokens aux Spheres, Threads et Agents.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="token-consumption"]',
    title: 'Consommation',
    content: 'Les agents consomment des tokens quand ils exécutent des tâches.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="budget-enforcer"]',
    title: 'Budget Enforcer',
    content: 'Le système empêche les dépassements. Gouvernance avant exécution!',
    placement: 'bottom',
  },
  {
    target: '[data-tour="token-history"]',
    title: 'Historique',
    content: 'Toutes les transactions sont tracées et auditables.',
    placement: 'bottom',
  },
];

/**
 * Tour: Premier Meeting
 */
export const firstMeetingTour: TourStep[] = [
  {
    target: '[data-tour="meetings-section"]',
    title: 'Meetings Gouvernés',
    content: 'Les Meetings dans CHE·NU sont gouvernés: budget, traçabilité, agents.',
    placement: 'bottom',
    showSkip: false,
  },
  {
    target: '[data-tour="create-meeting-btn"]',
    title: 'Créer un Meeting',
    content: 'Planifions votre premier meeting!',
    placement: 'left',
    action: () => {
      const btn = document.querySelector('[data-tour="create-meeting-btn"]') as HTMLButtonElement;
      if (btn) btn.click();
    },
  },
  {
    target: '[data-tour="meeting-title"]',
    title: 'Titre & Objectif',
    content: 'Définissez clairement l\'objectif du meeting.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="meeting-participants"]',
    title: 'Participants',
    content: 'Invitez des humains ET des agents IA.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="meeting-budget"]',
    title: 'Budget Meeting',
    content: 'Allouez un budget pour les agents participants.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="meeting-agenda"]',
    title: 'Agenda',
    content: 'Structurez l\'ordre du jour.',
    placement: 'bottom',
  },
];

/**
 * Export all tours
 */
export const CHENU_TOURS = {
  sphereIntroduction: sphereIntroductionTour,
  bureauStructure: bureauStructureTour,
  firstThread: firstThreadTour,
  agentHierarchy: agentHierarchyTour,
  tokenSystem: tokenSystemTour,
  firstMeeting: firstMeetingTour,
};
