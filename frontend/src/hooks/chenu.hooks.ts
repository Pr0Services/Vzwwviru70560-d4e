// CHE·NU™ React Hooks Library
// Comprehensive hooks for all platform features

import { useState, useEffect, useCallback, useRef, useMemo, useContext, createContext } from 'react';

// ============================================================
// TYPES
// ============================================================

type SphereCode = 'PERSONAL' | 'BUSINESS' | 'GOVERNMENT' | 'STUDIO' | 'COMMUNITY' | 'SOCIAL' | 'ENTERTAINMENT' | 'TEAM';
type BureauSection = 'QUICK_CAPTURE' | 'RESUME_WORKSPACE' | 'THREADS' | 'DATA_FILES' | 'ACTIVE_AGENTS' | 'MEETINGS';

interface Thread {
  id: string;
  title: string;
  sphereCode: SphereCode;
  messages: ThreadMessage[];
  tokenBudget: number;
  tokensUsed: number;
  encodingEnabled: boolean;
}

interface ThreadMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokensUsed: number;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  sphereCode: SphereCode;
  dueDate?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  sphereCode: SphereCode;
  status: 'active' | 'completed' | 'archived';
  tokenBudget: number;
  tokensUsed: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  sphereCode: SphereCode;
  tags: string[];
}

interface Meeting {
  id: string;
  title: string;
  sphereCode: SphereCode;
  startTime: string;
  endTime: string;
  participants: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface Agent {
  id: string;
  name: string;
  type: 'orchestrator' | 'specialist';
  sphereCode: SphereCode;
  status: 'available' | 'busy' | 'disabled';
  tokenCost: number;
}

interface TokenBudget {
  allocated: number;
  used: number;
  remaining: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

// ============================================================
// CONTEXT
// ============================================================

interface ChenuContextValue {
  currentSphere: SphereCode | null;
  setCurrentSphere: (sphere: SphereCode) => void;
  currentSection: BureauSection;
  setCurrentSection: (section: BureauSection) => void;
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string } | null;
}

const ChenuContext = createContext<ChenuContextValue | null>(null);

export function useChenu(): ChenuContextValue {
  const context = useContext(ChenuContext);
  if (!context) {
    throw new Error('useChenu must be used within a ChenuProvider');
  }
  return context;
}

// ============================================================
// API HOOK
// ============================================================

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiResult<T, P extends any[]> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiResult<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.immediate || false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: P): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args);
      
      if (response.success && response.data) {
        setData(response.data);
        options.onSuccess?.(response.data);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'API request failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options.onSuccess, options.onError]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

// ============================================================
// THREADS HOOKS
// ============================================================

interface UseThreadsResult {
  threads: Thread[];
  loading: boolean;
  error: Error | null;
  createThread: (title: string, tokenBudget?: number) => Promise<Thread | null>;
  deleteThread: (id: string) => Promise<boolean>;
  refresh: () => void;
}

export function useThreads(sphereCode: SphereCode): UseThreadsResult {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    try {
      // In production: call actual API
      const mockThreads: Thread[] = [
        {
          id: 'thread_1',
          title: 'Project Discussion',
          sphereCode,
          messages: [],
          tokenBudget: 5000,
          tokensUsed: 100,
          encodingEnabled: true,
        },
      ];
      setThreads(mockThreads);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sphereCode]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const createThread = useCallback(async (title: string, tokenBudget = 5000): Promise<Thread | null> => {
    try {
      const newThread: Thread = {
        id: `thread_${Date.now()}`,
        title,
        sphereCode,
        messages: [],
        tokenBudget,
        tokensUsed: 0,
        encodingEnabled: false,
      };
      setThreads(prev => [newThread, ...prev]);
      return newThread;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, [sphereCode]);

  const deleteThread = useCallback(async (id: string): Promise<boolean> => {
    try {
      setThreads(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }, []);

  return { threads, loading, error, createThread, deleteThread, refresh: fetchThreads };
}

interface UseThreadResult {
  thread: Thread | null;
  loading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<ThreadMessage | null>;
  toggleEncoding: () => void;
  updateBudget: (budget: number) => void;
}

export function useThread(threadId: string): UseThreadResult {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchThread = async () => {
      setLoading(true);
      try {
        // In production: call actual API
        const mockThread: Thread = {
          id: threadId,
          title: 'Thread Discussion',
          sphereCode: 'PERSONAL',
          messages: [],
          tokenBudget: 5000,
          tokensUsed: 0,
          encodingEnabled: false,
        };
        setThread(mockThread);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  const sendMessage = useCallback(async (content: string): Promise<ThreadMessage | null> => {
    if (!thread) return null;

    const newMessage: ThreadMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      tokensUsed: Math.ceil(content.length / 4),
      timestamp: new Date().toISOString(),
    };

    setThread(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      tokensUsed: prev.tokensUsed + newMessage.tokensUsed,
    } : null);

    return newMessage;
  }, [thread]);

  const toggleEncoding = useCallback(() => {
    setThread(prev => prev ? {
      ...prev,
      encodingEnabled: !prev.encodingEnabled,
    } : null);
  }, []);

  const updateBudget = useCallback((budget: number) => {
    setThread(prev => prev ? {
      ...prev,
      tokenBudget: budget,
    } : null);
  }, []);

  return { thread, loading, error, sendMessage, toggleEncoding, updateBudget };
}

// ============================================================
// TASKS HOOKS
// ============================================================

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  createTask: (data: Partial<Task>) => Promise<Task | null>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  completeTask: (id: string) => Promise<boolean>;
  refresh: () => void;
  filter: (status?: Task['status'], priority?: Task['priority']) => Task[];
}

export function useTasks(sphereCode: SphereCode): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // In production: call actual API
      const mockTasks: Task[] = [
        {
          id: 'task_1',
          title: 'Review Documents',
          description: 'Review Q1 documents',
          status: 'todo',
          priority: 'high',
          sphereCode,
          dueDate: '2024-12-20',
        },
        {
          id: 'task_2',
          title: 'Prepare Report',
          description: 'Prepare monthly report',
          status: 'in_progress',
          priority: 'medium',
          sphereCode,
        },
      ];
      setTasks(mockTasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sphereCode]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (data: Partial<Task>): Promise<Task | null> => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: data.title || 'Untitled',
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      sphereCode,
      dueDate: data.dueDate,
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, [sphereCode]);

  const updateTask = useCallback(async (id: string, data: Partial<Task>): Promise<Task | null> => {
    let updatedTask: Task | null = null;
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        updatedTask = { ...task, ...data };
        return updatedTask;
      }
      return task;
    }));
    return updatedTask;
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setTasks(prev => prev.filter(t => t.id !== id));
    return true;
  }, []);

  const completeTask = useCallback(async (id: string): Promise<boolean> => {
    return updateTask(id, { status: 'done' }).then(t => !!t);
  }, [updateTask]);

  const filter = useCallback((status?: Task['status'], priority?: Task['priority']): Task[] => {
    return tasks.filter(task => {
      if (status && task.status !== status) return false;
      if (priority && task.priority !== priority) return false;
      return true;
    });
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    refresh: fetchTasks,
    filter,
  };
}

