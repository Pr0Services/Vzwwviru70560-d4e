// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU V44 — MASTER SPHERE COMMAND CENTER
// ═══════════════════════════════════════════════════════════════════════════════
//
// 🎛️ Jo's Ultimate Command Center Interface
//
// Sections:
// 1. Dashboard Overview
// 2. Nova Chat (with voice)
// 3. Notes Manager
// 4. Design Studio
// 5. User Management
// 6. Alerts Center
// 7. Menu Editor
// 8. Structure Editor
//
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface DashboardData {
  timestamp: string;
  sphereName: string;
  version: string;
  quickStats: {
    totalUsers: number;
    activeUsers: number;
    newAlerts: number;
    criticalAlerts: number;
    totalNotes: number;
    pinnedNotes: number;
    totalTemplates: number;
    totalAssets: number;
  };
  novaStatus: {
    connected: boolean;
    voiceEnabled: boolean;
    lastMessage: ChatMessage | null;
    messagesCount: number;
  };
  recentNotes: Note[];
  recentAlerts: Alert[];
  systemHealth: {
    status: string;
    uptime: string;
    lastCheck: string;
  };
}

interface ChatMessage {
  id: string;
  timestamp: string;
  role: 'user' | 'assistant' | 'system';
  type: 'text' | 'voice' | 'command';
  content: string;
  metadata?: Record<string, any>;
  audioUrl?: string;
  transcription?: string;
  commandResult?: Record<string, any>;
}

