/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — APP CANONICAL (MAIN INTEGRATION)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLES D'INTERFACE:
 * - Une SPHÈRE active à la fois
 * - Un BUREAU visible à la fois
 * - Le Workspace est TRANSVERSAL
 * - Nova / Orchestrateur toujours accessibles
 * 
 * Principe de layout:
 * - Réduire la charge cognitive
 * - Pas de dumping de fonctionnalités
 * - Contexte d'abord, action ensuite
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';

// Canonical imports
import { SphereId, ALL_SPHERES, SphereNode } from '../canonical/SPHERES_CANONICAL_V2';
import { MeetingType } from '../canonical/MEETING_TYPES_CANONICAL';

// Components
import { UniverseViewCanonical } from './UniverseView';
import { BureauCanonical, BureauSectionId } from './Bureau/BureauCanonical';
import { SystemChannelButton } from './SystemChannel/SystemChannelButton';
import { SystemChannelPanel } from './SystemChannel/SystemChannelPanel';
import { MeetingUI } from './Meeting/UI/MeetingUI';
import { PostMeetingMemory } from './Meeting/Memory/PostMeetingMemory';

// Hooks
import { useMeeting } from '../hooks/useMeeting';
import { useSystemChannel } from '../hooks/useSystemChannel';

type AppView = 'universe' | 'bureau' | 'meeting' | 'post_meeting';

interface AppCanonicalProps {
  userId: string;
  language?: 'en' | 'fr';
}

export const AppCanonical: React.FC<AppCanonicalProps> = ({
  userId,
  language = 'fr'
}) => {
  // App State
  const [currentView, setCurrentView] = useState<AppView>('universe');
  const [activeSphereId, setActiveSphereId] = useState<SphereId>('personal');
  const [activeBureauSection, setActiveBureauSection] = useState<BureauSectionId>('dashboard');

  // Hooks
  const meeting = useMeeting();
  const systemChannel = useSystemChannel((type, spheres) => {
    handleStartMeeting(type, spheres, `Meeting ${type}`);
  });

  // Get active sphere
  const activeSphere = ALL_SPHERES.find(s => s.id === activeSphereId);

  /**
   * Handle sphere selection
   */
  const handleSphereClick = useCallback((sphereId: string) => {
    setActiveSphereId(sphereId as SphereId);
    setCurrentView('bureau');
    setActiveBureauSection('dashboard');
  }, []);

  /**
   * Handle back to universe
   */
  const handleBackToUniverse = useCallback(() => {
    setCurrentView('universe');
  }, []);

  /**
   * Handle start meeting
   */
  const handleStartMeeting = useCallback((
    type: MeetingType,
    spheres: SphereId[],
    objective: string
  ) => {
    meeting.startMeeting(type, spheres, objective);
    setCurrentView('meeting');
  }, [meeting]);

  /**
   * Handle meeting close
   */
  const handleMeetingClose = useCallback(() => {
    // Generate memory entries before closing
    meeting.generateMemoryEntries();
    setCurrentView('post_meeting');
  }, [meeting]);

  /**
   * Handle post-meeting close
   */
  const handlePostMeetingClose = useCallback(() => {
    meeting.closeMeeting();
    setCurrentView('bureau');
  }, [meeting]);

  /**
   * Handle validate memory entries
   */
  const handleValidateMemory = useCallback((entryIds: string[]) => {
    meeting.validateMemoryEntries(entryIds);
  }, [meeting]);

  const labels = {
    en: {
      systemChannel: 'System Channel',
      appTitle: 'CHE·NU'
    },
    fr: {
      systemChannel: 'Canal Système',
      appTitle: 'CHE·NU'
    }
  };

  const t = labels[language];

  return (
    <div
      className="app-canonical"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#1E1F22',
        color: '#E9E4D6'
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid #3A3B3E',
          background: '#2A2B2E'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🌟</span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#D8B26A',
              letterSpacing: '2px'
            }}
          >
            {t.appTitle}™
          </span>
        </div>

        {/* Current Context */}
        {currentView !== 'universe' && activeSphere && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: '#1E1F22',
              borderRadius: '6px'
            }}
          >
            <span style={{ fontSize: '16px' }}>{activeSphere.visual.emoji}</span>
            <span style={{ fontSize: '13px' }}>
              {language === 'fr' ? activeSphere.labelFr : activeSphere.label}
            </span>
          </div>
        )}

        {/* System Channel Button - ALWAYS VISIBLE */}
        <SystemChannelButton
          isOpen={systemChannel.isOpen}
          onClick={systemChannel.isOpen ? systemChannel.close : systemChannel.open}
          language={language}
        />
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Universe View */}
        {currentView === 'universe' && (
          <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
            <UniverseViewCanonical
              userId={userId}
              onSphereClick={handleSphereClick}
              language={language}
            />
          </div>
        )}

        {/* Bureau View */}
        {currentView === 'bureau' && (
          <BureauCanonical
            sphereId={activeSphereId}
            userId={userId}
            activeSection={activeBureauSection}
            onSectionChange={setActiveBureauSection}
            onBack={handleBackToUniverse}
            language={language}
          />
        )}

        {/* Meeting View */}
        {currentView === 'meeting' && meeting.currentMeeting && (
          <MeetingUI
            meetingId={meeting.currentMeeting.id}
            meetingType={meeting.currentMeeting.type}
            objective={meeting.currentMeeting.objective}
            scope={meeting.currentMeeting.scope}
            spheres={meeting.currentMeeting.spheres}
            participants={meeting.currentMeeting.agents}
            onValidate={meeting.validateProposals}
            onClose={handleMeetingClose}
            language={language}
          />
        )}

        {/* Post-Meeting Memory View */}
        {currentView === 'post_meeting' && meeting.currentMeeting && (
          <PostMeetingMemory
            meetingId={meeting.currentMeeting.id}
            meetingType={meeting.currentMeeting.type}
            meetingTitle={meeting.currentMeeting.title}
            proposedEntries={meeting.memoryEntries}
            onValidateEntries={handleValidateMemory}
            onRejectEntry={meeting.rejectMemoryEntry}
            onEditEntry={(id, content) => {}}
            onChangeDestination={(id, dest) => {}}
            onClose={handlePostMeetingClose}
            language={language}
          />
        )}

        {/* System Channel Panel */}
        <SystemChannelPanel
          isOpen={systemChannel.isOpen}
          onClose={systemChannel.close}
          activeSphere={activeSphereId}
          userId={userId}
          onStartMeeting={(type, spheres) => handleStartMeeting(type, spheres, `Meeting ${type}`)}
          language={language}
        />
      </main>

      {/* Footer Status Bar */}
      <footer
        style={{
          padding: '8px 20px',
          borderTop: '1px solid #3A3B3E',
          background: '#2A2B2E',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#8D8371'
        }}
      >
        <div>
          {language === 'fr' ? 'Gouvernance' : 'Governance'}: ✓ {language === 'fr' ? 'Active' : 'Active'}
        </div>
        <div>
          Nova: 🌟 {language === 'fr' ? 'Connectée' : 'Connected'}
        </div>
        <div>
          v51.0 Canonical
        </div>
      </footer>
    </div>
  );
};

export default AppCanonical;
