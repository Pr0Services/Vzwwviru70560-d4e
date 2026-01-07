/**
 * CHE·NU™ — Memory Types (Legacy Stub)
 */
export interface MemoryConfig {
  id: string;
  type: 'short' | 'long' | 'working';
  capacity: number;
}
export interface MemoryItem {
  id: string;
  content: string;
  timestamp: string;
  importance: number;
}
