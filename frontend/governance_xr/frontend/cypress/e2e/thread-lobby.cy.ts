/**
 * CYPRESS E2E: thread-lobby.cy.ts
 * TESTS: Thread Lobby, Mode Selection, Maturity Display
 * 
 * R&D COMPLIANCE: ✅
 * - Tests Human Gate patterns
 * - Verifies governance flows
 * - Tests HTTP 423/403 handling
 */

describe('Thread Lobby', () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept('GET', '/api/v2/auth/me', {
      statusCode: 200,
      body: {
        id: 'user-001',
        identity_id: 'identity-001',
        email: 'test@che-nu.com',
      },
    }).as('getMe');

    // Mock thread lobby data
    cy.intercept('GET', '/api/v2/threads/*/lobby', {
      statusCode: 200,
      body: {
        thread_id: 'thread-001',
        thread_title: 'Test Thread',
        thread_type: 'personal',
        sphere_id: 'sphere-personal',
        sphere_name: 'Personal',
        founding_intent: 'Test founding intent for this thread',
        maturity: {
          thread_id: 'thread-001',
          score: 42,
          level: 2, // WORKSHOP
          signals: {
            has_founding_intent: true,
            has_decisions: true,
            has_actions: true,
            has_notes: true,
            has_links: false,
            has_summaries: false,
            has_memory_compressed: false,
            total_events: 25,
            days_active: 7,
            has_xr_blueprint: false,
          },
          computed_at: new Date().toISOString(),
          stale_after: new Date(Date.now() + 3600000).toISOString(),
        },
        summary: 'Recent activity summary for the thread.',
        last_activity: new Date().toISOString(),
        is_live: false,
        live_participants: 0,
        mode_recommendation: {
          recommended_mode: 'chat',
          available_modes: ['chat', 'live', 'xr'],
          reasons: {
            chat: 'Toujours disponible',
            live: 'Disponible - niveau Workshop atteint',
            xr: 'Disponible - niveau Workshop atteint',
          },
        },
        viewer_role: 'owner',
      },
    }).as('getThreadLobby');
  });

  it('displays thread lobby with all sections', () => {
    cy.visit('/threads/thread-001');
    cy.wait('@getThreadLobby');

    // Thread title
    cy.contains('Test Thread').should('be.visible');

    // Sphere badge
    cy.contains('Personal').should('be.visible');

    // Maturity badge
    cy.contains('Workshop').should('be.visible');
    cy.contains('42').should('be.visible');

    // Founding intent
    cy.contains('Test founding intent for this thread').should('be.visible');

    // Summary
    cy.contains('Recent activity summary').should('be.visible');

    // Mode selector
    cy.contains('Chat').should('be.visible');
    cy.contains('Live').should('be.visible');
    cy.contains('XR').should('be.visible');
  });

  it('shows recommended mode badge', () => {
    cy.visit('/threads/thread-001');
    cy.wait('@getThreadLobby');

    // Chat should have "Recommended" badge
    cy.get('[data-testid="mode-card-chat"]')
      .find('[data-testid="recommended-badge"]')
      .should('be.visible');
  });

  it('allows mode selection when available', () => {
    cy.visit('/threads/thread-001');
    cy.wait('@getThreadLobby');

    // Click on Live mode
    cy.get('[data-testid="mode-card-live"]').click();

    // Should navigate or trigger mode entry
    cy.url().should('include', '/live');
  });

  it('shows XR preflight modal before entering XR', () => {
    cy.intercept('GET', '/api/v2/xr/threads/*/preflight', {
      statusCode: 200,
      body: {
        thread_id: 'thread-001',
        is_available: true,
        maturity_level: 2, // WORKSHOP
        visible_zones: ['intent_wall', 'decision_wall', 'action_table'],
        enabled_features: ['view_actions', 'update_actions'],
        requirements: {
          webxr_supported: true,
          min_maturity: 2,
          permissions_granted: true,
        },
        estimated_load_time_ms: 2500,
      },
    }).as('getXRPreflight');

    cy.visit('/threads/thread-001');
    cy.wait('@getThreadLobby');

    // Click XR mode
    cy.get('[data-testid="mode-card-xr"]').click();
    cy.wait('@getXRPreflight');

    // Preflight modal should appear
    cy.get('[data-testid="xr-preflight-modal"]').should('be.visible');
    cy.contains('Préparation XR').should('be.visible');
    cy.contains('XR disponible').should('be.visible');

    // Shows visible zones
    cy.contains('Mur d\'Intention').should('be.visible');
    cy.contains('Mur de Décisions').should('be.visible');

    // Shows projection notice (critical R&D compliance)
    cy.contains('XR est une projection').should('be.visible');
  });

  it('prevents XR entry when maturity too low', () => {
    // Override with low maturity
    cy.intercept('GET', '/api/v2/threads/*/lobby', {
      statusCode: 200,
      body: {
        thread_id: 'thread-002',
        thread_title: 'New Thread',
        thread_type: 'personal',
        sphere_id: 'sphere-personal',
        sphere_name: 'Personal',
        founding_intent: 'A new thread',
        maturity: {
          thread_id: 'thread-002',
          score: 8,
          level: 0, // SEED
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
        },
        summary: null,
        last_activity: new Date().toISOString(),
        is_live: false,
        live_participants: 0,
        mode_recommendation: {
          recommended_mode: 'chat',
          available_modes: ['chat'],
          reasons: {
            chat: 'Toujours disponible',
            live: 'Requiert niveau Workshop (25+)',
            xr: 'Requiert niveau Workshop (25+)',
          },
        },
        viewer_role: 'owner',
      },
    }).as('getLowMaturityLobby');

    cy.visit('/threads/thread-002');
    cy.wait('@getLowMaturityLobby');

    // XR mode should be disabled
    cy.get('[data-testid="mode-card-xr"]')
      .should('have.attr', 'aria-disabled', 'true')
      .should('have.class', 'opacity-50');

    // Should show requirement message
    cy.contains('Requiert niveau Workshop').should('be.visible');
  });

  it('displays live indicator when session active', () => {
    cy.intercept('GET', '/api/v2/threads/*/lobby', {
      statusCode: 200,
      body: {
        thread_id: 'thread-003',
        thread_title: 'Live Thread',
        thread_type: 'collective',
        sphere_id: 'sphere-business',
        sphere_name: 'Business',
        founding_intent: 'A live thread',
        maturity: {
          thread_id: 'thread-003',
          score: 55,
          level: 3, // STUDIO
          signals: {
            has_founding_intent: true,
            has_decisions: true,
            has_actions: true,
            has_notes: true,
            has_links: true,
            has_summaries: true,
            has_memory_compressed: false,
            total_events: 50,
            days_active: 14,
            has_xr_blueprint: true,
          },
          computed_at: new Date().toISOString(),
          stale_after: new Date(Date.now() + 3600000).toISOString(),
        },
        summary: 'Active discussion',
        last_activity: new Date().toISOString(),
        is_live: true,
        live_participants: 4,
        mode_recommendation: {
          recommended_mode: 'live',
          available_modes: ['chat', 'live', 'xr'],
          reasons: {
            chat: 'Toujours disponible',
            live: 'Session en cours avec 4 participants',
            xr: 'Disponible',
          },
        },
        viewer_role: 'contributor',
      },
    }).as('getLiveThread');

    cy.visit('/threads/thread-003');
    cy.wait('@getLiveThread');

    // Live indicator should be visible
    cy.get('[data-testid="live-indicator"]').should('be.visible');
    cy.contains('EN DIRECT').should('be.visible');
    cy.contains('4').should('be.visible');
    cy.contains('participants').should('be.visible');

    // Join button
    cy.contains('Rejoindre').should('be.visible');
  });

  it('shows maturity signal breakdown on click', () => {
    cy.visit('/threads/thread-001');
    cy.wait('@getThreadLobby');

    // Click maturity badge to expand
    cy.get('[data-testid="maturity-badge"]').click();

    // Signal breakdown should appear
    cy.contains('Intention fondatrice définie').should('be.visible');
    cy.contains('Décisions enregistrées').should('be.visible');
    cy.contains('Actions créées').should('be.visible');
    cy.contains('Notes ajoutées').should('be.visible');
  });
});

