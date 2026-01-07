/**
 * CHE·NU — Meeting Workspace Component
 * ============================================================
 * Main meeting interface with 3-surface layout.
 * AI is OFF by default, enabled only with consent.
 * 
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import { useMeeting, NOVA_MEETING_MESSAGES } from '../../hooks/useMeeting';
import styles from './MeetingWorkspace.module.css';

// ============================================================
// NOVA PANEL
// ============================================================

interface NovaPanelProps {
  message: string;
  aiEnabled: boolean;
  canEnableAI: boolean;
  onEnableAI: () => void;
  budgetPercentage: number;
  budgetWarning: 'none' | 'approaching' | 'critical';
}

const NovaPanel: React.FC<NovaPanelProps> = ({
  message,
  aiEnabled,
  canEnableAI,
  onEnableAI,
  budgetPercentage,
  budgetWarning
}) => {
  const [showEnablePrompt, setShowEnablePrompt] = useState(false);
  
  return (
    <div className={styles.novaPanel}>
      <div className={styles.novaHeader}>
        <div className={styles.novaIndicator} />
        <span className={styles.novaLabel}>Nova</span>
      </div>
      
      <div className={styles.novaContent}>
        <p className={styles.novaMessage}>{message}</p>
        
        {/* AI Enable prompt */}
        {showEnablePrompt && !aiEnabled && (
          <div className={styles.enablePrompt}>
            <p className={styles.promptText}>{NOVA_MEETING_MESSAGES.enableAI}</p>
            <div className={styles.promptButtons}>
              <button
                className={styles.secondaryButton}
                onClick={onEnableAI}
              >
                Enable assistance
              </button>
              <button
                className={styles.primaryButton}
                onClick={() => setShowEnablePrompt(false)}
                autoFocus
              >
                Continue without AI
              </button>
            </div>
          </div>
        )}
        
        {/* Enable AI button */}
        {canEnableAI && !showEnablePrompt && (
          <button
            className={styles.enableButton}
            onClick={() => setShowEnablePrompt(true)}
          >
            Enable AI assistance
          </button>
        )}
        
        {/* Budget meter */}
        {aiEnabled && (
          <div className={styles.budgetMeter}>
            <div className={styles.budgetHeader}>
              <span className={styles.budgetLabel}>Budget</span>
              <span className={styles.budgetValue}>
                {Math.round(budgetPercentage * 100)}%
              </span>
            </div>
            <div className={styles.budgetBar}>
              <div 
                className={`${styles.budgetFill} ${styles[budgetWarning]}`}
                style={{ width: `${budgetPercentage * 100}%` }}
              />
            </div>
            {budgetWarning !== 'none' && (
              <p className={`${styles.budgetWarning} ${styles[budgetWarning]}`}>
                {budgetWarning === 'approaching' 
                  ? NOVA_MEETING_MESSAGES.budgetApproaching
                  : NOVA_MEETING_MESSAGES.budgetCritical}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// CONTEXT PANEL
// ============================================================

interface ContextPanelProps {
  meetingName: string;
  status: string;
  projectName?: string;
  sphereName?: string;
  participantCount: number;
}

const ContextPanel: React.FC<ContextPanelProps> = ({
  meetingName,
  status,
  projectName,
  sphereName,
  participantCount
}) => (
  <div className={styles.contextPanel}>
    <div className={styles.contextHeader}>
      <h2 className={styles.meetingName}>{meetingName}</h2>
      <span className={`${styles.statusBadge} ${styles[status]}`}>
        {status}
      </span>
    </div>
    
    <div className={styles.contextDetails}>
      {projectName && (
        <div className={styles.contextItem}>
          <span className={styles.contextLabel}>Project</span>
          <span className={styles.contextValue}>{projectName}</span>
        </div>
      )}
      {sphereName && (
        <div className={styles.contextItem}>
          <span className={styles.contextLabel}>Sphere</span>
          <span className={styles.contextValue}>{sphereName}</span>
        </div>
      )}
      <div className={styles.contextItem}>
        <span className={styles.contextLabel}>Participants</span>
        <span className={styles.contextValue}>{participantCount}</span>
      </div>
    </div>
  </div>
);

// ============================================================
// WORKSPACE PANEL
// ============================================================

interface WorkspacePanelProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  decisions: string[];
  actionItems: Array<{ id: string; text: string; status: string }>;
  aiEnabled: boolean;
  onRequestSummary: () => void;
  onRequestActionItems: () => void;
}

const WorkspacePanel: React.FC<WorkspacePanelProps> = ({
  notes,
  onNotesChange,
  decisions,
  actionItems,
  aiEnabled,
  onRequestSummary,
  onRequestActionItems
}) => (
  <div className={styles.workspacePanel}>
    <div className={styles.workspaceSection}>
      <h3 className={styles.sectionTitle}>Notes</h3>
      <textarea
        className={styles.notesArea}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Meeting notes..."
      />
    </div>
    
    <div className={styles.workspaceSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Decisions</h3>
        <span className={styles.sectionCount}>{decisions.length}</span>
      </div>
      {decisions.length === 0 ? (
        <p className={styles.emptyState}>No decisions recorded</p>
      ) : (
        <ul className={styles.itemList}>
          {decisions.map((d, i) => (
            <li key={i} className={styles.item}>{d}</li>
          ))}
        </ul>
      )}
    </div>
    
    <div className={styles.workspaceSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Action Items</h3>
        <span className={styles.sectionCount}>{actionItems.length}</span>
      </div>
      {actionItems.length === 0 ? (
        <p className={styles.emptyState}>No action items</p>
      ) : (
        <ul className={styles.itemList}>
          {actionItems.map((item) => (
            <li key={item.id} className={styles.actionItem}>
              <span className={styles.actionText}>{item.text}</span>
              <span className={styles.actionStatus}>{item.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    
    {/* AI Actions */}
    {aiEnabled && (
      <div className={styles.aiActions}>
        <button
          className={styles.aiButton}
          onClick={onRequestSummary}
        >
          Propose summary
        </button>
        <button
          className={styles.aiButton}
          onClick={onRequestActionItems}
        >
          Extract action items
        </button>
      </div>
    )}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export const MeetingWorkspace: React.FC = () => {
  const {
    meeting,
    isLive,
    canEnableAI,
    budgetPercentage,
    budgetWarning,
    startMeeting,
    pauseMeeting,
    resumeMeeting,
    endMeeting,
    enableAI,
    updateNotes,
    requestSummary,
    requestActionItems
  } = useMeeting();
  
  // Get Nova message based on state
  const novaMessage = meeting?.aiEnabled
    ? 'AI assistance is active. All actions require confirmation.'
    : NOVA_MEETING_MESSAGES.initial;
  
  if (!meeting) {
    return (
      <div className={styles.empty}>
        <p>No meeting active</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      {/* Surface A - Nova */}
      <div className={styles.surfaceA}>
        <NovaPanel
          message={novaMessage}
          aiEnabled={meeting.aiEnabled}
          canEnableAI={canEnableAI}
          onEnableAI={() => enableAI('meeting')}
          budgetPercentage={budgetPercentage}
          budgetWarning={budgetWarning}
        />
      </div>
      
      {/* Surface B - Context */}
      <div className={styles.surfaceB}>
        <ContextPanel
          meetingName={meeting.config.name}
          status={meeting.status}
          projectName={meeting.config.projectId}
          sphereName={meeting.config.sphereId}
          participantCount={meeting.participants.length}
        />
        
        {/* Meeting controls */}
        <div className={styles.meetingControls}>
          {meeting.status === 'draft' && (
            <button className={styles.controlButton} onClick={startMeeting}>
              Start Meeting
            </button>
          )}
          {meeting.status === 'live' && (
            <>
              <button className={styles.controlButton} onClick={pauseMeeting}>
                Pause
              </button>
              <button className={styles.controlButtonDanger} onClick={endMeeting}>
                End Meeting
              </button>
            </>
          )}
          {meeting.status === 'paused' && (
            <>
              <button className={styles.controlButton} onClick={resumeMeeting}>
                Resume
              </button>
              <button className={styles.controlButtonDanger} onClick={endMeeting}>
                End Meeting
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Surface C - Workspace */}
      <div className={styles.surfaceC}>
        <WorkspacePanel
          notes={meeting.notes}
          onNotesChange={updateNotes}
          decisions={meeting.decisions}
          actionItems={meeting.actionItems}
          aiEnabled={meeting.aiEnabled}
          onRequestSummary={requestSummary}
          onRequestActionItems={requestActionItems}
        />
      </div>
    </div>
  );
};

export default MeetingWorkspace;
