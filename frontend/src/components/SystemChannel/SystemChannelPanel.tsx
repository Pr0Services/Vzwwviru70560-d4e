/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SYSTEM CHANNEL PANEL (COMPLIANCE CORRECTED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * NOT a chat interface.
 * Explicit states: IDLE → INTENT → PROPOSAL
 * System NEVER initiates.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { 
  SystemChannelState,
  UserInput,
  IntentReformulation,
  SystemProposal,
  RESPONSE_TEMPLATES,
  STATE_TRANSITIONS
} from '../../canonical/SYSTEM_CHANNEL_CANONICAL';
import { SphereId } from '../../canonical/SPHERES_CANONICAL_V2';
import { MeetingType } from '../../canonical/MEETING_TYPES_CANONICAL';

interface SystemChannelPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeSphere: SphereId;
  userId: string;
  onStartMeeting: (type: MeetingType, spheres: SphereId[]) => void;
  language?: 'en' | 'fr';
}

export const SystemChannelPanel: React.FC<SystemChannelPanelProps> = ({
  isOpen,
  onClose,
  activeSphere,
  userId,
  onStartMeeting,
  language = 'fr'
}) => {
  // Explicit state machine
  const [state, setState] = useState<SystemChannelState>('idle');
  const [inputValue, setInputValue] = useState('');
  
  // Current data
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);
  const [currentIntent, setCurrentIntent] = useState<IntentReformulation | null>(null);
  const [currentProposal, setCurrentProposal] = useState<SystemProposal | null>(null);

  const t = RESPONSE_TEMPLATES;

  /**
   * Handle user input submission
   * Transitions: IDLE → INTENT
   */
  const handleSubmitInput = () => {
    if (!inputValue.trim() || state !== 'idle') return;

    const input: UserInput = {
      id: `input-${Date.now()}`,
      timestamp: Date.now(),
      raw: inputValue,
      activeSphere
    };

    setCurrentInput(input);
    setInputValue('');

    // Generate intent reformulation
    const intent = generateIntent(input);
    setCurrentIntent(intent);
    setState('intent');
  };

  /**
   * Generate intent from user input
   * NO chat, just structured reformulation
   */
  const generateIntent = (input: UserInput): IntentReformulation => {
    const lower = input.raw.toLowerCase();
    
    let actionType: 'simple' | 'meeting' | 'none' = 'none';
    let reformulated = input.raw;
    
    if (lower.includes('décision') || lower.includes('decision')) {
      actionType = 'meeting';
      reformulated = language === 'fr' 
        ? `Démarrer un meeting de décision dans ${input.activeSphere}`
        : `Start a decision meeting in ${input.activeSphere}`;
    } else if (lower.includes('réfléchir') || lower.includes('reflect')) {
      actionType = 'meeting';
      reformulated = language === 'fr'
        ? `Démarrer un meeting de réflexion dans ${input.activeSphere}`
        : `Start a reflection meeting in ${input.activeSphere}`;
    }

    return {
      id: `intent-${Date.now()}`,
      inputId: input.id,
      timestamp: Date.now(),
      reformulated,
      scope: [input.activeSphere],
      actionType,
      confirmed: false
    };
  };

  /**
   * Confirm intent
   * Transitions: INTENT → PROPOSAL (if action needed) or IDLE
   */
  const handleConfirmIntent = () => {
    if (!currentIntent || state !== 'intent') return;

    const confirmedIntent = {
      ...currentIntent,
      confirmed: true,
      confirmedAt: Date.now()
    };
    setCurrentIntent(confirmedIntent);

    if (confirmedIntent.actionType === 'meeting') {
      // Generate proposal
      const proposal: SystemProposal = {
        id: `proposal-${Date.now()}`,
        intentId: confirmedIntent.id,
        timestamp: Date.now(),
        type: 'meeting',
        meetingType: detectMeetingType(confirmedIntent.reformulated),
        meetingScope: confirmedIntent.scope,
        meetingObjective: confirmedIntent.reformulated,
        status: 'pending'
      };
      setCurrentProposal(proposal);
      setState('proposal');
    } else {
      // No action needed, return to idle
      resetToIdle();
    }
  };

  /**
   * Cancel intent
   * Transitions: INTENT → IDLE
   */
  const handleCancelIntent = () => {
    resetToIdle();
  };

  /**
   * Accept proposal
   * Transitions: PROPOSAL → CLOSED (execute)
   */
  const handleAcceptProposal = () => {
    if (!currentProposal || state !== 'proposal') return;

    if (currentProposal.type === 'meeting' && currentProposal.meetingType && currentProposal.meetingScope) {
      onStartMeeting(currentProposal.meetingType, currentProposal.meetingScope);
    }

    setCurrentProposal({ ...currentProposal, status: 'accepted', decidedAt: Date.now() });
    onClose();
    resetToIdle();
  };

  /**
   * Reject proposal
   * Transitions: PROPOSAL → IDLE
   */
  const handleRejectProposal = () => {
    if (currentProposal) {
      setCurrentProposal({ ...currentProposal, status: 'rejected', decidedAt: Date.now() });
    }
    resetToIdle();
  };

  /**
   * Reset to idle state
   */
  const resetToIdle = () => {
    setState('idle');
    setCurrentInput(null);
    setCurrentIntent(null);
    setCurrentProposal(null);
  };

  /**
   * Detect meeting type from reformulated intent
   */
  const detectMeetingType = (text: string): MeetingType => {
    const lower = text.toLowerCase();
    if (lower.includes('décision') || lower.includes('decision')) return 'decision';
    if (lower.includes('réflex') || lower.includes('reflect')) return 'reflection';
    if (lower.includes('align') || lower.includes('équipe') || lower.includes('my_team')) return 'team_alignment';
    if (lower.includes('audit') || lower.includes('review')) return 'review_audit';
    return 'reflection';
  };

  if (!isOpen) return null;

  return (
    <div
      className="system-channel-panel"
      style={{
        position: 'fixed',
        top: '60px',
        right: '16px',
        width: '360px',
        background: '#1E1F22',
        border: '1px solid #3A3B3E',
        borderRadius: '12px',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}
    >
      {/* Header with state indicator */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #3A3B3E',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ color: '#D8B26A', fontSize: '14px', fontWeight: 600 }}>
            SYSTEM CHANNEL
          </span>
          <span
            style={{
              marginLeft: '12px',
              padding: '2px 8px',
              background: state === 'idle' ? '#3A3B3E' : state === 'intent' ? '#D8B26A' : '#3F7249',
              borderRadius: '4px',
              fontSize: '10px',
              color: state === 'idle' ? '#8D8371' : '#1E1F22',
              textTransform: 'uppercase'
            }}
          >
            {state}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#8D8371', cursor: 'pointer', fontSize: '18px' }}
        >
          ×
        </button>
      </div>

      {/* Content based on state */}
      <div style={{ padding: '16px' }}>
        
        {/* IDLE STATE */}
        {state === 'idle' && (
          <div>
            <div style={{ color: '#8D8371', fontSize: '13px', marginBottom: '12px' }}>
              {t.onOpen[language]}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitInput()}
                placeholder={language === 'fr' ? 'Votre intention...' : 'Your intent...'}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: '#2A2B2E',
                  border: '1px solid #3A3B3E',
                  borderRadius: '8px',
                  color: '#E9E4D6',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleSubmitInput}
                disabled={!inputValue.trim()}
                style={{
                  padding: '10px 16px',
                  background: inputValue.trim() ? '#D8B26A' : '#3A3B3E',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#1E1F22',
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 600
                }}
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* INTENT STATE - Reformulation confirmation */}
        {state === 'intent' && currentIntent && (
          <div>
            <div style={{ color: '#8D8371', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' }}>
              {language === 'fr' ? 'Intention détectée' : 'Intent detected'}
            </div>
            <div
              style={{
                padding: '12px',
                background: '#2A2B2E',
                borderRadius: '8px',
                marginBottom: '16px',
                borderLeft: '3px solid #D8B26A'
              }}
            >
              <div style={{ color: '#E9E4D6', fontSize: '14px' }}>
                {currentIntent.reformulated}
              </div>
            </div>
            <div style={{ color: '#8D8371', fontSize: '12px', marginBottom: '12px' }}>
              {language === 'fr' ? 'Confirmer cette intention?' : 'Confirm this intent?'}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleConfirmIntent}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#3F7249',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {language === 'fr' ? 'Confirmer' : 'Confirm'}
              </button>
              <button
                onClick={handleCancelIntent}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#3A3B3E',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#E9E4D6',
                  cursor: 'pointer'
                }}
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* PROPOSAL STATE */}
        {state === 'proposal' && currentProposal && (
          <div>
            <div style={{ color: '#8D8371', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' }}>
              {language === 'fr' ? 'Proposition' : 'Proposal'}
            </div>
            <div
              style={{
                padding: '12px',
                background: '#2A2B2E',
                borderRadius: '8px',
                marginBottom: '16px',
                borderLeft: '3px solid #3F7249'
              }}
            >
              <div style={{ color: '#D8B26A', fontSize: '12px', marginBottom: '4px' }}>
                {currentProposal.type === 'meeting' ? '📋 Meeting' : '⚡ Action'}
              </div>
              <div style={{ color: '#E9E4D6', fontSize: '14px' }}>
                {currentProposal.meetingType && `${currentProposal.meetingType} - `}
                {currentProposal.meetingObjective}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAcceptProposal}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#3F7249',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {language === 'fr' ? 'Accepter' : 'Accept'}
              </button>
              <button
                onClick={handleRejectProposal}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#7A593A',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {language === 'fr' ? 'Rejeter' : 'Reject'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemChannelPanel;
