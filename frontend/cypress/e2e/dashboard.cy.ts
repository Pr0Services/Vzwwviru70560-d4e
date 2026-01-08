// ***********************************************************
// CHE·NU V75 — Dashboard E2E Tests
// ***********************************************************

describe('Dashboard', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should display dashboard stats', () => {
    // Wait for stats to load
    cy.intercept('GET', '**/dashboard/stats').as('getStats');
    cy.visit('/');
    cy.wait('@getStats');

    // Check stats cards are displayed
    cy.contains('Décisions en attente').should('be.visible');
    cy.contains('Threads actifs').should('be.visible');
    cy.contains('Agents engagés').should('be.visible');
    cy.contains('Checkpoints').should('be.visible');
  });

  it('should display governance score', () => {
    cy.contains('Score de Gouvernance').should('be.visible');
    cy.get('[class*="governance"]').should('exist');
  });

  it('should display recent activity', () => {
    cy.intercept('GET', '**/dashboard/activity').as('getActivity');
    cy.visit('/');
    cy.wait('@getActivity');

    cy.contains('Activité Récente').should('be.visible');
  });

  it('should navigate to threads from dashboard', () => {
    cy.contains('Threads').click();
    cy.url().should('include', '/threads');
  });

  it('should navigate to agents from dashboard', () => {
    cy.contains('Agents').click();
    cy.url().should('include', '/agents');
  });

  it('should navigate to governance from dashboard', () => {
    cy.contains('Gouvernance').click();
    cy.url().should('include', '/governance');
  });
});

describe('Dashboard - Responsive', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should display correctly on mobile', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.contains('Décisions en attente').should('be.visible');
  });

  it('should display correctly on tablet', () => {
    cy.viewport('ipad-2');
    cy.visit('/');
    cy.contains('Décisions en attente').should('be.visible');
  });
});
