/**
 * CHE·NU™ - Mobile Quick Capture
 */
import React, { useState, useRef, useEffect } from 'react';

interface MobileQuickCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export const MobileQuickCapture: React.FC<MobileQuickCaptureProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-quick-capture" data-component="quick-capture-input">
      <div className="header">
        <h3>Quick Capture</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 500))}
        placeholder="Capture your thought..."
        maxLength={500}
        rows={6}
      />

      <div className="footer">
        <span className="char-count">{content.length} / 500</span>
        <button 
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="submit-btn"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
