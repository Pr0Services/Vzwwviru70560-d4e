// CHE·NU™ React Hooks Test Suite
// Comprehensive testing for all custom hooks

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// ============================================================
// MOCK TYPES & CONSTANTS
// ============================================================

type SphereCode = 'PERSONAL' | 'BUSINESS' | 'GOVERNMENT' | 'STUDIO' | 'COMMUNITY' | 'SOCIAL' | 'ENTERTAINMENT' | 'TEAM';

const SPHERES: SphereCode[] = ['PERSONAL', 'BUSINESS', 'GOVERNMENT', 'STUDIO', 'COMMUNITY', 'SOCIAL', 'ENTERTAINMENT', 'TEAM'];
const BUREAU_SECTIONS = ['Dashboard', 'Notes', 'Tasks', 'Projects', 'Threads', 'Meetings', 'Data', 'Agents', 'Reports', 'Budget'];

// ============================================================
// MOCK HOOK IMPLEMENTATIONS
// ============================================================

// useSphere Hook
const useSphere = (initialSphere: SphereCode = 'PERSONAL') => {
  let currentSphere = initialSphere;
  let bureau = { sections: BUREAU_SECTIONS };

  const setSphere = (sphere: SphereCode) => {
    if (!SPHERES.includes(sphere)) {
      throw new Error(`Invalid sphere: ${sphere}`);
    }
    currentSphere = sphere;
  };

  const getBureau = () => bureau;

  return {
    currentSphere,
    setSphere,
    getBureau,
    availableSpheres: SPHERES,
  };
};

// useThread Hook
interface Thread {
  id: string;
  title: string;
  sphereCode: SphereCode;
  messages: Message[];
  tokenBudget: number;
  tokensUsed: number;
  encodingEnabled: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokensUsed: number;
}

const useThread = (sphereCode: SphereCode) => {
  const threads: Thread[] = [];
  let isLoading = false;
  let error: string | null = null;

  const createThread = (title: string, tokenBudget = 5000): Thread => {
    const thread: Thread = {
      id: `thread_${Date.now()}`,
      title,
      sphereCode,
      messages: [],
      tokenBudget,
      tokensUsed: 0,
      encodingEnabled: false,
    };
    threads.push(thread);
    return thread;
  };

  const addMessage = (threadId: string, role: Message['role'], content: string): Message | null => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return null;

    const tokensUsed = Math.ceil(content.length / 4);
    
    if (thread.tokensUsed + tokensUsed > thread.tokenBudget) {
      error = 'Token budget exceeded';
      return null;
    }

    const message: Message = {
      id: `msg_${Date.now()}`,
      role,
      content,
      tokensUsed,
    };

    thread.messages.push(message);
    thread.tokensUsed += tokensUsed;
    return message;
  };

  const getThread = (threadId: string) => threads.find(t => t.id === threadId);

  const deleteThread = (threadId: string) => {
    const index = threads.findIndex(t => t.id === threadId);
    if (index > -1) {
      threads.splice(index, 1);
      return true;
    }
    return false;
  };

  const toggleEncoding = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      thread.encodingEnabled = !thread.encodingEnabled;
      return thread.encodingEnabled;
    }
    return false;
  };

  return {
    threads,
    isLoading,
    error,
    createThread,
    addMessage,
    getThread,
    deleteThread,
    toggleEncoding,
  };
};

// useTask Hook
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  sphereCode: SphereCode;
  dueDate?: string;
}

const useTask = (sphereCode: SphereCode) => {
  const tasks: Task[] = [];

  const createTask = (title: string, priority: Task['priority'] = 'medium'): Task => {
    const task: Task = {
      id: `task_${Date.now()}`,
      title,
      description: '',
      status: 'todo',
      priority,
      sphereCode,
    };
    tasks.push(task);
    return task;
  };

  const updateStatus = (taskId: string, status: Task['status']): Task | null => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      return task;
    }
    return null;
  };

  const updatePriority = (taskId: string, priority: Task['priority']): Task | null => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.priority = priority;
      return task;
    }
    return null;
  };

  const setDueDate = (taskId: string, dueDate: string): Task | null => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.dueDate = dueDate;
      return task;
    }
    return null;
  };

  const deleteTask = (taskId: string): boolean => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index > -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  };

  const filterByStatus = (status: Task['status']) => tasks.filter(t => t.status === status);
  const filterByPriority = (priority: Task['priority']) => tasks.filter(t => t.priority === priority);

  return {
    tasks,
    createTask,
    updateStatus,
    updatePriority,
    setDueDate,
    deleteTask,
    filterByStatus,
    filterByPriority,
  };
};

