// CHE·NU™ Collaboration Space — Main Component
// Business Sphere → Project → Collaboration
// Règle d'or: Dashboard montre, Workspace fait, Collaboration construit

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';
import { 
  CollaborationSection, 
  COLLABORATION_SECTIONS,
  CollaborationSpace as CollaborationSpaceType,
  Collaborator,
  COLLABORATOR_ROLE_CONFIG,
} from './collaboration.types';
import CollaborationOverview from './CollaborationOverview';
import CollaborationMeetings from './CollaborationMeetings';
import CollaborationWorkingSessions from './CollaborationWorkingSessions';
import CollaborationNotesDecisions from './CollaborationNotesDecisions';
import CollaborationVisionPrinciples from './CollaborationVisionPrinciples';
import InviteCollaboratorModal from './InviteCollaboratorModal';

// ============================================================
// PROPS
// ============================================================

interface CollaborationSpaceProps {
  collaboration: CollaborationSpaceType;
  onBack: () => void;
  currentUserId: string;
  isOwner: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.softSand,
  },
  
  // Sidebar interne
  sidebar: {
    width: '260px',
    backgroundColor: '#111113',
    borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    transition: 'all 0.15s ease',
  },
  collaborationTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  collaborationStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#10B98122',
    color: '#10B981',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500,
  },
  
  // Navigation sections
  navSection: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '12px',
  },
  navItem: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '15' : 'transparent',
    borderRadius: '10px',
    border: 'none',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
    fontSize: '14px',
    marginBottom: '4px',
    transition: 'all 0.15s ease',
  }),
  navIcon: {
    fontSize: '16px',
    width: '24px',
    textAlign: 'center' as const,
  },
  navLabel: {
    flex: 1,
  },
  
  // Collaborateurs section
  collaboratorsSection: {
    padding: '16px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  collaboratorsSectionTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  collaboratorsTitleText: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  inviteButton: {
    padding: '4px 10px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  collaboratorsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  collaboratorItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
  },
  collaboratorAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
  },
  collaboratorInfo: {
    flex: 1,
    minWidth: 0,
  },
  collaboratorName: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  collaboratorRole: (color: string) => ({
    fontSize: '10px',
    color: color,
    fontWeight: 500,
  }),
  collaboratorPending: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    fontStyle: 'italic' as const,
  },
  
  // Main content
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  header: {
    padding: '16px 24px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111113',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerIcon: {
    fontSize: '20px',
  },
  headerText: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  contentArea: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

const CollaborationSpace: React.FC<CollaborationSpaceProps> = ({
  collaboration,
  onBack,
  currentUserId,
  isOwner,
}) => {
  const [activeSection, setActiveSection] = useState<CollaborationSection>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Get current section config
  const currentSectionConfig = COLLABORATION_SECTIONS.find(s => s.id === activeSection)!;
  
  // Get user's role in collaboration
  const currentUserRole = collaboration.collaborators.find(c => c.user_id === currentUserId)?.role;
  const canFacilitate = isOwner || currentUserRole === 'facilitator';
  const canContribute = canFacilitate || currentUserRole === 'contributor';
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <CollaborationOverview collaboration={collaboration} />;
      case 'meetings':
        return (
          <CollaborationMeetings 
            collaborationId={collaboration.id}
            canFacilitate={canFacilitate}
          />
        );
      case 'working-sessions':
        return (
          <CollaborationWorkingSessions 
            collaborationId={collaboration.id}
            canContribute={canContribute}
          />
        );
      case 'notes-decisions':
        return (
          <CollaborationNotesDecisions 
            collaborationId={collaboration.id}
            canContribute={canContribute}
          />
        );
      case 'vision-principles':
        return (
          <CollaborationVisionPrinciples 
            collaborationId={collaboration.id}
            canEdit={canFacilitate}
          />
        );
      default:
        return null;
    }
  };
  
  // Get header actions based on section
  const renderHeaderActions = () => {
    switch (activeSection) {
      case 'meetings':
        return canFacilitate && (
          <button style={styles.actionButton}>
            <span>📅</span>
            <span>New Meeting</span>
          </button>
        );
      case 'working-sessions':
        return canContribute && (
          <button style={styles.actionButton}>
            <span>🛠️</span>
            <span>New Session</span>
          </button>
        );
      case 'notes-decisions':
        return canContribute && (
          <button style={styles.actionButton}>
            <span>📝</span>
            <span>Add Note</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Header */}
        <div style={styles.sidebarHeader}>
          <button 
            style={styles.backButton}
            onClick={onBack}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ffffff11'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span>←</span>
            <span>Back to Project</span>
          </button>
          
          <div style={styles.collaborationTitle}>{collaboration.name}</div>
          <div style={styles.collaborationStatus}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              backgroundColor: '#10B981', 
              borderRadius: '50%' 
            }} />
            Active
          </div>
        </div>
        
        {/* Navigation */}
        <div style={styles.navSection}>
          {COLLABORATION_SECTIONS.map(section => (
            <button
              key={section.id}
              style={styles.navItem(activeSection === section.id)}
              onClick={() => setActiveSection(section.id)}
            >
              <span style={styles.navIcon}>{section.icon}</span>
              <span style={styles.navLabel}>{section.name}</span>
            </button>
          ))}
        </div>
        
        {/* Collaborateurs */}
        <div style={styles.collaboratorsSection}>
          <div style={styles.collaboratorsSectionTitle}>
            <span style={styles.collaboratorsTitleText}>
              Collaborators ({collaboration.collaborators.length})
            </span>
            {isOwner && (
              <button 
                style={styles.inviteButton}
                onClick={() => setShowInviteModal(true)}
              >
                + Invite
              </button>
            )}
          </div>
          
          <div style={styles.collaboratorsList}>
            {collaboration.collaborators.slice(0, 5).map(collab => {
              const roleConfig = COLLABORATOR_ROLE_CONFIG[collab.role];
              return (
                <div key={collab.id} style={styles.collaboratorItem}>
                  <div style={styles.collaboratorAvatar}>
                    {getInitials(collab.name)}
                  </div>
                  <div style={styles.collaboratorInfo}>
                    <div style={styles.collaboratorName}>{collab.name}</div>
                    {collab.status === 'pending' ? (
                      <div style={styles.collaboratorPending}>Invitation pending...</div>
                    ) : (
                      <div style={styles.collaboratorRole(roleConfig.color)}>
                        {roleConfig.name}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {collaboration.collaborators.length > 5 && (
              <button style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: CHENU_COLORS.ancientStone,
                fontSize: '12px',
                cursor: 'pointer',
              }}>
                +{collaboration.collaborators.length - 5} more...
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <span style={styles.headerIcon}>{currentSectionConfig.icon}</span>
            <span style={styles.headerText}>{currentSectionConfig.name}</span>
          </div>
          
          <div style={styles.headerActions}>
            {renderHeaderActions()}
          </div>
        </div>
        
        {/* Content */}
        <div style={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
      
      {/* Invite Modal */}
      {showInviteModal && (
        <InviteCollaboratorModal
          collaborationId={collaboration.id}
          onClose={() => setShowInviteModal(false)}
          onInvite={(email, role, message) => {
            logger.debug('Invite:', email, role, message);
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CollaborationSpace;
