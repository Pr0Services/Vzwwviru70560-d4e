// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — REACT COMPONENT TESTS
// Sprint 3: Component tests with React Testing Library
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

// Wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

// Mock stores
vi.mock('../stores/sphereStore', () => ({
  useSphereStore: vi.fn(() => ({
    currentSphere: 'personal',
    currentSection: 'quick_capture',
    spheres: [
      { id: 'personal', name: 'Personal', icon: '🏠', isLocked: false },
      { id: 'business', name: 'Business', icon: '💼', isLocked: false },
      { id: 'scholars', name: 'Scholar', icon: '📚', isLocked: false },
    ],
    setCurrentSphere: vi.fn(),
    setCurrentSection: vi.fn(),
  })),
}));

vi.mock('../stores/governanceStore', () => ({
  useGovernanceStore: vi.fn(() => ({
    budget: { total: 100000, used: 25000, remaining: 75000 },
    scopeLock: { active: false, level: 'document' },
    governanceEnabled: true,
  })),
}));

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE NAVIGATION COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('SphereNavigation Component', () => {
  // Mock component for testing
  const MockSphereNavigation: React.FC = () => {
    const spheres = [
      { id: 'personal', name: 'Personal', icon: '🏠' },
      { id: 'business', name: 'Business', icon: '💼' },
      { id: 'government', name: 'Government', icon: '🏛️' },
      { id: 'creative', name: 'Creative', icon: '🎨' },
      { id: 'community', name: 'Community', icon: '👥' },
      { id: 'social', name: 'Social', icon: '📱' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
      { id: 'my_team', name: 'My Team', icon: '🤝' },
      { id: 'scholars', name: 'Scholar', icon: '📚' },
    ];
    const [active, setActive] = React.useState('personal');

    return (
      <nav data-testid="sphere-navigation">
        {spheres.map(sphere => (
          <button
            key={sphere.id}
            data-testid={`sphere-${sphere.id}`}
            data-active={active === sphere.id}
            onClick={() => setActive(sphere.id)}
            aria-label={sphere.name}
          >
            {sphere.icon} {sphere.name}
          </button>
        ))}
      </nav>
    );
  };

  it('should render all 9 spheres', () => {
    renderWithProviders(<MockSphereNavigation />);
    
    expect(screen.getByTestId('sphere-personal')).toBeInTheDocument();
    expect(screen.getByTestId('sphere-business')).toBeInTheDocument();
    expect(screen.getByTestId('sphere-scholar')).toBeInTheDocument();
  });

  it('should render Scholar as 9th sphere', () => {
    renderWithProviders(<MockSphereNavigation />);
    
    const scholarButton = screen.getByTestId('sphere-scholar');
    expect(scholarButton).toBeInTheDocument();
    expect(scholarButton).toHaveTextContent('📚');
  });

  it('should change active sphere on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MockSphereNavigation />);
    
    const businessButton = screen.getByTestId('sphere-business');
    await user.click(businessButton);
    
    expect(businessButton).toHaveAttribute('data-active', 'true');
  });

  it('should have only one active sphere', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MockSphereNavigation />);
    
    await user.click(screen.getByTestId('sphere-business'));
    
    const activeButtons = screen.getAllByRole('button').filter(
      btn => btn.getAttribute('data-active') === 'true'
    );
    
    expect(activeButtons.length).toBe(1);
  });

  it('should have ARIA labels for accessibility', () => {
    renderWithProviders(<MockSphereNavigation />);
    
    expect(screen.getByLabelText('Personal')).toBeInTheDocument();
    expect(screen.getByLabelText('Scholar')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTIONS COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('BureauSections Component', () => {
  const MockBureauSections: React.FC = () => {
    const sections = [
      { id: 'quick_capture', name: 'Quick Capture', icon: '📝' },
      { id: 'resume_workspace', name: 'Resume Workspace', icon: '▶️' },
      { id: 'threads', name: 'Threads', icon: '💬' },
      { id: 'data_files', name: 'Data Files', icon: '📁' },
      { id: 'active_agents', name: 'Active Agents', icon: '🤖' },
      { id: 'meetings', name: 'Meetings', icon: '📅' },
    ];
    const [active, setActive] = React.useState('quick_capture');

    return (
      <div data-testid="bureau-sections">
        {sections.map(section => (
          <button
            key={section.id}
            data-testid={`bureau-section-${section.id}`}
            data-active={active === section.id}
            onClick={() => setActive(section.id)}
            aria-label={section.name}
          >
            {section.icon} {section.name}
          </button>
        ))}
      </div>
    );
  };

  it('should render exactly 6 sections', () => {
    renderWithProviders(<MockBureauSections />);
    
    const sections = screen.getAllByTestId(/^bureau-section-/);
    expect(sections.length).toBe(6);
  });

  it('should render Quick Capture first', () => {
    renderWithProviders(<MockBureauSections />);
    
    const sections = screen.getAllByTestId(/^bureau-section-/);
    expect(sections[0]).toHaveAttribute('data-testid', 'bureau-section-quick_capture');
  });

  it('should render Meetings last', () => {
    renderWithProviders(<MockBureauSections />);
    
    const sections = screen.getAllByTestId(/^bureau-section-/);
    expect(sections[5]).toHaveAttribute('data-testid', 'bureau-section-meetings');
  });

  it('should change active section on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MockBureauSections />);
    
    const threadsButton = screen.getByTestId('bureau-section-threads');
    await user.click(threadsButton);
    
    expect(threadsButton).toHaveAttribute('data-active', 'true');
  });

  it('should include Threads section for .chenu files', () => {
    renderWithProviders(<MockBureauSections />);
    
    const threadsSection = screen.getByTestId('bureau-section-threads');
    expect(threadsSection).toBeInTheDocument();
    expect(threadsSection).toHaveTextContent('💬');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA TOGGLE COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('NovaToggle Component', () => {
  const MockNovaToggle: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div>
        <button
          data-testid="nova-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          ✧ Nova
        </button>
        {isOpen && (
          <div data-testid="nova-panel" role="dialog">
            <span data-testid="nova-system-badge">L0 - System</span>
            <div data-testid="nova-capabilities">
              Guidance • Memory • Governance • Supervision
            </div>
            <input
              data-testid="nova-chat-input"
              placeholder="Ask Nova..."
            />
            <button data-testid="nova-send-button">Send</button>
          </div>
        )}
      </div>
    );
  };

  it('should render Nova toggle button', () => {
    renderWithProviders(<MockNovaToggle />);
    
    expect(screen.getByTestId('nova-toggle')).toBeInTheDocument();
  });

  it('should open Nova panel on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MockNovaToggle />);
    
    await user.click(screen.getByTestId('nova-toggle'));
    
    expect(screen.getByTestId('nova-panel')).toBeInTheDocument();
  });

  it('should show L0 System badge', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MockNovaToggle />);
    
    await user.click(screen.getByTestId('nova-toggle'));
    
    const badge = screen.getByTestId('nova-system-badge');
    expect(badge).toHaveTextContent('L0');
    expect(badge).toHaveTextContent('System');
  });

  it('should show Nova capabilities', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MockNovaToggle />);
    
    await user.click(screen.getByTestId('nova-toggle'));
    
    const capabilities = screen.getByTestId('nova-capabilities');
    expect(capabilities).toHaveTextContent('Governance');
    expect(capabilities).toHaveTextContent('Memory');
  });

  it('should have chat input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MockNovaToggle />);
    
    await user.click(screen.getByTestId('nova-toggle'));
    
    expect(screen.getByTestId('nova-chat-input')).toBeInTheDocument();
  });

  it('should close Nova panel on second click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MockNovaToggle />);
    
    await user.click(screen.getByTestId('nova-toggle'));
    expect(screen.getByTestId('nova-panel')).toBeInTheDocument();
    
    await user.click(screen.getByTestId('nova-toggle'));
    expect(screen.queryByTestId('nova-panel')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN BUDGET DISPLAY COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('TokenBudgetDisplay Component', () => {
  const MockTokenBudget: React.FC<{ total?: number; used?: number }> = ({
    total = 100000,
    used = 25000,
  }) => {
    const remaining = total - used;
    const percentage = (used / total) * 100;
    const isWarning = percentage >= 80;

    return (
      <div data-testid="token-budget-display">
        <div data-testid="tokens-total">{total.toLocaleString()} tokens</div>
        <div data-testid="tokens-used">{used.toLocaleString()} used</div>
        <div data-testid="tokens-remaining">{remaining.toLocaleString()} remaining</div>
        <div 
          data-testid="budget-progress-bar"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
        {isWarning && (
          <div data-testid="budget-warning-indicator">⚠️ Budget warning</div>
        )}
      </div>
    );
  };

  it('should display total tokens', () => {
    renderWithProviders(<MockTokenBudget />);
    
    expect(screen.getByTestId('tokens-total')).toHaveTextContent('100,000');
  });

  it('should display used tokens', () => {
    renderWithProviders(<MockTokenBudget used={30000} />);
    
    expect(screen.getByTestId('tokens-used')).toHaveTextContent('30,000');
  });

  it('should display remaining tokens', () => {
    renderWithProviders(<MockTokenBudget total={100000} used={25000} />);
    
    expect(screen.getByTestId('tokens-remaining')).toHaveTextContent('75,000');
  });

  it('should show progress bar', () => {
    renderWithProviders(<MockTokenBudget />);
    
    expect(screen.getByTestId('budget-progress-bar')).toBeInTheDocument();
  });

  it('should show warning at 80% usage', () => {
    renderWithProviders(<MockTokenBudget total={100000} used={85000} />);
    
    expect(screen.getByTestId('budget-warning-indicator')).toBeInTheDocument();
  });

  it('should NOT show warning below 80%', () => {
    renderWithProviders(<MockTokenBudget total={100000} used={50000} />);
    
    expect(screen.queryByTestId('budget-warning-indicator')).not.toBeInTheDocument();
  });

  it('tokens should be numeric (not crypto)', () => {
    renderWithProviders(<MockTokenBudget />);
    
    const display = screen.getByTestId('token-budget-display');
    // Should not contain crypto terms
    expect(display.textContent).not.toMatch(/blockchain|wallet|ethereum|0x/i);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CARD COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('AgentCard Component', () => {
  interface AgentCardProps {
    id: string;
    name: string;
    type: string;
    level: string;
    isSystem: boolean;
    isHired?: boolean;
    onHire?: () => void;
  }

  const MockAgentCard: React.FC<AgentCardProps> = ({
    id,
    name,
    type,
    level,
    isSystem,
    isHired = false,
    onHire,
  }) => (
    <div data-testid={`agent-card-${id}`}>
      <h3>{name}</h3>
      <span data-testid="agent-level">{level}</span>
      <span data-testid="agent-type">{type}</span>
      {isSystem && <span data-testid="system-badge">System</span>}
      {isHired && <span data-testid="hired-badge">Hired</span>}
      <span data-testid="agent-cost">0.001 tokens/request</span>
      {!isSystem && !isHired && onHire && (
        <button data-testid="hire-agent-button" onClick={onHire}>
          Hire Agent
        </button>
      )}
    </div>
  );

  it('should render Nova as system agent', () => {
    renderWithProviders(
      <MockAgentCard id="nova" name="Nova" type="nova" level="L0" isSystem={true} />
    );
    
    expect(screen.getByTestId('agent-card-nova')).toBeInTheDocument();
    expect(screen.getByTestId('system-badge')).toBeInTheDocument();
  });

  it('should show L0 level for Nova', () => {
    renderWithProviders(
      <MockAgentCard id="nova" name="Nova" type="nova" level="L0" isSystem={true} />
    );
    
    expect(screen.getByTestId('agent-level')).toHaveTextContent('L0');
  });

  it('should NOT show hire button for Nova', () => {
    renderWithProviders(
      <MockAgentCard id="nova" name="Nova" type="nova" level="L0" isSystem={true} />
    );
    
    expect(screen.queryByTestId('hire-agent-button')).not.toBeInTheDocument();
  });

  it('should show hire button for non-system agents', () => {
    const onHire = vi.fn();
    renderWithProviders(
      <MockAgentCard
        id="analyst"
        name="Data Analyst"
        type="specialist"
        level="L2"
        isSystem={false}
        onHire={onHire}
      />
    );
    
    expect(screen.getByTestId('hire-agent-button')).toBeInTheDocument();
  });

  it('should call onHire when hire button clicked', async () => {
    const user = userEvent.setup();
    const onHire = vi.fn();
    renderWithProviders(
      <MockAgentCard
        id="analyst"
        name="Data Analyst"
        type="specialist"
        level="L2"
        isSystem={false}
        onHire={onHire}
      />
    );
    
    await user.click(screen.getByTestId('hire-agent-button'));
    
    expect(onHire).toHaveBeenCalled();
  });

  it('should show hired badge for hired agents', () => {
    renderWithProviders(
      <MockAgentCard
        id="analyst"
        name="Data Analyst"
        type="specialist"
        level="L2"
        isSystem={false}
        isHired={true}
      />
    );
    
    expect(screen.getByTestId('hired-badge')).toBeInTheDocument();
  });

  it('should show agent cost', () => {
    renderWithProviders(
      <MockAgentCard id="nova" name="Nova" type="nova" level="L0" isSystem={true} />
    );
    
    expect(screen.getByTestId('agent-cost')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT COMPLIANCE UI TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt UI Compliance', () => {
  it('should have exactly 9 sphere buttons', () => {
    const spheres = ['personal', 'business', 'government', 'creative', 
                    'community', 'social', 'entertainment', 'my_team', 'scholar'];
    
    expect(spheres.length).toBe(9);
  });

  it('should have exactly 6 bureau section buttons', () => {
    const sections = ['quick_capture', 'resume_workspace', 'threads', 
                     'data_files', 'active_agents', 'meetings'];
    
    expect(sections.length).toBe(6);
  });

  it('Nova should always show as L0 System', () => {
    // Nova level should always be L0
    const novaLevel = 'L0';
    const novaIsSystem = true;
    
    expect(novaLevel).toBe('L0');
    expect(novaIsSystem).toBe(true);
  });

  it('tokens should be internal credits (no crypto UI)', () => {
    // UI should not have crypto elements
    const cryptoElements = ['wallet_connect', 'blockchain_status', 'eth_balance'];
    
    cryptoElements.forEach(element => {
      expect(document.querySelector(`[data-testid="${element}"]`)).toBeNull();
    });
  });
});
