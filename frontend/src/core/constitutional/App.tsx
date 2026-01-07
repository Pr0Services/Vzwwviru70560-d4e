/* =====================================================
   CHE·NU — Application Entry Point
   App.tsx
   ===================================================== */

import React, { useState } from 'react';
import { UniverseView } from './views/UniverseView';
import { MeetingRoom } from './ui/meetings/MeetingRoom';
import { Meeting } from './core/meetings/meeting.types';
import { createMeeting } from './core/meetings/meeting.logic';

type AppView = 'universe' | 'meeting';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('universe');
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);

  const handleStartMeeting = () => {
    const newMeeting = createMeeting(
      'Strategic Planning Session',
      'Define Q1 2025 priorities and resource allocation',
      {
        requireHumanDecision: true,
        autoAdvancePhases: false,
      }
    );
    setActiveMeeting(newMeeting);
    setCurrentView('meeting');
  };

  const handleUpdateMeeting = (updated: Meeting) => {
    setActiveMeeting(updated);
  };

  const handleCloseMeeting = () => {
    setActiveMeeting(null);
    setCurrentView('universe');
  };

  return (
    <>
      {currentView === 'universe' && <UniverseView />}
      
      {currentView === 'meeting' && activeMeeting && (
        <MeetingRoom
          meeting={activeMeeting}
          onUpdateMeeting={handleUpdateMeeting}
          onClose={handleCloseMeeting}
        />
      )}

      {/* Dev: Quick action to start meeting */}
      {currentView === 'universe' && (
        <button
          onClick={handleStartMeeting}
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            padding: '12px 24px',
            background: '#D8B26A',
            border: 'none',
            borderRadius: 8,
            color: '#1A1A1A',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(216, 178, 106, 0.3)',
            zIndex: 50,
          }}
        >
          🎬 Start Meeting
        </button>
      )}
    </>
  );
};

export default App;
