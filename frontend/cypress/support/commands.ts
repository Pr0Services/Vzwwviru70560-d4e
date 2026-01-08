// ***********************************************************
// CHE·NU V75 — Custom Cypress Commands
// ***********************************************************

const API_URL = Cypress.env('apiUrl') || 'http://localhost:8000/api/v1';

// Login command
Cypress.Commands.add('login', (email = 'test@chenu.io', password = 'test123') => {
  cy.request({
    method: 'POST',
    url: `${API_URL}/auth/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body.data?.access_token) {
      window.localStorage.setItem('chenu_token', response.body.data.access_token);
      window.localStorage.setItem('chenu_refresh_token', response.body.data.refresh_token || '');
    }
  });
});

// Logout command
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('chenu_token');
  window.localStorage.removeItem('chenu_refresh_token');
});

// Wait for API to be ready
Cypress.Commands.add('waitForApi', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:8000/health',
    retryOnStatusCodeFailure: true,
    timeout: 30000,
  }).its('status').should('eq', 200);
});

// Get element by data-testid
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Intercept API calls helper
Cypress.Commands.add('interceptApi', (method: string, path: string, alias: string, fixture?: string) => {
  const options: any = {
    method,
    url: `${API_URL}${path}`,
  };
  
  if (fixture) {
    options.fixture = fixture;
  }
  
  cy.intercept(options).as(alias);
});
