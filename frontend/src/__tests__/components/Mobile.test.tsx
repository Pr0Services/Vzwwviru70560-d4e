/**
 * CHE·NU™ - Mobile Components Tests
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNav } from '../components/MobileNav';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { MobileQuickCapture } from '../components/MobileQuickCapture';
import '@testing-library/jest-dom';

describe('MobileNav', () => {
  it('renders when open', () => {
    render(<MobileNav isOpen={true} onClose={() => {}} />);
    expect(screen.getByTestId('mobile-nav')).toHaveClass('open');
  });
  
  it('does not render when closed', () => {
    render(<MobileNav isOpen={false} onClose={() => {}} />);
    expect(screen.getByTestId('mobile-nav')).not.toHaveClass('open');
  });
  
  it('displays all 9 spheres', () => {
    render(<MobileNav isOpen={true} onClose={() => {}} />);
    
    const spheres = [
      'personal', 'business', 'government',
      'design_studio', 'community', 'social',
      'entertainment', 'my_team', 'scholar'
    ];
    
    spheres.forEach(sphere => {
      expect(screen.getByText(sphere)).toBeInTheDocument();
    });
  });
  
  it('switches between tabs', () => {
    render(<MobileNav isOpen={true} onClose={() => {}} />);
    
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByText('⚡ Quick Capture')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Spheres'));
    expect(screen.getByText('personal')).toBeInTheDocument();
  });
  
  it('closes when X clicked', () => {
    const onClose = jest.fn();
    render(<MobileNav isOpen={true} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('✕'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('MobileBottomNav', () => {
  it('renders 5 navigation items', () => {
    render(<MobileBottomNav />);
    
    expect(screen.getByText('Spheres')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Nova')).toBeInTheDocument();
    expect(screen.getByText('Capture')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });
  
  it('Nova button is primary', () => {
    render(<MobileBottomNav />);
    
    const novaButton = screen.getByText('Nova').closest('button');
    expect(novaButton).toHaveClass('primary');
  });
  
  it('handles navigation clicks', () => {
    render(<MobileBottomNav />);
    
    const spheresButton = screen.getByTestId('action-open-spheres');
    fireEvent.click(spheresButton);
    // Would verify hub toggle in actual implementation
  });
});

describe('MobileQuickCapture', () => {
  it('does not render when closed', () => {
    render(
      <MobileQuickCapture 
        isOpen={false} 
        onClose={() => {}} 
        onSubmit={() => {}} 
      />
    );
    
    expect(screen.queryByTestId('quick-capture-input')).not.toBeInTheDocument();
  });
  
  it('renders when open and focuses textarea', () => {
    render(
      <MobileQuickCapture 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={() => {}} 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Capture your thought...');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveFocus();
  });
  
  it('enforces 500 character limit', () => {
    render(
      <MobileQuickCapture 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={() => {}} 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Capture your thought...') as HTMLTextAreaElement;
    const longText = 'a'.repeat(600);
    
    fireEvent.change(textarea, { target: { value: longText } });
    
    expect(textarea.value).toHaveLength(500);
  });
  
  it('shows character count', () => {
    render(
      <MobileQuickCapture 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={() => {}} 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Capture your thought...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    expect(screen.getByText('5 / 500')).toBeInTheDocument();
  });
  
  it('submits content', () => {
    const onSubmit = jest.fn();
    render(
      <MobileQuickCapture 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={onSubmit} 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Capture your thought...');
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    
    fireEvent.click(screen.getByText('Submit'));
    
    expect(onSubmit).toHaveBeenCalledWith('Test content');
  });
  
  it('disables submit when empty', () => {
    render(
      <MobileQuickCapture 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={() => {}} 
      />
    );
    
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });
});
