// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — THREAD STORE TESTS
// Sprint 1 - Tâche 7: 12 tests pour threadStore
// Threads (.chenu) = First-class objects with history, scope, budget
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useThreadStore } from '../thread.store';

// Helper to create mock thread
const createMockThread = (overrides = {}) => ({
  id: `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Thread',
  type: 'chat' as const,
  sphere_id: 'personal',
  status: 'active' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Helper to create mock message
const createMockMessage = (threadId: string, overrides = {}) => ({
  id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  thread_id: threadId,
  role: 'user' as const,
  content: 'Test message content',
  created_at: new Date().toISOString(),
  ...overrides,
});

// Reset store before each test
beforeEach(() => {
  act(() => {
    useThreadStore.setState({
      threads: [],
      currentThread: null,
      messages: [],
      isLoading: false,
      isStreaming: false,
      streamContent: '',
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Initial State', () => {
  it('should start with empty threads', () => {
    const state = useThreadStore.getState();
    expect(state.threads).toEqual([]);
  });

  it('should start with no current thread', () => {
    const state = useThreadStore.getState();
    expect(state.currentThread).toBeNull();
  });

  it('should start with empty messages', () => {
    const state = useThreadStore.getState();
    expect(state.messages).toEqual([]);
  });

  it('should start not loading', () => {
    const state = useThreadStore.getState();
    expect(state.isLoading).toBe(false);
  });

  it('should start not streaming', () => {
    const state = useThreadStore.getState();
    expect(state.isStreaming).toBe(false);
  });

  it('should start with empty stream content', () => {
    const state = useThreadStore.getState();
    expect(state.streamContent).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD MANAGEMENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thread Management', () => {
  it('should set threads', () => {
    const threads = [
      createMockThread({ title: 'Thread 1' }),
      createMockThread({ title: 'Thread 2' }),
    ];
    
    act(() => {
      useThreadStore.getState().setThreads(threads);
    });
    
    expect(useThreadStore.getState().threads.length).toBe(2);
  });

  it('should add thread to beginning of list', () => {
    const thread1 = createMockThread({ title: 'First Thread' });
    const thread2 = createMockThread({ title: 'Second Thread' });
    
    act(() => {
      useThreadStore.getState().addThread(thread1);
      useThreadStore.getState().addThread(thread2);
    });
    
    const threads = useThreadStore.getState().threads;
    expect(threads[0].title).toBe('Second Thread');
    expect(threads[1].title).toBe('First Thread');
  });

  it('should set current thread', () => {
    const thread = createMockThread();
    
    act(() => {
      useThreadStore.getState().setCurrentThread(thread);
    });
    
    expect(useThreadStore.getState().currentThread).toEqual(thread);
  });

  it('should clear current thread', () => {
    const thread = createMockThread();
    
    act(() => {
      useThreadStore.getState().setCurrentThread(thread);
      useThreadStore.getState().setCurrentThread(null);
    });
    
    expect(useThreadStore.getState().currentThread).toBeNull();
  });

  it('should support different thread types', () => {
    const chatThread = createMockThread({ type: 'chat' });
    const agentThread = createMockThread({ type: 'agent' });
    const taskThread = createMockThread({ type: 'task' });
    
    act(() => {
      useThreadStore.getState().setThreads([chatThread, agentThread, taskThread]);
    });
    
    const threads = useThreadStore.getState().threads;
    expect(threads.map(t => t.type)).toEqual(['chat', 'agent', 'task']);
  });

  it('should archive thread', () => {
    const thread = createMockThread({ status: 'active' });
    
    act(() => {
      useThreadStore.getState().addThread(thread);
      useThreadStore.getState().archiveThread(thread.id);
    });
    
    const archived = useThreadStore.getState().threads.find(t => t.id === thread.id);
    expect(archived?.status).toBe('archived');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE MANAGEMENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Message Management', () => {
  it('should set messages', () => {
    const threadId = 'thread-123';
    const messages = [
      createMockMessage(threadId, { content: 'Message 1' }),
      createMockMessage(threadId, { content: 'Message 2' }),
    ];
    
    act(() => {
      useThreadStore.getState().setMessages(messages);
    });
    
    expect(useThreadStore.getState().messages.length).toBe(2);
  });

  it('should add message', () => {
    const message = createMockMessage('thread-123');
    
    act(() => {
      useThreadStore.getState().addMessage(message);
    });
    
    expect(useThreadStore.getState().messages.length).toBe(1);
    expect(useThreadStore.getState().messages[0]).toEqual(message);
  });

  it('should add messages in order', () => {
    const msg1 = createMockMessage('thread-123', { content: 'First' });
    const msg2 = createMockMessage('thread-123', { content: 'Second' });
    
    act(() => {
      useThreadStore.getState().addMessage(msg1);
      useThreadStore.getState().addMessage(msg2);
    });
    
    const messages = useThreadStore.getState().messages;
    expect(messages[0].content).toBe('First');
    expect(messages[1].content).toBe('Second');
  });

  it('should update message', () => {
    const message = createMockMessage('thread-123', { content: 'Original' });
    
    act(() => {
      useThreadStore.getState().addMessage(message);
      useThreadStore.getState().updateMessage(message.id, { content: 'Updated' });
    });
    
    const updated = useThreadStore.getState().messages.find(m => m.id === message.id);
    expect(updated?.content).toBe('Updated');
  });

  it('should support different message roles', () => {
    const userMsg = createMockMessage('thread-123', { role: 'user' });
    const assistantMsg = createMockMessage('thread-123', { role: 'assistant' });
    const systemMsg = createMockMessage('thread-123', { role: 'system' });
    
    act(() => {
      useThreadStore.getState().setMessages([userMsg, assistantMsg, systemMsg]);
    });
    
    const roles = useThreadStore.getState().messages.map(m => m.role);
    expect(roles).toContain('user');
    expect(roles).toContain('assistant');
    expect(roles).toContain('system');
  });

  it('should store AI metadata on assistant messages', () => {
    const assistantMsg = createMockMessage('thread-123', {
      role: 'assistant',
      ai_metadata: {
        model: 'gpt-4',
        tokens_output: 150,
        latency_ms: 1200,
      },
    });
    
    act(() => {
      useThreadStore.getState().addMessage(assistantMsg);
    });
    
    const message = useThreadStore.getState().messages[0];
    expect(message.ai_metadata?.model).toBe('gpt-4');
    expect(message.ai_metadata?.tokens_output).toBe(150);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING STATE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Loading State', () => {
  it('should set loading state', () => {
    act(() => {
      useThreadStore.getState().setLoading(true);
    });
    
    expect(useThreadStore.getState().isLoading).toBe(true);
    
    act(() => {
      useThreadStore.getState().setLoading(false);
    });
    
    expect(useThreadStore.getState().isLoading).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STREAMING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Streaming', () => {
  it('should set streaming state', () => {
    act(() => {
      useThreadStore.getState().setStreaming(true);
    });
    
    expect(useThreadStore.getState().isStreaming).toBe(true);
  });

  it('should append stream content', () => {
    act(() => {
      useThreadStore.getState().appendStreamContent('Hello');
      useThreadStore.getState().appendStreamContent(' World');
    });
    
    expect(useThreadStore.getState().streamContent).toBe('Hello World');
  });

  it('should clear stream content', () => {
    act(() => {
      useThreadStore.getState().appendStreamContent('Some content');
      useThreadStore.getState().clearStreamContent();
    });
    
    expect(useThreadStore.getState().streamContent).toBe('');
  });

  it('should handle streaming lifecycle', () => {
    act(() => {
      // Start streaming
      useThreadStore.getState().setStreaming(true);
      useThreadStore.getState().appendStreamContent('Streaming...');
    });
    
    expect(useThreadStore.getState().isStreaming).toBe(true);
    expect(useThreadStore.getState().streamContent).toBe('Streaming...');
    
    act(() => {
      // End streaming
      useThreadStore.getState().setStreaming(false);
      useThreadStore.getState().clearStreamContent();
    });
    
    expect(useThreadStore.getState().isStreaming).toBe(false);
    expect(useThreadStore.getState().streamContent).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE ASSOCIATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Association', () => {
  it('should associate thread with sphere', () => {
    const thread = createMockThread({ sphere_id: 'business' });
    
    act(() => {
      useThreadStore.getState().addThread(thread);
    });
    
    expect(useThreadStore.getState().threads[0].sphere_id).toBe('business');
  });

  it('should filter threads by sphere', () => {
    const threads = [
      createMockThread({ sphere_id: 'personal', title: 'Personal Thread' }),
      createMockThread({ sphere_id: 'business', title: 'Business Thread' }),
      createMockThread({ sphere_id: 'personal', title: 'Another Personal' }),
    ];
    
    act(() => {
      useThreadStore.getState().setThreads(threads);
    });
    
    const allThreads = useThreadStore.getState().threads;
    const personalThreads = allThreads.filter(t => t.sphere_id === 'personal');
    
    expect(personalThreads.length).toBe(2);
  });

  it('should support Scholar sphere threads', () => {
    const scholarThread = createMockThread({
      sphere_id: 'scholars',
      title: 'Research Thread',
      type: 'chat',
    });
    
    act(() => {
      useThreadStore.getState().addThread(scholarThread);
    });
    
    expect(useThreadStore.getState().threads[0].sphere_id).toBe('scholar');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD STATUS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Thread Status', () => {
  it('should create thread as active by default', () => {
    const thread = createMockThread();
    
    act(() => {
      useThreadStore.getState().addThread(thread);
    });
    
    expect(useThreadStore.getState().threads[0].status).toBe('active');
  });

  it('should filter active threads', () => {
    const threads = [
      createMockThread({ status: 'active', title: 'Active 1' }),
      createMockThread({ status: 'archived', title: 'Archived 1' }),
      createMockThread({ status: 'active', title: 'Active 2' }),
    ];
    
    act(() => {
      useThreadStore.getState().setThreads(threads);
    });
    
    const activeThreads = useThreadStore.getState().threads.filter(t => t.status === 'active');
    expect(activeThreads.length).toBe(2);
  });
});
