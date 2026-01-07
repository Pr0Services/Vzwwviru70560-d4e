// CHE·NU™ Thread System (.chenu)
// Complete thread management with encoding support

import React, { useState, useCallback, useMemo, useRef, useEffect, createContext, useContext } from 'react';

// ============================================================
// TYPES
// ============================================================

export type MessageRole = 'user' | 'assistant' | 'system';
export type ThreadStatus = 'active' | 'archived' | 'deleted';
export type EncodingLevel = 'none' | 'light' | 'standard' | 'aggressive';

export interface ThreadMessage {
  id: string;
  threadId: string;
  role: MessageRole;
  content: string;
  encodedContent?: string;
  tokensUsed: number;
  tokensSaved?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
  attachments?: ThreadAttachment[];
}

export interface ThreadAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Thread {
  id: string;
  title: string;
  sphereCode: string;
  userId: string;
  status: ThreadStatus;
  encodingEnabled: boolean;
  encodingLevel: EncodingLevel;
  tokenBudget: number;
  tokensUsed: number;
  tokensSaved: number;
  messageCount: number;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  starred: boolean;
  pinned: boolean;
}

export interface ThreadContextValue {
  currentThread: Thread | null;
  messages: ThreadMessage[];
  isLoading: boolean;
  isSending: boolean;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  loadThread: (threadId: string) => Promise<void>;
  createThread: (title: string, sphereCode: string) => Promise<Thread>;
  updateThread: (updates: Partial<Thread>) => Promise<void>;
  toggleEncoding: () => Promise<void>;
  setEncodingLevel: (level: EncodingLevel) => Promise<void>;
}

// ============================================================
// BRAND COLORS
// ============================================================

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// ENCODING UTILITIES
// ============================================================

const ENCODING_PATTERNS = [
  // Common patterns
  { pattern: /\bthe\b/gi, replacement: 't', weight: 0.9 },
  { pattern: /\band\b/gi, replacement: '&', weight: 0.9 },
  { pattern: /\bfor\b/gi, replacement: '4', weight: 0.9 },
  { pattern: /\bwith\b/gi, replacement: 'w/', weight: 0.85 },
  { pattern: /\byou\b/gi, replacement: 'u', weight: 0.9 },
  { pattern: /\bare\b/gi, replacement: 'r', weight: 0.85 },
  { pattern: /\bto\b/gi, replacement: '2', weight: 0.9 },
  { pattern: /\bbecause\b/gi, replacement: 'bc', weight: 0.8 },
  { pattern: /\bplease\b/gi, replacement: 'pls', weight: 0.85 },
  { pattern: /\bthanks?\b/gi, replacement: 'thx', weight: 0.85 },
  { pattern: /\bthrough\b/gi, replacement: 'thru', weight: 0.8 },
  { pattern: /\bbefore\b/gi, replacement: 'b4', weight: 0.8 },
  { pattern: /\bwithout\b/gi, replacement: 'w/o', weight: 0.8 },
  { pattern: /\bsomething\b/gi, replacement: 'smth', weight: 0.75 },
  { pattern: /\beverything\b/gi, replacement: 'evrthg', weight: 0.7 },
  { pattern: /\bnothing\b/gi, replacement: 'nthg', weight: 0.7 },
  // Technical patterns
  { pattern: /\bfunction\b/gi, replacement: 'fn', weight: 0.9 },
  { pattern: /\bvariable\b/gi, replacement: 'var', weight: 0.9 },
  { pattern: /\bparameter\b/gi, replacement: 'param', weight: 0.85 },
  { pattern: /\bdatabase\b/gi, replacement: 'db', weight: 0.9 },
  { pattern: /\bapplication\b/gi, replacement: 'app', weight: 0.9 },
  { pattern: /\bconfiguration\b/gi, replacement: 'config', weight: 0.85 },
  { pattern: /\binformation\b/gi, replacement: 'info', weight: 0.9 },
];

