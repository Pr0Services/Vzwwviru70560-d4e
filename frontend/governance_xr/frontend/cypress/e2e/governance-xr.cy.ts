/**
 * CYPRESS E2E TESTS: Thread Lobby & Governance Flows
 * 
 * Tests the complete user journey through:
 * - Thread Lobby entry
 * - Mode selection (Chat/Live/XR)
 * - XR Preflight modal
 * - Governance signals and checkpoints
 * - Backlog management
 * 
 * @module cypress/e2e/governance-xr
 */

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER = {
  email: 'test@che-nu.com',
  password: 'TestPassword123!',
};

const TEST_THREAD_ID = '123e4567-e89b-12d3-a456-426614174000';
const TEST_CHECKPOINT_ID = '456e4567-e89b-12d3-a456-426614174000';

// =============================================================================
// CUSTOM COMMANDS
// =============================================================================

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      visitThreadLobby(threadId: string): Chainable<void>;
      mockThreadLobbyData(data: object): Chainable<void>;
      mockGovernanceSignals(signals: object[]): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.session(TEST_USER.email, () => {
    cy.request('POST', '/api/v2/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password,
    }).then((response) => {
      window.localStorage.setItem('auth_token', response.body.access_token);
    });
  });
});

Cypress.Commands.add('visitThreadLobby', (threadId: string) => {
  cy.visit(`/threads/${threadId}`);
  cy.get('[data-testid="thread-lobby"]').should('be.visible');
});

Cypress.Commands.add('mockThreadLobbyData', (data: object) => {
  cy.intercept('GET', `/api/v2/threads/*/lobby`, {
    statusCode: 200,
    body: data,
  }).as('getLobbyData');
});

Cypress.Commands.add('mockGovernanceSignals', (signals: object[]) => {
  cy.intercept('GET', '/api/v2/governance/signals*', {
    statusCode: 200,
    body: { signals, total: signals.length, has_more: false },
  }).as('getSignals');
});

// =============================================================================
// THREAD LOBBY TESTS
// =============================================================================

