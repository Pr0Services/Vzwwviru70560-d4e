/**
 * CHE·NU™ — Agent Stagiaire Frontend Components
 * Version: V1.0
 * Date: 2026-01-07
 * 
 * Components pour la visualisation et gestion du Stagiaire:
 * - État de conversation
 * - Notes d'apprentissage
 * - Promotion vers mémoire canonique
 * 
 * GOUVERNANCE > EXÉCUTION
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type ConversationState = 'hot' | 'cooling' | 'ended' | 'stagiary_review' | 'cooldown';
type LearningValue = 'low' | 'med' | 'high';
type PromotionStatus = 'none' | 'candidate' | 'promoted' | 'rejected';
type UserSignal = 'silent' | 'rephrase' | 'correct' | 'approve' | 'unknown';

interface StagiaireNote {
  note_id: string;
  timestamp: string;
  sphere: string;
  sector?: string;
  intent_summary: string;
  ambiguities: string[];
  outsourcing_used: boolean;
  outsourcing_reason?: string;
  user_signal: UserSignal;
  learning_value: LearningValue;
  recurrence_estimate: LearningValue;
  priority: LearningValue;
  question_candidate?: string;
  promotion_status: PromotionStatus;
}

interface PromotionCandidate {
  candidate_id: string;
  note_ids: string[];
  sphere: string;
  sector?: string;
  pattern_title: string;
  pattern_description: string;
  evidence_count: number;
  promotion_decision: 'pending' | 'approved' | 'rejected';
  review_notes?: string;
}

interface ConversationStateInfo {
  conversation_id: string;
  state: ConversationState;
  can_activate: boolean;
  cooldown_active: boolean;
  cooldown_until?: string;
}

interface StagiaireStats {
  total_notes: number;
  notes_by_sphere: Record<string, number>;
  notes_by_learning_value: Record<string, number>;
  notes_by_promotion_status: Record<string, number>;
  total_candidates: number;
  active_cooldowns: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const STATE_LABELS: Record<ConversationState, string> = {
  hot: 'Active',
  cooling: 'En refroidissement',
  ended: 'Terminée',
  stagiary_review: 'Revue stagiaire',
  cooldown: 'Cooldown (15 min)',
};

const STATE_COLORS: Record<ConversationState, string> = {
  hot: '#E74C3C',
  cooling: '#D8B26A',
  ended: '#8D8371',
  stagiary_review: '#3EB4A2',
  cooldown: '#3F7249',
};

const LEARNING_VALUE_COLORS: Record<LearningValue, string> = {
  low: '#8D8371',
  med: '#D8B26A',
  high: '#3F7249',
};

const PROMOTION_STATUS_LABELS: Record<PromotionStatus, string> = {
  none: '-',
  candidate: '🎯 Candidate',
  promoted: '✅ Promue',
  rejected: '❌ Rejetée',
};

const USER_SIGNAL_ICONS: Record<UserSignal, string> = {
  silent: '🤫',
  rephrase: '🔄',
  correct: '✏️',
  approve: '👍',
  unknown: '❓',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Indicateur d'état de conversation
 */
export const ConversationStateIndicator: React.FC<{
  stateInfo: ConversationStateInfo;
  onTransition?: (targetState: string) => void;
}> = ({ stateInfo, onTransition }) => {
  const color = STATE_COLORS[stateInfo.state];
  
  return (
    <div
      style={{
        backgroundColor: '#1E1F22',
        borderRadius: '8px',
        padding: '16px',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#8D8371', fontSize: '12px' }}>
            Conversation: {stateInfo.conversation_id.slice(0, 8)}...
          </div>
          <div style={{ color, fontSize: '18px', fontWeight: 600 }}>
            {STATE_LABELS[stateInfo.state]}
          </div>
        </div>
        
        {stateInfo.state === 'hot' && (
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: color,
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </div>
      
      {stateInfo.cooldown_active && stateInfo.cooldown_until && (
        <div style={{ marginTop: '8px', color: '#3F7249', fontSize: '12px' }}>
          ⏱️ Cooldown jusqu'à: {new Date(stateInfo.cooldown_until).toLocaleTimeString()}
        </div>
      )}
      
      {stateInfo.can_activate && (
        <div style={{ marginTop: '8px', color: '#3EB4A2', fontSize: '12px' }}>
          ✅ Prêt pour activation stagiaire
        </div>
      )}
      
      {/* Transitions manuelles (pour debug) */}
      {onTransition && (
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {stateInfo.state === 'hot' && (
            <TransitionButton onClick={() => onTransition('cooling')} label="→ Cooling" />
          )}
          {stateInfo.state === 'cooling' && (
            <TransitionButton onClick={() => onTransition('ended')} label="→ Ended" />
          )}
          {stateInfo.state === 'ended' && stateInfo.can_activate && (
            <TransitionButton onClick={() => onTransition('stagiary_review')} label="→ Review" />
          )}
        </div>
      )}
    </div>
  );
};

const TransitionButton: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      padding: '4px 8px',
      backgroundColor: '#2F4C39',
      color: '#E9E4D6',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
    }}
  >
    {label}
  </button>
);

/**
 * Badge de valeur d'apprentissage
 */
export const LearningValueBadge: React.FC<{ value: LearningValue; label?: string }> = ({
  value,
  label,
}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      backgroundColor: LEARNING_VALUE_COLORS[value],
      color: '#FFFFFF',
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
    }}
  >
    {label || value}
  </span>
);

