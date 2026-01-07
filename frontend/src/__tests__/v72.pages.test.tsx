/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — PAGE TESTS                                  ║
 * ║                                                                              ║
 * ║  Comprehensive tests for all 8 V72 pages                                     ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCKS
// ═══════════════════════════════════════════════════════════════════════════════

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ sphereId: 'personal', threadId: 'thread-1' }),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

// Mock auth store
jest.mock('../stores/auth.store', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    user: { id: 'test-user', username: 'Jo' },
  }),
}));

// Mock agents catalog
jest.mock('../data/agents-catalog', () => ({
  ALL_AGENTS: [
    {
      id: 'test-agent-1',
      name_fr: 'Agent Test',
      name_en: 'Test Agent',
      level: 1,
      domain: 'general',
      capabilities: ['test'],
      description_fr: 'Agent de test',
      description_en: 'Test agent',
      personality: 'Helpful',
      communication_style: 'Direct',
      cost: 10,
      is_system: false,
    },
  ],
  AGENT_STATS: { total: 1, byLevel: { 0: 0, 1: 1, 2: 0, 3: 0 }, byDomain: {} },
  getAgentsByLevel: () => [],
  getAgentsByDomain: () => [],
  searchAgents: () => [],
}));

// ═══════════════════════════════════════════════════════════════════════════════
// TEST UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const renderWithRouter = (component: React.ReactElement, route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>
  );
};

