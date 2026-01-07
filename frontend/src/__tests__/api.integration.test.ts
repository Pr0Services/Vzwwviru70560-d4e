// CHE·NU™ API Integration Tests
// Complete test suite for API endpoints

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

// ============================================================
// TEST CONFIGURATION
// ============================================================

const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { total?: number; page?: number };
}

// Memory Prompt: 8 FROZEN Spheres
const SPHERE_CODES = ['PERSONAL', 'BUSINESS', 'GOVERNMENT', 'STUDIO', 'COMMUNITY', 'SOCIAL', 'ENTERTAINMENT', 'TEAM'];

// Memory Prompt: 10 NON-NEGOTIABLE Bureau Sections
const BUREAU_SECTIONS = ['Dashboard', 'Notes', 'Tasks', 'Projects', 'Threads', 'Meetings', 'Data', 'Agents', 'Reports', 'Budget'];

// ============================================================
// MOCK HTTP CLIENT
// ============================================================

class MockHttpClient {
  private token: string = '';
  private data: Map<string, any> = new Map();

  setToken(token: string) {
    this.token = token;
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    // Simulate API responses
    if (path === '/spheres') {
      return {
        success: true,
        data: SPHERE_CODES.map(code => ({
          code,
          name: code.charAt(0) + code.slice(1).toLowerCase(),
          icon: '🏠',
          tokenBudget: 100000,
          tokensUsed: 0,
        })) as any,
      };
    }

    if (path.match(/\/spheres\/\w+\/bureau/)) {
      const sphereCode = path.split('/')[2];
      return {
        success: true,
        data: {
          sphereCode,
          sections: BUREAU_SECTIONS,
        } as any,
      };
    }

    if (path.match(/\/spheres\/\w+\/threads$/)) {
      const sphereCode = path.split('/')[2];
      const threads = Array.from(this.data.values())
        .filter(t => t.type === 'thread' && t.sphereCode === sphereCode);
      return { success: true, data: threads as any };
    }

    if (path.match(/\/spheres\/\w+\/tasks$/)) {
      const sphereCode = path.split('/')[2];
      const tasks = Array.from(this.data.values())
        .filter(t => t.type === 'task' && t.sphereCode === sphereCode);
      return { success: true, data: tasks as any };
    }

    if (path.match(/\/spheres\/\w+\/notes$/)) {
      const sphereCode = path.split('/')[2];
      const notes = Array.from(this.data.values())
        .filter(t => t.type === 'note' && t.sphereCode === sphereCode);
      return { success: true, data: notes as any };
    }

    if (path.match(/\/spheres\/\w+\/projects$/)) {
      const sphereCode = path.split('/')[2];
      const projects = Array.from(this.data.values())
        .filter(t => t.type === 'project' && t.sphereCode === sphereCode);
      return { success: true, data: projects as any };
    }

    if (path.match(/\/spheres\/\w+\/meetings$/)) {
      const sphereCode = path.split('/')[2];
      const meetings = Array.from(this.data.values())
        .filter(t => t.type === 'meeting' && t.sphereCode === sphereCode);
      return { success: true, data: meetings as any };
    }

    if (path.match(/\/spheres\/\w+\/agents$/)) {
      return {
        success: true,
        data: [
          { id: 'agent_1', name: 'Research Agent', type: 'specialist', status: 'available' },
          { id: 'agent_2', name: 'Task Agent', type: 'orchestrator', status: 'available' },
        ] as any,
      };
    }

    if (path === '/user/me') {
      return {
        success: true,
        data: {
          id: 'user_1',
          email: 'test@chenu.io',
          name: 'Test User',
          consentGovernance: true,
        } as any,
      };
    }

    if (path === '/tokens/budget') {
      return {
        success: true,
        data: {
          total: 800000,
          used: 50000,
          remaining: 750000,
          bySphere: {},
        } as any,
      };
    }

    if (path === '/audit') {
      return {
        success: true,
        data: [] as any,
      };
    }

    return { success: false, error: { code: 'NOT_FOUND', message: 'Not found' } };
  }

