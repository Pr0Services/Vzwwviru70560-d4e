// CHE·NU™ Animation System
// Comprehensive animations for UI transitions

import { keyframes, css } from '@emotion/react';

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// TIMING FUNCTIONS
// ============================================================

export const easings = {
  // Standard easings
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Custom cubic-bezier curves
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',

  // Material Design curves
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
};

export const durations = {
  instant: '0ms',
  fastest: '100ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
  slowest: '750ms',
  glacial: '1000ms',
};

// ============================================================
// KEYFRAME ANIMATIONS
// ============================================================

// Fade animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeOutUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

export const fadeOutDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
`;

// Scale animations
export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const scaleOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

export const scaleUp = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

export const scaleDown = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const heartbeat = keyframes`
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
`;

// Slide animations
export const slideInUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideOutUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
`;

export const slideOutDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

export const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

export const slideOutRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

// Rotate animations
export const rotateIn = keyframes`
  from {
    opacity: 0;
    transform: rotate(-200deg);
  }
  to {
    opacity: 1;
    transform: rotate(0);
  }
`;

export const rotateOut = keyframes`
  from {
    opacity: 1;
    transform: rotate(0);
  }
  to {
    opacity: 0;
    transform: rotate(200deg);
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const spinReverse = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

// Bounce animations
export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
`;

export const bounceOut = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(0.3);
  }
`;

export const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

// Shake animations
export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
`;

export const shakeX = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
`;

export const shakeY = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(5px);
  }
  75% {
    transform: translateY(-5px);
  }
`;

export const wobble = keyframes`
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(-25px) rotate(-5deg);
  }
  30% {
    transform: translateX(20px) rotate(3deg);
  }
  45% {
    transform: translateX(-15px) rotate(-3deg);
  }
  60% {
    transform: translateX(10px) rotate(2deg);
  }
  75% {
    transform: translateX(-5px) rotate(-1deg);
  }
  100% {
    transform: translateX(0);
  }
`;

// Flip animations
export const flipInX = keyframes`
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
  }
  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
`;

export const flipInY = keyframes`
  from {
    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
  }
  60% {
    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
`;

export const flipOutX = keyframes`
  from {
    transform: perspective(400px);
  }
  30% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }
  to {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
`;

export const flipOutY = keyframes`
  from {
    transform: perspective(400px);
  }
  30% {
    transform: perspective(400px) rotate3d(0, 1, 0, -15deg);
    opacity: 1;
  }
  to {
    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    opacity: 0;
  }
`;

// Attention seekers
export const flash = keyframes`
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0;
  }
`;

export const rubberBand = keyframes`
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
`;

export const tada = keyframes`
  0% {
    transform: scale3d(1, 1, 1);
  }
  10%, 20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }
  30%, 50%, 70%, 90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }
  40%, 60%, 80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
`;

export const jello = keyframes`
  0%, 11.1%, 100% {
    transform: translate3d(0, 0, 0);
  }
  22.2% {
    transform: skewX(-12.5deg) skewY(-12.5deg);
  }
  33.3% {
    transform: skewX(6.25deg) skewY(6.25deg);
  }
  44.4% {
    transform: skewX(-3.125deg) skewY(-3.125deg);
  }
  55.5% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }
  66.6% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }
  77.7% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }
  88.8% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
`;

// Loading animations
export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const loadingDots = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const progressBar = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`;

export const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// CHE·NU Brand animations
export const goldGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px ${BRAND.sacredGold}40, 0 0 10px ${BRAND.sacredGold}20;
  }
  50% {
    box-shadow: 0 0 20px ${BRAND.sacredGold}60, 0 0 30px ${BRAND.sacredGold}30;
  }
`;

export const emeraldPulse = keyframes`
  0%, 100% {
    background-color: ${BRAND.jungleEmerald};
  }
  50% {
    background-color: ${BRAND.cenoteTurquoise};
  }
`;

export const sphereTransition = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const bureauSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const novaFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const tokenSpend = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px) scale(0.5);
    opacity: 0;
  }
`;

export const governanceCheck = keyframes`
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

// ============================================================
// ANIMATION CLASSES (CSS-in-JS)
// ============================================================

