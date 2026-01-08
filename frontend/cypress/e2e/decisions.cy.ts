// ***********************************************************
// CHE·NU V75 — Decisions E2E Tests
// ***********************************************************

describe('Decisions Page', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/decisions').as('getDecisions');
    cy.intercept('GET', '**/decisions/stats').as('getStats');
    cy.visit('/decisions');
    cy.wait('@getDecisions');
  });

  it('should display decisions list', () => {
    cy.contains(/décisions|decisions/i).should('be.visible');
    cy.get('[class*="decision"]').should('have.length.greaterThan', 0);
  });

  it('should display decision stats', () => {
    cy.wait('@getStats');
    cy.contains(/en attente|pending/i).should('be.visible');
  });

  it('should filter by status', () => {
    cy.get('select[name="status"], [data-testid="status-filter"]').select('pending');
    cy.get('[class*="decision"]').each(($el) => {
      cy.wrap($el).should('contain', /pending|attente/i);
    });
  });

  it('should filter by priority', () => {
    cy.get('select[name="priority"], [data-testid="priority-filter"]').select('high');
    cy.get('[class*="decision"]').should('exist');
  });
});

describe('Decision Details', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/decisions');
  });

  it('should show decision details', () => {
    cy.get('[class*="decision"]').first().click();
    
    cy.contains(/contexte|context/i).should('be.visible');
    cy.contains(/options/i).should('be.visible');
  });

  it('should display decision options', () => {
    cy.get('[class*="decision"]').first().click();
    
    cy.get('[class*="option"]').should('have.length.greaterThan', 0);
  });
});

describe('Make Decision', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/decisions');
  });

  it('should make a decision', () => {
    cy.intercept('POST', '**/decisions/make').as('makeDecision');
    
    cy.get('[class*="decision"]').first().click();
    
    // Select an option
    cy.get('[class*="option"]').first().click();
    
    // Confirm decision
    cy.contains('button', /confirmer|décider|confirm/i).click();
    
    cy.wait('@makeDecision');
    cy.contains(/décision enregistrée|recorded|succès/i).should('be.visible');
  });

  it('should require selection before confirming', () => {
    cy.get('[class*="decision"]').first().click();
    
    // Try to confirm without selection
    cy.contains('button', /confirmer|décider|confirm/i).should('be.disabled');
  });
});

describe('Defer Decision', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/decisions');
  });

  it('should defer a decision', () => {
    cy.intercept('POST', '**/decisions/*/defer').as('deferDecision');
    
    cy.get('[class*="decision"]').first().click();
    
    // Click defer
    cy.contains('button', /reporter|defer|plus tard/i).click();
    
    // Provide reason
    cy.get('textarea[name="reason"]').type('Need more information');
    cy.contains('button', /confirmer|confirm/i).click();
    
    cy.wait('@deferDecision');
    cy.contains(/reportée|deferred|succès/i).should('be.visible');
  });
});

describe('Decision Timeline', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/decisions');
  });

  it('should display decision history', () => {
    cy.get('[class*="decision"]').first().click();
    
    cy.contains(/historique|timeline|history/i).click();
    cy.get('[class*="timeline"], [class*="history"]').should('exist');
  });
});

describe('Decision Governance Integration', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should trigger checkpoint for sensitive decisions', () => {
    cy.intercept('POST', '**/decisions/make', {
      statusCode: 423,
      body: {
        status: 'checkpoint_pending',
        checkpoint: {
          id: 'decision-checkpoint',
          type: 'governance',
          reason: 'High-impact decision requires additional approval',
          options: ['approve', 'reject']
        }
      }
    }).as('decisionCheckpoint');

    cy.visit('/decisions');
    cy.get('[class*="decision"]').first().click();
    cy.get('[class*="option"]').first().click();
    cy.contains('button', /confirmer|décider/i).click();
    
    cy.wait('@decisionCheckpoint');
    
    // Checkpoint modal
    cy.contains(/checkpoint|approbation/i).should('be.visible');
  });
});