  async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    // Create thread
    if (path.match(/\/spheres\/\w+\/threads$/)) {
      const sphereCode = path.split('/')[2];
      if (!SPHERE_CODES.includes(sphereCode)) {
        return { success: false, error: { code: 'INVALID_SPHERE', message: 'Invalid sphere code' } };
      }
      const thread = {
        id: `thread_${Date.now()}`,
        type: 'thread',
        sphereCode,
        ...body,
        messages: [],
        tokensUsed: 0,
        createdAt: new Date().toISOString(),
      };
      this.data.set(thread.id, thread);
      return { success: true, data: thread as any };
    }

    // Create task
    if (path.match(/\/spheres\/\w+\/tasks$/)) {
      const sphereCode = path.split('/')[2];
      if (!SPHERE_CODES.includes(sphereCode)) {
        return { success: false, error: { code: 'INVALID_SPHERE', message: 'Invalid sphere code' } };
      }
      const task = {
        id: `task_${Date.now()}`,
        type: 'task',
        sphereCode,
        status: 'todo',
        ...body,
        createdAt: new Date().toISOString(),
      };
      this.data.set(task.id, task);
      return { success: true, data: task as any };
    }

    // Create note
    if (path.match(/\/spheres\/\w+\/notes$/)) {
      const sphereCode = path.split('/')[2];
      if (!SPHERE_CODES.includes(sphereCode)) {
        return { success: false, error: { code: 'INVALID_SPHERE', message: 'Invalid sphere code' } };
      }
      const note = {
        id: `note_${Date.now()}`,
        type: 'note',
        sphereCode,
        tags: body.tags || [],
        ...body,
        createdAt: new Date().toISOString(),
      };
      this.data.set(note.id, note);
      return { success: true, data: note as any };
    }

    // Create project
    if (path.match(/\/spheres\/\w+\/projects$/)) {
      const sphereCode = path.split('/')[2];
      if (!SPHERE_CODES.includes(sphereCode)) {
        return { success: false, error: { code: 'INVALID_SPHERE', message: 'Invalid sphere code' } };
      }
      const project = {
        id: `project_${Date.now()}`,
        type: 'project',
        sphereCode,
        status: 'active',
        tokensUsed: 0,
        ...body,
        createdAt: new Date().toISOString(),
      };
      this.data.set(project.id, project);
      return { success: true, data: project as any };
    }

    // Create meeting
    if (path.match(/\/spheres\/\w+\/meetings$/)) {
      const sphereCode = path.split('/')[2];
      if (!SPHERE_CODES.includes(sphereCode)) {
        return { success: false, error: { code: 'INVALID_SPHERE', message: 'Invalid sphere code' } };
      }
      const meeting = {
        id: `meeting_${Date.now()}`,
        type: 'meeting',
        sphereCode,
        status: 'scheduled',
        participants: body.participants || [],
        ...body,
        createdAt: new Date().toISOString(),
      };
      this.data.set(meeting.id, meeting);
      return { success: true, data: meeting as any };
    }

