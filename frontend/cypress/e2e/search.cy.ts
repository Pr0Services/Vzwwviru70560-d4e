/**
 * Advanced Search E2E Tests
 * 
 * Tests the full search functionality including:
 * - Search modal open/close
 * - Query input and debounce
 * - Filters and facets
 * - Results display
 * - Keyboard navigation
 * - Recent searches
 */

describe('Advanced Search', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  describe('Search Modal', () => {
    it('opens with Cmd+K keyboard shortcut', () => {
      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-modal"]').should('be.visible');
    });

    it('opens with Ctrl+K keyboard shortcut', () => {
      cy.get('body').type('{ctrl}k');
      cy.get('[data-testid="search-modal"]').should('be.visible');
    });

    it('closes with Escape key', () => {
      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-modal"]').should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('[data-testid="search-modal"]').should('not.exist');
    });

    it('closes when clicking backdrop', () => {
      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-modal"]').should('be.visible');
      cy.get('[data-testid="search-backdrop"]').click({ force: true });
      cy.get('[data-testid="search-modal"]').should('not.exist');
    });

    it('opens from navbar search button', () => {
      cy.get('[data-testid="search-button"]').click();
      cy.get('[data-testid="search-modal"]').should('be.visible');
    });
  });

  describe('Search Input', () => {
    beforeEach(() => {
      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-modal"]').should('be.visible');
    });

    it('focuses input on modal open', () => {
      cy.get('[data-testid="search-input"]').should('be.focused');
    });

    it('debounces search queries', () => {
      cy.intercept('GET', '/api/v1/search/advanced*').as('searchRequest');
      
      // Type quickly - should only make one request after debounce
      cy.get('[data-testid="search-input"]').type('test query');
      
      // Wait for debounce (300ms)
      cy.wait(400);
      cy.get('@searchRequest.all').should('have.length', 1);
    });

    it('shows minimum query length message', () => {
      cy.get('[data-testid="search-input"]').type('a');
      cy.get('[data-testid="search-hint"]').should('contain', 'Type at least 2 characters');
    });

    it('clears input with clear button', () => {
      cy.get('[data-testid="search-input"]').type('test');
      cy.get('[data-testid="clear-search"]').click();
      cy.get('[data-testid="search-input"]').should('have.value', '');
    });
  });

  describe('Search Results', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/search/advanced*', {
        statusCode: 200,
        body: {
          results: [
            {
              id: '1',
              type: 'thread',
              title: 'Test Thread',
              description: 'A test thread description',
              sphere_id: 'personal',
              relevance_score: 0.95,
              created_at: '2025-01-01T00:00:00Z',
              highlights: ['test', 'thread']
            },
            {
              id: '2',
              type: 'decision',
              title: 'Test Decision',
              description: 'A test decision description',
              sphere_id: 'business',
              relevance_score: 0.85,
              created_at: '2025-01-02T00:00:00Z',
              highlights: ['test', 'decision']
            },
            {
              id: '3',
              type: 'agent',
              title: 'Test Agent',
              description: 'A test agent description',
              sphere_id: 'studio',
              relevance_score: 0.75,
              created_at: '2025-01-03T00:00:00Z',
              highlights: ['test', 'agent']
            }
          ],
          total: 3,
          page: 1,
          limit: 20,
          facets: {
            types: { thread: 1, decision: 1, agent: 1 },
            spheres: { personal: 1, business: 1, studio: 1 },
            statuses: { active: 3 }
          },
          took: 45
        }
      }).as('searchResults');

      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-input"]').type('test');
      cy.wait('@searchResults');
    });

    it('displays search results', () => {
      cy.get('[data-testid="search-result"]').should('have.length', 3);
    });

    it('shows result type icons', () => {
      cy.get('[data-testid="search-result"]').first()
        .find('[data-testid="result-type-icon"]')
        .should('exist');
    });

    it('highlights matching text', () => {
      cy.get('[data-testid="search-result"]').first()
        .find('[data-testid="highlight"]')
        .should('exist');
    });

    it('shows sphere badges', () => {
      cy.get('[data-testid="search-result"]').first()
        .find('[data-testid="sphere-badge"]')
        .should('contain', 'Personal');
    });

    it('displays facet counts', () => {
      cy.get('[data-testid="facet-threads"]').should('contain', '1');
      cy.get('[data-testid="facet-decisions"]').should('contain', '1');
      cy.get('[data-testid="facet-agents"]').should('contain', '1');
    });

    it('shows search time', () => {
      cy.get('[data-testid="search-time"]').should('contain', '45ms');
    });

    it('shows total results count', () => {
      cy.get('[data-testid="results-count"]').should('contain', '3');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/search/advanced*', {
        statusCode: 200,
        body: {
          results: [
            { id: '1', type: 'thread', title: 'Result 1', relevance_score: 0.9 },
            { id: '2', type: 'thread', title: 'Result 2', relevance_score: 0.8 },
            { id: '3', type: 'thread', title: 'Result 3', relevance_score: 0.7 }
          ],
          total: 3,
          facets: {}
        }
      }).as('searchResults');

      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-input"]').type('test');
      cy.wait('@searchResults');
    });

    it('navigates down with arrow down', () => {
      cy.get('[data-testid="search-input"]').type('{downarrow}');
      cy.get('[data-testid="search-result"]').first()
        .should('have.class', 'selected');
    });

    it('navigates up with arrow up', () => {
      cy.get('[data-testid="search-input"]').type('{downarrow}{downarrow}{uparrow}');
      cy.get('[data-testid="search-result"]').first()
        .should('have.class', 'selected');
    });

    it('selects result with Enter', () => {
      cy.get('[data-testid="search-input"]').type('{downarrow}{enter}');
      // Should navigate to result
      cy.url().should('include', '/threads/1');
    });

    it('wraps navigation at boundaries', () => {
      cy.get('[data-testid="search-input"]')
        .type('{downarrow}{downarrow}{downarrow}{downarrow}');
      cy.get('[data-testid="search-result"]').first()
        .should('have.class', 'selected');
    });
  });

  describe('Filters', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/search/advanced*').as('searchRequest');
      cy.get('body').type('{cmd}k');
    });

    it('filters by type', () => {
      cy.get('[data-testid="search-input"]').type('test');
      cy.wait('@searchRequest');
      
      cy.get('[data-testid="filter-type-thread"]').click();
      cy.wait('@searchRequest');
      
      cy.get('@searchRequest.all').then((interceptions) => {
        const lastRequest = interceptions[interceptions.length - 1];
        expect(lastRequest.request.url).to.include('types=thread');
      });
    });

    it('filters by sphere', () => {
      cy.get('[data-testid="search-input"]').type('test');
      cy.wait('@searchRequest');
      
      cy.get('[data-testid="filter-sphere"]').click();
      cy.get('[data-testid="sphere-option-personal"]').click();
      cy.wait('@searchRequest');
      
      cy.get('@searchRequest.all').then((interceptions) => {
        const lastRequest = interceptions[interceptions.length - 1];
        expect(lastRequest.request.url).to.include('sphere_ids=personal');
      });
    });

    it('shows active filter badges', () => {
      cy.get('[data-testid="search-input"]').type('test');
      cy.get('[data-testid="filter-type-thread"]').click();
      
      cy.get('[data-testid="active-filters"]')
        .should('contain', 'thread');
    });

    it('clears all filters', () => {
      cy.get('[data-testid="search-input"]').type('test');
      cy.get('[data-testid="filter-type-thread"]').click();
      cy.get('[data-testid="filter-type-decision"]').click();
      
      cy.get('[data-testid="clear-filters"]').click();
      cy.get('[data-testid="active-filters"]').should('not.exist');
    });
  });

  describe('Recent Searches', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/search/recent', {
        statusCode: 200,
        body: {
          searches: [
            { query: 'previous search 1', timestamp: '2025-01-01T00:00:00Z' },
            { query: 'previous search 2', timestamp: '2025-01-02T00:00:00Z' }
          ]
        }
      }).as('recentSearches');

      cy.get('body').type('{cmd}k');
      cy.wait('@recentSearches');
    });

    it('shows recent searches when no query', () => {
      cy.get('[data-testid="recent-searches"]').should('be.visible');
      cy.get('[data-testid="recent-search-item"]').should('have.length', 2);
    });

    it('uses recent search on click', () => {
      cy.intercept('GET', '/api/v1/search/advanced*').as('searchRequest');
      cy.get('[data-testid="recent-search-item"]').first().click();
      
      cy.get('[data-testid="search-input"]').should('have.value', 'previous search 1');
      cy.wait('@searchRequest');
    });

    it('clears recent searches', () => {
      cy.intercept('DELETE', '/api/v1/search/recent', {
        statusCode: 200,
        body: { message: 'Cleared' }
      }).as('clearRecent');

      cy.get('[data-testid="clear-recent-searches"]').click();
      cy.wait('@clearRecent');
      cy.get('[data-testid="recent-searches"]').should('not.exist');
    });
  });

  describe('Empty States', () => {
    it('shows empty state for no results', () => {
      cy.intercept('GET', '/api/v1/search/advanced*', {
        statusCode: 200,
        body: { results: [], total: 0, facets: {} }
      }).as('emptyResults');

      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-input"]').type('nonexistent query');
      cy.wait('@emptyResults');

      cy.get('[data-testid="no-results"]').should('be.visible');
      cy.get('[data-testid="no-results"]').should('contain', 'No results found');
    });

    it('shows initial state with suggestions', () => {
      cy.intercept('GET', '/api/v1/search/suggestions*', {
        statusCode: 200,
        body: {
          suggestions: ['thread management', 'decision tracking', 'agent config']
        }
      }).as('suggestions');

      cy.get('body').type('{cmd}k');
      cy.wait('@suggestions');

      cy.get('[data-testid="suggestions"]').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('shows error state on API failure', () => {
      cy.intercept('GET', '/api/v1/search/advanced*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('searchError');

      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-input"]').type('test');
      cy.wait('@searchError');

      cy.get('[data-testid="search-error"]').should('be.visible');
    });

    it('allows retry after error', () => {
      cy.intercept('GET', '/api/v1/search/advanced*', {
        statusCode: 500
      }).as('searchError');

      cy.get('body').type('{cmd}k');
      cy.get('[data-testid="search-input"]').type('test');
      cy.wait('@searchError');

      cy.intercept('GET', '/api/v1/search/advanced*', {
        statusCode: 200,
        body: { results: [], total: 0, facets: {} }
      }).as('searchRetry');

      cy.get('[data-testid="retry-search"]').click();
      cy.wait('@searchRetry');
      cy.get('[data-testid="search-error"]').should('not.exist');
    });
  });
});
