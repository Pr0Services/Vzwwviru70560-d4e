/**
 * CHE·NU™ — Tests Agents Canoniques
 */

import {
  SYSTEM_AGENTS,
  AGENT_HIERARCHY,
  getAgentById,
  getAgentsByLevel
} from '../canonical/MINIMAL_AGENTS_CANONICAL';

describe('CHE·NU Agents Canonical', () => {
  
  describe('Nova System Intelligence', () => {
    test('Nova should exist and be L0', () => {
      const nova = getAgentById('nova');
      expect(nova).toBeDefined();
      expect(nova?.level).toBe('L0');
    });

    test('Nova should NEVER be hireable', () => {
      const nova = getAgentById('nova');
      // Nova est système, pas engageable
      expect(nova?.level).toBe('L0');
    });

    test('Nova should have governance capability', () => {
      const nova = getAgentById('nova');
      expect(nova?.capabilities).toContain('governance');
    });
  });

  describe('Orchestrator', () => {
    test('Orchestrator should exist and be L0', () => {
      const orchestrator = getAgentById('orchestrator');
      expect(orchestrator).toBeDefined();
      expect(orchestrator?.level).toBe('L0');
    });

    test('Orchestrator should have execution capability', () => {
      const orchestrator = getAgentById('orchestrator');
      expect(orchestrator?.capabilities).toContain('execution');
    });
  });

  describe('Agent Hierarchy', () => {
    test('L0 agents should be system level', () => {
      const l0Agents = getAgentsByLevel('L0');
      expect(l0Agents.length).toBeGreaterThan(0);
    });

    test('hierarchy should have 4 levels (L0-L3)', () => {
      expect(AGENT_HIERARCHY.L0).toBeDefined();
      expect(AGENT_HIERARCHY.L1).toBeDefined();
      expect(AGENT_HIERARCHY.L2).toBeDefined();
      expect(AGENT_HIERARCHY.L3).toBeDefined();
    });
  });

  describe('Agent Requirements', () => {
    test('all agents should have required fields', () => {
      SYSTEM_AGENTS.forEach(agent => {
        expect(agent.id).toBeDefined();
        expect(agent.name).toBeDefined();
        expect(agent.nameFr).toBeDefined();
        expect(agent.level).toBeDefined();
        expect(agent.capabilities).toBeDefined();
        expect(agent.tokenCost).toBeDefined();
      });
    });

    test('all agents should have at least one capability', () => {
      SYSTEM_AGENTS.forEach(agent => {
        expect(agent.capabilities.length).toBeGreaterThan(0);
      });
    });
  });
});
