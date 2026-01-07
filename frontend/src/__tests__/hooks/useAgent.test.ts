/**
 * CHE·NU™ - useAgent Hook Tests
 */
import { renderHook, act } from '@testing-library/react';
import { useAgent } from '../hooks/useAgent';

describe('useAgent', () => {
  it('executes agent capability', async () => {
    const { result } = renderHook(() => useAgent('business.crm_assistant'));
    
    let executionResult: unknown;
    await act(async () => {
      executionResult = await result.current.execute('create_contact', { name: 'Test' });
    });
    
    expect(executionResult).toBeDefined();
  });
  
  it('enforces governance', async () => {
    const { result } = renderHook(() => useAgent('business.crm_assistant'));
    
    // Mock no budget
    result.current.budget = 0;
    
    await expect(
      result.current.execute('create_contact', {}, { checkBudget: true })
    ).rejects.toThrow();
  });
});