describe('Thread Lobby - Identity Boundary (HTTP 403)', () => {
  it('blocks access to thread owned by different identity', () => {
    cy.intercept('GET', '/api/v2/auth/me', {
      statusCode: 200,
      body: {
        id: 'user-001',
        identity_id: 'identity-001',
        email: 'test@che-nu.com',
      },
    }).as('getMe');

    cy.intercept('GET', '/api/v2/threads/*/lobby', {
      statusCode: 403,
      body: {
        error: 'identity_boundary_violation',
        message: 'Access denied: resource belongs to different identity',
        requested_identity: 'identity-001',
        resource_identity: 'identity-999',
      },
    }).as('getThreadForbidden');

    cy.visit('/threads/thread-forbidden');
    cy.wait('@getThreadForbidden');

    // Should show error
    cy.contains('Access denied').should('be.visible');
    
    // Should not show thread content
    cy.get('[data-testid="thread-lobby"]').should('not.exist');
  });
});

describe('Thread Lobby - Checkpoint (HTTP 423)', () => {
  it('shows checkpoint modal when action requires approval', () => {
    cy.intercept('GET', '/api/v2/auth/me', {
      statusCode: 200,
      body: {
        id: 'user-001',
        identity_id: 'identity-001',
        email: 'test@che-nu.com',
      },
    }).as('getMe');

    cy.intercept('GET', '/api/v2/threads/*/lobby', {
      statusCode: 200,
      body: {
        thread_id: 'thread-001',
        thread_title: 'Test Thread',
        thread_type: 'personal',
        sphere_id: 'sphere-personal',
        sphere_name: 'Personal',
        founding_intent: 'Test intent',
        maturity: {
          thread_id: 'thread-001',
          score: 50,
          level: 3,
          signals: {},
          computed_at: new Date().toISOString(),
          stale_after: new Date(Date.now() + 3600000).toISOString(),
        },
        summary: null,
        last_activity: new Date().toISOString(),
        is_live: false,
        live_participants: 0,
        mode_recommendation: {
          recommended_mode: 'chat',
          available_modes: ['chat', 'live', 'xr'],
          reasons: {},
        },
        viewer_role: 'owner',
      },
    }).as('getThreadLobby');

    // Mock action that triggers checkpoint
    cy.intercept('POST', '/api/v2/threads/*/actions', {
      statusCode: 423, // LOCKED
      body: {
        status: 'checkpoint_pending',
        checkpoint: {
          id: 'checkpoint-001',
          type: 'cost',
          reason: 'Action exceeds token budget threshold',
          requires_approval: true,
          options: ['approve', 'reject'],
          details: {
            estimated_cost: 5000,
            budget_remaining: 3000,
          },
        },
      },
    }).as('createActionCheckpoint');

    cy.visit('/threads/thread-001/chat');
    cy.wait('@getThreadLobby');

    // Simulate action that triggers checkpoint
    cy.get('[data-testid="action-create-btn"]').click();
    cy.get('[data-testid="action-input"]').type('Generate detailed report');
    cy.get('[data-testid="action-submit"]').click();

    cy.wait('@createActionCheckpoint');

    // Checkpoint modal should appear
    cy.get('[data-testid="checkpoint-modal"]').should('be.visible');
    cy.contains('Approbation requise').should('be.visible');
    cy.contains('Action exceeds token budget threshold').should('be.visible');

    // Approve and Reject buttons
    cy.get('[data-testid="checkpoint-approve"]').should('be.visible');
    cy.get('[data-testid="checkpoint-reject"]').should('be.visible');
  });

  it('proceeds after checkpoint approval', () => {
    cy.intercept('POST', '/api/v2/governance/checkpoints/*/approve', {
      statusCode: 200,
      body: {
        checkpoint_id: 'checkpoint-001',
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: 'user-001',
      },
    }).as('approveCheckpoint');

    cy.intercept('POST', '/api/v2/threads/*/actions', {
      statusCode: 201,
      body: {
        id: 'action-001',
        title: 'Generate detailed report',
        status: 'created',
        created_at: new Date().toISOString(),
        created_by: 'user-001',
      },
    }).as('createAction');

    // Assuming modal is open from previous test setup
    cy.get('[data-testid="checkpoint-approve"]').click();
    cy.wait('@approveCheckpoint');

    // Should proceed with action
    cy.wait('@createAction');
    
    // Modal should close
    cy.get('[data-testid="checkpoint-modal"]').should('not.exist');
    
    // Success message
    cy.contains('Action créée').should('be.visible');
  });
});
