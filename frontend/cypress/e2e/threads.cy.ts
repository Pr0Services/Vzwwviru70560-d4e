// ***********************************************************
// CHE·NU V75 — Threads E2E Tests
// ***********************************************************

describe('Threads Page', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/threads*').as('getThreads');
    cy.visit('/threads');
    cy.wait('@getThreads');
  });

  it('should display threads list', () => {
    cy.contains('Threads').should('be.visible');
    cy.get('[class*="thread"]').should('have.length.greaterThan', 0);
  });

  it('should display thread maturity levels', () => {
    // Check for maturity indicators (SEED, GROWING, MATURE, etc.)
    cy.get('[class*="maturity"]').should('exist');
  });

  it('should filter threads by sphere', () => {
    // Click on sphere filter
    cy.get('select, [role="combobox"]').first().click();
    cy.contains('Personal').click();
    
    // Verify filter is applied
    cy.url().should('include', 'sphere');
  });

  it('should search threads', () => {
    cy.get('input[type="search"], input[placeholder*="search" i]').type('Rénovation');
    cy.get('[class*="thread"]').should('exist');
  });

  it('should open thread details', () => {
    cy.get('[class*="thread"]').first().click();
    cy.contains('Intent').should('be.visible');
  });
});

describe('Thread Creation', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/threads');
  });

  it('should open create thread modal', () => {
    cy.contains('button', /nouveau|créer|new/i).click();
    cy.contains('Créer un Thread').should('be.visible');
  });

  it('should create a new thread', () => {
    cy.intercept('POST', '**/threads').as('createThread');
    
    cy.contains('button', /nouveau|créer|new/i).click();
    
    // Fill form
    cy.get('input[name="title"], input[placeholder*="titre" i]').type('Test Thread E2E');
    cy.get('textarea[name="founding_intent"], textarea[placeholder*="intent" i]').type('Test founding intent for E2E');
    
    // Select sphere
    cy.get('select[name="sphere_id"], [data-testid="sphere-select"]').select('personal');
    
    // Submit
    cy.contains('button', /créer|create|submit/i).click();
    
    cy.wait('@createThread');
    cy.contains('Test Thread E2E').should('be.visible');
  });
});

describe('Thread Archive', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/threads');
  });

  it('should show archive confirmation (checkpoint)', () => {
    cy.intercept('POST', '**/threads/*/archive').as('archiveThread');
    
    // Open thread actions
    cy.get('[class*="thread"]').first().within(() => {
      cy.get('button[aria-label*="menu"], button[aria-label*="actions"]').click();
    });
    
    cy.contains('Archiver').click();
    
    // Should show checkpoint modal
    cy.contains(/checkpoint|confirmation|approuver/i).should('be.visible');
  });
});
