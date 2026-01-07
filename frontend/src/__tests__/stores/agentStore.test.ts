/**
 * CHE·NU™ - Agent Store Tests
 */
import { renderHook, act } from '@testing-library/react';
import { useAgentStore } from '../../stores/agent.store';

describe('agentStore', () => {
  it('activates agent', () => {
    const { result } = renderHook(() => useAgentStore());
    
    act(() => {
      result.current.activateAgent('business.crm_assistant');
    });
    
    expect(result.current.activeAgents).toContain('business.crm_assistant');
  });
  
  it('deactivates agent', () => {
    const { result } = renderHook(() => useAgentStore());
    
    act(() => {
      result.current.activateAgent('business.crm_assistant');
      result.current.deactivateAgent('business.crm_assistant');
    });
    
    expect(result.current.activeAgents).not.toContain('business.crm_assistant');
  });
  
  it('tracks token consumption', () => {
    const { result } = renderHook(() => useAgentStore());
    
    act(() => {
      result.current.recordTokenUsage('business.crm_assistant', 150);
    });
    
    expect(result.current.totalTokensUsed).toBe(150);
  });
});
