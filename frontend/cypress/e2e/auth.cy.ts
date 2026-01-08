// ***********************************************************
// CHE·NU V75 — Auth E2E Tests
// ***********************************************************

describe('Authentication', () => {
  beforeEach(() => {
    cy.logout();
  });

  it('should display login page', () => {
    cy.visit('/login');
    cy.contains(/connexion|login|se connecter/i).should('be.visible');
    cy.get('input[type="email"], input[name="email"]').should('be.visible');
    cy.get('input[type="password"], input[name="password"]').should('be.visible');
  });

  it('should login successfully', () => {
    cy.intercept('POST', '**/auth/login').as('login');
    
    cy.visit('/login');
    cy.get('input[type="email"], input[name="email"]').type('test@chenu.io');
    cy.get('input[type="password"], input[name="password"]').type('test123');
    cy.contains('button', /connexion|login|se connecter/i).click();
    
    cy.wait('@login');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should show error on invalid credentials', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { success: false, error: 'Invalid credentials' }
    }).as('loginFail');
    
    cy.visit('/login');
    cy.get('input[type="email"], input[name="email"]').type('wrong@email.com');
    cy.get('input[type="password"], input[name="password"]').type('wrongpass');
    cy.contains('button', /connexion|login/i).click();
    
    cy.wait('@loginFail');
    cy.contains(/erreur|invalid|incorrect/i).should('be.visible');
  });

  it('should logout successfully', () => {
    cy.login();
    cy.visit('/');
    
    // Open user menu and logout
    cy.get('[data-testid="user-menu"], [aria-label*="user"], [aria-label*="profil"]').click();
    cy.contains(/déconnexion|logout/i).click();
    
    cy.url().should('include', '/login');
  });

  it('should redirect to login when not authenticated', () => {
    cy.visit('/threads');
    cy.url().should('include', '/login');
  });

  it('should persist session on page reload', () => {
    cy.login();
    cy.visit('/');
    cy.reload();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});

describe('Token Refresh', () => {
  it('should refresh token when expired', () => {
    cy.intercept('POST', '**/auth/refresh').as('refresh');
    
    // Set expired token
    cy.login();
    window.localStorage.setItem('chenu_token', 'expired_token');
    
    cy.visit('/');
    
    // Should trigger refresh
    cy.wait('@refresh');
  });
});

describe('Identity Boundary (HTTP 403)', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should handle HTTP 403 forbidden', () => {
    cy.intercept('GET', '**/threads/other-user-thread', {
      statusCode: 403,
      body: {
        error: 'identity_boundary_violation',
        message: 'Access denied: resource belongs to different identity'
      }
    }).as('forbidden');

    cy.visit('/threads/other-user-thread');
    
    cy.wait('@forbidden');
    cy.contains(/accès refusé|forbidden|interdit/i).should('be.visible');
  });
});
