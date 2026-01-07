/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                   CHE·NU™ V50 — COMMUNICATION HUB                            ║
 * ║                                                                              ║
 * ║  Central hub for all communication flows in CHE·NU:                          ║
 * ║                                                                              ║
 * ║  • Nova Chat — System intelligence interaction                               ║
 * ║  • Active Threads — .chenu thread management                                 ║
 * ║  • Emails — Unified inbox across all connected accounts                      ║
 * ║  • Contacts — Contact management and directory                               ║
 * ║  • Calls — Voice and video calls                                             ║
 * ║  • Upcoming Meetings — Scheduled knowledge events                            ║
 * ║  • Connected Apps — Third-party integrations                                 ║
 * ║  • Notifications — Real-time alerts and updates                              ║
 * ║                                                                              ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ║  All actions respect checkpoints and user approval.                          ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { logger } from '@/utils/logger';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — CHE·NU Brand Colors
// ═══════════════════════════════════════════════════════════════════════════════
// 
// ⚠️  UI COLOR REBALANCE CANON — DARK CALM / BIOPHILIC / LONG-WORK FRIENDLY
// 
// RÈGLE FONDAMENTALE: Le fond global ne doit JAMAIS être l'élément le plus sombre.
// Les surfaces doivent toujours être plus claires que le fond.
// Objectif: "Je peux rester ici longtemps" (pas "C'est stylé mais fatigant")
//
// 🧮 RÈGLE DE CONTRASTE CHE·NU (ΔL*)
// Chaque couche UI = +6% à +10% de luminosité perçue maximum
// Surface = fond + 1 cran | Focus = surface + 1 cran | Actif = focus + 1 cran
//
// 🎯 DIFFÉRENCIATION DASHBOARD / BUREAU
// Dashboard = piloter / décider → compact, structuré, posé
// Bureau = produire / réfléchir → ouvert, lisible, calme, flotte
// Surface Bureau = Surface Dashboard + 1 cran de luminosité (JAMAIS l'inverse)
//
// ═══════════════════════════════════════════════════════════════════════════════

const CHENU_COLORS = {
  // ─────────────────────────────────────────────────────────────────────────────
  // BACKGROUNDS — STRATIFICATION GLOBALE
  // ─────────────────────────────────────────────────────────────────────────────
  bgRoot: '#1B1F23',
  bgRootDeeper: '#181C20',
  
  // Legacy (compatibilité)
  bgPrimary: '#1B1F23',
  bgSecondary: '#2A3138',
  bgTertiary: '#323A42',
  bgHover: '#39424A',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 🎛️ DASHBOARD — "CENTRE DE COMMANDE"
  // Intention: densité contrôlée, information regroupée, hiérarchie claire
  // Le Dashboard ne flotte pas, il est POSÉ
  // ─────────────────────────────────────────────────────────────────────────────
  dashboardBg: '#242A30',           // Fond dashboard (plus sombre)
  dashboardSurface: '#2A3138',      // Cards/panels dashboard
  dashboardSurfaceFocus: '#303841', // Focus/hover dashboard
  dashboardRadius: '10px',          // Coins stricts
  dashboardShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
  dashboardBorder: 'rgba(255, 255, 255, 0.04)',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 📋 BUREAU (WORKSPACE) — "ESPACE DE TRAVAIL"
  // Intention: lisibilité longue durée, sensation d'espace, calme cognitif
  // Le Bureau FLOTTE légèrement → sensation de liberté
  // Surface Bureau = Surface Dashboard + 1 cran
  // ─────────────────────────────────────────────────────────────────────────────
  workspaceBg: '#1F2429',           // Fond workspace (plus clair que root)
  workspaceSurface: '#323A42',      // Cards/panels workspace (+1 cran)
  workspaceSurfaceFocus: '#39424A', // Focus/hover workspace
  workspaceRadius: '14px',          // Coins doux
  workspaceShadow: '0 12px 32px rgba(0, 0, 0, 0.32)',
  workspaceShadowInset: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
  workspaceBorder: 'rgba(255, 255, 255, 0.05)',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 🤝 MEETING — "TABLE DE DÉCISION" (Collaboration Space)
  // Intention: posé, sérieux, lisible, sans distraction
  // Rythme: court, cadré | Résultat: DECISIONS
  // Sections clairement délimitées, titres visibles, aucun glow
  // ─────────────────────────────────────────────────────────────────────────────
  meetingBg: '#2A3036',
  meetingSurface: '#2F363D',
  meetingSurfaceFocus: '#353D46',
  meetingRadius: '10px',            // Coins stricts
  meetingShadow: '0 6px 16px rgba(0, 0, 0, 0.22)',
  meetingShadowInset: 'inset 0 1px 0 rgba(255, 255, 255, 0.025)',
  meetingBorder: 'rgba(255, 255, 255, 0.035)',
  meetingGap: '12px',
  meetingPadding: '16px',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 🔧 WORKING SESSION — "ATELIER DE TRAVAIL" (Collaboration Space)
  // Intention: respiration, continuité, concentration, liberté contrôlée
  // Rythme: long, continu | Résultat: OUTPUTS
  // Working Session = Meeting + 1 cran luminosité + 1 cran espace − 1 cran structure
  // ─────────────────────────────────────────────────────────────────────────────
  workSessionBg: '#2E353D',
  workSessionSurface: '#353D46',            // +1 cran vs meetingSurface
  workSessionSurfaceFocus: '#3C4650',
  workSessionRadius: '14px',                // Coins doux
  workSessionShadow: '0 10px 28px rgba(0, 0, 0, 0.30)',
  workSessionShadowInset: 'inset 0 1px 0 rgba(255, 255, 255, 0.035)',
  workSessionBorder: 'rgba(255, 255, 255, 0.05)',
  workSessionGap: '20px',
  workSessionPadding: '24px',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Surfaces génériques (legacy)
  // ─────────────────────────────────────────────────────────────────────────────
  surface1: '#2A3138',
  surface2: '#323A42',
  surface3: '#39424A',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ACCENTS DÉSATURÉS (signal, pas décoration)
  // ─────────────────────────────────────────────────────────────────────────────
  sacredGold: '#BFAE7A',
  sacredGoldDark: '#9F8E5A',
  sacredGoldLight: '#D4C89A',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // NATURE PALETTE (calme, désaturée)
  // ─────────────────────────────────────────────────────────────────────────────
  jungleEmerald: '#6FAF9A',
  cenoteTurquoise: '#6EAFC4',
  shadowMoss: '#4A6B5A',
  earthEmber: '#8A6B4A',
  ancientStone: '#B8BDC3',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TEXTE (lecture longue - pas de blanc pur!)
  // ─────────────────────────────────────────────────────────────────────────────
  softSand: '#E6E8EA',
  textPrimary: '#E6E8EA',
  textSecondary: '#B8BDC3',
  textMuted: '#8B9096',
  textDisabled: '#6F747A',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // UI SLATE (legacy)
  // ─────────────────────────────────────────────────────────────────────────────
  uiSlate: '#2A3138',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SEMANTIC COLORS (désaturées)
  // ─────────────────────────────────────────────────────────────────────────────
  success: '#6FAF9A',
  warning: '#C4A060',
  error: '#C47070',
  info: '#6EAFC4',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // BORDERS (subtils - séparation invisible mais lisible)
  // ─────────────────────────────────────────────────────────────────────────────
  borderDefault: 'rgba(255, 255, 255, 0.04)',
  borderHover: 'rgba(255, 255, 255, 0.08)',
  borderFocus: 'rgba(191, 174, 122, 0.3)',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SHADOWS (profondeur douce, pas de noir pur)
  // ─────────────────────────────────────────────────────────────────────────────
  shadowSurface: '0 10px 28px rgba(0, 0, 0, 0.28)',
  shadowSurfaceHover: '0 12px 32px rgba(0, 0, 0, 0.32)',
  shadowInsetTop: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
  shadowInsetTopHover: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // NOVA (intelligence système - cyan doux)
  // ─────────────────────────────────────────────────────────────────────────────
  novaGlow: 'rgba(110, 175, 196, 0.15)',
  novaPrimary: '#6EAFC4',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CALL COLORS (désaturées mais distinctes)
  // ─────────────────────────────────────────────────────────────────────────────
  callGreen: '#6FAF9A',
  callRed: '#C47070',
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type CommunicationTab = 'nova' | 'threads' | 'emails' | 'contacts' | 'calls' | 'meetings' | 'apps' | 'notifications';

// Contact Types
interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
  favorite: boolean;
  company?: string;
  role?: string;
  sphereIds?: string[]; // Spheres où ce contact est présent
  tags?: string[];
  source: 'chenu' | 'google' | 'outlook' | 'phone' | 'manual';
}

// Call Types
type CallType = 'audio' | 'video';
type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended' | 'missed' | 'declined';

interface Call {
  id: string;
  type: CallType;
  status: CallStatus;
  direction: 'incoming' | 'outgoing';
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  startTime?: string;
  endTime?: string;
  duration?: number; // seconds
  missedAt?: string;
}

interface CallHistory {
  id: string;
  type: CallType;
  direction: 'incoming' | 'outgoing';
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  duration?: number;
  status: 'completed' | 'missed' | 'declined';
}

interface NovaMessage {
  id: string;
  role: 'user' | 'nova' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    latencyMs?: number;
    suggestions?: string[];
  };
}

// Email Types
interface Email {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  cc?: string[];
  subject: string;
  preview: string;
  body?: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  hasAttachments: boolean;
  attachmentCount?: number;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash';
  labels: string[];
  accountId: string; // 'chenu' pour emails natifs, ou ID du provider
  accountName: string;
  priority: 'low' | 'normal' | 'high';
  threadId?: string; // Link to CHE·NU thread
  isInternal: boolean; // true = email CHE·NU natif
}

interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: 'chenu' | 'gmail' | 'outlook' | 'icloud' | 'custom';
  icon: string;
  color: string;
  unreadCount: number;
  connected: boolean;
  lastSync: string;
  isNative: boolean; // true = boîte CHE·NU
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONNECTED APPS — CATÉGORIES RÉALISTES
// ═══════════════════════════════════════════════════════════════════════════════
//
// IMPORTANT: Seules les apps avec API LÉGALES sont supportées
//
// ✅ API Légales:
//   - Slack (API officielle)
//   - Discord (Bot API)
//   - WhatsApp Business API (entreprises seulement)
//   - SMS (via Twilio, Vonage)
//   - Messenger (Pages entreprise SEULEMENT)
//   - Teams, Zoom, Google Meet (Meeting APIs)
//
// ❌ API Illégales (non supportées):
//   - WhatsApp personnel (pas d'API officielle)
//   - Messenger personnel (interdit par Meta)
//   - Instagram DMs personnel
//   - Snapchat
// ═══════════════════════════════════════════════════════════════════════════════

type AppCategory = 
  | 'messaging'      // Slack, Discord, WhatsApp Business, SMS, Messenger Business
  | 'meetings'       // Teams, Zoom, Google Meet, Webex
  | 'storage'        // Google Drive, Dropbox, OneDrive
  | 'productivity'   // Notion, Figma, Miro
  | 'project'        // Jira, Asana, Linear, Trello
  | 'developer'      // GitHub, GitLab, Bitbucket
  | 'calendar'       // Google Calendar, Outlook Calendar
  | 'crm';           // Salesforce, HubSpot

interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  category: AppCategory;
  description: string;
  connected: boolean;
  lastSync?: string;
  unreadCount?: number;
  permissions: string[];
  color: string;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  hasOfficialAPI: boolean; // true = API légale
  apiNote?: string; // Note sur les restrictions
  actions?: {
    id: string;
    label: string;
    icon: string;
  }[];
}

interface AppMessage {
  id: string;
  appId: string;
  appName: string;
  appIcon: string;
  type: 'message' | 'mention' | 'notification' | 'task' | 'event';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

interface ThreadSummary {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'completed';
  scope: 'personal' | 'shared' | 'project';
  unreadCount: number;
  lastMessageAt: string;
  lastMessage: string;
  participants: string[];
  sphereId: string;
  sphereEmoji: string;
}

interface MeetingSummary {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  meetingType: 'sync' | 'async' | 'hybrid' | 'xr_spatial';
  participantCount: number;
  isHost: boolean;
  sphereId: string;
  sphereEmoji: string;
  hasAgenda: boolean;
}

interface Notification {
  id: string;
  type: 'thread' | 'meeting' | 'task' | 'agent' | 'system' | 'mention';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  action?: {
    type: string;
    targetId: string;
    label: string;
  };
}

interface CommunicationHubProps {
  currentSphereId?: string;
  onOpenThread?: (threadId: string) => void;
  onOpenMeeting?: (meetingId: string) => void;
  onNavigateToSphere?: (sphereId: string) => void;
  onCallContact?: (contactId: string, type: 'audio' | 'video') => void;
  defaultOpen?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA — Replace with real API calls
// ═══════════════════════════════════════════════════════════════════════════════

const mockThreads: ThreadSummary[] = [
  {
    id: 't1',
    title: 'Architecture V50 Discussion',
    status: 'active',
    scope: 'project',
    unreadCount: 3,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    lastMessage: 'Nova: Les composants ResizablePanels sont prêts pour review...',
    participants: ['Vous', 'Nova', 'Marc'],
    sphereId: 'business',
    sphereEmoji: '💼',
  },
  {
    id: 't2',
    title: 'Budget Q1 Analysis',
    status: 'active',
    scope: 'shared',
    unreadCount: 0,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    lastMessage: 'Les projections montrent une croissance de 15%...',
    participants: ['Vous', 'Nova'],
    sphereId: 'business',
    sphereEmoji: '💼',
  },
  {
    id: 't3',
    title: 'Personal Goals 2025',
    status: 'active',
    scope: 'personal',
    unreadCount: 1,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastMessage: 'Nova a suggéré 3 nouvelles actions pour vos objectifs...',
    participants: ['Vous', 'Nova'],
    sphereId: 'personal',
    sphereEmoji: '🏠',
  },
];

const mockMeetings: MeetingSummary[] = [
  {
    id: 'm1',
    title: 'Sprint Planning - V50',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    duration: 60,
    meetingType: 'sync',
    participantCount: 5,
    isHost: true,
    sphereId: 'business',
    sphereEmoji: '💼',
    hasAgenda: true,
  },
  {
    id: 'm2',
    title: 'Client Presentation',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    duration: 45,
    meetingType: 'hybrid',
    participantCount: 8,
    isHost: false,
    sphereId: 'business',
    sphereEmoji: '💼',
    hasAgenda: true,
  },
  {
    id: 'm3',
    title: 'Team Retrospective',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    duration: 30,
    meetingType: 'xr_spatial',
    participantCount: 4,
    isHost: true,
    sphereId: 'my_team',
    sphereEmoji: '🤝',
    hasAgenda: false,
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'mention',
    title: 'Marc vous a mentionné',
    message: 'dans "Architecture V50 Discussion"',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    read: false,
    priority: 'high',
    action: { type: 'open_thread', targetId: 't1', label: 'Voir' },
  },
  {
    id: 'n2',
    type: 'meeting',
    title: 'Réunion dans 30 min',
    message: 'Sprint Planning - V50',
    timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    read: false,
    priority: 'urgent',
    action: { type: 'join_meeting', targetId: 'm1', label: 'Rejoindre' },
  },
  {
    id: 'n3',
    type: 'task',
    title: '3 tâches dues aujourd\'hui',
    message: 'Dont 1 urgente: Review PR #234',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    priority: 'normal',
    action: { type: 'open_tasks', targetId: 'today', label: 'Voir les tâches' },
  },
  {
    id: 'n4',
    type: 'agent',
    title: 'Nova a terminé l\'analyse',
    message: 'Rapport de données Q4 disponible',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: true,
    priority: 'normal',
    action: { type: 'view_report', targetId: 'r1', label: 'Voir le rapport' },
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Mise à jour CHE·NU V50',
    message: 'Nouvelles fonctionnalités disponibles',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    priority: 'low',
  },
];

// Mock Email Accounts — Boîte CHE·NU + Providers externes
const mockEmailAccounts: EmailAccount[] = [
  {
    id: 'chenu',
    name: 'CHE·NU Mail',
    email: 'jo@chenu.io',
    provider: 'chenu',
    icon: '✧',
    color: '#D8B26A', // Sacred Gold
    unreadCount: 2,
    connected: true,
    lastSync: new Date().toISOString(),
    isNative: true, // Boîte native CHE·NU
  },
  {
    id: 'gmail1',
    name: 'Gmail Personnel',
    email: 'jo@gmail.com',
    provider: 'gmail',
    icon: '📧',
    color: '#EA4335',
    unreadCount: 12,
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    isNative: false,
  },
  {
    id: 'outlook1',
    name: 'Outlook Pro',
    email: 'jo@entreprise.com',
    provider: 'outlook',
    icon: '📨',
    color: '#0078D4',
    unreadCount: 5,
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isNative: false,
  },
  {
    id: 'icloud1',
    name: 'iCloud',
    email: 'jo@icloud.com',
    provider: 'icloud',
    icon: '☁️',
    color: '#3693F3',
    unreadCount: 0,
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    isNative: false,
  },
];

// Mock Emails — Incluant emails CHE·NU natifs
const mockEmails: Email[] = [
  // Emails CHE·NU natifs (internes)
  {
    id: 'e0',
    from: { name: 'Nova', email: 'nova@chenu.io' },
    to: ['jo@chenu.io'],
    subject: 'Résumé hebdomadaire de vos threads',
    preview: 'Vous avez 5 threads actifs cette semaine. Voici les points clés...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    starred: false,
    hasAttachments: false,
    folder: 'inbox',
    labels: ['nova', 'système'],
    accountId: 'chenu',
    accountName: 'CHE·NU Mail',
    priority: 'normal',
    isInternal: true,
  },
  {
    id: 'e00',
    from: { name: 'Équipe CHE·NU', email: 'team@chenu.io' },
    to: ['jo@chenu.io'],
    subject: 'Invitation: Projet V50 Architecture',
    preview: 'Marc vous invite à collaborer sur le projet V50...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
    starred: true,
    hasAttachments: false,
    folder: 'inbox',
    labels: ['collaboration', 'projet'],
    accountId: 'chenu',
    accountName: 'CHE·NU Mail',
    priority: 'high',
    isInternal: true,
  },
  // Emails externes (providers connectés)
  {
    id: 'e1',
    from: { name: 'Marc Dupont', email: 'marc@entreprise.com' },
    to: ['jo@entreprise.com'],
    subject: 'RE: Review des composants V50',
    preview: 'J\'ai terminé la review des ResizablePanels. Quelques suggestions...',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    starred: true,
    hasAttachments: true,
    attachmentCount: 2,
    folder: 'inbox',
    labels: ['work', 'important'],
    accountId: 'outlook1',
    accountName: 'Outlook Pro',
    priority: 'high',
    isInternal: false,
  },
  {
    id: 'e2',
    from: { name: 'GitHub', email: 'noreply@github.com' },
    to: ['jo@gmail.com'],
    subject: '[CHE-NU/v50] PR #234 needs your review',
    preview: 'jonathandumont requested your review on Pull Request #234...',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    starred: false,
    hasAttachments: false,
    folder: 'inbox',
    labels: ['github', 'dev'],
    accountId: 'gmail1',
    accountName: 'Gmail Personnel',
    priority: 'normal',
    isInternal: false,
  },
  {
    id: 'e3',
    from: { name: 'Client Important', email: 'contact@bigclient.com' },
    to: ['jo@entreprise.com'],
    subject: 'Confirmation réunion de demain',
    preview: 'Bonjour, je confirme notre réunion de demain à 14h...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    starred: true,
    hasAttachments: true,
    attachmentCount: 1,
    folder: 'inbox',
    labels: ['client'],
    accountId: 'outlook1',
    accountName: 'Outlook Pro',
    priority: 'high',
    isInternal: false,
  },
  {
    id: 'e4',
    from: { name: 'Newsletter Tech', email: 'news@techdigest.com' },
    to: ['jo@gmail.com'],
    subject: 'Les tendances AI 2025',
    preview: 'Cette semaine: LLMs, Agents autonomes, et gouvernance IA...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    starred: false,
    hasAttachments: false,
    folder: 'inbox',
    labels: ['newsletter'],
    accountId: 'gmail1',
    accountName: 'Gmail Personnel',
    priority: 'low',
    isInternal: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK CONNECTED APPS — Organisés par catégorie avec notes API
// ═══════════════════════════════════════════════════════════════════════════════

const mockConnectedApps: ConnectedApp[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // MESSAGING — Apps de messagerie avec API légales
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    category: 'messaging',
    description: 'Messagerie d\'équipe',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    unreadCount: 8,
    permissions: ['read_messages', 'send_messages', 'read_channels'],
    color: '#4A154B',
    status: 'active',
    hasOfficialAPI: true,
    actions: [
      { id: 'open', label: 'Ouvrir', icon: '↗️' },
      { id: 'sync', label: 'Sync', icon: '🔄' },
    ],
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '🎮',
    category: 'messaging',
    description: 'Serveurs et communautés',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 15,
    permissions: ['read_messages', 'send_messages', 'manage_webhooks'],
    color: '#5865F2',
    status: 'active',
    hasOfficialAPI: true,
    apiNote: 'Bot API — lectures seules des canaux autorisés',
  },
  {
    id: 'whatsapp_business',
    name: 'WhatsApp Business',
    icon: '📱',
    category: 'messaging',
    description: 'Messagerie business',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    unreadCount: 3,
    permissions: ['read_messages', 'send_messages', 'templates'],
    color: '#25D366',
    status: 'active',
    hasOfficialAPI: true,
    apiNote: 'API Business officielle — comptes entreprise uniquement',
  },
  {
    id: 'sms_twilio',
    name: 'SMS (Twilio)',
    icon: '📲',
    category: 'messaging',
    description: 'Messages SMS via Twilio',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    unreadCount: 1,
    permissions: ['send_sms', 'read_sms', 'phone_numbers'],
    color: '#F22F46',
    status: 'active',
    hasOfficialAPI: true,
  },
  {
    id: 'messenger_business',
    name: 'Messenger Business',
    icon: '💭',
    category: 'messaging',
    description: 'Pages entreprise uniquement',
    connected: false,
    permissions: [],
    color: '#0084FF',
    status: 'disconnected',
    hasOfficialAPI: true,
    apiNote: '⚠️ Pages Facebook Business SEULEMENT — comptes personnels non supportés',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MEETINGS — Intégrations pour rejoindre des réunions externes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'teams_meetings',
    name: 'Microsoft Teams',
    icon: '👥',
    category: 'meetings',
    description: 'Réunions Teams',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    permissions: ['join_meetings', 'read_calendar', 'create_meetings'],
    color: '#6264A7',
    status: 'active',
    hasOfficialAPI: true,
    actions: [
      { id: 'join', label: 'Rejoindre', icon: '📹' },
      { id: 'schedule', label: 'Planifier', icon: '📅' },
    ],
  },
  {
    id: 'zoom',
    name: 'Zoom',
    icon: '📹',
    category: 'meetings',
    description: 'Visioconférence Zoom',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    permissions: ['join_meetings', 'create_meetings', 'recordings'],
    color: '#2D8CFF',
    status: 'active',
    hasOfficialAPI: true,
    actions: [
      { id: 'join', label: 'Rejoindre', icon: '📹' },
      { id: 'schedule', label: 'Planifier', icon: '📅' },
    ],
  },
  {
    id: 'google_meet',
    name: 'Google Meet',
    icon: '🎥',
    category: 'meetings',
    description: 'Réunions Google',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    permissions: ['join_meetings', 'create_meetings'],
    color: '#00897B',
    status: 'active',
    hasOfficialAPI: true,
  },
  {
    id: 'webex',
    name: 'Webex',
    icon: '🌐',
    category: 'meetings',
    description: 'Cisco Webex Meetings',
    connected: false,
    permissions: [],
    color: '#00BCF2',
    status: 'disconnected',
    hasOfficialAPI: true,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STORAGE — Stockage cloud
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gdrive',
    name: 'Google Drive',
    icon: '📁',
    category: 'storage',
    description: 'Stockage cloud Google',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    permissions: ['read_files', 'write_files', 'share'],
    color: '#4285F4',
    status: 'syncing',
    hasOfficialAPI: true,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    category: 'storage',
    description: 'Stockage Dropbox',
    connected: false,
    permissions: [],
    color: '#0061FF',
    status: 'disconnected',
    hasOfficialAPI: true,
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    category: 'storage',
    description: 'Stockage Microsoft',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    permissions: ['read_files', 'write_files'],
    color: '#0078D4',
    status: 'active',
    hasOfficialAPI: true,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CALENDAR — Calendriers
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gcal',
    name: 'Google Calendar',
    icon: '📅',
    category: 'calendar',
    description: 'Calendrier Google',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    permissions: ['read_events', 'write_events', 'reminders'],
    color: '#4285F4',
    status: 'active',
    hasOfficialAPI: true,
  },
  {
    id: 'outlook_cal',
    name: 'Outlook Calendar',
    icon: '📆',
    category: 'calendar',
    description: 'Calendrier Microsoft',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    permissions: ['read_events', 'write_events'],
    color: '#0078D4',
    status: 'active',
    hasOfficialAPI: true,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCTIVITY — Outils de productivité
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'notion',
    name: 'Notion',
    icon: '📝',
    category: 'productivity',
    description: 'Notes et documentation',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    permissions: ['read_pages', 'write_pages', 'databases'],
    color: '#000000',
    status: 'active',
    hasOfficialAPI: true,
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: '🎨',
    category: 'productivity',
    description: 'Design collaboratif',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    permissions: ['read_files', 'comments'],
    color: '#F24E1E',
    status: 'active',
    hasOfficialAPI: true,
  },
  {
    id: 'miro',
    name: 'Miro',
    icon: '🖼️',
    category: 'productivity',
    description: 'Tableaux blancs collaboratifs',
    connected: false,
    permissions: [],
    color: '#FFD02F',
    status: 'disconnected',
    hasOfficialAPI: true,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECT — Gestion de projet
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'jira',
    name: 'Jira',
    icon: '🎯',
    category: 'project',
    description: 'Gestion de projet Atlassian',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    unreadCount: 2,
    permissions: ['read_issues', 'write_issues', 'transitions'],
    color: '#0052CC',
    status: 'active',
    hasOfficialAPI: true,
  },
  {
    id: 'asana',
    name: 'Asana',
    icon: '✅',
    category: 'project',
    description: 'Gestion de tâches',
    connected: false,
    permissions: [],
    color: '#F06A6A',
    status: 'disconnected',
    hasOfficialAPI: true,
  },
  {
    id: 'linear',
    name: 'Linear',
    icon: '📊',
    category: 'project',
    description: 'Issue tracking moderne',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unreadCount: 1,
    permissions: ['read_issues', 'write_issues'],
    color: '#5E6AD2',
    status: 'active',
    hasOfficialAPI: true,
  },
  {
    id: 'trello',
    name: 'Trello',
    icon: '📋',
    category: 'project',
    description: 'Kanban boards',
    connected: false,
    permissions: [],
    color: '#0079BF',
    status: 'disconnected',
    hasOfficialAPI: true,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DEVELOPER — Outils de développement
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    category: 'developer',
    description: 'Repositories et PRs',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    unreadCount: 4,
    permissions: ['read_repos', 'read_notifications', 'write_issues'],
    color: '#24292E',
    status: 'active',
    hasOfficialAPI: true,
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    icon: '🦊',
    category: 'developer',
    description: 'DevOps platform',
    connected: false,
    permissions: [],
    color: '#FC6D26',
    status: 'disconnected',
    hasOfficialAPI: true,
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    icon: '🪣',
    category: 'developer',
    description: 'Atlassian Git',
    connected: false,
    permissions: [],
    color: '#0052CC',
    status: 'disconnected',
    hasOfficialAPI: true,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CRM — Relation client
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'salesforce',
    name: 'Salesforce',
    icon: '☁️',
    category: 'crm',
    description: 'CRM Salesforce',
    connected: false,
    permissions: [],
    color: '#00A1E0',
    status: 'disconnected',
    hasOfficialAPI: true,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '🧲',
    category: 'crm',
    description: 'CRM et marketing',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    permissions: ['read_contacts', 'write_contacts', 'deals'],
    color: '#FF7A59',
    status: 'active',
    hasOfficialAPI: true,
  },
];

// Mock App Messages (unified inbox from all apps)
const mockAppMessages: AppMessage[] = [
  {
    id: 'am1',
    appId: 'slack',
    appName: 'Slack',
    appIcon: '💬',
    type: 'mention',
    title: '@vous dans #dev-team',
    content: 'Marc: @jo peux-tu regarder le PR quand tu as un moment?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    sender: { name: 'Marc Dupont' },
  },
  {
    id: 'am2',
    appId: 'whatsapp_business',
    appName: 'WhatsApp Business',
    appIcon: '📱',
    type: 'message',
    title: 'Nouveau message client',
    content: 'Bonjour, je voudrais avoir plus d\'infos sur vos services...',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    sender: { name: 'Client Potentiel' },
  },
  {
    id: 'am3',
    appId: 'discord',
    appName: 'Discord',
    appIcon: '🎮',
    type: 'mention',
    title: 'Mention dans #announcements',
    content: '@everyone New CHE·NU V50 release is now live!',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read: false,
    sender: { name: 'DevBot' },
  },
  {
    id: 'am4',
    appId: 'github',
    appName: 'GitHub',
    appIcon: '🐙',
    type: 'notification',
    title: 'PR #234 approved',
    content: 'Your pull request has been approved by 2 reviewers',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    actionUrl: 'https://github.com/che-nu/v50/pull/234',
  },
  {
    id: 'am5',
    appId: 'jira',
    appName: 'Jira',
    appIcon: '🎯',
    type: 'task',
    title: 'CHENU-456 assigned to you',
    content: 'Implement ResizablePanels component',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
  },
  {
    id: 'am6',
    appId: 'teams_meetings',
    appName: 'Teams',
    appIcon: '👥',
    type: 'event',
    title: 'Invitation: Sprint Review',
    content: 'Sophie vous invite à rejoindre une réunion Teams',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    read: true,
    sender: { name: 'Sophie Martin' },
  },
  {
    id: 'am7',
    appId: 'sms_twilio',
    appName: 'SMS',
    appIcon: '📲',
    type: 'message',
    title: 'SMS de +1 514-XXX-XXXX',
    content: 'Votre code de vérification est: 847291',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: true,
  },
  {
    id: 'am8',
    appId: 'gcal',
    appName: 'Google Calendar',
    appIcon: '📅',
    type: 'event',
    title: 'Rappel: Sprint Planning dans 1h',
    content: 'Sprint Planning - V50 avec 5 participants',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
  },
  {
    id: 'am9',
    appId: 'zoom',
    appName: 'Zoom',
    appIcon: '📹',
    type: 'notification',
    title: 'Réunion démarrée',
    content: 'Client Presentation - Cliquez pour rejoindre',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    read: false,
    actionUrl: 'https://zoom.us/j/123456789',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK CONTACTS
// ═══════════════════════════════════════════════════════════════════════════════

const mockContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Marc Dupont',
    email: 'marc@entreprise.com',
    phone: '+1 514-555-0101',
    status: 'online',
    favorite: true,
    company: 'CHE·NU Labs',
    role: 'Lead Developer',
    source: 'chenu',
    tags: ['my_team', 'dev'],
  },
  {
    id: 'c2',
    name: 'Sophie Martin',
    email: 'sophie@entreprise.com',
    phone: '+1 514-555-0102',
    status: 'away',
    lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    favorite: true,
    company: 'CHE·NU Labs',
    role: 'Product Designer',
    source: 'chenu',
    tags: ['my_team', 'design'],
  },
  {
    id: 'c3',
    name: 'Client Important',
    email: 'contact@bigclient.com',
    phone: '+1 438-555-0201',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    favorite: true,
    company: 'BigClient Inc.',
    role: 'CEO',
    source: 'outlook',
    tags: ['client', 'vip'],
  },
  {
    id: 'c4',
    name: 'Alex Chen',
    email: 'alex@startup.io',
    phone: '+1 514-555-0301',
    status: 'busy',
    favorite: false,
    company: 'Startup.io',
    role: 'CTO',
    source: 'google',
    tags: ['partner'],
  },
  {
    id: 'c5',
    name: 'Marie Tremblay',
    email: 'marie@freelance.com',
    status: 'online',
    favorite: false,
    role: 'Freelance Designer',
    source: 'manual',
    tags: ['freelance'],
  },
  {
    id: 'c6',
    name: 'Jean-Pierre Roy',
    email: 'jp@gouvernement.gc.ca',
    phone: '+1 613-555-0001',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    favorite: false,
    company: 'Gouvernement du Canada',
    role: 'Directeur IT',
    source: 'outlook',
    tags: ['gov', 'client'],
  },
  {
    id: 'c7',
    name: 'Émilie Gagnon',
    email: 'emilie@chenu.io',
    phone: '+1 514-555-0103',
    status: 'online',
    favorite: true,
    company: 'CHE·NU Labs',
    role: 'Backend Developer',
    source: 'chenu',
    tags: ['my_team', 'dev'],
  },
  {
    id: 'c8',
    name: 'David Kim',
    email: 'david@investor.vc',
    phone: '+1 416-555-0401',
    status: 'away',
    favorite: true,
    company: 'Investor VC',
    role: 'Partner',
    source: 'manual',
    tags: ['investor'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK CALL HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

const mockCallHistory: CallHistory[] = [
  {
    id: 'call1',
    type: 'video',
    direction: 'outgoing',
    participant: { id: 'c1', name: 'Marc Dupont' },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    duration: 1245, // 20 min 45 sec
    status: 'completed',
  },
  {
    id: 'call2',
    type: 'audio',
    direction: 'incoming',
    participant: { id: 'c3', name: 'Client Important' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    duration: 542,
    status: 'completed',
  },
  {
    id: 'call3',
    type: 'video',
    direction: 'incoming',
    participant: { id: 'c2', name: 'Sophie Martin' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    status: 'missed',
  },
  {
    id: 'call4',
    type: 'audio',
    direction: 'outgoing',
    participant: { id: 'c4', name: 'Alex Chen' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    duration: 180,
    status: 'completed',
  },
  {
    id: 'call5',
    type: 'video',
    direction: 'incoming',
    participant: { id: 'c8', name: 'David Kim' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'declined',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  // Container — utilise bgRoot (fond global)
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: CHENU_COLORS.bgRoot,
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
    overflow: 'hidden',
  },
  
  // Header — utilise surface1 (cards/panels)
  header: {
    padding: '16px 20px',
    backgroundColor: CHENU_COLORS.surface1,
    borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Inset top subtle
    boxShadow: CHENU_COLORS.shadowInsetTop,
  },
  
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  titleIcon: {
    fontSize: '20px',
  },
  
  titleText: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  
  // Tabs — séparation subtile
  tabs: {
    display: 'flex',
    padding: '0 16px',
    gap: '4px',
    backgroundColor: CHENU_COLORS.bgRoot,
    borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
  },
  
  tab: {
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.ancientStone,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.15s ease',
  },
  
  tabActive: {
    color: CHENU_COLORS.sacredGold,
  },
  
  tabIndicator: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: CHENU_COLORS.sacredGold,
    borderRadius: '2px 2px 0 0',
  },
  
  tabBadge: {
    minWidth: '18px',
    height: '18px',
    padding: '0 5px',
    borderRadius: '9px',
    fontSize: '11px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Content — fond légèrement plus profond
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: CHENU_COLORS.bgRootDeeper,
  },
  
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: CHENU_COLORS.bgRootDeeper,
  },
  
  // Nova Chat
  novaContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  
  message: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: CHENU_COLORS.jungleEmerald + '33',
    borderBottomRightRadius: '4px',
  },
  
  messageNova: {
    alignSelf: 'flex-start',
    backgroundColor: CHENU_COLORS.surface1,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    borderBottomLeftRadius: '4px',
    boxShadow: `${CHENU_COLORS.shadowInsetTop}, ${CHENU_COLORS.shadowSurface}`,
  },
  
  messageSystem: {
    alignSelf: 'center',
    backgroundColor: CHENU_COLORS.surface1,
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    padding: '8px 16px',
  },
  
  novaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  
  novaAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${CHENU_COLORS.novaPrimary}, ${CHENU_COLORS.sacredGold})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
  
  novaName: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.novaPrimary,
  },
  
  // Chat Input
  inputContainer: {
    padding: '16px',
    borderTop: `1px solid ${CHENU_COLORS.borderDefault}`,
  },
  
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  textInput: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: CHENU_COLORS.bgTertiary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    borderRadius: '12px',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
  },
  
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: CHENU_COLORS.novaPrimary,
    color: CHENU_COLORS.bgPrimary,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.15s ease, opacity 0.15s ease',
  },
  
  voiceButton: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  
  voiceButtonActive: {
    backgroundColor: CHENU_COLORS.error + '22',
    borderColor: CHENU_COLORS.error,
    color: CHENU_COLORS.error,
    animation: 'pulse 1.5s infinite',
  },
  
  // Quick Actions
  quickActions: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    overflowX: 'auto',
    borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
  },
  
  quickAction: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
  },
  
