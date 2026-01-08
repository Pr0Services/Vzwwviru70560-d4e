// ***********************************************************
// CHE·NU V75 — Agents E2E Tests
// ***********************************************************

describe('Agents Page', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/agents').as('getAgents');
    cy.intercept('GET', '**/agents/stats').as('getAgentStats');
    cy.visit('/agents');
    cy.wait('@getAgents');
  });

  it('should display agents list', () => {
    cy.contains('Agents').should('be.visible');
    cy.get('[class*="agent"]').should('have.length.greaterThan', 0);
  });

  it('should display agent stats', () => {
    cy.wait('@getAgentStats');
    cy.contains(/total|disponibles|engagés/i).should('be.visible');
  });

  it('should filter agents by domain', () => {
    cy.get('select[name="domain"], [data-testid="domain-filter"]').select('construction');
    cy.get('[class*="agent"]').should('exist');
  });

  it('should filter agents by level', () => {
    cy.get('select[name="level"], [data-testid="level-filter"]').select('2');
    cy.get('[class*="agent"]').should('exist');
  });

  it('should show agent details on click', () => {
    cy.get('[class*="agent"]').first().click();
    cy.contains(/capabilities|capacités/i).should('be.visible');
  });
});

describe('Agent Hire Flow', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/agents');
  });

  it('should show hire button for available agents', () => {
    cy.get('[class*="agent"]').first().within(() => {
      cy.contains('button', /engager|hire/i).should('be.visible');
    });
  });

  it('should trigger checkpoint when hiring agent', () => {
    cy.intercept('POST', '**/agents/hire').as('hireAgent');
    
    cy.get('[class*="agent"]').first().within(() => {
      cy.contains('button', /engager|hire/i).click();
    });
    
    cy.wait('@hireAgent');
    
    // Should show checkpoint or success message
    cy.contains(/checkpoint|succès|engagé/i).should('be.visible');
  });
});

describe('Agent Dismiss Flow', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/agents');
  });

  it('should show dismiss button for hired agents', () => {
    // Filter to hired only
    cy.get('input[type="checkbox"][name="hired_only"], [data-testid="hired-filter"]').check();
    
    cy.get('[class*="agent"]').first().within(() => {
      cy.contains('button', /renvoyer|dismiss/i).should('be.visible');
    });
  });

  it('should dismiss agent', () => {
    cy.intercept('POST', '**/agents/*/dismiss').as('dismissAgent');
    
    cy.get('input[type="checkbox"][name="hired_only"]').check();
    
    cy.get('[class*="agent"]').first().within(() => {
      cy.contains('button', /renvoyer|dismiss/i).click();
    });
    
    cy.wait('@dismissAgent');
    cy.contains(/succès|renvoyé|dismissed/i).should('be.visible');
  });
});
