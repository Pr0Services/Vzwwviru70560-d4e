// CHE·NU™ Collaboration Demo
// Exemple d'utilisation du module Collaboration
// À placer dans Business Sphere → Projects → CHE·NU → Collaboration

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';
import CollaborationSpace from './CollaborationSpace';
import { CollaborationSpace as CollaborationSpaceType } from './collaboration.types';

// ============================================================
// MOCK DATA — CHE·NU Collaboration Space
// ============================================================

const MOCK_COLLABORATION: CollaborationSpaceType = {
  id: 'collab-chenu-001',
  project_id: 'proj-chenu-001',
  name: 'CHE·NU · Collaboration',
  description: `CHE·NU est un système d'exploitation pour intelligence gouvernée. 
Cet espace de collaboration permet de co-construire la plateforme 
avec une équipe alignée sur les principes de gouvernance, clarté, 
et souveraineté utilisateur.`,
  status: 'active',
  owner_id: 'user-jonathan-001',
  collaborators: [
    {
      id: 'collab-001',
      user_id: 'user-jonathan-001',
      email: 'jo@che-nu.com',
      name: 'Jonathan',
      avatar_url: null,
      role: 'facilitator',
      status: 'active',
      invited_at: '2025-12-01T00:00:00Z',
      joined_at: '2025-12-01T00:00:00Z',
      invited_by: 'user-jonathan-001',
    },
    {
      id: 'collab-002',
      user_id: 'user-claude-001',
      email: 'claude@anthropic.com',
      name: 'Claude',
      avatar_url: null,
      role: 'contributor',
      status: 'active',
      invited_at: '2025-12-15T10:00:00Z',
      joined_at: '2025-12-15T10:30:00Z',
      invited_by: 'user-jonathan-001',
    },
    {
      id: 'collab-003',
      user_id: null,
      email: 'alice@example.com',
      name: 'Alice Martin',
      avatar_url: null,
      role: 'observer',
      status: 'pending',
      invited_at: '2025-12-28T09:00:00Z',
      joined_at: null,
      invited_by: 'user-jonathan-001',
    },
  ],
  created_at: '2025-12-01T00:00:00Z',
  updated_at: '2025-12-28T14:00:00Z',
  meetings_count: 5,
  sessions_count: 12,
  decisions_count: 23,
  next_meeting: {
    id: 'meeting-001',
    collaboration_id: 'collab-chenu-001',
    title: 'Sprint Planning - Module Collaboration',
    scheduled_at: '2025-12-30T14:00:00Z',
    duration_minutes: 60,
    status: 'upcoming',
    context: 'Planification du développement du module Collaboration',
    agenda: [
      { id: '1', title: 'Review specs', duration_minutes: 15, presenter: 'Jo', completed: false },
      { id: '2', title: 'Define tasks', duration_minutes: 30, presenter: null, completed: false },
      { id: '3', title: 'Assign ownership', duration_minutes: 15, presenter: null, completed: false },
    ],
    notes: '',
    decisions: [],
    action_items: [],
    participants: [
      { user_id: 'user-jonathan-001', name: 'Jonathan', email: 'jo@che-nu.com', status: 'accepted' },
      { user_id: 'user-claude-001', name: 'Claude', email: 'claude@anthropic.com', status: 'accepted' },
    ],
    created_by: 'user-jonathan-001',
    created_at: '2025-12-28T10:00:00Z',
  },
};

// ============================================================
// DEMO COMPONENT
// ============================================================

const CollaborationDemo: React.FC = () => {
  const [showCollaboration, setShowCollaboration] = useState(true);
  
  // Simulate current user (Jonathan - owner)
  const currentUserId = 'user-jonathan-001';
  const isOwner = MOCK_COLLABORATION.owner_id === currentUserId;
  
  if (!showCollaboration) {
    // Show "Project View" placeholder
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: CHENU_COLORS.uiSlate,
        color: CHENU_COLORS.softSand,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>💼</div>
        <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
          CHE·NU Project
        </div>
        <div style={{ fontSize: '14px', color: CHENU_COLORS.ancientStone, marginBottom: '32px' }}>
          Business Sphere → Projects → CHE·NU
        </div>
        <button
          onClick={() => setShowCollaboration(true)}
          style={{
            padding: '14px 28px',
            backgroundColor: CHENU_COLORS.sacredGold,
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Open Collaboration Space →
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ height: '100vh', backgroundColor: CHENU_COLORS.uiSlate }}>
      <CollaborationSpace
        collaboration={MOCK_COLLABORATION}
        onBack={() => setShowCollaboration(false)}
        currentUserId={currentUserId}
        isOwner={isOwner}
      />
    </div>
  );
};

export default CollaborationDemo;
