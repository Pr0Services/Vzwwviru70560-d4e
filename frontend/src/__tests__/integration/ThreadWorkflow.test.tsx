/**
 * CHE·NU™ - Thread Workflow Integration Tests
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { ThreadWorkflow } from '../components/ThreadWorkflow';

describe('Thread Workflow', () => {
  it('creates, edits, and saves thread', async () => {
    render(<ThreadWorkflow />);
    
    // Create
    fireEvent.click(screen.getByText('New Thread'));
    
    // Edit
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Thread content' } });
    
    // Save
    fireEvent.click(screen.getByText('Save'));
    
    // Verify saved
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });
});
