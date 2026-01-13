/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — THREADS SECTION                                 ║
 * ║                    💬 Threads — Conversations et fils de discussion         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Interface pour gérer les threads (.chenu):                                  ║
 * ║  • Conversations avec Nova et agents                                         ║
 * ║  • Fils de discussion par projet                                             ║
 * ║  • Historique des échanges                                                   ║
 * ║  • Recherche et filtres                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

interface ThreadsSectionProps {
  sphereId: string;
  sphereName: string;
  sphereColor: string;
}

interface Thread {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  type: 'nova' | 'agent' | 'team' | 'project';
  status: 'active' | 'resolved' | 'pending';
}

export const ThreadsSection: React.FC<ThreadsSectionProps> = ({
  sphereId,
  sphereName,
  sphereColor,
}) => {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'nova' | 'agents' | 'team'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [threads] = useState<Thread[]>([
    {
      id: '1',
      title: 'Analyse du rapport Q4',
      participants: ['Nova', 'Vous'],
      lastMessage: 'J\'ai terminé l\'analyse. Voici les points clés...',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      isPinned: true,
      isArchived: false,
      type: 'nova',
      status: 'active',
    },
    {
      id: '2',
      title: 'Révision contrat fournisseur',
      participants: ['Agent Juridique', 'Vous'],
      lastMessage: 'Les clauses 4.2 et 5.1 nécessitent attention...',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      type: 'agent',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Brainstorm produit 2026',
      participants: ['Marie', 'Pierre', 'Vous'],
      lastMessage: 'On peut se réunir jeudi pour finaliser?',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 5,
      isPinned: false,
      isArchived: false,
      type: 'team',
      status: 'active',
    },
    {
      id: '4',
      title: 'Budget marketing',
      participants: ['Agent Finance', 'Vous'],
      lastMessage: 'Projection validée pour Q1.',
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      type: 'agent',
      status: 'resolved',
    },
  ]);

  const filteredThreads = threads
    .filter(t => !t.isArchived)
    .filter(t => {
      if (filter === 'all') return true;
      if (filter === 'nova') return t.type === 'nova';
      if (filter === 'agents') return t.type === 'agent';
      if (filter === 'team') return t.type === 'team';
      return true;
    })
    .filter(t => 
      searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
    });

  const getTypeIcon = (type: Thread['type']) => {
    switch (type) {
      case 'nova': return '🤖';
      case 'agent': return '🔧';
      case 'team': return '👥';
      case 'project': return '📁';
    }
  };

  const getStatusStyle = (status: Thread['status']) => {
    switch (status) {
      case 'active': return { bg: '#4ade80', label: 'Actif' };
      case 'resolved': return { bg: '#6b6560', label: 'Résolu' };
      case 'pending': return { bg: '#f59e0b', label: 'En attente' };
    }
  };

  return (
    <div className="threads-section">
      <div className="threads-layout">
        {/* Thread List */}
        <div className="thread-list-panel">
          {/* Header */}
          <div className="panel-header">
            <div className="header-title">
              <span className="header-icon">💬</span>
              <h2>Threads</h2>
            </div>
            <button className="new-thread-btn" style={{ background: sphereColor }}>
              + Nouveau
            </button>
          </div>

          {/* Search */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher dans les threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filter-tabs">
            {[
              { id: 'all', label: 'Tous', icon: '📋' },
              { id: 'nova', label: 'Nova', icon: '🤖' },
              { id: 'agents', label: 'Agents', icon: '🔧' },
              { id: 'team', label: 'Équipe', icon: '👥' },
            ].map(f => (
              <button
                key={f.id}
                className={`filter-tab ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id as any)}
                style={{ '--accent': sphereColor } as React.CSSProperties}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {/* Thread List */}
          <div className="thread-list">
            {filteredThreads.map(thread => {
              const status = getStatusStyle(thread.status);
              return (
                <div
                  key={thread.id}
                  className={`thread-item ${selectedThread === thread.id ? 'selected' : ''} ${thread.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => setSelectedThread(thread.id)}
                  style={{ '--accent': sphereColor } as React.CSSProperties}
                >
                  {thread.isPinned && <span className="pin-badge">📌</span>}
                  <div className="thread-avatar">
                    {getTypeIcon(thread.type)}
                  </div>
                  <div className="thread-content">
                    <div className="thread-header">
                      <span className="thread-title">{thread.title}</span>
                      <span className="thread-time">
                        {formatTime(thread.lastMessageTime)}
                      </span>
                    </div>
                    <div className="thread-preview">
                      <span className="preview-text">{thread.lastMessage}</span>
                      {thread.unreadCount > 0 && (
                        <span className="unread-badge" style={{ background: sphereColor }}>
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="thread-meta">
                      <span className="participants">
                        {thread.participants.join(', ')}
                      </span>
                      <span className="status-dot" style={{ background: status.bg }} title={status.label} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Thread Detail / Chat */}
        <div className="thread-detail-panel">
          {selectedThread ? (
            <ThreadChat 
              thread={threads.find(t => t.id === selectedThread)!}
              sphereColor={sphereColor}
            />
          ) : (
            <div className="no-thread-selected">
              <span className="empty-icon">💬</span>
              <p>Sélectionnez un thread</p>
              <p className="hint">ou créez-en un nouveau</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .threads-section {
          height: calc(100vh - 200px);
          min-height: 500px;
        }

        .threads-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 0;
          height: 100%;
          background: #1e2420;
          border-radius: 16px;
          overflow: hidden;
        }

        .thread-list-panel {
          background: #1a1f1c;
          border-right: 1px solid #2a2a2a;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #2a2a2a;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-icon { font-size: 24px; }

        .header-title h2 {
          font-size: 20px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0;
        }

        .new-thread-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-bottom: 1px solid #2a2a2a;
        }

        .search-icon { color: #6b6560; }

        .search-bar input {
          flex: 1;
          background: transparent;
          border: none;
          color: #e8e4dc;
          font-size: 14px;
          outline: none;
        }

        .search-bar input::placeholder { color: #6b6560; }

        .filter-tabs {
          display: flex;
          padding: 12px;
          gap: 8px;
          border-bottom: 1px solid #2a2a2a;
        }

        .filter-tab {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #6b6560;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-tab:hover { color: #a8a29e; }

        .filter-tab.active {
          background: var(--accent);
          color: #000;
        }

        .thread-list {
          flex: 1;
          overflow-y: auto;
        }

        .thread-item {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid #252a27;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }

        .thread-item:hover { background: #252a27; }

        .thread-item.selected {
          background: rgba(74, 222, 128, 0.1);
          border-left: 3px solid var(--accent);
        }

        .thread-item.unread { background: #1e2622; }

        .pin-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 12px;
        }

        .thread-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .thread-content {
          flex: 1;
          min-width: 0;
        }

        .thread-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .thread-title {
          font-weight: 600;
          color: #e8e4dc;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .thread-time {
          font-size: 11px;
          color: #6b6560;
          flex-shrink: 0;
        }

        .thread-preview {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .preview-text {
          font-size: 13px;
          color: #6b6560;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread-badge {
          flex-shrink: 0;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          color: #000;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thread-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }

        .participants {
          font-size: 11px;
          color: #4a4a4a;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .thread-detail-panel {
          display: flex;
          flex-direction: column;
        }

        .no-thread-selected {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6b6560;
        }

        .no-thread-selected .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .no-thread-selected .hint {
          font-size: 14px;
          margin-top: 4px;
        }

        @media (max-width: 900px) {
          .threads-layout {
            grid-template-columns: 1fr;
          }
          .thread-detail-panel {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

// Thread Chat Component
const ThreadChat: React.FC<{ thread: Thread; sphereColor: string }> = ({ thread, sphereColor }) => {
  const [message, setMessage] = useState('');

  return (
    <div className="thread-chat">
      <div className="chat-header">
        <div className="chat-info">
          <h3>{thread.title}</h3>
          <span className="chat-participants">{thread.participants.join(', ')}</span>
        </div>
        <div className="chat-actions">
          <button className="chat-action">📌</button>
          <button className="chat-action">⋮</button>
        </div>
      </div>

      <div className="chat-messages">
        <div className="message other">
          <div className="message-avatar">🤖</div>
          <div className="message-content">
            <div className="message-header">
              <span className="message-sender">Nova</span>
              <span className="message-time">14:32</span>
            </div>
            <div className="message-text">{thread.lastMessage}</div>
          </div>
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Écrivez votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-btn" style={{ background: sphereColor }}>
          Envoyer
        </button>
      </div>

      <style>{`
        .thread-chat {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #2a2a2a;
        }

        .chat-info h3 {
          font-size: 18px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0 0 4px;
        }

        .chat-participants {
          font-size: 13px;
          color: #6b6560;
        }

        .chat-actions {
          display: flex;
          gap: 8px;
        }

        .chat-action {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: #2a2a2a;
          cursor: pointer;
          font-size: 16px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .message {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .message-content {
          flex: 1;
        }

        .message-header {
          display: flex;
          gap: 8px;
          margin-bottom: 4px;
        }

        .message-sender {
          font-weight: 600;
          color: #e8e4dc;
          font-size: 14px;
        }

        .message-time {
          font-size: 12px;
          color: #6b6560;
        }

        .message-text {
          background: #252a27;
          padding: 12px 16px;
          border-radius: 12px;
          color: #a8a29e;
          font-size: 14px;
          line-height: 1.5;
        }

        .chat-input {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #2a2a2a;
        }

        .chat-input input {
          flex: 1;
          background: #121614;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 12px 16px;
          color: #e8e4dc;
          font-size: 14px;
          outline: none;
        }

        .send-btn {
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default ThreadsSection;
