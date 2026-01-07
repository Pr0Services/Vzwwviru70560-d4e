/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ONBOARDING PROGRESS
 * Phase 4: Onboarding Experience
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useOnboarding, OnboardingStage } from '../hooks/useOnboarding';

export const OnboardingProgress: React.FC = () => {
  const { progress } = useOnboarding();

  if (!progress || progress.current_stage === OnboardingStage.COMPLETED) {
    return null;
  }

  const stageLabels: Record<OnboardingStage, string> = {
    [OnboardingStage.NOT_STARTED]: 'Pas commencé',
    [OnboardingStage.WELCOME]: 'Bienvenue',
    [OnboardingStage.ACCOUNT_SETUP]: 'Configuration',
    [OnboardingStage.SPHERE_INTRODUCTION]: 'Découverte Spheres',
    [OnboardingStage.FIRST_BUREAU]: 'Premier Bureau',
    [OnboardingStage.FIRST_THREAD]: 'Premier Thread',
    [OnboardingStage.AGENT_BASICS]: 'Agents de base',
    [OnboardingStage.TOKEN_SYSTEM]: 'Système Tokens',
    [OnboardingStage.FIRST_MEETING]: 'Premier Meeting',
    [OnboardingStage.COMPLETED]: 'Terminé',
  };

  return (
    <div className="onboarding-progress">
      <div className="progress-header">
        <div className="progress-info">
          <h3>Onboarding en cours</h3>
          <p>{stageLabels[progress.current_stage]}</p>
        </div>
        <div className="progress-tokens">
          🪙 {progress.earned_tokens} tokens
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress.completion_percentage}%` }}
        />
        <span className="progress-text">
          {Math.round(progress.completion_percentage)}%
        </span>
      </div>

      {progress.next_steps && progress.next_steps.length > 0 && (
        <div className="next-steps">
          <h4>Prochaines étapes:</h4>
          <ul>
            {progress.next_steps.map((step) => (
              <li key={step.step_id}>
                <span className="step-title">{step.title}</span>
                <span className="step-reward">+{step.reward} 🪙</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .onboarding-progress {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 320px;
          z-index: 1000;
          border: 2px solid #d8b26a;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .progress-info h3 {
          font-size: 16px;
          margin: 0 0 4px;
          color: #1e1f22;
        }

        .progress-info p {
          font-size: 14px;
          color: #8d8371;
          margin: 0;
        }

        .progress-tokens {
          background: #3f7249;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
        }

        .progress-bar {
          position: relative;
          height: 24px;
          background: #e9e4d6;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3f7249 0%, #3eb4a2 100%);
          transition: width 0.5s ease;
          border-radius: 12px;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: 600;
          font-size: 12px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .next-steps h4 {
          font-size: 14px;
          margin: 0 0 12px;
          color: #1e1f22;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .next-steps li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-top: 1px solid #e9e4d6;
        }

        .step-title {
          font-size: 13px;
          color: #2f4c39;
        }

        .step-reward {
          font-size: 12px;
          font-weight: 600;
          color: #d8b26a;
        }
      `}</style>
    </div>
  );
};
