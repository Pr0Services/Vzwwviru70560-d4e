/**
 * CHE·NU™ — Tool Types (Legacy Stub)
 */
export interface ToolConfig {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
}
export interface ToolInstance {
  toolId: string;
  config: Record<string, unknown>;
}
