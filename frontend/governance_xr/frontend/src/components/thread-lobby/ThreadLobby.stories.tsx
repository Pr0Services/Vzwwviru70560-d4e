/**
 * STORYBOOK: ThreadLobby.stories.tsx
 * COMPONENTS: ThreadLobby, MaturityBadge, ModeSelector, LiveIndicator
 * 
 * R&D COMPLIANCE: ✅
 * - Demonstrates all UI states
 * - Shows governance flows
 * - Documents component API
 */

import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThreadLobby } from './ThreadLobby';
import { MaturityBadge, MaturityBadgeCompact } from './MaturityBadge';
import { ModeSelector } from './ModeSelector';
import { LiveIndicator, LiveBadgeCompact } from './LiveIndicator';
import { 
  MaturityLevel, 
  ThreadEntryMode, 
  ViewerRole,
  type ThreadLobbyData,
  type MaturityResult,
  type ModeRecommendation
} from '../../types/governance-xr.types';

// ============================================================================
// STORYBOOK SETUP
// ============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
  },
});

const withQueryClient = (Story: React.ComponentType) => (
  <QueryClientProvider client={queryClient}>
    <div className="p-6 bg-gray-50 min-h-screen">
      <Story />
    </div>
  </QueryClientProvider>
);

// ============================================================================
// MOCK DATA
// ============================================================================

const mockMaturitySeed: MaturityResult = {
  thread_id: 'thread-001',
  score: 5,
  level: MaturityLevel.SEED,
  signals: {
    has_founding_intent: true,
    has_decisions: false,
    has_actions: false,
    has_notes: false,
    has_links: false,
    has_summaries: false,
    has_memory_compressed: false,
    total_events: 2,
    days_active: 1,
    has_xr_blueprint: false,
  },
  computed_at: new Date().toISOString(),
  stale_after: new Date(Date.now() + 3600000).toISOString(),
};

const mockMaturityWorkshop: MaturityResult = {
  thread_id: 'thread-002',
  score: 42,
  level: MaturityLevel.WORKSHOP,
  signals: {
    has_founding_intent: true,
    has_decisions: true,
    has_actions: true,
    has_notes: true,
    has_links: true,
    has_summaries: false,
    has_memory_compressed: false,
    total_events: 25,
    days_active: 7,
    has_xr_blueprint: false,
  },
  computed_at: new Date().toISOString(),
  stale_after: new Date(Date.now() + 3600000).toISOString(),
};

const mockMaturityEcosystem: MaturityResult = {
  thread_id: 'thread-003',
  score: 92,
  level: MaturityLevel.ECOSYSTEM,
  signals: {
    has_founding_intent: true,
    has_decisions: true,
    has_actions: true,
    has_notes: true,
    has_links: true,
    has_summaries: true,
    has_memory_compressed: true,
    total_events: 500,
    days_active: 120,
    has_xr_blueprint: true,
  },
  computed_at: new Date().toISOString(),
  stale_after: new Date(Date.now() + 3600000).toISOString(),
};

const mockModeRecommendation: ModeRecommendation = {
  recommended_mode: ThreadEntryMode.CHAT,
  available_modes: [ThreadEntryMode.CHAT],
  reasons: {
    chat: 'Toujours disponible',
    live: 'Requiert niveau Workshop (25+)',
    xr: 'Requiert niveau Workshop (25+)',
  },
};

const mockLobbyDataSeed: ThreadLobbyData = {
  thread_id: 'thread-001',
  thread_title: 'Mon Premier Thread',
  thread_type: 'personal',
  sphere_id: 'sphere-personal',
  sphere_name: 'Personal',
  founding_intent: 'Organiser mes idées et projets personnels',
  maturity: mockMaturitySeed,
  summary: null,
  last_activity: new Date().toISOString(),
  is_live: false,
  live_participants: 0,
  mode_recommendation: mockModeRecommendation,
  viewer_role: ViewerRole.OWNER,
};

const mockLobbyDataWorkshop: ThreadLobbyData = {
  thread_id: 'thread-002',
  thread_title: 'Projet Lancement Produit Q1',
  thread_type: 'collective',
  sphere_id: 'sphere-business',
  sphere_name: 'Business',
  founding_intent: 'Coordonner le lancement du nouveau produit pour Q1 2026',
  maturity: mockMaturityWorkshop,
  summary: 'Le projet avance bien. 3 décisions majeures prises cette semaine concernant le pricing et le positionnement.',
  last_activity: new Date(Date.now() - 3600000).toISOString(),
  is_live: false,
  live_participants: 0,
  mode_recommendation: {
    recommended_mode: ThreadEntryMode.CHAT,
    available_modes: [ThreadEntryMode.CHAT, ThreadEntryMode.LIVE, ThreadEntryMode.XR],
    reasons: {
      chat: 'Toujours disponible',
      live: 'Disponible - niveau Workshop atteint',
      xr: 'Disponible - niveau Workshop atteint',
    },
  },
  viewer_role: ViewerRole.CONTRIBUTOR,
};

const mockLobbyDataLive: ThreadLobbyData = {
  ...mockLobbyDataWorkshop,
  is_live: true,
  live_participants: 4,
};

// ============================================================================
// MATURITY BADGE STORIES
// ============================================================================

