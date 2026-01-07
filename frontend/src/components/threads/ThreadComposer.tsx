/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — THREAD COMPOSER                             ║
 * ║                    Composeur de Messages pour Threads                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Features:
 * - Input message multiline
 * - Mention @Nova et @Agent
 * - Attachments
 * - Voice input
 * - Quick actions
 * - Governance checkpoint pour actions critiques
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useGovernanceStore } from '../../stores/governance.store';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface Mention {
  id: string;
  name: string;
  type: 'user' | 'agent' | 'nova';
  startIndex: number;
  endIndex: number;
}

interface ThreadComposerProps {
  threadId: string;
  onSend: (message: { 
    content: string; 
    attachments?: Attachment[];
    mentions?: Mention[];
  }) => void;
  placeholder?: string;
  disabled?: boolean;
  showNovaButton?: boolean;
  availableAgents?: Array<{ id: string; name: string }>;
  maxLength?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_MAX_LENGTH = 5000;

const QUICK_ACTIONS = [
  { id: 'nova', label: 'Appeler Nova', icon: '✨', trigger: '@Nova' },
  { id: 'summarize', label: 'Résumer', icon: '📝', trigger: '/résumer' },
  { id: 'action', label: 'Action item', icon: '✅', trigger: '/action' },
  { id: 'question', label: 'Question', icon: '❓', trigger: '/question' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD COMPOSER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function ThreadComposer({
  threadId,
  onSend,
  placeholder = 'Écrivez un message...',
  disabled = false,
  showNovaButton = true,
  availableAgents = [],
  maxLength = DEFAULT_MAX_LENGTH,
}: ThreadComposerProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { requestCheckpoint } = useGovernanceStore();

  // ─────────────────────────────────────────────────────────────────────────────
  // Auto-resize textarea
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setContent(value);
      
      // Check for @ mention trigger
      const lastAtIndex = value.lastIndexOf('@');
      if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
        setShowMentionMenu(true);
        setMentionFilter('');
      } else if (lastAtIndex !== -1) {
        const textAfterAt = value.slice(lastAtIndex + 1);
        if (!textAfterAt.includes(' ')) {
          setMentionFilter(textAfterAt);
          setShowMentionMenu(true);
        } else {
          setShowMentionMenu(false);
        }
      } else {
        setShowMentionMenu(false);
      }

      // Check for / command trigger
      if (value === '/' || (value.startsWith('/') && !value.includes(' '))) {
        setShowQuickActions(true);
      } else {
        setShowQuickActions(false);
      }
    }
  }, [maxLength]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setShowMentionMenu(false);
      setShowQuickActions(false);
    }
  }, [content, attachments]);

  const insertMention = useCallback((name: string, type: 'user' | 'agent' | 'nova') => {
    const lastAtIndex = content.lastIndexOf('@');
    const newContent = content.slice(0, lastAtIndex) + `@${name} `;
    setContent(newContent);
    setShowMentionMenu(false);
    textareaRef.current?.focus();
  }, [content]);

  const insertQuickAction = useCallback((trigger: string) => {
    const newContent = trigger + ' ';
    setContent(newContent);
    setShowQuickActions(false);
    textareaRef.current?.focus();
  }, []);

  const handleAddAttachment = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const handleSend = useCallback(async () => {
    if (!content.trim() && attachments.length === 0) return;
    if (disabled || isSending) return;

    // Check if Nova is mentioned - may need governance
    const mentionsNova = content.toLowerCase().includes('@nova');
    const hasCommand = content.startsWith('/');
    
    if (mentionsNova || hasCommand) {
      const approved = await requestCheckpoint({
        action: mentionsNova ? 'Invoquer Nova' : 'Exécuter commande',
        reason: mentionsNova 
          ? 'Nova va traiter votre message et peut effectuer des actions'
          : `Commande: ${content.split(' ')[0]}`,
        riskLevel: 'low',
        reversible: true,
        consequences: ['L\'IA va analyser et répondre à votre message'],
      });
      
      if (!approved) return;
    }

    setIsSending(true);

    try {
      // Extract mentions
      const mentions: Mention[] = [];
      const mentionRegex = /@(\w+)/g;
      let match;
      while ((match = mentionRegex.exec(content)) !== null) {
        const name = match[1];
        mentions.push({
          id: name.toLowerCase() === 'nova' ? 'nova' : `mention-${name}`,
          name,
          type: name.toLowerCase() === 'nova' ? 'nova' : 'user',
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }

      await onSend({
        content: content.trim(),
        attachments: attachments.length > 0 ? attachments : undefined,
        mentions: mentions.length > 0 ? mentions : undefined,
      });

      // Clear
      setContent('');
      setAttachments([]);
    } finally {
      setIsSending(false);
    }
  }, [content, attachments, disabled, isSending, requestCheckpoint, onSend]);

  const callNova = useCallback(() => {
    setContent(prev => (prev ? prev + ' @Nova ' : '@Nova '));
    textareaRef.current?.focus();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Mention suggestions
  // ─────────────────────────────────────────────────────────────────────────────

  const mentionSuggestions = [
    { id: 'nova', name: 'Nova', type: 'nova' as const },
    ...availableAgents.map(a => ({ ...a, type: 'agent' as const })),
  ].filter(s => 
    s.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  const charCount = content.length;
  const isOverLimit = charCount > maxLength * 0.9;

  return (
    <div 
      className="bg-[#141517] border border-[#2A2B2E] rounded-xl overflow-hidden"
      data-testid="thread-composer"
    >
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-3 py-2 border-b border-[#2A2B2E] flex flex-wrap gap-2">
          {attachments.map(att => (
            <div
              key={att.id}
              className="flex items-center gap-2 px-2 py-1 bg-[#1E1F22] rounded-lg"
            >
              <span className="text-xs">📎</span>
              <span className="text-xs text-[#E9E4D6] max-w-[100px] truncate">
                {att.name}
              </span>
              <button
                onClick={() => removeAttachment(att.id)}
                className="text-xs text-[#5A5B5E] hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full px-4 py-3 bg-transparent text-[#E9E4D6] placeholder-[#5A5B5E] resize-none focus:outline-none disabled:opacity-50"
          style={{ minHeight: '48px', maxHeight: '200px' }}
          data-testid="composer-input"
        />

        {/* Mention menu */}
        {showMentionMenu && mentionSuggestions.length > 0 && (
          <div className="absolute bottom-full left-4 mb-2 bg-[#1E1F22] border border-[#2A2B2E] rounded-lg shadow-xl overflow-hidden">
            {mentionSuggestions.map(s => (
              <button
                key={s.id}
                onClick={() => insertMention(s.name, s.type)}
                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#2A2B2E] transition-colors"
              >
                <span>
                  {s.type === 'nova' ? '✨' : s.type === 'agent' ? '🤖' : '👤'}
                </span>
                <span className="text-sm text-[#E9E4D6]">{s.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick actions menu */}
        {showQuickActions && (
          <div className="absolute bottom-full left-4 mb-2 bg-[#1E1F22] border border-[#2A2B2E] rounded-lg shadow-xl overflow-hidden">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.id}
                onClick={() => insertQuickAction(action.trigger)}
                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#2A2B2E] transition-colors"
              >
                <span>{action.icon}</span>
                <span className="text-sm text-[#E9E4D6]">{action.label}</span>
                <span className="text-xs text-[#5A5B5E] ml-auto">{action.trigger}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions bar */}
      <div className="px-3 py-2 border-t border-[#2A2B2E] flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Attachment button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-[#5A5B5E] hover:text-[#8D8371] hover:bg-[#2A2B2E] rounded-lg transition-colors disabled:opacity-50"
            data-testid="composer-attach"
          >
            📎
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={e => handleAddAttachment(e.target.files)}
            className="hidden"
          />

          {/* Nova button */}
          {showNovaButton && (
            <button
              onClick={callNova}
              disabled={disabled}
              className="px-2 py-1.5 text-xs flex items-center gap-1 text-[#D8B26A] hover:bg-[#D8B26A]/10 rounded-lg transition-colors disabled:opacity-50"
              data-testid="composer-nova"
            >
              ✨ Nova
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Character count */}
          <span className={`text-xs ${isOverLimit ? 'text-[#D8B26A]' : 'text-[#5A5B5E]'}`}>
            {charCount}/{maxLength}
          </span>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={disabled || isSending || (!content.trim() && attachments.length === 0)}
            className="px-4 py-1.5 text-xs font-medium bg-[#D8B26A] text-[#0D0E10] rounded-lg hover:bg-[#E9C87B] disabled:opacity-50 transition-colors flex items-center gap-2"
            data-testid="composer-send"
          >
            {isSending ? (
              <span className="w-3 h-3 border-2 border-[#0D0E10] border-t-transparent rounded-full animate-spin" />
            ) : (
              '↑'
            )}
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThreadComposer;
