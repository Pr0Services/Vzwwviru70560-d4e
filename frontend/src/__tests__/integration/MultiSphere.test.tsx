/**
 * CHE·NU™ - Multi-Sphere Integration Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../App';

describe('Multi-Sphere Integration', () => {
  it('switches between spheres maintaining context', async () => {
    render(<App />);
    
    // Start in Business
    fireEvent.click(screen.getByTestId('sphere-business'));
    await waitFor(() => {
      expect(screen.getByTestId('bureau-business')).toBeVisible();
    });
    
    // Create thread in Business
    fireEvent.click(screen.getByTestId('section-threads'));
    fireEvent.click(screen.getByText(/New Thread/i));
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Business Thread' }
    });
    fireEvent.click(screen.getByText(/Save/i));
    
    // Switch to Scholar
    fireEvent.click(screen.getByTestId('sphere-scholar'));
    await waitFor(() => {
      expect(screen.getByTestId('bureau-scholar')).toBeVisible();
    });
    
    // Create thread in Scholar
    fireEvent.click(screen.getByTestId('section-threads'));
    fireEvent.click(screen.getByText(/New Thread/i));
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Scholar Thread' }
    });
    fireEvent.click(screen.getByText(/Save/i));
    
    // Switch back to Business
    fireEvent.click(screen.getByTestId('sphere-business'));
    
    // Business thread should still be there
    await waitFor(() => {
      expect(screen.getByText('Business Thread')).toBeInTheDocument();
    });
    
    // Scholar thread should NOT be visible
    expect(screen.queryByText('Scholar Thread')).not.toBeInTheDocument();
  });
  
  it('data isolation between spheres', async () => {
    render(<App />);
    
    // Business data
    fireEvent.click(screen.getByTestId('sphere-business'));
    const businessAgents = screen.getAllByTestId(/agent-/);
    const businessAgentIds = businessAgents.map(a => a.dataset.testid);
    
    // Scholar data
    fireEvent.click(screen.getByTestId('sphere-scholar'));
    const scholarAgents = screen.getAllByTestId(/agent-/);
    const scholarAgentIds = scholarAgents.map(a => a.dataset.testid);
    
    // Should be different agents
    expect(businessAgentIds).not.toEqual(scholarAgentIds);
  });
});