export const encodeText = (text: string, level: EncodingLevel): { encoded: string; savings: number; quality: number } => {
  if (level === 'none') {
    return { encoded: text, savings: 0, quality: 1 };
  }

  const originalLength = text.length;
  let encoded = text;
  let quality = 1;

  const levelWeights = {
    light: 0.9,
    standard: 0.8,
    aggressive: 0.7,
  };

  const weightThreshold = levelWeights[level];

  ENCODING_PATTERNS.forEach(({ pattern, replacement, weight }) => {
    if (weight >= weightThreshold) {
      encoded = encoded.replace(pattern, replacement);
      quality = Math.min(quality, weight);
    }
  });

  // Additional aggressive encoding
  if (level === 'aggressive') {
    // Remove redundant spaces
    encoded = encoded.replace(/\s+/g, ' ').trim();
    // Remove filler words
    encoded = encoded.replace(/\b(just|really|very|basically|actually)\b\s*/gi, '');
    quality *= 0.85;
  }

  const savings = ((originalLength - encoded.length) / originalLength) * 100;

  return {
    encoded,
    savings: Math.round(savings * 100) / 100,
    quality: Math.round(quality * 100) / 100,
  };
};

export const decodeText = (encoded: string): string => {
  // Reverse encoding patterns
  let decoded = encoded;
  decoded = decoded.replace(/\bt\b/g, 'the');
  decoded = decoded.replace(/&/g, 'and');
  decoded = decoded.replace(/\b4\b/g, 'for');
  decoded = decoded.replace(/w\//g, 'with');
  decoded = decoded.replace(/\bu\b/g, 'you');
  decoded = decoded.replace(/\br\b/g, 'are');
  decoded = decoded.replace(/\b2\b/g, 'to');
  decoded = decoded.replace(/\bbc\b/g, 'because');
  decoded = decoded.replace(/\bpls\b/g, 'please');
  decoded = decoded.replace(/\bthx\b/g, 'thanks');
  return decoded;
};

// ============================================================
// TOKEN ESTIMATION
// ============================================================

export const estimateTokens = (text: string): number => {
  // Rough estimation: ~4 characters per token on average
  return Math.ceil(text.length / 4);
};

// ============================================================
// THREAD CONTEXT
// ============================================================

const ThreadContext = createContext<ThreadContextValue | null>(null);

export const useThread = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThread must be used within a ThreadProvider');
  }
  return context;
};

// ============================================================
// THREAD PROVIDER
// ============================================================

interface ThreadProviderProps {
  children: React.ReactNode;
}