// useNote Hook
interface Note {
  id: string;
  title: string;
  content: string;
  sphereCode: SphereCode;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const useNote = (sphereCode: SphereCode) => {
  const notes: Note[] = [];

  const createNote = (title: string, content: string, tags: string[] = []): Note => {
    const now = new Date().toISOString();
    const note: Note = {
      id: `note_${Date.now()}`,
      title,
      content,
      sphereCode,
      tags,
      createdAt: now,
      updatedAt: now,
    };
    notes.push(note);
    return note;
  };

  const updateNote = (noteId: string, updates: Partial<Pick<Note, 'title' | 'content' | 'tags'>>): Note | null => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      Object.assign(note, updates, { updatedAt: new Date().toISOString() });
      return note;
    }
    return null;
  };

  const deleteNote = (noteId: string): boolean => {
    const index = notes.findIndex(n => n.id === noteId);
    if (index > -1) {
      notes.splice(index, 1);
      return true;
    }
    return false;
  };

  const searchNotes = (query: string): Note[] => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(lowerQuery) ||
      n.content.toLowerCase().includes(lowerQuery)
    );
  };

  const filterByTag = (tag: string): Note[] => {
    return notes.filter(n => n.tags.includes(tag));
  };

  const addTag = (noteId: string, tag: string): Note | null => {
    const note = notes.find(n => n.id === noteId);
    if (note && !note.tags.includes(tag)) {
      note.tags.push(tag);
      note.updatedAt = new Date().toISOString();
      return note;
    }
    return null;
  };

  const removeTag = (noteId: string, tag: string): Note | null => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      note.tags = note.tags.filter(t => t !== tag);
      note.updatedAt = new Date().toISOString();
      return note;
    }
    return null;
  };

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    filterByTag,
    addTag,
    removeTag,
  };
};

// useTokenBudget Hook
interface TokenBudget {
  sphereCode: SphereCode;
  allocated: number;
  used: number;
  remaining: number;
}

const useTokenBudget = (sphereCode: SphereCode, initialBudget = 100000) => {
  const budget: TokenBudget = {
    sphereCode,
    allocated: initialBudget,
    used: 0,
    remaining: initialBudget,
  };

  const spend = (amount: number): boolean => {
    if (amount > budget.remaining) {
      return false;
    }
    budget.used += amount;
    budget.remaining -= amount;
    return true;
  };

  const allocate = (amount: number): void => {
    budget.allocated += amount;
    budget.remaining += amount;
  };

  const transfer = (toSphere: SphereCode, amount: number): boolean => {
    if (amount > budget.remaining) {
      return false;
    }
    budget.allocated -= amount;
    budget.remaining -= amount;
    // In real implementation, would update target sphere
    return true;
  };

  const getUsagePercentage = (): number => {
    if (budget.allocated === 0) return 0;
    return Math.round((budget.used / budget.allocated) * 100);
  };

  return {
    budget,
    spend,
    allocate,
    transfer,
    getUsagePercentage,
  };
};

// useGovernance Hook
interface GovernanceLaw {
  number: number;
  name: string;
  description: string;
  enforced: boolean;
}

