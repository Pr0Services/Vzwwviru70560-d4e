/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ONBOARDING HOOK
 * Phase 4: Onboarding Experience
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * React hook pour gérer l'onboarding utilisateur.
 * 
 * Créé: 20 Décembre 2025
 * Version: 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';

export enum OnboardingStage {
  NOT_STARTED = 'not_started',
  WELCOME = 'welcome',
  ACCOUNT_SETUP = 'account_setup',
  SPHERE_INTRODUCTION = 'sphere_introduction',
  FIRST_BUREAU = 'first_bureau',
  FIRST_THREAD = 'first_thread',
  AGENT_BASICS = 'agent_basics',
  TOKEN_SYSTEM = 'token_system',
  FIRST_MEETING = 'first_meeting',
  COMPLETED = 'completed',
}

export interface OnboardingStep {
  step_id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  required: boolean;
  reward: number;
}

export interface OnboardingProgress {
  user_id: string;
  current_stage: OnboardingStage;
  completion_percentage: number;
  completed_steps: number;
  total_steps: number;
  time_spent_minutes: number;
  earned_tokens: number;
  started_at: string;
  completed_at: string | null;
  next_steps: OnboardingStep[];
}

export interface UseOnboardingReturn {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  error: string | null;
  startOnboarding: () => Promise<void>;
  completeStep: (stepId: string, timeSpent: number) => Promise<void>;
  skipStep: (stepId: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger la progression initiale
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/onboarding/progress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load onboarding progress');
      }

      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      logger.error('Error loading onboarding progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startOnboarding = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/onboarding/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start onboarding');
      }

      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      logger.error('Error starting onboarding:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeStep = useCallback(async (stepId: string, timeSpent: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/onboarding/steps/${stepId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time_spent_minutes: timeSpent }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete step');
      }

      const result = await response.json();
      
      // Rafraîchir la progression
      await loadProgress();

      // Afficher notification de récompense
      if (result.tokens_earned > 0) {
        showRewardNotification(result.tokens_earned);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      logger.error('Error completing step:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const skipStep = useCallback(async (stepId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/onboarding/steps/${stepId}/skip`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to skip step');
      }

      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      logger.error('Error skipping step:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProgress = useCallback(async () => {
    await loadProgress();
  }, []);

  return {
    progress,
    isLoading,
    error,
    startOnboarding,
    completeStep,
    skipStep,
    refreshProgress,
  };
}

// Helper pour afficher notification de récompense
function showRewardNotification(tokens: number) {
  // TODO: Intégrer avec système de notifications
  logger.debug(`🎉 Vous avez gagné ${tokens} tokens!`);
}