describe('Thread Lobby', () => {
  beforeEach(() => {
    cy.login();
  });

  describe('Initial Load', () => {
    it('should display thread lobby with all elements', () => {
      cy.mockThreadLobbyData({
        thread: {
          id: TEST_THREAD_ID,
          founding_intent: 'Build product roadmap for Q1 2026',
          thread_type: 'collective',
          sphere_name: 'Business',
          status: 'active',
          created_at: '2025-12-15T10:30:00Z',
        },
        maturity: {
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
          },
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
        },
      });

      cy.visitThreadLobby(TEST_THREAD_ID);
      cy.wait('@getLobbyData');

      // Verify thread info
      cy.get('[data-testid="thread-title"]')
        .should('contain', 'Build product roadmap');
      cy.get('[data-testid="sphere-badge"]')
        .should('contain', 'Business');

      // Verify maturity badge
      cy.get('[data-testid="maturity-badge"]')
        .should('contain', 'Studio')
        .and('contain', '45');

      // Verify mode selector
      cy.get('[data-testid="mode-selector"]').should('be.visible');
      cy.get('[data-testid="mode-chat"]').should('be.visible');
      cy.get('[data-testid="mode-live"]')
        .should('be.visible')
        .and('have.class', 'recommended');
      cy.get('[data-testid="mode-xr"]').should('be.visible');

      // Verify summary
      cy.get('[data-testid="thread-summary"]')
        .should('contain', '127')
        .and('contain', '8')
        .and('contain', '23');
    });

    it('should show loading skeleton while fetching data', () => {
      cy.intercept('GET', `/api/v2/threads/*/lobby`, {
        delay: 1000,
        statusCode: 200,
        body: {},
      }).as('slowLobbyData');

      cy.visit(`/threads/${TEST_THREAD_ID}`);

      // Should show skeleton
      cy.get('[data-testid="thread-lobby-skeleton"]').should('be.visible');

      // Wait for data
      cy.wait('@slowLobbyData');

      // Skeleton should disappear
      cy.get('[data-testid="thread-lobby-skeleton"]').should('not.exist');
    });

    it('should handle 403 identity boundary error', () => {
      cy.intercept('GET', `/api/v2/threads/*/lobby`, {
        statusCode: 403,
        body: {
          error: 'identity_boundary_violation',
          message: 'Access denied - resource belongs to different identity',
        },
      }).as('forbidden');

      cy.visit(`/threads/${TEST_THREAD_ID}`);
      cy.wait('@forbidden');

      // Should show access denied message
      cy.get('[data-testid="access-denied"]').should('be.visible');
      cy.get('[data-testid="access-denied"]')
        .should('contain', 'Access Denied');
    });
  });

  describe('Mode Selection', () => {
    beforeEach(() => {
      cy.mockThreadLobbyData({
        thread: {
          id: TEST_THREAD_ID,
          founding_intent: 'Test thread',
          thread_type: 'personal',
          sphere_name: 'Personal',
        },
        maturity: { score: 50, level: 3, level_name: 'Studio' },
        modes: {
          chat: { available: true, recommended: false },
          live: { available: true, recommended: false },
          xr: { available: true, recommended: true },
        },
        summary: {},
      });
    });

    it('should select chat mode and navigate', () => {
      cy.intercept('POST', `/api/v2/threads/*/enter-mode`, {
        statusCode: 200,
        body: { mode: 'chat', session_id: 'session_123' },
      }).as('enterMode');

      cy.visitThreadLobby(TEST_THREAD_ID);
      cy.wait('@getLobbyData');

      cy.get('[data-testid="mode-chat"]').click();
      cy.wait('@enterMode');

      // Should navigate to chat view
      cy.url().should('include', '/chat');
    });

    it('should show XR preflight modal before entering XR', () => {
      cy.intercept('GET', `/api/v2/threads/*/xr/preflight`, {
        statusCode: 200,
        body: {
          available: true,
          zones: ['intent_wall', 'action_table', 'decision_wall'],
          features: {
            can_create_actions: true,
            can_update_actions: true,
          },
          device_requirements: { webxr_required: false },
          estimated_load_time_ms: 2000,
          privacy_notice: 'XR session data stored locally.',
        },
      }).as('getPreflight');

      cy.visitThreadLobby(TEST_THREAD_ID);
      cy.wait('@getLobbyData');

      cy.get('[data-testid="mode-xr"]').click();
      cy.wait('@getPreflight');

      // Preflight modal should appear
      cy.get('[data-testid="xr-preflight-modal"]').should('be.visible');
      cy.get('[data-testid="xr-preflight-modal"]')
        .should('contain', 'XR is a projection')
        .and('contain', 'intent_wall')
        .and('contain', 'action_table');
    });

    it('should proceed to XR after preflight confirmation', () => {
      cy.intercept('GET', `/api/v2/threads/*/xr/preflight`, {
        statusCode: 200,
        body: {
          available: true,
          zones: ['intent_wall'],
          features: { can_create_actions: true },
        },
      }).as('getPreflight');

      cy.intercept('POST', `/api/v2/threads/*/enter-mode`, {
        statusCode: 200,
        body: { mode: 'xr', session_id: 'xr_session_123' },
      }).as('enterXR');

      cy.visitThreadLobby(TEST_THREAD_ID);
      cy.wait('@getLobbyData');

      cy.get('[data-testid="mode-xr"]').click();
      cy.wait('@getPreflight');

      // Click proceed in modal
      cy.get('[data-testid="xr-preflight-proceed"]').click();
      cy.wait('@enterXR');

      // Should navigate to XR view
      cy.url().should('include', '/xr');
    });

    it('should disable unavailable modes for low maturity', () => {
      cy.mockThreadLobbyData({
        thread: { id: TEST_THREAD_ID },
        maturity: { score: 10, level: 1, level_name: 'Sprout' },
        modes: {
          chat: { available: true, recommended: true },
          live: { available: false, requires_maturity: 2 },
          xr: { available: false, requires_maturity: 2 },
        },
        summary: {},
      });

      cy.visitThreadLobby(TEST_THREAD_ID);
      cy.wait('@getLobbyData');

      cy.get('[data-testid="mode-live"]')
        .should('be.disabled')
        .and('contain', 'Workshop');
      cy.get('[data-testid="mode-xr"]')
        .should('be.disabled')
        .and('contain', 'Workshop');
    });
  });

  describe('Live Session', () => {
    it('should show live indicator when session is active', () => {
      cy.mockThreadLobbyData({
        thread: { id: TEST_THREAD_ID },
        maturity: { score: 50, level: 3 },
        modes: {
          chat: { available: true },
          live: { available: true, recommended: true },
          xr: { available: true },
        },
        summary: {},
        live_session: {
          session_id: 'live_123',
          participant_count: 4,
          started_at: new Date().toISOString(),
        },
      });

      cy.visitThreadLobby(TEST_THREAD_ID);
      cy.wait('@getLobbyData');

      cy.get('[data-testid="live-indicator"]')
        .should('be.visible')
        .and('contain', '4')
        .and('contain', 'EN DIRECT');

      // Live indicator should have pulsing animation
      cy.get('[data-testid="live-indicator-dot"]')
        .should('have.class', 'animate-pulse');
    });

    it('should allow joining active live session', () => {
      cy.mockThreadLobbyData({
        thread: { id: TEST_THREAD_ID },
        maturity: { score: 50, level: 3 },
        modes: { live: { available: true } },
        summary: {},
        live_session: { session_id: 'live_123', participant_count: 2 },
      });

      cy.intercept('POST', `/api/v2/threads/*/enter-mode`, {
        statusCode: 200,
        body: { mode: 'live', session_id: 'live_123' },
      }).as('joinLive');

      cy.visitThreadLobby(TEST_THREAD_ID);
      cy.wait('@getLobbyData');

      cy.get('[data-testid="live-join-button"]').click();
      cy.wait('@joinLive');

      cy.url().should('include', '/live');
    });
  });
});