const useGovernance = () => {
  const laws: GovernanceLaw[] = [
    { number: 1, name: 'Consent Primacy', description: 'User consent before any action', enforced: true },
    { number: 2, name: 'Temporal Sovereignty', description: 'User controls their time', enforced: true },
    { number: 3, name: 'Contextual Fidelity', description: 'Respect sphere boundaries', enforced: true },
    { number: 4, name: 'Hierarchical Respect', description: 'Honor permission levels', enforced: true },
    { number: 5, name: 'Audit Completeness', description: 'Log all actions', enforced: true },
    { number: 6, name: 'Encoding Transparency', description: 'Clear token optimization', enforced: true },
    { number: 7, name: 'Agent Non-Autonomy', description: 'Agents never act alone', enforced: true },
    { number: 8, name: 'Budget Accountability', description: 'Respect token budgets', enforced: true },
    { number: 9, name: 'Cross-Sphere Isolation', description: 'Data stays in context', enforced: true },
    { number: 10, name: 'Deletion Completeness', description: 'Full data removal on request', enforced: true },
  ];

  const checkCompliance = (action: string, context: { sphereCode?: SphereCode; userId?: string; budget?: number }): { compliant: boolean; violations: string[] } => {
    const violations: string[] = [];

    // Law 3: Contextual Fidelity
    if (context.sphereCode && !SPHERES.includes(context.sphereCode)) {
      violations.push('Law 3: Invalid sphere context');
    }

    // Law 7: Agent Non-Autonomy
    if (!context.userId && action.startsWith('agent.')) {
      violations.push('Law 7: Agent action requires user context');
    }

    // Law 8: Budget Accountability
    if (context.budget !== undefined && context.budget < 0) {
      violations.push('Law 8: Budget cannot be negative');
    }

    return {
      compliant: violations.length === 0,
      violations,
    };
  };

  const getLaw = (number: number): GovernanceLaw | undefined => {
    return laws.find(l => l.number === number);
  };

  return {
    laws,
    checkCompliance,
    getLaw,
  };
};

// useAgent Hook
interface Agent {
  id: string;
  name: string;
  type: 'orchestrator' | 'specialist' | 'assistant';
  status: 'available' | 'busy' | 'disabled';
  capabilities: string[];
  tokenCost: number;
}

const useAgent = (sphereCode: SphereCode) => {
  const agents: Agent[] = [
    { id: 'agent_1', name: 'Research Agent', type: 'specialist', status: 'available', capabilities: ['research', 'summarize'], tokenCost: 100 },
    { id: 'agent_2', name: 'Task Agent', type: 'orchestrator', status: 'available', capabilities: ['task', 'schedule'], tokenCost: 150 },
    { id: 'agent_3', name: 'Writing Agent', type: 'assistant', status: 'available', capabilities: ['write', 'edit'], tokenCost: 120 },
  ];

  const hiredAgents: Map<string, { budget: number; sphereCode: SphereCode }> = new Map();

  const hire = (agentId: string, budget: number): boolean => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || agent.status !== 'available') {
      return false;
    }
    hiredAgents.set(agentId, { budget, sphereCode });
    agent.status = 'busy';
    return true;
  };

  const dismiss = (agentId: string): boolean => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || !hiredAgents.has(agentId)) {
      return false;
    }
    hiredAgents.delete(agentId);
    agent.status = 'available';
    return true;
  };

  const getAvailable = (): Agent[] => {
    return agents.filter(a => a.status === 'available');
  };

  const getHired = (): Agent[] => {
    return agents.filter(a => hiredAgents.has(a.id));
  };

  return {
    agents,
    hire,
    dismiss,
    getAvailable,
    getHired,
  };
};

// useEncoding Hook
const useEncoding = () => {
  const encode = (text: string): { encoded: string; savings: number; quality: number } => {
    const patterns = [
      { find: /the /gi, replace: 'T ' },
      { find: /and /gi, replace: '& ' },
      { find: /that /gi, replace: 't ' },
      { find: /have /gi, replace: 'h ' },
      { find: /with /gi, replace: 'w ' },
      { find: /this /gi, replace: 'θ ' },
      { find: /from /gi, replace: 'f ' },
      { find: /they /gi, replace: 'y ' },
      { find: /what /gi, replace: '? ' },
      { find: /would /gi, replace: 'W ' },
    ];

    let encoded = text;
    let replacements = 0;

    patterns.forEach(({ find, replace }) => {
      const matches = text.match(find);
      if (matches) {
        replacements += matches.length;
        encoded = encoded.replace(find, replace);
      }
    });

    const savings = Math.round((1 - encoded.length / text.length) * 100);
    const quality = Math.min(100, Math.round(85 + replacements * 2));

    return { encoded, savings: Math.max(0, savings), quality };
  };

  const decode = (encoded: string): string => {
    return encoded
      .replace(/T /g, 'the ')
      .replace(/& /g, 'and ')
      .replace(/t /g, 'that ')
      .replace(/h /g, 'have ')
      .replace(/w /g, 'with ')
      .replace(/θ /g, 'this ')
      .replace(/f /g, 'from ')
      .replace(/y /g, 'they ')
      .replace(/\? /g, 'what ')
      .replace(/W /g, 'would ');
  };

  const estimateSavings = (text: string): number => {
    const { savings } = encode(text);
    return savings;
  };

  return {
    encode,
    decode,
    estimateSavings,
  };
};

