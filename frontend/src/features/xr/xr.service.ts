/**
 * CHE·NU — XR / SPATIAL SERVICE
 * ============================================================
 * Manages spatial computing sessions, surfaces, and interactions.
 * 
 * GOVERNANCE COMPLIANT:
 * - Uses same APIs as 2D
 * - Same scope, budget, confirmation guards
 * - No XR-only shortcuts
 * 
 * @version 1.0.0
 */

import {
  XRSession,
  XRDeviceType,
  XRMode,
  XRCapabilities,
  XRSettings,
  XRSurfaces,
  XRSurfaceNova,
  XRSurfaceContext,
  XRSurfaceWorkspace,
  XRPanel,
  XRDocument,
  XRPosition,
  XRInteraction,
  InteractionType,
  XRMeeting,
  XRParticipant,
  XRPerformanceMetrics,
  XRFallbackConfig,
  DEFAULT_FALLBACK_CONFIG
} from './xr.types';

// ============================================================
// SERVICE
// ============================================================

export class XRService {
  private session: XRSession | null = null;
  private fallbackConfig: XRFallbackConfig = DEFAULT_FALLBACK_CONFIG;
  private performanceMonitorId: number | null = null;
  
  // ──────────────────────────────────────────────────────────
  // SESSION MANAGEMENT
  // ──────────────────────────────────────────────────────────
  
  async startSession(
    mode: XRMode,
    deviceType: XRDeviceType
  ): Promise<XRSession> {
    // Check if XR is available
    if (!this.isXRAvailable()) {
      throw new Error('XR is not available on this device');
    }
    
    // Detect capabilities
    const capabilities = await this.detectCapabilities(deviceType);
    
    // Create session
    this.session = {
      id: `xr_${Date.now()}`,
      deviceType,
      deviceCapabilities: capabilities,
      mode,
      immersionLevel: 'partial',
      surfaces: this.createDefaultSurfaces(),
      isActive: true,
      isPaused: false,
      frameRate: 72,
      comfortScore: 100,
      settings: this.getDefaultSettings(),
      startedAt: new Date(),
      lastActiveAt: new Date()
    };
    
    // Start performance monitoring
    this.startPerformanceMonitoring();
    
    return this.session;
  }
  
  async endSession(): Promise<void> {
    if (!this.session) return;
    
    // Stop monitoring
    this.stopPerformanceMonitoring();
    
    // Save session metrics
    await this.saveSessionMetrics();
    
    this.session = null;
  }
  
  pauseSession(): void {
    if (this.session) {
      this.session.isPaused = true;
    }
  }
  
  resumeSession(): void {
    if (this.session) {
      this.session.isPaused = false;
      this.session.lastActiveAt = new Date();
    }
  }
  
  getSession(): XRSession | null {
    return this.session;
  }
  
