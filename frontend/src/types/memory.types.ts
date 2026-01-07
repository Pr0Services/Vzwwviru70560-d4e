/**
 * CHE·NU — Memory Types
 */

export type MemoryType = 'stm' | 'mtm' | 'ltm' | 'semantic';

export type MemoryCategory = 
  | 'preference'
  | 'fact'
  | 'decision'
  | 'pattern'
  | 'relationship'
  | 'skill'
  | 'context'
  | 'feedback';

export interface AgentMemory {
  id: string;
  user_id: string;
  agent_id: string;
  
  type: MemoryType;
  category: MemoryCategory;
  
  content: {
    key: string;
    value: unknown;
    summary?: string;
  };
  
  context: {
    sphere?: string;
    thread_id?: string;
    project_id?: string;
    source: 'user' | 'agent' | 'system' | 'inference';
  };
  
  importance: number;
  access_count: number;
  last_accessed?: string;
  expires_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface MemorySettings {
  enabled: boolean;
  retention: {
    stm: number;  // hours
    mtm: number;  // days
    ltm: number;  // months, -1 = permanent
  };
  categories: {
    [key in MemoryCategory]: boolean;
  };
  auto_prune: boolean;
  max_memories: number;
}

export interface MemoryStats {
  total: number;
  by_type: { [key in MemoryType]: number };
  by_category: { [key in MemoryCategory]: number };
  storage_used: number;
  oldest: string;
  newest: string;
}
