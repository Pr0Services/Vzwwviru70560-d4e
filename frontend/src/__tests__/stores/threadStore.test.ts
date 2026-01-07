/**
 * CHE·NU™ - Thread Store Tests
 */
import { renderHook, act } from '@testing-library/react';
import { useThreadStore } from '../../stores/thread.store';

describe('threadStore', () => {
  it('creates a new thread', () => {
    const { result } = renderHook(() => useThreadStore());
    
    act(() => {
      result.current.createThread({
        title: 'Test Thread',
        content: 'Thread content',
        sphereId: 'business'
      });
    });
    
    expect(result.current.threads).toHaveLength(1);
    expect(result.current.threads[0].title).toBe('Test Thread');
  });
  
  it('updates thread', () => {
    const { result } = renderHook(() => useThreadStore());
    
    let threadId: string;
    act(() => {
      threadId = result.current.createThread({
        title: 'Original',
        content: 'Content'
      });
    });
    
    act(() => {
      result.current.updateThread(threadId, { title: 'Updated' });
    });
    
    const thread = result.current.threads.find(t => t.id === threadId);
    expect(thread?.title).toBe('Updated');
  });
  
  it('tracks budget per thread', () => {
    const { result } = renderHook(() => useThreadStore());
    
    let threadId: string;
    act(() => {
      threadId = result.current.createThread({
        title: 'Test',
        budget: 100
      });
    });
    
    const thread = result.current.threads.find(t => t.id === threadId);
    expect(thread?.budget).toBe(100);
    expect(thread?.budgetUsed).toBe(0);
  });
});
