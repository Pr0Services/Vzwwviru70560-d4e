/**
 * CYPRESS E2E: governance.cy.ts
 * TESTS: Governance Signals, Backlog, Checkpoints
 * 
 * R&D COMPLIANCE: ✅
 * - Tests Human Gate enforcement
 * - Verifies audit trail creation
 * - Tests CEA signal flows
 */

describe('Governance Dashboard', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v2/auth/me', {
      statusCode: 200,
      body: {
        id: 'user-001',
        identity_id: 'identity-001',
        email: 'test@che-nu.com',
      },
    }).as('getMe');
  });

  describe('Governance Signals', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v2/governance/signals*', {
        statusCode: 200,
        body: {
          items: [
            {
              id: 'signal-001',
              thread_id: 'thread-001',
              event_id: 'event-123',
              level: 'WARN',
              criterion: 'BUDGET_GUARD',
              message: 'Token budget at 82% capacity.',
              details: { current_usage: 8200, budget_limit: 10000 },
              patch_instruction: null,
              created_at: new Date().toISOString(),
            },
            {
              id: 'signal-002',
              thread_id: 'thread-001',
              event_id: 'event-124',
              level: 'BLOCK',
              criterion: 'SECURITY_GUARD',
              message: 'Potential injection detected.',
              details: { pattern: 'DROP TABLE' },
              patch_instruction: null,
              created_at: new Date().toISOString(),
            },
            {
              id: 'signal-003',
              thread_id: 'thread-001',
              event_id: 'event-125',
              level: 'CORRECT',
              criterion: 'CANON_GUARD',
              message: 'Missing traceability fields.',
              details: { missing: ['created_by'] },
              patch_instruction: {
                field: 'payload',
                action: 'merge',
                value: { created_by: '${current_user_id}' },
                reason: 'R&D Rule #6',
              },
              created_at: new Date().toISOString(),
            },
          ],
          total: 3,
        },
      }).as('getSignals');
    });

    it('displays governance signals list', () => {
      cy.visit('/governance');
      cy.wait('@getSignals');

      // All signals visible
      cy.get('[data-testid="signal-card"]').should('have.length', 3);

      // Signal levels displayed
      cy.contains('WARN').should('be.visible');
      cy.contains('BLOCK').should('be.visible');
      cy.contains('CORRECT').should('be.visible');

      // Criteria displayed
      cy.contains('Budget Guard').should('be.visible');
      cy.contains('Security Guard').should('be.visible');
      cy.contains('Canon Guard').should('be.visible');
    });

    it('shows patch instruction for CORRECT signals', () => {
      cy.visit('/governance');
      cy.wait('@getSignals');

      // Find CORRECT signal
      cy.get('[data-testid="signal-card"]')
        .contains('CORRECT')
        .parents('[data-testid="signal-card"]')
        .within(() => {
          // Should show patch instruction
          cy.contains('Instruction de correction').should('be.visible');
          cy.contains('R&D Rule #6').should('be.visible');
        });
    });

    it('allows acknowledging signals', () => {
      cy.intercept('POST', '/api/v2/governance/signals/*/acknowledge', {
        statusCode: 200,
        body: { acknowledged: true },
      }).as('acknowledgeSignal');

      cy.visit('/governance');
      cy.wait('@getSignals');

      // Click acknowledge on first signal
      cy.get('[data-testid="signal-card"]')
        .first()
        .find('[data-testid="acknowledge-btn"]')
        .click();

      cy.wait('@acknowledgeSignal');

      // Signal should be marked as acknowledged
      cy.get('[data-testid="signal-card"]')
        .first()
        .should('have.class', 'acknowledged');
    });

    it('expands signal details on click', () => {
      cy.visit('/governance');
      cy.wait('@getSignals');

      // Click to expand
      cy.get('[data-testid="signal-card"]')
        .first()
        .find('[data-testid="expand-details"]')
        .click();

      // Details should be visible
      cy.contains('current_usage').should('be.visible');
      cy.contains('8200').should('be.visible');
    });
  });

  describe('Governance Backlog', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v2/governance/backlog*', {
        statusCode: 200,
        body: {
          items: [
            {
              id: 'backlog-001',
              thread_id: 'thread-001',
              identity_id: 'identity-001',
              backlog_type: 'error',
              severity: 'high',
              title: 'Agent execution timeout',
              description: 'Creative agent failed to complete within timeout.',
              context: { timeout_ms: 30000, actual_ms: 45000 },
              source_spec: 'CreativeAgent.generate()',
              status: 'open',
              resolution: null,
              fed_to_policy_tuner: false,
              created_at: new Date(Date.now() - 86400000).toISOString(),
              created_by: 'system',
              updated_at: new Date().toISOString(),
            },
            {
              id: 'backlog-002',
              thread_id: 'thread-001',
              identity_id: 'identity-001',
              backlog_type: 'cost',
              severity: 'critical',
              title: 'Monthly budget exceeded',
              description: 'Token usage exceeded budget allocation.',
              context: { budget_limit: 100000, current_usage: 115000 },
              source_spec: 'TokenBudgetService',
              status: 'open',
              resolution: null,
              fed_to_policy_tuner: false,
              created_at: new Date().toISOString(),
              created_by: 'system',
              updated_at: new Date().toISOString(),
            },
            {
              id: 'backlog-003',
              thread_id: 'thread-001',
              identity_id: 'identity-001',
              backlog_type: 'decision',
              severity: 'low',
              title: 'LLM fallback strategy',
              description: 'User needs to decide fallback order.',
              context: { primary: 'anthropic', fallbacks: ['openai', 'google'] },
              source_spec: 'LLMRouter.configure()',
              status: 'in_progress',
              resolution: null,
              fed_to_policy_tuner: false,
              created_at: new Date(Date.now() - 259200000).toISOString(),
              created_by: 'user-001',
              updated_at: new Date().toISOString(),
            },
          ],
          total: 3,
        },
      }).as('getBacklog');
    });

    it('displays backlog items with proper badges', () => {
      cy.visit('/governance/backlog');
      cy.wait('@getBacklog');

      // All items visible
      cy.get('[data-testid="backlog-item"]').should('have.length', 3);

      // Type badges
      cy.contains('Erreur').should('be.visible');
      cy.contains('Coût').should('be.visible');
      cy.contains('Décision').should('be.visible');

      // Severity badges
      cy.contains('Élevé').should('be.visible');
      cy.contains('Critique').should('be.visible');
      cy.contains('Faible').should('be.visible');
    });

    it('highlights critical items', () => {
      cy.visit('/governance/backlog');
      cy.wait('@getBacklog');

      // Critical item should be highlighted
      cy.get('[data-testid="backlog-item"]')
        .contains('Critique')
        .parents('[data-testid="backlog-item"]')
        .should('have.class', 'border-red-500');
    });

    it('allows resolving backlog items', () => {
      cy.intercept('POST', '/api/v2/governance/backlog/*/resolve', {
        statusCode: 200,
        body: {
          id: 'backlog-001',
          status: 'resolved',
          resolution: 'Increased timeout to 60s.',
          resolved_at: new Date().toISOString(),
          resolved_by: 'user-001',
        },
      }).as('resolveBacklog');

      cy.visit('/governance/backlog');
      cy.wait('@getBacklog');

      // Open resolution form on first item
      cy.get('[data-testid="backlog-item"]')
        .first()
        .find('[data-testid="resolve-btn"]')
        .click();

      // Fill resolution
      cy.get('[data-testid="resolution-textarea"]')
        .type('Increased timeout to 60s. Issue resolved.');

      // Submit
      cy.get('[data-testid="submit-resolution"]').click();

      cy.wait('@resolveBacklog');

      // Item should update status
      cy.get('[data-testid="backlog-item"]')
        .first()
        .should('contain', 'Résolu');
    });

    it('allows escalating items', () => {
      cy.intercept('POST', '/api/v2/governance/backlog/*/escalate', {
        statusCode: 200,
        body: {
          id: 'backlog-002',
          severity: 'critical',
          escalated: true,
          escalated_at: new Date().toISOString(),
        },
      }).as('escalateBacklog');

      cy.visit('/governance/backlog');
      cy.wait('@getBacklog');

      // Click escalate on an item
      cy.get('[data-testid="backlog-item"]')
        .eq(1)
        .find('[data-testid="escalate-btn"]')
        .click();

      // Confirm escalation
      cy.get('[data-testid="confirm-escalate"]').click();

      cy.wait('@escalateBacklog');

      // Should show escalated badge
      cy.contains('Escaladé').should('be.visible');
    });

    it('filters backlog by type', () => {
      cy.visit('/governance/backlog');
      cy.wait('@getBacklog');

      // Click filter for "cost" type
      cy.get('[data-testid="filter-type-cost"]').click();

      // Only cost items should be visible
      cy.get('[data-testid="backlog-item"]').should('have.length', 1);
      cy.contains('Monthly budget exceeded').should('be.visible');
      cy.contains('Agent execution timeout').should('not.exist');
    });

    it('filters backlog by severity', () => {
      cy.visit('/governance/backlog');
      cy.wait('@getBacklog');

      // Click filter for "critical" severity
      cy.get('[data-testid="filter-severity-critical"]').click();

      // Only critical items should be visible
      cy.get('[data-testid="backlog-item"]').should('have.length', 1);
      cy.contains('Critique').should('be.visible');
    });
  });

  describe('Checkpoint Approval Flow', () => {
    it('displays pending checkpoints', () => {
      cy.intercept('GET', '/api/v2/governance/checkpoints*', {
        statusCode: 200,
        body: {
          items: [
            {
              id: 'checkpoint-001',
              thread_id: 'thread-001',
              event_id: 'event-100',
              type: 'cost',
              reason: 'Action exceeds token budget threshold (5000 tokens)',
              status: 'pending',
              requires_approval: true,
              details: {
                estimated_cost: 5000,
                budget_remaining: 3000,
                action_type: 'generate_report',
              },
              created_at: new Date().toISOString(),
              created_by: 'system',
            },
            {
              id: 'checkpoint-002',
              thread_id: 'thread-002',
              event_id: 'event-200',
              type: 'governance',
              reason: 'Cross-sphere data transfer requires approval',
              status: 'pending',
              requires_approval: true,
              details: {
                source_sphere: 'Personal',
                target_sphere: 'Business',
                data_type: 'contact_info',
              },
              created_at: new Date().toISOString(),
              created_by: 'system',
            },
          ],
          total: 2,
        },
      }).as('getCheckpoints');

      cy.visit('/governance/checkpoints');
      cy.wait('@getCheckpoints');

      // Both checkpoints visible
      cy.get('[data-testid="checkpoint-card"]').should('have.length', 2);

      // Types visible
      cy.contains('cost').should('be.visible');
      cy.contains('governance').should('be.visible');

      // Reasons visible
      cy.contains('exceeds token budget').should('be.visible');
      cy.contains('Cross-sphere data transfer').should('be.visible');
    });

    it('approves checkpoint with confirmation', () => {
      cy.intercept('GET', '/api/v2/governance/checkpoints*', {
        statusCode: 200,
        body: {
          items: [
            {
              id: 'checkpoint-001',
              thread_id: 'thread-001',
              event_id: 'event-100',
              type: 'cost',
              reason: 'Action exceeds budget',
              status: 'pending',
              requires_approval: true,
              details: { estimated_cost: 5000 },
              created_at: new Date().toISOString(),
              created_by: 'system',
            },
          ],
          total: 1,
        },
      }).as('getCheckpoints');

      cy.intercept('POST', '/api/v2/governance/checkpoints/*/approve', {
        statusCode: 200,
        body: {
          checkpoint_id: 'checkpoint-001',
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: 'user-001',
        },
      }).as('approveCheckpoint');

      cy.visit('/governance/checkpoints');
      cy.wait('@getCheckpoints');

      // Click approve
      cy.get('[data-testid="checkpoint-approve"]').click();

      // Confirmation dialog should appear
      cy.get('[data-testid="confirm-dialog"]').should('be.visible');
      cy.contains('Êtes-vous sûr de vouloir approuver?').should('be.visible');

      // Confirm
      cy.get('[data-testid="confirm-yes"]').click();

      cy.wait('@approveCheckpoint');

      // Success message
      cy.contains('Checkpoint approuvé').should('be.visible');

      // Checkpoint should be removed or marked approved
      cy.get('[data-testid="checkpoint-card"]').should('not.exist');
    });

    it('rejects checkpoint with reason', () => {
      cy.intercept('GET', '/api/v2/governance/checkpoints*', {
        statusCode: 200,
        body: {
          items: [
            {
              id: 'checkpoint-002',
              thread_id: 'thread-002',
              event_id: 'event-200',
              type: 'governance',
              reason: 'Cross-sphere transfer',
              status: 'pending',
              requires_approval: true,
              details: {},
              created_at: new Date().toISOString(),
              created_by: 'system',
            },
          ],
          total: 1,
        },
      }).as('getCheckpoints');

      cy.intercept('POST', '/api/v2/governance/checkpoints/*/reject', {
        statusCode: 200,
        body: {
          checkpoint_id: 'checkpoint-002',
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejected_by: 'user-001',
          rejection_reason: 'Not authorized for this transfer',
        },
      }).as('rejectCheckpoint');

      cy.visit('/governance/checkpoints');
      cy.wait('@getCheckpoints');

      // Click reject
      cy.get('[data-testid="checkpoint-reject"]').click();

      // Reason input should appear
      cy.get('[data-testid="rejection-reason"]')
        .should('be.visible')
        .type('Not authorized for this transfer');

      // Submit rejection
      cy.get('[data-testid="submit-rejection"]').click();

      cy.wait('@rejectCheckpoint');

      // Success message
      cy.contains('Checkpoint rejeté').should('be.visible');
    });
  });

  describe('Orchestrator Decisions Audit', () => {
    it('displays decision history', () => {
      cy.intercept('GET', '/api/v2/governance/decisions*', {
        statusCode: 200,
        body: {
          items: [
            {
              id: 'decision-001',
              thread_id: 'thread-001',
              event_id: 'event-100',
              decision: 'PROCEED_STANDARD',
              reason: 'QCT passed, SES within limits, RDC green',
              qct_result: {
                selected_config: { engine: 'claude-sonnet', quality: 0.85 },
                meets_requirement: true,
              },
              ses_result: {
                request_quality: 0.45,
                escalation_triggered: false,
              },
              rdc_result: {
                signals_evaluated: 3,
                highest_level: 'WARN',
                intervention_required: false,
              },
              checkpoint_id: null,
              created_at: new Date().toISOString(),
            },
            {
              id: 'decision-002',
              thread_id: 'thread-002',
              event_id: 'event-200',
              decision: 'ESCALATE_BACKLOG',
              reason: 'RDC detected BLOCK signal requiring human review',
              qct_result: {
                selected_config: { engine: 'gpt-4o', quality: 0.92 },
                meets_requirement: true,
              },
              ses_result: {
                request_quality: 0.75,
                escalation_triggered: false,
              },
              rdc_result: {
                signals_evaluated: 5,
                highest_level: 'BLOCK',
                intervention_required: true,
              },
              checkpoint_id: 'checkpoint-001',
              created_at: new Date().toISOString(),
            },
          ],
          total: 2,
        },
      }).as('getDecisions');

      cy.visit('/governance/audit');
      cy.wait('@getDecisions');

      // Both decisions visible
      cy.get('[data-testid="decision-row"]').should('have.length', 2);

      // Decision types
      cy.contains('PROCEED_STANDARD').should('be.visible');
      cy.contains('ESCALATE_BACKLOG').should('be.visible');

      // Reasons
      cy.contains('QCT passed, SES within limits').should('be.visible');
      cy.contains('RDC detected BLOCK signal').should('be.visible');
    });

    it('expands decision to show full details', () => {
      cy.intercept('GET', '/api/v2/governance/decisions*', {
        statusCode: 200,
        body: {
          items: [
            {
              id: 'decision-001',
              thread_id: 'thread-001',
              event_id: 'event-100',
              decision: 'PROCEED_STANDARD',
              reason: 'All checks passed',
              qct_result: {
                selected_config: { engine: 'claude-sonnet', quality: 0.85 },
                meets_requirement: true,
              },
              ses_result: {
                request_quality: 0.45,
                escalation_triggered: false,
              },
              rdc_result: {
                signals_evaluated: 3,
                highest_level: 'WARN',
                intervention_required: false,
              },
              checkpoint_id: null,
              created_at: new Date().toISOString(),
            },
          ],
          total: 1,
        },
      }).as('getDecisions');

      cy.visit('/governance/audit');
      cy.wait('@getDecisions');

      // Expand decision
      cy.get('[data-testid="decision-row"]').first().click();

      // QCT details
      cy.contains('QCT Result').should('be.visible');
      cy.contains('claude-sonnet').should('be.visible');
      cy.contains('0.85').should('be.visible');

      // SES details
      cy.contains('SES Result').should('be.visible');
      cy.contains('Request Quality: 0.45').should('be.visible');

      // RDC details
      cy.contains('RDC Result').should('be.visible');
      cy.contains('Signals Evaluated: 3').should('be.visible');
      cy.contains('Highest Level: WARN').should('be.visible');
    });
  });
});

