/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — WELCOME WIZARD
 * Phase 4: Onboarding Experience
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useOnboarding } from '../hooks/useOnboarding';

export const WelcomeWizard: React.FC = () => {
  const { startOnboarding } = useOnboarding();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Bienvenue dans CHE·NU™',
      subtitle: 'Governed Intelligence Operating System',
      content: (
        <div>
          <p>CHE·NU™ révolutionne votre relation avec l'IA en plaçant la <strong>gouvernance</strong> au cœur de chaque interaction.</p>
          <ul>
            <li>🏛️ <strong>Gouvernance avant exécution</strong></li>
            <li>💎 <strong>Clarté avant fonctionnalités</strong></li>
            <li>🔐 <strong>Contrôle total de vos données</strong></li>
            <li>🎯 <strong>Contexte avant action</strong></li>
          </ul>
        </div>
      ),
    },
    {
      title: '9 Spheres. Un système.',
      subtitle: 'Organisez votre vie par contexte',
      content: (
        <div>
          <p>CHE·NU organise votre existence en <strong>9 Spheres</strong>:</p>
          <div className="sphere-grid">
            <div className="sphere-card">🏠 Personal</div>
            <div className="sphere-card">💼 Business</div>
            <div className="sphere-card">🏛️ Government</div>
            <div className="sphere-card">🎨 Studio</div>
            <div className="sphere-card">👥 Community</div>
            <div className="sphere-card">📱 Social</div>
            <div className="sphere-card">🎬 Entertainment</div>
            <div className="sphere-card">🤝 My Team</div>
            <div className="sphere-card">📚 Scholars</div>
          </div>
          <p className="principle">Principe: <strong>Une Sphere à la fois</strong> pour réduire la charge cognitive.</p>
        </div>
      ),
    },
    {
      title: 'Agents L0-L3',
      subtitle: 'Une hiérarchie claire',
      content: (
        <div>
          <p>Tous les agents ne sont pas égaux:</p>
          <div className="agent-levels">
            <div className="level"><span className="badge">L0</span> Nova - Intelligence système</div>
            <div className="level"><span className="badge">L1</span> Orchestrator - Votre chef d'orchestre</div>
            <div className="level"><span className="badge">L2</span> Specialists - Experts domaines</div>
            <div className="level"><span className="badge">L3</span> Utilities - Tâches simples</div>
          </div>
          <p>Chaque niveau a des permissions, budgets et responsabilités définis.</p>
        </div>
      ),
    },
    {
      title: 'Tokens = Énergie',
      subtitle: 'Pas de crypto, juste du contrôle',
      content: (
        <div>
          <p>Les <strong>tokens CHE·NU</strong> représentent l'énergie d'intelligence:</p>
          <ul>
            <li>✅ Utilitaires internes (pas de cryptomonnaie)</li>
            <li>✅ Budgets par agent/thread/sphere</li>
            <li>✅ Consommation tracée et auditable</li>
            <li>✅ Gouvernance des coûts IA</li>
          </ul>
          <p className="highlight">Vous gardez le contrôle de chaque token dépensé.</p>
        </div>
      ),
    },
    {
      title: 'Prêt à commencer?',
      subtitle: 'Gagnez 2,000 tokens en complétant l\'onboarding',
      content: (
        <div className="ready-screen">
          <p>Nous allons vous guider à travers:</p>
          <ol>
            <li>Configuration de votre profil</li>
            <li>Exploration des Spheres</li>
            <li>Création de votre premier Thread</li>
            <li>Embauche de votre premier Agent</li>
            <li>Gestion de vos tokens</li>
          </ol>
          <p className="duration">⏱️ Durée estimée: 15-20 minutes</p>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Démarrer l'onboarding
      startOnboarding();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="welcome-wizard">
      <div className="wizard-container">
        <div className="wizard-header">
          <h1>{currentStep.title}</h1>
          <p className="subtitle">{currentStep.subtitle}</p>
        </div>

        <div className="wizard-content">
          {currentStep.content}
        </div>

        <div className="wizard-footer">
          <div className="progress-dots">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
              />
            ))}
          </div>

          <div className="wizard-actions">
            {step > 0 && (
              <button className="btn btn-secondary" onClick={handlePrevious}>
                Précédent
              </button>
            )}
            <button className="btn btn-primary" onClick={handleNext}>
              {step === steps.length - 1 ? 'Commencer l\'onboarding' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome-wizard {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #1e1f22 0%, #2f4c39 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .wizard-container {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .wizard-header {
          padding: 40px 40px 20px;
          text-align: center;
          border-bottom: 2px solid #e9e4d6;
        }

        .wizard-header h1 {
          font-size: 28px;
          color: #d8b26a;
          margin: 0 0 8px;
        }

        .subtitle {
          color: #8d8371;
          font-size: 14px;
          margin: 0;
        }

        .wizard-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .wizard-content p {
          line-height: 1.6;
          color: #2f4c39;
        }

        .wizard-content ul, .wizard-content ol {
          margin: 16px 0;
        }

        .wizard-content li {
          margin: 8px 0;
          line-height: 1.5;
        }

        .sphere-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 20px 0;
        }

        .sphere-card {
          background: #e9e4d6;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
        }

        .principle {
          background: #3eb4a2;
          color: white;
          padding: 12px;
          border-radius: 6px;
          font-weight: 500;
        }

        .agent-levels {
          margin: 20px 0;
        }

        .level {
          padding: 12px;
          margin: 8px 0;
          background: #e9e4d6;
          border-radius: 6px;
        }

        .badge {
          background: #d8b26a;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          margin-right: 8px;
        }

        .highlight {
          background: #d8b26a;
          color: white;
          padding: 12px;
          border-radius: 6px;
          font-weight: 500;
          text-align: center;
        }

        .ready-screen {
          text-align: center;
        }

        .duration {
          background: #3f7249;
          color: white;
          padding: 12px;
          border-radius: 6px;
          font-weight: 500;
          margin-top: 20px;
        }

        .wizard-footer {
          padding: 20px 40px 40px;
          border-top: 2px solid #e9e4d6;
        }

        .progress-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e9e4d6;
          transition: all 0.3s;
        }

        .dot.active {
          background: #d8b26a;
          width: 24px;
          border-radius: 4px;
        }

        .dot.completed {
          background: #3f7249;
        }

        .wizard-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn {
          padding: 12px 32px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-size: 16px;
        }

        .btn-primary {
          background: #d8b26a;
          color: white;
        }

        .btn-primary:hover {
          background: #c9a159;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: #8d8371;
          border: 2px solid #8d8371;
        }

        .btn-secondary:hover {
          background: #e9e4d6;
        }
      `}</style>
    </div>
  );
};
