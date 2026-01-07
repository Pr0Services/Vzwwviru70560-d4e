/**
 * STORYBOOK: Thread Lobby Components
 * Stories for ThreadLobby, MaturityBadge, ModeSelector, LiveIndicator
 * 
 * @module stories/thread-lobby
 */

import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  ThreadLobby,
  MaturityBadge,
  MaturityBadgeCompact,
  ModeSelector,
  LiveIndicator,
  LiveBadgeCompact
} from '../components/thread-lobby';
import { 
  MaturityLevel, 
  ThreadEntryMode,
  ThreadLobbyData 
} from '../types/governance-xr.types';

// =============================================================================
// STORYBOOK SETUP
// =============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const withQueryClient = (Story: React.ComponentType) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

// =============================================================================
// MATURITY BADGE STORIES
// =============================================================================

const maturityBadgeMeta: Meta<typeof MaturityBadge> = {
  title: 'Thread Lobby/MaturityBadge',
  component: MaturityBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Displays the maturity level of a Thread.

## Maturity Levels
- **Seed (0-9)**: New thread, minimal structure
- **Sprout (10-24)**: Some decisions or actions
- **Workshop (25-44)**: Active development, multiple contributors
- **Studio (45-64)**: Well-structured, regular activity
- **Org (65-84)**: Mature organization-level thread
- **Ecosystem (85-100)**: Fully mature, networked thread
        `,
      },
    },
  },
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5],
      description: 'Maturity level (0-5)',
    },
    score: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Score out of 100',
    },
    showScore: {
      control: 'boolean',
      description: 'Show numeric score',
    },
    showSignals: {
      control: 'boolean',
      description: 'Show signal breakdown',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default maturityBadgeMeta;

type MaturityBadgeStory = StoryObj<typeof MaturityBadge>;

export const Seed: MaturityBadgeStory = {
  args: {
    level: 0,
    score: 5,
    showScore: true,
  },
};

export const Sprout: MaturityBadgeStory = {
  args: {
    level: 1,
    score: 18,
    showScore: true,
  },
};

export const Workshop: MaturityBadgeStory = {
  args: {
    level: 2,
    score: 35,
    showScore: true,
  },
};

export const Studio: MaturityBadgeStory = {
  args: {
    level: 3,
    score: 52,
    showScore: true,
  },
};

export const Org: MaturityBadgeStory = {
  args: {
    level: 4,
    score: 75,
    showScore: true,
  },
};

export const Ecosystem: MaturityBadgeStory = {
  args: {
    level: 5,
    score: 92,
    showScore: true,
  },
};

export const WithSignalBreakdown: MaturityBadgeStory = {
  args: {
    level: 3,
    score: 58,
    showScore: true,
    showSignals: true,
    signals: {
      has_founding_intent: 10,
      has_decisions: 10,
      has_actions: 10,
      has_active_actions: 8,
      has_completed_actions: 5,
      has_collaborators: 0,
      has_xr_sessions: 5,
      has_live_sessions: 0,
      has_linked_threads: 10,
      has_memory_compressions: 0,
    },
  },
};

export const SmallSize: MaturityBadgeStory = {
  args: {
    level: 2,
    score: 30,
    size: 'sm',
    showScore: true,
  },
};

export const LargeSize: MaturityBadgeStory = {
  args: {
    level: 4,
    score: 78,
    size: 'lg',
    showScore: true,
    showSignals: true,
    signals: {
      has_founding_intent: 10,
      has_decisions: 10,
      has_actions: 10,
      has_active_actions: 10,
      has_completed_actions: 8,
      has_collaborators: 10,
      has_xr_sessions: 5,
      has_live_sessions: 5,
      has_linked_threads: 5,
      has_memory_compressions: 5,
    },
  },
};

export const CompactVariant: StoryObj<typeof MaturityBadgeCompact> = {
  render: () => (
    <div className="flex gap-4">
      <MaturityBadgeCompact level={0} />
      <MaturityBadgeCompact level={1} />
      <MaturityBadgeCompact level={2} />
      <MaturityBadgeCompact level={3} />
      <MaturityBadgeCompact level={4} />
      <MaturityBadgeCompact level={5} />
    </div>
  ),
};

// =============================================================================
// MODE SELECTOR STORIES
// =============================================================================

const modeSelectorMeta: Meta<typeof ModeSelector> = {
  title: 'Thread Lobby/ModeSelector',
  component: ModeSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Mode selector for entering a Thread.

## Modes
- **Chat**: Text-based interaction (always available)
- **Live**: Real-time collaboration (requires Workshop level)
- **XR**: Immersive 3D environment (requires Workshop level)

The recommended mode is highlighted based on thread maturity and context.
        `,
      },
    },
  },
};

