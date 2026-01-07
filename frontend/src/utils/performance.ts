/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — PERFORMANCE UTILITIES                           ║
 * ║                    Sprint B2.5: Web Vitals & Performance                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
  id?: string
}

type MetricHandler = (metric: PerformanceMetric) => void

// ============================================================================
// WEB VITALS THRESHOLDS
// ============================================================================

const THRESHOLDS = {
  // Largest Contentful Paint
  LCP: { good: 2500, poor: 4000 },
  // First Input Delay
  FID: { good: 100, poor: 300 },
  // Cumulative Layout Shift
  CLS: { good: 0.1, poor: 0.25 },
  // First Contentful Paint
  FCP: { good: 1800, poor: 3000 },
  // Time to First Byte
  TTFB: { good: 800, poor: 1800 },
  // Interaction to Next Paint
  INP: { good: 200, poor: 500 },
} as const

// ============================================================================
// RATING HELPERS
// ============================================================================

function getRating(
  name: keyof typeof THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// ============================================================================
// WEB VITALS OBSERVER
// ============================================================================

/**
 * Observe Core Web Vitals using Performance Observer API
 */
export function observeWebVitals(onMetric: MetricHandler): () => void {
  const observers: PerformanceObserver[] = []
  
  // LCP - Largest Contentful Paint
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      
      if (lastEntry) {
        onMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
          id: lastEntry.id,
        })
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    observers.push(lcpObserver)
  } catch (e) {
    // Not supported
  }
  
  // FID - First Input Delay
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const firstEntry = entries[0] as any
      
      if (firstEntry) {
        const fid = firstEntry.processingStart - firstEntry.startTime
        onMetric({
          name: 'FID',
          value: fid,
          rating: getRating('FID', fid),
        })
      }
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
    observers.push(fidObserver)
  } catch (e) {
    // Not supported
  }
  
  // CLS - Cumulative Layout Shift
  try {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      
      onMetric({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
      })
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
    observers.push(clsObserver)
  } catch (e) {
    // Not supported
  }
  
  // FCP - First Contentful Paint
  try {
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const fcpEntry = entries.find(e => e.name === 'first-contentful-paint')
      
      if (fcpEntry) {
        onMetric({
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: getRating('FCP', fcpEntry.startTime),
        })
      }
    })
    fcpObserver.observe({ type: 'paint', buffered: true })
    observers.push(fcpObserver)
  } catch (e) {
    // Not supported
  }
  
  // TTFB - Time to First Byte
  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navEntry) {
      const ttfb = navEntry.responseStart - navEntry.requestStart
      onMetric({
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
      })
    }
  } catch (e) {
    // Not supported
  }
  
  // Cleanup function
  return () => {
    observers.forEach(o => o.disconnect())
  }
}

// ============================================================================
// RESOURCE TIMING
// ============================================================================

interface ResourceTiming {
  name: string
  type: string
  duration: number
  size: number
  cached: boolean
}

/**
 * Get resource timing data for analysis
 */
export function getResourceTimings(): ResourceTiming[] {
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  return entries.map(entry => ({
    name: entry.name.split('/').pop() || entry.name,
    type: getResourceType(entry.initiatorType),
    duration: entry.duration,
    size: entry.transferSize,
    cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
  }))
}

function getResourceType(initiatorType: string): string {
  const typeMap: Record<string, string> = {
    script: 'JS',
    link: 'CSS',
    img: 'Image',
    fetch: 'API',
    xmlhttprequest: 'API',
    other: 'Other',
  }
  return typeMap[initiatorType] || initiatorType
}

// ============================================================================
// BUNDLE SIZE ANALYZER
// ============================================================================

interface BundleStats {
  totalSize: number
  jsSize: number
  cssSize: number
  imageSize: number
  otherSize: number
  resources: ResourceTiming[]
}

/**
 * Analyze current page bundle sizes
 */
export function analyzeBundleSize(): BundleStats {
  const resources = getResourceTimings()
  
  const stats: BundleStats = {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    otherSize: 0,
    resources,
  }
  
  for (const resource of resources) {
    stats.totalSize += resource.size
    
    switch (resource.type) {
      case 'JS':
        stats.jsSize += resource.size
        break
      case 'CSS':
        stats.cssSize += resource.size
        break
      case 'Image':
        stats.imageSize += resource.size
        break
      default:
        stats.otherSize += resource.size
    }
  }
  
  return stats
}

