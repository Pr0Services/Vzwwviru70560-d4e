/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — THREAD SYSTEM (.CHENU)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLES FONDAMENTALES:
 * Les Threads (.chenu) sont des FIRST-CLASS OBJECTS.
 * 
 * Un thread:
 * - représente une ligne de pensée persistante
 * - a un propriétaire et une portée
 * - a un budget token
 * - a des règles d'encodage
 * - enregistre les décisions et l'historique
 * - est auditable
 * 
 * Les Threads existent à travers toutes les sphères.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { SphereId } from '../../canonical/SPHERES_CANONICAL_V2';

// Thread Types
export type ThreadStatus = 'active' | 'paused' | 'archived' | 'completed';
export type ThreadPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ThreadEntry {
  id: string;
  timestamp: number;
  type: 'thought' | 'decision' | 'question' | 'reference' | 'action';
  content: string;
  agentId?: string;
  tokensUsed?: number;
  metadata?: Record<string, any>;
}

export interface Thread {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  sphereId: SphereId;
  status: ThreadStatus;
  priority: ThreadPriority;
  
  // Token governance
  tokenBudget: number;
  tokensUsed: number;
  tokenLimit?: number;
  
  // Encoding
  encodingRules?: string[];
  qualityScore?: number;
  
  // Content
  entries: ThreadEntry[];
  
  // Audit
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
  
  // Relations
  linkedThreads?: string[];
  linkedMeetings?: string[];
  tags?: string[];
}

interface ThreadCanonicalProps {
  thread: Thread;
  onAddEntry: (entry: Omit<ThreadEntry, 'id' | 'timestamp'>) => void;
  onUpdateStatus: (status: ThreadStatus) => void;
  onUpdateBudget: (newBudget: number) => void;
  onArchive: () => void;
  language?: 'en' | 'fr';
}