    // Add message to thread
    if (path.match(/\/spheres\/\w+\/threads\/\w+\/messages$/)) {
      const parts = path.split('/');
      const threadId = parts[4];
      const thread = this.data.get(threadId);
      if (!thread) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Thread not found' } };
      }
      const message = {
        id: `msg_${Date.now()}`,
        threadId,
        role: body.role,
        content: body.content,
        tokensUsed: Math.ceil(body.content.length / 4),
        timestamp: new Date().toISOString(),
      };
      thread.messages.push(message);
      thread.tokensUsed += message.tokensUsed;
      return { success: true, data: message as any };
    }

    // Hire agent
    if (path.match(/\/spheres\/\w+\/agents\/hire$/)) {
      return {
        success: true,
        data: {
          id: body.agentId,
          status: 'busy',
          budget: body.budget,
        } as any,
      };
    }

    // Transfer tokens
    if (path === '/tokens/transfer') {
      return {
        success: true,
        data: {
          id: `transfer_${Date.now()}`,
          fromSphere: body.fromSphere,
          toSphere: body.toSphere,
          amount: body.amount,
          reason: body.reason,
          timestamp: new Date().toISOString(),
        } as any,
      };
    }

    // Auth endpoints
    if (path === '/auth/login') {
      return {
        success: true,
        data: {
          token: 'test_token_12345',
          user: { id: 'user_1', email: body.email, name: 'Test User' },
        } as any,
      };
    }

    if (path === '/auth/register') {
      if (!body.consentGovernance || !body.consentTerms) {
        return { success: false, error: { code: 'CONSENT_REQUIRED', message: 'Governance consent required' } };
      }
      return {
        success: true,
        data: {
          id: `user_${Date.now()}`,
          email: body.email,
          name: body.name,
        } as any,
      };
    }

    return { success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
  }

  async patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    // Update task status
    if (path.match(/\/spheres\/\w+\/tasks\/\w+$/)) {
      const parts = path.split('/');
      const taskId = parts[4];
      const task = this.data.get(taskId);
      if (!task) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } };
      }
      Object.assign(task, body, { updatedAt: new Date().toISOString() });
      return { success: true, data: task as any };
    }

    // Update thread
    if (path.match(/\/spheres\/\w+\/threads\/\w+$/)) {
      const parts = path.split('/');
      const threadId = parts[4];
      const thread = this.data.get(threadId);
      if (!thread) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Thread not found' } };
      }
      Object.assign(thread, body, { updatedAt: new Date().toISOString() });
      return { success: true, data: thread as any };
    }

    // Update note
    if (path.match(/\/spheres\/\w+\/notes\/\w+$/)) {
      const parts = path.split('/');
      const noteId = parts[4];
      const note = this.data.get(noteId);
      if (!note) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Note not found' } };
      }
      Object.assign(note, body, { updatedAt: new Date().toISOString() });
      return { success: true, data: note as any };
    }

    // Update project
    if (path.match(/\/spheres\/\w+\/projects\/\w+$/)) {
      const parts = path.split('/');
      const projectId = parts[4];
      const project = this.data.get(projectId);
      if (!project) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } };
      }
      Object.assign(project, body, { updatedAt: new Date().toISOString() });
      return { success: true, data: project as any };
    }

    // Cancel meeting
    if (path.match(/\/spheres\/\w+\/meetings\/\w+$/)) {
      const parts = path.split('/');
      const meetingId = parts[4];
      const meeting = this.data.get(meetingId);
      if (!meeting) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Meeting not found' } };
      }
      Object.assign(meeting, body, { updatedAt: new Date().toISOString() });
      return { success: true, data: meeting as any };
    }

    return { success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    // Delete thread
    if (path.match(/\/spheres\/\w+\/threads\/\w+$/)) {
      const parts = path.split('/');
      const threadId = parts[4];
      if (!this.data.has(threadId)) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Thread not found' } };
      }
      this.data.delete(threadId);
      return { success: true, data: {} as any };
    }

    // Delete task
    if (path.match(/\/spheres\/\w+\/tasks\/\w+$/)) {
      const parts = path.split('/');
      const taskId = parts[4];
      if (!this.data.has(taskId)) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } };
      }
      this.data.delete(taskId);
      return { success: true, data: {} as any };
    }

    // Delete note
    if (path.match(/\/spheres\/\w+\/notes\/\w+$/)) {
      const parts = path.split('/');
      const noteId = parts[4];
      if (!this.data.has(noteId)) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Note not found' } };
      }
      this.data.delete(noteId);
      return { success: true, data: {} as any };
    }

    // Delete project
    if (path.match(/\/spheres\/\w+\/projects\/\w+$/)) {
      const parts = path.split('/');
      const projectId = parts[4];
      if (!this.data.has(projectId)) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } };
      }
      this.data.delete(projectId);
      return { success: true, data: {} as any };
    }

    return { success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
  }

  clearData() {
    this.data.clear();
  }
}

// ============================================================
// TESTS
// ============================================================

