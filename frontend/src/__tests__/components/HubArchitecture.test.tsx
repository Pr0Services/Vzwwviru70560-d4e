/**
 * CHE·NU™ - Hub Architecture Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HubProvider, HubContainer, useHubs, NovaAccessButton } from '../../hubs/HubArchitecture';
import '@testing-library/jest-dom';


describe('HubProvider', () => {
  it('initializes with workspace visible', () => {
    const TestComponent = () => {
      const { visibleHubs } = useHubs();
      return <div data-testid="hubs">{visibleHubs.join(',')}</div>;
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    expect(screen.getByTestId('hubs')).toHaveTextContent('workspace');
  });
  
  it('workspace is always visible', () => {
    const TestComponent = () => {
      const { visibleHubs, hideHub } = useHubs();
      return (
        <div>
          <div data-testid="hubs">{visibleHubs.join(',')}</div>
          <button onClick={() => hideHub('workspace')}>Hide Workspace</button>
        </div>
      );
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    fireEvent.click(screen.getByText('Hide Workspace'));
    
    // Workspace should still be visible
    expect(screen.getByTestId('hubs')).toHaveTextContent('workspace');
  });
  
  it('enforces max 2 hubs visible rule', () => {
    const TestComponent = () => {
      const { visibleHubs, showHub, getVisibleHubCount } = useHubs();
      return (
        <div>
          <div data-testid="count">{getVisibleHubCount()}</div>
          <div data-testid="hubs">{visibleHubs.join(',')}</div>
          <button onClick={() => showHub('communication')}>Show Comm</button>
          <button onClick={() => showHub('navigation')}>Show Nav</button>
        </div>
      );
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    // Show communication
    fireEvent.click(screen.getByText('Show Comm'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    
    // Try to show navigation (should replace communication)
    fireEvent.click(screen.getByText('Show Nav'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('hubs')).toHaveTextContent('navigation');
  });
  
  it('Nova is always accessible', () => {
    const TestComponent = () => {
      const { isNovaOpen, openNova, closeNova } = useHubs();
      return (
        <div>
          <div data-testid="nova-open">{isNovaOpen ? 'open' : 'closed'}</div>
          <button onClick={openNova}>Open Nova</button>
          <button onClick={closeNova}>Close Nova</button>
        </div>
      );
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    expect(screen.getByTestId('nova-open')).toHaveTextContent('closed');
    
    fireEvent.click(screen.getByText('Open Nova'));
    expect(screen.getByTestId('nova-open')).toHaveTextContent('open');
    
    fireEvent.click(screen.getByText('Close Nova'));
    expect(screen.getByTestId('nova-open')).toHaveTextContent('closed');
  });
});


describe('HubContainer', () => {
  it('renders hub when visible', () => {
    render(
      <HubProvider>
        <HubContainer hubId="workspace">
          <div data-testid="content">Workspace Content</div>
        </HubContainer>
      </HubProvider>
    );
    
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
  
  it('does not render hub when not visible', () => {
    render(
      <HubProvider>
        <HubContainer hubId="communication">
          <div data-testid="content">Communication Content</div>
        </HubContainer>
      </HubProvider>
    );
    
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });
  
  it('applies primary class to primary hub', () => {
    const TestComponent = () => {
      const { setPrimaryHub } = useHubs();
      return (
        <>
          <button onClick={() => setPrimaryHub('workspace')}>Set Primary</button>
          <HubContainer hubId="workspace">
            <div>Content</div>
          </HubContainer>
        </>
      );
    };
    
    const { container } = render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    fireEvent.click(screen.getByText('Set Primary'));
    
    const hubContainer = container.querySelector('.hub-primary');
    expect(hubContainer).toBeInTheDocument();
  });
});


describe('NovaAccessButton', () => {
  it('renders Nova button', () => {
    render(
      <HubProvider>
        <NovaAccessButton />
      </HubProvider>
    );
    
    expect(screen.getByText(/Nova/i)).toBeInTheDocument();
  });
  
  it('opens Nova when clicked', async () => {
    const TestComponent = () => {
      const { isNovaOpen } = useHubs();
      return (
        <div>
          <div data-testid="nova-status">{isNovaOpen ? 'open' : 'closed'}</div>
          <NovaAccessButton />
        </div>
      );
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    const button = screen.getByText(/Nova/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId('nova-status')).toHaveTextContent('open');
    });
  });
  
  it('hides when Nova is open and not minimized', () => {
    const TestComponent = () => {
      const { openNova } = useHubs();
      return (
        <>
          <button onClick={openNova}>Open</button>
          <NovaAccessButton />
        </>
      );
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    fireEvent.click(screen.getByText('Open'));
    
    // Button should be hidden
    expect(screen.queryByText(/Nova/i)).not.toBeInTheDocument();
  });
});


describe('Hub Workspace Modes', () => {
  it('supports different workspace modes', () => {
    const TestComponent = () => {
      const { workspaceMode, setWorkspaceMode } = useHubs();
      return (
        <div>
          <div data-testid="mode">{workspaceMode}</div>
          <button onClick={() => setWorkspaceMode('draft')}>Draft</button>
          <button onClick={() => setWorkspaceMode('staging')}>Staging</button>
          <button onClick={() => setWorkspaceMode('review')}>Review</button>
        </div>
      );
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    expect(screen.getByTestId('mode')).toHaveTextContent('draft');
    
    fireEvent.click(screen.getByText('Staging'));
    expect(screen.getByTestId('mode')).toHaveTextContent('staging');
    
    fireEvent.click(screen.getByText('Review'));
    expect(screen.getByTestId('mode')).toHaveTextContent('review');
  });
  
  it('supports workspace locking', () => {
    const TestComponent = () => {
      const { workspaceLocked, lockWorkspace, unlockWorkspace } = useHubs();
      return (
        <div>
          <div data-testid="locked">{workspaceLocked ? 'locked' : 'unlocked'}</div>
          <button onClick={lockWorkspace}>Lock</button>
          <button onClick={unlockWorkspace}>Unlock</button>
        </div>
      );
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    expect(screen.getByTestId('locked')).toHaveTextContent('unlocked');
    
    fireEvent.click(screen.getByText('Lock'));
    expect(screen.getByTestId('locked')).toHaveTextContent('locked');
    
    fireEvent.click(screen.getByText('Unlock'));
    expect(screen.getByTestId('locked')).toHaveTextContent('unlocked');
  });
});


describe('Hub Toggle', () => {
  it('toggles hub visibility', () => {
    const TestComponent = () => {
      const { visibleHubs, toggleHub } = useHubs();
      return (
        <div>
          <div data-testid="hubs">{visibleHubs.join(',')}</div>
          <button onClick={() => toggleHub('communication')}>Toggle</button>
        </div>
      );
    };
    
    render(
      <HubProvider>
        <TestComponent />
      </HubProvider>
    );
    
    expect(screen.getByTestId('hubs')).toHaveTextContent('workspace');
    
    // Show hub
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('hubs')).toHaveTextContent('communication');
    
    // Hide hub
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('hubs')).not.toHaveTextContent('communication');
  });
});