export const ModeSelectorStories: Meta<typeof ModeSelector> = modeSelectorMeta;

export const AllModesAvailable: StoryObj<typeof ModeSelector> = {
  args: {
    modes: {
      chat: { available: true, recommended: false },
      live: { available: true, recommended: true },
      xr: { available: true, recommended: false },
    },
    onSelectMode: (mode) => console.log('Selected mode:', mode),
  },
};

export const OnlyChatAvailable: StoryObj<typeof ModeSelector> = {
  args: {
    modes: {
      chat: { available: true, recommended: true },
      live: { available: false, recommended: false, requires_maturity: 2 },
      xr: { available: false, recommended: false, requires_maturity: 2 },
    },
    currentMaturityLevel: 1,
    onSelectMode: (mode) => console.log('Selected mode:', mode),
  },
};

export const XRRecommended: StoryObj<typeof ModeSelector> = {
  args: {
    modes: {
      chat: { available: true, recommended: false },
      live: { available: true, recommended: false },
      xr: { available: true, recommended: true },
    },
    onSelectMode: (mode) => console.log('Selected mode:', mode),
  },
};

export const Loading: StoryObj<typeof ModeSelector> = {
  args: {
    modes: {
      chat: { available: true, recommended: false },
      live: { available: true, recommended: false },
      xr: { available: true, recommended: false },
    },
    loading: true,
    loadingMode: 'xr',
    onSelectMode: (mode) => console.log('Selected mode:', mode),
  },
};

export const Disabled: StoryObj<typeof ModeSelector> = {
  args: {
    modes: {
      chat: { available: true, recommended: false },
      live: { available: true, recommended: false },
      xr: { available: true, recommended: false },
    },
    disabled: true,
    onSelectMode: (mode) => console.log('Selected mode:', mode),
  },
};

// =============================================================================
// LIVE INDICATOR STORIES
// =============================================================================

const liveIndicatorMeta: Meta<typeof LiveIndicator> = {
  title: 'Thread Lobby/LiveIndicator',
  component: LiveIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Indicates an active live session on a Thread.
Shows participant count and pulsing animation.
        `,
      },
    },
  },
};

export const LiveIndicatorStories: Meta<typeof LiveIndicator> = liveIndicatorMeta;

export const ActiveSession: StoryObj<typeof LiveIndicator> = {
  args: {
    participantCount: 3,
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    onJoin: () => console.log('Joining session'),
  },
};

export const ManyParticipants: StoryObj<typeof LiveIndicator> = {
  args: {
    participantCount: 12,
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    onJoin: () => console.log('Joining session'),
  },
};

export const SingleParticipant: StoryObj<typeof LiveIndicator> = {
  args: {
    participantCount: 1,
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    onJoin: () => console.log('Joining session'),
  },
};

export const CompactLiveBadge: StoryObj<typeof LiveBadgeCompact> = {
  render: () => (
    <div className="flex gap-4 items-center">
      <span>Thread Title</span>
      <LiveBadgeCompact participantCount={5} />
    </div>
  ),
};

// =============================================================================
// THREAD LOBBY STORIES
// =============================================================================

const threadLobbyMeta: Meta<typeof ThreadLobby> = {
  title: 'Thread Lobby/ThreadLobby',
  component: ThreadLobby,
  decorators: [withQueryClient],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Thread Lobby is the entry point for interacting with a Thread.
It displays:
- Thread title and founding intent
- Sphere badge
- Maturity level and score
- Mode selector (Chat/Live/XR)
- Live session indicator (if active)
- Privacy notice

## Human Gate
Mode selection is a Human Gate - requires explicit user choice.
        `,
      },
    },
  },
};

export const ThreadLobbyStories: Meta<typeof ThreadLobby> = threadLobbyMeta;

