/**
 * ============================================================
 * CHE·NU — ARCHITECTURE UI INDEX
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * UI components for Architecture domain.
 */

export {
  BlueprintGridViewer,
  ZoneMapper,
  RoomRelationshipDiagram,
  type BlueprintGridCell,
  type SymbolicZone,
  type SymbolicRoom,
} from './ArchitectureComponents';

export const ARCHITECTURE_UI_INFO = {
  name: 'Architecture UI Components',
  version: '1.0.0',
  components: [
    'BlueprintGridViewer',
    'ZoneMapper',
    'RoomRelationshipDiagram',
  ],
  safe: true,
  representational: true,
};