export const animationStyles = {
  // Fade
  fadeIn: css`
    animation: ${fadeIn} ${durations.normal} ${easings.smooth};
  `,
  fadeOut: css`
    animation: ${fadeOut} ${durations.normal} ${easings.smooth};
  `,
  fadeInUp: css`
    animation: ${fadeInUp} ${durations.normal} ${easings.decelerate};
  `,
  fadeInDown: css`
    animation: ${fadeInDown} ${durations.normal} ${easings.decelerate};
  `,
  fadeInLeft: css`
    animation: ${fadeInLeft} ${durations.normal} ${easings.decelerate};
  `,
  fadeInRight: css`
    animation: ${fadeInRight} ${durations.normal} ${easings.decelerate};
  `,

  // Scale
  scaleIn: css`
    animation: ${scaleIn} ${durations.normal} ${easings.spring};
  `,
  scaleOut: css`
    animation: ${scaleOut} ${durations.fast} ${easings.accelerate};
  `,
  pulse: css`
    animation: ${pulse} 2s ${easings.easeInOut} infinite;
  `,

  // Slide
  slideInUp: css`
    animation: ${slideInUp} ${durations.slow} ${easings.decelerate};
  `,
  slideInDown: css`
    animation: ${slideInDown} ${durations.slow} ${easings.decelerate};
  `,
  slideInLeft: css`
    animation: ${slideInLeft} ${durations.slow} ${easings.decelerate};
  `,
  slideInRight: css`
    animation: ${slideInRight} ${durations.slow} ${easings.decelerate};
  `,

  // Rotate
  spin: css`
    animation: ${spin} 1s linear infinite;
  `,
  spinSlow: css`
    animation: ${spin} 2s linear infinite;
  `,

  // Bounce
  bounceIn: css`
    animation: ${bounceIn} ${durations.slow} ${easings.bounce};
  `,
  bounce: css`
    animation: ${bounce} 1s ${easings.ease};
  `,

  // Shake
  shake: css`
    animation: ${shake} 0.5s ${easings.ease};
  `,
  wobble: css`
    animation: ${wobble} 1s ${easings.ease};
  `,

  // Attention
  flash: css`
    animation: ${flash} 1s ${easings.ease};
  `,
  rubberBand: css`
    animation: ${rubberBand} 1s ${easings.ease};
  `,
  tada: css`
    animation: ${tada} 1s ${easings.ease};
  `,
  jello: css`
    animation: ${jello} 1s ${easings.ease};
  `,

  // Loading
  shimmer: css`
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  `,

  // CHE·NU specific
  goldGlow: css`
    animation: ${goldGlow} 2s ${easings.easeInOut} infinite;
  `,
  emeraldPulse: css`
    animation: ${emeraldPulse} 3s ${easings.easeInOut} infinite;
  `,
  sphereTransition: css`
    animation: ${sphereTransition} ${durations.normal} ${easings.decelerate};
  `,
  bureauSlide: css`
    animation: ${bureauSlide} ${durations.normal} ${easings.decelerate};
  `,
  novaFloat: css`
    animation: ${novaFloat} 3s ${easings.easeInOut} infinite;
  `,
};

// ============================================================
// ANIMATION UTILITIES
// ============================================================

export const createAnimation = (
  animation: ReturnType<typeof keyframes>,
  duration: string = durations.normal,
  easing: string = easings.smooth,
  delay: string = '0ms',
  iterations: number | 'infinite' = 1,
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' = 'normal',
  fillMode: 'none' | 'forwards' | 'backwards' | 'both' = 'both'
) => css`
  animation: ${animation} ${duration} ${easing} ${delay} ${iterations} ${direction} ${fillMode};
`;

export const createTransition = (
  properties: string[] = ['all'],
  duration: string = durations.normal,
  easing: string = easings.smooth,
  delay: string = '0ms'
) => css`
  transition: ${properties.map((p) => `${p} ${duration} ${easing} ${delay}`).join(', ')};
`;

// Stagger children animation
export const staggerChildren = (
  animation: ReturnType<typeof keyframes>,
  duration: string = durations.normal,
  easing: string = easings.decelerate,
  staggerDelay: number = 50 // ms
) => css`
  & > * {
    animation: ${animation} ${duration} ${easing} both;
  }
  ${Array.from({ length: 20 }, (_, i) => `
    & > *:nth-child(${i + 1}) {
      animation-delay: ${i * staggerDelay}ms;
    }
  `).join('')}
`;

// Intersection observer animation trigger
export const createScrollAnimation = (animation: string) => ({
  initial: { opacity: 0, transform: 'translateY(20px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
  transition: { duration: 0.5 },
});

// ============================================================
// TRANSITION PRESETS
// ============================================================

export const transitions = {
  default: createTransition(['all'], durations.normal, easings.smooth),
  fast: createTransition(['all'], durations.fast, easings.smooth),
  slow: createTransition(['all'], durations.slow, easings.smooth),
  color: createTransition(['color', 'background-color', 'border-color'], durations.fast),
  transform: createTransition(['transform'], durations.normal, easings.spring),
  opacity: createTransition(['opacity'], durations.normal, easings.smooth),
  shadow: createTransition(['box-shadow'], durations.normal, easings.smooth),
  size: createTransition(['width', 'height'], durations.slow, easings.smooth),
};

// ============================================================
// MOTION PREFERENCES
// ============================================================

export const prefersReducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
  }
`;

export const respectMotionPreference = (animationCss: ReturnType<typeof css>) => css`
  ${animationCss}
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

// ============================================================
// EXPORT
// ============================================================

export default {
  keyframes: {
    fadeIn,
    fadeOut,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    fadeOutUp,
    fadeOutDown,
    scaleIn,
    scaleOut,
    scaleUp,
    scaleDown,
    pulse,
    heartbeat,
    slideInUp,
    slideInDown,
    slideInLeft,
    slideInRight,
    slideOutUp,
    slideOutDown,
    slideOutLeft,
    slideOutRight,
    rotateIn,
    rotateOut,
    spin,
    spinReverse,
    bounceIn,
    bounceOut,
    bounce,
    shake,
    shakeX,
    shakeY,
    wobble,
    flipInX,
    flipInY,
    flipOutX,
    flipOutY,
    flash,
    rubberBand,
    tada,
    jello,
    shimmer,
    loadingDots,
    progressBar,
    ripple,
    goldGlow,
    emeraldPulse,
    sphereTransition,
    bureauSlide,
    novaFloat,
    tokenSpend,
    governanceCheck,
  },
  easings,
  durations,
  styles: animationStyles,
  transitions,
  utils: {
    createAnimation,
    createTransition,
    staggerChildren,
    createScrollAnimation,
  },
  prefersReducedMotion,
  respectMotionPreference,
};