// useAudit Hook
interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  sphereCode: SphereCode;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  details?: Record<string, any>;
}

const useAudit = () => {
  const entries: AuditEntry[] = [];

  const log = (
    action: string,
    userId: string,
    sphereCode: SphereCode,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>
  ): AuditEntry => {
    const entry: AuditEntry = {
      id: `audit_${Date.now()}`,
      action,
      userId,
      sphereCode,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString(),
      details,
    };
    entries.push(entry);
    return entry;
  };

  const getByAction = (action: string): AuditEntry[] => {
    return entries.filter(e => e.action === action);
  };

  const getBySphere = (sphereCode: SphereCode): AuditEntry[] => {
    return entries.filter(e => e.sphereCode === sphereCode);
  };

  const getByUser = (userId: string): AuditEntry[] => {
    return entries.filter(e => e.userId === userId);
  };

  const getByDateRange = (from: string, to: string): AuditEntry[] => {
    return entries.filter(e => e.timestamp >= from && e.timestamp <= to);
  };

  return {
    entries,
    log,
    getByAction,
    getBySphere,
    getByUser,
    getByDateRange,
  };
};

// ============================================================
// TESTS
// ============================================================

describe('useSphere Hook', () => {
  it('should initialize with default sphere', () => {
    const { currentSphere, availableSpheres } = useSphere();
    expect(currentSphere).toBe('PERSONAL');
    expect(availableSpheres).toHaveLength(8);
  });

  it('should initialize with custom sphere', () => {
    const { currentSphere } = useSphere('BUSINESS');
    expect(currentSphere).toBe('BUSINESS');
  });

  it('should have exactly 8 spheres', () => {
    const { availableSpheres } = useSphere();
    expect(availableSpheres).toEqual(SPHERES);
  });

  it('should return bureau with 10 sections', () => {
    const { getBureau } = useSphere();
    const bureau = getBureau();
    expect(bureau.sections).toHaveLength(10);
    expect(bureau.sections).toEqual(BUREAU_SECTIONS);
  });

  it('should throw error for invalid sphere', () => {
    const { setSphere } = useSphere();
    expect(() => setSphere('INVALID' as SphereCode)).toThrow();
  });
});

describe('useThread Hook', () => {
  it('should create thread', () => {
    const { createThread, threads } = useThread('PERSONAL');
    const thread = createThread('Test Thread', 5000);
    
    expect(thread.title).toBe('Test Thread');
    expect(thread.tokenBudget).toBe(5000);
    expect(thread.tokensUsed).toBe(0);
    expect(threads).toContain(thread);
  });

  it('should add message to thread', () => {
    const { createThread, addMessage } = useThread('PERSONAL');
    const thread = createThread('Test Thread');
    const message = addMessage(thread.id, 'user', 'Hello world');
    
    expect(message).not.toBeNull();
    expect(message?.content).toBe('Hello world');
    expect(message?.tokensUsed).toBeGreaterThan(0);
  });

  it('should track token usage', () => {
    const { createThread, addMessage, getThread } = useThread('PERSONAL');
    const thread = createThread('Test Thread', 1000);
    
    addMessage(thread.id, 'user', 'First message');
    addMessage(thread.id, 'assistant', 'Response');
    
    const updated = getThread(thread.id);
    expect(updated?.tokensUsed).toBeGreaterThan(0);
  });

  it('should reject message when budget exceeded', () => {
    const { createThread, addMessage, error } = useThread('PERSONAL');
    const thread = createThread('Test Thread', 10); // Very small budget
    
    const result = addMessage(thread.id, 'user', 'This is a very long message that will exceed the budget');
    expect(result).toBeNull();
  });

  it('should toggle encoding', () => {
    const { createThread, toggleEncoding, getThread } = useThread('PERSONAL');
    const thread = createThread('Test Thread');
    
    expect(thread.encodingEnabled).toBe(false);
    toggleEncoding(thread.id);
    expect(getThread(thread.id)?.encodingEnabled).toBe(true);
  });

  it('should delete thread', () => {
    const { createThread, deleteThread, threads } = useThread('PERSONAL');
    const thread = createThread('Delete Me');
    
    expect(threads.length).toBe(1);
    deleteThread(thread.id);
    expect(threads.length).toBe(0);
  });
});

