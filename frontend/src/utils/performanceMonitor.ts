/**
 * CHE·NU™ - Performance Monitoring Utilities
 */
import { Profiler, ProfilerOnRenderCallback } from 'react';

// Performance thresholds
const THRESHOLDS = {
  SLOW_RENDER: 16, // 60fps = 16.67ms per frame
  VERY_SLOW_RENDER: 32,
  SLOW_INTERACTION: 100 // 100ms FID threshold
};

/**
 * React Profiler callback for performance monitoring
 */
export const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  // Log slow renders in development
  if (process.env.NODE_ENV === 'development') {
    if (actualDuration > THRESHOLDS.VERY_SLOW_RENDER) {
      logger.error(`🔴 VERY SLOW RENDER: ${id}`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        fps: `${Math.round(1000 / actualDuration)}fps`
      });
    } else if (actualDuration > THRESHOLDS.SLOW_RENDER) {
      logger.warn(`⚠️ Slow render: ${id}`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        fps: `${Math.round(1000 / actualDuration)}fps`
      });
    }
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && actualDuration > THRESHOLDS.SLOW_RENDER) {
    // Example: Send to your analytics service
    // analytics.track('slow_render', {
    //   component: id,
    //   phase,
    //   duration: actualDuration
    // });
  }
};

/**
 * Performance Observer for Long Tasks
 */
export const observeLongTasks = () => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Long task threshold
            logger.warn('⚠️ Long task detected:', {
              name: entry.name,
              duration: `${entry.duration.toFixed(2)}ms`,
              startTime: entry.startTime
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // longtask not supported
    }
  }
};

/**
 * FPS Monitor
 */
export class FPSMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private rafId: number | null = null;
  
  start() {
    const measure = () => {
      this.frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;
      
      if (elapsed >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed);
        
        if (this.fps < 30) {
          logger.warn(`⚠️ Low FPS: ${this.fps}fps`);
        }
        
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      this.rafId = requestAnimationFrame(measure);
    };
    
    this.rafId = requestAnimationFrame(measure);
  }
  
  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
  
  getFPS() {
    return this.fps;
  }
}

// Global FPS monitor instance
export const fpsMonitor = new FPSMonitor();

if (process.env.NODE_ENV === 'development') {
  (window as any).__fpsMonitor = fpsMonitor;
}
