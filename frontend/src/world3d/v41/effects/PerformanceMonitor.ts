/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 POLISH — PERFORMANCE MONITORING & ADAPTIVE QUALITY
 * Real-time FPS monitoring with automatic quality adjustment
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { QualityManager, type QualityPreset } from './QualityAutoDetect';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PerformanceStats {
  fps: number;
  avgFps: number;
  minFps: number;
  maxFps: number;
  frameTime: number;       // ms
  memoryUsed: number;      // MB (if available)
  drawCalls: number;
  triangles: number;
}

export interface PerformanceThresholds {
  target: number;          // Target FPS (default: 60)
  warning: number;         // Warning threshold (default: 45)
  critical: number;        // Critical threshold (default: 30)
  upgradeAfter: number;    // Upgrade quality after N stable frames (default: 180 = 3s @ 60fps)
  downgradeAfter: number;  // Downgrade quality after N poor frames (default: 60 = 1s @ 60fps)
}

export interface AdaptiveQualityConfig {
  enabled: boolean;
  thresholds: PerformanceThresholds;
  allowUpgrade: boolean;   // Allow upgrading quality
  allowDowngrade: boolean; // Allow downgrading quality
  minPreset: QualityPreset;
  maxPreset: QualityPreset;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITOR
// ═══════════════════════════════════════════════════════════════════════════════

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  
  private frameTimes: number[] = [];
  private maxSamples: number = 60; // Track last 60 frames
  
  private lastTime: number = performance.now();
  private currentFPS: number = 60;
  
  // Stats tracking
  private minFPS: number = 60;
  private maxFPS: number = 60;
  private totalFrames: number = 0;
  
  // Memory tracking (Chrome only)
  private memorySupported: boolean = false;

  private constructor() {
    // Check if memory API is available
    this.memorySupported = 'memory' in performance;
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Update performance stats (call every frame)
   */
  update(): void {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    // Calculate FPS
    this.currentFPS = delta > 0 ? 1000 / delta : 60;
    
    // Track frame time
    this.frameTimes.push(delta);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }

    // Update min/max
    this.minFPS = Math.min(this.minFPS, this.currentFPS);
    this.maxFPS = Math.max(this.maxFPS, this.currentFPS);
    
    this.totalFrames++;
  }

  /**
   * Get current performance stats
   */
  getStats(): PerformanceStats {
    const avgFrameTime = this.frameTimes.length > 0
      ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
      : 16.67;
    
    const avgFps = avgFrameTime > 0 ? 1000 / avgFrameTime : 60;

    let memoryUsed = 0;
    if (this.memorySupported) {
      const memory = (performance as any).memory;
      memoryUsed = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }

    return {
      fps: this.currentFPS,
      avgFps,
      minFps: this.minFPS,
      maxFps: this.maxFPS,
      frameTime: avgFrameTime,
      memoryUsed,
      drawCalls: 0, // Would need renderer reference
      triangles: 0,  // Would need renderer reference
    };
  }

  /**
   * Reset stats
   */
  reset(): void {
    this.frameTimes = [];
    this.minFPS = 60;
    this.maxFPS = 60;
    this.totalFrames = 0;
    this.lastTime = performance.now();
  }