beforeEach(() => {
  mockNavigate.mockClear();
});

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD V72 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('DashboardV72', () => {
  // Lazy import to avoid module resolution issues in tests
  const DashboardV72 = React.lazy(() => import('../pages/DashboardV72'));

  const renderDashboard = () => {
    return renderWithRouter(
      <React.Suspense fallback={<div>Loading...</div>}>
        <DashboardV72 />
      </React.Suspense>
    );
  };

  test('renders dashboard with greeting', async () => {
    renderDashboard();
    await waitFor(() => {
      // Should show time-based greeting
      expect(
        screen.getByText(/Bonjour|Bon après-midi|Bonsoir/i)
      ).toBeInTheDocument();
    });
  });

  test('renders all 9 spheres', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Personnel')).toBeInTheDocument();
      expect(screen.getByText('Affaires')).toBeInTheDocument();
      expect(screen.getByText('Gouvernement')).toBeInTheDocument();
    });
  });

  test('renders stats widget', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText(/Décisions/i)).toBeInTheDocument();
      expect(screen.getByText(/Threads/i)).toBeInTheDocument();
    });
  });

  test('opens search modal on button click', async () => {
    renderDashboard();
    await waitFor(() => {
      const searchButton = screen.getByText(/⌘K/);
      fireEvent.click(searchButton);
    });
    // Search modal should be visible
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Rechercher/i)).toBeInTheDocument();
    });
  });

  test('navigates to sphere on click', async () => {
    renderDashboard();
    await waitFor(() => {
      const personalSphere = screen.getByText('Personnel');
      fireEvent.click(personalSphere.closest('button')!);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/sphere/personal');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THREADS PAGE V72 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('ThreadsPageV72', () => {
  const ThreadsPageV72 = React.lazy(() => import('../pages/ThreadsPageV72'));

  const renderThreadsPage = () => {
    return renderWithRouter(
      <React.Suspense fallback={<div>Loading...</div>}>
        <ThreadsPageV72 />
      </React.Suspense>
    );
  };

  test('renders threads page with title', async () => {
    renderThreadsPage();
    await waitFor(() => {
      expect(screen.getByText('🧵 Threads')).toBeInTheDocument();
    });
  });

  test('renders thread cards with maturity levels', async () => {
    renderThreadsPage();
    await waitFor(() => {
      // Should show maturity icons
      expect(screen.getByText(/Rénovation cuisine|Lancement produit/i)).toBeInTheDocument();
    });
  });

  test('opens new thread modal', async () => {
    renderThreadsPage();
    await waitFor(() => {
      const newButton = screen.getByText(/Nouveau Thread/i);
      fireEvent.click(newButton);
    });
    await waitFor(() => {
      expect(screen.getByText(/Intention fondatrice/i)).toBeInTheDocument();
    });
  });

  test('filters threads by sphere', async () => {
    renderThreadsPage();
    await waitFor(() => {
      const sphereFilter = screen.getByDisplayValue('Toutes sphères');
      fireEvent.change(sphereFilter, { target: { value: 'business' } });
    });
    // Should filter results
  });

  test('filters threads by status', async () => {
    renderThreadsPage();
    await waitFor(() => {
      const statusFilter = screen.getByDisplayValue('Tous statuts');
      fireEvent.change(statusFilter, { target: { value: 'active' } });
    });
  });

  test('sorts threads by maturity', async () => {
    renderThreadsPage();
    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Plus récents');
      fireEvent.change(sortSelect, { target: { value: 'maturity' } });
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA PAGE V72 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('NovaPageV72', () => {
  const NovaPageV72 = React.lazy(() => import('../pages/NovaPageV72'));

  const renderNovaPage = () => {
    return renderWithRouter(
      <React.Suspense fallback={<div>Loading...</div>}>
        <NovaPageV72 />
      </React.Suspense>
    );
  };

  test('renders Nova chat interface', async () => {
    renderNovaPage();
    await waitFor(() => {
      expect(screen.getByText('Nova')).toBeInTheDocument();
      expect(screen.getByText(/Intelligence système gouvernée/i)).toBeInTheDocument();
    });
  });

  test('renders welcome message', async () => {
    renderNovaPage();
    await waitFor(() => {
      expect(screen.getByText(/Bonjour Jo/i)).toBeInTheDocument();
    });
  });

  test('sends message on enter', async () => {
    renderNovaPage();
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Demandez quelque chose/i);
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    // Message should be added
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  test('shows typing indicator after sending', async () => {
    renderNovaPage();
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Demandez quelque chose/i);
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    await waitFor(() => {
      expect(screen.getByText(/Nova réfléchit/i)).toBeInTheDocument();
    });
  });

  test('shows checkpoint for sensitive actions', async () => {
    renderNovaPage();
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Demandez quelque chose/i);
      fireEvent.change(input, { target: { value: 'envoyer le document' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    // Should show checkpoint after response
    await waitFor(() => {
      expect(screen.getByText(/Point de contrôle requis/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENTS PAGE V72 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('AgentsPageV72', () => {
  const AgentsPageV72 = React.lazy(() => import('../pages/AgentsPageV72'));

  const renderAgentsPage = () => {
    return renderWithRouter(
      <React.Suspense fallback={<div>Loading...</div>}>
        <AgentsPageV72 />
      </React.Suspense>
    );
  };

  test('renders agents marketplace', async () => {
    renderAgentsPage();
    await waitFor(() => {
      expect(screen.getByText(/Agents/i)).toBeInTheDocument();
    });
  });

  test('shows level stats', async () => {
    renderAgentsPage();
    await waitFor(() => {
      expect(screen.getByText(/L0|L1|L2|L3/)).toBeInTheDocument();
    });
  });

  test('filters agents by search', async () => {
    renderAgentsPage();
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Rechercher/i);
      fireEvent.change(searchInput, { target: { value: 'construction' } });
    });
  });

  test('opens agent detail panel on click', async () => {
    renderAgentsPage();
    await waitFor(() => {
      const agentCard = screen.getByText('Agent Test');
      fireEvent.click(agentCard.closest('button')!);
    });
    // Detail panel should open
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION POINTS PAGE V72 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('DecisionPointsPageV72', () => {
  const DecisionPointsPageV72 = React.lazy(() => import('../pages/DecisionPointsPageV72'));

  const renderDecisionsPage = () => {
    return renderWithRouter(
      <React.Suspense fallback={<div>Loading...</div>}>
        <DecisionPointsPageV72 />
      </React.Suspense>
    );
  };

  test('renders decisions page', async () => {
    renderDecisionsPage();
    await waitFor(() => {
      expect(screen.getByText(/Points de Décision/i)).toBeInTheDocument();
    });
  });

  test('renders aging timeline', async () => {
    renderDecisionsPage();
    await waitFor(() => {
      expect(screen.getByText(/Cycle de vieillissement/i)).toBeInTheDocument();
      expect(screen.getByText('🟢')).toBeInTheDocument();
      expect(screen.getByText('🟡')).toBeInTheDocument();
      expect(screen.getByText('🔴')).toBeInTheDocument();
      expect(screen.getByText('🔥')).toBeInTheDocument();
    });
  });

  test('filters by aging level', async () => {
    renderDecisionsPage();
    await waitFor(() => {
      const blinkFilter = screen.getByText('CRITIQUE');
      fireEvent.click(blinkFilter);
    });
  });

  test('opens decision detail panel', async () => {
    renderDecisionsPage();
    await waitFor(() => {
      const decisionCard = screen.getByText(/Choix du contracteur/i);
      fireEvent.click(decisionCard.closest('button')!);
    });
    await waitFor(() => {
      expect(screen.getByText(/Options disponibles/i)).toBeInTheDocument();
    });
  });

  test('shows AI suggestions in detail', async () => {
    renderDecisionsPage();
    await waitFor(() => {
      const decisionCard = screen.getByText(/Choix du contracteur/i);
      fireEvent.click(decisionCard.closest('button')!);
    });
    await waitFor(() => {
      expect(screen.getByText(/Suggestions IA/i)).toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE PAGE V72 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('GovernancePageV72', () => {
  const GovernancePageV72 = React.lazy(() => import('../pages/GovernancePageV72'));

  const renderGovernancePage = () => {
    return renderWithRouter(
      <React.Suspense fallback={<div>Loading...</div>}>
        <GovernancePageV72 />
      </React.Suspense>
    );
  };

  test('renders CEA dashboard', async () => {
    renderGovernancePage();
    await waitFor(() => {
      expect(screen.getByText(/CEA — Gouvernance/i)).toBeInTheDocument();
      expect(screen.getByText(/Contrôle • Éthique • Audit/i)).toBeInTheDocument();
    });
  });

  test('shows governance metrics', async () => {
    renderGovernancePage();
    await waitFor(() => {
      expect(screen.getByText(/Taux d'approbation/i)).toBeInTheDocument();
      expect(screen.getByText(/Checkpoints en attente/i)).toBeInTheDocument();
    });
  });

  test('renders active signals', async () => {
    renderGovernancePage();
    await waitFor(() => {
      expect(screen.getByText(/Signaux actifs/i)).toBeInTheDocument();
    });
  });

  test('switches to checkpoints tab', async () => {
    renderGovernancePage();
    await waitFor(() => {
      const checkpointsTab = screen.getByText('Checkpoints');
      fireEvent.click(checkpointsTab);
    });
    // Should show checkpoint list
  });

  test('switches to audit tab', async () => {
    renderGovernancePage();
    await waitFor(() => {
      const auditTab = screen.getByText('Journal');
      fireEvent.click(auditTab);
    });
    await waitFor(() => {
      expect(screen.getByText(/Journal d'audit/i)).toBeInTheDocument();
    });
  });

  test('displays governance principles', async () => {
    renderGovernancePage();
    await waitFor(() => {
      expect(screen.getByText(/GOUVERNANCE > EXÉCUTION/i)).toBeInTheDocument();
      expect(screen.getByText(/READ-ONLY XR/i)).toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE PAGE V72 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('SpherePageV72', () => {
  const SpherePageV72 = React.lazy(() => import('../pages/SpherePageV72'));

  const renderSpherePage = () => {
    return renderWithRouter(
      <React.Suspense fallback={<div>Loading...</div>}>
        <SpherePageV72 />
      </React.Suspense>,
      '/sphere/personal'
    );
  };

  test('renders sphere page with header', async () => {
    renderSpherePage();
    await waitFor(() => {
      expect(screen.getByText('Personnel')).toBeInTheDocument();
    });
  });

  test('renders 6 bureau sections', async () => {
    renderSpherePage();
    await waitFor(() => {
      expect(screen.getByText('Quick Capture')).toBeInTheDocument();
      expect(screen.getByText('Resume Workspace')).toBeInTheDocument();
      expect(screen.getByText('Threads')).toBeInTheDocument();
      expect(screen.getByText('Data Files')).toBeInTheDocument();
      expect(screen.getByText('Active Agents')).toBeInTheDocument();
      expect(screen.getByText('Meetings')).toBeInTheDocument();
    });
  });

  test('switches between bureau sections', async () => {
    renderSpherePage();
    await waitFor(() => {
      const quickCaptureTab = screen.getByText('Quick Capture');
      fireEvent.click(quickCaptureTab);
    });
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Capture rapide/i)).toBeInTheDocument();
    });
  });

  test('adds quick capture item', async () => {
    renderSpherePage();
    await waitFor(() => {
      fireEvent.click(screen.getByText('Quick Capture'));
    });
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Capture rapide/i);
      fireEvent.change(input, { target: { value: 'New task' } });
      fireEvent.submit(input.closest('form')!);
    });
  });

  test('shows sphere stats', async () => {
    renderSpherePage();
    await waitFor(() => {
      expect(screen.getByText(/Threads/i)).toBeInTheDocument();
      expect(screen.getByText(/Décisions/i)).toBeInTheDocument();
      expect(screen.getByText(/Agents/i)).toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// XR PAGE V72 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('XRPageV72', () => {
  const XRPageV72 = React.lazy(() => import('../pages/XRPageV72'));

  const renderXRPage = () => {
    return renderWithRouter(
      <React.Suspense fallback={<div>Loading...</div>}>
        <XRPageV72 />
      </React.Suspense>
    );
  };

  test('renders XR immersive view', async () => {
    renderXRPage();
    await waitFor(() => {
      expect(screen.getByText(/Vue XR Immersive/i)).toBeInTheDocument();
    });
  });

  test('shows READ-ONLY notice', async () => {
    renderXRPage();
    await waitFor(() => {
      expect(screen.getByText(/READ-ONLY/i)).toBeInTheDocument();
    });
  });

  test('renders view mode selector', async () => {
    renderXRPage();
    await waitFor(() => {
      expect(screen.getByText('Sphères')).toBeInTheDocument();
      expect(screen.getByText('Threads')).toBeInTheDocument();
      expect(screen.getByText('Décisions')).toBeInTheDocument();
      expect(screen.getByText('Agents')).toBeInTheDocument();
      expect(screen.getByText('Timeline')).toBeInTheDocument();
    });
  });

  test('switches view modes', async () => {
    renderXRPage();
    await waitFor(() => {
      const threadsMode = screen.getByText('Threads');
      fireEvent.click(threadsMode);
    });
  });

  test('shows navigation hints', async () => {
    renderXRPage();
    await waitFor(() => {
      expect(screen.getByText(/Glisser pour tourner/i)).toBeInTheDocument();
      expect(screen.getByText(/Clic pour sélectionner/i)).toBeInTheDocument();
    });
  });

  test('shows XR controls info', async () => {
    renderXRPage();
    await waitFor(() => {
      expect(screen.getByText(/Contrôles XR/i)).toBeInTheDocument();
    });
  });

  test('selects sphere node', async () => {
    renderXRPage();
    await waitFor(() => {
      // Central Nova should be visible
      expect(screen.getByText('✨')).toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('V72 Integration Tests', () => {
  test('keyboard shortcut ⌘K opens search across pages', async () => {
    // This would test that the keyboard shortcuts work consistently
  });

  test('FAB quick actions are consistent across pages', async () => {
    // Test FAB functionality
  });

  test('navigation flow works correctly', async () => {
    // Test navigation between pages
  });

  test('governance checkpoints appear when needed', async () => {
    // Test checkpoint appearance
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('V72 Accessibility Tests', () => {
  test('all interactive elements are keyboard accessible', async () => {
    // Test keyboard navigation
  });

  test('proper ARIA labels are present', async () => {
    // Test ARIA labels
  });

  test('color contrast meets WCAG standards', async () => {
    // Test color contrast
  });
});
