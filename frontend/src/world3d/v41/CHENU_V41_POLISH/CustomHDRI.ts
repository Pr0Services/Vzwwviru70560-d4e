/**
 * CHE·NU™ — CustomHDRI Stub
 */
export interface HDRIConfig {
  url: string;
  intensity: number;
}
export const loadCustomHDRI = (config: HDRIConfig) => logger.debug('Loading HDRI:', config);
export const HDRI_PRESETS = {
  studio: { url: '/hdri/studio.hdr', intensity: 1.0 },
  sunset: { url: '/hdri/sunset.hdr', intensity: 0.8 },
};
