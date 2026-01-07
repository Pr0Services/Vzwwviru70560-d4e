/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — GUIDED TOUR COMPONENT
 * Phase 4: Onboarding Experience
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Composant pour tours guidés interactifs.
 * 
 * Créé: 20 Décembre 2025
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
  action?: () => void;
}

export interface GuidedTourProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip?: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive || steps.length === 0) {
      setIsVisible(false);
      return;
    }

    const step = steps[currentStep];
    const element = document.querySelector(step.target);

    if (!element) {
      logger.warn(`Tour target not found: ${step.target}`);
      return;
    }

    // Calculer position
    const rect = element.getBoundingClientRect();
    const placement = step.placement || 'bottom';

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - 180; // Hauteur tooltip
        left = rect.left + rect.width / 2 - 150; // Centré
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + rect.width / 2 - 150;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - 90;
        left = rect.left - 320;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - 90;
        left = rect.right + 10;
        break;
    }

    setPosition({ top, left });

    // Highlight element
    element.classList.add('tour-highlight');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setIsVisible(true);

    return () => {
      element.classList.remove('tour-highlight');
    };
  }, [currentStep, steps, isActive]);

  const handleNext = () => {
    const step = steps[currentStep];
    
    // Execute action if any
    if (step.action) {
      step.action();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tour terminé
      setIsVisible(false);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    if (onSkip) {
      onSkip();
    }
  };

  if (!isActive || !isVisible || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="tour-overlay" onClick={(e) => e.stopPropagation()} />

      {/* Tooltip */}
      <div
        className="tour-tooltip"
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 10000,
        }}
      >
        <div className="tour-tooltip-content">
          {/* Header */}
          <div className="tour-header">
            <h3 className="tour-title">{step.title}</h3>
            <div className="tour-progress">
              {currentStep + 1} / {steps.length}
            </div>
          </div>

          {/* Content */}
          <div className="tour-body">
            <p>{step.content}</p>
          </div>

          {/* Footer */}
          <div className="tour-footer">
            <div className="tour-actions">
              {step.showSkip && (
                <button
                  className="tour-btn tour-btn-secondary"
                  onClick={handleSkip}
                >
                  Passer
                </button>
              )}

              {currentStep > 0 && (
                <button
                  className="tour-btn tour-btn-secondary"
                  onClick={handlePrevious}
                >
                  Précédent
                </button>
              )}

              <button
                className="tour-btn tour-btn-primary"
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className={`tour-arrow tour-arrow-${step.placement || 'bottom'}`} />
      </div>

      <style jsx>{`
        .tour-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
        }

        .tour-tooltip {
          width: 300px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.3s ease;
        }

        .tour-tooltip-content {
          padding: 20px;
        }

        .tour-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .tour-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e1f22;
          margin: 0;
        }

        .tour-progress {
          font-size: 12px;
          color: #8d8371;
          background: #e9e4d6;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .tour-body {
          margin-bottom: 16px;
          color: #2f4c39;
          line-height: 1.5;
        }

        .tour-footer {
          border-top: 1px solid #e9e4d6;
          padding-top: 16px;
        }

        .tour-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .tour-btn {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .tour-btn-primary {
          background: #d8b26a;
          color: white;
        }

        .tour-btn-primary:hover {
          background: #c9a159;
        }

        .tour-btn-secondary {
          background: transparent;
          color: #8d8371;
          border: 1px solid #8d8371;
        }

        .tour-btn-secondary:hover {
          background: #e9e4d6;
        }

        .tour-arrow {
          position: absolute;
          width: 0;
          height: 0;
          border: 8px solid transparent;
        }

        .tour-arrow-top {
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          border-top-color: white;
        }

        .tour-arrow-bottom {
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          border-bottom-color: white;
        }

        .tour-arrow-left {
          right: -16px;
          top: 50%;
          transform: translateY(-50%);
          border-left-color: white;
        }

        .tour-arrow-right {
          left: -16px;
          top: 50%;
          transform: translateY(-50%);
          border-right-color: white;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        :global(.tour-highlight) {
          position: relative;
          z-index: 10000;
          box-shadow: 0 0 0 4px #d8b26a, 0 0 0 8px rgba(216, 178, 106, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};