// ============================================================
// PROJECTS HOOKS
// ============================================================

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  createProject: (data: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  refresh: () => void;
}

export function useProjects(sphereCode: SphereCode): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const mockProjects: Project[] = [
        {
          id: 'project_1',
          name: 'Q1 Initiative',
          description: 'Main Q1 project',
          sphereCode,
          status: 'active',
          tokenBudget: 50000,
          tokensUsed: 5000,
        },
      ];
      setProjects(mockProjects);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sphereCode]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(async (data: Partial<Project>): Promise<Project | null> => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name: data.name || 'Untitled',
      description: data.description || '',
      sphereCode,
      status: data.status || 'active',
      tokenBudget: data.tokenBudget || 10000,
      tokensUsed: 0,
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, [sphereCode]);

  const updateProject = useCallback(async (id: string, data: Partial<Project>): Promise<Project | null> => {
    let updated: Project | null = null;
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        updated = { ...p, ...data };
        return updated;
      }
      return p;
    }));
    return updated;
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    setProjects(prev => prev.filter(p => p.id !== id));
    return true;
  }, []);

  return { projects, loading, error, createProject, updateProject, deleteProject, refresh: fetchProjects };
}

// ============================================================
// NOTES HOOKS
// ============================================================

interface UseNotesResult {
  notes: Note[];
  loading: boolean;
  error: Error | null;
  createNote: (data: Partial<Note>) => Promise<Note | null>;
  updateNote: (id: string, data: Partial<Note>) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  searchNotes: (query: string) => Note[];
  filterByTag: (tag: string) => Note[];
  refresh: () => void;
}

