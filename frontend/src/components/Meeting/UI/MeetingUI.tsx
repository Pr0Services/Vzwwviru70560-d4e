/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — MEETING UI (NON-XR)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Un meeting dans CHE·NU n'est PAS un chat.
 * C'est un espace de raisonnement gouverné.
 * 
 * RÈGLES:
 * - Les meetings ne s'exécutent pas
 * - Les meetings ne décident pas seuls
 * - Les meetings produisent des PROPOSITIONS
 * - L'humain valide les résultats
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MeetingUIState,
  MeetingTimelineEntry,
  MeetingProposal,
  ProposalStatus
} from '../../../canonical/MEETING_UI_CANONICAL';
import { MeetingType, MeetingAgent } from '../../../canonical/MEETING_TYPES_CANONICAL';
import { SphereId } from '../../../canonical/SPHERES_CANONICAL_V2';

interface MeetingUIProps {
  meetingId: string;
  meetingType: MeetingType;
  objective: string;
  scope: string;
  spheres: SphereId[];
  participants: MeetingAgent[];
  onValidate: (proposalIds: string[]) => void;
  onClose: () => void;
  onOpenXR?: () => void;
  language?: 'en' | 'fr';
}

export const MeetingUI: React.FC<MeetingUIProps> = ({
  meetingId,
  meetingType,
  objective,
  scope,
  spheres,
  participants,
  onValidate,
  onClose,
  onOpenXR,
  language = 'fr'
}) => {
  const [uiState, setUIState] = useState<MeetingUIState>('open');
  const [timeline, setTimeline] = useState<MeetingTimelineEntry[]>([]);
  const [proposals, setProposals] = useState<MeetingProposal[]>([]);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const timelineEndRef = useRef<HTMLDivElement>(null);

  const labels = {
    en: {
      title: getMeetingTitle(meetingType, 'en'),
      objective: 'Objective',
      scope: 'Scope',
      participants: 'Participants',
      timeline: 'Timeline',
      proposals: 'Proposals',
      validate: 'Validate Selected',
      requestChange: 'Request Change',
      close: 'Close Meeting',
      openXR: 'Open in XR',
      send: 'Send',
      placeholder: 'Your input...',
      status: {
        open: 'In Progress',
        proposal_ready: 'Proposals Ready',
        validated: 'Validated',
        closed: 'Closed'
      }
    },
    fr: {
      title: getMeetingTitle(meetingType, 'fr'),
      objective: 'Objectif',
      scope: 'Périmètre',
      participants: 'Participants',
      timeline: 'Chronologie',
      proposals: 'Propositions',
      validate: 'Valider la sélection',
      requestChange: 'Demander modification',
      close: 'Fermer le meeting',
      openXR: 'Ouvrir en XR',
      send: 'Envoyer',
      placeholder: 'Votre message...',
      status: {
        open: 'En cours',
        proposal_ready: 'Propositions prêtes',
        validated: 'Validé',
        closed: 'Fermé'
      }
    }
  };

  const t = labels[language];

  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timeline]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const entry: MeetingTimelineEntry = {
      id: `entry-${Date.now()}`,
      timestamp: Date.now(),
      type: 'user_input',
      content: inputValue
    };

    setTimeline(prev => [...prev, entry]);
    setInputValue('');

    // Simulate agent responses
    simulateAgentResponses(inputValue);
  };

  const simulateAgentResponses = (userInput: string) => {
    participants.forEach((agent, index) => {
      setTimeout(() => {
        const response: MeetingTimelineEntry = {
          id: `entry-${Date.now()}-${agent.agentId}`,
          timestamp: Date.now(),
          type: 'agent_response',
          agentId: agent.agentId,
          agentRole: agent.role,
          content: generateAgentResponse(agent.agentId, userInput, language)
        };
        setTimeline(prev => [...prev, response]);

        // Generate proposal after all agents responded
        if (index === participants.length - 1) {
          setTimeout(() => {
            generateProposal(userInput);
          }, 500);
        }
      }, (index + 1) * 1000);
    });
  };

  const generateProposal = (context: string) => {
    const proposal: MeetingProposal = {
      id: `proposal-${Date.now()}`,
      title: language === 'fr' ? 'Proposition de décision' : 'Decision Proposal',
      content: language === 'fr'
        ? `Basé sur l'analyse: ${context.substring(0, 100)}...`
        : `Based on analysis: ${context.substring(0, 100)}...`,
      sourceAgentId: 'system-orchestrator',
      sourceAgentRole: 'coordinator',
      status: 'pending'
    };

    setProposals(prev => [...prev, proposal]);
    setUIState('proposal_ready');

    // Add proposal to timeline
    const entry: MeetingTimelineEntry = {
      id: `entry-${Date.now()}-proposal`,
      timestamp: Date.now(),
      type: 'proposal',
      content: proposal.title,
      isProposal: true,
      proposalId: proposal.id
    };
    setTimeline(prev => [...prev, entry]);
  };

  const toggleProposalSelection = (proposalId: string) => {
    setSelectedProposals(prev =>
      prev.includes(proposalId)
        ? prev.filter(id => id !== proposalId)
        : [...prev, proposalId]
    );
  };

  const handleValidate = () => {
    if (selectedProposals.length === 0) return;

    // Update proposal status
    setProposals(prev =>
      prev.map(p =>
        selectedProposals.includes(p.id)
          ? { ...p, status: 'accepted' as ProposalStatus, validatedAt: Date.now() }
          : p
      )
    );

    setUIState('validated');
    onValidate(selectedProposals);
  };

  const handleClose = () => {
    setUIState('closed');
    onClose();
  };

  const getAgentColor = (agentId: string): string => {
    const colors: Record<string, string> = {
      'personal-core': '#EF4444',
      'team-coordination': '#3B82F6',
      'validation-trust': '#F59E0B',
      'memory-governance': '#8B5CF6',
      'system-orchestrator': '#06B6D4'
    };
    return colors[agentId] || '#8D8371';
  };

  return (
    <div
      className="meeting-ui"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1E1F22',
        color: '#E9E4D6'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #3A3B3E',
          background: '#2A2B2E'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: '#D8B26A', fontSize: '18px' }}>
              {getMeetingIcon(meetingType)} {t.title}
            </h2>
            <div
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                background: getStatusColor(uiState),
                borderRadius: '4px',
                fontSize: '12px',
                display: 'inline-block'
              }}
            >
              {t.status[uiState]}
            </div>
          </div>
          {onOpenXR && (
            <button
              onClick={onOpenXR}
              style={{
                padding: '8px 16px',
                background: '#2F4C39',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🕶️ {t.openXR}
            </button>
          )}
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
          <div>
            <span style={{ color: '#8D8371', fontSize: '12px' }}>{t.objective}:</span>
            <span style={{ marginLeft: '8px', fontSize: '14px' }}>{objective}</span>
          </div>
          <div>
            <span style={{ color: '#8D8371', fontSize: '12px' }}>{t.scope}:</span>
            <span style={{ marginLeft: '8px', fontSize: '14px' }}>{scope}</span>
          </div>
          <div>
            <span style={{ color: '#8D8371', fontSize: '12px' }}>{t.participants}:</span>
            <span style={{ marginLeft: '8px', fontSize: '14px' }}>
              {participants.map(p => p.agentId).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Timeline */}
        <div
          style={{
            flex: 2,
            overflow: 'auto',
            padding: '16px',
            borderRight: '1px solid #3A3B3E'
          }}
        >
          <h4 style={{ margin: '0 0 16px 0', color: '#8D8371', fontSize: '12px' }}>
            {t.timeline}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {timeline.map(entry => (
              <div
                key={entry.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: entry.type === 'user_input' ? '#2F4C39' : '#2A2B2E',
                  borderLeft: entry.agentId
                    ? `3px solid ${getAgentColor(entry.agentId)}`
                    : entry.isProposal
                    ? '3px solid #D8B26A'
                    : 'none'
                }}
              >
                {entry.agentId && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: getAgentColor(entry.agentId),
                      marginBottom: '4px'
                    }}
                  >
                    {entry.agentId} ({entry.agentRole})
                  </div>
                )}
                {entry.isProposal && (
                  <div style={{ fontSize: '10px', color: '#D8B26A', marginBottom: '4px' }}>
                    📋 PROPOSITION
                  </div>
                )}
                <div style={{ fontSize: '14px' }}>{entry.content}</div>
              </div>
            ))}
            <div ref={timelineEndRef} />
          </div>
        </div>

        {/* Proposals Panel */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px',
            background: '#2A2B2E'
          }}
        >
          <h4 style={{ margin: '0 0 16px 0', color: '#8D8371', fontSize: '12px' }}>
            {t.proposals}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {proposals.map(proposal => (
              <div
                key={proposal.id}
                onClick={() => proposal.status === 'pending' && toggleProposalSelection(proposal.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: selectedProposals.includes(proposal.id)
                    ? '#3F7249'
                    : '#1E1F22',
                  border: `1px solid ${
                    proposal.status === 'accepted'
                      ? '#3F7249'
                      : selectedProposals.includes(proposal.id)
                      ? '#3F7249'
                      : '#3A3B3E'
                  }`,
                  cursor: proposal.status === 'pending' ? 'pointer' : 'default',
                  opacity: proposal.status === 'accepted' ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={selectedProposals.includes(proposal.id) || proposal.status === 'accepted'}
                    disabled={proposal.status !== 'pending'}
                    readOnly
                    style={{ accentColor: '#D8B26A' }}
                  />
                  <span style={{ fontWeight: 500 }}>{proposal.title}</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '13px', color: '#8D8371' }}>
                  {proposal.content}
                </div>
                {proposal.status === 'accepted' && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#3F7249' }}>
                    ✓ Validé
                  </div>
                )}
              </div>
            ))}
            {proposals.length === 0 && (
              <div style={{ color: '#8D8371', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                {language === 'fr' ? 'Aucune proposition pour le moment' : 'No proposals yet'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      {uiState === 'open' && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #3A3B3E',
            display: 'flex',
            gap: '8px'
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.placeholder}
            style={{
              flex: 1,
              padding: '12px',
              background: '#2A2B2E',
              border: '1px solid #3A3B3E',
              borderRadius: '8px',
              color: '#E9E4D6',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            style={{
              padding: '12px 20px',
              background: '#D8B26A',
              border: 'none',
              borderRadius: '8px',
              color: '#1E1F22',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {t.send}
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #3A3B3E',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          background: '#2A2B2E'
        }}
      >
        {uiState !== 'closed' && uiState !== 'validated' && (
          <>
            <button
              onClick={handleValidate}
              disabled={selectedProposals.length === 0}
              style={{
                padding: '10px 20px',
                background: selectedProposals.length > 0 ? '#3F7249' : '#3A3B3E',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: selectedProposals.length > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 500
              }}
            >
              ✓ {t.validate}
            </button>
            <button
              onClick={() => {}}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #3A3B3E',
                borderRadius: '8px',
                color: '#E9E4D6',
                cursor: 'pointer'
              }}
            >
              {t.requestChange}
            </button>
          </>
        )}
        <button
          onClick={handleClose}
          style={{
            padding: '10px 20px',
            background: '#7A593A',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};

// Helper functions
function getMeetingTitle(type: MeetingType, lang: 'en' | 'fr'): string {
  const titles = {
    reflection: { en: 'Reflection Meeting', fr: 'Meeting de Réflexion' },
    team_alignment: { en: 'Team Alignment Meeting', fr: 'Meeting d\'Alignement' },
    decision: { en: 'Decision Meeting', fr: 'Meeting de Décision' },
    review_audit: { en: 'Review/Audit Meeting', fr: 'Meeting de Revue' }
  };
  return titles[type][lang];
}

function getMeetingIcon(type: MeetingType): string {
  const icons = {
    reflection: '💭',
    team_alignment: '👥',
    decision: '⚖️',
    review_audit: '🔍'
  };
  return icons[type];
}

function getStatusColor(status: MeetingUIState): string {
  const colors = {
    open: '#3B82F6',
    proposal_ready: '#D8B26A',
    validated: '#3F7249',
    closed: '#8D8371'
  };
  return colors[status];
}

function generateAgentResponse(agentId: string, input: string, lang: 'en' | 'fr'): string {
  const responses: Record<string, Record<string, string>> = {
    'personal-core': {
      fr: `En tant qu'agent personnel, j'observe que cette demande concerne votre contexte direct.`,
      en: `As personal agent, I observe this request concerns your direct context.`
    },
    'team-coordination': {
      fr: `L'équipe devra être impliquée dans cette décision pour assurer l'alignement.`,
      en: `The team will need to be involved in this decision to ensure alignment.`
    },
    'validation-trust': {
      fr: `Je valide que cette proposition respecte les règles de gouvernance CHE·NU.`,
      en: `I validate that this proposal respects CHE·NU governance rules.`
    }
  };
  
  return responses[agentId]?.[lang] || (lang === 'fr' ? 'Analyse en cours...' : 'Analyzing...');
}

export default MeetingUI;
