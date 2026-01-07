/**
 * CHE·NU™ — UNIFIED MESSAGING
 * Universal Inbox - All your messages in one place
 * 
 * FEATURES:
 * - Import conversations from Gmail, Outlook, Discord, Slack, WhatsApp, etc.
 * - Reply from CHE·NU, automatically export to source platform
 * - AI-powered priority, categorization, and suggested replies
 * - Unified search across all platforms
 */

import React, { useState, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES (inline for simplicity)
// ═══════════════════════════════════════════════════════════════════════════

type MessagingPlatform = 'gmail' | 'outlook' | 'discord' | 'slack' | 'whatsapp' | 'telegram' | 'messenger' | 'teams' | 'linkedin';

interface PlatformConfig {
  id: MessagingPlatform;
  name: string;
  icon: string;
  color: string;
}

const PLATFORM_CONFIG: Record<MessagingPlatform, PlatformConfig> = {
  gmail: { id: 'gmail', name: 'Gmail', icon: '📧', color: '#EA4335' },
  outlook: { id: 'outlook', name: 'Outlook', icon: '📬', color: '#0078D4' },
  discord: { id: 'discord', name: 'Discord', icon: '🎮', color: '#5865F2' },
  slack: { id: 'slack', name: 'Slack', icon: '💬', color: '#4A154B' },
  whatsapp: { id: 'whatsapp', name: 'WhatsApp', icon: '📱', color: '#25D366' },
  telegram: { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#0088CC' },
  messenger: { id: 'messenger', name: 'Messenger', icon: '💭', color: '#0084FF' },
  teams: { id: 'teams', name: 'Teams', icon: '👥', color: '#6264A7' },
  linkedin: { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' }
};

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

interface Conversation {
  id: string;
  platform: MessagingPlatform;
  contact: Contact;
  channelName?: string;
  subject?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isStarred: boolean;
  isPinned: boolean;
  aiPriority?: 'urgent' | 'high' | 'normal' | 'low';
  aiSuggestedReply?: string;
  attachmentCount?: number;
}

interface Message {
  id: string;
  sender: Contact;
  isFromMe: boolean;
  content: string;
  timestamp: Date;
  attachments?: { name: string; type: string }[];
  reactions?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED MESSAGING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface UnifiedMessagingProps {
  connectedPlatforms: MessagingPlatform[];
  onConnectPlatform: (platform: MessagingPlatform) => void;
  onDisconnectPlatform: (platform: MessagingPlatform) => void;
}

export const UnifiedMessaging: React.FC<UnifiedMessagingProps> = ({
  connectedPlatforms,
  onConnectPlatform,
  onDisconnectPlatform
}) => {
  // State
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activePlatform, setActivePlatform] = useState<MessagingPlatform | 'all'>('all');
  const [activeFolder, setActiveFolder] = useState<string>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);

  // Demo conversations
  const conversations = useMemo<Conversation[]>(() => [
    {
      id: '1',
      platform: 'gmail',
      contact: { id: 'c1', name: 'Sarah Chen', email: 'sarah@company.com' },
      subject: 'Q4 Planning - Need your input',
      lastMessage: 'Hey! Can you review the attached Q4 roadmap and share your thoughts?',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 1,
      isStarred: true,
      isPinned: true,
      aiPriority: 'high',
      aiSuggestedReply: "Hi Sarah, I'll review the roadmap and share my feedback by 5pm today.",
      attachmentCount: 1
    },
    {
      id: '2',
      platform: 'slack',
      contact: { id: 'c2', name: 'Mike Johnson' },
      channelName: '#product-updates',
      lastMessage: '🚀 Just shipped the new dashboard! Check it out at staging.app.com',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isStarred: false,
      isPinned: false
    },
    {
      id: '3',
      platform: 'discord',
      contact: { id: 'c3', name: 'Team Engineering' },
      channelName: '#engineering',
      lastMessage: 'Anyone available for a code review? PR #423 is ready',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 3,
      isStarred: false,
      isPinned: false,
      aiPriority: 'normal'
    },
    {
      id: '4',
      platform: 'whatsapp',
      contact: { id: 'c4', name: 'Mom' },
      lastMessage: "Don't forget dinner at 7pm! 🍝",
      lastMessageTime: new Date(Date.now() - 14400000),
      unreadCount: 0,
      isStarred: false,
      isPinned: false
    },
    {
      id: '5',
      platform: 'linkedin',
      contact: { id: 'c5', name: 'Alex Rivera' },
      lastMessage: 'Hi! I saw your profile and was impressed by your work. Would love to connect.',
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 1,
      isStarred: false,
      isPinned: false,
      aiPriority: 'low'
    },
    {
      id: '6',
      platform: 'outlook',
      contact: { id: 'c6', name: 'IT Department', email: 'it@corp.com' },
      subject: 'Password Reset Required',
      lastMessage: 'Your password will expire in 7 days. Please update it.',
      lastMessageTime: new Date(Date.now() - 172800000),
      unreadCount: 1,
      isStarred: false,
      isPinned: false,
      aiPriority: 'urgent'
    }
  ], []);

  // Demo messages for selected conversation
  const messages = useMemo<Message[]>(() => {
    if (!selectedConversation) return [];
    return [
      {
        id: 'm1',
        sender: selectedConversation.contact,
        isFromMe: false,
        content: selectedConversation.lastMessage,
        timestamp: selectedConversation.lastMessageTime
      },
      {
        id: 'm2',
        sender: { id: 'me', name: 'Me' },
        isFromMe: true,
        content: 'Sure, I can take a look at that.',
        timestamp: new Date(selectedConversation.lastMessageTime.getTime() - 3600000)
      },
      {
        id: 'm3',
        sender: selectedConversation.contact,
        isFromMe: false,
        content: 'Great! Let me know your thoughts when you get a chance.',
        timestamp: new Date(selectedConversation.lastMessageTime.getTime() - 7200000)
      }
    ];
  }, [selectedConversation]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let result = conversations;

    if (activePlatform !== 'all') {
      result = result.filter(c => c.platform === activePlatform);
    }

    if (activeFolder === 'unread') {
      result = result.filter(c => c.unreadCount > 0);
    } else if (activeFolder === 'starred') {
      result = result.filter(c => c.isStarred);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.contact.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [conversations, activePlatform, activeFolder, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: conversations.length,
    unread: conversations.filter(c => c.unreadCount > 0).length,
    starred: conversations.filter(c => c.isStarred).length,
    byPlatform: connectedPlatforms.reduce((acc, p) => ({
      ...acc,
      [p]: conversations.filter(c => c.platform === p).length
    }), {} as Record<MessagingPlatform, number>)
  }), [conversations, connectedPlatforms]);

  // Handlers
  const handleSendReply = useCallback(() => {
    if (!replyText.trim() || !selectedConversation) return;
    // In real app: Send via API, update state
    logger.debug('Sending reply:', replyText, 'to', selectedConversation.platform);
    setReplyText('');
  }, [replyText, selectedConversation]);

  const handleUseSuggestion = useCallback(() => {
    if (selectedConversation?.aiSuggestedReply) {
      setReplyText(selectedConversation.aiSuggestedReply);
    }
  }, [selectedConversation]);

  return (
    <div style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <div style={headerLeftStyles}>
          <span style={{ fontSize: '1.5rem' }}>📥</span>
          <h1 style={titleStyles}>Unified Inbox</h1>
          <span style={unreadBadgeStyles}>{stats.unread} unread</span>
        </div>

        <div style={searchBarStyles}>
          <span>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all messages..."
            style={searchInputStyles}
          />
        </div>

        <button style={syncButtonStyles}>
          🔄 Sync All
        </button>
      </div>

      <div style={mainLayoutStyles}>
        {/* Sidebar */}
        <div style={sidebarStyles}>
          {/* Folders */}
          <div style={foldersStyles}>
            <FolderItem
              icon="📥"
              label="Inbox"
              count={stats.total}
              isActive={activeFolder === 'inbox'}
              onClick={() => setActiveFolder('inbox')}
            />
            <FolderItem
              icon="🔵"
              label="Unread"
              count={stats.unread}
              isActive={activeFolder === 'unread'}
              onClick={() => setActiveFolder('unread')}
            />
            <FolderItem
              icon="⭐"
              label="Starred"
              count={stats.starred}
              isActive={activeFolder === 'starred'}
              onClick={() => setActiveFolder('starred')}
            />
            <FolderItem
              icon="⏰"
              label="Snoozed"
              count={0}
              isActive={activeFolder === 'snoozed'}
              onClick={() => setActiveFolder('snoozed')}
            />
          </div>

          <div style={dividerStyles} />

          {/* Platforms */}
          <div style={platformsLabelStyles}>Platforms</div>
          <div style={platformsListStyles}>
            <PlatformItem
              label="All Platforms"
              isActive={activePlatform === 'all'}
              onClick={() => setActivePlatform('all')}
              count={stats.total}
            />
            {connectedPlatforms.map(platform => {
              const config = PLATFORM_CONFIG[platform];
              return (
                <PlatformItem
                  key={platform}
                  icon={config.icon}
                  label={config.name}
                  color={config.color}
                  isActive={activePlatform === platform}
                  onClick={() => setActivePlatform(platform)}
                  count={stats.byPlatform[platform] || 0}
                />
              );
            })}
          </div>

          <div style={dividerStyles} />

          {/* Connect more */}
          <div style={connectMoreStyles}>
            <span style={{ color: '#8D8371', fontSize: '0.75rem', marginBottom: '8px' }}>
              Connect more accounts
            </span>
            <div style={connectGridStyles}>
              {Object.values(PLATFORM_CONFIG)
                .filter(p => !connectedPlatforms.includes(p.id))
                .slice(0, 4)
                .map(config => (
                  <button
                    key={config.id}
                    onClick={() => onConnectPlatform(config.id)}
                    style={connectButtonStyles}
                    title={`Connect ${config.name}`}
                  >
                    {config.icon}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <div style={listStyles}>
          {filteredConversations.length === 0 ? (
            <div style={emptyListStyles}>
              <span style={{ fontSize: '2rem', opacity: 0.5 }}>📭</span>
              <p>No messages found</p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversation?.id === conv.id}
                onClick={() => setSelectedConversation(conv)}
              />
            ))
          )}
        </div>

        {/* Message View */}
        <div style={messageViewStyles}>
          {selectedConversation ? (
            <>
              {/* Conversation header */}
              <div style={convHeaderStyles}>
                <div style={convHeaderLeftStyles}>
                  <div style={{
                    ...platformIconStyles,
                    background: PLATFORM_CONFIG[selectedConversation.platform].color
                  }}>
                    {PLATFORM_CONFIG[selectedConversation.platform].icon}
                  </div>
                  <div>
                    <h3 style={convTitleStyles}>
                      {selectedConversation.contact.name}
                      {selectedConversation.channelName && (
                        <span style={channelNameStyles}>{selectedConversation.channelName}</span>
                      )}
                    </h3>
                    {selectedConversation.subject && (
                      <p style={subjectStyles}>{selectedConversation.subject}</p>
                    )}
                  </div>
                </div>
                <div style={convActionsStyles}>
                  <button style={actionButtonStyles}>⭐</button>
                  <button style={actionButtonStyles}>⏰</button>
                  <button style={actionButtonStyles}>📦</button>
                  <button style={actionButtonStyles}>🗑️</button>
                </div>
              </div>

              {/* AI Priority badge */}
              {selectedConversation.aiPriority && (
                <div style={aiBannerStyles}>
                  <span>🤖 AI Analysis:</span>
                  <span style={{
                    ...priorityBadgeStyles,
                    background: getPriorityColor(selectedConversation.aiPriority)
                  }}>
                    {selectedConversation.aiPriority.toUpperCase()} Priority
                  </span>
                </div>
              )}

              {/* Messages */}
              <div style={messagesContainerStyles}>
                {messages.map(msg => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </div>

              {/* AI Suggested Reply */}
              {showAiSuggestion && selectedConversation.aiSuggestedReply && (
                <div style={suggestionStyles}>
                  <div style={suggestionHeaderStyles}>
                    <span>🤖 Suggested Reply</span>
                    <button 
                      onClick={() => setShowAiSuggestion(false)}
                      style={closeSuggestionStyles}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={suggestionTextStyles}>{selectedConversation.aiSuggestedReply}</p>
                  <button onClick={handleUseSuggestion} style={useSuggestionStyles}>
                    Use this reply
                  </button>
                </div>
              )}

              {/* Reply box */}
              <div style={replyBoxStyles}>
                <div style={replyInputContainerStyles}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply via ${PLATFORM_CONFIG[selectedConversation.platform].name}...`}
                    style={replyInputStyles}
                    rows={3}
                  />
                </div>
                <div style={replyActionsStyles}>
                  <div style={replyToolsStyles}>
                    <button style={toolButtonStyles}>📎</button>
                    <button style={toolButtonStyles}>😊</button>
                    <button style={toolButtonStyles}>🤖</button>
                  </div>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    style={{
                      ...sendButtonStyles,
                      opacity: replyText.trim() ? 1 : 0.5
                    }}
                  >
                    Send via {PLATFORM_CONFIG[selectedConversation.platform].icon}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={noSelectionStyles}>
              <span style={{ fontSize: '4rem', opacity: 0.3 }}>📬</span>
              <h3 style={{ color: '#E9E4D6', margin: '16px 0 8px' }}>
                Select a conversation
              </h3>
              <p style={{ color: '#8D8371', margin: 0 }}>
                Choose a message from the list to view and reply
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FOLDER ITEM
// ═══════════════════════════════════════════════════════════════════════════

interface FolderItemProps {
  icon: string;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ icon, label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...folderItemStyles,
      background: isActive ? '#2F4C39' : 'transparent',
      color: isActive ? '#E9E4D6' : '#8D8371'
    }}
  >
    <span>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && <span style={countStyles}>{count}</span>}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════
// PLATFORM ITEM
// ═══════════════════════════════════════════════════════════════════════════

interface PlatformItemProps {
  icon?: string;
  label: string;
  color?: string;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

const PlatformItem: React.FC<PlatformItemProps> = ({ icon, label, color, isActive, onClick, count }) => (
  <button
    onClick={onClick}
    style={{
      ...platformItemStyles,
      background: isActive ? (color ? `${color}20` : '#2F4C39') : 'transparent',
      borderColor: isActive ? (color || '#3EB4A2') : 'transparent'
    }}
  >
    {icon && <span>{icon}</span>}
    <span style={{ flex: 1, color: isActive ? '#E9E4D6' : '#8D8371' }}>{label}</span>
    <span style={countStyles}>{count}</span>
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════
// CONVERSATION ITEM
// ═══════════════════════════════════════════════════════════════════════════

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isSelected, onClick }) => {
  const config = PLATFORM_CONFIG[conversation.platform];
  
  return (
    <div
      onClick={onClick}
      style={{
        ...convItemStyles,
        background: isSelected ? '#2F4C39' : conversation.unreadCount > 0 ? '#1E1F22' : 'transparent',
        borderLeftColor: conversation.isPinned ? '#D8B26A' : 'transparent'
      }}
    >
      {/* Avatar & Platform */}
      <div style={avatarContainerStyles}>
        <div style={avatarStyles}>
          {conversation.contact.name.charAt(0)}
        </div>
        <div style={{
          ...platformBadgeStyles,
          background: config.color
        }}>
          {config.icon}
        </div>
      </div>

      {/* Content */}
      <div style={convContentStyles}>
        <div style={convTopRowStyles}>
          <span style={{
            ...convNameStyles,
            fontWeight: conversation.unreadCount > 0 ? 600 : 400
          }}>
            {conversation.contact.name}
          </span>
          <span style={convTimeStyles}>
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        {conversation.subject && (
          <div style={convSubjectStyles}>{conversation.subject}</div>
        )}
        <div style={convPreviewStyles}>
          {conversation.lastMessage}
        </div>
        <div style={convMetaStyles}>
          {conversation.unreadCount > 0 && (
            <span style={unreadCountStyles}>{conversation.unreadCount}</span>
          )}
          {conversation.isStarred && <span>⭐</span>}
          {conversation.attachmentCount && <span>📎 {conversation.attachmentCount}</span>}
          {conversation.aiPriority === 'urgent' && (
            <span style={urgentStyles}>🔴 Urgent</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE BUBBLE
// ═══════════════════════════════════════════════════════════════════════════

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => (
  <div style={{
    ...bubbleContainerStyles,
    justifyContent: message.isFromMe ? 'flex-end' : 'flex-start'
  }}>
    {!message.isFromMe && (
      <div style={bubbleAvatarStyles}>
        {message.sender.name.charAt(0)}
      </div>
    )}
    <div style={{
      ...bubbleStyles,
      background: message.isFromMe ? '#3EB4A2' : '#2F4C39',
      borderBottomRightRadius: message.isFromMe ? '4px' : '16px',
      borderBottomLeftRadius: message.isFromMe ? '16px' : '4px'
    }}>
      <p style={bubbleTextStyles}>{message.content}</p>
      <span style={bubbleTimeStyles}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
  return date.toLocaleDateString();
}

function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    urgent: '#E74C3C',
    high: '#F39C12',
    normal: '#3EB4A2',
    low: '#8D8371'
  };
  return colors[priority] || colors.normal;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: '#0D0D0D'
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 24px',
  background: '#1E1F22',
  borderBottom: '1px solid #2F4C39'
};

const headerLeftStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const titleStyles: React.CSSProperties = {
  margin: 0,
  color: '#E9E4D6',
  fontSize: '1.25rem',
  fontWeight: 600
};

const unreadBadgeStyles: React.CSSProperties = {
  padding: '4px 10px',
  background: '#E74C3C',
  borderRadius: '12px',
  color: '#FFF',
  fontSize: '0.75rem',
  fontWeight: 600
};

const searchBarStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  maxWidth: '400px',
  padding: '8px 16px',
  background: '#0D0D0D',
  border: '1px solid #2F4C39',
  borderRadius: '20px',
  color: '#8D8371'
};

const searchInputStyles: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  color: '#E9E4D6',
  fontSize: '0.875rem',
  outline: 'none'
};

const syncButtonStyles: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid #2F4C39',
  borderRadius: '8px',
  color: '#8D8371',
  fontSize: '0.875rem',
  cursor: 'pointer'
};

const mainLayoutStyles: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden'
};

const sidebarStyles: React.CSSProperties = {
  width: '200px',
  padding: '16px',
  background: '#1E1F22',
  borderRight: '1px solid #2F4C39',
  overflow: 'auto'
};

const foldersStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const folderItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  color: '#8D8371',
  fontSize: '0.875rem',
  cursor: 'pointer',
  textAlign: 'left'
};

const countStyles: React.CSSProperties = {
  padding: '2px 8px',
  background: '#2F4C39',
  borderRadius: '10px',
  fontSize: '0.75rem',
  color: '#E9E4D6'
};

const dividerStyles: React.CSSProperties = {
  height: '1px',
  margin: '16px 0',
  background: '#2F4C39'
};

const platformsLabelStyles: React.CSSProperties = {
  padding: '0 12px',
  marginBottom: '8px',
  color: '#8D8371',
  fontSize: '0.6875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const platformsListStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const platformItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: '8px',
  fontSize: '0.8125rem',
  cursor: 'pointer',
  textAlign: 'left'
};

const connectMoreStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px'
};

const connectGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '8px'
};

const connectButtonStyles: React.CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0D0D0D',
  border: '1px dashed #2F4C39',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer'
};

const listStyles: React.CSSProperties = {
  width: '360px',
  borderRight: '1px solid #2F4C39',
  overflow: 'auto'
};

const emptyListStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: '#8D8371'
};

const convItemStyles: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  padding: '16px',
  borderBottom: '1px solid #2F4C39',
  borderLeft: '3px solid transparent',
  cursor: 'pointer',
  transition: 'background 0.15s'
};

const avatarContainerStyles: React.CSSProperties = {
  position: 'relative',
  flexShrink: 0
};

const avatarStyles: React.CSSProperties = {
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#3F7249',
  borderRadius: '50%',
  color: '#E9E4D6',
  fontSize: '1.125rem',
  fontWeight: 600
};

const platformBadgeStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '-2px',
  right: '-2px',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: '2px solid #0D0D0D',
  fontSize: '0.625rem'
};

const convContentStyles: React.CSSProperties = {
  flex: 1,
  minWidth: 0
};

const convTopRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '4px'
};

const convNameStyles: React.CSSProperties = {
  color: '#E9E4D6',
  fontSize: '0.9375rem'
};

const convTimeStyles: React.CSSProperties = {
  color: '#8D8371',
  fontSize: '0.75rem'
};

const convSubjectStyles: React.CSSProperties = {
  color: '#D8B26A',
  fontSize: '0.8125rem',
  marginBottom: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const convPreviewStyles: React.CSSProperties = {
  color: '#8D8371',
  fontSize: '0.8125rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const convMetaStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '6px',
  fontSize: '0.6875rem',
  color: '#8D8371'
};

const unreadCountStyles: React.CSSProperties = {
  padding: '2px 6px',
  background: '#3EB4A2',
  borderRadius: '8px',
  color: '#E9E4D6',
  fontWeight: 600
};

const urgentStyles: React.CSSProperties = {
  color: '#E74C3C'
};

const messageViewStyles: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const noSelectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center'
};

const convHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  background: '#1E1F22',
  borderBottom: '1px solid #2F4C39'
};

const convHeaderLeftStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const platformIconStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  fontSize: '1.25rem'
};

const convTitleStyles: React.CSSProperties = {
  margin: 0,
  color: '#E9E4D6',
  fontSize: '1rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const channelNameStyles: React.CSSProperties = {
  padding: '2px 8px',
  background: '#2F4C39',
  borderRadius: '8px',
  color: '#8D8371',
  fontSize: '0.75rem',
  fontWeight: 400
};

const subjectStyles: React.CSSProperties = {
  margin: '4px 0 0',
  color: '#8D8371',
  fontSize: '0.8125rem'
};

const convActionsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '8px'
};

const actionButtonStyles: React.CSSProperties = {
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '1px solid #2F4C39',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer'
};

const aiBannerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 20px',
  background: '#D8B26A10',
  borderBottom: '1px solid #D8B26A40',
  color: '#D8B26A',
  fontSize: '0.8125rem'
};

const priorityBadgeStyles: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: '8px',
  color: '#FFF',
  fontSize: '0.6875rem',
  fontWeight: 600
};

const messagesContainerStyles: React.CSSProperties = {
  flex: 1,
  padding: '20px',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const bubbleContainerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px'
};

const bubbleAvatarStyles: React.CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#3F7249',
  borderRadius: '50%',
  color: '#E9E4D6',
  fontSize: '0.875rem',
  fontWeight: 600,
  flexShrink: 0
};

const bubbleStyles: React.CSSProperties = {
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: '16px'
};

const bubbleTextStyles: React.CSSProperties = {
  margin: 0,
  color: '#E9E4D6',
  fontSize: '0.9375rem',
  lineHeight: 1.5
};

const bubbleTimeStyles: React.CSSProperties = {
  display: 'block',
  marginTop: '4px',
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '0.6875rem',
  textAlign: 'right'
};

const suggestionStyles: React.CSSProperties = {
  margin: '0 20px 16px',
  padding: '16px',
  background: '#D8B26A10',
  border: '1px solid #D8B26A40',
  borderRadius: '12px'
};

const suggestionHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px',
  color: '#D8B26A',
  fontSize: '0.8125rem',
  fontWeight: 600
};

const closeSuggestionStyles: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#8D8371',
  cursor: 'pointer'
};

const suggestionTextStyles: React.CSSProperties = {
  margin: '0 0 12px',
  color: '#E9E4D6',
  fontSize: '0.875rem',
  fontStyle: 'italic'
};

const useSuggestionStyles: React.CSSProperties = {
  padding: '8px 16px',
  background: '#D8B26A',
  border: 'none',
  borderRadius: '8px',
  color: '#0D0D0D',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer'
};

const replyBoxStyles: React.CSSProperties = {
  padding: '16px 20px',
  background: '#1E1F22',
  borderTop: '1px solid #2F4C39'
};

const replyInputContainerStyles: React.CSSProperties = {
  marginBottom: '12px'
};

const replyInputStyles: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: '#0D0D0D',
  border: '1px solid #2F4C39',
  borderRadius: '8px',
  color: '#E9E4D6',
  fontSize: '0.9375rem',
  resize: 'none',
  outline: 'none'
};

const replyActionsStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const replyToolsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '8px'
};

const toolButtonStyles: React.CSSProperties = {
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '1px solid #2F4C39',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer'
};

const sendButtonStyles: React.CSSProperties = {
  padding: '10px 24px',
  background: 'linear-gradient(135deg, #3EB4A2 0%, #3F7249 100%)',
  border: 'none',
  borderRadius: '8px',
  color: '#E9E4D6',
  fontSize: '0.9375rem',
  fontWeight: 600,
  cursor: 'pointer'
};

export default UnifiedMessaging;
