/**
 * CHE·NU™ - Thread List Tests
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { ThreadList } from '../components/ThreadList';

const mockThreads = [
  { id: '1', title: 'Thread 1', budget: 100, budgetUsed: 20 },
  { id: '2', title: 'Thread 2', budget: 200, budgetUsed: 150 },
];

describe('ThreadList', () => {
  it('renders thread list', () => {
    render(<ThreadList threads={mockThreads} />);
    
    expect(screen.getByText('Thread 1')).toBeInTheDocument();
    expect(screen.getByText('Thread 2')).toBeInTheDocument();
  });
  
  it('shows budget info', () => {
    render(<ThreadList threads={mockThreads} />);
    
    expect(screen.getByText(/20 \/ 100/i)).toBeInTheDocument();
    expect(screen.getByText(/150 \/ 200/i)).toBeInTheDocument();
  });
  
  it('filters threads', () => {
    render(<ThreadList threads={mockThreads} />);
    
    const search = screen.getByPlaceholderText(/search/i);
    fireEvent.change(search, { target: { value: 'Thread 1' } });
    
    expect(screen.getByText('Thread 1')).toBeInTheDocument();
    expect(screen.queryByText('Thread 2')).not.toBeInTheDocument();
  });
});
