/**
 * CHE·NU™ VERTICAL INDUSTRY PACKS
 * 
 * Domain-specific configurations that adapt CHE·NU
 * without modifying its core architecture.
 * 
 * One core. Many lenses.
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 */

// Types
export * from './vertical-packs.types';

// Foundation Packs
export { CREATIVE_STUDIO_PACK } from './packs/creative-studio.pack';

// Pack Registry (to be expanded)
import { CREATIVE_STUDIO_PACK } from './packs/creative-studio.pack';
import type { VerticalIndustryPack } from './vertical-packs.types';

export const AVAILABLE_PACKS: Record<string, VerticalIndustryPack> = {
  creative_studio: CREATIVE_STUDIO_PACK,
  // construction_engineering: Coming soon
  // startup_strategy: Coming soon
  // education_research: Coming soon
  // health_wellness: Coming soon
};

export function getPack(id: string): VerticalIndustryPack | undefined {
  return AVAILABLE_PACKS[id];
}

export function listPacks(): VerticalIndustryPack[] {
  return Object.values(AVAILABLE_PACKS);
}
