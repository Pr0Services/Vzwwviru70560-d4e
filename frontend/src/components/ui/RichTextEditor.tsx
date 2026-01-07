// CHE·NU™ Rich Text Editor Component
// Full-featured text editor for notes and content

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type TextStyle = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';
type TextAlign = 'left' | 'center' | 'right' | 'justify';
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type ListType = 'bullet' | 'numbered' | 'checklist';
type BlockType = 'paragraph' | 'heading' | 'blockquote' | 'code' | 'divider';

interface EditorState {
  content: string;
  selection: Selection | null;
  history: string[];
  historyIndex: number;
  activeStyles: Set<TextStyle>;
  activeAlign: TextAlign;
  activeHeading: HeadingLevel | null;
}

interface ToolbarItem {
  id: string;
  icon: string;
  label: string;
  action: () => void;
  active?: boolean;
  disabled?: boolean;
  type?: 'button' | 'dropdown' | 'separator';
  options?: Array<{ label: string; value: unknown }>;
}

interface RichTextEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  autoFocus?: boolean;
  toolbarPosition?: 'top' | 'bottom' | 'floating';
  toolbarItems?: string[];
  className?: string;
  style?: React.CSSProperties;
}

interface RichTextEditorRef {
  getHTML: () => string;
  getText: () => string;
  setHTML: (html: string) => void;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  insertText: (text: string) => void;
  insertHTML: (html: string) => void;
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
// ICONS
// ============================================================

const Icons = {
  bold: '𝐁',
  italic: '𝐼',
  underline: 'U̲',
  strikethrough: 'S̶',
  code: '</>',
  link: '🔗',
  image: '🖼',
  alignLeft: '⫷',
  alignCenter: '☰',
  alignRight: '⫸',
  alignJustify: '☷',
  listBullet: '•',
  listNumbered: '1.',
  listCheck: '☑',
  heading: 'H',
  quote: '"',
  codeBlock: '{ }',
  divider: '—',
  undo: '↶',
  redo: '↷',
  clear: '✕',
  fullscreen: '⛶',
  table: '▦',
  emoji: '😀',
};

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    border: `1px solid ${BRAND.ancientStone}44`,
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
  },

  toolbar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    padding: '8px 12px',
    borderBottom: `1px solid ${BRAND.ancientStone}33`,
    backgroundColor: BRAND.softSand,
    gap: '4px',
  },

  toolbarGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
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
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  toolbarButtonActive: {
    backgroundColor: BRAND.jungleEmerald,
    color: '#fff',
  },

  toolbarButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },

  toolbarSeparator: {
    width: '1px',
    height: '24px',
    backgroundColor: BRAND.ancientStone + '44',
    margin: '0 8px',
  },

  toolbarDropdown: {
    padding: '6px 10px',
    border: `1px solid ${BRAND.ancientStone}44`,
    borderRadius: '4px',
    backgroundColor: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    minWidth: '80px',
  },

  editor: {
    flex: 1,
    padding: '16px',
    outline: 'none',
    fontSize: '15px',
    lineHeight: 1.6,
    color: BRAND.uiSlate,
    overflowY: 'auto' as const,
  },

  editorPlaceholder: {
    color: BRAND.ancientStone,
    pointerEvents: 'none' as const,
    position: 'absolute' as const,
    userSelect: 'none' as const,
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderTop: `1px solid ${BRAND.ancientStone}33`,
    backgroundColor: BRAND.softSand,
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  linkDialog: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '300px',
  },

  linkDialogBackdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },

  input: {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${BRAND.ancientStone}44`,
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '12px',
    boxSizing: 'border-box' as const,
  },

  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  buttonPrimary: {
    backgroundColor: BRAND.jungleEmerald,
    color: '#fff',
  },

  buttonSecondary: {
    backgroundColor: BRAND.ancientStone + '33',
    color: BRAND.uiSlate,
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function execCommand(command: string, value?: string): boolean {
  try {
    return document.execCommand(command, false, value);
  } catch (e) {
    logger.error('execCommand error:', e);
    return false;
  }
}

function getSelection(): Selection | null {
  return window.getSelection();
}

function saveSelection(): Range | null {
  const selection = getSelection();
  if (selection && selection.rangeCount > 0) {
    return selection.getRangeAt(0).cloneRange();
  }
  return null;
}

function restoreSelection(range: Range | null): void {
  if (range) {
    const selection = getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

function getActiveStyles(element: HTMLElement | null): Set<TextStyle> {
  const styles = new Set<TextStyle>();
  
  if (!element) return styles;
  
  const computed = window.getComputedStyle(element);
  
  if (computed.fontWeight === 'bold' || parseInt(computed.fontWeight) >= 700) {
    styles.add('bold');
  }
  if (computed.fontStyle === 'italic') {
    styles.add('italic');
  }
  if (computed.textDecoration.includes('underline')) {
    styles.add('underline');
  }
  if (computed.textDecoration.includes('line-through')) {
    styles.add('strikethrough');
  }
  
  // Check for code
  let current: HTMLElement | null = element;
  while (current) {
    if (current.tagName === 'CODE' || current.tagName === 'PRE') {
      styles.add('code');
      break;
    }
    current = current.parentElement;
  }
  
  return styles;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countCharacters(text: string): number {
  return text.length;
}

// ============================================================
// TOOLBAR BUTTON COMPONENT
// ============================================================

interface ToolbarButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.toolbarButton,
        ...(active ? styles.toolbarButtonActive : {}),
        ...(disabled ? styles.toolbarButtonDisabled : {}),
      }}
      onMouseEnter={(e) => {
        if (!active && !disabled) {
          (e.target as HTMLElement).style.backgroundColor = BRAND.ancientStone + '33';
        }
      }}
      onMouseLeave={(e) => {
        if (!active && !disabled) {
          (e.target as HTMLElement).style.backgroundColor = 'transparent';
        }
      }}
    >
      {icon}
    </button>
  );
};

// ============================================================
// LINK DIALOG COMPONENT
// ============================================================

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
}

const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = '',
  initialText = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    setUrl(initialUrl);
    setText(initialText);
  }, [initialUrl, initialText]);
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (url) {
      onSubmit(url, text);
      onClose();
    }
  };
  
  return (
    <>
      <div style={styles.linkDialogBackdrop} onClick={onClose} />
      <div style={styles.linkDialog}>
        <h3 style={{ margin: '0 0 16px 0', color: BRAND.uiSlate }}>Insert Link</h3>
        <input
          ref={inputRef}
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Link text (optional)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!url}
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              opacity: url ? 1 : 0.5,
            }}
          >
            Insert
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      value,
      defaultValue = '',
      onChange,
      onBlur,
      onFocus,
      placeholder = 'Start writing...',
      readOnly = false,
      disabled = false,
      minHeight = 200,
      maxHeight = 600,
      autoFocus = false,
      toolbarPosition = 'top',
      toolbarItems,
      className,
      style,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [activeStyles, setActiveStyles] = useState<Set<TextStyle>>(new Set());
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [history, setHistory] = useState<string[]>([defaultValue]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [savedRange, setSavedRange] = useState<Range | null>(null);
    const [selectedText, setSelectedText] = useState('');
    
    // Initialize content
    useEffect(() => {
      if (editorRef.current && (value !== undefined || defaultValue)) {
        editorRef.current.innerHTML = value ?? defaultValue;
        updateState();
      }
    }, []);
    
    // Update when controlled value changes
    useEffect(() => {
      if (value !== undefined && editorRef.current) {
        if (editorRef.current.innerHTML !== value) {
          editorRef.current.innerHTML = value;
          updateState();
        }
      }
    }, [value]);
    
    // Auto focus
    useEffect(() => {
      if (autoFocus && editorRef.current) {
        editorRef.current.focus();
      }
    }, [autoFocus]);
    
    const updateState = useCallback(() => {
      if (!editorRef.current) return;
      
      const text = editorRef.current.innerText || '';
      setIsEmpty(!text.trim());
      setWordCount(countWords(text));
      setCharCount(countCharacters(text));
      
      // Get active styles
      const selection = getSelection();
      if (selection && selection.anchorNode) {
        const element = selection.anchorNode.parentElement;
        setActiveStyles(getActiveStyles(element));
      }
    }, []);
    
    const handleInput = useCallback(() => {
      if (!editorRef.current) return;
      
      updateState();
      
      const html = editorRef.current.innerHTML;
      onChange?.(html);
      
      // Add to history
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(html);
        return newHistory.slice(-50); // Keep last 50 states
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 49));
    }, [onChange, historyIndex, updateState]);
    
    const handleSelectionChange = useCallback(() => {
      updateState();
    }, [updateState]);
    
    useEffect(() => {
      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }, [handleSelectionChange]);
    
    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getHTML: () => editorRef.current?.innerHTML || '',
      getText: () => editorRef.current?.innerText || '',
      setHTML: (html: string) => {
        if (editorRef.current) {
          editorRef.current.innerHTML = html;
          handleInput();
        }
      },
      focus: () => editorRef.current?.focus(),
      blur: () => editorRef.current?.blur(),
      clear: () => {
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
          handleInput();
        }
      },
      undo: () => handleUndo(),
      redo: () => handleRedo(),
      insertText: (text: string) => {
        execCommand('insertText', text);
        handleInput();
      },
      insertHTML: (html: string) => {
        execCommand('insertHTML', html);
        handleInput();
      },
    }));
    
    // Command handlers
    const handleBold = useCallback(() => {
      execCommand('bold');
      handleInput();
    }, [handleInput]);
    
    const handleItalic = useCallback(() => {
      execCommand('italic');
      handleInput();
    }, [handleInput]);
    
    const handleUnderline = useCallback(() => {
      execCommand('underline');
      handleInput();
    }, [handleInput]);
    
    const handleStrikethrough = useCallback(() => {
      execCommand('strikethrough');
      handleInput();
    }, [handleInput]);
    
    const handleCode = useCallback(() => {
      const selection = getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const text = range.toString();
        if (text) {
          execCommand('insertHTML', `<code>${text}</code>`);
          handleInput();
        }
      }
    }, [handleInput]);
    
    const handleLink = useCallback(() => {
      const selection = getSelection();
      if (selection && selection.rangeCount > 0) {
        setSavedRange(saveSelection());
        setSelectedText(selection.toString());
        setLinkDialogOpen(true);
      }
    }, []);
    
    const handleInsertLink = useCallback((url: string, text?: string) => {
      restoreSelection(savedRange);
      const linkText = text || selectedText || url;
      execCommand('insertHTML', `<a href="${url}" target="_blank">${linkText}</a>`);
      handleInput();
    }, [savedRange, selectedText, handleInput]);
    
    const handleAlignLeft = useCallback(() => {
      execCommand('justifyLeft');
      handleInput();
    }, [handleInput]);
    
    const handleAlignCenter = useCallback(() => {
      execCommand('justifyCenter');
      handleInput();
    }, [handleInput]);
    
    const handleAlignRight = useCallback(() => {
      execCommand('justifyRight');
      handleInput();
    }, [handleInput]);
    
    const handleAlignJustify = useCallback(() => {
      execCommand('justifyFull');
      handleInput();
    }, [handleInput]);
    
    const handleBulletList = useCallback(() => {
      execCommand('insertUnorderedList');
      handleInput();
    }, [handleInput]);
    
    const handleNumberedList = useCallback(() => {
      execCommand('insertOrderedList');
      handleInput();
    }, [handleInput]);
    
    const handleHeading = useCallback((level: HeadingLevel) => {
      execCommand('formatBlock', `h${level}`);
      handleInput();
    }, [handleInput]);
    
    const handleQuote = useCallback(() => {
      execCommand('formatBlock', 'blockquote');
      handleInput();
    }, [handleInput]);
    
    const handleCodeBlock = useCallback(() => {
      execCommand('formatBlock', 'pre');
      handleInput();
    }, [handleInput]);
    
    const handleDivider = useCallback(() => {
      execCommand('insertHorizontalRule');
      handleInput();
    }, [handleInput]);
    
    const handleUndo = useCallback(() => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        if (editorRef.current) {
          editorRef.current.innerHTML = history[newIndex];
          onChange?.(history[newIndex]);
          updateState();
        }
      }
    }, [history, historyIndex, onChange, updateState]);
    
    const handleRedo = useCallback(() => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        if (editorRef.current) {
          editorRef.current.innerHTML = history[newIndex];
          onChange?.(history[newIndex]);
          updateState();
        }
      }
    }, [history, historyIndex, onChange, updateState]);
    
    const handleClear = useCallback(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
        handleInput();
      }
    }, [handleInput]);
    
    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleBold();
            break;
          case 'i':
            e.preventDefault();
            handleItalic();
            break;
          case 'u':
            e.preventDefault();
            handleUnderline();
            break;
          case 'k':
            e.preventDefault();
            handleLink();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
        }
      }
    }, [handleBold, handleItalic, handleUnderline, handleLink, handleUndo, handleRedo]);
    
    // Paste handler - strip formatting
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      execCommand('insertText', text);
      handleInput();
    }, [handleInput]);
    
    // Toolbar
    const renderToolbar = () => {
      const toolbarGroups = [
        // History
        [
          { id: 'undo', icon: Icons.undo, label: 'Undo (Ctrl+Z)', action: handleUndo, disabled: historyIndex <= 0 },
          { id: 'redo', icon: Icons.redo, label: 'Redo (Ctrl+Y)', action: handleRedo, disabled: historyIndex >= history.length - 1 },
        ],
        // Text styles
        [
          { id: 'bold', icon: Icons.bold, label: 'Bold (Ctrl+B)', action: handleBold, active: activeStyles.has('bold') },
          { id: 'italic', icon: Icons.italic, label: 'Italic (Ctrl+I)', action: handleItalic, active: activeStyles.has('italic') },
          { id: 'underline', icon: Icons.underline, label: 'Underline (Ctrl+U)', action: handleUnderline, active: activeStyles.has('underline') },
          { id: 'strikethrough', icon: Icons.strikethrough, label: 'Strikethrough', action: handleStrikethrough, active: activeStyles.has('strikethrough') },
          { id: 'code', icon: Icons.code, label: 'Inline Code', action: handleCode, active: activeStyles.has('code') },
        ],
        // Alignment
        [
          { id: 'alignLeft', icon: Icons.alignLeft, label: 'Align Left', action: handleAlignLeft },
          { id: 'alignCenter', icon: Icons.alignCenter, label: 'Align Center', action: handleAlignCenter },
          { id: 'alignRight', icon: Icons.alignRight, label: 'Align Right', action: handleAlignRight },
          { id: 'alignJustify', icon: Icons.alignJustify, label: 'Justify', action: handleAlignJustify },
        ],
        // Lists
        [
          { id: 'listBullet', icon: Icons.listBullet, label: 'Bullet List', action: handleBulletList },
          { id: 'listNumbered', icon: Icons.listNumbered, label: 'Numbered List', action: handleNumberedList },
        ],
        // Blocks
        [
          { id: 'quote', icon: Icons.quote, label: 'Quote', action: handleQuote },
          { id: 'codeBlock', icon: Icons.codeBlock, label: 'Code Block', action: handleCodeBlock },
          { id: 'divider', icon: Icons.divider, label: 'Divider', action: handleDivider },
        ],
        // Insert
        [
          { id: 'link', icon: Icons.link, label: 'Link (Ctrl+K)', action: handleLink },
        ],
        // Clear
        [
          { id: 'clear', icon: Icons.clear, label: 'Clear Formatting', action: handleClear },
        ],
      ];
      
      return (
        <div style={styles.toolbar}>
          {toolbarGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <div style={styles.toolbarGroup}>
                {group.map((item) => (
                  <ToolbarButton
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    onClick={item.action}
                    active={item.active}
                    disabled={item.disabled || disabled || readOnly}
                  />
                ))}
              </div>
              {groupIndex < toolbarGroups.length - 1 && (
                <div style={styles.toolbarSeparator} />
              )}
            </React.Fragment>
          ))}
          
          {/* Heading dropdown */}
          <select
            style={styles.toolbarDropdown}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                handleHeading(parseInt(value) as HeadingLevel);
              } else {
                execCommand('formatBlock', 'p');
                handleInput();
              }
              e.target.value = '';
            }}
            disabled={disabled || readOnly}
          >
            <option value="">Heading</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>
        </div>
      );
    };
    
    return (
      <div
        className={className}
        style={{
          ...styles.container,
          opacity: disabled ? 0.6 : 1,
          ...style,
        }}
      >
        {toolbarPosition === 'top' && renderToolbar()}
        
        <div style={{ position: 'relative', flex: 1 }}>
          {isEmpty && !disabled && (
            <div
              style={{
                ...styles.editorPlaceholder,
                padding: '16px',
                top: 0,
                left: 0,
              }}
            >
              {placeholder}
            </div>
          )}
          
          <div
            ref={editorRef}
            contentEditable={!disabled && !readOnly}
            onInput={handleInput}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            style={{
              ...styles.editor,
              minHeight,
              maxHeight,
              cursor: disabled ? 'not-allowed' : 'text',
            }}
            suppressContentEditableWarning
          />
        </div>
        
        {toolbarPosition === 'bottom' && renderToolbar()}
        
        <div style={styles.footer}>
          <span>{wordCount} words • {charCount} characters</span>
          <span>CHE·NU™ Editor</span>
        </div>
        
        <LinkDialog
          isOpen={linkDialogOpen}
          onClose={() => setLinkDialogOpen(false)}
          onSubmit={handleInsertLink}
          initialText={selectedText}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

// ============================================================
// CSS FOR EDITOR CONTENT
// ============================================================

export const editorStyles = `
  .chenu-editor h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0; }
  .chenu-editor h2 { font-size: 1.5em; font-weight: 700; margin: 0.83em 0; }
  .chenu-editor h3 { font-size: 1.17em; font-weight: 700; margin: 1em 0; }
  .chenu-editor h4 { font-size: 1em; font-weight: 700; margin: 1.33em 0; }
  .chenu-editor h5 { font-size: 0.83em; font-weight: 700; margin: 1.67em 0; }
  .chenu-editor h6 { font-size: 0.67em; font-weight: 700; margin: 2.33em 0; }
  
  .chenu-editor p { margin: 1em 0; }
  
  .chenu-editor blockquote {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 4px solid ${BRAND.sacredGold};
    background-color: ${BRAND.softSand};
    color: ${BRAND.ancientStone};
    font-style: italic;
  }
  
  .chenu-editor pre {
    margin: 1em 0;
    padding: 1em;
    background-color: ${BRAND.uiSlate};
    color: ${BRAND.softSand};
    border-radius: 4px;
    overflow-x: auto;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  .chenu-editor code {
    padding: 0.2em 0.4em;
    background-color: ${BRAND.ancientStone}22;
    border-radius: 3px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  .chenu-editor pre code {
    padding: 0;
    background: none;
  }
  
  .chenu-editor ul, .chenu-editor ol {
    margin: 1em 0;
    padding-left: 2em;
  }
  
  .chenu-editor li { margin: 0.5em 0; }
  
  .chenu-editor a {
    color: ${BRAND.cenoteTurquoise};
    text-decoration: none;
  }
  
  .chenu-editor a:hover {
    text-decoration: underline;
  }
  
  .chenu-editor hr {
    margin: 2em 0;
    border: none;
    border-top: 2px solid ${BRAND.ancientStone}33;
  }
  
  .chenu-editor img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  
  .chenu-editor table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  
  .chenu-editor th, .chenu-editor td {
    border: 1px solid ${BRAND.ancientStone}44;
    padding: 8px 12px;
    text-align: left;
  }
  
  .chenu-editor th {
    background-color: ${BRAND.softSand};
    font-weight: 600;
  }
`;

// ============================================================
// EXPORTS
// ============================================================

export type {
  RichTextEditorProps,
  RichTextEditorRef,
  TextStyle,
  TextAlign,
  HeadingLevel,
  ListType,
  BlockType,
};

export { RichTextEditor };

export default RichTextEditor;
