/**
 * CHE·NU™ - Optimized Framer Motion Animations
 * GPU-accelerated animations only
 */
import { motion, Variants } from 'framer-motion';

/**
 * Sphere transition animations
 * ✅ Uses only transform & opacity (GPU-accelerated)
 */
export const sphereVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

/**
 * Bureau section animations
 * Stagger children for smooth cascade effect
 */
export const bureauVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const bureauItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] // Custom easing
    }
  }
};

/**
 * Card hover animations
 * Subtle scale + shadow
 */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

/**
 * Modal animations
 * Backdrop blur + scale
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1] // Spring-like easing
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

/**
 * List item animations
 * For feeds, threads, etc.
 */
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut'
    }
  })
};

/**
 * Optimized Container Component
 * Pre-configured with GPU hints
 */
export const GPUOptimizedMotionDiv = motion.div;

// Add will-change hint for GPU acceleration
GPUOptimizedMotionDiv.defaultProps = {
  style: {
    willChange: 'transform, opacity'
  }
};

/**
 * Example usage:
 * 
 * <motion.div
 *   variants={sphereVariants}
 *   initial="hidden"
 *   animate="visible"
 *   exit="exit"
 * >
 *   <SphereContent />
 * </motion.div>
 */