const maturityMeta: Meta<typeof MaturityBadge> = {
  title: 'Thread Lobby/MaturityBadge',
  component: MaturityBadge,
  decorators: [withQueryClient],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default maturityMeta;

type MaturityStory = StoryObj<typeof MaturityBadge>;

export const SeedLevel: MaturityStory = {
  args: {
    level: MaturityLevel.SEED,
    score: 5,
  },
};

export const SproutLevel: MaturityStory = {
  args: {
    level: MaturityLevel.SPROUT,
    score: 18,
  },
};

export const WorkshopLevel: MaturityStory = {
  args: {
    level: MaturityLevel.WORKSHOP,
    score: 42,
  },
};

export const StudioLevel: MaturityStory = {
  args: {
    level: MaturityLevel.STUDIO,
    score: 58,
  },
};

export const OrgLevel: MaturityStory = {
  args: {
    level: MaturityLevel.ORG,
    score: 75,
  },
};

export const EcosystemLevel: MaturityStory = {
  args: {
    level: MaturityLevel.ECOSYSTEM,
    score: 92,
  },
};

export const WithSignals: MaturityStory = {
  args: {
    level: MaturityLevel.WORKSHOP,
    score: 42,
    showSignals: true,
    signals: mockMaturityWorkshop.signals,
  },
};

export const CompactVariant: StoryObj<typeof MaturityBadgeCompact> = {
  render: () => (
    <div className="flex gap-4">
      <MaturityBadgeCompact level={MaturityLevel.SEED} />
      <MaturityBadgeCompact level={MaturityLevel.SPROUT} />
      <MaturityBadgeCompact level={MaturityLevel.WORKSHOP} />
      <MaturityBadgeCompact level={MaturityLevel.STUDIO} />
      <MaturityBadgeCompact level={MaturityLevel.ORG} />
      <MaturityBadgeCompact level={MaturityLevel.ECOSYSTEM} />
    </div>
  ),
};

// ============================================================================
// MODE SELECTOR STORIES
// ============================================================================

export const ModeSelectorSeed: StoryObj<typeof ModeSelector> = {
  name: 'Mode Selector - Seed Level',
  render: () => (
    <ModeSelector
      recommendation={mockModeRecommendation}
      onModeSelect={(mode) => console.log('Selected:', mode)}
      isLoading={false}
    />
  ),
};

export const ModeSelectorWorkshop: StoryObj<typeof ModeSelector> = {
  name: 'Mode Selector - Workshop Level',
  render: () => (
    <ModeSelector
      recommendation={{
        recommended_mode: ThreadEntryMode.CHAT,
        available_modes: [ThreadEntryMode.CHAT, ThreadEntryMode.LIVE, ThreadEntryMode.XR],
        reasons: {
          chat: 'Toujours disponible',
          live: 'Disponible - niveau Workshop atteint',
          xr: 'Disponible - niveau Workshop atteint',
        },
      }}
      onModeSelect={(mode) => console.log('Selected:', mode)}
      isLoading={false}
    />
  ),
};

export const ModeSelectorLoading: StoryObj<typeof ModeSelector> = {
  name: 'Mode Selector - Loading',
  render: () => (
    <ModeSelector
      recommendation={mockModeRecommendation}
      onModeSelect={(mode) => console.log('Selected:', mode)}
      isLoading={true}
    />
  ),
};

// ============================================================================
// LIVE INDICATOR STORIES
// ============================================================================

export const LiveIndicatorActive: StoryObj<typeof LiveIndicator> = {
  name: 'Live Indicator - Active',
  render: () => (
    <LiveIndicator
      isLive={true}
      participantCount={4}
      onJoin={() => console.log('Joining live session')}
    />
  ),
};

export const LiveIndicatorInactive: StoryObj<typeof LiveIndicator> = {
  name: 'Live Indicator - Inactive',
  render: () => (
    <LiveIndicator
      isLive={false}
      participantCount={0}
    />
  ),
};

export const LiveBadgeCompactStory: StoryObj<typeof LiveBadgeCompact> = {
  name: 'Live Badge - Compact',
  render: () => (
    <div className="flex gap-4 items-center">
      <LiveBadgeCompact isLive={true} participantCount={3} />
      <LiveBadgeCompact isLive={true} participantCount={12} />
      <LiveBadgeCompact isLive={false} />
    </div>
  ),
};

// ============================================================================
// THREAD LOBBY STORIES
// ============================================================================

export const ThreadLobbySeed: StoryObj<typeof ThreadLobby> = {
  name: 'Thread Lobby - Seed Level',
  render: () => (
    <ThreadLobby
      data={mockLobbyDataSeed}
      onModeSelect={(mode) => console.log('Mode selected:', mode)}
      onRefresh={() => console.log('Refresh requested')}
    />
  ),
};

export const ThreadLobbyWorkshop: StoryObj<typeof ThreadLobby> = {
  name: 'Thread Lobby - Workshop Level',
  render: () => (
    <ThreadLobby
      data={mockLobbyDataWorkshop}
      onModeSelect={(mode) => console.log('Mode selected:', mode)}
      onRefresh={() => console.log('Refresh requested')}
    />
  ),
};

export const ThreadLobbyLive: StoryObj<typeof ThreadLobby> = {
  name: 'Thread Lobby - Live Session Active',
  render: () => (
    <ThreadLobby
      data={mockLobbyDataLive}
      onModeSelect={(mode) => console.log('Mode selected:', mode)}
      onRefresh={() => console.log('Refresh requested')}
    />
  ),
};

export const ThreadLobbyLoading: StoryObj<typeof ThreadLobby> = {
  name: 'Thread Lobby - Loading State',
  render: () => (
    <ThreadLobby
      data={null}
      isLoading={true}
      onModeSelect={(mode) => console.log('Mode selected:', mode)}
      onRefresh={() => console.log('Refresh requested')}
    />
  ),
};

export const ThreadLobbyError: StoryObj<typeof ThreadLobby> = {
  name: 'Thread Lobby - Error State',
  render: () => (
    <ThreadLobby
      data={null}
      error={new Error('Failed to load thread data')}
      onModeSelect={(mode) => console.log('Mode selected:', mode)}
      onRefresh={() => console.log('Refresh requested')}
    />
  ),
};