interface Note {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  category: string;
  status: string;
  severity: string;
  createdAt: string;
  source: string;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  active: boolean;
  verified: boolean;
  avatarUrl: string;
  lastLogin: string | null;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  order: number;
  visible: boolean;
  children?: MenuItem[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE = '/api/v2/master';

const api = {
  // Dashboard
  getDashboard: async (): Promise<DashboardData> => {
    const res = await fetch(`${API_BASE}/dashboard`);
    return res.json();
  },

  // Chat
  sendMessage: async (content: string): Promise<ChatMessage> => {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type: 'text' })
    });
    return res.json();
  },

  getChatHistory: async (limit = 50): Promise<{ messages: ChatMessage[] }> => {
    const res = await fetch(`${API_BASE}/chat/history?limit=${limit}`);
    return res.json();
  },

  // Notes
  getNotes: async (): Promise<{ notes: Note[] }> => {
    const res = await fetch(`${API_BASE}/notes`);
    return res.json();
  },

  createNote: async (data: Partial<Note>): Promise<Note> => {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  pinNote: async (id: string, pinned: boolean): Promise<Note> => {
    const res = await fetch(`${API_BASE}/notes/${id}/pin?pinned=${pinned}`, {
      method: 'POST'
    });
    return res.json();
  },

  // Alerts
  getAlerts: async (): Promise<{ alerts: Alert[] }> => {
    const res = await fetch(`${API_BASE}/alerts`);
    return res.json();
  },

  updateAlertStatus: async (id: string, status: string): Promise<Alert> => {
    const res = await fetch(`${API_BASE}/alerts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Users
  getUsers: async (): Promise<{ users: User[] }> => {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  // Menus
  getMenuTree: async (location: string): Promise<{ tree: MenuItem[] }> => {
    const res = await fetch(`${API_BASE}/menus/tree/${location}`);
    return res.json();
  },

  reorderMenu: async (id: string, order: number): Promise<MenuItem> => {
    const res = await fetch(`${API_BASE}/menus/${id}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_order: order })
    });
    return res.json();
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const MasterSphereCommandCenter: React.FC = () => {
  // State
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Alerts state
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Users state
  const [users, setUsers] = useState<User[]>([]);

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Load dashboard data
  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      // Simulated data for demo (replace with actual API call)
      const mockDashboard: DashboardData = {
        timestamp: new Date().toISOString(),
        sphereName: 'Master',
        version: '1.0.0',
        quickStats: {
          totalUsers: 156,
          activeUsers: 89,
          newAlerts: 3,
          criticalAlerts: 1,
          totalNotes: 24,
          pinnedNotes: 5,
          totalTemplates: 12,
          totalAssets: 45
        },
        novaStatus: {
          connected: true,
          voiceEnabled: true,
          lastMessage: null,
          messagesCount: 0
        },
        recentNotes: [],
        recentAlerts: [],
        systemHealth: {
          status: 'operational',
          uptime: '99.9%',
          lastCheck: new Date().toISOString()
        }
      };
      setDashboard(mockDashboard);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard');
      setLoading(false);
    }
  };

  // Chat functions
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      role: 'user',
      type: 'text',
      content: chatInput
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    // Simulate Nova response
    setTimeout(() => {
      const novaResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString(),
        role: 'assistant',
        type: 'text',
        content: getNovaResponse(chatInput)
      };
      setChatMessages(prev => [...prev, novaResponse]);
      setChatLoading(false);
    }, 1000);
  };

  const getNovaResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('bonjour') || lower.includes('salut')) {
      return '👋 Bonjour Jo! Comment puis-je t\'aider aujourd\'hui?';
    }
    if (lower.includes('status') || lower.includes('état')) {
      return `📊 **Status Système CHE·NU V44:**\n\n🚨 Alertes: ${dashboard?.quickStats.newAlerts || 0} nouvelles\n👥 Utilisateurs actifs: ${dashboard?.quickStats.activeUsers || 0}\n📝 Notes: ${dashboard?.quickStats.totalNotes || 0}\n🔄 Système: ✅ Opérationnel\n🧠 Nova Master: ✅ Connecté`;
    }
    if (lower.includes('help') || lower.includes('aide')) {
      return '🎛️ **Commandes disponibles:**\n- `/status` - État du système\n- `/alerts` - Voir les alertes\n- `/users` - Liste des utilisateurs\n- `/notes` - Tes notes récentes';
    }
    return `📝 J'ai bien noté: "${input}". Veux-tu que je crée une note ou une amélioration?`;
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Navigation items
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'chat', icon: '💬', label: 'Nova Chat' },
    { id: 'notes', icon: '📝', label: 'Notes' },
    { id: 'design', icon: '🎨', label: 'Design Studio' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'alerts', icon: '🚨', label: 'Alerts' },
    { id: 'menus', icon: '📑', label: 'Menus' },
    { id: 'structure', icon: '⚙️', label: 'Structure' }
  ];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>🎛️</div>
        <p>Loading Command Center...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>🎛️</span>
          <h1 style={styles.headerTitle}>MASTER SPHERE</h1>
          <span style={styles.badge}>Command Center</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.statusIndicator}>
            <span style={{...styles.statusDot, backgroundColor: dashboard?.novaStatus.connected ? '#22c55e' : '#ef4444'}}></span>
            <span>Nova {dashboard?.novaStatus.connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div style={styles.userAvatar}>JO</div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Sidebar */}
        <nav style={styles.sidebar}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                ...styles.navButton,
                ...(activeSection === item.id ? styles.navButtonActive : {})
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <main style={styles.content}>
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div style={styles.dashboardSection}>
              <h2 style={styles.sectionTitle}>📊 Command Center Dashboard</h2>
              
              {/* Quick Stats Grid */}
              <div style={styles.statsGrid}>
                <StatCard 
                  icon="👥" 
                  label="Users" 
                  value={dashboard?.quickStats.totalUsers || 0}
                  subvalue={`${dashboard?.quickStats.activeUsers || 0} active`}
                  color="#3b82f6"
                />
                <StatCard 
                  icon="🚨" 
                  label="Alerts" 
                  value={dashboard?.quickStats.newAlerts || 0}
                  subvalue={`${dashboard?.quickStats.criticalAlerts || 0} critical`}
                  color="#ef4444"
                  highlight={dashboard?.quickStats.criticalAlerts! > 0}
                />
                <StatCard 
                  icon="📝" 
                  label="Notes" 
                  value={dashboard?.quickStats.totalNotes || 0}
                  subvalue={`${dashboard?.quickStats.pinnedNotes || 0} pinned`}
                  color="#8b5cf6"
                />
                <StatCard 
                  icon="📋" 
                  label="Templates" 
                  value={dashboard?.quickStats.totalTemplates || 0}
                  subvalue="active"
                  color="#10b981"
                />
                <StatCard 
                  icon="🎨" 
                  label="Assets" 
                  value={dashboard?.quickStats.totalAssets || 0}
                  subvalue="uploaded"
                  color="#f59e0b"
                />
                <StatCard 
                  icon="🧠" 
                  label="System" 
                  value={dashboard?.systemHealth.status === 'operational' ? '✓' : '✗'}
                  subvalue={dashboard?.systemHealth.uptime || '0%'}
                  color="#22c55e"
                />
              </div>

              {/* System Health */}
              <div style={styles.healthCard}>
                <h3 style={styles.cardTitle}>🔄 System Health</h3>
                <div style={styles.healthGrid}>
                  <div style={styles.healthItem}>
                    <span style={styles.healthLabel}>Status</span>
                    <span style={{...styles.healthValue, color: '#22c55e'}}>
                      ✅ Operational
                    </span>
                  </div>
                  <div style={styles.healthItem}>
                    <span style={styles.healthLabel}>Uptime</span>
                    <span style={styles.healthValue}>{dashboard?.systemHealth.uptime}</span>
                  </div>
                  <div style={styles.healthItem}>
                    <span style={styles.healthLabel}>Nova</span>
                    <span style={{...styles.healthValue, color: dashboard?.novaStatus.connected ? '#22c55e' : '#ef4444'}}>
                      {dashboard?.novaStatus.connected ? '🟢 Connected' : '🔴 Disconnected'}
                    </span>
                  </div>
                  <div style={styles.healthItem}>
                    <span style={styles.healthLabel}>Voice</span>
                    <span style={styles.healthValue}>
                      {dashboard?.novaStatus.voiceEnabled ? '🎤 Enabled' : '🔇 Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={styles.quickActions}>
                <h3 style={styles.cardTitle}>⚡ Quick Actions</h3>
                <div style={styles.actionButtons}>
                  <button style={styles.actionButton} onClick={() => setActiveSection('chat')}>
                    💬 Chat with Nova
                  </button>
                  <button style={styles.actionButton} onClick={() => setActiveSection('notes')}>
                    📝 New Note
                  </button>
                  <button style={styles.actionButton} onClick={() => setActiveSection('alerts')}>
                    🚨 View Alerts
                  </button>
                  <button style={styles.actionButton} onClick={() => setActiveSection('users')}>
                    👥 Manage Users
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Section */}
          {activeSection === 'chat' && (
            <div style={styles.chatSection}>
              <h2 style={styles.sectionTitle}>💬 Nova Chat</h2>
              <div style={styles.chatContainer}>
                <div style={styles.chatMessages}>
                  {chatMessages.length === 0 && (
                    <div style={styles.chatWelcome}>
                      <span style={styles.novaAvatar}>🧠</span>
                      <h3>Nova Master</h3>
                      <p>Je suis ton bras droit IA. Comment puis-je t'aider?</p>
                      <div style={styles.quickPrompts}>
                        <button style={styles.promptButton} onClick={() => setChatInput('Bonjour!')}>
                          👋 Dire bonjour
                        </button>
                        <button style={styles.promptButton} onClick={() => setChatInput('/status')}>
                          📊 Status système
                        </button>
                        <button style={styles.promptButton} onClick={() => setChatInput('/help')}>
                          ❓ Aide
                        </button>
                      </div>
                    </div>
                  )}
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      style={{
                        ...styles.chatMessage,
                        ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
                      }}
                    >
                      <div style={styles.messageAvatar}>
                        {msg.role === 'user' ? '👤' : '🧠'}
                      </div>
                      <div style={styles.messageContent}>
                        <div style={styles.messageHeader}>
                          <span style={styles.messageSender}>
                            {msg.role === 'user' ? 'Jo' : 'Nova Master'}
                          </span>
                          <span style={styles.messageTime}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div style={styles.messageText}>{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{...styles.chatMessage, ...styles.assistantMessage}}>
                      <div style={styles.messageAvatar}>🧠</div>
                      <div style={styles.messageContent}>
                        <div style={styles.typingIndicator}>
                          <span>●</span><span>●</span><span>●</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div style={styles.chatInputArea}>
                  <button style={styles.voiceButton} title="Voice message">🎤</button>
                  <input
                    type="text"
                    style={styles.chatInput}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Message Nova... (ou /help pour les commandes)"
                  />
                  <button 
                    style={styles.sendButton} 
                    onClick={sendChatMessage}
                    disabled={chatLoading}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          {activeSection === 'notes' && (
            <div style={styles.notesSection}>
              <h2 style={styles.sectionTitle}>📝 Notes Manager</h2>
              
              {/* New Note Form */}
              <div style={styles.newNoteForm}>
                <input
                  type="text"
                  style={styles.noteInput}
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note title..."
                />
                <textarea
                  style={styles.noteTextarea}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write your note..."
                  rows={3}
                />
                <div style={styles.noteActions}>
                  <select style={styles.noteSelect}>
                    <option value="idea">💭 Idea</option>
                    <option value="todo">✅ Todo</option>
                    <option value="decision">🎯 Decision</option>
                    <option value="reminder">⏰ Reminder</option>
                    <option value="strategy">📈 Strategy</option>
                  </select>
                  <select style={styles.noteSelect}>
                    <option value="normal">🟡 Normal</option>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="low">🟢 Low</option>
                  </select>
                  <button style={styles.createNoteButton}>
                    ✚ Create Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div style={styles.notesList}>
                {/* Sample notes */}
                <NoteCard 
                  title="Améliorer dashboard admin"
                  content="Ajouter plus de métriques en temps réel"
                  type="todo"
                  priority="high"
                  pinned={true}
                  tags={['dashboard', 'ui']}
                />
                <NoteCard 
                  title="Idée: Mode vocal Nova"
                  content="Permettre de parler à Nova avec reconnaissance vocale"
                  type="idea"
                  priority="normal"
                  pinned={false}
                  tags={['nova', 'voice']}
                />
                <NoteCard 
                  title="Stratégie Q1 2025"
                  content="Focus sur les 3 verticaux prioritaires"
                  type="strategy"
                  priority="high"
                  pinned={true}
                  tags={['strategy', 'roadmap']}
                />
              </div>
            </div>
          )}

          {/* Alerts Section */}
          {activeSection === 'alerts' && (
            <div style={styles.alertsSection}>
              <h2 style={styles.sectionTitle}>🚨 Alerts Center</h2>
              
              {/* Alerts Summary */}
              <div style={styles.alertsSummary}>
                <div style={{...styles.alertSummaryCard, borderColor: '#ef4444'}}>
                  <span style={styles.alertCount}>1</span>
                  <span style={styles.alertLabel}>Critical</span>
                </div>
                <div style={{...styles.alertSummaryCard, borderColor: '#f59e0b'}}>
                  <span style={styles.alertCount}>2</span>
                  <span style={styles.alertLabel}>High</span>
                </div>
                <div style={{...styles.alertSummaryCard, borderColor: '#3b82f6'}}>
                  <span style={styles.alertCount}>5</span>
                  <span style={styles.alertLabel}>Medium</span>
                </div>
                <div style={{...styles.alertSummaryCard, borderColor: '#22c55e'}}>
                  <span style={styles.alertCount}>3</span>
                  <span style={styles.alertLabel}>Low</span>
                </div>
              </div>

              {/* Alerts List */}
              <div style={styles.alertsList}>
                <AlertCard 
                  title="Token budget at 85%"
                  message="Monthly token budget is running low"
                  severity="critical"
                  category="budget"
                  time="2 min ago"
                />
                <AlertCard 
                  title="New user registration spike"
                  message="50+ new users in the last hour"
                  severity="high"
                  category="system"
                  time="15 min ago"
                />
                <AlertCard 
                  title="User complaint"
                  message="Dashboard loading slowly"
                  severity="medium"
                  category="user_complaint"
                  time="1 hour ago"
                />
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div style={styles.usersSection}>
              <h2 style={styles.sectionTitle}>👥 User Management</h2>
              
              {/* User Stats */}
              <div style={styles.userStats}>
                <div style={styles.userStatCard}>
                  <span style={styles.userStatValue}>156</span>
                  <span style={styles.userStatLabel}>Total Users</span>
                </div>
                <div style={styles.userStatCard}>
                  <span style={styles.userStatValue}>89</span>
                  <span style={styles.userStatLabel}>Active</span>
                </div>
                <div style={styles.userStatCard}>
                  <span style={styles.userStatValue}>12</span>
                  <span style={styles.userStatLabel}>Admins</span>
                </div>
                <div style={styles.userStatCard}>
                  <span style={styles.userStatValue}>7</span>
                  <span style={styles.userStatLabel}>New Today</span>
                </div>
              </div>

              {/* User Actions */}
              <div style={styles.userActions}>
                <button style={styles.userActionButton}>➕ Add User</button>
                <button style={styles.userActionButton}>📤 Export</button>
                <input 
                  type="text" 
                  style={styles.userSearchInput}
                  placeholder="Search users..."
                />
              </div>

              {/* Users List */}
              <div style={styles.usersList}>
                <UserRow 
                  name="Jo (Admin)"
                  email="jo@chenu.app"
                  role="super_admin"
                  active={true}
                  lastLogin="Just now"
                />
                <UserRow 
                  name="Marie Dupont"
                  email="marie@example.com"
                  role="admin"
                  active={true}
                  lastLogin="2 hours ago"
                />
                <UserRow 
                  name="Test User"
                  email="test@chenu.app"
                  role="user"
                  active={false}
                  lastLogin="3 days ago"
                />
              </div>
            </div>
          )}

          {/* Design Studio */}
          {activeSection === 'design' && (
            <div style={styles.designSection}>
              <h2 style={styles.sectionTitle}>🎨 Design Studio</h2>
              
              <div style={styles.designTools}>
                <div style={styles.designToolCard}>
                  <span style={styles.designToolIcon}>🖼️</span>
                  <h4>Avatar Generator</h4>
                  <p>Create custom avatars</p>
                  <button style={styles.designToolButton}>Generate</button>
                </div>
                <div style={styles.designToolCard}>
                  <span style={styles.designToolIcon}>🎭</span>
                  <h4>Icon Library</h4>
                  <p>Browse & upload icons</p>
                  <button style={styles.designToolButton}>Browse</button>
                </div>
                <div style={styles.designToolCard}>
                  <span style={styles.designToolIcon}>🌄</span>
                  <h4>Backgrounds</h4>
                  <p>Manage backgrounds</p>
                  <button style={styles.designToolButton}>Manage</button>
                </div>
                <div style={styles.designToolCard}>
                  <span style={styles.designToolIcon}>🎨</span>
                  <h4>Color Palette</h4>
                  <p>Brand colors</p>
                  <button style={styles.designToolButton}>Edit</button>
                </div>
              </div>

              <div style={styles.assetGrid}>
                <h3 style={styles.subTitle}>Recent Assets</h3>
                <div style={styles.assetsContainer}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} style={styles.assetCard}>
                      <div style={styles.assetPreview}>🖼️</div>
                      <span style={styles.assetName}>Asset {i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Menus Section */}
          {activeSection === 'menus' && (
            <div style={styles.menusSection}>
              <h2 style={styles.sectionTitle}>📑 Menu Manager</h2>
              
              <div style={styles.menuEditor}>
                <div style={styles.menuSidebar}>
                  <h4>Locations</h4>
                  <button style={styles.menuLocationButton}>📱 Main Nav</button>
                  <button style={{...styles.menuLocationButton, ...styles.menuLocationActive}}>📑 Sidebar</button>
                  <button style={styles.menuLocationButton}>🔧 Admin</button>
                  <button style={styles.menuLocationButton}>⚡ Quick Actions</button>
                </div>
                <div style={styles.menuList}>
                  <h4>Sidebar Menu Items</h4>
                  <p style={styles.menuHint}>Drag to reorder</p>
                  {navItems.map((item, index) => (
                    <div key={item.id} style={styles.menuItem}>
                      <span style={styles.menuDragHandle}>⋮⋮</span>
                      <span style={styles.menuItemIcon}>{item.icon}</span>
                      <span style={styles.menuItemLabel}>{item.label}</span>
                      <span style={styles.menuItemPath}>/master/{item.id}</span>
                      <button style={styles.menuItemEdit}>✏️</button>
                    </div>
                  ))}
                  <button style={styles.addMenuButton}>➕ Add Menu Item</button>
                </div>
              </div>
            </div>
          )}

          {/* Structure Section */}
          {activeSection === 'structure' && (
            <div style={styles.structureSection}>
              <h2 style={styles.sectionTitle}>⚙️ Structure Editor</h2>
              
              <div style={styles.structureCategories}>
                <div style={styles.structureCategory}>
                  <h4>🌐 Spheres</h4>
                  <div style={styles.structureList}>
                    <StructureItem name="Personal" status="active" locked={true} />
                    <StructureItem name="Business" status="active" locked={true} />
                    <StructureItem name="Government" status="active" locked={true} />
                    <StructureItem name="Studio" status="active" locked={true} />
                    <StructureItem name="Master" status="active" locked={true} />
                  </div>
                </div>
                <div style={styles.structureCategory}>
                  <h4>📦 Modules</h4>
                  <div style={styles.structureList}>
                    <StructureItem name="prescription_manager" status="active" locked={false} />
                    <StructureItem name="invoice_generator" status="active" locked={false} />
                    <StructureItem name="content_scheduler" status="active" locked={false} />
                  </div>
                </div>
                <div style={styles.structureCategory}>
                  <h4>🤖 Agents</h4>
                  <div style={styles.structureList}>
                    <StructureItem name="Nova Master" status="active" locked={true} />
                    <StructureItem name="CRM Agent" status="active" locked={false} />
                    <StructureItem name="Creative Agent" status="active" locked={false} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const StatCard: React.FC<{
  icon: string;
  label: string;
  value: number | string;
  subvalue: string;
  color: string;
  highlight?: boolean;
}> = ({ icon, label, value, subvalue, color, highlight }) => (
  <div style={{
    ...styles.statCard,
    borderLeftColor: color,
    ...(highlight ? { animation: 'pulse 2s infinite' } : {})
  }}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statContent}>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statSubvalue}>{subvalue}</span>
    </div>
  </div>
);

const NoteCard: React.FC<{
  title: string;
  content: string;
  type: string;
  priority: string;
  pinned: boolean;
  tags: string[];
}> = ({ title, content, type, priority, pinned, tags }) => {
  const typeIcons: Record<string, string> = {
    idea: '💭',
    todo: '✅',
    decision: '🎯',
    reminder: '⏰',
    strategy: '📈'
  };

  const priorityColors: Record<string, string> = {
    urgent: '#ef4444',
    high: '#f59e0b',
    normal: '#3b82f6',
    low: '#22c55e'
  };

  return (
    <div style={{...styles.noteCard, borderLeftColor: priorityColors[priority] || '#3b82f6'}}>
      <div style={styles.noteHeader}>
        <span style={styles.noteType}>{typeIcons[type] || '📝'}</span>
        <h4 style={styles.noteTitle}>{title}</h4>
        {pinned && <span style={styles.pinBadge}>📌</span>}
      </div>
      <p style={styles.noteContent}>{content}</p>
      <div style={styles.noteTags}>
        {tags.map(tag => (
          <span key={tag} style={styles.noteTag}>#{tag}</span>
        ))}
      </div>
    </div>
  );
};

const AlertCard: React.FC<{
  title: string;
  message: string;
  severity: string;
  category: string;
  time: string;
}> = ({ title, message, severity, category, time }) => {
  const severityColors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#22c55e'
  };

  return (
    <div style={{...styles.alertCard, borderLeftColor: severityColors[severity] || '#3b82f6'}}>
      <div style={styles.alertHeader}>
        <span style={{...styles.severityBadge, backgroundColor: severityColors[severity]}}>
          {severity.toUpperCase()}
        </span>
        <span style={styles.alertCategory}>{category}</span>
        <span style={styles.alertTime}>{time}</span>
      </div>
      <h4 style={styles.alertTitle}>{title}</h4>
      <p style={styles.alertMessage}>{message}</p>
      <div style={styles.alertActions}>
        <button style={styles.alertActionButton}>✓ Acknowledge</button>
        <button style={styles.alertActionButton}>🔧 Resolve</button>
        <button style={styles.alertActionButton}>💤 Snooze</button>
      </div>
    </div>
  );
};

const UserRow: React.FC<{
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin: string;
}> = ({ name, email, role, active, lastLogin }) => (
  <div style={styles.userRow}>
    <div style={styles.userAvatar}>{name.charAt(0).toUpperCase()}</div>
    <div style={styles.userInfo}>
      <span style={styles.userName}>{name}</span>
      <span style={styles.userEmail}>{email}</span>
    </div>
    <span style={{
      ...styles.userRole,
      backgroundColor: role === 'super_admin' ? '#8b5cf6' : role === 'admin' ? '#3b82f6' : '#6b7280'
    }}>
      {role}
    </span>
    <span style={{
      ...styles.userStatus,
      color: active ? '#22c55e' : '#6b7280'
    }}>
      {active ? '🟢 Active' : '⚪ Inactive'}
    </span>
    <span style={styles.userLastLogin}>{lastLogin}</span>
    <button style={styles.userEditButton}>⋮</button>
  </div>
);

const StructureItem: React.FC<{
  name: string;
  status: string;
  locked: boolean;
}> = ({ name, status, locked }) => (
  <div style={styles.structureItem}>
    <span style={{
      ...styles.structureStatus,
      backgroundColor: status === 'active' ? '#22c55e' : '#6b7280'
    }}></span>
    <span style={styles.structureName}>{name}</span>
    {locked && <span style={styles.lockedBadge}>🔒</span>}
    <button style={styles.structureEditButton}>⚙️</button>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#0f172a',
    color: '#e2e8f0'
  },
  spinner: {
    fontSize: '48px',
    animation: 'spin 2s linear infinite'
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logo: {
    fontSize: '28px'
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  badge: {
    padding: '4px 8px',
    backgroundColor: '#334155',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#94a3b8'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#94a3b8'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600
  },

  // Main layout
  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },

  // Sidebar
  sidebar: {
    width: '200px',
    backgroundColor: '#1e293b',
    padding: '16px 0',
    borderRight: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  },
  navButtonActive: {
    backgroundColor: '#334155',
    color: '#e2e8f0',
    borderLeft: '3px solid #3b82f6'
  },
  navIcon: {
    fontSize: '18px'
  },
  navLabel: {
    fontWeight: 500
  },

  // Content
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '24px',
    color: '#f1f5f9'
  },

  // Dashboard
  dashboardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px'
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    borderLeft: '4px solid',
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  statIcon: {
    fontSize: '32px'
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#f1f5f9'
  },
  statLabel: {
    fontSize: '14px',
    color: '#94a3b8'
  },
  statSubvalue: {
    fontSize: '12px',
    color: '#64748b'
  },

  // Health Card
  healthCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#f1f5f9'
  },
  healthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  },
  healthItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  healthLabel: {
    fontSize: '12px',
    color: '#64748b'
  },
  healthValue: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#e2e8f0'
  },

  // Quick Actions
  quickActions: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  actionButton: {
    padding: '12px 20px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // Chat
  chatSection: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 180px)'
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  chatMessages: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto'
  },
  chatWelcome: {
    textAlign: 'center',
    padding: '40px'
  },
  novaAvatar: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '16px'
  },
  quickPrompts: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '20px'
  },
  promptButton: {
    padding: '8px 16px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '20px',
    color: '#e2e8f0',
    fontSize: '13px',
    cursor: 'pointer'
  },
  chatMessage: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  userMessage: {
    flexDirection: 'row-reverse'
  },
  assistantMessage: {},
  messageAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  messageContent: {
    maxWidth: '70%',
    backgroundColor: '#334155',
    borderRadius: '12px',
    padding: '12px 16px'
  },
  messageHeader: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px'
  },
  messageSender: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#94a3b8'
  },
  messageTime: {
    fontSize: '11px',
    color: '#64748b'
  },
  messageText: {
    fontSize: '14px',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap'
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px'
  },
  chatInputArea: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#0f172a',
    borderTop: '1px solid #334155'
  },
  voiceButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#334155',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer'
  },
  chatInput: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '22px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none'
  },
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer'
  },

  // Notes
  notesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  newNoteForm: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  noteInput: {
    padding: '12px 16px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '16px',
    outline: 'none'
  },
  noteTextarea: {
    padding: '12px 16px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  noteActions: {
    display: 'flex',
    gap: '12px'
  },
  noteSelect: {
    padding: '10px 16px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none'
  },
  createNoteButton: {
    marginLeft: 'auto',
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  noteCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '16px',
    borderLeft: '4px solid'
  },
  noteHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  noteType: {
    fontSize: '18px'
  },
  noteTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#f1f5f9',
    flex: 1
  },
  pinBadge: {
    fontSize: '14px'
  },
  noteContent: {
    margin: 0,
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '12px'
  },
  noteTags: {
    display: 'flex',
    gap: '8px'
  },
  noteTag: {
    padding: '4px 8px',
    backgroundColor: '#334155',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#64748b'
  },

  // Alerts
  alertsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  alertsSummary: {
    display: 'flex',
    gap: '16px'
  },
  alertSummaryCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    borderLeft: '4px solid'
  },
  alertCount: {
    fontSize: '32px',
    fontWeight: 700,
    display: 'block',
    color: '#f1f5f9'
  },
  alertLabel: {
    fontSize: '14px',
    color: '#94a3b8'
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  alertCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '16px',
    borderLeft: '4px solid'
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  severityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 700,
    color: 'white'
  },
  alertCategory: {
    fontSize: '12px',
    color: '#64748b'
  },
  alertTime: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#64748b'
  },
  alertTitle: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#f1f5f9'
  },
  alertMessage: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#94a3b8'
  },
  alertActions: {
    display: 'flex',
    gap: '8px'
  },
  alertActionButton: {
    padding: '6px 12px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '6px',
    color: '#e2e8f0',
    fontSize: '12px',
    cursor: 'pointer'
  },

  // Users
  usersSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  userStats: {
    display: 'flex',
    gap: '16px'
  },
  userStatCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center'
  },
  userStatValue: {
    fontSize: '32px',
    fontWeight: 700,
    display: 'block',
    color: '#f1f5f9'
  },
  userStatLabel: {
    fontSize: '14px',
    color: '#94a3b8'
  },
  userActions: {
    display: 'flex',
    gap: '12px'
  },
  userActionButton: {
    padding: '10px 20px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    cursor: 'pointer'
  },
  userSearchInput: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none'
  },
  usersList: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderBottom: '1px solid #334155'
  },
  userInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontWeight: 600,
    color: '#f1f5f9'
  },
  userEmail: {
    fontSize: '13px',
    color: '#64748b'
  },
  userRole: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'white'
  },
  userStatus: {
    fontSize: '14px'
  },
  userLastLogin: {
    fontSize: '13px',
    color: '#64748b',
    width: '100px'
  },
  userEditButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '18px'
  },

  // Design
  designSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  designTools: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  designToolCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center'
  },
  designToolIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '12px'
  },
  designToolButton: {
    marginTop: '12px',
    padding: '8px 20px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    cursor: 'pointer'
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#f1f5f9'
  },
  assetGrid: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px'
  },
  assetsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '16px'
  },
  assetCard: {
    backgroundColor: '#334155',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center'
  },
  assetPreview: {
    fontSize: '40px',
    marginBottom: '8px'
  },
  assetName: {
    fontSize: '12px',
    color: '#94a3b8'
  },

  // Menus
  menusSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  menuEditor: {
    display: 'flex',
    gap: '24px',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px'
  },
  menuSidebar: {
    width: '180px',
    borderRight: '1px solid #334155',
    paddingRight: '20px'
  },
  menuLocationButton: {
    display: 'block',
    width: '100%',
    padding: '10px 12px',
    marginBottom: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#94a3b8',
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer'
  },
  menuLocationActive: {
    backgroundColor: '#334155',
    color: '#e2e8f0'
  },
  menuList: {
    flex: 1
  },
  menuHint: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '16px'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#334155',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  menuDragHandle: {
    color: '#64748b',
    cursor: 'grab'
  },
  menuItemIcon: {
    fontSize: '18px'
  },
  menuItemLabel: {
    flex: 1,
    fontWeight: 500
  },
  menuItemPath: {
    fontSize: '12px',
    color: '#64748b'
  },
  menuItemEdit: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  addMenuButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    border: '2px dashed #334155',
    borderRadius: '8px',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer'
  },

  // Structure
  structureSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  structureCategories: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  structureCategory: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px'
  },
  structureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '16px'
  },
  structureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#334155',
    borderRadius: '8px'
  },
  structureStatus: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  structureName: {
    flex: 1,
    fontWeight: 500
  },
  lockedBadge: {
    fontSize: '12px'
  },
  structureEditButton: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer'
  }
};

export default MasterSphereCommandCenter;
