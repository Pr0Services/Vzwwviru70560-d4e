/**
 * CHE·NU™ — Internal Agent Context (Legacy Stub)
 */
export interface InternalAgentContext {
  sphereId: string;
  bureauId?: string;
  userId: string;
  sessionId: string;
}
export const createInternalContext = (userId: string): InternalAgentContext => ({
  sphereId: 'personal',
  userId,
  sessionId: crypto.randomUUID(),
});
