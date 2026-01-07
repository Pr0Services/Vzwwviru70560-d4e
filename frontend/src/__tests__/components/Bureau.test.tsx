/**
 * CHE·NU™ - Bureau Components Tests
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { BureauConsolidated } from '../components/BureauConsolidated';
import { QuickCapture } from '../components/QuickCapture';
import '@testing-library/jest-dom';

describe('BureauConsolidated', () => {
  it('renders 6 sections', () => {
    render(<BureauConsolidated sphereId="business" />);
    
    expect(screen.getByText(/Quick Capture/i)).toBeInTheDocument();
    expect(screen.getByText(/Resume Workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/Threads/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Files/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Agents/i)).toBeInTheDocument();
    expect(screen.getByText(/Meetings/i)).toBeInTheDocument();
  });
  
  it('switches between sections', () => {
    render(<BureauConsolidated sphereId="business" />);
    
    fireEvent.click(screen.getByText(/Threads/i));
    expect(screen.getByTestId('section-content-threads')).toBeVisible();
    
    fireEvent.click(screen.getByText(/Meetings/i));
    expect(screen.getByTestId('section-content-meetings')).toBeVisible();
  });
  
  it('maintains sphere context', () => {
    const { rerender } = render(<BureauConsolidated sphereId="business" />);
    expect(screen.getByTestId('sphere-context')).toHaveTextContent('business');
    
    rerender(<BureauConsolidated sphereId="scholar" />);
    expect(screen.getByTestId('sphere-context')).toHaveTextContent('scholar');
  });
});

describe('QuickCapture', () => {
  it('enforces 500 char limit', () => {
    render(<QuickCapture />);
    
    const textarea = screen.getByRole('textbox');
    const longText = 'a'.repeat(600);
    
    fireEvent.change(textarea, { target: { value: longText } });
    
    expect(textarea).toHaveValue(longText.substring(0, 500));
  });
  
  it('shows character counter', () => {
    render(<QuickCapture />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    expect(screen.getByText(/5 \/ 500/i)).toBeInTheDocument();
  });
  
  it('submits to thread', async () => {
    const onSubmit = jest.fn();
    render(<QuickCapture onSubmit={onSubmit} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    
    fireEvent.click(screen.getByText(/Submit/i));
    
    expect(onSubmit).toHaveBeenCalledWith('Test content');
  });
});