export const ThreadCanonical: React.FC<ThreadCanonicalProps> = ({
  thread,
  onAddEntry,
  onUpdateStatus,
  onUpdateBudget,
  onArchive,
  language = 'fr'
}) => {
  const [newEntryContent, setNewEntryContent] = useState('');
  const [newEntryType, setNewEntryType] = useState<ThreadEntry['type']>('thought');
  const [showBudgetEditor, setShowBudgetEditor] = useState(false);
  const [newBudget, setNewBudget] = useState(thread.tokenBudget);

  const labels = {
    en: {
      title: 'Thread',
      status: 'Status',
      priority: 'Priority',
      budget: 'Token Budget',
      used: 'Used',
      remaining: 'Remaining',
      entries: 'Entries',
      addEntry: 'Add Entry',
      archive: 'Archive Thread',
      pause: 'Pause',
      resume: 'Resume',
      complete: 'Complete',
      placeholder: 'Write your thought...',
      types: {
        thought: 'Thought',
        decision: 'Decision',
        question: 'Question',
        reference: 'Reference',
        action: 'Action'
      },
      statuses: {
        active: 'Active',
        paused: 'Paused',
        archived: 'Archived',
        completed: 'Completed'
      }
    },
    fr: {
      title: 'Fil',
      status: 'Statut',
      priority: 'Priorité',
      budget: 'Budget Tokens',
      used: 'Utilisés',
      remaining: 'Restants',
      entries: 'Entrées',
      addEntry: 'Ajouter une entrée',
      archive: 'Archiver le fil',
      pause: 'Pause',
      resume: 'Reprendre',
      complete: 'Compléter',
      placeholder: 'Écrivez votre pensée...',
      types: {
        thought: 'Pensée',
        decision: 'Décision',
        question: 'Question',
        reference: 'Référence',
        action: 'Action'
      },
      statuses: {
        active: 'Actif',
        paused: 'En pause',
        archived: 'Archivé',
        completed: 'Complété'
      }
    }
  };

  const t = labels[language];

  const tokensRemaining = thread.tokenBudget - thread.tokensUsed;
  const budgetPercentUsed = (thread.tokensUsed / thread.tokenBudget) * 100;

  const handleAddEntry = () => {
    if (!newEntryContent.trim()) return;
    
    onAddEntry({
      type: newEntryType,
      content: newEntryContent
    });
    
    setNewEntryContent('');
  };

  const handleUpdateBudget = () => {
    onUpdateBudget(newBudget);
    setShowBudgetEditor(false);
  };

  const getEntryTypeIcon = (type: ThreadEntry['type']): string => {
    const icons = {
      thought: '💭',
      decision: '⚖️',
      question: '❓',
      reference: '🔗',
      action: '⚡'
    };
    return icons[type];
  };

  const getStatusColor = (status: ThreadStatus): string => {
    const colors = {
      active: '#3F7249',
      paused: '#D8B26A',
      archived: '#8D8371',
      completed: '#3B82F6'
    };
    return colors[status];
  };

  return (
    <div
      className="thread-canonical"
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🧵</span>
              <h2 style={{ margin: 0, fontSize: '18px' }}>{thread.title}</h2>
              <span
                style={{
                  padding: '4px 8px',
                  background: getStatusColor(thread.status),
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 500
                }}
              >
                {t.statuses[thread.status]}
              </span>
            </div>
            {thread.description && (
              <p style={{ margin: '8px 0 0 0', color: '#8D8371', fontSize: '13px' }}>
                {thread.description}
              </p>
            )}
          </div>

          {/* Status Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {thread.status === 'active' && (
              <button
                onClick={() => onUpdateStatus('paused')}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid #D8B26A',
                  borderRadius: '6px',
                  color: '#D8B26A',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ⏸ {t.pause}
              </button>
            )}
            {thread.status === 'paused' && (
              <button
                onClick={() => onUpdateStatus('active')}
                style={{
                  padding: '6px 12px',
                  background: '#3F7249',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ▶ {t.resume}
              </button>
            )}
            {thread.status !== 'archived' && thread.status !== 'completed' && (
              <button
                onClick={() => onUpdateStatus('completed')}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid #3B82F6',
                  borderRadius: '6px',
                  color: '#3B82F6',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ✓ {t.complete}
              </button>
            )}
          </div>
        </div>

        {/* Token Budget */}
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#1E1F22',
            borderRadius: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#8D8371' }}>
              💰 {t.budget}
            </span>
            <button
              onClick={() => setShowBudgetEditor(!showBudgetEditor)}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: '1px solid #3A3B3E',
                borderRadius: '4px',
                color: '#8D8371',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              ✏️
            </button>
          </div>

          {/* Budget Bar */}
          <div
            style={{
              height: '8px',
              background: '#3A3B3E',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.min(budgetPercentUsed, 100)}%`,
                height: '100%',
                background: budgetPercentUsed > 90 ? '#EF4444' : budgetPercentUsed > 70 ? '#D8B26A' : '#3F7249',
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
            <span style={{ color: '#8D8371' }}>
              {t.used}: <span style={{ color: '#E9E4D6' }}>{thread.tokensUsed.toLocaleString()}</span>
            </span>
            <span style={{ color: '#8D8371' }}>
              {t.remaining}: <span style={{ color: tokensRemaining < 1000 ? '#EF4444' : '#3F7249' }}>
                {tokensRemaining.toLocaleString()}
              </span>
            </span>
          </div>

          {/* Budget Editor */}
          {showBudgetEditor && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(parseInt(e.target.value) || 0)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#2A2B2E',
                  border: '1px solid #3A3B3E',
                  borderRadius: '6px',
                  color: '#E9E4D6',
                  fontSize: '13px'
                }}
              />
              <button
                onClick={handleUpdateBudget}
                style={{
                  padding: '8px 12px',
                  background: '#D8B26A',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#1E1F22',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                ✓
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Entries Timeline */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#8D8371', fontSize: '12px' }}>
          {t.entries} ({thread.entries.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {thread.entries.map(entry => (
            <div
              key={entry.id}
              style={{
                padding: '12px',
                background: '#2A2B2E',
                borderRadius: '8px',
                borderLeft: `3px solid ${getEntryTypeColor(entry.type)}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{getEntryTypeIcon(entry.type)}</span>
                  <span style={{ fontSize: '12px', color: '#D8B26A' }}>
                    {t.types[entry.type]}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#8D8371' }}>
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
                {entry.content}
              </div>
              {entry.tokensUsed && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#8D8371' }}>
                  🪙 {entry.tokensUsed} tokens
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Entry Form */}
      {thread.status === 'active' && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #3A3B3E',
            background: '#2A2B2E'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {(['thought', 'decision', 'question', 'reference', 'action'] as ThreadEntry['type'][]).map(type => (
              <button
                key={type}
                onClick={() => setNewEntryType(type)}
                style={{
                  padding: '6px 10px',
                  background: newEntryType === type ? '#3A3B3E' : 'transparent',
                  border: '1px solid #3A3B3E',
                  borderRadius: '6px',
                  color: newEntryType === type ? '#E9E4D6' : '#8D8371',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {getEntryTypeIcon(type)} {t.types[type]}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newEntryContent}
              onChange={(e) => setNewEntryContent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddEntry()}
              placeholder={t.placeholder}
              style={{
                flex: 1,
                padding: '12px',
                background: '#1E1F22',
                border: '1px solid #3A3B3E',
                borderRadius: '8px',
                color: '#E9E4D6',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleAddEntry}
              disabled={!newEntryContent.trim()}
              style={{
                padding: '12px 20px',
                background: newEntryContent.trim() ? '#D8B26A' : '#3A3B3E',
                border: 'none',
                borderRadius: '8px',
                color: '#1E1F22',
                cursor: newEntryContent.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 600
              }}
            >
              {t.addEntry}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function
function getEntryTypeColor(type: ThreadEntry['type']): string {
  const colors = {
    thought: '#8B5CF6',
    decision: '#3F7249',
    question: '#3B82F6',
    reference: '#D8B26A',
    action: '#EF4444'
  };
  return colors[type];
}

export default ThreadCanonical;