// =============================================================================
// GOVERNANCE CHECKPOINT TESTS
// =============================================================================

describe('Governance Checkpoints', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should show checkpoint modal on HTTP 423', () => {
    cy.intercept('POST', `/api/v2/threads/*/xr/actions`, {
      statusCode: 423,
      body: {
        status: 'checkpoint_pending',
        checkpoint: {
          id: TEST_CHECKPOINT_ID,
          type: 'governance',
          reason: 'Creating action requires approval due to high token cost',
          requires_approval: true,
          options: ['approve', 'reject'],
        },
      },
    }).as('createAction');

    // Navigate to a page that can create actions
    cy.visit(`/threads/${TEST_THREAD_ID}/xr`);

    // Trigger action creation
    cy.get('[data-testid="create-action-button"]').click();
    cy.get('[data-testid="action-title-input"]').type('New action');
    cy.get('[data-testid="action-submit"]').click();

    cy.wait('@createAction');

    // Checkpoint modal should appear
    cy.get('[data-testid="checkpoint-modal"]')
      .should('be.visible')
      .and('contain', 'Checkpoint Required')
      .and('contain', 'high token cost');

    // Should have approve/reject buttons
    cy.get('[data-testid="checkpoint-approve"]').should('be.visible');
    cy.get('[data-testid="checkpoint-reject"]').should('be.visible');
  });

  it('should approve checkpoint and complete action', () => {
    cy.intercept('POST', `/api/v2/governance/checkpoints/*/approve`, {
      statusCode: 200,
      body: {
        checkpoint_id: TEST_CHECKPOINT_ID,
        status: 'approved',
        execution_result: { action_id: 'new_action_123' },
      },
    }).as('approveCheckpoint');

    // Simulate checkpoint modal already open
    cy.visit(`/threads/${TEST_THREAD_ID}?checkpoint=${TEST_CHECKPOINT_ID}`);

    cy.get('[data-testid="checkpoint-modal"]').should('be.visible');

    // Enter reason and approve
    cy.get('[data-testid="checkpoint-reason-input"]')
      .type('Approved for Q1 planning');
    cy.get('[data-testid="checkpoint-approve"]').click();

    cy.wait('@approveCheckpoint');

    // Modal should close
    cy.get('[data-testid="checkpoint-modal"]').should('not.exist');

    // Success notification
    cy.get('[data-testid="notification"]')
      .should('contain', 'Checkpoint approved');
  });

  it('should reject checkpoint with required reason', () => {
    cy.intercept('POST', `/api/v2/governance/checkpoints/*/reject`, {
      statusCode: 200,
      body: {
        checkpoint_id: TEST_CHECKPOINT_ID,
        status: 'rejected',
      },
    }).as('rejectCheckpoint');

    cy.visit(`/threads/${TEST_THREAD_ID}?checkpoint=${TEST_CHECKPOINT_ID}`);

    cy.get('[data-testid="checkpoint-modal"]').should('be.visible');

    // Try to reject without reason
    cy.get('[data-testid="checkpoint-reject"]').click();

    // Should show validation error
    cy.get('[data-testid="checkpoint-reason-error"]')
      .should('contain', 'Reason is required');

    // Enter reason and reject
    cy.get('[data-testid="checkpoint-reason-input"]')
      .type('Not aligned with current priorities');
    cy.get('[data-testid="checkpoint-reject"]').click();

    cy.wait('@rejectCheckpoint');

    cy.get('[data-testid="checkpoint-modal"]').should('not.exist');
  });
});

