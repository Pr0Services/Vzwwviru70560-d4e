/**
 * CHE·NU™ - Full Workflow Integration Test
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../App';

describe('Full User Workflow', () => {
  it('complete user journey', async () => {
    render(<App />);
    
    // 1. Login
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@chenu.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'test123' }
    });
    fireEvent.click(screen.getByText(/Login/i));
    
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
    
    // 2. Navigate to Business sphere
    fireEvent.click(screen.getByTestId('sphere-business'));
    
    // 3. Create a thread
    fireEvent.click(screen.getByTestId('section-threads'));
    fireEvent.click(screen.getByText(/New Thread/i));
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Q1 Planning' }
    });
    fireEvent.click(screen.getByText(/Save/i));
    
    // 4. Activate an agent
    fireEvent.click(screen.getByTestId('section-active-agents'));
    fireEvent.click(screen.getByTestId('agent-crm_assistant'));
    fireEvent.click(screen.getByText(/Activate/i));
    
    // 5. Execute agent capability
    fireEvent.click(screen.getByTestId('capability-create_contact'));
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Client' }
    });
    fireEvent.click(screen.getByText(/Execute/i));
    fireEvent.click(screen.getByText(/Approve/i));
    
    // 6. Check budget was deducted
    await waitFor(() => {
      const budget = screen.getByTestId('budget-remaining');
      expect(parseInt(budget.textContent!)).toBeLessThan(1000);
    });
    
    // 7. Switch sphere to Scholar
    fireEvent.click(screen.getByTestId('sphere-scholar'));
    
    // 8. Create flashcard
    fireEvent.click(screen.getByText(/New Flashcard/i));
    fireEvent.change(screen.getByLabelText(/front/i), {
      target: { value: 'What is CHE·NU?' }
    });
    fireEvent.change(screen.getByLabelText(/back/i), {
      target: { value: 'Governed Intelligence OS' }
    });
    fireEvent.click(screen.getByText(/Save/i));
    
    // 9. Talk to Nova
    fireEvent.click(screen.getByText(/Nova/i));
    fireEvent.change(screen.getByPlaceholderText(/Ask Nova/i), {
      target: { value: 'What did I just do?' }
    });
    fireEvent.click(screen.getByText(/Send/i));
    
    // 10. Logout
    fireEvent.click(screen.getByTestId('user-menu'));
    fireEvent.click(screen.getByText(/Logout/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });
});
