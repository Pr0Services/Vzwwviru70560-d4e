/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — MOCK API
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Mock API pour développement
export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string) => {
      // Simule un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (email && password) {
        return {
          success: true,
          user: {
            id: 'user-1',
            email,
            username: email.split('@')[0],
            displayName: email.split('@')[0],
            created_at: new Date().toISOString(),
          },
          token: 'mock-jwt-token-' + Date.now()
        };
      }
      throw new Error('Invalid credentials');
    },
    
    logout: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { success: true };
    },
    
    me: async () => {
      return {
        id: 'user-1',
        email: 'jo@chenu.dev',
        username: 'Jo',
        displayName: 'Jo',
        created_at: new Date().toISOString(),
      };
    }
  },

  // Threads
  threads: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    },
    
    create: async (data: any) => {
      return { id: 'thread-' + Date.now(), ...data };
    },
    
    get: async (id: string) => {
      return { id, title: 'Mock Thread', messages: [] };
    }
  },

  // Agents
  agents: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    }
  },

  // Spheres
  spheres: {
    list: async () => {
      return [
        { id: 'personnel', name: 'Personnel', color: '#8BCDFF' },
        { id: 'entreprises', name: 'Entreprises', color: '#FFD966' },
        { id: 'gouvernement', name: 'Gouvernement', color: '#D08FFF' },
        { id: 'creative_studio', name: 'Creative Studio', color: '#FF8BAA' },
        { id: 'skills_tools', name: 'Skills & Tools', color: '#59D0C6' },
        { id: 'entertainment', name: 'Entertainment', color: '#FFB04D' },
        { id: 'community', name: 'Community', color: '#22C55E' },
        { id: 'social_media', name: 'Social & Media', color: '#66D06F' },
        { id: 'ia_labs', name: 'IA Labs', color: '#FF5FFF' },
      ];
    }
  },

  // Generic request handler
  request: async (endpoint: string, options?: any) => {
    console.log(`[Mock API] ${options?.method || 'GET'} ${endpoint}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true, data: null };
  }
};

export default api;