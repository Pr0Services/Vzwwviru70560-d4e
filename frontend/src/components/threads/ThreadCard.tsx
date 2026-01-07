/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — THREAD CARD                                 ║
 * ║                    Card Visuelle pour Threads .chenu                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Features:
 * - Titre et preview
 * - Messages count
 * - Participants (users + agents)
 * - Tags
 * - Star/Pin actions
 * - Last activity
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ThreadStatus = 'active' | 'archived' | 'completed';

export interface ThreadParticipant {
  id: string;
  name: string;
  type: 'user' | 'agent' | 'nova';
  avatar?: string;
}

export interface ThreadMessage {
  id: string;
  content: string;
  authorId: string;
  authorType: 'user' | 'agent' | 'nova';
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  description?: string;
  sphereId: string;
  status: ThreadStatus;
  participants: ThreadParticipant[];
  messagesCount: number;
  lastMessage?: ThreadMessage;
  tags?: string[];
  isStarred: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ThreadCardProps {
  thread: Thread;
  onClick?: (thread: Thread) => void;
  onStar?: (thread: Thread) => void;
  onPin?: (thread: Thread) => void;
  onArchive?: (thread: Thread) => void;
  onDelete?: (thread: Thread) => void;
  compact?: boolean;
  selected?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function ThreadCard({
  thread,
  onClick,
  onStar,
  onPin,
  onArchive,
  onDelete,
  compact = false,
  selected = false,
}: ThreadCardProps) {
  const hasNova = thread.participants.some(p => p.type === 'nova');
  const hasAgents = thread.participants.some(p => p.type === 'agent');

  // ─────────────────────────────────────────────────────────────────────────────
  // Compact Mode
  // ─────────────────────────────────────────────────────────────────────────────

  if (compact) {
    return (
      <button
        onClick={() => onClick?.(thread)}
        className={`
          w-full flex items-center gap-3 p-3 rounded-lg text-left
          transition-all duration-200
          ${selected 
            ? 'bg-[#D8B26A]/10 border border-[#D8B26A]/30' 
            : 'bg-[#1E1F22] border border-transparent hover:bg-[#2A2B2E]'
          }
        `}
        data-testid={`thread-card-compact-${thread.id}`}
      >
        {/* Icon */}
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center text-sm
          ${thread.isStarred ? 'bg-[#D8B26A]/20 text-[#D8B26A]' : 'bg-[#2A2B2E] text-[#8D8371]'}
        `}>
          💬
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm text-[#E9E4D6] truncate">{thread.title}</p>
            {thread.isPinned && <span className="text-[10px]">📌</span>}
          </div>
          <p className="text-xs text-[#5A5B5E]">
            {thread.messagesCount} messages • {formatRelativeTime(thread.updatedAt)}
          </p>
        </div>
        
        {/* Indicators */}
        <div className="flex items-center gap-1">
          {hasNova && <span className="text-[10px]">✨</span>}
          {hasAgents && <span className="text-[10px]">🤖</span>}
        </div>
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Full Mode
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div 
      className={`
        bg-[#1E1F22] border rounded-xl overflow-hidden cursor-pointer
        transition-all duration-200 group
        ${selected 
          ? 'border-[#D8B26A] ring-1 ring-[#D8B26A]/20' 
          : 'border-[#2A2B2E] hover:border-[#3A3B3E]'
        }
      `}
      onClick={() => onClick?.(thread)}
      data-testid={`thread-card-${thread.id}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2A2B2E]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Thread icon */}
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
              ${thread.isStarred ? 'bg-[#D8B26A]/20' : 'bg-[#2A2B2E]'}
            `}>
              <span className="text-lg">💬</span>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-[#E9E4D6] truncate">
                  {thread.title}
                </h3>
                {thread.isPinned && <span className="text-xs">📌</span>}
                {thread.isStarred && <span className="text-xs text-[#D8B26A]">★</span>}
              </div>
              {thread.description && (
                <p className="text-xs text-[#5A5B5E] truncate">
                  {thread.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onStar && (
              <button
                onClick={(e) => { e.stopPropagation(); onStar(thread); }}
                className={`p-1.5 rounded hover:bg-[#2A2B2E] transition-colors ${
                  thread.isStarred ? 'text-[#D8B26A]' : 'text-[#5A5B5E]'
                }`}
                data-testid={`thread-star-${thread.id}`}
              >
                ★
              </button>
            )}
            {onPin && (
              <button
                onClick={(e) => { e.stopPropagation(); onPin(thread); }}
                className={`p-1.5 rounded hover:bg-[#2A2B2E] transition-colors ${
                  thread.isPinned ? 'text-[#3EB4A2]' : 'text-[#5A5B5E]'
                }`}
                data-testid={`thread-pin-${thread.id}`}
              >
                📌
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Last message preview */}
      {thread.lastMessage && (
        <div className="px-4 py-3 bg-[#1A1B1E]">
          <div className="flex items-start gap-2">
            <span className="text-xs">
              {thread.lastMessage.authorType === 'nova' ? '✨' : 
               thread.lastMessage.authorType === 'agent' ? '🤖' : '👤'}
            </span>
            <p className="text-xs text-[#8D8371] line-clamp-2">
              {truncateText(thread.lastMessage.content, 120)}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#2A2B2E] flex items-center justify-between">
        {/* Participants */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {thread.participants.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                className={`
                  w-6 h-6 rounded-full border border-[#1E1F22] flex items-center justify-center text-[10px]
                  ${p.type === 'nova' 
                    ? 'bg-[#D8B26A]/20 text-[#D8B26A]' 
                    : p.type === 'agent'
                      ? 'bg-[#3EB4A2]/20 text-[#3EB4A2]'
                      : 'bg-[#2A2B2E] text-[#8D8371]'
                  }
                `}
                style={{ zIndex: 4 - i }}
                title={p.name}
              >
                {p.type === 'nova' ? '✨' : p.type === 'agent' ? '🤖' : p.name[0]}
              </div>
            ))}
            {thread.participants.length > 4 && (
              <div className="w-6 h-6 rounded-full border border-[#1E1F22] bg-[#2A2B2E] flex items-center justify-center text-[10px] text-[#5A5B5E]">
                +{thread.participants.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-[#5A5B5E]">
            {thread.messagesCount} msg
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3">
          {/* Tags */}
          {thread.tags && thread.tags.length > 0 && (
            <div className="flex gap-1">
              {thread.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[10px] bg-[#2A2B2E] text-[#5A5B5E] rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Time */}
          <span className="text-xs text-[#5A5B5E]">
            {formatRelativeTime(thread.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD LIST GRID
// ═══════════════════════════════════════════════════════════════════════════════

interface ThreadListGridProps {
  threads: Thread[];
  onThreadClick?: (thread: Thread) => void;
  onStar?: (thread: Thread) => void;
  onPin?: (thread: Thread) => void;
  layout?: 'grid' | 'list';
  selectedId?: string;
  emptyMessage?: string;
}

export function ThreadListGrid({
  threads,
  onThreadClick,
  onStar,
  onPin,
  layout = 'list',
  selectedId,
  emptyMessage = 'Aucun thread',
}: ThreadListGridProps) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-4 block">💬</span>
        <p className="text-[#5A5B5E]">{emptyMessage}</p>
      </div>
    );
  }

  // Sort: pinned first, then starred, then by date
  const sortedThreads = [...threads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (b.isPinned && !a.isPinned) return 1;
    if (a.isStarred && !b.isStarred) return -1;
    if (b.isStarred && !a.isStarred) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div 
      className={
        layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
          : 'space-y-2'
      }
      data-testid="thread-list"
    >
      {sortedThreads.map(thread => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onClick={onThreadClick}
          onStar={onStar}
          onPin={onPin}
          compact={layout === 'list'}
          selected={thread.id === selectedId}
        />
      ))}
    </div>
  );
}

export default ThreadCard;
