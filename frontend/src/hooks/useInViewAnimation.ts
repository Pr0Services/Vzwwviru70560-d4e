/**
 * CHE·NU™ - Lazy Animation Hook
 * Animate only when in viewport
 */
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface UseInViewAnimationOptions {
  once?: boolean;
  margin?: string;
  amount?: 'some' | 'all' | number;
}

export const useInViewAnimation = (
  options: UseInViewAnimationOptions = {}
) => {
  const ref = useRef(null);
  
  const isInView = useInView(ref, {
    once: options.once ?? true, // Animate only once by default
    margin: options.margin ?? '-100px', // Trigger before visible
    amount: options.amount ?? 0.3 // Trigger at 30% visible
  });
  
  return { ref, isInView };
};

/**
 * Example usage:
 * 
 * const ThreadCard = ({ thread }) => {
 *   const { ref, isInView } = useInViewAnimation();
 *   
 *   return (
 *     <motion.div
 *       ref={ref}
 *       initial={{ opacity: 0, y: 50 }}
 *       animate={isInView ? { opacity: 1, y: 0 } : {}}
 *       transition={{ duration: 0.5 }}
 *     >
 *       {thread.title}
 *     </motion.div>
 *   );
 * };
 */