// =============================================================================
// GOVERNANCE SIGNALS TESTS
// =============================================================================

describe('Governance Signals', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should display governance signals dashboard', () => {
    cy.mockGovernanceSignals([
      {
        id: '1',
        level: 'BLOCK',
        criterion: 'security_guard',
        message: 'Potential injection detected',
        processed: false,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        level: 'WARN',
        criterion: 'budget_guard',
        message: 'Token usage at 80%',
        processed: false,
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        level: 'CORRECT',
        criterion: 'canon_guard',
        message: 'Auto-corrected missing field',
        processed: true,
        patch_instruction: {
          action: 'add',
          target: 'parent_event_id',
        },
        created_at: new Date().toISOString(),
      },
    ]);

    cy.visit(`/threads/${TEST_THREAD_ID}/governance`);
    cy.wait('@getSignals');

    // Should show signals grouped by severity
    cy.get('[data-testid="signal-card"]').should('have.length', 3);

    // BLOCK signal should be first and highlighted
    cy.get('[data-testid="signal-card"]').first()
      .should('have.class', 'signal-block')
      .and('contain', 'BLOCK')
      .and('contain', 'injection');

    // Processed signal should be dimmed
    cy.get('[data-testid="signal-card"]').last()
      .should('have.class', 'signal-processed');
  });

  it('should acknowledge a signal', () => {
    cy.mockGovernanceSignals([
      {
        id: 'signal_1',
        level: 'WARN',
        criterion: 'budget_guard',
        message: 'Budget warning',
        processed: false,
        created_at: new Date().toISOString(),
      },
    ]);

    cy.intercept('POST', '/api/v2/governance/signals/*/acknowledge', {
      statusCode: 200,
      body: { id: 'signal_1', processed: true },
    }).as('acknowledgeSignal');

    cy.visit(`/threads/${TEST_THREAD_ID}/governance`);
    cy.wait('@getSignals');

    cy.get('[data-testid="signal-acknowledge"]').click();
    cy.wait('@acknowledgeSignal');

    // Signal should now be marked as processed
    cy.get('[data-testid="signal-card"]')
      .should('have.class', 'signal-processed');
  });

  it('should show patch instruction for CORRECT signals', () => {
    cy.mockGovernanceSignals([
      {
        id: 'signal_1',
        level: 'CORRECT',
        criterion: 'canon_guard',
        message: 'Field corrected',
        processed: false,
        patch_instruction: {
          action: 'replace',
          target: 'status',
          value: 'active',
          reason: 'Invalid status value was auto-corrected',
        },
        created_at: new Date().toISOString(),
      },
    ]);

    cy.visit(`/threads/${TEST_THREAD_ID}/governance`);
    cy.wait('@getSignals');

    // Should show patch instruction
    cy.get('[data-testid="patch-instruction"]')
      .should('be.visible')
      .and('contain', 'replace')
      .and('contain', 'status')
      .and('contain', 'auto-corrected');
  });
});

