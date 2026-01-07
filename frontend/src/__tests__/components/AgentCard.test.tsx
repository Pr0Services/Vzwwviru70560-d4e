/**
 * CHE·NU™ - Agent Card Tests
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentCard } from '../components/AgentCard';

const mockAgent = {
  id: 'business.crm_assistant',
  name: 'CRM Assistant',
  level: 'L3',
  capabilities: ['create_contact', 'search_contacts'],
  tokensUsed: 150,
};

describe('AgentCard', () => {
  it('displays agent info', () => {
    render(<AgentCard agent={mockAgent} />);
    
    expect(screen.getByText('CRM Assistant')).toBeInTheDocument();
    expect(screen.getByText('L3')).toBeInTheDocument();
  });
  
  it('shows capabilities', () => {
    render(<AgentCard agent={mockAgent} />);
    
    expect(screen.getByText(/create_contact/i)).toBeInTheDocument();
    expect(screen.getByText(/search_contacts/i)).toBeInTheDocument();
  });
  
  it('shows token usage', () => {
    render(<AgentCard agent={mockAgent} />);
    
    expect(screen.getByText(/150 tokens/i)).toBeInTheDocument();
  });
  
  it('activates agent', () => {
    const onActivate = jest.fn();
    render(<AgentCard agent={mockAgent} onActivate={onActivate} />);
    
    fireEvent.click(screen.getByText(/Activate/i));
    
    expect(onActivate).toHaveBeenCalledWith(mockAgent.id);
  });
});
