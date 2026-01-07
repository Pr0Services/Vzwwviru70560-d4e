/**
 * CHE·NU Reflection Room
 * Version: V51
 * 
 * PRIMARY ENTRY POINT:
 * - User speaks/writes freely
 * - CHE·NU observes, proposes structure
 * - User validates, edits, or rejects
 * 
 * NO SILENT PERSISTENCE
 * NO IMPLICIT LEARNING
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Proposal,
  ProposalType,
  ProposalStatus,
  extractFromMessage,
  acceptProposal,
  editProposal,
  rejectProposal,
  PROPOSAL_TYPE_LABELS,
  CONFIDENCE_LABELS,
  MemoryWriteGate,
  ValidationLog
} from '../../core/understanding';

// ═══════════════════════════════════════════════════════════════════
// STYLES — SERIOUS, NO ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gridTemplateRows: '1fr auto',
    height: 'calc(100vh - 40px)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f8f9fa',
    color: '#1a1a1a'
  },
  mainArea: {
    gridColumn: '1',
    gridRow: '1',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #ddd'
  },
  rightPanel: {
    gridColumn: '2',
    gridRow: '1 / 3',
    backgroundColor: '#fff',
    borderLeft: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  bottomPanel: {
    gridColumn: '1',
    gridRow: '2',
    backgroundColor: '#fff',
    borderTop: '2px solid #333',
    padding: '16px',
    maxHeight: '200px',
    overflow: 'auto'
  },
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    margin: 0
  },
  subtitle: {
    fontSize: '13px',
    color: '#666',
    marginTop: '4px'
  },
  conversation: {
    flex: 1,
    overflow: 'auto',
    padding: '16px 24px'
  },
  message: {
    marginBottom: '16px',
    padding: '12px 16px',
    borderRadius: '4px',
    maxWidth: '80%'
  },
  userMessage: {
    backgroundColor: '#e3f2fd',
    marginLeft: 'auto',
    borderBottomRightRadius: 0
  },
  assistantMessage: {
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 0
  },
  inputArea: {
    padding: '16px 24px',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee'
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  sendButton: {
    marginTop: '8px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  panelHeader: {
    padding: '12px 16px',
    borderBottom: '2px solid #333',
    backgroundColor: '#f8f9fa'
  },
  panelTitle: {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#333',
    margin: 0
  },
  proposalList: {
    flex: 1,
    overflow: 'auto',
    padding: '12px'
  },
  proposalCard: {
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #ddd',
    backgroundColor: '#fff'
  },
  proposalType: {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '2px 6px',
    borderRadius: '2px',
    display: 'inline-block',
    marginBottom: '8px'
  },
  proposalSummary: {
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '8px'
  },
  proposalMeta: {
    fontSize: '11px',
    color: '#888'
  },
  proposalActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    paddingTop: '8px',
    borderTop: '1px solid #eee'
  },
  actionButton: {
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 500,
    border: '1px solid #333',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  acceptButton: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
    color: '#155724'
  },
  rejectButton: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
    color: '#721c24'
  },
  badge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '2px',
    fontWeight: 500
  },
  confidenceLow: { backgroundColor: '#fff3cd', color: '#856404' },
  confidenceMedium: { backgroundColor: '#d1ecf1', color: '#0c5460' },
  confidenceHigh: { backgroundColor: '#d4edda', color: '#155724' },
  statusProposed: { backgroundColor: '#f0f0f0', color: '#666' },
  statusAccepted: { backgroundColor: '#d4edda', color: '#155724' },
  statusEdited: { backgroundColor: '#cce5ff', color: '#004085' },
  statusRejected: { backgroundColor: '#f8d7da', color: '#721c24' },
  emptyState: {
    padding: '24px',
    textAlign: 'center',
    color: '#888',
    fontSize: '13px'
  },
  demoNotice: {
    backgroundColor: '#e7f1ff',
    border: '1px solid #b6d4fe',
    padding: '8px 16px',
    fontSize: '12px',
    margin: '12px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '24px',
    width: '450px',
    maxWidth: '90%',
    border: '2px solid #333'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    marginBottom: '4px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '13px',
    border: '1px solid #ccc',
    marginBottom: '12px',
    boxSizing: 'border-box'
  },
  modalActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    marginTop: '16px'
  }
};

// ═══════════════════════════════════════════════════════════════════
// TYPE COLORS
// ═══════════════════════════════════════════════════════════════════

const TYPE_COLORS: Record<ProposalType, string> = {
  topic: '#6c757d',
  memory: '#17a2b8',
  decision: '#28a745',
  relation: '#fd7e14',
  intent: '#6f42c1'
};

// ═══════════════════════════════════════════════════════════════════
// MESSAGE TYPE
// ═══════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════
// ACCEPTANCE MODAL
// ═══════════════════════════════════════════════════════════════════

interface AcceptModalProps {
  proposal: Proposal;
  onConfirm: (editedContent: string | null, note: string) => void;
  onCancel: () => void;
}

function AcceptModal({ proposal, onConfirm, onCancel }: AcceptModalProps) {
  const [content, setContent] = useState(proposal.summary);
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h3 style={styles.modalTitle}>
          Accept Proposal: {PROPOSAL_TYPE_LABELS[proposal.type]}
        </h3>
        
        <label style={styles.label}>Content:</label>
        {isEditing ? (
          <textarea
            style={{ ...styles.input, minHeight: '80px' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div style={{ 
            padding: '8px', 
            backgroundColor: '#f5f5f5', 
            marginBottom: '12px',
            fontSize: '13px'
          }}>
            {content}
            <button
              style={{ ...styles.actionButton, marginLeft: '8px', fontSize: '10px' }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )}
        
        <label style={styles.label}>Note (optional):</label>
        <input
          type="text"
          style={styles.input}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about this acceptance..."
        />
        
        {proposal.target_dataset && (
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
            Target: {proposal.target_dataset}
          </div>
        )}
        
        <div style={styles.modalActions}>
          <button style={styles.actionButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={{ ...styles.actionButton, ...styles.acceptButton }}
            onClick={() => onConfirm(
              isEditing && content !== proposal.summary ? content : null,
              note
            )}
          >
            Confirm Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROPOSAL CARD
// ═══════════════════════════════════════════════════════════════════

interface ProposalCardProps {
  proposal: Proposal;
  onAccept: (proposal: Proposal) => void;
  onReject: (proposal: Proposal) => void;
}

function ProposalCard({ proposal, onAccept, onReject }: ProposalCardProps) {
  const confidenceStyle = {
    low: styles.confidenceLow,
    medium: styles.confidenceMedium,
    high: styles.confidenceHigh
  }[proposal.confidence];
  
  const statusStyle = {
    proposed: styles.statusProposed,
    accepted: styles.statusAccepted,
    edited: styles.statusEdited,
    rejected: styles.statusRejected
  }[proposal.status];
  
  const isActioned = proposal.status !== 'proposed';
  
  return (
    <div style={{
      ...styles.proposalCard,
      opacity: isActioned ? 0.7 : 1,
      borderLeftWidth: '3px',
      borderLeftColor: TYPE_COLORS[proposal.type]
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          ...styles.proposalType,
          backgroundColor: TYPE_COLORS[proposal.type],
          color: '#fff'
        }}>
          {PROPOSAL_TYPE_LABELS[proposal.type]}
        </span>
        <span style={{ ...styles.badge, ...statusStyle }}>
          {proposal.status.toUpperCase()}
        </span>
      </div>
      
      <div style={styles.proposalSummary}>
        {proposal.user_edit ?? proposal.summary}
      </div>
      
      <div style={styles.proposalMeta}>
        <span style={{ ...styles.badge, ...confidenceStyle, marginRight: '8px' }}>
          {CONFIDENCE_LABELS[proposal.confidence]}
        </span>
        {proposal.target_sphere && (
          <span>→ {proposal.target_sphere}</span>
        )}
      </div>
      
      {!isActioned && (
        <div style={styles.proposalActions}>
          <button
            style={{ ...styles.actionButton, ...styles.acceptButton }}
            onClick={() => onAccept(proposal)}
          >
            Accept
          </button>
          <button
            style={styles.actionButton}
            onClick={() => onAccept(proposal)}
          >
            Edit & Accept
          </button>
          <button
            style={{ ...styles.actionButton, ...styles.rejectButton }}
            onClick={() => onReject(proposal)}
          >
            Reject
          </button>
        </div>
      )}
      
      {proposal.acceptance_note && (
        <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
          Note: {proposal.acceptance_note}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ReflectionRoomProps {
  userId?: string;
  isDemo?: boolean;
}

export function ReflectionRoom({
  userId = 'demo_user',
  isDemo = true
}: ReflectionRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [inputText, setInputText] = useState('');
  const [acceptModal, setAcceptModal] = useState<Proposal | null>(null);
  const [sessionId] = useState(() => `SESSION-${Date.now()}`);
  const [conversationId] = useState(() => `CONV-${Date.now()}`);
  const conversationRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Handle send message
  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    
    const messageId = `MSG-${Date.now()}`;
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Extract proposals from the message
    const result = extractFromMessage(inputText.trim(), messageId);
    if (result.proposals.length > 0) {
      setProposals(prev => [...prev, ...result.proposals]);
    }
    
    // Add assistant acknowledgment
    const assistantMessage: Message = {
      id: `MSG-${Date.now() + 1}`,
      role: 'assistant',
      text: result.proposals.length > 0
        ? `I've identified ${result.proposals.length} potential item(s) from your message. Please review them in the Understanding panel.`
        : 'I understand. Continue when you\'re ready.',
      timestamp: new Date().toISOString()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
    }, 300);
    
    setInputText('');
  }, [inputText]);
  
  // Handle proposal acceptance
  const handleAccept = useCallback((proposal: Proposal) => {
    setAcceptModal(proposal);
  }, []);
  
  // Confirm acceptance
  const handleConfirmAccept = useCallback((
    editedContent: string | null,
    note: string
  ) => {
    if (!acceptModal) return;
    
    const updatedProposal = editedContent
      ? editProposal(acceptModal, editedContent, note || undefined)
      : acceptProposal(acceptModal, note || undefined);
    
    // Update proposals list
    setProposals(prev => prev.map(p => 
      p.id === acceptModal.id ? updatedProposal : p
    ));
    
    // Record in validation log
    ValidationLog.recordAcceptance(
      updatedProposal,
      conversationId,
      userId,
      sessionId,
      isDemo
    );
    
    // Attempt memory write
    MemoryWriteGate.attemptWrite(
      updatedProposal,
      userId,
      conversationId,
      true, // user confirmed
      isDemo
    );
    
    setAcceptModal(null);
  }, [acceptModal, conversationId, userId, sessionId, isDemo]);
  
  // Handle proposal rejection
  const handleReject = useCallback((proposal: Proposal) => {
    const rejectedProposal = rejectProposal(proposal);
    
    setProposals(prev => prev.map(p =>
      p.id === proposal.id ? rejectedProposal : p
    ));
    
    // Record rejection
    ValidationLog.recordRejection(
      proposal,
      conversationId,
      userId,
      sessionId
    );
  }, [conversationId, userId, sessionId]);
  
  // Bulk actions
  const pendingProposals = proposals.filter(p => p.status === 'proposed');
  const actionedProposals = proposals.filter(p => p.status !== 'proposed');
  
  return (
    <div style={styles.container}>
      {/* Main conversation area */}
      <div style={styles.mainArea}>
        <div style={styles.header}>
          <h1 style={styles.title}>Reflection Room</h1>
          <p style={styles.subtitle}>
            Speak freely. CHE·NU observes and proposes. You decide what becomes memory.
          </p>
        </div>
        
        <div style={styles.conversation} ref={conversationRef}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <p><strong>Start typing to begin.</strong></p>
              <p style={{ marginTop: '8px' }}>
                Share your thoughts, decisions, or observations.<br/>
                CHE·NU will propose structured understanding.<br/>
                Nothing is saved without your explicit approval.
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  ...styles.message,
                  ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
                }}
              >
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>
                  {msg.role === 'user' ? 'You' : 'CHE·NU'} • {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                {msg.text}
              </div>
            ))
          )}
        </div>
        
        <div style={styles.inputArea}>
          <textarea
            style={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your thoughts, decisions, or observations..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button style={styles.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
      
      {/* Right panel - Understanding */}
      <div style={styles.rightPanel}>
        <div style={styles.panelHeader}>
          <h2 style={styles.panelTitle}>CHE·NU THINKS</h2>
        </div>
        
        {isDemo && (
          <div style={styles.demoNotice}>
            <strong>DEMO:</strong> Writes are simulated. Logs are real.
          </div>
        )}
        
        <div style={styles.proposalList}>
          {proposals.length === 0 ? (
            <div style={styles.emptyState}>
              No proposals yet. Start a conversation.
            </div>
          ) : (
            <>
              {/* Pending proposals first */}
              {pendingProposals.length > 0 && (
                <>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    color: '#666',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}>
                    Pending Your Decision ({pendingProposals.length})
                  </div>
                  {pendingProposals.map(proposal => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))}
                </>
              )}
              
              {/* Actioned proposals */}
              {actionedProposals.length > 0 && (
                <>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    color: '#888',
                    marginBottom: '8px',
                    marginTop: '16px',
                    textTransform: 'uppercase'
                  }}>
                    Processed ({actionedProposals.length})
                  </div>
                  {actionedProposals.map(proposal => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Bottom panel - Actions summary */}
      <div style={styles.bottomPanel}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>YOU DECIDE</span>
            <span style={{ marginLeft: '16px', fontSize: '12px', color: '#666' }}>
              {pendingProposals.length} pending • 
              {proposals.filter(p => p.status === 'accepted' || p.status === 'edited').length} accepted • 
              {proposals.filter(p => p.status === 'rejected').length} rejected
            </span>
          </div>
          
          {pendingProposals.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{ ...styles.actionButton, ...styles.rejectButton, fontSize: '11px' }}
                onClick={() => {
                  pendingProposals.forEach(p => handleReject(p));
                }}
              >
                Reject All Pending
              </button>
            </div>
          )}
        </div>
        
        <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
          Session: {sessionId} • Conversation: {conversationId}
        </div>
      </div>
      
      {/* Acceptance modal */}
      {acceptModal && (
        <AcceptModal
          proposal={acceptModal}
          onConfirm={handleConfirmAccept}
          onCancel={() => setAcceptModal(null)}
        />
      )}
    </div>
  );
}

export default ReflectionRoom;
