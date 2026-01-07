// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — CACHE SYSTEM TESTS
// Sprint 10 (FINAL): Cache and memoization tests
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number;
  private defaultTTL: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxSize: number = 1000, defaultTTL: number = 60000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl: number = this.defaultTTL): void {
    // Evict if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return undefined;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }

    entry.hits++;
    this.hits++;
    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE CACHE
// ═══════════════════════════════════════════════════════════════════════════════

class SphereCache {
  private cache: Cache<any>;

  constructor() {
    this.cache = new Cache(9, 300000); // 9 spheres, 5 min TTL
  }

  getSphere(id: string): unknown {
    return this.cache.get(`sphere:${id}`);
  }

  setSphere(id: string, data: unknown): void {
    this.cache.set(`sphere:${id}`, data);
  }

  invalidate(id: string): void {
    this.cache.delete(`sphere:${id}`);
  }

  getStats(): CacheStats {
    return this.cache.getStats();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BASIC CACHE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Basic Cache Operations', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache(100, 60000);
  });

  it('should set and get values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return undefined for missing keys', () => {
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  it('should check if key exists', () => {
    cache.set('key1', 'value1');
    expect(cache.has('key1')).toBe(true);
    expect(cache.has('nonexistent')).toBe(false);
  });

  it('should delete keys', () => {
    cache.set('key1', 'value1');
    cache.delete('key1');
    expect(cache.has('key1')).toBe(false);
  });

  it('should clear all entries', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();
    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE TTL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Cache TTL', () => {
  it('should expire entries after TTL', async () => {
    const cache = new Cache<string>(100, 50); // 50ms TTL
    
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 60));
    
    expect(cache.get('key1')).toBeUndefined();
  });

  it('should allow custom TTL per entry', async () => {
    const cache = new Cache<string>(100, 10000); // Default 10s
    
    cache.set('short', 'value', 50);   // 50ms
    cache.set('long', 'value', 10000); // 10s
    
    await new Promise(resolve => setTimeout(resolve, 60));
    
    expect(cache.get('short')).toBeUndefined();
    expect(cache.get('long')).toBe('value');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE EVICTION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Cache Eviction', () => {
  it('should evict oldest entry when at capacity', () => {
    const cache = new Cache<string>(3, 60000);
    
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    
    // This should evict key1 (oldest)
    cache.set('key4', 'value4');
    
    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key4')).toBe(true);
  });

  it('should not evict when updating existing key', () => {
    const cache = new Cache<string>(3, 60000);
    
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    
    // Update existing key
    cache.set('key1', 'updated');
    
    expect(cache.has('key1')).toBe(true);
    expect(cache.has('key2')).toBe(true);
    expect(cache.has('key3')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE STATS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Cache Statistics', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache(100, 60000);
  });

  it('should track hits', () => {
    cache.set('key1', 'value1');
    cache.get('key1');
    cache.get('key1');
    
    const stats = cache.getStats();
    expect(stats.hits).toBe(2);
  });

  it('should track misses', () => {
    cache.get('nonexistent1');
    cache.get('nonexistent2');
    
    const stats = cache.getStats();
    expect(stats.misses).toBe(2);
  });

  it('should calculate hit rate', () => {
    cache.set('key1', 'value1');
    cache.get('key1');      // hit
    cache.get('key1');      // hit
    cache.get('nonexistent'); // miss
    
    const stats = cache.getStats();
    expect(stats.hitRate).toBeCloseTo(0.666, 2);
  });

  it('should track size', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    const stats = cache.getStats();
    expect(stats.size).toBe(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE CACHE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Cache', () => {
  let sphereCache: SphereCache;

  beforeEach(() => {
    sphereCache = new SphereCache();
  });

  it('should cache sphere data', () => {
    const sphereData = { id: 'personal', name: 'Personal' };
    
    sphereCache.setSphere('personal', sphereData);
    
    expect(sphereCache.getSphere('personal')).toEqual(sphereData);
  });

  it('should cache all 9 spheres', () => {
    const spheres = [
      'personal', 'business', 'government', 'creative',
      'community', 'social', 'entertainment', 'my_team', 'scholar'
    ];
    
    spheres.forEach(id => {
      sphereCache.setSphere(id, { id, name: id });
    });
    
    spheres.forEach(id => {
      expect(sphereCache.getSphere(id)).toBeDefined();
    });
  });

  it('should invalidate sphere cache', () => {
    sphereCache.setSphere('personal', { id: 'personal' });
    sphereCache.invalidate('personal');
    
    expect(sphereCache.getSphere('personal')).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMOIZATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memoization', () => {
  it('should memoize expensive computations', () => {
    const cache = new Cache<number>(100, 60000);
    let computeCount = 0;
    
    function expensiveComputation(n: number): number {
      computeCount++;
      return n * n;
    }
    
    function memoizedCompute(n: number): number {
      const key = `compute:${n}`;
      let result = cache.get(key);
      
      if (result === undefined) {
        result = expensiveComputation(n);
        cache.set(key, result);
      }
      
      return result;
    }
    
    // First call - computes
    memoizedCompute(5);
    expect(computeCount).toBe(1);
    
    // Second call - cached
    memoizedCompute(5);
    expect(computeCount).toBe(1);
    
    // Different input - computes
    memoizedCompute(10);
    expect(computeCount).toBe(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT CACHE COMPLIANCE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt Cache Compliance', () => {
  it('should cache all 9 spheres efficiently', () => {
    const cache = new SphereCache();
    
    const spheres = [
      'personal', 'business', 'government', 'creative',
      'community', 'social', 'entertainment', 'my_team', 'scholar'
    ];
    
    // Cache all spheres
    spheres.forEach(id => {
      cache.setSphere(id, { id });
    });
    
    // All should be retrievable
    let hits = 0;
    spheres.forEach(id => {
      if (cache.getSphere(id)) hits++;
    });
    
    expect(hits).toBe(9);
  });

  it('should include Scholar in cache', () => {
    const cache = new SphereCache();
    
    cache.setSphere('scholars', { id: 'scholars', name: 'Scholar' });
    
    const scholar = cache.getSphere('scholar');
    expect(scholar).toBeDefined();
    expect(scholar.id).toBe('scholar');
  });

  it('should have good hit rate for repeated access', () => {
    const cache = new Cache<any>(100, 60000);
    
    // Simulate typical usage
    for (let i = 0; i < 100; i++) {
      const sphereId = ['personal', 'business', 'scholar'][i % 3];
      
      if (!cache.has(`sphere:${sphereId}`)) {
        cache.set(`sphere:${sphereId}`, { id: sphereId });
      }
      cache.get(`sphere:${sphereId}`);
    }
    
    const stats = cache.getStats();
    // Should have > 95% hit rate after warmup
    expect(stats.hitRate).toBeGreaterThan(0.95);
  });
});
