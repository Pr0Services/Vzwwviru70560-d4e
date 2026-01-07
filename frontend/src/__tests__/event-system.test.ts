// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — EVENT SYSTEM TESTS
// Sprint 9: Tests for event-driven architecture
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type EventType =
  | 'sphere:selected'
  | 'sphere:deselected'
  | 'bureau:opened'
  | 'bureau:closed'
  | 'thread:created'
  | 'thread:updated'
  | 'thread:archived'
  | 'thread:deleted'
  | 'message:sent'
  | 'message:received'
  | 'agent:activated'
  | 'agent:completed'
  | 'agent:error'
  | 'meeting:scheduled'
  | 'meeting:started'
  | 'meeting:ended'
  | 'governance:check'
  | 'governance:approved'
  | 'governance:rejected'
  | 'tokens:used'
  | 'tokens:refunded'
  | 'nova:guidance'
  | 'nova:response';

interface Event<T = any> {
  type: EventType;
  payload: T;
  timestamp: Date;
  source: string;
}

type EventHandler<T = any> = (event: Event<T>) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT BUS IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private history: Event[] = [];
  private maxHistory: number = 1000;

  on(type: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  off(type: EventType, handler: EventHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  emit<T>(type: EventType, payload: T, source: string = 'system'): void {
    const event: Event<T> = {
      type,
      payload,
      timestamp: new Date(),
      source,
    };

    // Store in history
    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Call handlers
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }
  }

  getHistory(): Event[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  getHandlerCount(type: EventType): number {
    return this.handlers.get(type)?.size || 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT BUS BASIC TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('EventBus Basic Operations', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should subscribe to events', () => {
    const handler = vi.fn();
    bus.on('sphere:selected', handler);

    expect(bus.getHandlerCount('sphere:selected')).toBe(1);
  });

  it('should emit events to handlers', () => {
    const handler = vi.fn();
    bus.on('sphere:selected', handler);

    bus.emit('sphere:selected', { sphereId: 'personal' });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should pass correct payload to handler', () => {
    const handler = vi.fn();
    bus.on('sphere:selected', handler);

    bus.emit('sphere:selected', { sphereId: 'business' });

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'sphere:selected',
        payload: { sphereId: 'business' },
      })
    );
  });

  it('should unsubscribe from events', () => {
    const handler = vi.fn();
    const unsubscribe = bus.on('sphere:selected', handler);

    unsubscribe();
    bus.emit('sphere:selected', {});

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle multiple handlers', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    bus.on('thread:created', handler1);
    bus.on('thread:created', handler2);

    bus.emit('thread:created', { threadId: '123' });

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT HISTORY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('EventBus History', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should record events in history', () => {
    bus.emit('sphere:selected', { sphereId: 'personal' });
    bus.emit('thread:created', { threadId: '123' });

    const history = bus.getHistory();
    expect(history.length).toBe(2);
  });

  it('should have timestamps on all events', () => {
    bus.emit('sphere:selected', {});

    const history = bus.getHistory();
    expect(history[0].timestamp).toBeInstanceOf(Date);
  });

  it('should have source on all events', () => {
    bus.emit('nova:guidance', {}, 'nova');

    const history = bus.getHistory();
    expect(history[0].source).toBe('nova');
  });

  it('should clear history', () => {
    bus.emit('sphere:selected', {});
    bus.emit('thread:created', {});

    bus.clearHistory();

    expect(bus.getHistory().length).toBe(0);
  });

  it('should limit history size', () => {
    // Emit more than max history
    for (let i = 0; i < 1500; i++) {
      bus.emit('tokens:used', { amount: 1 });
    }

    expect(bus.getHistory().length).toBeLessThanOrEqual(1000);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE EVENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Events', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit sphere:selected event', () => {
    const handler = vi.fn();
    bus.on('sphere:selected', handler);

    bus.emit('sphere:selected', { sphereId: 'personal' });

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { sphereId: 'personal' },
      })
    );
  });

  it('should emit sphere:deselected event', () => {
    const handler = vi.fn();
    bus.on('sphere:deselected', handler);

    bus.emit('sphere:deselected', { sphereId: 'business' });

    expect(handler).toHaveBeenCalled();
  });

  it('should track sphere navigation in history', () => {
    bus.emit('sphere:selected', { sphereId: 'personal' });
    bus.emit('sphere:deselected', { sphereId: 'personal' });
    bus.emit('sphere:selected', { sphereId: 'scholars' });

    const history = bus.getHistory();
    const sphereEvents = history.filter((e) =>
      e.type.startsWith('sphere:')
    );

    expect(sphereEvents.length).toBe(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD EVENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thread Events', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit thread:created event', () => {
    const handler = vi.fn();
    bus.on('thread:created', handler);

    bus.emit('thread:created', {
      threadId: 'thread_123',
      title: 'New Thread',
      sphereId: 'personal',
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit thread:updated event', () => {
    const handler = vi.fn();
    bus.on('thread:updated', handler);

    bus.emit('thread:updated', {
      threadId: 'thread_123',
      changes: { title: 'Updated Title' },
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit thread:archived event', () => {
    const handler = vi.fn();
    bus.on('thread:archived', handler);

    bus.emit('thread:archived', { threadId: 'thread_123' });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit thread:deleted event', () => {
    const handler = vi.fn();
    bus.on('thread:deleted', handler);

    bus.emit('thread:deleted', { threadId: 'thread_123' });

    expect(handler).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE EVENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Message Events', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit message:sent event', () => {
    const handler = vi.fn();
    bus.on('message:sent', handler);

    bus.emit('message:sent', {
      messageId: 'msg_123',
      threadId: 'thread_123',
      role: 'user',
      tokens: 50,
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit message:received event', () => {
    const handler = vi.fn();
    bus.on('message:received', handler);

    bus.emit('message:received', {
      messageId: 'msg_456',
      threadId: 'thread_123',
      role: 'assistant',
      tokens: 150,
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should track message tokens', () => {
    let totalTokens = 0;

    bus.on('message:sent', (e) => {
      totalTokens += e.payload.tokens;
    });
    bus.on('message:received', (e) => {
      totalTokens += e.payload.tokens;
    });

    bus.emit('message:sent', { tokens: 50 });
    bus.emit('message:received', { tokens: 150 });

    expect(totalTokens).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT EVENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Events', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit agent:activated event', () => {
    const handler = vi.fn();
    bus.on('agent:activated', handler);

    bus.emit('agent:activated', { agentId: 'nova', taskId: 'task_123' });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit agent:completed event', () => {
    const handler = vi.fn();
    bus.on('agent:completed', handler);

    bus.emit('agent:completed', {
      agentId: 'nova',
      taskId: 'task_123',
      result: 'success',
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit agent:error event', () => {
    const handler = vi.fn();
    bus.on('agent:error', handler);

    bus.emit('agent:error', {
      agentId: 'agent_1',
      error: 'Task failed',
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should track Nova events', () => {
    const novaEvents: Event[] = [];

    bus.on('agent:activated', (e) => {
      if (e.payload.agentId === 'nova') {
        novaEvents.push(e);
      }
    });

    bus.emit('agent:activated', { agentId: 'nova' });
    bus.emit('agent:activated', { agentId: 'other' });

    expect(novaEvents.length).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING EVENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Meeting Events', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit meeting:scheduled event', () => {
    const handler = vi.fn();
    bus.on('meeting:scheduled', handler);

    bus.emit('meeting:scheduled', {
      meetingId: 'meeting_123',
      title: 'Team Standup',
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit meeting:started event', () => {
    const handler = vi.fn();
    bus.on('meeting:started', handler);

    bus.emit('meeting:started', { meetingId: 'meeting_123' });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit meeting:ended event', () => {
    const handler = vi.fn();
    bus.on('meeting:ended', handler);

    bus.emit('meeting:ended', {
      meetingId: 'meeting_123',
      duration: 3600,
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should track complete meeting lifecycle', () => {
    const meetingEvents: string[] = [];

    bus.on('meeting:scheduled', () => meetingEvents.push('scheduled'));
    bus.on('meeting:started', () => meetingEvents.push('started'));
    bus.on('meeting:ended', () => meetingEvents.push('ended'));

    bus.emit('meeting:scheduled', {});
    bus.emit('meeting:started', {});
    bus.emit('meeting:ended', {});

    expect(meetingEvents).toEqual(['scheduled', 'started', 'ended']);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE EVENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance Events', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit governance:check event', () => {
    const handler = vi.fn();
    bus.on('governance:check', handler);

    bus.emit('governance:check', {
      operation: 'execute_task',
      resourceId: 'task_123',
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit governance:approved event', () => {
    const handler = vi.fn();
    bus.on('governance:approved', handler);

    bus.emit('governance:approved', {
      operation: 'execute_task',
      approvedBy: 'nova',
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit governance:rejected event', () => {
    const handler = vi.fn();
    bus.on('governance:rejected', handler);

    bus.emit('governance:rejected', {
      operation: 'execute_task',
      reason: 'Insufficient budget',
    });

    expect(handler).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN EVENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Token Events', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit tokens:used event', () => {
    const handler = vi.fn();
    bus.on('tokens:used', handler);

    bus.emit('tokens:used', { amount: 500, operation: 'message' });

    expect(handler).toHaveBeenCalled();
  });

  it('should emit tokens:refunded event', () => {
    const handler = vi.fn();
    bus.on('tokens:refunded', handler);

    bus.emit('tokens:refunded', { amount: 100, reason: 'cancelled' });

    expect(handler).toHaveBeenCalled();
  });

  it('should track total token usage', () => {
    let totalUsed = 0;
    let totalRefunded = 0;

    bus.on('tokens:used', (e) => {
      totalUsed += e.payload.amount;
    });
    bus.on('tokens:refunded', (e) => {
      totalRefunded += e.payload.amount;
    });

    bus.emit('tokens:used', { amount: 500 });
    bus.emit('tokens:used', { amount: 300 });
    bus.emit('tokens:refunded', { amount: 100 });

    expect(totalUsed).toBe(800);
    expect(totalRefunded).toBe(100);
    expect(totalUsed - totalRefunded).toBe(700);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA EVENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Nova Events', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit nova:guidance event', () => {
    const handler = vi.fn();
    bus.on('nova:guidance', handler);

    bus.emit('nova:guidance', {
      topic: 'project planning',
      userId: 'user_123',
    }, 'nova');

    expect(handler).toHaveBeenCalled();
  });

  it('should emit nova:response event', () => {
    const handler = vi.fn();
    bus.on('nova:response', handler);

    bus.emit('nova:response', {
      threadId: 'thread_123',
      response: 'Here is my guidance...',
    }, 'nova');

    expect(handler).toHaveBeenCalled();
  });

  it('Nova events should have nova as source', () => {
    bus.emit('nova:guidance', {}, 'nova');

    const history = bus.getHistory();
    expect(history[0].source).toBe('nova');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT EVENT COMPLIANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt Event Compliance', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should track all operations for audit (L5)', () => {
    // All operations emit events
    bus.emit('sphere:selected', { sphereId: 'personal' });
    bus.emit('thread:created', { threadId: '123' });
    bus.emit('message:sent', { messageId: '456' });
    bus.emit('tokens:used', { amount: 100 });

    const history = bus.getHistory();
    expect(history.length).toBe(4);

    // All events have timestamps
    history.forEach((e) => {
      expect(e.timestamp).toBeInstanceOf(Date);
    });
  });

  it('should support governance before execution (L7)', () => {
    const executionLog: string[] = [];

    // Governance must approve before execution
    bus.on('governance:approved', () => {
      executionLog.push('approved');
    });
    bus.on('agent:activated', () => {
      executionLog.push('executed');
    });

    // Correct order: approval then execution
    bus.emit('governance:approved', {});
    bus.emit('agent:activated', {});

    expect(executionLog).toEqual(['approved', 'executed']);
  });

  it('should track token usage (L8)', () => {
    let budget = 10000;

    bus.on('tokens:used', (e) => {
      budget -= e.payload.amount;
    });
    bus.on('tokens:refunded', (e) => {
      budget += e.payload.amount;
    });

    bus.emit('tokens:used', { amount: 500 });
    bus.emit('tokens:used', { amount: 300 });

    expect(budget).toBe(9200);
  });
});
