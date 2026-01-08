// ***********************************************************
// CHE·NU V75 — Nova E2E Tests
// ***********************************************************

describe('Nova Page', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/nova/history').as('getHistory');
    cy.visit('/nova');
  });

  it('should display Nova interface', () => {
    cy.contains(/nova|assistant|intelligence/i).should('be.visible');
  });

  it('should display chat input', () => {
    cy.get('textarea, input[type="text"]').should('be.visible');
    cy.contains('button', /envoyer|send/i).should('be.visible');
  });

  it('should load conversation history', () => {
    cy.wait('@getHistory');
    cy.get('[class*="message"], [class*="chat"]').should('exist');
  });
});

describe('Nova Chat', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/nova');
  });

  it('should send a message', () => {
    cy.intercept('POST', '**/nova/chat').as('sendMessage');
    
    cy.get('textarea, input[type="text"]').type('Quel est le statut de mes threads?');
    cy.contains('button', /envoyer|send/i).click();
    
    cy.wait('@sendMessage');
    
    // Should display user message
    cy.contains('Quel est le statut de mes threads?').should('be.visible');
    
    // Should display Nova response
    cy.get('[class*="response"], [class*="assistant"]').should('exist');
  });

  it('should display loading state while waiting for response', () => {
    cy.intercept('POST', '**/nova/chat', (req) => {
      req.reply({
        delay: 2000,
        body: { success: true, data: { response: 'Test response' } }
      });
    }).as('slowChat');
    
    cy.get('textarea').type('Test message');
    cy.contains('button', /envoyer|send/i).click();
    
    // Should show loading
    cy.get('[class*="loading"], [class*="spinner"]').should('be.visible');
    
    cy.wait('@slowChat');
  });

  it('should handle chat error gracefully', () => {
    cy.intercept('POST', '**/nova/chat', {
      statusCode: 500,
      body: { success: false, error: 'Internal error' }
    }).as('chatError');
    
    cy.get('textarea').type('Test message');
    cy.contains('button', /envoyer|send/i).click();
    
    cy.wait('@chatError');
    cy.contains(/erreur|error/i).should('be.visible');
  });
});

describe('Nova History', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/nova');
  });

  it('should clear history', () => {
    cy.intercept('DELETE', '**/nova/history').as('clearHistory');
    
    cy.contains('button', /effacer|clear|supprimer/i).click();
    
    // Confirm deletion
    cy.contains('button', /confirmer|confirm/i).click();
    
    cy.wait('@clearHistory');
    cy.contains(/historique effacé|cleared/i).should('be.visible');
  });
});

describe('Nova Multi-Lane Pipeline', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/nova');
  });

  it('should display pipeline status', () => {
    cy.intercept('POST', '**/nova/chat', {
      body: {
        success: true,
        data: {
          response: 'Analysis complete',
          pipeline: {
            intent_analysis: 'completed',
            context_snapshot: 'completed',
            governance_check: 'completed',
            execution: 'completed'
          }
        }
      }
    }).as('chatWithPipeline');
    
    cy.get('textarea').type('Analyze my threads');
    cy.contains('button', /envoyer|send/i).click();
    
    cy.wait('@chatWithPipeline');
    
    // Pipeline status should be visible
    cy.get('[class*="pipeline"], [class*="lane"]').should('exist');
  });

  it('should handle checkpoint from Nova', () => {
    cy.intercept('POST', '**/nova/chat', {
      statusCode: 423,
      body: {
        status: 'checkpoint_pending',
        checkpoint: {
          id: 'nova-checkpoint',
          type: 'sensitive_action',
          reason: 'This action requires approval',
          options: ['approve', 'reject']
        }
      }
    }).as('novaCheckpoint');
    
    cy.get('textarea').type('Delete all my data');
    cy.contains('button', /envoyer|send/i).click();
    
    cy.wait('@novaCheckpoint');
    
    // Checkpoint modal should appear
    cy.contains(/checkpoint|approbation/i).should('be.visible');
  });
});
