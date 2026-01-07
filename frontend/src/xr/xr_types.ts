/**
 * CHE·NU™ — XR Types (Legacy Stub)
 */
export interface XRConfig {
  enabled: boolean;
  mode: 'vr' | 'ar' | 'mixed';
  quality: 'low' | 'medium' | 'high';
}
export interface XRSession {
  id: string;
  active: boolean;
  startTime: string;
}
export interface XRWorkspaceConfig {
  sphereId: string;
  layout: string;
  immersive: boolean;
}
export type XRMode = 'desktop' | 'vr' | 'ar';