/**
 * Carte de note stagiaire
 */
export const StagiaireNoteCard: React.FC<{
  note: StagiaireNote;
  onPromote?: (noteId: string) => void;
}> = ({ note, onPromote }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div
      style={{
        backgroundColor: '#1E1F22',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ color: '#3EB4A2', fontWeight: 600 }}>{note.sphere}</span>
            {note.sector && (
              <span style={{ color: '#8D8371' }}>/ {note.sector}</span>
            )}
            <span style={{ fontSize: '16px' }}>{USER_SIGNAL_ICONS[note.user_signal]}</span>
          </div>
          <div style={{ color: '#8D8371', fontSize: '12px' }}>
            {new Date(note.timestamp).toLocaleString()}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <LearningValueBadge value={note.learning_value} label={`Val: ${note.learning_value}`} />
          <LearningValueBadge value={note.priority} label={`Pri: ${note.priority}`} />
        </div>
      </div>
      
      {/* Intent Summary */}
      <p style={{ color: '#E9E4D6', marginTop: '12px', marginBottom: '8px' }}>
        {note.intent_summary}
      </p>
      
      {/* Promotion Status */}
      {note.promotion_status !== 'none' && (
        <div style={{ marginBottom: '8px', color: '#D8B26A', fontSize: '12px' }}>
          {PROMOTION_STATUS_LABELS[note.promotion_status]}
        </div>
      )}
      
      {/* Question Candidate */}
      {note.question_candidate && (
        <div
          style={{
            padding: '8px',
            backgroundColor: '#2F4C39',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: '#3EB4A2' }}>❓ Question suggérée: </span>
          <span style={{ color: '#E9E4D6' }}>{note.question_candidate}</span>
        </div>
      )}
      
      {/* Expandable Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          color: '#3EB4A2',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        {expanded ? '▼ Moins de détails' : '▶ Plus de détails'}
      </button>
      
      {expanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2F4C39' }}>
          {/* Ambiguités */}
          {note.ambiguities.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: '#8D8371', fontSize: '12px', marginBottom: '4px' }}>
                Ambiguïtés détectées:
              </div>
              <ul style={{ color: '#E9E4D6', margin: 0, paddingLeft: '20px' }}>
                {note.ambiguities.map((amb, i) => (
                  <li key={i}>{amb}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Outsourcing */}
          {note.outsourcing_used && (
            <div style={{ color: '#D8B26A', fontSize: '12px' }}>
              🔗 Sous-traitance utilisée: {note.outsourcing_reason || 'Non spécifié'}
            </div>
          )}
          
          {/* Recurrence */}
          <div style={{ marginTop: '8px', color: '#8D8371', fontSize: '12px' }}>
            📊 Récurrence estimée: {note.recurrence_estimate}
          </div>
        </div>
      )}
      
      {/* Actions */}
      {onPromote && note.promotion_status === 'none' && note.learning_value === 'high' && (
        <div style={{ marginTop: '12px' }}>
          <button
            onClick={() => onPromote(note.note_id)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#D8B26A',
              color: '#1E1F22',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            🎯 Proposer pour promotion
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Carte de candidate à promotion
 */
export const PromotionCandidateCard: React.FC<{
  candidate: PromotionCandidate;
  onApprove?: (candidateId: string) => void;
  onReject?: (candidateId: string) => void;
}> = ({ candidate, onApprove, onReject }) => {
  const isPending = candidate.promotion_decision === 'pending';
  
  return (
    <div
      style={{
        backgroundColor: '#1E1F22',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        borderLeft: `4px solid ${isPending ? '#D8B26A' : '#3F7249'}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ color: '#E9E4D6', margin: 0 }}>{candidate.pattern_title}</h4>
          <div style={{ color: '#8D8371', fontSize: '12px', marginTop: '4px' }}>
            {candidate.sphere} {candidate.sector ? `/ ${candidate.sector}` : ''}
          </div>
        </div>
        
        <div
          style={{
            padding: '4px 8px',
            backgroundColor: isPending ? '#D8B26A' : candidate.promotion_decision === 'approved' ? '#3F7249' : '#E74C3C',
            color: isPending ? '#1E1F22' : '#FFFFFF',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {candidate.promotion_decision.toUpperCase()}
        </div>
      </div>
      
      <p style={{ color: '#E9E4D6', marginTop: '12px', marginBottom: '8px' }}>
        {candidate.pattern_description}
      </p>
      
      <div style={{ color: '#8D8371', fontSize: '12px' }}>
        📝 {candidate.evidence_count} note(s) comme preuve
      </div>
      
      {candidate.review_notes && (
        <div style={{ marginTop: '8px', color: '#3EB4A2', fontSize: '12px' }}>
          💬 {candidate.review_notes}
        </div>
      )}
      
      {/* Actions */}
      {isPending && (onApprove || onReject) && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          {onApprove && (
            <button
              onClick={() => onApprove(candidate.candidate_id)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3F7249',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ✅ Approuver
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(candidate.candidate_id)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#E74C3C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ❌ Rejeter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Dashboard Stagiaire
 */
export const StagiaireDashboard: React.FC<{
  stats: StagiaireStats;
  notes: StagiaireNote[];
  candidates: PromotionCandidate[];
  conversationState?: ConversationStateInfo;
  onPromoteNote?: (noteId: string) => void;
  onApproveCandidate?: (candidateId: string) => void;
  onRejectCandidate?: (candidateId: string) => void;
}> = ({
  stats,
  notes,
  candidates,
  conversationState,
  onPromoteNote,
  onApproveCandidate,
  onRejectCandidate,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'candidates'>('notes');
  const pendingCandidates = candidates.filter(c => c.promotion_decision === 'pending');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#0D0D0D', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#3EB4A2', marginBottom: '8px' }}>
          📚 Agent Stagiaire
        </h1>
        <p style={{ color: '#8D8371' }}>
          Une note utile est une note écrite avec curiosité, pas avec certitude.
        </p>
      </div>
      
      {/* Conversation State (if provided) */}
      {conversationState && (
        <div style={{ marginBottom: '24px' }}>
          <ConversationStateIndicator stateInfo={conversationState} />
        </div>
      )}
      
      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard label="Total Notes" value={stats.total_notes} color="#3EB4A2" />
        <StatCard label="Haute Valeur" value={stats.notes_by_learning_value?.high || 0} color="#3F7249" />
        <StatCard label="Candidates" value={stats.total_candidates} color="#D8B26A" />
        <StatCard label="Cooldowns Actifs" value={stats.active_cooldowns} color="#8D8371" />
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <TabButton
          active={activeTab === 'notes'}
          onClick={() => setActiveTab('notes')}
          label={`Notes (${notes.length})`}
        />
        <TabButton
          active={activeTab === 'candidates'}
          onClick={() => setActiveTab('candidates')}
          label={`Promotions (${pendingCandidates.length} en attente)`}
          highlight={pendingCandidates.length > 0}
        />
      </div>
      
      {/* Content */}
      {activeTab === 'notes' && (
        <div>
          {notes.length === 0 ? (
            <p style={{ color: '#8D8371', fontStyle: 'italic' }}>
              Aucune note créée
            </p>
          ) : (
            notes.map(note => (
              <StagiaireNoteCard key={note.note_id} note={note} onPromote={onPromoteNote} />
            ))
          )}
        </div>
      )}
      
      {activeTab === 'candidates' && (
        <div>
          {candidates.length === 0 ? (
            <p style={{ color: '#8D8371', fontStyle: 'italic' }}>
              Aucune candidate à promotion
            </p>
          ) : (
            candidates.map(candidate => (
              <PromotionCandidateCard
                key={candidate.candidate_id}
                candidate={candidate}
                onApprove={onApproveCandidate}
                onReject={onRejectCandidate}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Carte de statistique
 */
const StatCard: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div
    style={{
      backgroundColor: '#1E1F22',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
      borderTop: `3px solid ${color}`,
    }}
  >
    <div style={{ color, fontSize: '32px', fontWeight: 700 }}>{value}</div>
    <div style={{ color: '#8D8371', fontSize: '12px' }}>{label}</div>
  </div>
);

/**
 * Bouton d'onglet
 */
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  highlight?: boolean;
}> = ({ active, onClick, label, highlight }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 24px',
      backgroundColor: active ? '#3EB4A2' : '#1E1F22',
      color: active ? '#1E1F22' : '#E9E4D6',
      border: highlight && !active ? '2px solid #D8B26A' : 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
    }}
  >
    {label}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default StagiaireDashboard;