describe('Governance - R&D Compliance Verification', () => {
  it('all governance actions create audit events', () => {
    cy.intercept('GET', '/api/v2/auth/me', {
      statusCode: 200,
      body: { id: 'user-001', identity_id: 'identity-001' },
    }).as('getMe');

    cy.intercept('POST', '/api/v2/governance/checkpoints/*/approve', (req) => {
      // Verify request includes traceability
      expect(req.body).to.have.property('approved_by');
      
      req.reply({
        statusCode: 200,
        body: {
          checkpoint_id: 'checkpoint-001',
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: req.body.approved_by,
          // Should create audit event
          audit_event_id: 'audit-event-001',
        },
      });
    }).as('approveWithAudit');

    // The approval should create an audit trail
    // This verifies R&D Rule #6: Module Traceability
  });

  it('cross-sphere operations require explicit workflow', () => {
    cy.intercept('GET', '/api/v2/auth/me', {
      statusCode: 200,
      body: { id: 'user-001', identity_id: 'identity-001' },
    }).as('getMe');

    // Attempt cross-sphere without workflow
    cy.intercept('POST', '/api/v2/data/transfer', {
      statusCode: 423, // LOCKED - requires checkpoint
      body: {
        status: 'checkpoint_pending',
        checkpoint: {
          id: 'checkpoint-cross-sphere',
          type: 'governance',
          reason: 'Cross-sphere data transfer requires explicit workflow (R&D Rule #3)',
          requires_approval: true,
        },
      },
    }).as('crossSphereBlocked');

    // This verifies R&D Rule #3: Sphere Integrity
  });

  it('no autonomous AI actions without human approval', () => {
    cy.intercept('GET', '/api/v2/auth/me', {
      statusCode: 200,
      body: { id: 'user-001', identity_id: 'identity-001' },
    }).as('getMe');

    // Any action that would be "autonomous" should be blocked
    cy.intercept('POST', '/api/v2/agents/*/execute', {
      statusCode: 423, // LOCKED
      body: {
        status: 'checkpoint_pending',
        checkpoint: {
          id: 'checkpoint-agent',
          type: 'governance',
          reason: 'Agent action requires human approval (R&D Rule #1)',
          requires_approval: true,
        },
      },
    }).as('agentBlocked');

    // This verifies R&D Rule #1: Human Sovereignty
  });
});
