/* =====================================================
   CHE·NU — Dimension Resolver Tests
   
   DETERMINISTIC TESTS
   Prove that same input = same output, always.
   ===================================================== */

import {
  resolveDimension,
  normalizeContext,
  resolveContent,
  resolveActivity,
  resolveComplexity,
  resolvePermission,
  resolveDepth,
} from './dimensionResolver';
import { DimensionContext, EngineConfig } from './types';

// ─────────────────────────────────────────────────────
// MOCK ENGINE CONFIG (from dimension.engine.json)
// ─────────────────────────────────────────────────────

const mockEngine: EngineConfig = {
  $schema: 'chenu://dimension-engine/v1',
  version: '1.0.0',
  resolution: {
    order: ['content', 'activity', 'complexity', 'permission'],
    mode: 'multiplicative',
  },
  content: {
    thresholds: {
      minimal: { max: 3, scale: 0.6, density: 'minimal' },
      low: { min: 3, max: 10, scale: 0.8, density: 'compact' },
      medium: { min: 10, max: 30, scale: 1.0, density: 'standard' },
      high: { min: 30, max: 100, scale: 1.3, density: 'expanded' },
      extreme: { min: 100, scale: 1.6, density: 'full' },
    },
    metrics: ['items', 'agents', 'processes', 'decisions'],
  },
  activity: {
    states: {
      dormant: { motion: 'none', visibility: 0.4, updateMs: 60000 },
      idle: { motion: 'none', visibility: 0.7, updateMs: 30000 },
      active: { motion: 'subtle', visibility: 1.0, updateMs: 5000 },
      busy: { motion: 'moderate', visibility: 1.0, updateMs: 1000 },
      critical: { motion: 'urgent', visibility: 1.0, updateMs: 500 },
    },
    transitions: {
      toIdle: 30000,
      toDormant: 300000,
      busyThreshold: 5,
      criticalTriggers: ['pendingApproval', 'error', 'deadline'],
    },
  },
  complexity: {
    levels: {
      simple: { depthAllowed: 1, density: 'minimal' },
      standard: { depthAllowed: 2, density: 'standard' },
      advanced: { depthAllowed: 3, density: 'expanded' },
      expert: { depthAllowed: 4, density: 'full' },
    },
  },
  permission: {
    levels: {
      none: { visible: false, interactable: false, visibility: 0 },
      glimpse: { visible: true, interactable: false, visibility: 0.3 },
      view: { visible: true, interactable: false, visibility: 0.7 },
      read: { visible: true, interactable: true, visibility: 1.0 },
      write: { visible: true, interactable: true, visibility: 1.0 },
      admin: { visible: true, interactable: true, visibility: 1.0 },
    },
  },
  depth: {
    maxLevels: 4,
    scaleFactor: 0.85,
    visibilityFactor: 0.9,
  },
  motion: {
    types: {
      none: { animation: null, intensity: 0 },
      subtle: { animation: 'breathe', intensity: 0.3 },
      moderate: { animation: 'pulse', intensity: 0.6 },
      urgent: { animation: 'alert', intensity: 1.0 },
    },
  },
  density: {
    types: {
      minimal: { spacing: 0.5, details: 1 },
      compact: { spacing: 0.75, details: 2 },
      standard: { spacing: 1.0, details: 3 },
      expanded: { spacing: 1.25, details: 4 },
      full: { spacing: 1.5, details: 5 },
    },
  },
};

