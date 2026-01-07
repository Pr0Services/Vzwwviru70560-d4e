/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — TEAM HOOK
 * Phase 7: Collaboration & Team Features
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';

export interface Team {
  team_id: string;
  name: string;
  description: string;
  owner_id: string;
  members: TeamMember[];
  max_members: number;
  shared_threads: string[];
  team_agents: string[];
  total_token_budget: number;
  tokens_spent: number;
}

export interface TeamMember {
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joined_at: string;
  email: string;
  name: string;
}

export function useTeam(teamId?: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/teams/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch team');

      const data = await response.json();
      setTeam(data);
      setMembers(data.members || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTeam = useCallback(async (
    name: string,
    description: string,
    maxMembers: number = 10
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/teams', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, max_members: maxMembers }),
      });

      if (!response.ok) throw new Error('Failed to create team');

      const data = await response.json();
      setTeam(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const inviteMember = useCallback(async (
    email: string,
    role: 'admin' | 'member' | 'guest'
  ) => {
    if (!team) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/v1/teams/${team.team_id}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) throw new Error('Failed to invite member');

      await fetchTeam(team.team_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [team, fetchTeam]);

  const removeMember = useCallback(async (userId: string) => {
    if (!team) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/v1/teams/${team.team_id}/members/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to remove member');

      await fetchTeam(team.team_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [team, fetchTeam]);

  const updateRole = useCallback(async (
    userId: string,
    newRole: 'admin' | 'member' | 'guest'
  ) => {
    if (!team) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/v1/teams/${team.team_id}/members/${userId}/role`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) throw new Error('Failed to update role');

      await fetchTeam(team.team_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [team, fetchTeam]);

  return {
    team,
    members,
    isLoading,
    error,
    fetchTeam,
    createTeam,
    inviteMember,
    removeMember,
    updateRole,
  };
}