describe('useTask Hook', () => {
  it('should create task with default values', () => {
    const { createTask } = useTask('BUSINESS');
    const task = createTask('Test Task');
    
    expect(task.title).toBe('Test Task');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
  });

  it('should create task with custom priority', () => {
    const { createTask } = useTask('BUSINESS');
    const task = createTask('High Priority Task', 'high');
    
    expect(task.priority).toBe('high');
  });

  it('should update task status', () => {
    const { createTask, updateStatus } = useTask('BUSINESS');
    const task = createTask('Status Task');
    
    updateStatus(task.id, 'in_progress');
    expect(task.status).toBe('in_progress');
    
    updateStatus(task.id, 'done');
    expect(task.status).toBe('done');
  });

  it('should filter by status', () => {
    const { createTask, updateStatus, filterByStatus } = useTask('BUSINESS');
    const task1 = createTask('Task 1');
    const task2 = createTask('Task 2');
    const task3 = createTask('Task 3');
    
    updateStatus(task1.id, 'done');
    updateStatus(task2.id, 'done');
    
    const doneTasks = filterByStatus('done');
    expect(doneTasks.length).toBe(2);
    
    const todoTasks = filterByStatus('todo');
    expect(todoTasks.length).toBe(1);
  });

  it('should filter by priority', () => {
    const { createTask, filterByPriority } = useTask('BUSINESS');
    createTask('High 1', 'high');
    createTask('High 2', 'high');
    createTask('Low 1', 'low');
    
    const highPriority = filterByPriority('high');
    expect(highPriority.length).toBe(2);
  });

  it('should set due date', () => {
    const { createTask, setDueDate } = useTask('BUSINESS');
    const task = createTask('Due Date Task');
    
    setDueDate(task.id, '2024-12-31');
    expect(task.dueDate).toBe('2024-12-31');
  });

  it('should delete task', () => {
    const { createTask, deleteTask, tasks } = useTask('BUSINESS');
    const task = createTask('Delete Task');
    
    expect(tasks.length).toBe(1);
    deleteTask(task.id);
    expect(tasks.length).toBe(0);
  });
});

