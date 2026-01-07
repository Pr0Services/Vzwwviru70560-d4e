// CHE·NU™ Thread Detail View — .chenu Thread Interface
// Threads (.chenu) are FIRST-CLASS OBJECTS
// A thread represents a persistent line of thought with budget, encoding, and audit

import React, { useState, useRef, useEffect } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface ThreadMessage {
  id: string;
  role: 'user' | 'nova' | 'agent' | 'system';
  content: string;
  tokens: number;
  encoded: boolean;
  encoding_ratio?: number;
  agent_code?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ThreadInfo {
  id: string;
  title: string;
  description: string;
  sphere_code: string;
  sphere_name: string;
  sphere_icon: string;
  status: 'active' | 'paused' | 'archived';
  token_budget: number;
  tokens_used: number;
  encoding_enabled: boolean;
  encoding_quality: number;
  participants: string[];
  created_at: string;
  updated_at: string;
  decision_count: number;
  audit_entries: number;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockThread: ThreadInfo = {
  id: 'thread-001',
  title: 'Q4 Strategy Planning',
  description: 'Strategic planning discussion for Q4 2024 initiatives',
  sphere_code: 'business',
  sphere_name: 'Business',
  sphere_icon: '💼',
  status: 'active',
  token_budget: 10000,
  tokens_used: 4523,
  encoding_enabled: true,
  encoding_quality: 94,
  participants: ['user', 'nova'],
  created_at: '2024-01-10T09:00:00Z',
  updated_at: '2024-01-15T14:30:00Z',
  decision_count: 5,
  audit_entries: 23,
};

const mockMessages: ThreadMessage[] = [
  { id: 'm1', role: 'user', content: 'Let\'s start planning our Q4 strategy. What are the key areas we should focus on?', tokens: 18, encoded: false, timestamp: '2024-01-15T14:00:00Z' },
  { id: 'm2', role: 'nova', content: 'Based on your business sphere data, I suggest focusing on three key areas:\n\n1. **Revenue Growth** - Your Q3 showed 12% growth, we can target 15% for Q4\n2. **Operational Efficiency** - There\'s opportunity to reduce costs by 8%\n3. **Team Development** - Investment in skills that align with 2025 goals\n\nShall I elaborate on any of these areas?', tokens: 78, encoded: true, encoding_ratio: 0.65, timestamp: '2024-01-15T14:01:00Z' },
  { id: 'm3', role: 'user', content: 'Yes, let\'s dive deeper into revenue growth. What specific initiatives would you recommend?', tokens: 16, encoded: false, timestamp: '2024-01-15T14:05:00Z' },
  { id: 'm4', role: 'nova', content: 'For revenue growth, I recommend these initiatives:\n\n**1. Expand to New Markets**\n- Research shows 3 untapped regions with high potential\n- Estimated impact: +5% revenue\n\n**2. Product Line Extension**\n- Based on customer feedback analysis\n- Estimated impact: +4% revenue\n\n**3. Strategic Partnerships**\n- 2 potential partners identified in your network\n- Estimated impact: +3% revenue\n\nWould you like me to create detailed execution plans for any of these?', tokens: 95, encoded: true, encoding_ratio: 0.58, timestamp: '2024-01-15T14:06:00Z' },
  { id: 'm5', role: 'system', content: '📋 Decision recorded: Focus areas for Q4 identified (Revenue, Efficiency, Team)', tokens: 12, encoded: false, timestamp: '2024-01-15T14:07:00Z', metadata: { decision_id: 'dec-001' } },
  { id: 'm6', role: 'user', content: 'Create execution plans for the market expansion initiative.', tokens: 10, encoded: false, timestamp: '2024-01-15T14:15:00Z' },
  { id: 'm7', role: 'agent', content: '🤖 **DOC_GENERATOR** creating execution plan...\n\nMarket Expansion Plan created successfully.\n\n📄 Document: "Q4_Market_Expansion_Plan.docx"\n- Executive Summary\n- Target Markets Analysis\n- Resource Requirements\n- Timeline (12 weeks)\n- Budget Allocation\n- Risk Assessment\n\nDocument saved to Business > Projects > Q4 Strategy', tokens: 65, encoded: true, encoding_ratio: 0.72, agent_code: 'DOC_GENERATOR', timestamp: '2024-01-15T14:16:00Z' },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
  },
  
  // Main Chat Area
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  header: {
    padding: '16px 24px',
    backgroundColor: '#0a0a0b',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '8px',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
  },
  threadTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  threadBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
    color: CHENU_COLORS.jungleEmerald,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerButton: {
    padding: '8px 16px',
    backgroundColor: '#111113',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '8px',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  
  // Messages Area
  messagesArea: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px',
  },
  messageGroup: {
    marginBottom: '24px',
  },
  message: (role: string) => ({
    maxWidth: role === 'user' ? '70%' : '85%',
    marginLeft: role === 'user' ? 'auto' : '0',
    padding: '16px 20px',
    borderRadius: '16px',
    borderTopLeftRadius: role === 'user' ? '16px' : '4px',
    borderTopRightRadius: role === 'user' ? '4px' : '16px',
    backgroundColor: role === 'user' ? CHENU_COLORS.sacredGold + '22' : 
                     role === 'nova' ? CHENU_COLORS.cenoteTurquoise + '11' :
                     role === 'agent' ? '#9b59b611' :
                     '#111113',
    border: `1px solid ${
      role === 'user' ? CHENU_COLORS.sacredGold + '33' :
      role === 'nova' ? CHENU_COLORS.cenoteTurquoise + '33' :
      role === 'agent' ? '#9b59b633' :
      CHENU_COLORS.ancientStone + '22'
    }`,
  }),
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  messageRole: (role: string) => ({
    fontSize: '12px',
    fontWeight: 600,
    color: role === 'user' ? CHENU_COLORS.sacredGold :
           role === 'nova' ? CHENU_COLORS.cenoteTurquoise :
           role === 'agent' ? '#9b59b6' :
           CHENU_COLORS.ancientStone,
  }),
  messageTime: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  messageContent: {
    fontSize: '14px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const,
  },
  messageFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}11`,
  },
  tokenBadge: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  encodingBadge: (ratio: number) => ({
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: ratio < 0.7 ? CHENU_COLORS.jungleEmerald + '22' : CHENU_COLORS.sacredGold + '22',
    color: ratio < 0.7 ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.sacredGold,
  }),
  
  // Input Area
  inputArea: {
    padding: '16px 24px',
    backgroundColor: '#0a0a0b',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '12px 16px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
  },
  textarea: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    resize: 'none' as const,
    outline: 'none',
    minHeight: '24px',
    maxHeight: '120px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: CHENU_COLORS.sacredGold,
    border: 'none',
    borderRadius: '10px',
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  inputMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Right Sidebar
  sidebar: {
    width: '320px',
    backgroundColor: '#0a0a0b',
    borderLeft: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  sidebarHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  sidebarTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  sidebarContent: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
  },
  infoSection: {
    marginBottom: '20px',
  },
  infoLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  },
  infoValue: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
  budgetBar: {
    height: '8px',
    backgroundColor: '#111113',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  budgetFill: (percent: number) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: percent > 80 ? '#e74c3c' : CHENU_COLORS.sacredGold,
  }),
  budgetText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  statCard: {
    padding: '12px',
    backgroundColor: '#111113',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  statLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '2px',
  },
  participantsList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  participant: {
    padding: '6px 12px',
    backgroundColor: '#111113',
    borderRadius: '20px',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
  },
  actionButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#111113',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '8px',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ThreadDetailView: React.FC = () => {
  const [thread] = useState<ThreadInfo>(mockThread);
  const [messages, setMessages] = useState<ThreadMessage[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getRoleName = (role: string, agentCode?: string) => {
    if (role === 'user') return 'You';
    if (role === 'nova') return '🌟 Nova';
    if (role === 'agent') return `🤖 ${agentCode || 'Agent'}`;
    if (role === 'system') return '⚙️ System';
    return role;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: ThreadMessage = {
      id: `m${messages.length + 1}`,
      role: 'user',
      content: inputValue,
      tokens: Math.ceil(inputValue.length / 4),
      encoded: false,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate Nova response
    setTimeout(() => {
      const novaResponse: ThreadMessage = {
        id: `m${messages.length + 2}`,
        role: 'nova',
        content: 'I understand. Let me analyze that and provide you with the best recommendations based on your thread context and governance rules.',
        tokens: 24,
        encoded: true,
        encoding_ratio: 0.68,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, novaResponse]);
    }, 1000);
  };

  const budgetPercent = (thread.tokens_used / thread.token_budget) * 100;
  const remainingTokens = thread.token_budget - thread.tokens_used;

  return (
    <div style={styles.container}>
      {/* Main Chat Area */}
      <div style={styles.mainArea}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.backButton}>← Back</button>
            <div style={styles.threadTitle}>
              <span>{thread.sphere_icon}</span>
              {thread.title}
              <span style={styles.threadBadge}>.chenu</span>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.headerButton}>📋 Decisions ({thread.decision_count})</button>
            <button style={styles.headerButton}>📜 Audit Log</button>
            <button style={styles.headerButton}>⚙️</button>
          </div>
        </div>

        {/* Messages */}
        <div style={styles.messagesArea}>
          {messages.map(msg => (
            <div key={msg.id} style={styles.messageGroup}>
              <div style={styles.message(msg.role)}>
                <div style={styles.messageHeader}>
                  <span style={styles.messageRole(msg.role)}>{getRoleName(msg.role, msg.agent_code)}</span>
                  <span style={styles.messageTime}>{formatTime(msg.timestamp)}</span>
                </div>
                <div style={styles.messageContent}>{msg.content}</div>
                <div style={styles.messageFooter}>
                  <span style={styles.tokenBadge}>🎫 {msg.tokens} tokens</span>
                  {msg.encoded && msg.encoding_ratio && (
                    <span style={styles.encodingBadge(msg.encoding_ratio)}>
                      ⚡ {Math.round(msg.encoding_ratio * 100)}% encoded
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <textarea
              style={styles.textarea}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              rows={1}
            />
            <button style={styles.sendButton} onClick={handleSend}>Send</button>
          </div>
          <div style={styles.inputMeta}>
            <span>⚡ Encoding: {thread.encoding_enabled ? 'Active' : 'Disabled'} ({thread.encoding_quality}% quality)</span>
            <span>🎫 {remainingTokens.toLocaleString()} tokens remaining</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarTitle}>Thread Details</div>
        </div>
        <div style={styles.sidebarContent}>
          {/* Sphere Info */}
          <div style={styles.infoSection}>
            <div style={styles.infoLabel}>Sphere</div>
            <div style={styles.infoValue}>{thread.sphere_icon} {thread.sphere_name}</div>
          </div>

          {/* Token Budget */}
          <div style={styles.infoSection}>
            <div style={styles.infoLabel}>Token Budget</div>
            <div style={styles.budgetBar}>
              <div style={styles.budgetFill(budgetPercent)} />
            </div>
            <div style={styles.budgetText}>
              <span>{thread.tokens_used.toLocaleString()} used</span>
              <span>{thread.token_budget.toLocaleString()} total</span>
            </div>
          </div>

          {/* Stats */}
          <div style={styles.infoSection}>
            <div style={styles.infoLabel}>Statistics</div>
            <div style={styles.statGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{thread.decision_count}</div>
                <div style={styles.statLabel}>Decisions</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{thread.audit_entries}</div>
                <div style={styles.statLabel}>Audit Logs</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{messages.length}</div>
                <div style={styles.statLabel}>Messages</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{thread.encoding_quality}%</div>
                <div style={styles.statLabel}>Encoding</div>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div style={styles.infoSection}>
            <div style={styles.infoLabel}>Participants</div>
            <div style={styles.participantsList}>
              {thread.participants.map((p, idx) => (
                <span key={idx} style={styles.participant}>
                  {p === 'user' ? '👤 You' : p === 'nova' ? '🌟 Nova' : p}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.infoSection}>
            <div style={styles.infoLabel}>Actions</div>
            <button style={styles.actionButton}>📤 Export Thread</button>
            <button style={styles.actionButton}>🤖 Add Agent</button>
            <button style={styles.actionButton}>💰 Adjust Budget</button>
            <button style={styles.actionButton}>📁 Archive Thread</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailView;