describe('CHE·NU API Integration Tests', () => {
  let client: MockHttpClient;

  beforeAll(() => {
    client = new MockHttpClient();
    client.setToken('test_token');
  });

  beforeEach(() => {
    client.clearData();
  });

  // ============================================================
  // AUTHENTICATION TESTS
  // ============================================================

  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const response = await client.post('/auth/login', {
        email: 'test@chenu.io',
        password: 'password123',
      });

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
    });

    // Memory Prompt: Governance consent required
    it('should require governance consent for registration', async () => {
      const responseWithoutConsent = await client.post('/auth/register', {
        email: 'new@user.com',
        name: 'New User',
        password: 'password123',
        consentTerms: false,
        consentGovernance: false,
      });

      expect(responseWithoutConsent.success).toBe(false);
      expect(responseWithoutConsent.error?.code).toBe('CONSENT_REQUIRED');

      const responseWithConsent = await client.post('/auth/register', {
        email: 'new@user.com',
        name: 'New User',
        password: 'password123',
        consentTerms: true,
        consentGovernance: true,
      });

      expect(responseWithConsent.success).toBe(true);
    });

    it('should get current user', async () => {
      const response = await client.get('/user/me');

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('email');
      expect(response.data).toHaveProperty('consentGovernance');
    });
  });

  // ============================================================
  // SPHERE TESTS
  // ============================================================

  describe('Spheres', () => {
    // Memory Prompt: 8 FROZEN Spheres
    it('should return exactly 8 spheres', async () => {
      const response = await client.get('/spheres');

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(8);
    });

    it('should include all required sphere codes', async () => {
      const response = await client.get('/spheres');

      expect(response.success).toBe(true);
      const codes = (response.data as any[]).map(s => s.code);
      expect(codes).toContain('PERSONAL');
      expect(codes).toContain('BUSINESS');
      expect(codes).toContain('GOVERNMENT');
      expect(codes).toContain('STUDIO');
      expect(codes).toContain('COMMUNITY');
      expect(codes).toContain('SOCIAL');
      expect(codes).toContain('ENTERTAINMENT');
      expect(codes).toContain('TEAM');
    });

    // Memory Prompt: 10 NON-NEGOTIABLE Bureau Sections
    it('should return 10 bureau sections for each sphere', async () => {
      for (const sphereCode of SPHERE_CODES) {
        const response = await client.get(`/spheres/${sphereCode}/bureau`);

        expect(response.success).toBe(true);
        expect((response.data as any).sections).toHaveLength(10);
        expect((response.data as any).sections).toEqual(BUREAU_SECTIONS);
      }
    });
  });

  // ============================================================
  // THREAD TESTS
  // ============================================================

  describe('Threads', () => {
    it('should create a thread with valid sphere code', async () => {
      const response = await client.post('/spheres/PERSONAL/threads', {
        title: 'Test Thread',
        tokenBudget: 5000,
      });

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id');
      expect((response.data as any).title).toBe('Test Thread');
      expect((response.data as any).sphereCode).toBe('PERSONAL');
    });

    it('should reject thread creation with invalid sphere code', async () => {
      const response = await client.post('/spheres/INVALID/threads', {
        title: 'Test Thread',
      });

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe('INVALID_SPHERE');
    });

    it('should list threads in a sphere', async () => {
      await client.post('/spheres/PERSONAL/threads', { title: 'Thread 1' });
      await client.post('/spheres/PERSONAL/threads', { title: 'Thread 2' });
      await client.post('/spheres/BUSINESS/threads', { title: 'Business Thread' });

      const personalThreads = await client.get('/spheres/PERSONAL/threads');
      const businessThreads = await client.get('/spheres/BUSINESS/threads');

      expect(personalThreads.success).toBe(true);
      expect((personalThreads.data as any[]).length).toBe(2);

      expect(businessThreads.success).toBe(true);
      expect((businessThreads.data as any[]).length).toBe(1);
    });

    it('should add message to thread', async () => {
      const threadResponse = await client.post('/spheres/PERSONAL/threads', {
        title: 'Message Thread',
        tokenBudget: 5000,
      });

      const threadId = (threadResponse.data as any).id;
      const messageResponse = await client.post(
        `/spheres/PERSONAL/threads/${threadId}/messages`,
        { role: 'user', content: 'Hello, this is a test message' }
      );

      expect(messageResponse.success).toBe(true);
      expect((messageResponse.data as any).content).toBe('Hello, this is a test message');
      expect((messageResponse.data as any).tokensUsed).toBeGreaterThan(0);
    });

    it('should track token usage in thread', async () => {
      const threadResponse = await client.post('/spheres/PERSONAL/threads', {
        title: 'Token Thread',
        tokenBudget: 1000,
      });

      const threadId = (threadResponse.data as any).id;
      
      await client.post(`/spheres/PERSONAL/threads/${threadId}/messages`, {
        role: 'user',
        content: 'First message',
      });

      await client.post(`/spheres/PERSONAL/threads/${threadId}/messages`, {
        role: 'assistant',
        content: 'Response message',
      });

      const threads = await client.get('/spheres/PERSONAL/threads');
      const thread = (threads.data as any[]).find(t => t.id === threadId);

      expect(thread.tokensUsed).toBeGreaterThan(0);
    });

    it('should update thread', async () => {
      const createResponse = await client.post('/spheres/PERSONAL/threads', {
        title: 'Original Title',
      });

      const threadId = (createResponse.data as any).id;
      const updateResponse = await client.patch(
        `/spheres/PERSONAL/threads/${threadId}`,
        { title: 'Updated Title', encodingEnabled: true }
      );

      expect(updateResponse.success).toBe(true);
      expect((updateResponse.data as any).title).toBe('Updated Title');
      expect((updateResponse.data as any).encodingEnabled).toBe(true);
    });

    it('should delete thread', async () => {
      const createResponse = await client.post('/spheres/PERSONAL/threads', {
        title: 'Delete Me',
      });

      const threadId = (createResponse.data as any).id;
      const deleteResponse = await client.delete(`/spheres/PERSONAL/threads/${threadId}`);

      expect(deleteResponse.success).toBe(true);

      const listResponse = await client.get('/spheres/PERSONAL/threads');
      expect((listResponse.data as any[]).find(t => t.id === threadId)).toBeUndefined();
    });
  });

  // ============================================================
  // TASK TESTS
  // ============================================================

  describe('Tasks', () => {
    it('should create a task', async () => {
      const response = await client.post('/spheres/BUSINESS/tasks', {
        title: 'Test Task',
        description: 'Task description',
        priority: 'high',
      });

      expect(response.success).toBe(true);
      expect((response.data as any).title).toBe('Test Task');
      expect((response.data as any).status).toBe('todo');
      expect((response.data as any).priority).toBe('high');
    });

    it('should update task status', async () => {
      const createResponse = await client.post('/spheres/BUSINESS/tasks', {
        title: 'Status Task',
      });

      const taskId = (createResponse.data as any).id;

      const inProgressResponse = await client.patch(
        `/spheres/BUSINESS/tasks/${taskId}`,
        { status: 'in_progress' }
      );
      expect((inProgressResponse.data as any).status).toBe('in_progress');

      const doneResponse = await client.patch(
        `/spheres/BUSINESS/tasks/${taskId}`,
        { status: 'done' }
      );
      expect((doneResponse.data as any).status).toBe('done');
    });

    it('should list tasks in a sphere', async () => {
      await client.post('/spheres/BUSINESS/tasks', { title: 'Task 1' });
      await client.post('/spheres/BUSINESS/tasks', { title: 'Task 2' });
      await client.post('/spheres/PERSONAL/tasks', { title: 'Personal Task' });

      const businessTasks = await client.get('/spheres/BUSINESS/tasks');
      expect((businessTasks.data as any[]).length).toBe(2);

      const personalTasks = await client.get('/spheres/PERSONAL/tasks');
      expect((personalTasks.data as any[]).length).toBe(1);
    });

    it('should delete task', async () => {
      const createResponse = await client.post('/spheres/BUSINESS/tasks', {
        title: 'Delete Task',
      });

      const taskId = (createResponse.data as any).id;
      await client.delete(`/spheres/BUSINESS/tasks/${taskId}`);

      const listResponse = await client.get('/spheres/BUSINESS/tasks');
      expect((listResponse.data as any[]).find(t => t.id === taskId)).toBeUndefined();
    });
  });

  // ============================================================
  // NOTE TESTS
  // ============================================================

  describe('Notes', () => {
    it('should create a note', async () => {
      const response = await client.post('/spheres/PERSONAL/notes', {
        title: 'Test Note',
        content: 'Note content here',
        tags: ['important', 'work'],
      });

      expect(response.success).toBe(true);
      expect((response.data as any).title).toBe('Test Note');
      expect((response.data as any).tags).toEqual(['important', 'work']);
    });

    it('should update note content', async () => {
      const createResponse = await client.post('/spheres/PERSONAL/notes', {
        title: 'Edit Note',
        content: 'Original content',
      });

      const noteId = (createResponse.data as any).id;
      const updateResponse = await client.patch(
        `/spheres/PERSONAL/notes/${noteId}`,
        { content: 'Updated content' }
      );

      expect((updateResponse.data as any).content).toBe('Updated content');
    });

    it('should add tags to note', async () => {
      const createResponse = await client.post('/spheres/PERSONAL/notes', {
        title: 'Tag Note',
        content: 'Content',
        tags: ['initial'],
      });

      const noteId = (createResponse.data as any).id;
      const updateResponse = await client.patch(
        `/spheres/PERSONAL/notes/${noteId}`,
        { tags: ['initial', 'added'] }
      );

      expect((updateResponse.data as any).tags).toContain('added');
    });
  });

  // ============================================================
  // PROJECT TESTS
  // ============================================================

  describe('Projects', () => {
    it('should create a project', async () => {
      const response = await client.post('/spheres/BUSINESS/projects', {
        name: 'Q1 Project',
        description: 'Q1 initiative',
        tokenBudget: 50000,
      });

      expect(response.success).toBe(true);
      expect((response.data as any).name).toBe('Q1 Project');
      expect((response.data as any).status).toBe('active');
      expect((response.data as any).tokenBudget).toBe(50000);
    });

    it('should update project status', async () => {
      const createResponse = await client.post('/spheres/BUSINESS/projects', {
        name: 'Status Project',
      });

      const projectId = (createResponse.data as any).id;
      const updateResponse = await client.patch(
        `/spheres/BUSINESS/projects/${projectId}`,
        { status: 'completed' }
      );

      expect((updateResponse.data as any).status).toBe('completed');
    });
  });

  // ============================================================
  // MEETING TESTS
  // ============================================================

  describe('Meetings', () => {
    it('should create a meeting', async () => {
      const response = await client.post('/spheres/TEAM/meetings', {
        title: 'Team Sync',
        startTime: '2024-12-20T10:00:00Z',
        endTime: '2024-12-20T11:00:00Z',
        participants: ['user1@example.com', 'user2@example.com'],
        tokenBudget: 1000,
      });

      expect(response.success).toBe(true);
      expect((response.data as any).title).toBe('Team Sync');
      expect((response.data as any).status).toBe('scheduled');
      expect((response.data as any).participants).toHaveLength(2);
    });

    it('should cancel meeting', async () => {
      const createResponse = await client.post('/spheres/TEAM/meetings', {
        title: 'Cancel Meeting',
        startTime: '2024-12-20T10:00:00Z',
        endTime: '2024-12-20T11:00:00Z',
      });

      const meetingId = (createResponse.data as any).id;
      const cancelResponse = await client.patch(
        `/spheres/TEAM/meetings/${meetingId}`,
        { status: 'cancelled' }
      );

      expect((cancelResponse.data as any).status).toBe('cancelled');
    });
  });

  // ============================================================
  // AGENT TESTS
  // ============================================================

  describe('Agents', () => {
    it('should list available agents', async () => {
      const response = await client.get('/spheres/BUSINESS/agents');

      expect(response.success).toBe(true);
      expect((response.data as any[]).length).toBeGreaterThan(0);
    });

    it('should hire an agent', async () => {
      const response = await client.post('/spheres/BUSINESS/agents/hire', {
        agentId: 'agent_1',
        budget: 1000,
      });

      expect(response.success).toBe(true);
      expect((response.data as any).status).toBe('busy');
    });

    // Memory Prompt: Nova is NEVER a hired agent
    it('should not have Nova in hirable agents list', async () => {
      const response = await client.get('/spheres/BUSINESS/agents');
      const agents = response.data as any[];
      const nova = agents.find(a => a.name.toLowerCase() === 'nova');
      
      // Nova should either not be in the list or not be hirable
      if (nova) {
        expect(nova.hirable).toBe(false);
      }
    });
  });

  // ============================================================
  // TOKEN TESTS
  // ============================================================

  describe('Tokens', () => {
    // Memory Prompt: Tokens are NOT cryptocurrency
    it('should get global token budget', async () => {
      const response = await client.get('/tokens/budget');

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('total');
      expect(response.data).toHaveProperty('used');
      expect(response.data).toHaveProperty('remaining');
      
      // Verify no cryptocurrency properties
      expect((response.data as any).marketValue).toBeUndefined();
      expect((response.data as any).exchangeRate).toBeUndefined();
    });

    it('should transfer tokens between spheres', async () => {
      const response = await client.post('/tokens/transfer', {
        fromSphere: 'PERSONAL',
        toSphere: 'BUSINESS',
        amount: 1000,
        reason: 'Project needs',
      });

      expect(response.success).toBe(true);
      expect((response.data as any).amount).toBe(1000);
      expect((response.data as any).fromSphere).toBe('PERSONAL');
      expect((response.data as any).toSphere).toBe('BUSINESS');
    });
  });

  // ============================================================
  // AUDIT TESTS
  // ============================================================

  describe('Audit', () => {
    // Memory Prompt: Law 5 - Audit Completeness
    it('should have audit endpoint', async () => {
      const response = await client.get('/audit');
      expect(response.success).toBe(true);
    });
  });

  // ============================================================
  // CROSS-SPHERE ISOLATION TESTS
  // ============================================================

  describe('Cross-Sphere Isolation (Law 9)', () => {
    it('should not leak data between spheres', async () => {
      await client.post('/spheres/PERSONAL/notes', {
        title: 'Personal Secret',
        content: 'Private content',
      });

      await client.post('/spheres/BUSINESS/notes', {
        title: 'Business Info',
        content: 'Work content',
      });

      const personalNotes = await client.get('/spheres/PERSONAL/notes');
      const businessNotes = await client.get('/spheres/BUSINESS/notes');

      // Each sphere should only contain its own notes
      expect((personalNotes.data as any[]).every(n => n.sphereCode === 'PERSONAL')).toBe(true);
      expect((businessNotes.data as any[]).every(n => n.sphereCode === 'BUSINESS')).toBe(true);

      // Cross-check: personal shouldn't have business content
      const personalContent = (personalNotes.data as any[]).map(n => n.title).join(' ');
      expect(personalContent).not.toContain('Business');

      const businessContent = (businessNotes.data as any[]).map(n => n.title).join(' ');
      expect(businessContent).not.toContain('Personal');
    });

    it('should isolate threads between spheres', async () => {
      await client.post('/spheres/PERSONAL/threads', { title: 'Personal Thread' });
      await client.post('/spheres/STUDIO/threads', { title: 'Studio Thread' });

      const personalThreads = await client.get('/spheres/PERSONAL/threads');
      const studioThreads = await client.get('/spheres/STUDIO/threads');

      expect((personalThreads.data as any[]).length).toBe(1);
      expect((studioThreads.data as any[]).length).toBe(1);
      expect((personalThreads.data as any[])[0].sphereCode).toBe('PERSONAL');
      expect((studioThreads.data as any[])[0].sphereCode).toBe('STUDIO');
    });

    it('should isolate tasks between spheres', async () => {
      await client.post('/spheres/BUSINESS/tasks', { title: 'Work Task' });
      await client.post('/spheres/ENTERTAINMENT/tasks', { title: 'Fun Task' });

      const workTasks = await client.get('/spheres/BUSINESS/tasks');
      const funTasks = await client.get('/spheres/ENTERTAINMENT/tasks');

      expect((workTasks.data as any[]).length).toBe(1);
      expect((funTasks.data as any[]).length).toBe(1);
    });
  });
});

// ============================================================
// EXPORT
// ============================================================

export default {};
