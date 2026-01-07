/**
 * CHE·NU™ - Agent Workflow Integration Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AgentWorkflow } from '../components/AgentWorkflow';
import { HubProvider } from '../../hubs/HubArchitecture';

describe('Agent Workflow Integration', () => {
  it('complete agent execution flow', async () => {
    render(
      <HubProvider>
        <AgentWorkflow />
      </HubProvider>
    );
    
    // 1. Select agent
    fireEvent.click(screen.getByTestId('agent-crm_assistant'));
    
    // 2. Select capability
    fireEvent.click(screen.getByTestId('capability-create_contact'));
    
    // 3. Fill parameters
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' }
    });
    
    // 4. Request execution
    fireEvent.click(screen.getByText(/Execute/i));
    
    // 5. Should show governance check
    await waitFor(() => {
      expect(screen.getByText(/Governance Check/i)).toBeInTheDocument();
    });
    
    // 6. Approve
    fireEvent.click(screen.getByText(/Approve/i));
    
    // 7. Execution completes
    await waitFor(() => {
      expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
  
  it('handles budget exceeded', async () => {
    render(
      <HubProvider>
        <AgentWorkflow initialBudget={0} />
      </HubProvider>
    );
    
    fireEvent.click(screen.getByTestId('agent-crm_assistant'));
    fireEvent.click(screen.getByTestId('capability-create_contact'));
    fireEvent.click(screen.getByText(/Execute/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Insufficient budget/i)).toBeInTheDocument();
    });
  });
});
