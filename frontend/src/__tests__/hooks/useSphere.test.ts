/**
 * CHE·NU™ - useSphere Hook Tests
 */
import { renderHook, act } from '@testing-library/react';
import { useSphere } from '../hooks/useSphere';

describe('useSphere', () => {
  it('returns active sphere', () => {
    const { result } = renderHook(() => useSphere());
    expect(result.current.activeSphere).toBeDefined();
  });
  
  it('switches sphere', () => {
    const { result } = renderHook(() => useSphere());
    
    act(() => {
      result.current.switchSphere('scholar');
    });
    
    expect(result.current.activeSphere).toBe('scholar');
  });
});