export function useNotes(sphereCode: SphereCode): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const mockNotes: Note[] = [
        {
          id: 'note_1',
          title: 'Meeting Notes',
          content: 'Important discussion points...',
          sphereCode,
          tags: ['meeting', 'important'],
        },
      ];
      setNotes(mockNotes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sphereCode]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(async (data: Partial<Note>): Promise<Note | null> => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: data.title || 'Untitled',
      content: data.content || '',
      sphereCode,
      tags: data.tags || [],
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, [sphereCode]);

  const updateNote = useCallback(async (id: string, data: Partial<Note>): Promise<Note | null> => {
    let updated: Note | null = null;
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        updated = { ...n, ...data };
        return updated;
      }
      return n;
    }));
    return updated;
  }, []);

  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    setNotes(prev => prev.filter(n => n.id !== id));
    return true;
  }, []);

  const searchNotes = useCallback((query: string): Note[] => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(lowerQuery) ||
      n.content.toLowerCase().includes(lowerQuery)
    );
  }, [notes]);

  const filterByTag = useCallback((tag: string): Note[] => {
    return notes.filter(n => n.tags.includes(tag));
  }, [notes]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    filterByTag,
    refresh: fetchNotes,
  };
}

// ============================================================
// MEETINGS HOOKS
// ============================================================

interface UseMeetingsResult {
  meetings: Meeting[];
  loading: boolean;
  error: Error | null;
  createMeeting: (data: Partial<Meeting>) => Promise<Meeting | null>;
  cancelMeeting: (id: string) => Promise<boolean>;
  getUpcoming: () => Meeting[];
  refresh: () => void;
}

