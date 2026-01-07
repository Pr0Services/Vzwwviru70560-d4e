/**
 * CHE·NU™ — PerformanceMonitor Stub
 */
export interface PerformanceStats {
  fps: number;
  memory: number;
  drawCalls: number;
}
export const getPerformanceStats = (): PerformanceStats => ({
  fps: 60,
  memory: 0,
  drawCalls: 0,
});
export const startPerformanceMonitor = () => logger.debug('Performance monitor started');
export const stopPerformanceMonitor = () => logger.debug('Performance monitor stopped');
