// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — SPHERE STORE TESTS
// Sprint 1 - Tâche 3: 12 tests pour sphereStore
// Architecture: 9 Sphères + 6 Sections Bureau
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useSphereStore } from '../sphere.store';

// Reset store before each test
beforeEach(() => {
  // Clear localStorage mock
  localStorage.clear();
  
  // Reset store to initial state
  act(() => {
    useSphereStore.getState().reset();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE TESTS (9 Sphères, 6 Sections)
// ═══════════════════════════════════════════════════════════════════════════════

describe('CHE·NU Architecture Compliance', () => {
  it('should have exactly 9 spheres unlocked by default', () => {
    const state = useSphereStore.getState();
    expect(state.unlockedSpheres.size).toBe(9);
  });

  it('should include all 9 required sphere codes', () => {
    const state = useSphereStore.getState();
    const requiredSpheres = [
      'personal', 'business', 'government', 'design_studio', 
      'community', 'social', 'entertainment', 'my_team', 'scholar'
    ];
    
    requiredSpheres.forEach(sphere => {
      expect(state.unlockedSpheres.has(sphere as any)).toBe(true);
    });
  });

  it('should include Scholar as 9th sphere', () => {
    const state = useSphereStore.getState();
    expect(state.unlockedSpheres.has('scholar')).toBe(true);
  });

  it('should default to personal sphere', () => {
    const state = useSphereStore.getState();
    expect(state.currentSphere).toBe('personal');
  });

  it('should default to quick_capture section', () => {
    const state = useSphereStore.getState();
    expect(state.currentSection).toBe('quick_capture');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Navigation', () => {
  it('should navigate to a different sphere', () => {
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSphere).toBe('business');
  });

  it('should reset section to quick_capture when changing sphere', () => {
    // First set a different section
    act(() => {
      useSphereStore.getState().setCurrentSection('threads');
    });
    
    // Then change sphere
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSection).toBe('quick_capture');
  });

  it('should track previous sphere on navigation', () => {
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    
    const state = useSphereStore.getState();
    expect(state.previousSphere).toBe('personal');
  });

  it('should navigate to Scholar sphere', () => {
    act(() => {
      useSphereStore.getState().setCurrentSphere('scholar');
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSphere).toBe('scholar');
  });

  it('should not navigate to same sphere', () => {
    const initialHistory = useSphereStore.getState().navigationHistory.length;
    
    act(() => {
      useSphereStore.getState().setCurrentSphere('personal'); // Already on personal
    });
    
    const state = useSphereStore.getState();
    expect(state.navigationHistory.length).toBe(initialHistory);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION NAVIGATION TESTS (6 Sections)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Bureau Section Navigation', () => {
  it('should navigate to threads section', () => {
    act(() => {
      useSphereStore.getState().setCurrentSection('threads');
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSection).toBe('threads');
  });

  it('should navigate to all 6 bureau sections', () => {
    const sections = [
      'quick_capture', 'resume_workspace', 'threads',
      'data_files', 'active_agents', 'meetings'
    ] as const;
    
    sections.forEach(section => {
      act(() => {
        useSphereStore.getState().setCurrentSection(section);
      });
      expect(useSphereStore.getState().currentSection).toBe(section);
    });
  });

  it('should track previous section on navigation', () => {
    act(() => {
      useSphereStore.getState().setCurrentSection('threads');
    });
    act(() => {
      useSphereStore.getState().setCurrentSection('meetings');
    });
    
    const state = useSphereStore.getState();
    expect(state.previousSection).toBe('threads');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION HISTORY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Navigation History', () => {
  it('should add entries to navigation history', () => {
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    
    const state = useSphereStore.getState();
    expect(state.navigationHistory.length).toBeGreaterThan(0);
  });

  it('should record sphere and section in history', () => {
    act(() => {
      useSphereStore.getState().navigateTo('creative', 'meetings');
    });
    
    const state = useSphereStore.getState();
    const lastEntry = state.navigationHistory[state.navigationHistory.length - 1];
    
    expect(lastEntry.sphere).toBe('creative');
    expect(lastEntry.section).toBe('meetings');
  });

  it('should record timestamp in history', () => {
    const beforeTime = Date.now();
    
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    
    const afterTime = Date.now();
    const state = useSphereStore.getState();
    const lastEntry = state.navigationHistory[state.navigationHistory.length - 1];
    
    expect(lastEntry.timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(lastEntry.timestamp).toBeLessThanOrEqual(afterTime);
  });

  it('should limit history to 50 entries', () => {
    // Navigate more than 50 times
    for (let i = 0; i < 60; i++) {
      act(() => {
        useSphereStore.getState().setCurrentSection(
          i % 2 === 0 ? 'threads' : 'meetings'
        );
      });
    }
    
    const state = useSphereStore.getState();
    expect(state.navigationHistory.length).toBeLessThanOrEqual(50);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GO BACK NAVIGATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Go Back Navigation', () => {
  it('should go back to previous sphere', () => {
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    act(() => {
      useSphereStore.getState().goBack();
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSphere).toBe('personal');
  });

  it('should go back to previous section', () => {
    act(() => {
      useSphereStore.getState().setCurrentSection('threads');
    });
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    act(() => {
      useSphereStore.getState().goBack();
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSection).toBe('threads');
  });

  it('should not go back if no previous sphere', () => {
    const initialSphere = useSphereStore.getState().currentSphere;
    
    act(() => {
      useSphereStore.getState().goBack();
    });
    
    expect(useSphereStore.getState().currentSphere).toBe(initialSphere);
  });

  it('should clear previous state after going back', () => {
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    act(() => {
      useSphereStore.getState().goBack();
    });
    
    const state = useSphereStore.getState();
    expect(state.previousSphere).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE LOCK/UNLOCK TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Lock/Unlock', () => {
  it('should lock a sphere', () => {
    act(() => {
      useSphereStore.getState().lockSphere('entertainment');
    });
    
    const state = useSphereStore.getState();
    expect(state.unlockedSpheres.has('entertainment')).toBe(false);
  });

  it('should not allow locking personal sphere', () => {
    act(() => {
      useSphereStore.getState().lockSphere('personal');
    });
    
    const state = useSphereStore.getState();
    expect(state.unlockedSpheres.has('personal')).toBe(true);
  });

  it('should unlock a locked sphere', () => {
    act(() => {
      useSphereStore.getState().lockSphere('entertainment');
    });
    act(() => {
      useSphereStore.getState().unlockSphere('entertainment');
    });
    
    const state = useSphereStore.getState();
    expect(state.unlockedSpheres.has('entertainment')).toBe(true);
  });

  it('should not navigate to locked sphere', () => {
    act(() => {
      useSphereStore.getState().lockSphere('business');
    });
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSphere).toBe('personal'); // Should remain unchanged
  });

  it('should check if sphere is unlocked', () => {
    expect(useSphereStore.getState().isSphereUnlocked('personal')).toBe(true);
    
    act(() => {
      useSphereStore.getState().lockSphere('business');
    });
    
    expect(useSphereStore.getState().isSphereUnlocked('business')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// UI STATE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('UI State', () => {
  it('should toggle sidebar', () => {
    const initialState = useSphereStore.getState().sidebarCollapsed;
    
    act(() => {
      useSphereStore.getState().toggleSidebar();
    });
    
    expect(useSphereStore.getState().sidebarCollapsed).toBe(!initialState);
  });

  it('should toggle Nova', () => {
    const initialState = useSphereStore.getState().novaOpen;
    
    act(() => {
      useSphereStore.getState().toggleNova();
    });
    
    expect(useSphereStore.getState().novaOpen).toBe(!initialState);
  });

  it('should toggle XR Mode', () => {
    const initialState = useSphereStore.getState().xrModeActive;
    
    act(() => {
      useSphereStore.getState().toggleXRMode();
    });
    
    expect(useSphereStore.getState().xrModeActive).toBe(!initialState);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// RESET TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Store Reset', () => {
  it('should reset to initial state', () => {
    // Make some changes
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
      useSphereStore.getState().setCurrentSection('meetings');
      useSphereStore.getState().toggleSidebar();
      useSphereStore.getState().lockSphere('entertainment');
    });
    
    // Reset
    act(() => {
      useSphereStore.getState().reset();
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSphere).toBe('personal');
    expect(state.currentSection).toBe('quick_capture');
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.unlockedSpheres.size).toBe(9);
  });

  it('should clear navigation history on reset', () => {
    act(() => {
      useSphereStore.getState().setCurrentSphere('business');
      useSphereStore.getState().setCurrentSphere('creative');
    });
    
    act(() => {
      useSphereStore.getState().reset();
    });
    
    expect(useSphereStore.getState().navigationHistory.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATE TO TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('NavigateTo Function', () => {
  it('should navigate to sphere and section simultaneously', () => {
    act(() => {
      useSphereStore.getState().navigateTo('scholars', 'data_files');
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSphere).toBe('scholar');
    expect(state.currentSection).toBe('data_files');
  });

  it('should default to quick_capture section if not specified', () => {
    act(() => {
      useSphereStore.getState().navigateTo('business');
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSection).toBe('quick_capture');
  });

  it('should not navigate to locked sphere via navigateTo', () => {
    act(() => {
      useSphereStore.getState().lockSphere('creative');
    });
    act(() => {
      useSphereStore.getState().navigateTo('creative', 'threads');
    });
    
    const state = useSphereStore.getState();
    expect(state.currentSphere).toBe('personal');
  });
});
