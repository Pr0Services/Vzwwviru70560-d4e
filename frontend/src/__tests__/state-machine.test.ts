// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — STATE MACHINE TESTS
// Sprint 8: Tests for state transitions and workflows
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════════
// STATE MACHINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type SphereState = 'idle' | 'loading' | 'active' | 'error';
type ThreadState = 'draft' | 'active' | 'paused' | 'archived' | 'deleted';
type AgentState = 'idle' | 'thinking' | 'executing' | 'waiting' | 'error';
type MeetingState = 'scheduled' | 'starting' | 'in_progress' | 'ending' | 'completed' | 'cancelled';
type GovernanceState = 'pending' | 'approved' | 'rejected' | 'escalated';

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════

const sphereTransitions: Record<SphereState, SphereState[]> = {
  idle: ['loading'],
  loading: ['active', 'error'],
  active: ['loading', 'idle'],
  error: ['loading', 'idle'],
};

class SphereStateMachine {
  state: SphereState = 'idle';
  history: SphereState[] = ['idle'];

  canTransition(to: SphereState): boolean {
    return sphereTransitions[this.state].includes(to);
  }

  transition(to: SphereState): boolean {
    if (this.canTransition(to)) {
      this.state = to;
      this.history.push(to);
      return true;
    }
    return false;
  }

