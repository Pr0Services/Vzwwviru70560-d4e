/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 — VISUAL VALIDATION & PERFORMANCE BENCHMARKS
 * Visual regression tests and performance monitoring for PBR materials
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import { getPBRLibrary } from './PBRMaterials';
import { ALL_PRESETS } from './MaterialPresets';
import { getTextureLoader } from './TextureLoader';

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE BENCHMARKS
// ═══════════════════════════════════════════════════════════════════════════════

export interface PerformanceBenchmark {
  name: string;
  duration: number;
  fps: number;
  memoryUsage: number;
  status: 'pass' | 'fail' | 'warning';
}

export class PBRPerformanceMonitor {
  private benchmarks: PerformanceBenchmark[] = [];
  private frameCount = 0;
  private lastFrameTime = 0;
  private fpsHistory: number[] = [];

  /**
   * Benchmark material loading
   */
  async benchmarkMaterialLoading(): Promise<PerformanceBenchmark> {
    console.log('🔬 Benchmarking material loading...');
    
    const library = getPBRLibrary();
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    await library.preloadMaterials(ALL_PRESETS);

    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();
    const duration = endTime - startTime;
    const memoryDelta = endMemory - startMemory;

    const benchmark: PerformanceBenchmark = {
      name: 'Material Loading (18 presets)',
      duration,
      fps: 0,
      memoryUsage: memoryDelta,
      status: duration < 2000 ? 'pass' : duration < 5000 ? 'warning' : 'fail',
    };

    this.benchmarks.push(benchmark);
    console.log(`  ✅ Duration: ${duration.toFixed(2)}ms`);
    console.log(`  📊 Memory: +${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
    
    return benchmark;
  }

  /**
   * Benchmark rendering performance
   */
  async benchmarkRendering(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    frames: number = 60
  ): Promise<PerformanceBenchmark> {
    console.log(`🔬 Benchmarking rendering (${frames} frames)...`);
    
    this.frameCount = 0;
    this.fpsHistory = [];
    this.lastFrameTime = performance.now();

    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    // Render frames
    for (let i = 0; i < frames; i++) {
      const frameStart = performance.now();
      renderer.render(scene, camera);
      const frameEnd = performance.now();
      
      const frameDuration = frameEnd - frameStart;
      const fps = 1000 / frameDuration;
      this.fpsHistory.push(fps);
      this.frameCount++;
    }

    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();
    const duration = endTime - startTime;
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    const benchmark: PerformanceBenchmark = {
      name: `Rendering (${frames} frames)`,
      duration,
      fps: avgFps,
      memoryUsage: endMemory - startMemory,
      status: avgFps >= 60 ? 'pass' : avgFps >= 30 ? 'warning' : 'fail',
    };

    this.benchmarks.push(benchmark);
    console.log(`  ✅ Avg FPS: ${avgFps.toFixed(2)}`);
    console.log(`  ⏱️ Duration: ${duration.toFixed(2)}ms`);
    
    return benchmark;
  }

  /**
   * Get memory usage (rough estimate)
   */
  private getMemoryUsage(): number {
    if (performance && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Get all benchmarks
   */
  getBenchmarks(): PerformanceBenchmark[] {
    return this.benchmarks;
  }

  /**
   * Print benchmark report
   */
  printReport(): void {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          CHE·NU™ V41 — PERFORMANCE REPORT                   ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    this.benchmarks.forEach((bench, i) => {
      const statusIcon = bench.status === 'pass' ? '✅' : bench.status === 'warning' ? '⚠️' : '❌';
      console.log(`${i + 1}. ${statusIcon} ${bench.name}`);
      console.log(`   Duration: ${bench.duration.toFixed(2)}ms`);
      if (bench.fps > 0) {
        console.log(`   FPS: ${bench.fps.toFixed(2)}`);
      }
      if (bench.memoryUsage > 0) {
        console.log(`   Memory: +${(bench.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }
      console.log('');
    });

    const passCount = this.benchmarks.filter(b => b.status === 'pass').length;
    const warnCount = this.benchmarks.filter(b => b.status === 'warning').length;
    const failCount = this.benchmarks.filter(b => b.status === 'fail').length;

    console.log(`Summary: ${passCount} pass, ${warnCount} warning, ${failCount} fail`);
    console.log('══════════════════════════════════════════════════════════════\n');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface VisualCheckResult {
  materialId: string;
  checks: {
    hasColor: boolean;
    hasNormal: boolean;
    hasRoughness: boolean;
    hasMetalness: boolean;
    isTransparent: boolean;
    texturesLoaded: number;
  };
  status: 'pass' | 'fail';
}

export class VisualValidator {
  /**
   * Validate a single material
   */
  async validateMaterial(materialId: string): Promise<VisualCheckResult> {
    const library = getPBRLibrary();
    const material = library.getMaterial(materialId);

    if (!material) {
      return {
        materialId,
        checks: {
          hasColor: false,
          hasNormal: false,
          hasRoughness: false,
          hasMetalness: false,
          isTransparent: false,
          texturesLoaded: 0,
        },
        status: 'fail',
      };
    }

    const checks = {
      hasColor: material.color !== undefined && material.color !== null,
      hasNormal: material.normalMap !== undefined && material.normalMap !== null,
      hasRoughness: material.roughnessMap !== undefined || material.roughness !== undefined,
      hasMetalness: material.metalnessMap !== undefined || material.metalness !== undefined,
      isTransparent: material.transparent === true,
      texturesLoaded: this.countLoadedTextures(material),
    };

    const status = checks.hasColor && checks.hasRoughness ? 'pass' : 'fail';

    return { materialId, checks, status };
  }

  /**
   * Count loaded textures in material
   */
  private countLoadedTextures(material: THREE.MeshStandardMaterial): number {
    let count = 0;
    if (material.map) count++;
    if (material.normalMap) count++;
    if (material.roughnessMap) count++;
    if (material.metalnessMap) count++;
    if (material.aoMap) count++;
    return count;
  }

  /**
   * Validate all 18 presets
   */
  async validateAllPresets(): Promise<VisualCheckResult[]> {
    console.log('🔍 Validating all 18 presets...');
    
    const library = getPBRLibrary();
    await library.preloadMaterials(ALL_PRESETS);

    const results: VisualCheckResult[] = [];
    
    for (const preset of ALL_PRESETS) {
      const result = await this.validateMaterial(preset.id);
      results.push(result);
      
      const icon = result.status === 'pass' ? '✅' : '❌';
      console.log(`  ${icon} ${preset.name} (${result.checks.texturesLoaded} textures)`);
    }

    const passCount = results.filter(r => r.status === 'pass').length;
    console.log(`\n✅ Validation: ${passCount}/18 materials passed\n`);

    return results;
  }

  /**
   * Print validation report
   */
  printReport(results: VisualCheckResult[]): void {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          CHE·NU™ V41 — VISUAL VALIDATION REPORT             ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    results.forEach((result, i) => {
      const statusIcon = result.status === 'pass' ? '✅' : '❌';
      console.log(`${i + 1}. ${statusIcon} ${result.materialId}`);
      console.log(`   Color: ${result.checks.hasColor ? '✓' : '✗'}`);
      console.log(`   Normal: ${result.checks.hasNormal ? '✓' : '✗'}`);
      console.log(`   Roughness: ${result.checks.hasRoughness ? '✓' : '✗'}`);
      console.log(`   Metalness: ${result.checks.hasMetalness ? '✓' : '✗'}`);
      console.log(`   Textures loaded: ${result.checks.texturesLoaded}`);
      console.log('');
    });

    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;

    console.log(`Summary: ${passCount} pass, ${failCount} fail`);
    console.log('══════════════════════════════════════════════════════════════\n');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE COMPATIBILITY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

export class MobileCompatibilityTester {
  /**
   * Test mobile performance
   */
  async testMobilePerformance(): Promise<{
    isCompatible: boolean;
    warnings: string[];
    memoryUsage: number;
  }> {
    const warnings: string[] = [];
    const textureLoader = getTextureLoader();
    const stats = textureLoader.getStats();
    const memoryMB = textureLoader.getMemoryUsage() / (1024 * 1024);

    // Check memory usage
    if (memoryMB > 50) {
      warnings.push(`High memory usage: ${memoryMB.toFixed(2)}MB (recommend <50MB for mobile)`);
    }

    // Check texture count
    if (stats.cacheSize > 50) {
      warnings.push(`Many cached textures: ${stats.cacheSize} (recommend <50 for mobile)`);
    }

    const isCompatible = warnings.length === 0;

    return {
      isCompatible,
      warnings,
      memoryUsage: memoryMB,
    };
  }

  /**
   * Print mobile compatibility report
   */
  printReport(result: { isCompatible: boolean; warnings: string[]; memoryUsage: number }): void {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          CHE·NU™ V41 — MOBILE COMPATIBILITY                 ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const icon = result.isCompatible ? '✅' : '⚠️';
    console.log(`${icon} Mobile Compatible: ${result.isCompatible ? 'YES' : 'WITH WARNINGS'}`);
    console.log(`Memory Usage: ${result.memoryUsage.toFixed(2)}MB\n`);

    if (result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }

    console.log('══════════════════════════════════════════════════════════════\n');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE VALIDATION SUITE
// ═══════════════════════════════════════════════════════════════════════════════

export async function runCompleteValidation(
  renderer?: THREE.WebGLRenderer,
  scene?: THREE.Scene,
  camera?: THREE.Camera
): Promise<{
  performance: PerformanceBenchmark[];
  visual: VisualCheckResult[];
  mobile: { isCompatible: boolean; warnings: string[]; memoryUsage: number };
  overallStatus: 'pass' | 'warning' | 'fail';
}> {
  console.log('\n🚀 Running complete PBR Materials validation suite...\n');

  // Performance benchmarks
  const perfMonitor = new PBRPerformanceMonitor();
  const loadBenchmark = await perfMonitor.benchmarkMaterialLoading();
  
  let renderBenchmark: PerformanceBenchmark | null = null;
  if (renderer && scene && camera) {
    renderBenchmark = await perfMonitor.benchmarkRendering(renderer, scene, camera);
  }

  perfMonitor.printReport();

  // Visual validation
  const visualValidator = new VisualValidator();
  const visualResults = await visualValidator.validateAllPresets();
  visualValidator.printReport(visualResults);

  // Mobile compatibility
  const mobileTester = new MobileCompatibilityTester();
  const mobileResult = await mobileTester.testMobilePerformance();
  mobileTester.printReport(mobileResult);

  // Overall status
  const performancePassed = loadBenchmark.status === 'pass';
  const visualPassed = visualResults.filter(r => r.status === 'pass').length === visualResults.length;
  const mobilePassed = mobileResult.isCompatible;

  let overallStatus: 'pass' | 'warning' | 'fail';
  if (performancePassed && visualPassed && mobilePassed) {
    overallStatus = 'pass';
  } else if (performancePassed && visualPassed) {
    overallStatus = 'warning';
  } else {
    overallStatus = 'fail';
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                     OVERALL RESULT                          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  const icon = overallStatus === 'pass' ? '✅' : overallStatus === 'warning' ? '⚠️' : '❌';
  console.log(`${icon} Overall Status: ${overallStatus.toUpperCase()}\n`);

  return {
    performance: perfMonitor.getBenchmarks(),
    visual: visualResults,
    mobile: mobileResult,
    overallStatus,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  PBRPerformanceMonitor,
  VisualValidator,
  MobileCompatibilityTester,
  runCompleteValidation,
};