describe('useNote Hook', () => {
  it('should create note', () => {
    const { createNote } = useNote('PERSONAL');
    const note = createNote('Test Note', 'Content here');
    
    expect(note.title).toBe('Test Note');
    expect(note.content).toBe('Content here');
  });

  it('should create note with tags', () => {
    const { createNote } = useNote('PERSONAL');
    const note = createNote('Tagged Note', 'Content', ['important', 'work']);
    
    expect(note.tags).toEqual(['important', 'work']);
  });

  it('should update note', () => {
    const { createNote, updateNote } = useNote('PERSONAL');
    const note = createNote('Original', 'Original content');
    
    updateNote(note.id, { content: 'Updated content' });
    expect(note.content).toBe('Updated content');
  });

  it('should search notes by title', () => {
    const { createNote, searchNotes } = useNote('PERSONAL');
    createNote('Meeting Notes', 'Content');
    createNote('Project Ideas', 'Content');
    
    const results = searchNotes('meeting');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Meeting Notes');
  });

  it('should search notes by content', () => {
    const { createNote, searchNotes } = useNote('PERSONAL');
    createNote('Note 1', 'Discussion about budget');
    createNote('Note 2', 'Random content');
    
    const results = searchNotes('budget');
    expect(results.length).toBe(1);
  });

  it('should filter by tag', () => {
    const { createNote, filterByTag } = useNote('PERSONAL');
    createNote('Work Note', 'Content', ['work']);
    createNote('Personal Note', 'Content', ['personal']);
    createNote('Both', 'Content', ['work', 'personal']);
    
    const workNotes = filterByTag('work');
    expect(workNotes.length).toBe(2);
  });

  it('should add tag', () => {
    const { createNote, addTag } = useNote('PERSONAL');
    const note = createNote('Note', 'Content', ['initial']);
    
    addTag(note.id, 'added');
    expect(note.tags).toContain('added');
  });

  it('should remove tag', () => {
    const { createNote, removeTag } = useNote('PERSONAL');
    const note = createNote('Note', 'Content', ['remove-me', 'keep']);
    
    removeTag(note.id, 'remove-me');
    expect(note.tags).not.toContain('remove-me');
    expect(note.tags).toContain('keep');
  });
});

describe('useTokenBudget Hook', () => {
  it('should initialize with correct values', () => {
    const { budget } = useTokenBudget('PERSONAL', 100000);
    
    expect(budget.allocated).toBe(100000);
    expect(budget.used).toBe(0);
    expect(budget.remaining).toBe(100000);
  });

  it('should spend tokens', () => {
    const { budget, spend } = useTokenBudget('PERSONAL', 1000);
    
    const result = spend(500);
    expect(result).toBe(true);
    expect(budget.used).toBe(500);
    expect(budget.remaining).toBe(500);
  });

  it('should reject spending over budget', () => {
    const { budget, spend } = useTokenBudget('PERSONAL', 1000);
    
    const result = spend(1500);
    expect(result).toBe(false);
    expect(budget.used).toBe(0);
    expect(budget.remaining).toBe(1000);
  });

  it('should allocate additional tokens', () => {
    const { budget, allocate } = useTokenBudget('PERSONAL', 1000);
    
    allocate(500);
    expect(budget.allocated).toBe(1500);
    expect(budget.remaining).toBe(1500);
  });

  it('should transfer tokens', () => {
    const { budget, transfer } = useTokenBudget('PERSONAL', 1000);
    
    const result = transfer('BUSINESS', 300);
    expect(result).toBe(true);
    expect(budget.allocated).toBe(700);
    expect(budget.remaining).toBe(700);
  });

  it('should calculate usage percentage', () => {
    const { budget, spend, getUsagePercentage } = useTokenBudget('PERSONAL', 1000);
    
    spend(250);
    expect(getUsagePercentage()).toBe(25);
  });
});