  /**
   * Get total frames rendered
   */
  getTotalFrames(): number {
    return this.totalFrames;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADAPTIVE QUALITY MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class AdaptiveQualityManager {
  private static instance: AdaptiveQualityManager;
  
  private monitor: PerformanceMonitor;
  private qualityManager: QualityManager;
  
  private config: AdaptiveQualityConfig;
  private enabled: boolean = false;
  
  // Quality adjustment tracking
  private stableFrameCount: number = 0;
  private poorFrameCount: number = 0;
  private lastAdjustmentTime: number = 0;
  private minAdjustmentInterval: number = 5000; // 5s minimum between adjustments

  private constructor() {
    this.monitor = PerformanceMonitor.getInstance();
    this.qualityManager = QualityManager.getInstance();
    
    this.config = {
      enabled: true,
      thresholds: {
        target: 60,
        warning: 45,
        critical: 30,
        upgradeAfter: 180,   // 3 seconds stable
        downgradeAfter: 60,  // 1 second poor
      },
      allowUpgrade: true,
      allowDowngrade: true,
      minPreset: 'low',
      maxPreset: 'ultra',
    };
  }

  static getInstance(): AdaptiveQualityManager {
    if (!AdaptiveQualityManager.instance) {
      AdaptiveQualityManager.instance = new AdaptiveQualityManager();
    }
    return AdaptiveQualityManager.instance;
  }

  /**
   * Update adaptive quality (call every frame)
   */
  update(): void {
    if (!this.config.enabled) return;

    this.monitor.update();
    
    const stats = this.monitor.getStats();
    const now = performance.now();
    
    // Check if enough time has passed since last adjustment
    if (now - this.lastAdjustmentTime < this.minAdjustmentInterval) {
      return;
    }

    // Check if FPS is below warning threshold
    if (stats.avgFps < this.config.thresholds.warning) {
      this.poorFrameCount++;
      this.stableFrameCount = 0;
      
      // Downgrade if poor performance persists
      if (this.poorFrameCount >= this.config.thresholds.downgradeAfter) {
        this.tryDowngrade(stats.avgFps);
        this.poorFrameCount = 0;
      }
    }
    // Check if FPS is consistently high
    else if (stats.avgFps >= this.config.thresholds.target) {
      this.stableFrameCount++;
      this.poorFrameCount = 0;
      
      // Upgrade if performance is stable
      if (this.stableFrameCount >= this.config.thresholds.upgradeAfter) {
        this.tryUpgrade(stats.avgFps);
        this.stableFrameCount = 0;
      }
    }
    // Reset counters if in middle zone
    else {
      this.stableFrameCount = 0;
      this.poorFrameCount = 0;
    }
  }

  /**
   * Try to downgrade quality
   */
  private tryDowngrade(avgFps: number): void {
    if (!this.config.allowDowngrade) return;

    const current = this.qualityManager.getSettings();
    const presets: QualityPreset[] = ['ultra', 'high', 'medium', 'low', 'minimal'];
    const currentIndex = presets.indexOf(current.preset);
    
    if (currentIndex < presets.length - 1) {
      const nextPreset = presets[currentIndex + 1];
      
      // Check if we can downgrade further
      const minIndex = presets.indexOf(this.config.minPreset);
      if (currentIndex + 1 <= minIndex) {
        console.log(`⚠️ Performance low (${avgFps.toFixed(1)} FPS), downgrading: ${current.preset} → ${nextPreset}`);
        this.qualityManager.setQuality(nextPreset);
        this.lastAdjustmentTime = performance.now();
      }
    }
  }

  /**
   * Try to upgrade quality
   */
  private tryUpgrade(avgFps: number): void {
    if (!this.config.allowUpgrade) return;

    const current = this.qualityManager.getSettings();
    const presets: QualityPreset[] = ['minimal', 'low', 'medium', 'high', 'ultra'];
    const currentIndex = presets.indexOf(current.preset);
    
    if (currentIndex < presets.length - 1) {
      const nextPreset = presets[currentIndex + 1];
      
      // Check if we can upgrade further
      const maxIndex = presets.indexOf(this.config.maxPreset);
      if (currentIndex + 1 <= maxIndex) {
        console.log(`✨ Performance stable (${avgFps.toFixed(1)} FPS), upgrading: ${current.preset} → ${nextPreset}`);
        this.qualityManager.setQuality(nextPreset);
        this.lastAdjustmentTime = performance.now();
      }
    }
  }

  /**
   * Enable adaptive quality
   */
  enable(config?: Partial<AdaptiveQualityConfig>): void {
    this.config = { ...this.config, ...config, enabled: true };
    this.enabled = true;
    this.monitor.reset();
    console.log('✅ Adaptive quality enabled');
  }

  /**
   * Disable adaptive quality
   */
  disable(): void {
    this.config.enabled = false;
    this.enabled = false;
    console.log('⏸️ Adaptive quality disabled');
  }

  /**
   * Check if enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get current config
   */
  getConfig(): AdaptiveQualityConfig {
    return this.config;
  }

  /**
   * Get performance stats
   */
  getStats(): PerformanceStats {
    return this.monitor.getStats();
  }

  /**
   * Print performance report
   */
  printReport(): void {
    const stats = this.monitor.getStats();
    const quality = this.qualityManager.getSettings();

    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                  PERFORMANCE MONITORING REPORT                    ║
╚═══════════════════════════════════════════════════════════════════╝

CURRENT PERFORMANCE:
  FPS: ${stats.fps.toFixed(1)}
  Average FPS: ${stats.avgFps.toFixed(1)}
  Min FPS: ${stats.minFps.toFixed(1)}
  Max FPS: ${stats.maxFps.toFixed(1)}
  Frame Time: ${stats.frameTime.toFixed(2)}ms
  ${stats.memoryUsed > 0 ? `Memory: ${stats.memoryUsed.toFixed(1)}MB` : ''}

QUALITY PRESET: ${quality.preset.toUpperCase()}
  Target FPS: ${quality.targetFPS}
  Post-Processing: ${quality.enablePostProcessing ? 'ON' : 'OFF'}
  Atmospheric: ${quality.enableAtmospheric ? 'ON' : 'OFF'}
  Particles: ${quality.particleCount}

ADAPTIVE QUALITY:
  Enabled: ${this.config.enabled}
  Can Upgrade: ${this.config.allowUpgrade}
  Can Downgrade: ${this.config.allowDowngrade}
  Target: ${this.config.thresholds.target} FPS
  Warning: ${this.config.thresholds.warning} FPS
  Critical: ${this.config.thresholds.critical} FPS

FRAME COUNTERS:
  Stable: ${this.stableFrameCount} / ${this.config.thresholds.upgradeAfter}
  Poor: ${this.poorFrameCount} / ${this.config.thresholds.downgradeAfter}
    `);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Start performance monitoring
 */
export function startPerformanceMonitoring(): PerformanceMonitor {
  return PerformanceMonitor.getInstance();
}

/**
 * Enable adaptive quality
 */
export function enableAdaptiveQuality(config?: Partial<AdaptiveQualityConfig>): void {
  const manager = AdaptiveQualityManager.getInstance();
  manager.enable(config);
}

/**
 * Disable adaptive quality
 */
export function disableAdaptiveQuality(): void {
  const manager = AdaptiveQualityManager.getInstance();
  manager.disable();
}

/**
 * Get current performance stats
 */
export function getPerformanceStats(): PerformanceStats {
  const monitor = PerformanceMonitor.getInstance();
  return monitor.getStats();
}

/**
 * Update performance (call in animation loop)
 */
export function updatePerformance(): void {
  const manager = AdaptiveQualityManager.getInstance();
  manager.update();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default AdaptiveQualityManager;
