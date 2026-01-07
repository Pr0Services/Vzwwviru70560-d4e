// CHE·NU™ Invite Collaborator Modal
// Permet d'inviter par:
// - Recherche utilisateurs CHE·NU existants
// - Email (invitation externe)

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';
import { CollaboratorRole, COLLABORATOR_ROLE_CONFIG } from './collaboration.types';

interface InviteCollaboratorModalProps {
  collaborationId: string;
  onClose: () => void;
  onInvite: (email: string, role: CollaboratorRole, message: string | null) => void;
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '480px',
    backgroundColor: '#111113',
    borderRadius: '16px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  closeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  body: {
    padding: '24px',
  },
  
  // Tabs
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
    marginBottom: '24px',
  },
  tab: (isActive: boolean) => ({
    flex: 1,
    padding: '10px 16px',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold : 'transparent',
    color: isActive ? '#000' : CHENU_COLORS.softSand,
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }),
  
  // Form
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#0a0a0b',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '10px',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  },
  inputFocus: {
    borderColor: CHENU_COLORS.sacredGold,
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#0a0a0b',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '10px',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '80px',
    fontFamily: 'inherit',
  },
  
  // Role Selection
  roleOptions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  roleOption: (isSelected: boolean, color: string) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px',
    backgroundColor: isSelected ? color + '11' : '#0a0a0b',
    border: `1px solid ${isSelected ? color + '44' : CHENU_COLORS.ancientStone + '22'}`,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }),
  roleRadio: (isSelected: boolean, color: string) => ({
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: `2px solid ${isSelected ? color : CHENU_COLORS.ancientStone}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  }),
  roleRadioInner: (color: string) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  roleInfo: {
    flex: 1,
  },
  roleName: (color: string) => ({
    fontSize: '14px',
    fontWeight: 600,
    color: color,
    marginBottom: '4px',
  }),
  roleDescription: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Search Results
  searchResults: {
    marginTop: '12px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
  },
  searchResultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  resultAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
  },
  resultEmail: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Footer
  footer: {
    padding: '16px 24px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    borderRadius: '10px',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
  },
  inviteButton: (disabled: boolean) => ({
    padding: '10px 24px',
    backgroundColor: disabled ? CHENU_COLORS.ancientStone : CHENU_COLORS.sacredGold,
    border: 'none',
    borderRadius: '10px',
    color: disabled ? CHENU_COLORS.softSand : '#000',
    fontSize: '14px',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }),
  
  // Helper text
  helperText: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '8px',
  },
};

// Mock existing users
const MOCK_USERS = [
  { id: '1', name: 'Alice Martin', email: 'alice@example.com' },
  { id: '2', name: 'Bob Chen', email: 'bob@techcorp.com' },
  { id: '3', name: 'Claire Dubois', email: 'claire@startup.io' },
];

const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
  collaborationId,
  onClose,
  onInvite,
}) => {
  const [inviteMode, setInviteMode] = useState<'search' | 'email'>('email');
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [role, setRole] = useState<CollaboratorRole>('contributor');
  const [message, setMessage] = useState('');
  
  // Filter users based on search
  const filteredUsers = searchQuery.length >= 2
    ? MOCK_USERS.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // Validate email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const canInvite = inviteMode === 'email' 
    ? isValidEmail(email) 
    : selectedUser !== null;
  
  const handleInvite = () => {
    const inviteEmail = inviteMode === 'email' ? email : selectedUser!.email;
    onInvite(inviteEmail, role, message || null);
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>Invite Collaborator</span>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        {/* Body */}
        <div style={styles.body}>
          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              style={styles.tab(inviteMode === 'email')}
              onClick={() => {
                setInviteMode('email');
                setSelectedUser(null);
              }}
            >
              📧 By Email
            </button>
            <button
              style={styles.tab(inviteMode === 'search')}
              onClick={() => {
                setInviteMode('search');
                setEmail('');
              }}
            >
              🔍 Find User
            </button>
          </div>
          
          {/* Email Input */}
          {inviteMode === 'email' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = CHENU_COLORS.sacredGold}
                onBlur={e => e.target.style.borderColor = CHENU_COLORS.ancientStone + '33'}
              />
              <div style={styles.helperText}>
                They'll receive an email invitation to join this collaboration
              </div>
            </div>
          )}
          
          {/* Search Input */}
          {inviteMode === 'search' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Search CHE·NU Users</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSelectedUser(null);
                }}
              />
              
              {/* Search Results */}
              {filteredUsers.length > 0 && !selectedUser && (
                <div style={styles.searchResults}>
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      style={styles.searchResultItem}
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery(user.name);
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#151517'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0a0a0b'}
                    >
                      <div style={styles.resultAvatar}>
                        {getInitials(user.name)}
                      </div>
                      <div style={styles.resultInfo}>
                        <div style={styles.resultName}>{user.name}</div>
                        <div style={styles.resultEmail}>{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Selected User */}
              {selectedUser && (
                <div style={{ ...styles.searchResultItem, marginTop: '12px', backgroundColor: CHENU_COLORS.sacredGold + '11', border: `1px solid ${CHENU_COLORS.sacredGold}33` }}>
                  <div style={styles.resultAvatar}>
                    {getInitials(selectedUser.name)}
                  </div>
                  <div style={styles.resultInfo}>
                    <div style={styles.resultName}>{selectedUser.name}</div>
                    <div style={styles.resultEmail}>{selectedUser.email}</div>
                  </div>
                  <button
                    style={{ ...styles.closeButton, fontSize: '14px' }}
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchQuery('');
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              
              {searchQuery.length >= 2 && filteredUsers.length === 0 && !selectedUser && (
                <div style={{ ...styles.helperText, marginTop: '12px' }}>
                  No users found. Try inviting by email instead.
                </div>
              )}
            </div>
          )}
          
          {/* Role Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <div style={styles.roleOptions}>
              {(Object.entries(COLLABORATOR_ROLE_CONFIG) as [CollaboratorRole, typeof COLLABORATOR_ROLE_CONFIG[CollaboratorRole]][]).map(([key, config]) => (
                <div
                  key={key}
                  style={styles.roleOption(role === key, config.color)}
                  onClick={() => setRole(key)}
                >
                  <div style={styles.roleRadio(role === key, config.color)}>
                    {role === key && <div style={styles.roleRadioInner(config.color)} />}
                  </div>
                  <div style={styles.roleInfo}>
                    <div style={styles.roleName(config.color)}>{config.name}</div>
                    <div style={styles.roleDescription}>{config.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Personal Message */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Personal Message (Optional)</label>
            <textarea
              style={styles.textarea}
              placeholder="Add a personal note to your invitation..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            style={styles.inviteButton(!canInvite)}
            disabled={!canInvite}
            onClick={handleInvite}
          >
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteCollaboratorModal;