// =============================================================================
// BACKLOG MANAGEMENT TESTS
// =============================================================================

describe('Backlog Management', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should display backlog items sorted by severity', () => {
    cy.intercept('GET', '/api/v2/backlog*', {
      statusCode: 200,
      body: {
        items: [
          {
            id: '1',
            backlog_type: 'error',
            severity: 'critical',
            title: 'Critical error',
            status: 'open',
          },
          {
            id: '2',
            backlog_type: 'signal',
            severity: 'high',
            title: 'Unprocessed signal',
            status: 'open',
          },
          {
            id: '3',
            backlog_type: 'cost',
            severity: 'medium',
            title: 'Budget overage',
            status: 'open',
          },
          {
            id: '4',
            backlog_type: 'governance_debt',
            severity: 'low',
            title: 'Missing audit',
            status: 'resolved',
          },
        ],
        total: 4,
        by_severity: { critical: 1, high: 1, medium: 1, low: 1 },
      },
    }).as('getBacklog');

    cy.visit(`/threads/${TEST_THREAD_ID}/governance/backlog`);
    cy.wait('@getBacklog');

    // Critical item should be first
    cy.get('[data-testid="backlog-item"]').first()
      .should('contain', 'Critical')
      .and('have.class', 'severity-critical');

    // Resolved item should be dimmed
    cy.get('[data-testid="backlog-item"]').last()
      .should('have.class', 'status-resolved');
  });

  it('should resolve a backlog item', () => {
    cy.intercept('GET', '/api/v2/backlog*', {
      statusCode: 200,
      body: {
        items: [
          {
            id: 'item_1',
            backlog_type: 'error',
            severity: 'high',
            title: 'Error to resolve',
            status: 'open',
          },
        ],
        total: 1,
      },
    }).as('getBacklog');

    cy.intercept('POST', '/api/v2/backlog/*/resolve', {
      statusCode: 200,
      body: {
        id: 'item_1',
        status: 'resolved',
        resolution: 'Fixed the underlying issue',
      },
    }).as('resolveItem');

    cy.visit(`/threads/${TEST_THREAD_ID}/governance/backlog`);
    cy.wait('@getBacklog');

    // Open resolve form
    cy.get('[data-testid="backlog-resolve-button"]').click();

    // Enter resolution
    cy.get('[data-testid="resolution-input"]')
      .type('Fixed the underlying issue by updating the validation logic');

    // Submit
    cy.get('[data-testid="resolution-submit"]').click();
    cy.wait('@resolveItem');

    // Item should now show as resolved
    cy.get('[data-testid="backlog-item"]')
      .should('have.class', 'status-resolved');
  });

  it('should filter backlog by type and severity', () => {
    cy.intercept('GET', '/api/v2/backlog*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          items: req.query.type === 'error' ? [
            { id: '1', backlog_type: 'error', severity: 'high', title: 'Error 1' },
          ] : [],
          total: req.query.type === 'error' ? 1 : 0,
        },
      });
    }).as('getBacklogFiltered');

    cy.visit(`/threads/${TEST_THREAD_ID}/governance/backlog`);

    // Apply filter
    cy.get('[data-testid="filter-type"]').select('error');
    cy.wait('@getBacklogFiltered');

    // Should only show errors
    cy.get('[data-testid="backlog-item"]').should('have.length', 1);
    cy.get('[data-testid="backlog-item"]')
      .should('contain', 'Error 1');
  });
});

// =============================================================================
// MATURITY BADGE TESTS
// =============================================================================