/**
 * Check if bundle size is within limits
 */
export function checkBundleLimits(limits: {
  totalKB?: number
  jsKB?: number
  cssKB?: number
}): { passed: boolean; violations: string[] } {
  const stats = analyzeBundleSize()
  const violations: string[] = []
  
  if (limits.totalKB && stats.totalSize > limits.totalKB * 1024) {
    violations.push(`Total size (${formatBytes(stats.totalSize)}) exceeds ${limits.totalKB}KB`)
  }
  if (limits.jsKB && stats.jsSize > limits.jsKB * 1024) {
    violations.push(`JS size (${formatBytes(stats.jsSize)}) exceeds ${limits.jsKB}KB`)
  }
  if (limits.cssKB && stats.cssSize > limits.cssKB * 1024) {
    violations.push(`CSS size (${formatBytes(stats.cssSize)}) exceeds ${limits.cssKB}KB`)
  }
  
  return {
    passed: violations.length === 0,
    violations,
  }
}

// ============================================================================
// PERFORMANCE MARKS
// ============================================================================

/**
 * Mark a performance point for measurement
 */
export function markPerformance(name: string): void {
  try {
    performance.mark(`chenu:${name}`)
  } catch (e) {
    // Fallback for unsupported browsers
    console.debug(`[Perf] Mark: ${name}`)
  }
}

/**
 * Measure between two marks
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark?: string
): number | null {
  try {
    const measureName = `chenu:measure:${name}`
    const start = `chenu:${startMark}`
    const end = endMark ? `chenu:${endMark}` : undefined
    
    performance.measure(measureName, start, end)
    
    const entries = performance.getEntriesByName(measureName)
    const duration = entries[entries.length - 1]?.duration
    
    return duration ?? null
  } catch (e) {
    return null
  }
}

/**
 * Clear performance marks and measures
 */
export function clearPerformanceMarks(): void {
  try {
    performance.clearMarks()
    performance.clearMeasures()
  } catch (e) {
    // Ignore
  }
}

// ============================================================================
// COMPONENT RENDER TIMING
// ============================================================================

/**
 * HOC to track component render time
 */
export function withRenderTiming<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return function TimedComponent(props: P) {
    const startTime = performance.now()
    
    React.useEffect(() => {
      const duration = performance.now() - startTime
      if (duration > 16) { // Log if render took > 1 frame
        console.debug(`[Perf] ${componentName} render: ${duration.toFixed(2)}ms`)
      }
    })
    
    return React.createElement(Component, props)
  }
}

// We need to import React for the HOC
import React from 'react'

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format milliseconds to human readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

// ============================================================================
// PERFORMANCE REPORT
// ============================================================================

interface PerformanceReport {
  timestamp: number
  url: string
  webVitals: Record<string, PerformanceMetric>
  bundle: BundleStats
  navigation: {
    domContentLoaded: number
    load: number
    firstPaint: number
  }
}

/**
 * Generate comprehensive performance report
 */
export function generatePerformanceReport(): Promise<PerformanceReport> {
  return new Promise((resolve) => {
    const report: PerformanceReport = {
      timestamp: Date.now(),
      url: window.location.href,
      webVitals: {},
      bundle: analyzeBundleSize(),
      navigation: {
        domContentLoaded: 0,
        load: 0,
        firstPaint: 0,
      },
    }
    
    // Get navigation timing
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navEntry) {
      report.navigation = {
        domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.startTime,
        load: navEntry.loadEventEnd - navEntry.startTime,
        firstPaint: 0,
      }
    }
    
    // Get first paint
    const paintEntries = performance.getEntriesByType('paint')
    const fpEntry = paintEntries.find(e => e.name === 'first-paint')
    if (fpEntry) {
      report.navigation.firstPaint = fpEntry.startTime
    }
    
    // Collect web vitals
    const cleanup = observeWebVitals((metric) => {
      report.webVitals[metric.name] = metric
    })
    
    // Wait a bit for async metrics
    setTimeout(() => {
      cleanup()
      resolve(report)
    }, 1000)
  })
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  THRESHOLDS,
  type PerformanceMetric,
  type MetricHandler,
  type ResourceTiming,
  type BundleStats,
  type PerformanceReport,
}
