/**
 * CHE·NU™ - useThread Hook Tests
 */
import { renderHook, act } from '@testing-library/react';
import { useThread } from '../hooks/useThread';

describe('useThread', () => {
  it('creates thread', () => {
    const { result } = renderHook(() => useThread());
    
    let threadId: string;
    act(() => {
      threadId = result.current.create({ title: 'Test' });
    });
    
    expect(threadId).toBeDefined();
  });
  
  it('manages budget', () => {
    const { result } = renderHook(() => useThread('test-thread-id'));
    expect(result.current.budget).toBeDefined();
    expect(result.current.budgetUsed).toBeDefined();
  });
});
