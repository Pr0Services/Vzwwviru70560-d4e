/**
 * CHE·NU™ - Sphere Store Tests
 */
import { renderHook, act } from '@testing-library/react';
import { useSphereStore } from '../../stores/sphere.store';

describe('sphereStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useSphereStore());
    act(() => {
      result.current.reset();
    });
  });
  
  it('initializes with no active sphere', () => {
    const { result } = renderHook(() => useSphereStore());
    expect(result.current.activeSphere).toBeNull();
  });
  
  it('sets active sphere', () => {
    const { result } = renderHook(() => useSphereStore());
    
    act(() => {
      result.current.setActiveSphere('business');
    });
    
    expect(result.current.activeSphere).toBe('business');
  });
  
  it('all 9 spheres are available', () => {
    const { result } = renderHook(() => useSphereStore());
    const spheres = result.current.availableSpheres;
    
    expect(spheres).toHaveLength(9);
    expect(spheres).toContain('personal');
    expect(spheres).toContain('business');
    expect(spheres).toContain('government');
    expect(spheres).toContain('studio');
    expect(spheres).toContain('community');
    expect(spheres).toContain('social');
    expect(spheres).toContain('entertainment');
    expect(spheres).toContain('my_team');
    expect(spheres).toContain('scholar');
  });
  
  it('tracks recent spheres', () => {
    const { result } = renderHook(() => useSphereStore());
    
    act(() => {
      result.current.setActiveSphere('business');
      result.current.setActiveSphere('scholar');
      result.current.setActiveSphere('personal');
    });
    
    expect(result.current.recentSpheres).toEqual(['personal', 'scholars', 'business']);
  });
});
