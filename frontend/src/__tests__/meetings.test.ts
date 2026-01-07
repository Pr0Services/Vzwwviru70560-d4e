/**
 * CHE·NU™ — Tests Meetings Canoniques
 */

import {
  MEETING_TYPES,
  MEETING_FLOW,
  MeetingType
} from '../canonical/MEETING_TYPES_CANONICAL';

describe('CHE·NU Meetings Canonical', () => {
  
  describe('Meeting Types', () => {
    test('should have exactly 4 meeting types', () => {
      const types = Object.keys(MEETING_TYPES);
      expect(types.length).toBe(4);
      expect(types).toContain('reflection');
      expect(types).toContain('team_alignment');
      expect(types).toContain('decision');
      expect(types).toContain('review_audit');
    });
  });

  describe('Meeting Flow Rules', () => {
    test('meeting should NEVER execute directly', () => {
      expect(MEETING_FLOW.rules).toContain('MEETINGS_NEVER_EXECUTE');
    });

    test('meeting should ALWAYS propose', () => {
      expect(MEETING_FLOW.rules).toContain('MEETINGS_ALWAYS_PROPOSE');
    });

    test('user validation should be required', () => {
      expect(MEETING_FLOW.rules).toContain('USER_VALIDATION_REQUIRED');
    });
  });

  describe('Meeting Type Structure', () => {
    const meetingTypes: MeetingType[] = ['reflection', 'team_alignment', 'decision', 'review_audit'];

    test('all meeting types should have required fields', () => {
      meetingTypes.forEach(type => {
        const config = MEETING_TYPES[type];
        expect(config.name.en).toBeDefined();
        expect(config.name.fr).toBeDefined();
        expect(config.purpose).toBeDefined();
        expect(config.requiredAgents).toBeDefined();
        expect(config.requiredAgents.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Governance', () => {
    test('meetings should produce proposals not decisions', () => {
      // Vérifier que le flow indique que les meetings produisent des propositions
      expect(MEETING_FLOW.output).toBe('proposals');
    });
  });
});