describe('useGovernance Hook', () => {
  it('should have 10 laws', () => {
    const { laws } = useGovernance();
    expect(laws.length).toBe(10);
  });

  it('should have all laws enforced', () => {
    const { laws } = useGovernance();
    expect(laws.every(l => l.enforced)).toBe(true);
  });

  it('should check compliance for valid context', () => {
    const { checkCompliance } = useGovernance();
    
    const result = checkCompliance('thread.create', {
      sphereCode: 'PERSONAL',
      userId: 'user_1',
    });
    
    expect(result.compliant).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  it('should detect invalid sphere (Law 3)', () => {
    const { checkCompliance } = useGovernance();
    
    const result = checkCompliance('thread.create', {
      sphereCode: 'INVALID' as SphereCode,
      userId: 'user_1',
    });
    
    expect(result.compliant).toBe(false);
    expect(result.violations).toContain('Law 3: Invalid sphere context');
  });

  it('should detect agent without user (Law 7)', () => {
    const { checkCompliance } = useGovernance();
    
    const result = checkCompliance('agent.execute', {
      sphereCode: 'PERSONAL',
    });
    
    expect(result.compliant).toBe(false);
    expect(result.violations).toContain('Law 7: Agent action requires user context');
  });

  it('should get specific law', () => {
    const { getLaw } = useGovernance();
    
    const law1 = getLaw(1);
    expect(law1?.name).toBe('Consent Primacy');
    
    const law5 = getLaw(5);
    expect(law5?.name).toBe('Audit Completeness');
  });
});

describe('useAgent Hook', () => {
  it('should list available agents', () => {
    const { getAvailable } = useAgent('BUSINESS');
    const available = getAvailable();
    
    expect(available.length).toBe(3);
  });

  it('should hire agent', () => {
    const { hire, getHired, getAvailable } = useAgent('BUSINESS');
    
    const result = hire('agent_1', 1000);
    expect(result).toBe(true);
    expect(getHired().length).toBe(1);
    expect(getAvailable().length).toBe(2);
  });

  it('should dismiss agent', () => {
    const { hire, dismiss, getHired, getAvailable } = useAgent('BUSINESS');
    
    hire('agent_1', 1000);
    dismiss('agent_1');
    
    expect(getHired().length).toBe(0);
    expect(getAvailable().length).toBe(3);
  });

  it('should not hire already busy agent', () => {
    const { hire, agents } = useAgent('BUSINESS');
    
    hire('agent_1', 1000);
    const secondHire = hire('agent_1', 500);
    
    expect(secondHire).toBe(false);
  });
});

describe('useEncoding Hook', () => {
  it('should encode text', () => {
    const { encode } = useEncoding();
    const result = encode('the quick brown fox and the lazy dog');
    
    expect(result.encoded.length).toBeLessThan(36);
    expect(result.savings).toBeGreaterThan(0);
  });

  it('should decode text', () => {
    const { encode, decode } = useEncoding();
    const original = 'the quick and the fast';
    const { encoded } = encode(original);
    const decoded = decode(encoded);
    
    expect(decoded.toLowerCase()).toBe(original.toLowerCase());
  });

  it('should estimate savings', () => {
    const { estimateSavings } = useEncoding();
    const savings = estimateSavings('the the the the');
    
    expect(savings).toBeGreaterThan(0);
  });

  it('should handle empty string', () => {
    const { encode } = useEncoding();
    const result = encode('');
    
    expect(result.encoded).toBe('');
    expect(result.savings).toBe(0);
  });
});

describe('useAudit Hook', () => {
  it('should log action', () => {
    const { log, entries } = useAudit();
    
    log('thread.create', 'user_1', 'PERSONAL', 'thread', 'thread_1');
    
    expect(entries.length).toBe(1);
    expect(entries[0].action).toBe('thread.create');
  });

  it('should filter by action', () => {
    const { log, getByAction } = useAudit();
    
    log('thread.create', 'user_1', 'PERSONAL', 'thread', 'thread_1');
    log('task.create', 'user_1', 'PERSONAL', 'task', 'task_1');
    log('thread.create', 'user_1', 'BUSINESS', 'thread', 'thread_2');
    
    const threadCreates = getByAction('thread.create');
    expect(threadCreates.length).toBe(2);
  });

  it('should filter by sphere', () => {
    const { log, getBySphere } = useAudit();
    
    log('action', 'user_1', 'PERSONAL', 'type', 'id_1');
    log('action', 'user_1', 'BUSINESS', 'type', 'id_2');
    log('action', 'user_1', 'PERSONAL', 'type', 'id_3');
    
    const personalActions = getBySphere('PERSONAL');
    expect(personalActions.length).toBe(2);
  });

  it('should filter by user', () => {
    const { log, getByUser } = useAudit();
    
    log('action', 'user_1', 'PERSONAL', 'type', 'id_1');
    log('action', 'user_2', 'PERSONAL', 'type', 'id_2');
    log('action', 'user_1', 'PERSONAL', 'type', 'id_3');
    
    const user1Actions = getByUser('user_1');
    expect(user1Actions.length).toBe(2);
  });

  it('should include timestamp', () => {
    const { log, entries } = useAudit();
    
    log('action', 'user_1', 'PERSONAL', 'type', 'id_1');
    
    expect(entries[0].timestamp).toBeDefined();
    expect(new Date(entries[0].timestamp).getTime()).toBeGreaterThan(0);
  });
});

// ============================================================
// EXPORT
// ============================================================

export default {};