export const ThreadProvider: React.FC<ThreadProviderProps> = ({ children }) => {
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!currentThread) return;

    setIsSending(true);
    try {
      const { encoded, savings, quality } = encodeText(content, currentThread.encodingLevel);
      const tokens = estimateTokens(currentThread.encodingEnabled ? encoded : content);
      const tokensSaved = currentThread.encodingEnabled ? estimateTokens(content) - tokens : 0;

      const newMessage: ThreadMessage = {
        id: Date.now().toString(),
        threadId: currentThread.id,
        role: 'user',
        content,
        encodedContent: currentThread.encodingEnabled ? encoded : undefined,
        tokensUsed: tokens,
        tokensSaved: tokensSaved,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: ThreadMessage = {
          id: (Date.now() + 1).toString(),
          threadId: currentThread.id,
          role: 'assistant',
          content: `I understand your message: "${content}". How can I help you further?`,
          tokensUsed: estimateTokens('I understand your message. How can I help you further?'),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }, 1000);

      // Update thread stats
      setCurrentThread((prev) => prev ? {
        ...prev,
        tokensUsed: prev.tokensUsed + tokens,
        tokensSaved: prev.tokensSaved + tokensSaved,
        messageCount: prev.messageCount + 1,
        lastActivity: new Date(),
      } : null);

    } finally {
      setIsSending(false);
    }
  }, [currentThread]);

  const editMessage = useCallback(async (messageId: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content, timestamp: new Date() } : msg
      )
    );
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  const loadThread = useCallback(async (threadId: string) => {
    setIsLoading(true);
    try {
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock thread data
      setCurrentThread({
        id: threadId,
        title: 'Sample Thread',
        sphereCode: 'PERSONAL',
        userId: 'user-1',
        status: 'active',
        encodingEnabled: true,
        encodingLevel: 'standard',
        tokenBudget: 10000,
        tokensUsed: 0,
        tokensSaved: 0,
        messageCount: 0,
        lastActivity: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        starred: false,
        pinned: false,
      });
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createThread = useCallback(async (title: string, sphereCode: string): Promise<Thread> => {
    const newThread: Thread = {
      id: Date.now().toString(),
      title,
      sphereCode,
      userId: 'user-1',
      status: 'active',
      encodingEnabled: true,
      encodingLevel: 'standard',
      tokenBudget: 10000,
      tokensUsed: 0,
      tokensSaved: 0,
      messageCount: 0,
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      starred: false,
      pinned: false,
    };
    setCurrentThread(newThread);
    setMessages([]);
    return newThread;
  }, []);

  const updateThread = useCallback(async (updates: Partial<Thread>) => {
    setCurrentThread((prev) => prev ? { ...prev, ...updates } : null);
  }, []);

  const toggleEncoding = useCallback(async () => {
    setCurrentThread((prev) => prev ? { ...prev, encodingEnabled: !prev.encodingEnabled } : null);
  }, []);

  const setEncodingLevel = useCallback(async (level: EncodingLevel) => {
    setCurrentThread((prev) => prev ? { ...prev, encodingLevel: level } : null);
  }, []);

  return (
    <ThreadContext.Provider
      value={{
        currentThread,
        messages,
        isLoading,
        isSending,
        sendMessage,
        editMessage,
        deleteMessage,
        loadThread,
        createThread,
        updateThread,
        toggleEncoding,
        setEncodingLevel,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};

// ============================================================
// MESSAGE BUBBLE COMPONENT
// ============================================================

interface MessageBubbleProps {
  message: ThreadMessage;
  showEncoded?: boolean;
  onEdit?: (content: string) => void;
  onDelete?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showEncoded = false,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleSaveEdit = () => {
    onEdit?.(editContent);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {!isUser && (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0 ${
          isSystem ? 'bg-gray-200' : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
        }`}>
          {isSystem ? '⚙️' : 'N'}
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[70%] ${isUser ? 'order-first mr-3' : ''}`}>
        <div
          className={`
            rounded-2xl px-4 py-3
            ${isUser
              ? 'bg-amber-600 text-white rounded-br-md'
              : isSystem
                ? 'bg-gray-100 text-gray-700 rounded-bl-md'
                : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm'
            }
          `}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 text-gray-900 resize-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap">
                {showEncoded && message.encodedContent ? message.encodedContent : message.content}
              </p>
              
              {/* Token Info */}
              {message.tokensUsed > 0 && (
                <div className={`text-xs mt-2 ${isUser ? 'text-amber-200' : 'text-gray-400'}`}>
                  {message.tokensUsed} tokens
                  {message.tokensSaved && message.tokensSaved > 0 && (
                    <span className="ml-2 text-green-400">
                      (-{message.tokensSaved} saved)
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {/* Actions */}
      {showActions && !isEditing && isUser && (
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}

      {/* User Avatar */}
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          👤
        </div>
      )}
    </div>
  );
};

// ============================================================
// MESSAGE INPUT COMPONENT
// ============================================================

interface MessageInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  encodingEnabled?: boolean;
  encodingLevel?: EncodingLevel;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  encodingEnabled = false,
  encodingLevel = 'standard',
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodingPreview = useMemo(() => {
    if (!encodingEnabled || !content) return null;
    return encodeText(content, encodingLevel);
  }, [content, encodingEnabled, encodingLevel]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || disabled) return;

    onSend(content.trim(), attachments.length > 0 ? attachments : undefined);
    setContent('');
    setAttachments([]);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Encoding Preview */}
      {showPreview && encodingPreview && content && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Encoding Preview</span>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">{encodingPreview.encoded}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Savings: {encodingPreview.savings}%</span>
            <span>Quality: {encodingPreview.quality * 100}%</span>
          </div>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
            >
              <span className="text-sm text-gray-700">{file.name}</span>
              <span className="text-xs text-gray-400">
                ({(file.size / 1024).toFixed(1)}KB)
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Encoding Toggle */}
        {encodingEnabled && content && (
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-lg ${showPreview ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Show encoding preview"
          >
            🔤
          </button>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={!content.trim() || disabled}
          className="p-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      {/* Token Estimate */}
      {content && (
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
          <span>
            Estimated: {estimateTokens(encodingEnabled ? (encodingPreview?.encoded || content) : content)} tokens
          </span>
          {encodingEnabled && encodingPreview && encodingPreview.savings > 0 && (
            <span className="text-green-500">
              {encodingPreview.savings}% savings with encoding
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// THREAD LIST COMPONENT
// ============================================================

interface ThreadListProps {
  threads: Thread[];
  activeThreadId?: string;
  onSelect: (thread: Thread) => void;
  onDelete?: (threadId: string) => void;
  onStar?: (threadId: string) => void;
  onPin?: (threadId: string) => void;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  activeThreadId,
  onSelect,
  onDelete,
  onStar,
  onPin,
}) => {
  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });
  }, [threads]);

  if (threads.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-2">💬</div>
        <p className="text-gray-500">No threads yet</p>
        <p className="text-sm text-gray-400">Create your first .chenu thread</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {sortedThreads.map((thread) => (
        <div
          key={thread.id}
          onClick={() => onSelect(thread)}
          className={`
            p-4 cursor-pointer transition-colors
            ${activeThreadId === thread.id
              ? 'bg-amber-50 border-l-4 border-amber-500'
              : 'hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {thread.pinned && <span title="Pinned">📌</span>}
                {thread.starred && <span title="Starred">⭐</span>}
                <h3 className="font-medium text-gray-900 truncate">{thread.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {thread.messageCount} messages • {thread.tokensUsed.toLocaleString()} tokens
              </p>
              {thread.tokensSaved > 0 && (
                <p className="text-xs text-green-500 mt-1">
                  {thread.tokensSaved.toLocaleString()} tokens saved with encoding
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs text-gray-400">
                {new Date(thread.lastActivity).toLocaleDateString()}
              </span>
            </div>
          </div>
          {thread.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {thread.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {thread.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{thread.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================
// THREAD HEADER COMPONENT
// ============================================================

interface ThreadHeaderProps {
  thread: Thread;
  onBack?: () => void;
  onSettings?: () => void;
}

export const ThreadHeader: React.FC<ThreadHeaderProps> = ({
  thread,
  onBack,
  onSettings,
}) => {
  const budgetPercentage = (thread.tokensUsed / thread.tokenBudget) * 100;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900">{thread.title}</h2>
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                .chenu
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <span>{thread.messageCount} messages</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {thread.encodingEnabled ? (
                  <>
                    <span className="text-green-500">●</span>
                    Encoding: {thread.encodingLevel}
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">○</span>
                    Encoding: off
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Token Budget */}
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {thread.tokensUsed.toLocaleString()} / {thread.tokenBudget.toLocaleString()} tokens
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetPercentage > 80 ? 'bg-red-500' : budgetPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>

          {onSettings && (
            <button
              onClick={onSettings}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ⚙️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// THREAD VIEW COMPONENT
// ============================================================

export const ThreadView: React.FC = () => {
  const {
    currentThread,
    messages,
    isLoading,
    isSending,
    sendMessage,
    editMessage,
    deleteMessage,
    toggleEncoding,
    setEncodingLevel,
  } = useThread();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No thread selected</h3>
          <p className="text-gray-500">Select a thread or create a new one</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ThreadHeader thread={currentThread} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Start the conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              showEncoded={currentThread.encodingEnabled}
              onEdit={(content) => editMessage(message.id, content)}
              onDelete={() => deleteMessage(message.id)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        disabled={isSending}
        encodingEnabled={currentThread.encodingEnabled}
        encodingLevel={currentThread.encodingLevel}
      />
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  ThreadProvider,
  useThread,
  MessageBubble,
  MessageInput,
  ThreadList,
  ThreadHeader,
  ThreadView,
  encodeText,
  decodeText,
  estimateTokens,
};
