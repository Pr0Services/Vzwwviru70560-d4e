/**
 * CHE·NU™ — Tests Sphères Canoniques
 */

import {
  ALL_SPHERES,
  SPHERE_PERSONAL,
  SPHERE_TEAM,
  getSpheresByLevel,
  getSphereById
} from '../canonical/SPHERES_CANONICAL_V2';

describe('CHE·NU Spheres Canonical', () => {
  
  describe('Structure', () => {
    test('should have exactly 9 spheres (8+1)', () => {
      expect(ALL_SPHERES.length).toBe(9);
    });

    test('Personal sphere should be center (level 0)', () => {
      expect(SPHERE_PERSONAL.visual.orbitLevel).toBe(0);
      expect(SPHERE_PERSONAL.type).toBe('center');
    });

    test('Team sphere should be special (level 1)', () => {
      expect(SPHERE_TEAM.visual.orbitLevel).toBe(1);
      expect(SPHERE_TEAM.type).toBe('my_team');
    });

    test('Contextual spheres should be level 2', () => {
      const contextual = getSpheresByLevel(2);
      expect(contextual.length).toBe(7);
      contextual.forEach(sphere => {
        expect(sphere.visual.orbitLevel).toBe(2);
        expect(sphere.type).toBe('contextual');
      });
    });
  });

  describe('Hierarchy', () => {
    test('only one center sphere should exist', () => {
      const centers = ALL_SPHERES.filter(s => s.type === 'center');
      expect(centers.length).toBe(1);
      expect(centers[0].id).toBe('personal');
    });

    test('only one team sphere should exist', () => {
      const teams = ALL_SPHERES.filter(s => s.type === 'my_team');
      expect(teams.length).toBe(1);
      expect(teams[0].id).toBe('my_team');
    });
  });

  describe('getSphereById', () => {
    test('should return correct sphere', () => {
      const personal = getSphereById('personal');
      expect(personal?.id).toBe('personal');
      
      const team = getSphereById('my_team');
      expect(team?.id).toBe('my_team');
      
      const business = getSphereById('business');
      expect(business?.id).toBe('business');
    });

    test('should return undefined for invalid id', () => {
      const invalid = getSphereById('invalid_sphere' as any);
      expect(invalid).toBeUndefined();
    });
  });

  describe('Required Fields', () => {
    test('all spheres should have required fields', () => {
      ALL_SPHERES.forEach(sphere => {
        expect(sphere.id).toBeDefined();
        expect(sphere.label).toBeDefined();
        expect(sphere.labelFr).toBeDefined();
        expect(sphere.visual.color).toBeDefined();
        expect(sphere.visual.emoji).toBeDefined();
        expect(sphere.visual.orbitLevel).toBeDefined();
      });
    });
  });
});
