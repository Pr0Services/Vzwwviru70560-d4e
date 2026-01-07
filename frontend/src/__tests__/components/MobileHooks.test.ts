/**
 * CHE·NU™ - Mobile Hooks Tests
 */
import { renderHook, act } from '@testing-library/react';
import { useMobile } from '../../hooks/useMobile';
import { useTouchGestures } from '../../hooks/useTouchGestures';
import { useOrientation } from '../../hooks/useOrientation';
import { useVirtualKeyboard } from '../../hooks/useVirtualKeyboard';

describe('useMobile', () => {
  it('detects mobile viewport', () => {
    global.innerWidth = 375;
    
    const { result } = renderHook(() => useMobile());
    
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });
  
  it('detects tablet viewport', () => {
    global.innerWidth = 800;
    
    const { result } = renderHook(() => useMobile());
    
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });
  
  it('detects desktop viewport', () => {
    global.innerWidth = 1440;
    
    const { result } = renderHook(() => useMobile());
    
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });
});

describe('useTouchGestures', () => {
  it('detects swipe right', () => {
    const onSwipeRight = jest.fn();
    renderHook(() => useTouchGestures({ onSwipeRight }));
    
    // Simulate touch events
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 0, clientY: 100 } as Touch]
    });
    const touchEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 100, clientY: 100 } as Touch]
    });
    
    document.dispatchEvent(touchStart);
    document.dispatchEvent(touchEnd);
    
    expect(onSwipeRight).toHaveBeenCalled();
  });
});

describe('useOrientation', () => {
  it('detects portrait mode', () => {
    global.innerHeight = 800;
    global.innerWidth = 375;
    
    const { result } = renderHook(() => useOrientation());
    
    expect(result.current).toBe('portrait');
  });
  
  it('detects landscape mode', () => {
    global.innerHeight = 375;
    global.innerWidth = 800;
    
    const { result } = renderHook(() => useOrientation());
    
    expect(result.current).toBe('landscape');
  });
});

describe('useVirtualKeyboard', () => {
  it('detects keyboard visibility', () => {
    const { result } = renderHook(() => useVirtualKeyboard());
    
    expect(result.current.isKeyboardVisible).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);
  });
});