  isXRAvailable(): boolean {
    // Check for WebXR support
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      return true;
    }
    return false;
  }
  
  // ──────────────────────────────────────────────────────────
  // CAPABILITIES DETECTION
  // ──────────────────────────────────────────────────────────
  
  private async detectCapabilities(deviceType: XRDeviceType): Promise<XRCapabilities> {
    // Default capabilities based on device type
    const defaults: Record<XRDeviceType, XRCapabilities> = {
      ar_glasses: {
        handTracking: true,
        eyeTracking: false,
        voiceInput: true,
        spatialAudio: true,
        passthrough: true,
        roomMapping: true
      },
      vr_headset: {
        handTracking: true,
        eyeTracking: true,
        voiceInput: true,
        spatialAudio: true,
        passthrough: true,
        roomMapping: true
      },
      spatial_desktop: {
        handTracking: false,
        eyeTracking: false,
        voiceInput: true,
        spatialAudio: true,
        passthrough: false,
        roomMapping: false
      },
      mixed_reality: {
        handTracking: true,
        eyeTracking: true,
        voiceInput: true,
        spatialAudio: true,
        passthrough: true,
        roomMapping: true
      },
      phone_ar: {
        handTracking: false,
        eyeTracking: false,
        voiceInput: true,
        spatialAudio: false,
        passthrough: true,
        roomMapping: true
      }
    };
    
    return defaults[deviceType];
  }
  
  // ──────────────────────────────────────────────────────────
  // SURFACES
  // ──────────────────────────────────────────────────────────
  
  private createDefaultSurfaces(): XRSurfaces {
    return {
      nova: {
        isVisible: false,  // Hidden by default
        position: { x: -1, y: 1.5, z: -1.5 },
        displayMode: 'hidden',
        scale: 0.3,        // Never dominant
        followsGaze: false,
        animationLevel: 'minimal'
      },
      context: {
        isVisible: true,
        position: { x: 0, y: 1.6, z: -1 },
        panels: [],
        layout: 'arc',
        spacing: 0.2
      },
      workspace: {
        isVisible: true,
        position: { x: 0, y: 1.4, z: -1.2 },
        canvasSize: { width: 2, height: 1.5 },
        canvasPosition: { x: 0, y: 1.4, z: -1.2 },
        documents: []
      }
    };
  }
  
  // Nova surface
  showNova(displayMode: XRSurfaceNova['displayMode'] = 'text_panel'): void {
    if (!this.session) return;
    
    this.session.surfaces.nova.isVisible = true;
    this.session.surfaces.nova.displayMode = displayMode;
    
    // Enforce constraints: never dominant
    this.session.surfaces.nova.scale = Math.min(this.session.surfaces.nova.scale, 0.5);
    this.session.surfaces.nova.followsGaze = false;
  }
  
  hideNova(): void {
    if (!this.session) return;
    this.session.surfaces.nova.isVisible = false;
    this.session.surfaces.nova.displayMode = 'hidden';
  }
  
  // Context panels
  addPanel(panel: Omit<XRPanel, 'id'>): XRPanel {
    if (!this.session) throw new Error('No active session');
    
    const newPanel: XRPanel = {
      ...panel,
      id: `panel_${Date.now()}`
    };
    
    this.session.surfaces.context.panels.push(newPanel);
    this.arrangeContextPanels();
    
    return newPanel;
  }
  
  removePanel(panelId: string): void {
    if (!this.session) return;
    
    this.session.surfaces.context.panels = 
      this.session.surfaces.context.panels.filter(p => p.id !== panelId);
    
    this.arrangeContextPanels();
  }
  
  private arrangeContextPanels(): void {
    if (!this.session) return;
    
    const { panels, layout, spacing } = this.session.surfaces.context;
    const center = this.session.surfaces.context.position;
    
    panels.forEach((panel, index) => {
      switch (layout) {
        case 'arc':
          const angle = (index - panels.length / 2) * 0.3;
          panel.position = {
            x: center.x + Math.sin(angle) * 1.5,
            y: center.y,
            z: center.z - Math.cos(angle) * 1.5,
            rotationY: -angle * (180 / Math.PI)
          };
          break;
        case 'grid':
          const col = index % 3;
          const row = Math.floor(index / 3);
          panel.position = {
            x: center.x + (col - 1) * (panel.size.width + spacing),
            y: center.y - row * (panel.size.height + spacing),
            z: center.z
          };
          break;
        case 'stack':
          panel.position = {
            x: center.x,
            y: center.y - index * (panel.size.height + spacing),
            z: center.z
          };
          break;
      }
    });
  }
  
  // Documents in workspace
  addDocument(documentId: string, position?: XRPosition): XRDocument {
    if (!this.session) throw new Error('No active session');
    
    const xrDoc: XRDocument = {
      id: `xrdoc_${Date.now()}`,
      documentId,
      position: position || this.getNextDocumentPosition(),
      size: { width: 0.6, height: 0.8 },
      displayMode: 'panel',
      isSelected: false,
      isFocused: false
    };
    
    this.session.surfaces.workspace.documents.push(xrDoc);
    
    return xrDoc;
  }
  
  removeDocument(xrDocId: string): void {
    if (!this.session) return;
    
    this.session.surfaces.workspace.documents = 
      this.session.surfaces.workspace.documents.filter(d => d.id !== xrDocId);
  }
  
  private getNextDocumentPosition(): XRPosition {
    if (!this.session) {
      return { x: 0, y: 1.4, z: -1 };
    }
    
    const docs = this.session.surfaces.workspace.documents;
    const offset = docs.length * 0.3;
    
    return {
      x: offset,
      y: 1.4,
      z: -1 - (docs.length % 2) * 0.2
    };
  }
  
  // ──────────────────────────────────────────────────────────
  // INTERACTIONS
  // ──────────────────────────────────────────────────────────
  
  processInteraction(interaction: XRInteraction): void {
    if (!this.session || this.session.isPaused) return;
    
    // GOVERNANCE: No gesture-only confirmations
    if (this.isConfirmationRequired(interaction)) {
      logger.warn('[XR] Gesture confirmations disabled per governance');
      return;
    }
    
    switch (interaction.type) {
      case 'select':
        this.handleSelect(interaction);
        break;
      case 'grab':
        this.handleGrab(interaction);
        break;
      case 'release':
        this.handleRelease(interaction);
        break;
      case 'resize':
        this.handleResize(interaction);
        break;
      case 'scroll':
        this.handleScroll(interaction);
        break;
    }
    
    this.session.lastActiveAt = new Date();
  }
  
  private isConfirmationRequired(interaction: XRInteraction): boolean {
    // Per spec: gesture-only confirmations are FORBIDDEN
    // All confirmations must be explicit and readable
    return false;
  }
  
  private handleSelect(interaction: XRInteraction): void {
    if (!interaction.targetId) return;
    
    // Update selection state
    if (this.session?.surfaces.workspace.documents) {
      for (const doc of this.session.surfaces.workspace.documents) {
        doc.isSelected = doc.id === interaction.targetId;
      }
    }
  }
  
  private handleGrab(interaction: XRInteraction): void {
    // Allow grabbing and moving panels/documents
  }
  
  private handleRelease(interaction: XRInteraction): void {
    // Release grabbed object
  }
  
  private handleResize(interaction: XRInteraction): void {
    // Resize panel/document
  }
  
  private handleScroll(interaction: XRInteraction): void {
    // Scroll content
  }
  
  // ──────────────────────────────────────────────────────────
  // PERFORMANCE MONITORING
  // ──────────────────────────────────────────────────────────
  
  private startPerformanceMonitoring(): void {
    this.performanceMonitorId = window.setInterval(() => {
      this.checkPerformance();
    }, 5000) as unknown as number;
  }
  
  private stopPerformanceMonitoring(): void {
    if (this.performanceMonitorId) {
      clearInterval(this.performanceMonitorId);
      this.performanceMonitorId = null;
    }
  }
  
  private checkPerformance(): void {
    if (!this.session) return;
    
    const metrics = this.getPerformanceMetrics();
    
    // Update session
    this.session.frameRate = metrics.frameRate;
    this.session.comfortScore = metrics.comfortScore;
    if (metrics.batteryLevel !== undefined) {
      this.session.batteryLevel = metrics.batteryLevel;
    }
    
    // Check for fallback conditions
    if (metrics.shouldExitXR) {
      this.triggerFallback(metrics.exitReason || 'Performance degradation');
    }
  }
  
  getPerformanceMetrics(): XRPerformanceMetrics {
    const session = this.session;
    if (!session) {
      return {
        frameRate: 0,
        latency: 0,
        trackingQuality: 'poor',
        sessionDuration: 0,
        comfortScore: 0,
        shouldReduceQuality: false,
        shouldExitXR: false
      };
    }
    
    // Calculate metrics
    const duration = Date.now() - session.startedAt.getTime();
    const frameRate = session.frameRate;
    const battery = session.batteryLevel;
    
    // Comfort degrades over time
    const timePenalty = Math.min(duration / (2 * 60 * 60 * 1000), 0.3); // Max 30% after 2h
    const comfortScore = Math.max(0, 100 - timePenalty * 100);
    
    // Determine if quality reduction or exit needed
    const shouldReduceQuality = frameRate < 60;
    const shouldExitXR = 
      frameRate < this.fallbackConfig.minFrameRate ||
      (battery !== undefined && battery < this.fallbackConfig.minBatteryLevel) ||
      comfortScore < 20;
    
    let exitReason: string | undefined;
    if (shouldExitXR) {
      if (frameRate < this.fallbackConfig.minFrameRate) {
        exitReason = 'Frame rate too low';
      } else if (battery !== undefined && battery < this.fallbackConfig.minBatteryLevel) {
        exitReason = 'Battery too low';
      } else if (comfortScore < 20) {
        exitReason = 'Extended session - take a break';
      }
    }
    
    return {
      frameRate,
      latency: 16, // Simulated
      trackingQuality: frameRate > 60 ? 'excellent' : frameRate > 40 ? 'good' : 'poor',
      sessionDuration: duration,
      comfortScore,
      batteryLevel: battery,
      shouldReduceQuality,
      shouldExitXR,
      exitReason
    };
  }
  
  private triggerFallback(reason: string): void {
    logger.debug(`[XR] Falling back to 2D: ${reason}`);
    
    if (this.fallbackConfig.notifyBeforeFallback) {
      // Notify user
      setTimeout(() => {
        this.endSession();
      }, this.fallbackConfig.notificationDelay);
    } else {
      this.endSession();
    }
  }
  
  // ──────────────────────────────────────────────────────────
  // SETTINGS
  // ──────────────────────────────────────────────────────────
  
  private getDefaultSettings(): XRSettings {
    return {
      comfortMode: true,
      reduceMotion: false,
      snapTurning: true,
      allowRoomMapping: false,     // OFF by default per spec
      allowEyeTracking: false,     // OFF by default per spec
      spatialAudioEnabled: false,  // OFF by default per spec
      brightness: 100,
      textScale: 1.0,
      panelDistance: 1.5,
      dominantHand: 'right',
      gestureConfirmations: false  // Always false per spec
    };
  }
  
  updateSettings(settings: Partial<XRSettings>): XRSettings {
    if (!this.session) {
      throw new Error('No active session');
    }
    
    // GOVERNANCE: gestureConfirmations must always be false
    if (settings.gestureConfirmations) {
      logger.warn('[XR] gestureConfirmations must be false per governance');
      settings.gestureConfirmations = false;
    }
    
    this.session.settings = {
      ...this.session.settings,
      ...settings
    };
    
    return this.session.settings;
  }
  
  // ──────────────────────────────────────────────────────────
  // PERSISTENCE
  // ──────────────────────────────────────────────────────────
  
  private async saveSessionMetrics(): Promise<void> {
    if (!this.session) return;
    
    const metrics = {
      sessionId: this.session.id,
      deviceType: this.session.deviceType,
      duration: Date.now() - this.session.startedAt.getTime(),
      averageFrameRate: this.session.frameRate,
      finalComfortScore: this.session.comfortScore
    };
    
    // Implementation: save to analytics
    logger.debug('[XR] Session metrics:', metrics);
  }
}

export const xrService = new XRService();
export default xrService;