  // Thread Card
  threadCard: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: CHENU_COLORS.bgSecondary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  threadHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  
  threadTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  threadMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
  },
  
  threadPreview: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  unreadBadge: {
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.bgPrimary,
    fontSize: '11px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Meeting Card
  meetingCard: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: CHENU_COLORS.bgSecondary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  meetingTime: {
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  
  meetingTimeUrgent: {
    color: CHENU_COLORS.error,
  },
  
  meetingTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  meetingMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  meetingActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  
  joinButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.jungleEmerald,
    color: 'white',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  
  // Notification Card
  notificationCard: {
    padding: '14px 16px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.bgSecondary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    marginBottom: '8px',
    display: 'flex',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  notificationUnread: {
    backgroundColor: CHENU_COLORS.bgTertiary,
    borderColor: CHENU_COLORS.borderHover,
  },
  
  notificationIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  
  notificationTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  
  notificationMessage: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '4px',
  },
  
  notificationTime: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  notificationAction: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  
  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center' as const,
  },
  
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  
  emptyMessage: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    maxWidth: '280px',
  },
  
  // Status indicator
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EMAIL STYLES
  // ═══════════════════════════════════════════════════════════════════════════
  
  emailAccountsBar: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
    overflowX: 'auto',
  },
  
  emailAccountChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
  },
  
  emailAccountChipActive: {
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    borderColor: CHENU_COLORS.sacredGold,
  },
  
  emailCard: {
    padding: '14px 16px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.bgSecondary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  emailCardUnread: {
    backgroundColor: CHENU_COLORS.bgTertiary,
    borderColor: CHENU_COLORS.borderHover,
  },
  
  emailHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  
  emailSender: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  emailAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.sacredGold + '33',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    flexShrink: 0,
  },
  
  emailSenderInfo: {
    minWidth: 0,
  },
  
  emailSenderName: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  
  emailSubject: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  emailPreview: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  emailMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  
  emailTime: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  emailStar: {
    fontSize: '14px',
    cursor: 'pointer',
  },
  
  emailLabels: {
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
  },
  
  emailLabel: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 500,
    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
    color: CHENU_COLORS.jungleEmerald,
  },
  
  emailAttachment: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Compose button
  composeButton: {
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.bgPrimary,
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: `0 4px 20px ${CHENU_COLORS.sacredGold}44`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    zIndex: 100,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONNECTED APPS STYLES
  // ═══════════════════════════════════════════════════════════════════════════
  
  appsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px',
    padding: '16px',
  },
  
  appCard: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: CHENU_COLORS.bgSecondary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'center' as const,
  },
  
  appCardDisconnected: {
    opacity: 0.6,
  },
  
  appIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  
  appName: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  
  appStatus: {
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  
  appBadge: {
    minWidth: '18px',
    height: '18px',
    padding: '0 5px',
    borderRadius: '9px',
    backgroundColor: CHENU_COLORS.error,
    color: 'white',
    fontSize: '10px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute' as const,
    top: '-4px',
    right: '-4px',
  },
  
  appCardWrapper: {
    position: 'relative' as const,
  },
  
  // App Messages (unified inbox)
  appMessageCard: {
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.bgSecondary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    marginBottom: '8px',
    display: 'flex',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  appMessageUnread: {
    backgroundColor: CHENU_COLORS.bgTertiary,
    borderColor: CHENU_COLORS.borderHover,
  },
  
  appMessageIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  
  appMessageContent: {
    flex: 1,
    minWidth: 0,
  },
  
  appMessageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  
  appMessageTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  
  appMessageBody: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  // Category filter
  categoryFilter: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
    overflowX: 'auto',
  },
  
  categoryChip: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
  },
  
  categoryChipActive: {
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    borderColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.sacredGold,
  },
  
  // Connect App Button
  connectAppButton: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '12px',
    border: `2px dashed ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  // Sync indicator
  syncIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    padding: '8px 16px',
    backgroundColor: CHENU_COLORS.bgSecondary,
    borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
};

const formatMeetingTime = (timestamp: string): { text: string; isUrgent: boolean } => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 0) return { text: 'En cours', isUrgent: true };
  if (diffMins < 5) return { text: 'Maintenant', isUrgent: true };
  if (diffMins < 60) return { text: `Dans ${diffMins} min`, isUrgent: diffMins <= 15 };
  if (diffMins < 120) return { text: `Dans 1h${diffMins % 60 > 0 ? ` ${diffMins % 60}m` : ''}`, isUrgent: false };
  
  return {
    text: date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    isUrgent: false,
  };
};

const getNotificationIcon = (type: Notification['type']): { emoji: string; bg: string } => {
  switch (type) {
    case 'thread': return { emoji: '💬', bg: CHENU_COLORS.cenoteTurquoise + '22' };
    case 'meeting': return { emoji: '📅', bg: CHENU_COLORS.jungleEmerald + '22' };
    case 'task': return { emoji: '✅', bg: CHENU_COLORS.sacredGold + '22' };
    case 'agent': return { emoji: '🤖', bg: CHENU_COLORS.novaPrimary + '22' };
    case 'mention': return { emoji: '@', bg: CHENU_COLORS.info + '22' };
    case 'system': return { emoji: '⚙️', bg: CHENU_COLORS.ancientStone + '22' };
    default: return { emoji: '🔔', bg: CHENU_COLORS.ancientStone + '22' };
  }
};

const getPriorityColor = (priority: Notification['priority']): string => {
  switch (priority) {
    case 'urgent': return CHENU_COLORS.error;
    case 'high': return CHENU_COLORS.warning;
    case 'normal': return CHENU_COLORS.ancientStone;
    case 'low': return CHENU_COLORS.ancientStone;
    default: return CHENU_COLORS.ancientStone;
  }
};

const getScopeColor = (scope: ThreadSummary['scope']): string => {
  switch (scope) {
    case 'personal': return CHENU_COLORS.cenoteTurquoise;
    case 'shared': return CHENU_COLORS.jungleEmerald;
    case 'project': return CHENU_COLORS.sacredGold;
    default: return CHENU_COLORS.ancientStone;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  currentSphereId,
  onOpenThread,
  onOpenMeeting,
  onNavigateToSphere,
  onCallContact,
  defaultOpen = false,
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // State — Hub visibility
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [notificationPopup, setNotificationPopup] = useState<Notification | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // State — Main
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [activeTab, setActiveTab] = useState<CommunicationTab>('nova');
  const [novaMessages, setNovaMessages] = useState<NovaMessage[]>([
    {
      id: 'welcome',
      role: 'nova',
      content: 'Bonjour! 👋 Je suis Nova, votre intelligence système. Comment puis-je vous aider aujourd\'hui?',
      timestamp: new Date().toISOString(),
      metadata: { suggestions: ['Résumer mes threads actifs', 'Prochaines réunions', 'Tâches prioritaires'] },
    },
  ]);
  const [novaInput, setNovaInput] = useState('');
  const [isNovaTyping, setIsNovaTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const [threads] = useState<ThreadSummary[]>(mockThreads);
  const [meetings] = useState<MeetingSummary[]>(mockMeetings);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Email state
  const [emails] = useState<Email[]>(mockEmails);
  const [emailAccounts] = useState<EmailAccount[]>(mockEmailAccounts);
  const [selectedEmailAccount, setSelectedEmailAccount] = useState<string | null>(null);
  const [selectedEmailFolder, setSelectedEmailFolder] = useState<Email['folder']>('inbox');
  
  // Connected Apps state
  const [connectedApps] = useState<ConnectedApp[]>(mockConnectedApps);
  const [appMessages] = useState<AppMessage[]>(mockAppMessages);
  const [selectedAppCategory, setSelectedAppCategory] = useState<ConnectedApp['category'] | 'all'>('all');
  const [appViewMode, setAppViewMode] = useState<'grid' | 'messages'>('messages');
  
  // ─────────────────────────────────────────────────────────────────────────────
  // State — Contacts
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [contacts] = useState<Contact[]>(mockContacts);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [contactFilter, setContactFilter] = useState<'all' | 'favorites' | 'online'>('all');
  
  // ─────────────────────────────────────────────────────────────────────────────
  // State — Calls
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [callHistory] = useState<CallHistory[]>(mockCallHistory);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [callDialNumber, setCallDialNumber] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Computed
  // ─────────────────────────────────────────────────────────────────────────────
  
  const unreadCount = useMemo(() => ({
    threads: threads.reduce((sum, t) => sum + t.unreadCount, 0),
    notifications: notifications.filter(n => !n.read).length,
    emails: emails.filter(e => !e.read && e.folder === 'inbox').length,
    apps: appMessages.filter(m => !m.read).length,
  }), [threads, notifications, emails, appMessages]);
  
  const totalUnread = useMemo(() => 
    unreadCount.threads + unreadCount.notifications + unreadCount.emails + unreadCount.apps,
    [unreadCount]
  );
  
  const upcomingMeetingsCount = meetings.filter(m => {
    const diff = new Date(m.scheduledAt).getTime() - Date.now();
    return diff > 0 && diff < 1000 * 60 * 60 * 24;
  }).length;
  
  const missedCallsCount = callHistory.filter(c => c.status === 'missed').length;
  
  // Filtered emails based on account and folder
  const filteredEmails = useMemo(() => {
    return emails.filter(e => {
      if (selectedEmailAccount && e.accountId !== selectedEmailAccount) return false;
      if (e.folder !== selectedEmailFolder) return false;
      return true;
    });
  }, [emails, selectedEmailAccount, selectedEmailFolder]);
  
  // Filtered apps based on category
  const filteredApps = useMemo(() => {
    if (selectedAppCategory === 'all') return connectedApps;
    return connectedApps.filter(app => app.category === selectedAppCategory);
  }, [connectedApps, selectedAppCategory]);
  
  // Filtered contacts
  const filteredContacts = useMemo(() => {
    let result = contacts;
    
    // Apply search
    if (contactSearchQuery) {
      const query = contactSearchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.company?.toLowerCase().includes(query)
      );
    }
    
    // Apply filter
    if (contactFilter === 'favorites') {
      result = result.filter(c => c.favorite);
    } else if (contactFilter === 'online') {
      result = result.filter(c => c.status === 'online');
    }
    
    // Sort: online first, then favorites, then alphabetically
    return result.sort((a, b) => {
      if (a.status === 'online' && b.status !== 'online') return -1;
      if (b.status === 'online' && a.status !== 'online') return 1;
      if (a.favorite && !b.favorite) return -1;
      if (b.favorite && !a.favorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [contacts, contactSearchQuery, contactFilter]);
  
  // Online contacts count
  const onlineContactsCount = contacts.filter(c => c.status === 'online').length;
  
  // Total connected apps count
  const connectedAppsCount = connectedApps.filter(app => app.connected).length;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Effects
  // ─────────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [novaMessages]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────
  
  const handleSendMessage = useCallback(async () => {
    if (!novaInput.trim() || isNovaTyping) return;
    
    const userMessage: NovaMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: novaInput,
      timestamp: new Date().toISOString(),
    };
    
    setNovaMessages(prev => [...prev, userMessage]);
    setNovaInput('');
    setIsNovaTyping(true);
    
    // Simulate Nova response
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    const novaResponse: NovaMessage = {
      id: `msg_${Date.now()}_nova`,
      role: 'nova',
      content: `Je comprends votre demande. Voici ce que je peux vous proposer:\n\n• Analyse du contexte actuel\n• Suggestions basées sur vos préférences\n• Actions recommandées\n\nVoulez-vous que j'approfondisse un point particulier?`,
      timestamp: new Date().toISOString(),
      metadata: {
        model: 'claude-sonnet-4-20250514',
        tokensUsed: 142,
        latencyMs: 850,
      },
    };
    
    setNovaMessages(prev => [...prev, novaResponse]);
    setIsNovaTyping(false);
  }, [novaInput, isNovaTyping]);
  
  const handleQuickAction = useCallback((action: string) => {
    setNovaInput(action);
    inputRef.current?.focus();
  }, []);
  
  const handleVoiceToggle = useCallback(() => {
    setIsVoiceActive(prev => !prev);
    // TODO: Implement voice recognition
    if (!isVoiceActive) {
      logger.debug('Voice recording started...');
    } else {
      logger.debug('Voice recording stopped');
    }
  }, [isVoiceActive]);
  
  const handleThreadClick = useCallback((thread: ThreadSummary) => {
    if (onOpenThread) {
      onOpenThread(thread.id);
    } else {
      logger.debug('Opening thread:', thread.id);
    }
  }, [onOpenThread]);
  
  const handleMeetingClick = useCallback((meeting: MeetingSummary) => {
    if (onOpenMeeting) {
      onOpenMeeting(meeting.id);
    } else {
      logger.debug('Opening meeting:', meeting.id);
    }
  }, [onOpenMeeting]);
  
  const handleNotificationClick = useCallback((notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Handle action
    if (notification.action) {
      switch (notification.action.type) {
        case 'open_thread':
          onOpenThread?.(notification.action.targetId);
          break;
        case 'join_meeting':
          onOpenMeeting?.(notification.action.targetId);
          break;
        default:
          logger.debug('Action:', notification.action);
      }
    }
  }, [onOpenThread, onOpenMeeting]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Tabs
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderTabs = () => (
    <div style={styles.tabs}>
      {[
        { id: 'nova' as const, label: 'Nova', icon: '✧', badge: 0 },
        { id: 'threads' as const, label: 'Threads', icon: '💬', badge: unreadCount.threads },
        { id: 'emails' as const, label: 'Emails', icon: '📧', badge: unreadCount.emails },
        { id: 'contacts' as const, label: 'Contacts', icon: '👤', badge: onlineContactsCount },
        { id: 'calls' as const, label: 'Appels', icon: '📞', badge: missedCallsCount },
        { id: 'meetings' as const, label: 'Réunions', icon: '📅', badge: upcomingMeetingsCount },
        { id: 'apps' as const, label: 'Apps', icon: '🔌', badge: unreadCount.apps },
        { id: 'notifications' as const, label: 'Notifs', icon: '🔔', badge: unreadCount.notifications },
      ].map(tab => (
        <button
          key={tab.id}
          style={{
            ...styles.tab,
            ...(activeTab === tab.id ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.badge > 0 && (
            <span style={{
              ...styles.tabBadge,
              backgroundColor: activeTab === tab.id 
                ? CHENU_COLORS.sacredGold 
                : CHENU_COLORS.ancientStone + '44',
              color: activeTab === tab.id 
                ? CHENU_COLORS.bgPrimary 
                : CHENU_COLORS.softSand,
            }}>
              {tab.badge}
            </span>
          )}
          {activeTab === tab.id && <div style={styles.tabIndicator} />}
        </button>
      ))}
    </div>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Nova Chat
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderNovaChat = () => (
    <div style={styles.novaContainer}>
      {/* Quick Actions */}
      <div style={styles.quickActions}>
        {['Résumer mes threads', 'Prochaines réunions', 'Tâches urgentes', 'Rechercher...'].map(action => (
          <button
            key={action}
            style={styles.quickAction}
            onClick={() => handleQuickAction(action)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = CHENU_COLORS.bgHover;
              e.currentTarget.style.borderColor = CHENU_COLORS.borderHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = CHENU_COLORS.borderDefault;
            }}
          >
            {action}
          </button>
        ))}
      </div>
      
      {/* Messages */}
      <div style={styles.messageList}>
        {novaMessages.map(msg => (
          <div key={msg.id}>
            {msg.role === 'nova' && (
              <div style={styles.novaHeader}>
                <div style={styles.novaAvatar}>✧</div>
                <span style={styles.novaName}>Nova</span>
              </div>
            )}
            <div style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.messageUser : {}),
              ...(msg.role === 'nova' ? styles.messageNova : {}),
              ...(msg.role === 'system' ? styles.messageSystem : {}),
            }}>
              {msg.content}
            </div>
            {msg.metadata?.tokensUsed && (
              <div style={{ 
                fontSize: '10px', 
                color: CHENU_COLORS.ancientStone, 
                marginTop: '4px',
                marginLeft: msg.role === 'nova' ? '32px' : 0,
                textAlign: msg.role === 'user' ? 'right' as const : 'left' as const,
              }}>
                {msg.metadata.tokensUsed} tokens • {msg.metadata.latencyMs}ms
              </div>
            )}
          </div>
        ))}
        
        {isNovaTyping && (
          <div style={{ ...styles.message, ...styles.messageNova }}>
            <span style={{ opacity: 0.7 }}>Nova réfléchit...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <button
            style={{
              ...styles.voiceButton,
              ...(isVoiceActive ? styles.voiceButtonActive : {}),
            }}
            onClick={handleVoiceToggle}
            title={isVoiceActive ? 'Arrêter' : 'Parler à Nova'}
          >
            🎤
          </button>
          <input
            ref={inputRef}
            type="text"
            style={styles.textInput}
            placeholder="Demandez à Nova..."
            value={novaInput}
            onChange={(e) => setNovaInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isNovaTyping}
          />
          <button
            style={{
              ...styles.sendButton,
              opacity: novaInput.trim() ? 1 : 0.5,
              cursor: novaInput.trim() ? 'pointer' : 'not-allowed',
            }}
            onClick={handleSendMessage}
            disabled={!novaInput.trim() || isNovaTyping}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Threads
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderThreads = () => (
    <div style={styles.scrollArea}>
      {threads.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💬</div>
          <div style={styles.emptyTitle}>Aucun thread actif</div>
          <div style={styles.emptyMessage}>
            Créez votre premier thread .chenu pour démarrer une ligne de pensée persistante.
          </div>
        </div>
      ) : (
        threads.map(thread => (
          <div
            key={thread.id}
            style={styles.threadCard}
            onClick={() => handleThreadClick(thread)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = CHENU_COLORS.borderHover;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = CHENU_COLORS.borderDefault;
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={styles.threadHeader}>
              <div style={styles.threadTitle}>
                <span>{thread.sphereEmoji}</span>
                <span>{thread.title}</span>
                <span style={{
                  ...styles.statusDot,
                  backgroundColor: getScopeColor(thread.scope),
                }} title={thread.scope} />
              </div>
              {thread.unreadCount > 0 && (
                <span style={styles.unreadBadge}>{thread.unreadCount}</span>
              )}
            </div>
            
            <div style={styles.threadMeta}>
              <span>👥 {thread.participants.length}</span>
              <span>•</span>
              <span>{formatRelativeTime(thread.lastMessageAt)}</span>
            </div>
            
            <div style={styles.threadPreview}>{thread.lastMessage}</div>
          </div>
        ))
      )}
    </div>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Meetings
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderMeetings = () => (
    <div style={styles.scrollArea}>
      {meetings.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📅</div>
          <div style={styles.emptyTitle}>Aucune réunion à venir</div>
          <div style={styles.emptyMessage}>
            Planifiez une réunion pour créer un événement de connaissance.
          </div>
        </div>
      ) : (
        meetings.map(meeting => {
          const timeInfo = formatMeetingTime(meeting.scheduledAt);
          return (
            <div
              key={meeting.id}
              style={styles.meetingCard}
              onClick={() => handleMeetingClick(meeting)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = CHENU_COLORS.borderHover;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = CHENU_COLORS.borderDefault;
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{
                ...styles.meetingTime,
                ...(timeInfo.isUrgent ? styles.meetingTimeUrgent : {}),
              }}>
                {timeInfo.text}
              </div>
              
              <div style={styles.meetingTitle}>
                <span>{meeting.sphereEmoji}</span>
                <span>{meeting.title}</span>
                {meeting.isHost && (
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: CHENU_COLORS.sacredGold + '22',
                    color: CHENU_COLORS.sacredGold,
                  }}>
                    Host
                  </span>
                )}
              </div>
              
              <div style={styles.meetingMeta}>
                <span>⏱️ {meeting.duration} min</span>
                <span>👥 {meeting.participantCount}</span>
                {meeting.meetingType === 'xr_spatial' && <span>🥽 XR</span>}
                {meeting.hasAgenda && <span>📋 Agenda</span>}
              </div>
              
              {timeInfo.isUrgent && (
                <div style={styles.meetingActions}>
                  <button style={styles.joinButton}>
                    Rejoindre
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Notifications
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderNotifications = () => (
    <div style={styles.scrollArea}>
      {notifications.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔔</div>
          <div style={styles.emptyTitle}>Aucune notification</div>
          <div style={styles.emptyMessage}>
            Vous êtes à jour! Les nouvelles notifications apparaîtront ici.
          </div>
        </div>
      ) : (
        notifications.map(notification => {
          const iconInfo = getNotificationIcon(notification.type);
          return (
            <div
              key={notification.id}
              style={{
                ...styles.notificationCard,
                ...(!notification.read ? styles.notificationUnread : {}),
              }}
              onClick={() => handleNotificationClick(notification)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = CHENU_COLORS.borderHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = notification.read 
                  ? CHENU_COLORS.borderDefault 
                  : CHENU_COLORS.borderHover;
              }}
            >
              <div style={{
                ...styles.notificationIcon,
                backgroundColor: iconInfo.bg,
              }}>
                {iconInfo.emoji}
              </div>
              
              <div style={styles.notificationContent}>
                <div style={{
                  ...styles.notificationTitle,
                  color: notification.read ? CHENU_COLORS.ancientStone : CHENU_COLORS.softSand,
                }}>
                  {!notification.read && (
                    <span style={{
                      ...styles.statusDot,
                      backgroundColor: getPriorityColor(notification.priority),
                      display: 'inline-block',
                      marginRight: '8px',
                      verticalAlign: 'middle',
                    }} />
                  )}
                  {notification.title}
                </div>
                <div style={styles.notificationMessage}>{notification.message}</div>
                <div style={styles.notificationTime}>
                  {formatRelativeTime(notification.timestamp)}
                </div>
              </div>
              
              {notification.action && (
                <button
                  style={styles.notificationAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNotificationClick(notification);
                  }}
                >
                  {notification.action.label}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Emails
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderEmails = () => {
    // Calculer les stats par source
    const totalUnread = emailAccounts.reduce((sum, a) => sum + a.unreadCount, 0);
    const chenuAccount = emailAccounts.find(a => a.isNative);
    const externalAccounts = emailAccounts.filter(a => !a.isNative);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* HEADER — Boîte CHE·NU Unifiée */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          padding: '16px',
          borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
          background: `linear-gradient(135deg, ${CHENU_COLORS.sacredGold}11, transparent)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${CHENU_COLORS.sacredGold}, ${CHENU_COLORS.earthEmber})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: CHENU_COLORS.bgPrimary,
                fontWeight: 700,
              }}>
                ✧
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                  Boîte CHE·NU
                </div>
                <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                  {totalUnread} non lu{totalUnread > 1 ? 's' : ''} • {emailAccounts.length} source{emailAccounts.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <button
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: CHENU_COLORS.sacredGold,
                color: CHENU_COLORS.bgPrimary,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ✏️ Composer
            </button>
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* SOURCES — Filtrer par provenance */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div style={styles.emailAccountsBar}>
          {/* Tous les emails */}
          <button
            style={{
              ...styles.emailAccountChip,
              ...(selectedEmailAccount === null ? styles.emailAccountChipActive : {}),
            }}
            onClick={() => setSelectedEmailAccount(null)}
          >
            <span>📥</span>
            <span>Tous</span>
            {totalUnread > 0 && (
              <span style={{
                ...styles.tabBadge,
                backgroundColor: CHENU_COLORS.sacredGold,
                color: CHENU_COLORS.bgPrimary,
              }}>
                {totalUnread}
              </span>
            )}
          </button>
          
          {/* CHE·NU natif en premier */}
          {chenuAccount && (
            <button
              style={{
                ...styles.emailAccountChip,
                ...(selectedEmailAccount === chenuAccount.id ? {
                  ...styles.emailAccountChipActive,
                  borderColor: CHENU_COLORS.sacredGold,
                  backgroundColor: CHENU_COLORS.sacredGold + '22',
                } : {}),
              }}
              onClick={() => setSelectedEmailAccount(chenuAccount.id)}
            >
              <span style={{ fontSize: '14px' }}>✧</span>
              <span>CHE·NU</span>
              {chenuAccount.unreadCount > 0 && (
                <span style={{
                  ...styles.tabBadge,
                  backgroundColor: CHENU_COLORS.sacredGold,
                  color: CHENU_COLORS.bgPrimary,
                }}>
                  {chenuAccount.unreadCount}
                </span>
              )}
            </button>
          )}
          
          {/* Séparateur visuel */}
          <div style={{
            width: '1px',
            height: '20px',
            backgroundColor: CHENU_COLORS.borderDefault,
            margin: '0 4px',
          }} />
          
          {/* Comptes externes */}
          {externalAccounts.map(account => (
            <button
              key={account.id}
              style={{
                ...styles.emailAccountChip,
                ...(selectedEmailAccount === account.id ? {
                  ...styles.emailAccountChipActive,
                  borderColor: account.color,
                } : {}),
              }}
              onClick={() => setSelectedEmailAccount(account.id)}
            >
              <span>{account.icon}</span>
              <span>{account.name}</span>
              {account.unreadCount > 0 && (
                <span style={{
                  ...styles.tabBadge,
                  backgroundColor: account.color,
                  color: 'white',
                  fontSize: '10px',
                  minWidth: '16px',
                  height: '16px',
                }}>
                  {account.unreadCount}
                </span>
              )}
            </button>
          ))}
          
          {/* Bouton ajouter compte */}
          <button
            style={{
              ...styles.emailAccountChip,
              borderStyle: 'dashed',
            }}
            title="Connecter un compte email"
          >
            <span>+</span>
          </button>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* DOSSIERS */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', gap: '4px', padding: '8px 16px', borderBottom: `1px solid ${CHENU_COLORS.borderDefault}` }}>
          {[
            { id: 'inbox' as const, label: 'Réception', icon: '📥' },
            { id: 'sent' as const, label: 'Envoyés', icon: '📤' },
            { id: 'drafts' as const, label: 'Brouillons', icon: '📝' },
            { id: 'archive' as const, label: 'Archives', icon: '📁' },
          ].map(folder => (
            <button
              key={folder.id}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: selectedEmailFolder === folder.id ? CHENU_COLORS.bgTertiary : 'transparent',
                color: selectedEmailFolder === folder.id ? CHENU_COLORS.softSand : CHENU_COLORS.ancientStone,
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedEmailFolder(folder.id)}
            >
              {folder.icon} {folder.label}
            </button>
          ))}
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* LISTE DES EMAILS */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div style={styles.scrollArea}>
          {filteredEmails.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <div style={styles.emptyTitle}>Aucun email</div>
              <div style={styles.emptyMessage}>
                Votre boîte de réception est vide.
              </div>
            </div>
          ) : (
            filteredEmails.map(email => {
              const account = emailAccounts.find(a => a.id === email.accountId);
              const isInternal = email.isInternal;
              
              return (
                <div
                  key={email.id}
                  style={{
                    ...styles.emailCard,
                    ...(!email.read ? styles.emailCardUnread : {}),
                    // Bordure dorée pour emails CHE·NU internes
                    ...(isInternal ? {
                      borderLeft: `3px solid ${CHENU_COLORS.sacredGold}`,
                    } : {}),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = CHENU_COLORS.borderHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = email.read 
                      ? CHENU_COLORS.borderDefault 
                      : CHENU_COLORS.borderHover;
                  }}
                >
                  <div style={styles.emailHeader}>
                    <div style={styles.emailSender}>
                      <div style={{
                        ...styles.emailAvatar,
                        backgroundColor: isInternal 
                          ? CHENU_COLORS.sacredGold + '33'
                          : account?.color + '33' || CHENU_COLORS.ancientStone + '33',
                        color: isInternal 
                          ? CHENU_COLORS.sacredGold
                          : account?.color || CHENU_COLORS.softSand,
                      }}>
                        {isInternal ? '✧' : email.from.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.emailSenderInfo}>
                        <div style={{
                          ...styles.emailSenderName,
                          fontWeight: email.read ? 400 : 600,
                        }}>
                          {email.from.name}
                          {isInternal && (
                            <span style={{
                              marginLeft: '6px',
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: CHENU_COLORS.sacredGold + '22',
                              color: CHENU_COLORS.sacredGold,
                            }}>
                              CHE·NU
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                          {isInternal ? 'Interne' : account?.name || email.accountName}
                        </div>
                      </div>
                    </div>
                    <div style={styles.emailMeta}>
                      <span style={styles.emailTime}>{formatRelativeTime(email.timestamp)}</span>
                      <span 
                        style={{
                          ...styles.emailStar,
                          color: email.starred ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone,
                        }}
                      >
                        {email.starred ? '★' : '☆'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    ...styles.emailSubject,
                    fontWeight: email.read ? 400 : 600,
                  }}>
                    {email.priority === 'high' && <span style={{ color: CHENU_COLORS.error }}>❗</span>}
                    {email.subject}
                  </div>
                  
                  <div style={styles.emailPreview}>{email.preview}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    {email.hasAttachments && (
                      <span style={styles.emailAttachment}>
                        📎 {email.attachmentCount} pièce{email.attachmentCount! > 1 ? 's' : ''} jointe{email.attachmentCount! > 1 ? 's' : ''}
                      </span>
                    )}
                    {email.labels.length > 0 && (
                      <div style={styles.emailLabels}>
                        {email.labels.slice(0, 2).map(label => (
                          <span key={label} style={styles.emailLabel}>{label}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Connected Apps — Organisées par catégorie
  // ─────────────────────────────────────────────────────────────────────────────
  
  const APP_CATEGORIES: { id: AppCategory | 'all'; label: string; icon: string; description: string }[] = [
    { id: 'all', label: 'Toutes', icon: '📱', description: 'Toutes les applications' },
    { id: 'messaging', label: 'Messagerie', icon: '💬', description: 'WhatsApp Business, Slack, Discord, SMS' },
    { id: 'meetings', label: 'Réunions', icon: '📹', description: 'Teams, Zoom, Google Meet' },
    { id: 'storage', label: 'Stockage', icon: '📁', description: 'Drive, Dropbox, OneDrive' },
    { id: 'calendar', label: 'Calendrier', icon: '📅', description: 'Google Calendar, Outlook' },
    { id: 'productivity', label: 'Productivité', icon: '📝', description: 'Notion, Figma, Miro' },
    { id: 'project', label: 'Projet', icon: '🎯', description: 'Jira, Asana, Linear' },
    { id: 'developer', label: 'Dev', icon: '🐙', description: 'GitHub, GitLab' },
    { id: 'crm', label: 'CRM', icon: '🧲', description: 'Salesforce, HubSpot' },
  ];

  const renderApps = () => {
    // Grouper les apps par catégorie
    const appsByCategory = connectedApps.reduce((acc, app) => {
      if (!acc[app.category]) acc[app.category] = [];
      acc[app.category].push(app);
      return acc;
    }, {} as Record<AppCategory, ConnectedApp[]>);
    
    // Calculer le total des messages non lus
    const totalUnreadMessages = appMessages.filter(m => !m.read).length;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HEADER */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${appViewMode === 'messages' ? CHENU_COLORS.sacredGold : CHENU_COLORS.borderDefault}`,
                backgroundColor: appViewMode === 'messages' ? CHENU_COLORS.sacredGold + '22' : 'transparent',
                color: appViewMode === 'messages' ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone,
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onClick={() => setAppViewMode('messages')}
            >
              📬 Messages
              {totalUnreadMessages > 0 && (
                <span style={{
                  ...styles.tabBadge,
                  backgroundColor: CHENU_COLORS.error,
                }}>
                  {totalUnreadMessages}
                </span>
              )}
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${appViewMode === 'grid' ? CHENU_COLORS.sacredGold : CHENU_COLORS.borderDefault}`,
                backgroundColor: appViewMode === 'grid' ? CHENU_COLORS.sacredGold + '22' : 'transparent',
                color: appViewMode === 'grid' ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone,
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onClick={() => setAppViewMode('grid')}
            >
              📱 Applications
            </button>
          </div>
          
          <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
            {connectedAppsCount}/{connectedApps.length} connectées
          </span>
        </div>
        
        {appViewMode === 'messages' ? (
          /* ═════════════════════════════════════════════════════════════════ */
          /* VUE MESSAGES — Boîte unifiée de tous les messages apps */
          /* ═════════════════════════════════════════════════════════════════ */
          <div style={styles.scrollArea}>
            {appMessages.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📭</div>
                <div style={styles.emptyTitle}>Aucun message</div>
                <div style={styles.emptyMessage}>
                  Les messages de vos apps connectées apparaîtront ici.
                </div>
              </div>
            ) : (
              appMessages.map(message => {
                const app = connectedApps.find(a => a.id === message.appId);
                return (
                  <div
                    key={message.id}
                    style={{
                      ...styles.appMessageCard,
                      ...(!message.read ? styles.appMessageUnread : {}),
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = CHENU_COLORS.borderHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = message.read 
                        ? CHENU_COLORS.borderDefault 
                        : CHENU_COLORS.borderHover;
                    }}
                  >
                    <div style={{
                      ...styles.appMessageIcon,
                      backgroundColor: app?.color + '22' || CHENU_COLORS.bgTertiary,
                    }}>
                      {message.appIcon}
                    </div>
                    <div style={styles.appMessageContent}>
                      <div style={styles.appMessageHeader}>
                        <span style={{
                          ...styles.appMessageTitle,
                          fontWeight: message.read ? 400 : 600,
                        }}>
                          {message.title}
                        </span>
                        <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                          {formatRelativeTime(message.timestamp)}
                        </span>
                      </div>
                      <div style={styles.appMessageBody}>{message.content}</div>
                      {message.sender && (
                        <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '4px' }}>
                          de {message.sender.name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════════ */
          /* VUE GRID — Apps organisées par catégorie */
          /* ═════════════════════════════════════════════════════════════════ */
          <>
            {/* Filtres par catégorie */}
            <div style={styles.categoryFilter}>
              {APP_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  style={{
                    ...styles.categoryChip,
                    ...(selectedAppCategory === cat.id ? styles.categoryChipActive : {}),
                  }}
                  onClick={() => setSelectedAppCategory(cat.id)}
                  title={cat.description}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {/* Affichage par catégorie si "Toutes" est sélectionné */}
              {selectedAppCategory === 'all' ? (
                // Vue groupée par catégorie
                Object.entries(appsByCategory).map(([category, apps]) => {
                  if (apps.length === 0) return null;
                  const catInfo = APP_CATEGORIES.find(c => c.id === category);
                  
                  return (
                    <div key={category} style={{ marginBottom: '24px' }}>
                      {/* En-tête catégorie */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
                      }}>
                        <span style={{ fontSize: '16px' }}>{catInfo?.icon}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                          {catInfo?.label}
                        </span>
                        <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                          ({apps.filter(a => a.connected).length}/{apps.length})
                        </span>
                      </div>
                      
                      {/* Grid des apps */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '10px',
                      }}>
                        {apps.map(app => (
                          <div key={app.id} style={styles.appCardWrapper}>
                            <div
                              style={{
                                ...styles.appCard,
                                ...(!app.connected ? styles.appCardDisconnected : {}),
                                padding: '14px',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = app.color || CHENU_COLORS.borderHover;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = CHENU_COLORS.borderDefault;
                                e.currentTarget.style.transform = 'none';
                              }}
                              title={app.apiNote || app.description}
                            >
                              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{app.icon}</div>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: CHENU_COLORS.softSand, marginBottom: '4px' }}>
                                {app.name}
                              </div>
                              <div style={{
                                ...styles.appStatus,
                                color: app.connected 
                                  ? (app.status === 'syncing' ? CHENU_COLORS.warning : CHENU_COLORS.success)
                                  : CHENU_COLORS.ancientStone,
                              }}>
                                <span style={{
                                  ...styles.statusDot,
                                  backgroundColor: app.connected 
                                    ? (app.status === 'syncing' ? CHENU_COLORS.warning : CHENU_COLORS.success)
                                    : CHENU_COLORS.ancientStone,
                                }} />
                                {app.connected 
                                  ? (app.status === 'syncing' ? 'Sync...' : 'Actif')
                                  : 'Non connecté'
                                }
                              </div>
                              
                              {/* Note API si présente */}
                              {app.apiNote && (
                                <div style={{
                                  marginTop: '6px',
                                  fontSize: '9px',
                                  color: CHENU_COLORS.warning,
                                  padding: '2px 4px',
                                  backgroundColor: CHENU_COLORS.warning + '11',
                                  borderRadius: '3px',
                                  textAlign: 'center' as const,
                                }}>
                                  ⚠️ API limitée
                                </div>
                              )}
                            </div>
                            
                            {app.unreadCount && app.unreadCount > 0 && (
                              <span style={styles.appBadge}>{app.unreadCount}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                // Vue filtrée par catégorie sélectionnée
                <div style={styles.appsGrid}>
                  {filteredApps.map(app => (
                    <div key={app.id} style={styles.appCardWrapper}>
                      <div
                        style={{
                          ...styles.appCard,
                          ...(!app.connected ? styles.appCardDisconnected : {}),
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = app.color || CHENU_COLORS.borderHover;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = CHENU_COLORS.borderDefault;
                          e.currentTarget.style.transform = 'none';
                        }}
                        title={app.apiNote || app.description}
                      >
                        <div style={styles.appIcon}>{app.icon}</div>
                        <div style={styles.appName}>{app.name}</div>
                        <div style={{ fontSize: '10px', color: CHENU_COLORS.ancientStone, marginBottom: '6px' }}>
                          {app.description}
                        </div>
                        <div style={{
                          ...styles.appStatus,
                          color: app.connected 
                            ? (app.status === 'syncing' ? CHENU_COLORS.warning : CHENU_COLORS.success)
                            : CHENU_COLORS.ancientStone,
                        }}>
                          <span style={{
                            ...styles.statusDot,
                            backgroundColor: app.connected 
                              ? (app.status === 'syncing' ? CHENU_COLORS.warning : CHENU_COLORS.success)
                              : CHENU_COLORS.ancientStone,
                          }} />
                          {app.connected 
                            ? (app.status === 'syncing' ? 'Sync...' : 'Connecté')
                            : 'Déconnecté'
                          }
                        </div>
                        
                        {/* Note API si présente */}
                        {app.apiNote && (
                          <div style={{
                            marginTop: '8px',
                            fontSize: '9px',
                            color: CHENU_COLORS.warning,
                            padding: '3px 6px',
                            backgroundColor: CHENU_COLORS.warning + '11',
                            borderRadius: '4px',
                          }}>
                            ⚠️ {app.apiNote}
                          </div>
                        )}
                      </div>
                      
                      {app.unreadCount && app.unreadCount > 0 && (
                        <span style={styles.appBadge}>{app.unreadCount}</span>
                      )}
                    </div>
                  ))}
                  
                  {/* Bouton ajouter une app */}
                  <div
                    style={styles.connectAppButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = CHENU_COLORS.sacredGold;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = CHENU_COLORS.borderDefault;
                    }}
                  >
                    <span style={{ fontSize: '24px', marginBottom: '8px', color: CHENU_COLORS.ancientStone }}>+</span>
                    <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                      Connecter
                    </span>
                  </div>
                </div>
              )}
              
              {/* Note légale sur les API */}
              <div style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: CHENU_COLORS.bgSecondary,
                borderRadius: '8px',
                border: `1px solid ${CHENU_COLORS.borderDefault}`,
              }}>
                <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginBottom: '8px' }}>
                  <strong style={{ color: CHENU_COLORS.softSand }}>ℹ️ À propos des intégrations</strong>
                </div>
                <div style={{ fontSize: '10px', color: CHENU_COLORS.ancientStone, lineHeight: 1.5 }}>
                  CHE·NU utilise uniquement les <strong>API officielles</strong> des applications. Certaines 
                  plateformes (comme Messenger ou WhatsApp personnel) n'offrent pas d'API publique — 
                  seules les versions <strong>Business</strong> sont supportées.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Contacts
  // ─────────────────────────────────────────────────────────────────────────────
  
  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online': return CHENU_COLORS.success;
      case 'away': return CHENU_COLORS.warning;
      case 'busy': return CHENU_COLORS.error;
      default: return CHENU_COLORS.ancientStone;
    }
  };
  
  const getStatusLabel = (status: Contact['status']) => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'away': return 'Absent';
      case 'busy': return 'Occupé';
      default: return 'Hors ligne';
    }
  };
  
  const renderContacts = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search & Filters */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${CHENU_COLORS.borderDefault}` }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: CHENU_COLORS.bgSecondary,
          borderRadius: '8px',
          marginBottom: '12px',
        }}>
          <span style={{ color: CHENU_COLORS.ancientStone }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={contactSearchQuery}
            onChange={(e) => setContactSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: CHENU_COLORS.softSand,
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
        
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all' as const, label: 'Tous', count: contacts.length },
            { id: 'favorites' as const, label: '★ Favoris', count: contacts.filter(c => c.favorite).length },
            { id: 'online' as const, label: '● En ligne', count: onlineContactsCount },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setContactFilter(filter.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: contactFilter === filter.id 
                  ? CHENU_COLORS.sacredGold + '22' 
                  : 'transparent',
                color: contactFilter === filter.id 
                  ? CHENU_COLORS.sacredGold 
                  : CHENU_COLORS.ancientStone,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>
      
      {/* Contact List */}
      <div style={styles.scrollArea}>
        {filteredContacts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👤</div>
            <div style={styles.emptyTitle}>Aucun contact</div>
            <div style={styles.emptyMessage}>
              {contactSearchQuery ? 'Aucun contact ne correspond à votre recherche.' : 'Ajoutez des contacts pour commencer.'}
            </div>
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = CHENU_COLORS.bgHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: CHENU_COLORS.sacredGold + '33',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: CHENU_COLORS.sacredGold,
                  fontSize: '16px',
                  fontWeight: 600,
                }}>
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                {/* Status indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(contact.status),
                  border: `2px solid ${CHENU_COLORS.bgPrimary}`,
                }} />
              </div>
              
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: 500, 
                    color: CHENU_COLORS.softSand,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {contact.name}
                  </span>
                  {contact.favorite && (
                    <span style={{ color: CHENU_COLORS.sacredGold, fontSize: '12px' }}>★</span>
                  )}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: CHENU_COLORS.ancientStone,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span>{contact.role || contact.company || contact.email}</span>
                  <span>•</span>
                  <span style={{ color: getStatusColor(contact.status) }}>
                    {getStatusLabel(contact.status)}
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCallContact?.(contact.id, 'audio');
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: CHENU_COLORS.callGreen + '22',
                    color: CHENU_COLORS.callGreen,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                  }}
                  title="Appel audio"
                >
                  📞
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCallContact?.(contact.id, 'video');
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: CHENU_COLORS.info + '22',
                    color: CHENU_COLORS.info,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                  }}
                  title="Appel vidéo"
                >
                  📹
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Add Contact Button */}
      <button
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: CHENU_COLORS.sacredGold,
          color: CHENU_COLORS.bgPrimary,
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Ajouter un contact"
      >
        +
      </button>
    </div>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Calls
  // ─────────────────────────────────────────────────────────────────────────────
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const renderCalls = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Active Call Banner */}
      {activeCall && (
        <div style={{
          padding: '16px',
          background: `linear-gradient(135deg, ${CHENU_COLORS.callGreen}22, ${CHENU_COLORS.callGreen}11)`,
          borderBottom: `1px solid ${CHENU_COLORS.callGreen}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: CHENU_COLORS.callGreen + '33',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite',
            }}>
              {activeCall.type === 'video' ? '📹' : '📞'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                {activeCall.participant.name}
              </div>
              <div style={{ fontSize: '11px', color: CHENU_COLORS.callGreen }}>
                Appel en cours...
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveCall(null)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: CHENU_COLORS.callRed,
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Raccrocher
          </button>
        </div>
      )}
      
      {/* Dialpad Section */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Number Input */}
        <input
          type="tel"
          placeholder="Entrer un numéro..."
          value={callDialNumber}
          onChange={(e) => setCallDialNumber(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '280px',
            padding: '12px 16px',
            fontSize: '20px',
            textAlign: 'center',
            letterSpacing: '2px',
            backgroundColor: CHENU_COLORS.bgSecondary,
            border: `1px solid ${CHENU_COLORS.borderDefault}`,
            borderRadius: '12px',
            color: CHENU_COLORS.softSand,
            outline: 'none',
          }}
        />
        
        {/* Call Buttons */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => {
              if (callDialNumber) {
                setActiveCall({
                  id: `call_${Date.now()}`,
                  type: 'audio',
                  status: 'calling',
                  direction: 'outgoing',
                  participant: { id: 'new', name: callDialNumber },
                });
              }
            }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: CHENU_COLORS.callGreen,
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${CHENU_COLORS.callGreen}44`,
            }}
            title="Appel audio"
          >
            📞
          </button>
          <button
            onClick={() => {
              if (callDialNumber) {
                setActiveCall({
                  id: `call_${Date.now()}`,
                  type: 'video',
                  status: 'calling',
                  direction: 'outgoing',
                  participant: { id: 'new', name: callDialNumber },
                });
              }
            }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: CHENU_COLORS.info,
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${CHENU_COLORS.info}44`,
            }}
            title="Appel vidéo"
          >
            📹
          </button>
        </div>
      </div>
      
      {/* Call History Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
          Historique des appels
        </span>
        <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
          {callHistory.length} appels
        </span>
      </div>
      
      {/* Call History */}
      <div style={styles.scrollArea}>
        {callHistory.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📞</div>
            <div style={styles.emptyTitle}>Aucun appel</div>
            <div style={styles.emptyMessage}>Votre historique d'appels est vide.</div>
          </div>
        ) : (
          callHistory.map(call => (
            <div
              key={call.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
                cursor: 'pointer',
              }}
              onClick={() => {
                setActiveCall({
                  id: `call_${Date.now()}`,
                  type: call.type,
                  status: 'calling',
                  direction: 'outgoing',
                  participant: call.participant,
                });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = CHENU_COLORS.bgHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Call Type Icon */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: call.status === 'missed' 
                  ? CHENU_COLORS.error + '22'
                  : call.status === 'declined'
                    ? CHENU_COLORS.warning + '22'
                    : CHENU_COLORS.callGreen + '22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}>
                {call.type === 'video' ? '📹' : '📞'}
              </div>
              
              {/* Call Info */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  color: call.status === 'missed' ? CHENU_COLORS.error : CHENU_COLORS.softSand 
                }}>
                  {call.participant.name}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: CHENU_COLORS.ancientStone,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span>
                    {call.direction === 'incoming' ? '↙️' : '↗️'}
                    {call.status === 'missed' ? ' Manqué' : call.status === 'declined' ? ' Refusé' : ''}
                  </span>
                  {call.duration && (
                    <>
                      <span>•</span>
                      <span>{formatDuration(call.duration)}</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Time */}
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                {formatRelativeTime(call.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Notification Popup (when hub is closed)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderNotificationPopup = () => {
    if (!showNotificationPopup || !notificationPopup) return null;
    
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '320px',
          backgroundColor: CHENU_COLORS.bgSecondary,
          borderRadius: '12px',
          border: `1px solid ${CHENU_COLORS.borderHover}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          zIndex: 1001,
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: CHENU_COLORS.bgTertiary,
          borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
            Nouvelle notification
          </span>
          <button
            onClick={() => setShowNotificationPopup(false)}
            style={{
              background: 'none',
              border: 'none',
              color: CHENU_COLORS.ancientStone,
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div style={{ padding: '16px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: CHENU_COLORS.softSand,
            marginBottom: '8px',
          }}>
            {notificationPopup.title}
          </div>
          <div style={{ 
            fontSize: '13px', 
            color: CHENU_COLORS.ancientStone,
            marginBottom: '12px',
          }}>
            {notificationPopup.message}
          </div>
          {notificationPopup.action && (
            <button
              onClick={() => {
                handleNotificationClick(notificationPopup);
                setShowNotificationPopup(false);
                setIsOpen(true);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: CHENU_COLORS.sacredGold,
                color: CHENU_COLORS.bgPrimary,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {notificationPopup.action.label}
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render: Floating Button (when hub is closed)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderFloatingButton = () => (
    <div
      onClick={() => setIsOpen(true)}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        backgroundColor: CHENU_COLORS.bgSecondary,
        borderRadius: '30px',
        border: `1px solid ${CHENU_COLORS.borderDefault}`,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: 1000,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = CHENU_COLORS.sacredGold;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 6px 24px rgba(0,0,0,0.4), 0 0 20px ${CHENU_COLORS.sacredGold}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = CHENU_COLORS.borderDefault;
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      }}
    >
      {/* Icon with notification light */}
      <div style={{ position: 'relative' }}>
        <span style={{ fontSize: '20px' }}>💬</span>
        {totalUnread > 0 && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: CHENU_COLORS.error,
            border: `2px solid ${CHENU_COLORS.bgSecondary}`,
            animation: 'pulse 1.5s infinite',
          }} />
        )}
      </div>
      
      <span style={{ 
        fontSize: '14px', 
        fontWeight: 500, 
        color: CHENU_COLORS.softSand,
      }}>
        Communication
      </span>
      
      {totalUnread > 0 && (
        <span style={{
          padding: '2px 8px',
          borderRadius: '10px',
          backgroundColor: CHENU_COLORS.error,
          color: 'white',
          fontSize: '11px',
          fontWeight: 600,
        }}>
          {totalUnread}
        </span>
      )}
    </div>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Main Render
  // ─────────────────────────────────────────────────────────────────────────────
  
  // If hub is closed, show floating button
  if (!isOpen) {
    return (
      <>
        {renderFloatingButton()}
        {renderNotificationPopup()}
        
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </>
    );
  }
  
  // Hub is open
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <span style={styles.titleIcon}>💬</span>
          <span style={styles.titleText}>Communication</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Nova Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: CHENU_COLORS.novaPrimary + '11',
            border: `1px solid ${CHENU_COLORS.novaPrimary}33`,
          }}>
            <span style={{
              ...styles.statusDot,
              backgroundColor: CHENU_COLORS.success,
              boxShadow: `0 0 6px ${CHENU_COLORS.success}`,
            }} />
            <span style={{ fontSize: '12px', color: CHENU_COLORS.novaPrimary }}>
              Nova
            </span>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: CHENU_COLORS.ancientStone,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
            title="Réduire"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      {renderTabs()}
      
      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'nova' && renderNovaChat()}
        {activeTab === 'threads' && renderThreads()}
        {activeTab === 'emails' && renderEmails()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'calls' && renderCalls()}
        {activeTab === 'meetings' && renderMeetings()}
        {activeTab === 'apps' && renderApps()}
        {activeTab === 'notifications' && renderNotifications()}
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Custom scrollbar */
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        *::-webkit-scrollbar-thumb {
          background: ${CHENU_COLORS.ancientStone}44;
          border-radius: 3px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: ${CHENU_COLORS.ancientStone}66;
        }
      `}</style>
    </div>
  );
};

export default CommunicationHub;
