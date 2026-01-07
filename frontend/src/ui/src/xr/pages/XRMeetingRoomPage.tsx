/**
 * ============================================================
 * CHE·NU — XR MEETING ROOM PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface Participant {
  id: string;
  name: string;
  role: 'host' | 'cohost' | 'participant' | 'observer';
  avatarStyle: string;
  avatarColor: string;
  status: 'active' | 'away' | 'muted' | 'presenting';
  position: number; // seat position
}

interface MeetingRoom {
  id: string;
  name: string;
  type: 'roundtable' | 'theater' | 'workshop' | 'lounge' | 'boardroom';
  capacity: number;
  sphere: string;
  environment: string;
  participants: Participant[];
}

interface RoomTemplate {
  id: string;
  name: string;
  type: string;
  capacity: number;
  description: string;
  icon: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const ROOM_TEMPLATES: RoomTemplate[] = [
  { id: 'roundtable', name: 'Round Table', type: 'roundtable', capacity: 8, description: 'Collaborative discussions', icon: '⭕' },
  { id: 'theater', name: 'Theater', type: 'theater', capacity: 50, description: 'Presentations & talks', icon: '🎭' },
  { id: 'workshop', name: 'Workshop', type: 'workshop', capacity: 12, description: 'Hands-on sessions', icon: '🔧' },
  { id: 'lounge', name: 'Lounge', type: 'lounge', capacity: 6, description: 'Casual conversations', icon: '🛋️' },
  { id: 'boardroom', name: 'Boardroom', type: 'boardroom', capacity: 16, description: 'Formal meetings', icon: '🏛️' },
];

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Nova AI', role: 'host', avatarStyle: 'geometric', avatarColor: CHENU_COLORS.sacredGold, status: 'active', position: 0 },
  { id: 'p2', name: 'Alex Chen', role: 'cohost', avatarStyle: 'abstract', avatarColor: CHENU_COLORS.cenoteTurquoise, status: 'presenting', position: 1 },
  { id: 'p3', name: 'Jordan Lee', role: 'participant', avatarStyle: 'minimal', avatarColor: CHENU_COLORS.jungleEmerald, status: 'active', position: 2 },
  { id: 'p4', name: 'Sam Rivera', role: 'participant', avatarStyle: 'organic', avatarColor: '#9B59B6', status: 'muted', position: 3 },
  { id: 'p5', name: 'Taylor Kim', role: 'participant', avatarStyle: 'geometric', avatarColor: '#E74C3C', status: 'away', position: 4 },
  { id: 'p6', name: 'Casey Morgan', role: 'observer', avatarStyle: 'abstract', avatarColor: CHENU_COLORS.earthEmber, status: 'active', position: 5 },
];

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  roomIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${CHENU_COLORS.sacredGold}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  roomInfo: {},
  roomName: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  roomMeta: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '4px',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#E74C3C',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#E74C3C',
    animation: 'pulse 2s infinite',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  primaryButton: {
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
  },
  dangerButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#E74C3C',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    height: 'calc(100vh - 81px)',
  },
  viewport: {
    position: 'relative',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomView: {
    position: 'relative',
    width: '600px',
    height: '600px',
  },
  tableCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: `${CHENU_COLORS.earthEmber}40`,
    border: `3px solid ${CHENU_COLORS.earthEmber}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  tableLabel: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '8px',
  },
  participantSeat: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  avatarStatus: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: `2px solid ${CHENU_COLORS.uiSlate}`,
  },
  participantName: {
    fontSize: '12px',
    fontWeight: 500,
    textAlign: 'center',
    maxWidth: '80px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  participantRole: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase',
  },
  controls: {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '12px 20px',
    borderRadius: '24px',
  },
  controlButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
  },
  controlButtonActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  controlButtonDanger: {
    backgroundColor: '#E74C3C',
    color: '#fff',
  },
  sidebar: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderLeft: `1px solid ${CHENU_COLORS.shadowMoss}`,
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTabs: {
    display: 'flex',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  tab: {
    flex: 1,
    padding: '14px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.ancientStone,
    transition: 'all 0.2s ease',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: CHENU_COLORS.cenoteTurquoise,
    borderBottomColor: CHENU_COLORS.cenoteTurquoise,
  },
  sidebarContent: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '12px',
    letterSpacing: '0.5px',
  },
  participantList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  participantCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  participantAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  participantInfo: {
    flex: 1,
  },
  participantCardName: {
    fontSize: '13px',
    fontWeight: 500,
  },
  participantCardRole: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  templateCard: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid transparent`,
  },
  templateCardActive: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: 'rgba(216, 178, 106, 0.1)',
  },
  templateIcon: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  templateName: {
    fontSize: '12px',
    fontWeight: 500,
    marginBottom: '2px',
  },
  templateCapacity: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRMeetingRoomPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'participants' | 'settings' | 'chat'>('participants');
  const [selectedTemplate, setSelectedTemplate] = useState('roundtable');
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);

  const [room] = useState<MeetingRoom>({
    id: 'room-1',
    name: 'Project Review Session',
    type: 'roundtable',
    capacity: 8,
    sphere: 'business',
    environment: 'business-hub',
    participants: MOCK_PARTICIPANTS,
  });

  // Calculate seat positions (circular layout)
  const getSeatPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 230;
    return {
      left: `calc(50% + ${Math.cos(angle) * radius}px - 40px)`,
      top: `calc(50% + ${Math.sin(angle) * radius}px - 40px)`,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return CHENU_COLORS.cenoteTurquoise;
      case 'presenting': return CHENU_COLORS.sacredGold;
      case 'muted': return CHENU_COLORS.ancientStone;
      case 'away': return '#E74C3C';
      default: return CHENU_COLORS.ancientStone;
    }
  };

  const getAvatarIcon = (style: string) => {
    switch (style) {
      case 'geometric': return '◆';
      case 'abstract': return '◎';
      case 'minimal': return '○';
      case 'organic': return '❂';
      default: return '●';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.roomIcon}>⭕</div>
          <div style={styles.roomInfo}>
            <h1 style={styles.roomName}>{room.name}</h1>
            <div style={styles.roomMeta}>
              <span style={styles.liveIndicator}>
                <span style={styles.liveDot} />
                LIVE
              </span>
              <span>👥 {room.participants.length}/{room.capacity}</span>
              <span>⏱️ 00:42:15</span>
            </div>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            📋 Copy Link
          </button>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            ⚙️ Settings
          </button>
          <button style={{ ...styles.button, ...styles.dangerButton }}>
            Leave Room
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        {/* Viewport */}
        <div style={styles.viewport}>
          <div style={styles.roomView}>
            {/* Table Center */}
            <div style={styles.tableCenter}>
              <span style={{ fontSize: '32px' }}>🎯</span>
              <span style={styles.tableLabel}>Discussion Area</span>
            </div>

            {/* Participant Seats */}
            {room.participants.map((participant, index) => (
              <div
                key={participant.id}
                style={{
                  ...styles.participantSeat,
                  ...getSeatPosition(index, room.participants.length),
                }}
              >
                <div
                  style={{
                    ...styles.avatar,
                    backgroundColor: `${participant.avatarColor}30`,
                    border: `3px solid ${participant.avatarColor}`,
                    boxShadow: participant.status === 'presenting'
                      ? `0 0 20px ${participant.avatarColor}`
                      : 'none',
                  }}
                >
                  {getAvatarIcon(participant.avatarStyle)}
                  <div
                    style={{
                      ...styles.avatarStatus,
                      backgroundColor: getStatusColor(participant.status),
                    }}
                  />
                </div>
                <span style={styles.participantName}>{participant.name}</span>
                <span style={styles.participantRole}>{participant.role}</span>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <button
              style={{
                ...styles.controlButton,
                ...(micOn ? styles.controlButtonActive : {}),
              }}
              onClick={() => setMicOn(!micOn)}
            >
              {micOn ? '🎤' : '🔇'}
            </button>
            <button
              style={{
                ...styles.controlButton,
                ...(cameraOn ? styles.controlButtonActive : {}),
              }}
              onClick={() => setCameraOn(!cameraOn)}
            >
              {cameraOn ? '📹' : '📷'}
            </button>
            <button
              style={{
                ...styles.controlButton,
                ...(screenShare ? styles.controlButtonActive : {}),
              }}
              onClick={() => setScreenShare(!screenShare)}
            >
              🖥️
            </button>
            <button style={styles.controlButton}>
              ✋
            </button>
            <button style={styles.controlButton}>
              😊
            </button>
            <button style={{ ...styles.controlButton, ...styles.controlButtonDanger }}>
              📞
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarTabs}>
            <div
              style={{
                ...styles.tab,
                ...(activeTab === 'participants' ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab('participants')}
            >
              👥 People
            </div>
            <div
              style={{
                ...styles.tab,
                ...(activeTab === 'chat' ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab('chat')}
            >
              💬 Chat
            </div>
            <div
              style={{
                ...styles.tab,
                ...(activeTab === 'settings' ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️
            </div>
          </div>

          <div style={styles.sidebarContent}>
            {activeTab === 'participants' && (
              <>
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>
                    Participants ({room.participants.length})
                  </div>
                  <div style={styles.participantList}>
                    {room.participants.map(participant => (
                      <div key={participant.id} style={styles.participantCard}>
                        <div
                          style={{
                            ...styles.participantAvatar,
                            backgroundColor: `${participant.avatarColor}30`,
                            border: `2px solid ${participant.avatarColor}`,
                          }}
                        >
                          {getAvatarIcon(participant.avatarStyle)}
                        </div>
                        <div style={styles.participantInfo}>
                          <div style={styles.participantCardName}>
                            {participant.name}
                            {participant.role === 'host' && ' 👑'}
                          </div>
                          <div style={styles.participantCardRole}>
                            {participant.role} • {participant.status}
                          </div>
                        </div>
                        <div
                          style={{
                            ...styles.statusDot,
                            backgroundColor: getStatusColor(participant.status),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button style={{ ...styles.button, ...styles.primaryButton, width: '100%' }}>
                  + Invite Participant
                </button>
              </>
            )}

            {activeTab === 'settings' && (
              <>
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Room Layout</div>
                  <div style={styles.templateGrid}>
                    {ROOM_TEMPLATES.map(template => (
                      <div
                        key={template.id}
                        style={{
                          ...styles.templateCard,
                          ...(selectedTemplate === template.id ? styles.templateCardActive : {}),
                        }}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div style={styles.templateIcon}>{template.icon}</div>
                        <div style={styles.templateName}>{template.name}</div>
                        <div style={styles.templateCapacity}>Up to {template.capacity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'chat' && (
              <div style={{ textAlign: 'center', color: CHENU_COLORS.ancientStone, padding: '40px 20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
                <div>Chat messages will appear here</div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default XRMeetingRoomPage;
