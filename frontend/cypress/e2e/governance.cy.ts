// ***********************************************************
// CHE·NU V75 — Governance E2E Tests
// ***********************************************************

describe('Governance Page', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/checkpoints*').as('getCheckpoints');
    cy.intercept('GET', '**/governance/metrics').as('getMetrics');
    cy.visit('/governance');
    cy.wait('@getCheckpoints');
  });

  it('should display governance metrics', () => {
    cy.wait('@getMetrics');
    cy.contains(/score|métrique|gouvernance/i).should('be.visible');
  });

  it('should display pending checkpoints', () => {
    cy.contains(/checkpoints|en attente|pending/i).should('be.visible');
    cy.get('[class*="checkpoint"]').should('exist');
  });

  it('should show checkpoint details', () => {
    cy.get('[class*="checkpoint"]').first().click();
    cy.contains(/type|action|description/i).should('be.visible');
  });
});

describe('Checkpoint Resolution', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/checkpoints/pending').as('getPending');
    cy.visit('/governance');
    cy.wait('@getPending');
  });

  it('should show approve/reject buttons', () => {
    cy.get('[class*="checkpoint"]').first().within(() => {
      cy.contains('button', /approuver|approve/i).should('be.visible');
      cy.contains('button', /rejeter|reject/i).should('be.visible');
    });
  });

  it('should approve checkpoint', () => {
    cy.intercept('POST', '**/checkpoints/resolve').as('resolveCheckpoint');
    
    cy.get('[class*="checkpoint"]').first().within(() => {
      cy.contains('button', /approuver|approve/i).click();
    });
    
    cy.wait('@resolveCheckpoint');
    cy.contains(/approuvé|approved|succès/i).should('be.visible');
  });

  it('should reject checkpoint', () => {
    cy.intercept('POST', '**/checkpoints/resolve').as('resolveCheckpoint');
    
    cy.get('[class*="checkpoint"]').first().within(() => {
      cy.contains('button', /rejeter|reject/i).click();
    });
    
    // May need to provide reason
    cy.get('textarea[name="reason"]').type('Test rejection reason');
    cy.contains('button', /confirmer|confirm/i).click();
    
    cy.wait('@resolveCheckpoint');
    cy.contains(/rejeté|rejected|succès/i).should('be.visible');
  });
});

describe('Governance Audit Log', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/governance/audit').as('getAudit');
    cy.visit('/governance');
  });

  it('should display audit log', () => {
    cy.contains(/audit|historique|log/i).click();
    cy.wait('@getAudit');
    cy.get('[class*="audit"]').should('exist');
  });
});

describe('Governance - HTTP 423 Checkpoint', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should handle HTTP 423 checkpoint response', () => {
    // Intercept with 423 response
    cy.intercept('POST', '**/threads/*/archive', {
      statusCode: 423,
      body: {
        status: 'checkpoint_pending',
        checkpoint: {
          id: 'test-checkpoint-id',
          type: 'governance',
          reason: 'Action requires approval',
          requires_approval: true,
          options: ['approve', 'reject']
        }
      }
    }).as('archiveThread');

    cy.visit('/threads');
    
    // Try to archive a thread
    cy.get('[class*="thread"]').first().within(() => {
      cy.get('button[aria-label*="menu"]').click();
    });
    cy.contains('Archiver').click();
    
    cy.wait('@archiveThread');
    
    // Should show checkpoint modal
    cy.contains(/checkpoint|approval|approbation/i).should('be.visible');
    cy.contains('button', /approuver|approve/i).should('be.visible');
    cy.contains('button', /rejeter|reject/i).should('be.visible');
  });
});
