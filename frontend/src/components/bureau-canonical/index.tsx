/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — BUREAU CANONICAL INDEX                                ║
 * ║              6 Sections L2 — Architecture Gelée                              ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  STRUCTURE BUREAU (NON-NÉGOCIABLE):                                          ║
 * ║                                                                              ║
 * ║    1. ⚡ QuickCapture      - Capture rapide (500 car max)                    ║
 * ║    2. ▶️ ResumeWorkspace   - Reprendre le travail                            ║
 * ║    3. 💬 Threads           - Fils .chenu (FIRST-CLASS OBJECTS)               ║
 * ║    4. 📁 DataFiles         - Données/Fichiers                                ║
 * ║    5. 🤖 ActiveAgents      - Agents actifs + checkpoints                     ║
 * ║    6. 📅 Meetings          - Réunions avec gouvernance                       ║
 * ║                                                                              ║
 * ║  RAPPEL: Dashboard n'est PAS une section — c'est un MODE alternatif          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';

// Sections
import { QuickCaptureSection } from './QuickCaptureSection';
import { ResumeWorkspaceSection } from './ResumeWorkspaceSection';
import { ThreadsSection } from './ThreadsSection';
import { DataFilesSection } from './DataFilesSection';
import { ActiveAgentsSection } from './ActiveAgentsSection';
import { MeetingsSection } from './MeetingsSection';

// Types
import { BureauSectionId } from '../../types/bureau.types';
import { CHENU_COLORS } from '../../constants/colors';

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  QuickCaptureSection,
  ResumeWorkspaceSection,
  ThreadsSection,
  DataFilesSection,
  ActiveAgentsSection,
  MeetingsSection,
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU CONTENT ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

interface BureauContentCanonicalProps {
  section: BureauSectionId;
  sphereId: string;
}

/**
 * Routes to the correct section component based on section ID
 * Uses the canonical 6 sections from bureau.types.ts
 */
export const BureauContentCanonical: React.FC<BureauContentCanonicalProps> = ({
  section,
  sphereId,
}) => {
  switch (section) {
    case 'quickcapture':
      return <QuickCaptureSection sphereId={sphereId} />;
    
    case 'resumeworkspace':
      return <ResumeWorkspaceSection sphereId={sphereId} />;
    
    case 'threads':
      return <ThreadsSection sphereId={sphereId} />;
    
    case 'datafiles':
      return <DataFilesSection sphereId={sphereId} />;
    
    case 'activeagents':
      return <ActiveAgentsSection sphereId={sphereId} />;
    
    case 'meetings':
      return <MeetingsSection sphereId={sphereId} />;
    
    default:
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: CHENU_COLORS.ancientStone,
          gap: '16px',
        }}>
          <span style={{ fontSize: '48px' }}>⚠️</span>
          <p style={{ fontSize: '16px', color: CHENU_COLORS.softSand }}>
            Section non reconnue: {section}
          </p>
          <p style={{ fontSize: '12px' }}>
            Les sections valides sont: quick_capture, resume_workspace, threads, data_files, active_agents, meetings
          </p>
        </div>
      );
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

export { BureauLayoutCanonical } from './BureauLayoutCanonical';

export default BureauContentCanonical;