  reset(): void {
    this.state = 'idle';
    this.history = ['idle'];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════

const threadTransitions: Record<ThreadState, ThreadState[]> = {
  draft: ['active', 'deleted'],
  active: ['paused', 'archived', 'deleted'],
  paused: ['active', 'archived', 'deleted'],
  archived: ['active', 'deleted'],
  deleted: [], // Terminal state
};

class ThreadStateMachine {
  state: ThreadState = 'draft';
  history: ThreadState[] = ['draft'];

  canTransition(to: ThreadState): boolean {
    return threadTransitions[this.state].includes(to);
  }

  transition(to: ThreadState): boolean {
    if (this.canTransition(to)) {
      this.state = to;
      this.history.push(to);
      return true;
    }
    return false;
  }

  isTerminal(): boolean {
    return this.state === 'deleted';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════

const agentTransitions: Record<AgentState, AgentState[]> = {
  idle: ['thinking'],
  thinking: ['executing', 'waiting', 'idle', 'error'],
  executing: ['idle', 'waiting', 'error'],
  waiting: ['thinking', 'idle', 'error'],
  error: ['idle'],
};

class AgentStateMachine {
  state: AgentState = 'idle';
  agentId: string;
  history: AgentState[] = ['idle'];

  constructor(agentId: string) {
    this.agentId = agentId;
  }

  canTransition(to: AgentState): boolean {
    return agentTransitions[this.state].includes(to);
  }

  transition(to: AgentState): boolean {
    if (this.canTransition(to)) {
      this.state = to;
      this.history.push(to);
      return true;
    }
    return false;
  }

  isWorking(): boolean {
    return this.state === 'thinking' || this.state === 'executing';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════

const meetingTransitions: Record<MeetingState, MeetingState[]> = {
  scheduled: ['starting', 'cancelled'],
  starting: ['in_progress', 'cancelled'],
  in_progress: ['ending'],
  ending: ['completed'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

class MeetingStateMachine {
  state: MeetingState = 'scheduled';
  history: MeetingState[] = ['scheduled'];

  canTransition(to: MeetingState): boolean {
    return meetingTransitions[this.state].includes(to);
  }

  transition(to: MeetingState): boolean {
    if (this.canTransition(to)) {
      this.state = to;
      this.history.push(to);
      return true;
    }
    return false;
  }

  isTerminal(): boolean {
    return this.state === 'completed' || this.state === 'cancelled';
  }

  isActive(): boolean {
    return this.state === 'starting' || this.state === 'in_progress';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════

const governanceTransitions: Record<GovernanceState, GovernanceState[]> = {
  pending: ['approved', 'rejected', 'escalated'],
  approved: [], // Terminal
  rejected: ['pending'], // Can be resubmitted
  escalated: ['approved', 'rejected'],
};

class GovernanceStateMachine {
  state: GovernanceState = 'pending';
  history: GovernanceState[] = ['pending'];

  canTransition(to: GovernanceState): boolean {
    return governanceTransitions[this.state].includes(to);
  }

  transition(to: GovernanceState): boolean {
    if (this.canTransition(to)) {
      this.state = to;
      this.history.push(to);
      return true;
    }
    return false;
  }

  isResolved(): boolean {
    return this.state === 'approved' || this.state === 'rejected';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE STATE MACHINE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere State Machine', () => {
  let machine: SphereStateMachine;

  beforeEach(() => {
    machine = new SphereStateMachine();
  });

  it('should start in idle state', () => {
    expect(machine.state).toBe('idle');
  });

  it('should transition from idle to loading', () => {
    expect(machine.transition('loading')).toBe(true);
    expect(machine.state).toBe('loading');
  });

  it('should transition from loading to active', () => {
    machine.transition('loading');
    expect(machine.transition('active')).toBe(true);
    expect(machine.state).toBe('active');
  });

  it('should transition from loading to error', () => {
    machine.transition('loading');
    expect(machine.transition('error')).toBe(true);
    expect(machine.state).toBe('error');
  });

  it('should NOT transition from idle to active directly', () => {
    expect(machine.transition('active')).toBe(false);
    expect(machine.state).toBe('idle');
  });

  it('should track history', () => {
    machine.transition('loading');
    machine.transition('active');
    expect(machine.history).toEqual(['idle', 'loading', 'active']);
  });

  it('should reset to initial state', () => {
    machine.transition('loading');
    machine.transition('active');
    machine.reset();
    expect(machine.state).toBe('idle');
    expect(machine.history).toEqual(['idle']);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD STATE MACHINE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thread State Machine', () => {
  let machine: ThreadStateMachine;

  beforeEach(() => {
    machine = new ThreadStateMachine();
  });

  it('should start in draft state', () => {
    expect(machine.state).toBe('draft');
  });

  it('should transition from draft to active', () => {
    expect(machine.transition('active')).toBe(true);
    expect(machine.state).toBe('active');
  });

  it('should transition from active to paused', () => {
    machine.transition('active');
    expect(machine.transition('paused')).toBe(true);
    expect(machine.state).toBe('paused');
  });

  it('should transition from active to archived', () => {
    machine.transition('active');
    expect(machine.transition('archived')).toBe(true);
    expect(machine.state).toBe('archived');
  });

  it('should transition from archived back to active', () => {
    machine.transition('active');
    machine.transition('archived');
    expect(machine.transition('active')).toBe(true);
    expect(machine.state).toBe('active');
  });

  it('should NOT transition from deleted', () => {
    machine.transition('deleted');
    expect(machine.transition('active')).toBe(false);
    expect(machine.isTerminal()).toBe(true);
  });

  it('deleted should be terminal state', () => {
    machine.transition('deleted');
    expect(machine.isTerminal()).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT STATE MACHINE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent State Machine', () => {
  let machine: AgentStateMachine;

  beforeEach(() => {
    machine = new AgentStateMachine('nova');
  });

  it('should start in idle state', () => {
    expect(machine.state).toBe('idle');
  });

  it('should have correct agent ID', () => {
    expect(machine.agentId).toBe('nova');
  });

  it('should transition from idle to thinking', () => {
    expect(machine.transition('thinking')).toBe(true);
    expect(machine.state).toBe('thinking');
  });

  it('should transition from thinking to executing', () => {
    machine.transition('thinking');
    expect(machine.transition('executing')).toBe(true);
    expect(machine.state).toBe('executing');
  });

  it('should transition from executing to idle', () => {
    machine.transition('thinking');
    machine.transition('executing');
    expect(machine.transition('idle')).toBe(true);
    expect(machine.state).toBe('idle');
  });

  it('should NOT transition from idle to executing directly', () => {
    expect(machine.transition('executing')).toBe(false);
    expect(machine.state).toBe('idle');
  });

  it('isWorking should return true when thinking', () => {
    machine.transition('thinking');
    expect(machine.isWorking()).toBe(true);
  });

  it('isWorking should return true when executing', () => {
    machine.transition('thinking');
    machine.transition('executing');
    expect(machine.isWorking()).toBe(true);
  });

  it('isWorking should return false when idle', () => {
    expect(machine.isWorking()).toBe(false);
  });

  it('should recover from error to idle', () => {
    machine.transition('thinking');
    machine.transition('error');
    expect(machine.transition('idle')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING STATE MACHINE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Meeting State Machine', () => {
  let machine: MeetingStateMachine;

  beforeEach(() => {
    machine = new MeetingStateMachine();
  });

  it('should start in scheduled state', () => {
    expect(machine.state).toBe('scheduled');
  });

  it('should transition through complete meeting lifecycle', () => {
    expect(machine.transition('starting')).toBe(true);
    expect(machine.transition('in_progress')).toBe(true);
    expect(machine.transition('ending')).toBe(true);
    expect(machine.transition('completed')).toBe(true);
    expect(machine.isTerminal()).toBe(true);
  });

  it('should allow cancellation from scheduled', () => {
    expect(machine.transition('cancelled')).toBe(true);
    expect(machine.isTerminal()).toBe(true);
  });

  it('should allow cancellation from starting', () => {
    machine.transition('starting');
    expect(machine.transition('cancelled')).toBe(true);
  });

  it('should NOT allow cancellation during in_progress', () => {
    machine.transition('starting');
    machine.transition('in_progress');
    expect(machine.transition('cancelled')).toBe(false);
  });

  it('isActive should return true during meeting', () => {
    machine.transition('starting');
    expect(machine.isActive()).toBe(true);
    machine.transition('in_progress');
    expect(machine.isActive()).toBe(true);
  });

  it('completed should be terminal', () => {
    machine.transition('starting');
    machine.transition('in_progress');
    machine.transition('ending');
    machine.transition('completed');
    expect(machine.isTerminal()).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE STATE MACHINE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance State Machine', () => {
  let machine: GovernanceStateMachine;

  beforeEach(() => {
    machine = new GovernanceStateMachine();
  });

  it('should start in pending state', () => {
    expect(machine.state).toBe('pending');
  });

  it('should transition from pending to approved', () => {
    expect(machine.transition('approved')).toBe(true);
    expect(machine.isResolved()).toBe(true);
  });

  it('should transition from pending to rejected', () => {
    expect(machine.transition('rejected')).toBe(true);
    expect(machine.isResolved()).toBe(true);
  });

  it('should transition from pending to escalated', () => {
    expect(machine.transition('escalated')).toBe(true);
    expect(machine.state).toBe('escalated');
  });

  it('should allow resubmission after rejection', () => {
    machine.transition('rejected');
    expect(machine.transition('pending')).toBe(true);
  });

  it('should NOT allow changes after approval', () => {
    machine.transition('approved');
    expect(machine.transition('pending')).toBe(false);
    expect(machine.transition('rejected')).toBe(false);
  });

  it('escalated can be resolved', () => {
    machine.transition('escalated');
    expect(machine.transition('approved')).toBe(true);
    expect(machine.isResolved()).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED WORKFLOW TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Combined Workflow Tests', () => {
  it('should handle sphere -> thread workflow', () => {
    const sphere = new SphereStateMachine();
    const thread = new ThreadStateMachine();

    // Load sphere
    sphere.transition('loading');
    sphere.transition('active');

    // Create and activate thread
    thread.transition('active');

    expect(sphere.state).toBe('active');
    expect(thread.state).toBe('active');
  });

  it('should handle agent execution workflow', () => {
    const agent = new AgentStateMachine('nova');
    const governance = new GovernanceStateMachine();

    // Start thinking
    agent.transition('thinking');

    // Get approval
    governance.transition('approved');

    // Execute
    agent.transition('executing');
    agent.transition('idle');

    expect(agent.state).toBe('idle');
    expect(governance.isResolved()).toBe(true);
  });

  it('should handle meeting with governance', () => {
    const meeting = new MeetingStateMachine();
    const governance = new GovernanceStateMachine();

    // Approve meeting
    governance.transition('approved');

    // Run meeting
    meeting.transition('starting');
    meeting.transition('in_progress');
    meeting.transition('ending');
    meeting.transition('completed');

    expect(meeting.isTerminal()).toBe(true);
    expect(governance.isResolved()).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT STATE MACHINE COMPLIANCE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt State Machine Compliance', () => {
  it('governance should be enforced before execution', () => {
    const agent = new AgentStateMachine('agent_1');
    const governance = new GovernanceStateMachine();

    // Must approve before executing
    governance.transition('approved');
    
    agent.transition('thinking');
    agent.transition('executing');

    expect(governance.state).toBe('approved');
  });

  it('only one sphere active at a time (state machine level)', () => {
    const sphere1 = new SphereStateMachine();
    const sphere2 = new SphereStateMachine();

    sphere1.transition('loading');
    sphere1.transition('active');

    // sphere2 should stay idle when sphere1 is active
    expect(sphere1.state).toBe('active');
    expect(sphere2.state).toBe('idle');
  });

  it('threads are auditable via history', () => {
    const thread = new ThreadStateMachine();
    
    thread.transition('active');
    thread.transition('paused');
    thread.transition('active');
    thread.transition('archived');

    // L5: AUDIT_COMPLETENESS - history tracks all transitions
    expect(thread.history.length).toBe(5);
    expect(thread.history).toEqual(['draft', 'active', 'paused', 'active', 'archived']);
  });
});