export function useMeetings(sphereCode: SphereCode): UseMeetingsResult {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const mockMeetings: Meeting[] = [
        {
          id: 'meeting_1',
          title: 'Weekly Sync',
          sphereCode,
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
          participants: ['user1', 'user2'],
          status: 'scheduled',
        },
      ];
      setMeetings(mockMeetings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sphereCode]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const createMeeting = useCallback(async (data: Partial<Meeting>): Promise<Meeting | null> => {
    const newMeeting: Meeting = {
      id: `meeting_${Date.now()}`,
      title: data.title || 'Untitled Meeting',
      sphereCode,
      startTime: data.startTime || new Date().toISOString(),
      endTime: data.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      participants: data.participants || [],
      status: 'scheduled',
    };
    setMeetings(prev => [newMeeting, ...prev]);
    return newMeeting;
  }, [sphereCode]);

  const cancelMeeting = useCallback(async (id: string): Promise<boolean> => {
    setMeetings(prev => prev.map(m => 
      m.id === id ? { ...m, status: 'cancelled' as const } : m
    ));
    return true;
  }, []);

  const getUpcoming = useCallback((): Meeting[] => {
    const now = new Date();
    return meetings
      .filter(m => m.status === 'scheduled' && new Date(m.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [meetings]);

  return { meetings, loading, error, createMeeting, cancelMeeting, getUpcoming, refresh: fetchMeetings };
}

// ============================================================
// AGENTS HOOKS
// ============================================================

interface UseAgentsResult {
  agents: Agent[];
  loading: boolean;
  error: Error | null;
  hireAgent: (agentId: string, budget: number) => Promise<boolean>;
  dismissAgent: (agentId: string) => Promise<boolean>;
  executeTask: (agentId: string, task: string) => Promise<{ result: string; tokensUsed: number } | null>;
  refresh: () => void;
}

export function useAgents(sphereCode: SphereCode): UseAgentsResult {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const mockAgents: Agent[] = [
        {
          id: 'agent_1',
          name: 'Research Assistant',
          type: 'specialist',
          sphereCode,
          status: 'available',
          tokenCost: 100,
        },
        {
          id: 'agent_2',
          name: 'Task Manager',
          type: 'orchestrator',
          sphereCode,
          status: 'available',
          tokenCost: 150,
        },
      ];
      setAgents(mockAgents);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sphereCode]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const hireAgent = useCallback(async (agentId: string, budget: number): Promise<boolean> => {
    setAgents(prev => prev.map(a =>
      a.id === agentId ? { ...a, status: 'busy' as const } : a
    ));
    return true;
  }, []);

  const dismissAgent = useCallback(async (agentId: string): Promise<boolean> => {
    setAgents(prev => prev.map(a =>
      a.id === agentId ? { ...a, status: 'available' as const } : a
    ));
    return true;
  }, []);

  const executeTask = useCallback(async (
    agentId: string,
    task: string
  ): Promise<{ result: string; tokensUsed: number } | null> => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return null;

    // Simulate execution
    return {
      result: `Completed: ${task}`,
      tokensUsed: agent.tokenCost,
    };
  }, [agents]);

  return { agents, loading, error, hireAgent, dismissAgent, executeTask, refresh: fetchAgents };
}

// ============================================================
// TOKEN HOOKS
// ============================================================

interface UseTokensResult {
  budget: TokenBudget | null;
  loading: boolean;
  error: Error | null;
  allocate: (amount: number) => Promise<boolean>;
  spend: (amount: number, category: string) => Promise<boolean>;
  transfer: (toSphere: SphereCode, amount: number) => Promise<boolean>;
  refresh: () => void;
}

export function useTokens(sphereCode: SphereCode): UseTokensResult {
  const [budget, setBudget] = useState<TokenBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBudget = useCallback(async () => {
    setLoading(true);
    try {
      // Memory Prompt: Tokens are INTERNAL utility credits
      const mockBudget: TokenBudget = {
        allocated: 100000,
        used: 25000,
        remaining: 75000,
      };
      setBudget(mockBudget);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sphereCode]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const allocate = useCallback(async (amount: number): Promise<boolean> => {
    setBudget(prev => prev ? {
      ...prev,
      allocated: prev.allocated + amount,
      remaining: prev.remaining + amount,
    } : null);
    return true;
  }, []);

  const spend = useCallback(async (amount: number, category: string): Promise<boolean> => {
    setBudget(prev => {
      if (!prev || prev.remaining < amount) return prev;
      return {
        ...prev,
        used: prev.used + amount,
        remaining: prev.remaining - amount,
      };
    });
    return true;
  }, []);

  const transfer = useCallback(async (toSphere: SphereCode, amount: number): Promise<boolean> => {
    // In production: call API to transfer tokens
    return spend(amount, 'transfer');
  }, [spend]);

  return { budget, loading, error, allocate, spend, transfer, refresh: fetchBudget };
}

// ============================================================
// NOVA HOOKS (Memory Prompt: System Intelligence)
// ============================================================

interface UseNovaResult {
  isAvailable: boolean;
  insights: { id: string; title: string; content: string; type: string }[];
  askNova: (question: string) => Promise<string>;
  getInsights: () => void;
  dismissInsight: (id: string) => void;
}

export function useNova(): UseNovaResult {
  const [isAvailable] = useState(true);
  const [insights, setInsights] = useState<{ id: string; title: string; content: string; type: string }[]>([]);

  const askNova = useCallback(async (question: string): Promise<string> => {
    // Memory Prompt: Nova is System Intelligence, NEVER hired
    return `Nova here! As your System Intelligence, I can help you with: ${question}. Remember, I'm always here to guide you through governance and provide insights.`;
  }, []);

  const getInsights = useCallback(() => {
    const mockInsights = [
      {
        id: 'insight_1',
        title: 'Token Optimization',
        content: 'Enable encoding to save up to 30% on tokens',
        type: 'optimization',
      },
      {
        id: 'insight_2',
        title: 'Task Reminder',
        content: 'You have 3 tasks due this week',
        type: 'reminder',
      },
    ];
    setInsights(mockInsights);
  }, []);

  const dismissInsight = useCallback((id: string) => {
    setInsights(prev => prev.filter(i => i.id !== id));
  }, []);

  return { isAvailable, insights, askNova, getInsights, dismissInsight };
}

// ============================================================
// UI HOOKS
// ============================================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      logger.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) setKeyPressed(true);
    };
    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) setKeyPressed(false);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

export function useAsync<T>(asyncFn: () => Promise<T>, immediate = true): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute };
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  useChenu,
  useApi,
  useThreads,
  useThread,
  useTasks,
  useProjects,
  useNotes,
  useMeetings,
  useAgents,
  useTokens,
  useNova,
  useDebounce,
  useThrottle,
  useLocalStorage,
  useMediaQuery,
  useClickOutside,
  useKeyPress,
  usePrevious,
  useInterval,
  useTimeout,
  useAsync,
};
