// CHE·NU™ Rich Text Editor Component
// Comprehensive WYSIWYG editor with formatting, mentions, and embeds

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  KeyboardEvent,
  ClipboardEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type EditorMode = 'wysiwyg' | 'markdown' | 'html';
type TextAlign = 'left' | 'center' | 'right' | 'justify';
type ListType = 'bullet' | 'number' | 'check';
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface EditorFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  textAlign?: TextAlign;
  heading?: HeadingLevel | null;
  list?: ListType | null;
  blockquote?: boolean;
  link?: string | null;
  color?: string | null;
  backgroundColor?: string | null;
  fontSize?: number | null;
  fontFamily?: string | null;
}

interface EditorSelection {
  start: number;
  end: number;
  text: string;
}

interface MentionItem {
  id: string;
  name: string;
  avatar?: string;
  type?: 'user' | 'channel' | 'tag';
}

interface EmbedItem {
  id: string;
  type: 'image' | 'video' | 'file' | 'link' | 'code';
  url?: string;
  title?: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
}

interface EditorCommand {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  execute: () => void;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
}

interface RichTextEditorProps {
  value?: string;
  defaultValue?: string;
  mode?: EditorMode;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  showToolbar?: boolean;
  toolbarPosition?: 'top' | 'bottom' | 'floating';
  mentionTrigger?: string;
  mentions?: MentionItem[];
  allowEmbeds?: boolean;
  allowMentions?: boolean;
  allowEmoji?: boolean;
  allowMarkdown?: boolean;
  maxLength?: number;
  onChange?: (value: string, html: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMention?: (query: string) => void;
  onEmbed?: (embed: EmbedItem) => void;
  onSelectionChange?: (selection: EditorSelection | null) => void;
  customCommands?: EditorCommand[];
  className?: string;
  toolbarClassName?: string;
  editorClassName?: string;
}

interface EditorRef {
  focus: () => void;
  blur: () => void;
  getHTML: () => string;
  getText: () => string;
  setContent: (content: string) => void;
  insertText: (text: string) => void;
  insertEmbed: (embed: EmbedItem) => void;
  execCommand: (command: string, value?: unknown) => void;
  getSelection: () => EditorSelection | null;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
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
// CONSTANTS
// ============================================================

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
const FONT_FAMILIES = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Courier New',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
];

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#FFFFFF',
  '#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#319795', '#3182CE', '#5A67D8', '#805AD5',
  '#D53F8C', '#97266D', '#702459', '#1A365D', '#234E52', '#22543D', '#744210', '#7B341E',
];

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🖐️',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '⭐', '🌟', '✨', '💫', '🔥', '💥', '💢', '💯', '✅', '❌',
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  toolbar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    padding: '8px 12px',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
    backgroundColor: BRAND.softSand,
  },

  toolbarBottom: {
    borderBottom: 'none',
    borderTop: `1px solid ${BRAND.ancientStone}20`,
  },

  toolbarFloating: {
    position: 'absolute' as const,
    top: '-48px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${BRAND.ancientStone}20`,
    zIndex: 100,
  },

  toolbarGroup: {
    display: 'flex',
    gap: '2px',
    padding: '0 4px',
    borderRight: `1px solid ${BRAND.ancientStone}20`,
  },

  toolbarGroupLast: {
    borderRight: 'none',
  },

  toolbarButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: BRAND.uiSlate,
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.15s',
  },

  toolbarButtonHover: {
    backgroundColor: `${BRAND.ancientStone}20`,
  },

  toolbarButtonActive: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  toolbarButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },

  toolbarSelect: {
    height: '32px',
    padding: '0 8px',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    color: BRAND.uiSlate,
    cursor: 'pointer',
    outline: 'none',
  },

  toolbarDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: `${BRAND.ancientStone}30`,
    margin: '4px 8px',
  },

  editorWrapper: {
    position: 'relative' as const,
    flex: 1,
  },

  editor: {
    padding: '16px',
    outline: 'none',
    fontSize: '15px',
    lineHeight: 1.6,
    color: BRAND.uiSlate,
    overflowY: 'auto' as const,
  },

  editorPlaceholder: {
    position: 'absolute' as const,
    top: '16px',
    left: '16px',
    color: BRAND.ancientStone,
    pointerEvents: 'none' as const,
    opacity: 0.6,
  },

  editorDisabled: {
    backgroundColor: BRAND.softSand,
    cursor: 'not-allowed',
  },

  mentionPopup: {
    position: 'absolute' as const,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${BRAND.ancientStone}20`,
    maxHeight: '200px',
    overflowY: 'auto' as const,
    zIndex: 1000,
    minWidth: '200px',
  },

  mentionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  },

  mentionItemHighlighted: {
    backgroundColor: `${BRAND.cenoteTurquoise}15`,
  },

  mentionAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  mentionName: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
  },

  mentionType: {
    fontSize: '11px',
    color: BRAND.ancientStone,
    marginLeft: 'auto',
  },

  emojiPicker: {
    position: 'absolute' as const,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${BRAND.ancientStone}20`,
    padding: '8px',
    zIndex: 1000,
    width: '280px',
  },

  emojiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    gap: '4px',
  },

  emojiButton: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '16px',
    transition: 'background-color 0.1s',
  },

  emojiButtonHover: {
    backgroundColor: BRAND.softSand,
  },

  colorPicker: {
    position: 'absolute' as const,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${BRAND.ancientStone}20`,
    padding: '8px',
    zIndex: 1000,
  },

  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '4px',
  },

  colorSwatch: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: `1px solid ${BRAND.ancientStone}20`,
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },

  colorSwatchHover: {
    transform: 'scale(1.1)',
  },

  linkDialog: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '24px',
    zIndex: 10000,
    width: '400px',
    maxWidth: '90vw',
  },

  linkDialogOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },

  linkDialogTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '16px',
  },

  linkDialogInput: {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '12px',
  },

  linkDialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
  },

  linkDialogButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  },

  linkDialogButtonPrimary: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  linkDialogButtonSecondary: {
    backgroundColor: 'transparent',
    color: BRAND.uiSlate,
    border: `1px solid ${BRAND.ancientStone}30`,
  },

  characterCount: {
    padding: '8px 16px',
    borderTop: `1px solid ${BRAND.ancientStone}15`,
    fontSize: '12px',
    color: BRAND.ancientStone,
    textAlign: 'right' as const,
  },

  characterCountWarning: {
    color: '#E53E3E',
  },
};

// ============================================================
// TOOLBAR ICONS
// ============================================================

const ToolbarIcons = {
  bold: <strong style={{ fontWeight: 700 }}>B</strong>,
  italic: <em style={{ fontStyle: 'italic' }}>I</em>,
  underline: <span style={{ textDecoration: 'underline' }}>U</span>,
  strikethrough: <span style={{ textDecoration: 'line-through' }}>S</span>,
  code: <span style={{ fontFamily: 'monospace' }}>&lt;/&gt;</span>,
  link: '🔗',
  image: '🖼️',
  alignLeft: '⬅️',
  alignCenter: '↔️',
  alignRight: '➡️',
  alignJustify: '☰',
  listBullet: '•',
  listNumber: '1.',
  listCheck: '☑️',
  quote: '❝',
  undo: '↩️',
  redo: '↪️',
  color: '🎨',
  highlight: '🖍️',
  emoji: '😊',
  clear: '🧹',
  fullscreen: '⛶',
};

// ============================================================
// HELPER COMPONENTS
// ============================================================

interface ToolbarButtonProps {
  icon: ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ToolbarButton({ icon, title, active, disabled, onClick }: ToolbarButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      style={{
        ...styles.toolbarButton,
        ...(isHovered && !disabled && !active && styles.toolbarButtonHover),
        ...(active && styles.toolbarButtonActive),
        ...(disabled && styles.toolbarButtonDisabled),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon}
    </button>
  );
}

// ============================================================
// LINK DIALOG COMPONENT
// ============================================================

interface LinkDialogProps {
  isOpen: boolean;
  defaultUrl?: string;
  defaultText?: string;
  onClose: () => void;
  onSubmit: (url: string, text: string) => void;
}

function LinkDialog({ isOpen, defaultUrl = '', defaultText = '', onClose, onSubmit }: LinkDialogProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    setUrl(defaultUrl);
    setText(defaultText);
  }, [defaultUrl, defaultText, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.linkDialogOverlay} onClick={onClose} />
      <div style={styles.linkDialog}>
        <div style={styles.linkDialogTitle}>Insert Link</div>
        <input
          type="text"
          placeholder="Link text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.linkDialogInput}
          autoFocus
        />
        <input
          type="url"
          placeholder="URL (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.linkDialogInput}
        />
        <div style={styles.linkDialogActions}>
          <button
            type="button"
            style={{ ...styles.linkDialogButton, ...styles.linkDialogButtonSecondary }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{ ...styles.linkDialogButton, ...styles.linkDialogButtonPrimary }}
            onClick={() => {
              onSubmit(url, text);
              onClose();
            }}
            disabled={!url}
          >
            Insert
          </button>
        </div>
      </div>
    </>
  );
}

// ============================================================
// EMOJI PICKER COMPONENT
// ============================================================

interface EmojiPickerProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

function EmojiPicker({ isOpen, position, onSelect, onClose }: EmojiPickerProps) {
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref} style={{ ...styles.emojiPicker, top: position.top, left: position.left }}>
      <div style={styles.emojiGrid}>
        {EMOJI_LIST.map((emoji) => (
          <button
            key={emoji}
            type="button"
            style={{
              ...styles.emojiButton,
              ...(hoveredEmoji === emoji && styles.emojiButtonHover),
            }}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            onMouseEnter={() => setHoveredEmoji(emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COLOR PICKER COMPONENT
// ============================================================

interface ColorPickerProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onSelect: (color: string) => void;
  onClose: () => void;
}

function ColorPicker({ isOpen, position, onSelect, onClose }: ColorPickerProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref} style={{ ...styles.colorPicker, top: position.top, left: position.left }}>
      <div style={styles.colorGrid}>
        {TEXT_COLORS.map((color) => (
          <div
            key={color}
            style={{
              ...styles.colorSwatch,
              backgroundColor: color,
              ...(hoveredColor === color && styles.colorSwatchHover),
            }}
            onClick={() => {
              onSelect(color);
              onClose();
            }}
            onMouseEnter={() => setHoveredColor(color)}
            onMouseLeave={() => setHoveredColor(null)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MENTION POPUP COMPONENT
// ============================================================

interface MentionPopupProps {
  isOpen: boolean;
  position: { top: number; left: number };
  items: MentionItem[];
  highlightedIndex: number;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
}

function MentionPopup({ isOpen, position, items, highlightedIndex, onSelect, onClose }: MentionPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || items.length === 0) return null;

  return (
    <div ref={ref} style={{ ...styles.mentionPopup, top: position.top, left: position.left }}>
      {items.map((item, index) => (
        <div
          key={item.id}
          style={{
            ...styles.mentionItem,
            ...(index === highlightedIndex && styles.mentionItemHighlighted),
          }}
          onClick={() => onSelect(item)}
        >
          <div style={styles.mentionAvatar}>
            {item.avatar ? (
              <img src={item.avatar} alt={item.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              item.name.charAt(0).toUpperCase()
            )}
          </div>
          <span style={styles.mentionName}>{item.name}</span>
          {item.type && <span style={styles.mentionType}>{item.type}</span>}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN EDITOR COMPONENT
// ============================================================

export const RichTextEditor = forwardRef<EditorRef, RichTextEditorProps>(function RichTextEditor(
  {
    value,
    defaultValue = '',
    mode = 'wysiwyg',
    placeholder = 'Start typing...',
    disabled = false,
    readOnly = false,
    autoFocus = false,
    minHeight = 150,
    maxHeight = 400,
    showToolbar = true,
    toolbarPosition = 'top',
    mentionTrigger = '@',
    mentions = [],
    allowEmbeds = true,
    allowMentions = true,
    allowEmoji = true,
    allowMarkdown = false,
    maxLength,
    onChange,
    onFocus,
    onBlur,
    onMention,
    onEmbed,
    onSelectionChange,
    customCommands = [],
    className,
    toolbarClassName,
    editorClassName,
  },
  ref
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!defaultValue);
  const [format, setFormat] = useState<EditorFormat>({});
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<'text' | 'bg' | null>(null);
  const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0 });
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [mentionIndex, setMentionIndex] = useState(0);
  const [selectedText, setSelectedText] = useState('');

  // Filter mentions based on query
  const filteredMentions = useMemo(() => {
    if (!mentionQuery) return [];
    const query = mentionQuery.toLowerCase();
    return mentions.filter((m) => m.name.toLowerCase().includes(query)).slice(0, 8);
  }, [mentions, mentionQuery]);

  // Execute document command
  const execCommand = useCallback((command: string, value?: unknown) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateFormat();
  }, []);

  // Update current format state
  const updateFormat = useCallback(() => {
    setFormat({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikethrough'),
    });
  }, []);

  // Handle content change
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML;
    const text = editorRef.current.textContent || '';
    
    setContent(html);
    setIsEmpty(!text.trim());
    onChange?.(text, html);

    // Check for mention trigger
    if (allowMentions) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || '';
        const mentionMatch = textBeforeCursor.match(new RegExp(`${mentionTrigger}(\\w*)$`));

        if (mentionMatch) {
          const query = mentionMatch[1];
          setMentionQuery(query);
          onMention?.(query);

          // Calculate position
          const rect = range.getBoundingClientRect();
          setMentionPosition({ top: rect.bottom + 4, left: rect.left });
          setMentionIndex(0);
        } else {
          setMentionQuery(null);
        }
      }
    }
  }, [allowMentions, mentionTrigger, onChange, onMention]);

  // Handle selection change
  const handleSelectionChange = useCallback(() => {
    updateFormat();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString();
      setSelectedText(text);

      if (text) {
        const range = selection.getRangeAt(0);
        onSelectionChange?.({
          start: range.startOffset,
          end: range.endOffset,
          text,
        });
      } else {
        onSelectionChange?.(null);
      }
    }
  }, [updateFormat, onSelectionChange]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Handle mention navigation
    if (mentionQuery !== null && filteredMentions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex((prev) => (prev + 1) % filteredMentions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex((prev) => (prev - 1 + filteredMentions.length) % filteredMentions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredMentions[mentionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setMentionQuery(null);
        return;
      }
    }

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          setShowLinkDialog(true);
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            execCommand('redo');
          } else {
            e.preventDefault();
            execCommand('undo');
          }
          break;
      }
    }
  }, [mentionQuery, filteredMentions, mentionIndex, execCommand]);

  // Insert mention
  const insertMention = useCallback((item: MentionItem) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    const text = textNode.textContent || '';
    const offset = range.startOffset;

    // Find the mention trigger position
    const triggerIndex = text.lastIndexOf(mentionTrigger, offset);
    if (triggerIndex === -1) return;

    // Create mention element
    const mentionSpan = document.createElement('span');
    mentionSpan.className = 'mention';
    mentionSpan.style.backgroundColor = `${BRAND.cenoteTurquoise}20`;
    mentionSpan.style.color = BRAND.shadowMoss;
    mentionSpan.style.padding = '2px 4px';
    mentionSpan.style.borderRadius = '4px';
    mentionSpan.style.fontWeight = '500';
    mentionSpan.contentEditable = 'false';
    mentionSpan.dataset.mentionId = item.id;
    mentionSpan.textContent = `${mentionTrigger}${item.name}`;

    // Replace the trigger + query with the mention span
    const beforeText = text.slice(0, triggerIndex);
    const afterText = text.slice(offset);

    textNode.textContent = beforeText;
    
    const afterTextNode = document.createTextNode(afterText + ' ');
    textNode.parentNode?.insertBefore(mentionSpan, textNode.nextSibling);
    textNode.parentNode?.insertBefore(afterTextNode, mentionSpan.nextSibling);

    // Move cursor after mention
    const newRange = document.createRange();
    newRange.setStartAfter(afterTextNode);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    setMentionQuery(null);
    handleInput();
  }, [mentionTrigger, handleInput]);

  // Insert emoji
  const insertEmoji = useCallback((emoji: string) => {
    execCommand('insertText', emoji);
  }, [execCommand]);

  // Insert link
  const insertLink = useCallback((url: string, text: string) => {
    if (text) {
      execCommand('insertHTML', `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
    } else {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  // Handle paste
  const handlePaste = useCallback((e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    execCommand('insertText', text);
  }, [execCommand]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus(),
    blur: () => editorRef.current?.blur(),
    getHTML: () => editorRef.current?.innerHTML || '',
    getText: () => editorRef.current?.textContent || '',
    setContent: (content: string) => {
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        handleInput();
      }
    },
    insertText: (text: string) => execCommand('insertText', text),
    insertEmbed: (embed: EmbedItem) => {
      // Handle embed insertion based on type
      if (embed.type === 'image' && embed.url) {
        execCommand('insertHTML', `<img src="${embed.url}" alt="${embed.title || ''}" style="max-width: 100%;" />`);
      }
    },
    execCommand,
    getSelection: () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return {
          start: range.startOffset,
          end: range.endOffset,
          text: selection.toString(),
        };
      }
      return null;
    },
  }), [execCommand, handleInput]);

  // Set initial content
  useEffect(() => {
    if (editorRef.current && value !== undefined && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
      setIsEmpty(!value.trim());
    }
  }, [value]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  // Selection change listener
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  // Character count
  const characterCount = editorRef.current?.textContent?.length || 0;
  const isOverLimit = maxLength !== undefined && characterCount > maxLength;

  // Render toolbar
  const renderToolbar = () => (
    <div
      style={{
        ...styles.toolbar,
        ...(toolbarPosition === 'bottom' && styles.toolbarBottom),
        ...(toolbarPosition === 'floating' && isFocused && styles.toolbarFloating),
      }}
      className={toolbarClassName}
    >
      {/* History */}
      <div style={styles.toolbarGroup}>
        <ToolbarButton icon={ToolbarIcons.undo} title="Undo (Ctrl+Z)" onClick={() => execCommand('undo')} />
        <ToolbarButton icon={ToolbarIcons.redo} title="Redo (Ctrl+Shift+Z)" onClick={() => execCommand('redo')} />
      </div>

      {/* Text formatting */}
      <div style={styles.toolbarGroup}>
        <ToolbarButton
          icon={ToolbarIcons.bold}
          title="Bold (Ctrl+B)"
          active={format.bold}
          onClick={() => execCommand('bold')}
        />
        <ToolbarButton
          icon={ToolbarIcons.italic}
          title="Italic (Ctrl+I)"
          active={format.italic}
          onClick={() => execCommand('italic')}
        />
        <ToolbarButton
          icon={ToolbarIcons.underline}
          title="Underline (Ctrl+U)"
          active={format.underline}
          onClick={() => execCommand('underline')}
        />
        <ToolbarButton
          icon={ToolbarIcons.strikethrough}
          title="Strikethrough"
          active={format.strikethrough}
          onClick={() => execCommand('strikethrough')}
        />
      </div>

      {/* Font size */}
      <div style={styles.toolbarGroup}>
        <select
          style={styles.toolbarSelect}
          onChange={(e) => execCommand('fontSize', e.target.value)}
          defaultValue="3"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((size) => (
            <option key={size} value={size}>
              {['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'][size - 1]}
            </option>
          ))}
        </select>
      </div>

      {/* Colors */}
      <div style={styles.toolbarGroup}>
        <ToolbarButton
          icon={ToolbarIcons.color}
          title="Text Color"
          onClick={(e) => {
            const rect = (e as any).currentTarget.getBoundingClientRect();
            setColorPickerPosition({ top: rect.bottom + 4, left: rect.left });
            setShowColorPicker('text');
          }}
        />
        <ToolbarButton
          icon={ToolbarIcons.highlight}
          title="Background Color"
          onClick={(e) => {
            const rect = (e as any).currentTarget.getBoundingClientRect();
            setColorPickerPosition({ top: rect.bottom + 4, left: rect.left });
            setShowColorPicker('bg');
          }}
        />
      </div>

      {/* Alignment */}
      <div style={styles.toolbarGroup}>
        <ToolbarButton
          icon={ToolbarIcons.alignLeft}
          title="Align Left"
          onClick={() => execCommand('justifyLeft')}
        />
        <ToolbarButton
          icon={ToolbarIcons.alignCenter}
          title="Align Center"
          onClick={() => execCommand('justifyCenter')}
        />
        <ToolbarButton
          icon={ToolbarIcons.alignRight}
          title="Align Right"
          onClick={() => execCommand('justifyRight')}
        />
      </div>

      {/* Lists */}
      <div style={styles.toolbarGroup}>
        <ToolbarButton
          icon={ToolbarIcons.listBullet}
          title="Bullet List"
          onClick={() => execCommand('insertUnorderedList')}
        />
        <ToolbarButton
          icon={ToolbarIcons.listNumber}
          title="Numbered List"
          onClick={() => execCommand('insertOrderedList')}
        />
      </div>

      {/* Insert */}
      <div style={{ ...styles.toolbarGroup, ...styles.toolbarGroupLast }}>
        <ToolbarButton
          icon={ToolbarIcons.link}
          title="Insert Link (Ctrl+K)"
          onClick={() => setShowLinkDialog(true)}
        />
        {allowEmoji && (
          <ToolbarButton
            icon={ToolbarIcons.emoji}
            title="Insert Emoji"
            onClick={(e) => {
              const rect = (e as any).currentTarget.getBoundingClientRect();
              setEmojiPickerPosition({ top: rect.bottom + 4, left: rect.left });
              setShowEmojiPicker(true);
            }}
          />
        )}
        <ToolbarButton
          icon={ToolbarIcons.clear}
          title="Clear Formatting"
          onClick={() => execCommand('removeFormat')}
        />
      </div>

      {/* Custom commands */}
      {customCommands.length > 0 && (
        <div style={{ ...styles.toolbarGroup, ...styles.toolbarGroupLast }}>
          {customCommands.map((cmd) => (
            <ToolbarButton
              key={cmd.id}
              icon={cmd.icon || cmd.label}
              title={cmd.label + (cmd.shortcut ? ` (${cmd.shortcut})` : '')}
              active={cmd.isActive?.()}
              disabled={cmd.isDisabled?.()}
              onClick={cmd.execute}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container} className={className}>
      {showToolbar && toolbarPosition === 'top' && renderToolbar()}

      <div style={styles.editorWrapper}>
        {isEmpty && !isFocused && (
          <div style={styles.editorPlaceholder}>{placeholder}</div>
        )}

        <div
          ref={editorRef}
          contentEditable={!disabled && !readOnly}
          style={{
            ...styles.editor,
            minHeight,
            maxHeight,
            ...(disabled && styles.editorDisabled),
          }}
          className={editorClassName}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={handleFocus}
          onBlur={handleBlur}
          suppressContentEditableWarning
        />

        {/* Mention popup */}
        {allowMentions && (
          <MentionPopup
            isOpen={mentionQuery !== null}
            position={mentionPosition}
            items={filteredMentions}
            highlightedIndex={mentionIndex}
            onSelect={insertMention}
            onClose={() => setMentionQuery(null)}
          />
        )}

        {/* Emoji picker */}
        {allowEmoji && (
          <EmojiPicker
            isOpen={showEmojiPicker}
            position={emojiPickerPosition}
            onSelect={insertEmoji}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}

        {/* Color picker */}
        <ColorPicker
          isOpen={showColorPicker !== null}
          position={colorPickerPosition}
          onSelect={(color) => {
            execCommand(showColorPicker === 'text' ? 'foreColor' : 'hiliteColor', color);
            setShowColorPicker(null);
          }}
          onClose={() => setShowColorPicker(null)}
        />
      </div>

      {showToolbar && toolbarPosition === 'bottom' && renderToolbar()}

      {/* Character count */}
      {maxLength !== undefined && (
        <div style={{ ...styles.characterCount, ...(isOverLimit && styles.characterCountWarning) }}>
          {characterCount} / {maxLength}
        </div>
      )}

      {/* Link dialog */}
      <LinkDialog
        isOpen={showLinkDialog}
        defaultText={selectedText}
        onClose={() => setShowLinkDialog(false)}
        onSubmit={insertLink}
      />
    </div>
  );
});

// ============================================================
// EXPORTS
// ============================================================

export type {
  EditorMode,
  TextAlign,
  ListType,
  HeadingLevel,
  EditorFormat,
  EditorSelection,
  MentionItem,
  EmbedItem,
  EditorCommand,
  RichTextEditorProps,
  EditorRef,
};

export default RichTextEditor;