describe('Maturity Display', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should show correct maturity level and signals', () => {
    cy.mockThreadLobbyData({
      thread: { id: TEST_THREAD_ID },
      maturity: {
        score: 65,
        level: 4,
        level_name: 'Org',
        signals: {
          has_founding_intent: 10,
          has_decisions: 10,
          has_actions: 10,
          has_active_actions: 10,
          has_completed_actions: 10,
          has_collaborators: 5,
          has_xr_sessions: 5,
          has_live_sessions: 5,
          has_linked_threads: 0,
          has_memory_compressions: 0,
        },
      },
      modes: {},
      summary: {},
    });

    cy.visitThreadLobby(TEST_THREAD_ID);
    cy.wait('@getLobbyData');

    // Click to expand maturity details
    cy.get('[data-testid="maturity-badge"]').click();

    // Should show signal breakdown
    cy.get('[data-testid="maturity-signals"]').should('be.visible');
    cy.get('[data-testid="signal-founding-intent"]')
      .should('contain', '10/10');
    cy.get('[data-testid="signal-linked-threads"]')
      .should('contain', '0/10');
  });

  it('should allow force recompute of maturity', () => {
    cy.intercept('POST', `/api/v2/threads/*/maturity/recompute`, {
      statusCode: 200,
      body: {
        score: 70,
        level: 4,
        level_name: 'Org',
        cached: false,
      },
    }).as('recompute');

    cy.mockThreadLobbyData({
      thread: { id: TEST_THREAD_ID },
      maturity: {
        score: 65,
        level: 4,
        level_name: 'Org',
        cached: true,
      },
      modes: {},
      summary: {},
    });

    cy.visitThreadLobby(TEST_THREAD_ID);
    cy.wait('@getLobbyData');

    // Click recompute
    cy.get('[data-testid="maturity-recompute"]').click();
    cy.wait('@recompute');

    // Score should update
    cy.get('[data-testid="maturity-score"]')
      .should('contain', '70');
  });
});

// =============================================================================
// ACCESSIBILITY TESTS
// =============================================================================

describe('Accessibility', () => {
  beforeEach(() => {
    cy.login();
    cy.mockThreadLobbyData({
      thread: { id: TEST_THREAD_ID, founding_intent: 'Test' },
      maturity: { score: 50, level: 3, level_name: 'Studio' },
      modes: {
        chat: { available: true },
        live: { available: true },
        xr: { available: true },
      },
      summary: {},
    });
  });

  it('should have proper ARIA labels', () => {
    cy.visitThreadLobby(TEST_THREAD_ID);
    cy.wait('@getLobbyData');

    // Mode selector should have proper labeling
    cy.get('[data-testid="mode-selector"]')
      .should('have.attr', 'role', 'radiogroup')
      .and('have.attr', 'aria-label', 'Select entry mode');

    // Each mode should be a radio option
    cy.get('[data-testid="mode-chat"]')
      .should('have.attr', 'role', 'radio');

    // Maturity badge should have aria-label
    cy.get('[data-testid="maturity-badge"]')
      .should('have.attr', 'aria-label');
  });

  it('should be keyboard navigable', () => {
    cy.visitThreadLobby(TEST_THREAD_ID);
    cy.wait('@getLobbyData');

    // Tab to mode selector
    cy.get('body').tab();
    cy.get('[data-testid="mode-chat"]').should('have.focus');

    // Arrow keys to navigate modes
    cy.get('[data-testid="mode-chat"]').type('{rightarrow}');
    cy.get('[data-testid="mode-live"]').should('have.focus');

    // Enter to select
    cy.get('[data-testid="mode-live"]').type('{enter}');
    // Should trigger mode selection
  });

  it('should announce dynamic updates to screen readers', () => {
    cy.visitThreadLobby(TEST_THREAD_ID);
    cy.wait('@getLobbyData');

    // Live region for notifications
    cy.get('[aria-live="polite"]').should('exist');

    // After maturity recompute, should announce
    cy.intercept('POST', `/api/v2/threads/*/maturity/recompute`, {
      statusCode: 200,
      body: { score: 70, level: 4 },
    }).as('recompute');

    cy.get('[data-testid="maturity-recompute"]').click();
    cy.wait('@recompute');

    cy.get('[aria-live="polite"]')
      .should('contain', 'Maturity updated');
  });
});
