/**
 * CHE·NU™ — Tests Memory Governance
 */

import {
  NEVER_STORED,
  MEMORY_RULES
} from '../canonical/MEMORY_POST_MEETING_CANONICAL';

describe('CHE·NU Memory Governance', () => {
  
  describe('Never Stored Content', () => {
    test('raw conversation should never be stored', () => {
      expect(NEVER_STORED).toContain('raw_conversation');
    });

    test('agent speculation should never be stored', () => {
      expect(NEVER_STORED).toContain('agent_speculation');
    });

    test('unvalidated hypotheses should never be stored', () => {
      expect(NEVER_STORED).toContain('unvalidated_hypotheses');
    });

    test('intermediate reasoning should never be stored', () => {
      expect(NEVER_STORED).toContain('intermediate_reasoning');
    });
  });

  describe('Memory Rules', () => {
    test('user validation should be required', () => {
      expect(MEMORY_RULES).toContain('USER_VALIDATION_REQUIRED');
    });

    test('no direct write should be allowed', () => {
      expect(MEMORY_RULES).toContain('NO_DIRECT_WRITE');
    });

    test('only meaning should survive', () => {
      expect(MEMORY_RULES).toContain('ONLY_MEANING_SURVIVES');
    });
  });
});