// ─────────────────────────────────────────────────────
// TEST UTILITIES
// ─────────────────────────────────────────────────────

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`ASSERTION FAILED: ${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
  }
}

function assertClose(actual: number, expected: number, tolerance: number, message: string): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`ASSERTION FAILED: ${message}\n  Expected: ~${expected}\n  Actual: ${actual}`);
  }
}

// ─────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────

export function runTests(): void {
  logger.debug('🧪 Running Dimension Resolver Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  const tests = [
    testNormalizeContext,
    testContentResolutionMinimal,
    testContentResolutionMedium,
    testContentResolutionExtreme,
    testActivityResolutionActive,
    testActivityResolutionIdle,
    testActivityResolutionCritical,
    testPermissionResolutionNone,
    testPermissionResolutionRead,
    testDepthResolution,
    testFullResolutionDeterminism,
    testFullResolutionWithSphere,
  ];
  
  for (const test of tests) {
    try {
      test();
      logger.debug(`  ✅ ${test.name}`);
      passed++;
    } catch (e) {
      logger.error(`  ❌ ${test.name}`);
      logger.error(`     ${(e as Error).message}`);
      failed++;
    }
  }
  
  logger.debug(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────
// INDIVIDUAL TESTS
// ─────────────────────────────────────────────────────

function testNormalizeContext(): void {
  const partial: DimensionContext = { depth: 2 };
  const normalized = normalizeContext(partial);
  
  assertEqual(normalized.depth, 2, 'Depth should be preserved');
  assertEqual(normalized.complexity, 'standard', 'Complexity should default to standard');
  assertEqual(normalized.permission, 'read', 'Permission should default to read');
  assertEqual(normalized.content.items, 0, 'Content items should default to 0');
}

function testContentResolutionMinimal(): void {
  const content = { items: 1, agents: 0, processes: 0, decisions: 0 };
  const result = resolveContent(content, mockEngine.content);
  
  assertEqual(result.level, 'minimal', 'Level should be minimal for 1 item');
  assertEqual(result.scale, 0.6, 'Scale should be 0.6 for minimal');
  assertEqual(result.density, 'minimal', 'Density should be minimal');
}

function testContentResolutionMedium(): void {
  const content = { items: 15, agents: 5, processes: 2, decisions: 0 };
  const result = resolveContent(content, mockEngine.content);
  
  assertEqual(result.level, 'medium', 'Level should be medium for 22 items');
  assertEqual(result.scale, 1.0, 'Scale should be 1.0 for medium');
}

function testContentResolutionExtreme(): void {
  const content = { items: 50, agents: 30, processes: 20, decisions: 10 };
  const result = resolveContent(content, mockEngine.content);
  
  assertEqual(result.level, 'extreme', 'Level should be extreme for 110 items');
  assertEqual(result.scale, 1.6, 'Scale should be 1.6 for extreme');
}

function testActivityResolutionActive(): void {
  const activity = { lastInteractionMs: 5000, actionsPerMinute: 2, triggers: [] };
  const result = resolveActivity(activity, mockEngine.activity);
  
  assertEqual(result.state, 'active', 'State should be active for recent interaction');
  assertEqual(result.motionType, 'subtle', 'Motion should be subtle for active');
  assertEqual(result.visibility, 1.0, 'Visibility should be 1.0 for active');
}

function testActivityResolutionIdle(): void {
  const activity = { lastInteractionMs: 60000, actionsPerMinute: 0, triggers: [] };
  const result = resolveActivity(activity, mockEngine.activity);
  
  assertEqual(result.state, 'idle', 'State should be idle after 60s');
  assertEqual(result.motionType, 'none', 'Motion should be none for idle');
  assertEqual(result.visibility, 0.7, 'Visibility should be 0.7 for idle');
}

function testActivityResolutionCritical(): void {
  const activity = { lastInteractionMs: 5000, actionsPerMinute: 2, triggers: ['deadline'] };
  const result = resolveActivity(activity, mockEngine.activity);
  
  assertEqual(result.state, 'critical', 'State should be critical with deadline trigger');
  assertEqual(result.motionType, 'urgent', 'Motion should be urgent for critical');
}

function testPermissionResolutionNone(): void {
  const result = resolvePermission('none', mockEngine.permission);
  
  assertEqual(result.visible, false, 'Should not be visible with no permission');
  assertEqual(result.interactable, false, 'Should not be interactable');
  assertEqual(result.visibility, 0, 'Visibility should be 0');
}

function testPermissionResolutionRead(): void {
  const result = resolvePermission('read', mockEngine.permission);
  
  assertEqual(result.visible, true, 'Should be visible with read permission');
  assertEqual(result.interactable, true, 'Should be interactable');
  assertEqual(result.visibility, 1.0, 'Visibility should be 1.0');
}

function testDepthResolution(): void {
  const result0 = resolveDepth(0, mockEngine.depth);
  const result2 = resolveDepth(2, mockEngine.depth);
  
  assertEqual(result0.scaleFactor, 1.0, 'Scale factor at depth 0 should be 1.0');
  assertClose(result2.scaleFactor, 0.7225, 0.001, 'Scale factor at depth 2 should be ~0.7225');
  assertClose(result2.visibilityFactor, 0.81, 0.001, 'Visibility factor at depth 2 should be ~0.81');
}

function testFullResolutionDeterminism(): void {
  const context: DimensionContext = {
    content: { items: 20, agents: 5, processes: 3, decisions: 2 },
    activity: { lastInteractionMs: 10000, actionsPerMinute: 3, triggers: [] },
    complexity: 'advanced',
    permission: 'write',
    depth: 1,
  };
  
  // Run twice — must produce identical results
  const result1 = resolveDimension(context, mockEngine);
  const result2 = resolveDimension(context, mockEngine);
  
  assertEqual(result1.scale, result2.scale, 'Scale must be deterministic');
  assertEqual(result1.visibility, result2.visibility, 'Visibility must be deterministic');
  assertEqual(result1.activityState, result2.activityState, 'Activity state must be deterministic');
  assertEqual(result1.contentLevel, result2.contentLevel, 'Content level must be deterministic');
  assertEqual(result1.depthAllowed, result2.depthAllowed, 'Depth allowed must be deterministic');
}

function testFullResolutionWithSphere(): void {
  const context: DimensionContext = {
    content: { items: 5, agents: 2, processes: 1, decisions: 0 },
    activity: { lastInteractionMs: 5000, actionsPerMinute: 1, triggers: [] },
    complexity: 'standard',
    permission: 'read',
    depth: 0,
  };
  
  const sphere = {
    id: 'test',
    name: 'Test Sphere',
    type: 'test',
    visual: {} as any,
    layout: {} as any,
    priority: [],
    permissions: {},
    behavior: {} as any,
    rules: {
      sizeByContent: false,  // Disable size by content
      motionByActivity: true,
      visibilityByPermission: true,
    },
  };
  
  const resultWithoutSphere = resolveDimension(context, mockEngine);
  const resultWithSphere = resolveDimension(context, mockEngine, sphere);
  
  // With sizeByContent disabled, scale should ignore content
  assert(resultWithSphere.scale !== resultWithoutSphere.scale, 
    'Scale should differ when sizeByContent is disabled');
}

// ─────────────────────────────────────────────────────
// RUN TESTS IF EXECUTED DIRECTLY
// ─────────────────────────────────────────────────────

// Uncomment to run tests:
// runTests();

export default runTests;