const mockLobbyData: ThreadLobbyData = {
  thread: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    founding_intent: 'Build a comprehensive product roadmap for Q1 2026',
    thread_type: 'collective',
    sphere_id: '456e4567-e89b-12d3-a456-426614174000',
    sphere_name: 'Business',
    status: 'active',
    created_at: '2025-12-15T10:30:00Z',
  },
  maturity: {
    thread_id: '123e4567-e89b-12d3-a456-426614174000',
    score: 45,
    level: 3,
    level_name: 'Studio',
    signals: {
      has_founding_intent: 10,
      has_decisions: 10,
      has_actions: 10,
      has_active_actions: 5,
      has_completed_actions: 5,
      has_collaborators: 5,
      has_xr_sessions: 0,
      has_live_sessions: 0,
      has_linked_threads: 0,
      has_memory_compressions: 0,
    },
    computed_at: new Date().toISOString(),
    cached: true,
  },
  modes: {
    chat: { available: true, recommended: false },
    live: { available: true, recommended: true },
    xr: { available: true, recommended: false },
  },
  summary: {
    total_events: 127,
    total_decisions: 8,
    total_actions: 23,
    active_actions: 5,
    last_activity: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  live_session: null,
};

export const Default: StoryObj<typeof ThreadLobby> = {
  args: {
    threadId: '123e4567-e89b-12d3-a456-426614174000',
    initialData: mockLobbyData,
    onModeSelect: (mode) => console.log('Mode selected:', mode),
  },
};

export const WithLiveSession: StoryObj<typeof ThreadLobby> = {
  args: {
    threadId: '123e4567-e89b-12d3-a456-426614174000',
    initialData: {
      ...mockLobbyData,
      live_session: {
        session_id: '789e4567-e89b-12d3-a456-426614174000',
        participant_count: 4,
        started_at: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
      },
    },
    onModeSelect: (mode) => console.log('Mode selected:', mode),
  },
};

export const NewThread: StoryObj<typeof ThreadLobby> = {
  args: {
    threadId: '123e4567-e89b-12d3-a456-426614174000',
    initialData: {
      ...mockLobbyData,
      maturity: {
        ...mockLobbyData.maturity,
        score: 10,
        level: 1,
        level_name: 'Sprout',
        signals: {
          has_founding_intent: 10,
          has_decisions: 0,
          has_actions: 0,
          has_active_actions: 0,
          has_completed_actions: 0,
          has_collaborators: 0,
          has_xr_sessions: 0,
          has_live_sessions: 0,
          has_linked_threads: 0,
          has_memory_compressions: 0,
        },
      },
      modes: {
        chat: { available: true, recommended: true },
        live: { available: false, recommended: false, requires_maturity: 2 },
        xr: { available: false, recommended: false, requires_maturity: 2 },
      },
      summary: {
        total_events: 2,
        total_decisions: 0,
        total_actions: 0,
        active_actions: 0,
        last_activity: new Date().toISOString(),
      },
    },
    onModeSelect: (mode) => console.log('Mode selected:', mode),
  },
};

export const MatureThread: StoryObj<typeof ThreadLobby> = {
  args: {
    threadId: '123e4567-e89b-12d3-a456-426614174000',
    initialData: {
      ...mockLobbyData,
      maturity: {
        ...mockLobbyData.maturity,
        score: 88,
        level: 5,
        level_name: 'Ecosystem',
        signals: {
          has_founding_intent: 10,
          has_decisions: 10,
          has_actions: 10,
          has_active_actions: 10,
          has_completed_actions: 10,
          has_collaborators: 10,
          has_xr_sessions: 8,
          has_live_sessions: 10,
          has_linked_threads: 5,
          has_memory_compressions: 5,
        },
      },
      modes: {
        chat: { available: true, recommended: false },
        live: { available: true, recommended: false },
        xr: { available: true, recommended: true },
      },
    },
    onModeSelect: (mode) => console.log('Mode selected:', mode),
  },
};

export const PersonalThread: StoryObj<typeof ThreadLobby> = {
  args: {
    threadId: '123e4567-e89b-12d3-a456-426614174000',
    initialData: {
      ...mockLobbyData,
      thread: {
        ...mockLobbyData.thread,
        founding_intent: 'Plan my career transition into AI/ML engineering',
        thread_type: 'personal',
        sphere_name: 'Personal',
      },
    },
    onModeSelect: (mode) => console.log('Mode selected:', mode),
  },
};

export const Loading: StoryObj<typeof ThreadLobby> = {
  args: {
    threadId: '123e4567-e89b-12d3-a456-426614174000',
    // No initialData - will show loading state
  },
};
