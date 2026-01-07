/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — ANIMATIONS EXTENSION                        ║
 * ║                                                                              ║
 * ║  Extended animations and polish for V72 UI                                   ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';

// Re-export base animations
export * from './animations';

// ═══════════════════════════════════════════════════════════════════════════════
// V72 KEYFRAME ANIMATIONS CSS
// ═══════════════════════════════════════════════════════════════════════════════

export const v72KeyframeAnimations = `
  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* NOVA ANIMATIONS                                                              */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes novaPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(216, 178, 106, 0.3),
                  0 0 40px rgba(216, 178, 106, 0.1);
    }
    50% {
      transform: scale(1.08);
      box-shadow: 0 0 30px rgba(216, 178, 106, 0.5),
                  0 0 60px rgba(216, 178, 106, 0.2);
    }
  }

  @keyframes novaTyping {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes novaThinking {
    0% { transform: translateX(0); }
    25% { transform: translateX(3px); }
    50% { transform: translateX(0); }
    75% { transform: translateX(-3px); }
    100% { transform: translateX(0); }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* AGING SYSTEM ANIMATIONS                                                      */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes agingGreen {
    0%, 100% {
      border-left-color: #4ADE80;
      background: rgba(74, 222, 128, 0.05);
    }
  }

  @keyframes agingYellow {
    0%, 100% {
      border-left-color: #FACC15;
      background: rgba(250, 204, 21, 0.05);
    }
    50% {
      background: rgba(250, 204, 21, 0.08);
    }
  }

  @keyframes agingRed {
    0%, 100% {
      border-left-color: #EF4444;
      background: rgba(239, 68, 68, 0.08);
    }
    50% {
      border-left-color: #DC2626;
      background: rgba(239, 68, 68, 0.12);
    }
  }

  @keyframes agingBlink {
    0%, 100% {
      border-left-color: #F97316;
      background: rgba(249, 115, 22, 0.1);
      transform: scale(1);
    }
    50% {
      border-left-color: #EA580C;
      background: rgba(249, 115, 22, 0.18);
      transform: scale(1.01);
    }
  }

  @keyframes urgentPulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
    }
    50% {
      box-shadow: 0 0 15px 5px rgba(239, 68, 68, 0.2);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* CHECKPOINT ANIMATIONS                                                        */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes checkpointReveal {
    0% {
      opacity: 0;
      transform: translateY(15px) scale(0.95);
      border-color: transparent;
    }
    50% {
      border-color: rgba(216, 178, 106, 0.5);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      border-color: rgba(216, 178, 106, 0.3);
    }
  }

  @keyframes checkpointApproved {
    0% {
      background: rgba(74, 222, 128, 0.3);
      transform: scale(1.02);
    }
    100% {
      background: rgba(74, 222, 128, 0.1);
      transform: scale(1);
    }
  }

  @keyframes checkpointRejected {
    0% {
      background: rgba(239, 68, 68, 0.3);
      transform: scale(1.02);
    }
    100% {
      background: rgba(239, 68, 68, 0.1);
      transform: scale(1);
    }
  }

  @keyframes governanceShield {
    0%, 100% {
      filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.5));
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* MATURITY LEVEL ANIMATIONS                                                    */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes seedGrow {
    0% {
      transform: scale(0.8) rotate(-5deg);
      opacity: 0.5;
    }
    100% {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }

  @keyframes sproutWobble {
    0%, 100% { transform: rotate(0); }
    25% { transform: rotate(2deg); }
    75% { transform: rotate(-2deg); }
  }

  @keyframes matureGlow {
    0%, 100% {
      filter: drop-shadow(0 0 5px rgba(216, 178, 106, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 12px rgba(216, 178, 106, 0.5));
    }
  }

  @keyframes ripeShine {
    0% {
      background-position: -100% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* SPHERE ANIMATIONS                                                            */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes sphereHover {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-3px) scale(1.02);
    }
  }

  @keyframes sphereSelect {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
  }

  @keyframes sphereOrbit3D {
    0% {
      transform: rotateY(0deg) translateZ(150px) rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg) translateZ(150px) rotateY(-360deg);
    }
  }

  @keyframes sphereFloat {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* XR ANIMATIONS                                                                */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes xrParticle {
    0%, 100% {
      transform: translateY(0) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-25px) scale(1.8);
      opacity: 0.6;
    }
  }

  @keyframes xrConnection {
    0% {
      stroke-dashoffset: 100;
      opacity: 0.2;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 0.5;
    }
  }

  @keyframes xrNodePulse {
    0%, 100% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.2);
    }
  }

  @keyframes xrRotate {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(360deg);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* AGENT ANIMATIONS                                                             */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes agentHire {
    0% {
      transform: scale(1);
      background: transparent;
    }
    50% {
      transform: scale(1.05);
      background: rgba(216, 178, 106, 0.2);
    }
    100% {
      transform: scale(1);
      background: rgba(216, 178, 106, 0.1);
    }
  }

  @keyframes agentActive {
    0%, 100% {
      box-shadow: 0 0 0 2px rgba(62, 180, 162, 0.3);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(62, 180, 162, 0.2);
    }
  }

  @keyframes levelBadge {
    0% {
      transform: scale(0) rotate(-180deg);
    }
    100% {
      transform: scale(1) rotate(0);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* NOTIFICATION ANIMATIONS                                                      */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes notificationBounce {
    0%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-8px);
    }
    50% {
      transform: translateY(0);
    }
    70% {
      transform: translateY(-4px);
    }
  }

  @keyframes notificationPop {
    0% {
      opacity: 0;
      transform: translateX(100%) scale(0.8);
    }
    70% {
      transform: translateX(-5%) scale(1.02);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes badgePulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* FAB ANIMATIONS                                                               */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes fabExpand {
    0% {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    100% {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }

  @keyframes fabHover {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(216, 178, 106, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 25px rgba(216, 178, 106, 0.4);
    }
  }

  @keyframes fabPulseRing {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* SEARCH ANIMATIONS                                                            */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes searchExpand {
    0% {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes searchResult {
    0% {
      opacity: 0;
      transform: translateX(-10px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes searchHighlight {
    0% {
      background: rgba(216, 178, 106, 0.3);
    }
    100% {
      background: rgba(216, 178, 106, 0.1);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* STATS & PROGRESS ANIMATIONS                                                  */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes countUp {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes progressFill {
    0% {
      width: 0;
    }
    100% {
      width: var(--progress, 100%);
    }
  }

  @keyframes progressGlow {
    0%, 100% {
      box-shadow: 0 0 5px currentColor;
    }
    50% {
      box-shadow: 0 0 15px currentColor;
    }
  }

  @keyframes barGrow {
    0% {
      transform: scaleX(0);
      transform-origin: left;
    }
    100% {
      transform: scaleX(1);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* LOADING ANIMATIONS                                                           */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes dotsLoading {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes skeletonWave {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes spinnerGlow {
    0% {
      box-shadow: 0 0 10px rgba(216, 178, 106, 0.3);
    }
    50% {
      box-shadow: 0 0 20px rgba(216, 178, 106, 0.5);
    }
    100% {
      box-shadow: 0 0 10px rgba(216, 178, 106, 0.3);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* MICRO-INTERACTIONS                                                           */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  @keyframes rippleEffect {
    0% {
      transform: scale(0);
      opacity: 0.5;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes clickFeedback {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes focusRing {
    0% {
      box-shadow: 0 0 0 0 rgba(216, 178, 106, 0.4);
    }
    100% {
      box-shadow: 0 0 0 4px rgba(216, 178, 106, 0.2);
    }
  }

  @keyframes successCheck {
    0% {
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION UTILITY CLASSES CSS
// ═══════════════════════════════════════════════════════════════════════════════

export const v72AnimationClasses = `
  /* Entrance animations */
  .animate-fade-in { animation: fadeIn 300ms ease-out forwards; }
  .animate-fade-in-up { animation: fadeInUp 300ms ease-out forwards; }
  .animate-fade-in-down { animation: fadeInDown 300ms ease-out forwards; }
  .animate-scale-in { animation: scaleIn 300ms ease-out forwards; }
  .animate-slide-in-right { animation: slideInRight 300ms ease-out forwards; }
  .animate-slide-in-left { animation: slideInLeft 300ms ease-out forwards; }
  .animate-bounce-in { animation: bounceIn 500ms ease-out forwards; }

  /* Exit animations */
  .animate-fade-out { animation: fadeOut 200ms ease-in forwards; }
  .animate-fade-out-up { animation: fadeOutUp 200ms ease-in forwards; }
  .animate-scale-out { animation: scaleOut 200ms ease-in forwards; }

  /* Looping animations */
  .animate-pulse { animation: pulse 2s ease-in-out infinite; }
  .animate-spin { animation: spin 1s linear infinite; }
  .animate-bounce { animation: bounce 1s ease-in-out infinite; }
  .animate-blink { animation: blink 1s ease-in-out infinite; }

  /* V72 specific */
  .animate-nova-pulse { animation: novaPulse 3s ease-in-out infinite; }
  .animate-aging-blink { animation: agingBlink 1s ease-in-out infinite; }
  .animate-checkpoint { animation: checkpointReveal 400ms ease-out forwards; }
  .animate-sphere-float { animation: sphereFloat 4s ease-in-out infinite; }
  .animate-fab-hover { animation: fabHover 2s ease-in-out infinite; }
  .animate-notification { animation: notificationPop 400ms ease-out forwards; }
  .animate-search { animation: searchExpand 200ms ease-out forwards; }

  /* Stagger children */
  .stagger-children > * {
    opacity: 0;
    animation: fadeInUp 300ms ease-out forwards;
  }
  .stagger-children > *:nth-child(1) { animation-delay: 0ms; }
  .stagger-children > *:nth-child(2) { animation-delay: 50ms; }
  .stagger-children > *:nth-child(3) { animation-delay: 100ms; }
  .stagger-children > *:nth-child(4) { animation-delay: 150ms; }
  .stagger-children > *:nth-child(5) { animation-delay: 200ms; }
  .stagger-children > *:nth-child(6) { animation-delay: 250ms; }
  .stagger-children > *:nth-child(7) { animation-delay: 300ms; }
  .stagger-children > *:nth-child(8) { animation-delay: 350ms; }
  .stagger-children > *:nth-child(9) { animation-delay: 400ms; }

  /* Hover effects */
  .hover-lift {
    transition: transform 150ms ease-out, box-shadow 150ms ease-out;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .hover-glow {
    transition: box-shadow 150ms ease-out;
  }
  .hover-glow:hover {
    box-shadow: 0 0 20px rgba(216, 178, 106, 0.3);
  }

  .hover-scale {
    transition: transform 150ms ease-out;
  }
  .hover-scale:hover {
    transform: scale(1.02);
  }

  /* Active states */
  .active-press:active {
    transform: scale(0.98);
  }

  /* Focus states */
  .focus-ring:focus {
    outline: none;
    animation: focusRing 200ms ease-out forwards;
  }

  /* Skeleton loading */
  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0.06) 50%,
      rgba(255, 255, 255, 0.03) 100%
    );
    background-size: 200% 100%;
    animation: skeletonWave 1.5s ease-in-out infinite;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE V72 STYLES CSS
// ═══════════════════════════════════════════════════════════════════════════════

export const v72CompleteStyles = `
  ${v72KeyframeAnimations}
  ${v72AnimationClasses}
`;

export default v72CompleteStyles;
