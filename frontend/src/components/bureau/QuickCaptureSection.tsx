/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — QUICK CAPTURE SECTION                                 ║
 * ║              Bureau Section L2-1: ⚡ Capture Rapide                          ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  RÈGLES:                                                                     ║
 * ║  - Notes légères (500 caractères max)                                        ║
 * ║  - Maximum 5 captures visibles                                               ║
 * ║  - Voice-to-text, image capture                                              ║
 * ║  - Promotion vers Threads ou DataFiles si besoin                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
import { CHENU_COLORS } from '../../types';
import { BureauSectionId, BUREAU_SECTIONS } from '../../types/bureau.types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface QuickCapture {
  id: string;
  content: string;
  createdAt: Date;
  type: 'text' | 'voice' | 'image';
  sphereId: string;
  promoted?: boolean;
  promotedTo?: 'thread' | 'datafile';
}

interface QuickCaptureSectionProps {
  sphereId: string;
  onPromoteToThread?: (capture: QuickCapture) => void;
  onPromoteToDataFile?: (capture: QuickCapture) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const MAX_CHARS = 500;
const MAX_VISIBLE_CAPTURES = 5;
const SECTION_CONFIG = BUREAU_SECTIONS.quickcapture;

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  badge: {
    padding: '4px 10px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    borderRadius: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.sacredGold,
  },
  inputArea: {
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    padding: '16px',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    backgroundColor: 'transparent',
    border: 'none',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    resize: 'none' as const,
    outline: 'none',
    fontFamily: 'inherit',
  },
  inputFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  charCount: (isNearLimit: boolean, isOverLimit: boolean) => ({
    fontSize: '12px',
    color: isOverLimit 
      ? '#ef4444' 
      : isNearLimit 
        ? CHENU_COLORS.sacredGold 
        : CHENU_COLORS.ancientStone,
  }),
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  iconBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.15s ease',
  },
  captureBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  capturesList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    overflowY: 'auto' as const,
  },
  captureCard: {
    backgroundColor: '#111113',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    padding: '14px',
  },
  captureHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  captureType: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  captureContent: {
    fontSize: '14px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.5,
  },
  captureActions: {
    display: 'flex',
    gap: '6px',
    marginTop: '10px',
  },
  promoteBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '11px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: CHENU_COLORS.ancientStone,
    gap: '12px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const QuickCaptureSection: React.FC<QuickCaptureSectionProps> = ({
  sphereId,
  onPromoteToThread,
  onPromoteToDataFile,
}) => {
  // Local state (would connect to store in production)
  const [inputValue, setInputValue] = useState('');
  const [captures, setCaptures] = useState<QuickCapture[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const charCount = inputValue.length;
  const isNearLimit = charCount > MAX_CHARS * 0.8;
  const isOverLimit = charCount > MAX_CHARS;

  // Handlers
  const handleCapture = useCallback(() => {
    if (inputValue.trim() && !isOverLimit) {
      const newCapture: QuickCapture = {
        id: `capture-${Date.now()}`,
        content: inputValue.trim(),
        createdAt: new Date(),
        type: 'text',
        sphereId,
      };
      setCaptures(prev => [newCapture, ...prev].slice(0, MAX_VISIBLE_CAPTURES));
      setInputValue('');
    }
  }, [inputValue, isOverLimit, sphereId]);

  const handleVoiceCapture = useCallback(() => {
    setIsRecording(!isRecording);
    // TODO: Implement voice capture
  }, [isRecording]);

  const handlePromote = useCallback((capture: QuickCapture, target: 'thread' | 'datafile') => {
    if (target === 'thread' && onPromoteToThread) {
      onPromoteToThread(capture);
    } else if (target === 'datafile' && onPromoteToDataFile) {
      onPromoteToDataFile(capture);
    }
    setCaptures(prev => prev.filter(c => c.id !== capture.id));
  }, [onPromoteToThread, onPromoteToDataFile]);

  const handleDelete = useCallback((captureId: string) => {
    setCaptures(prev => prev.filter(c => c.id !== captureId));
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>{SECTION_CONFIG.icon}</span>
          <span>{SECTION_CONFIG.nameFr}</span>
        </div>
        <span style={styles.badge}>
          {captures.length}/{MAX_VISIBLE_CAPTURES} captures
        </span>
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <textarea
          style={styles.textarea}
          placeholder="Capturez une idée rapidement..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) {
              handleCapture();
            }
          }}
        />
        <div style={styles.inputFooter}>
          <span style={styles.charCount(isNearLimit, isOverLimit)}>
            {charCount}/{MAX_CHARS}
          </span>
          <div style={styles.actionButtons}>
            <motion.button
              style={{
                ...styles.iconBtn,
                backgroundColor: isRecording ? '#ef4444' : styles.iconBtn.backgroundColor,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceCapture}
              title="Capture vocale"
            >
              🎤
            </motion.button>
            <motion.button
              style={styles.iconBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Capture image"
            >
              📷
            </motion.button>
            <motion.button
              style={{
                ...styles.captureBtn,
                opacity: isOverLimit || !inputValue.trim() ? 0.5 : 1,
              }}
              whileHover={{ scale: isOverLimit ? 1 : 1.02 }}
              whileTap={{ scale: isOverLimit ? 1 : 0.98 }}
              onClick={handleCapture}
              disabled={isOverLimit || !inputValue.trim()}
            >
              ⚡ Capturer
            </motion.button>
          </div>
        </div>
      </div>

      {/* Captures List */}
      <div style={styles.capturesList}>
        <AnimatePresence>
          {captures.length > 0 ? (
            captures.map((capture) => (
              <motion.div
                key={capture.id}
                style={styles.captureCard}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={styles.captureHeader}>
                  <span style={styles.captureType}>
                    {capture.type === 'text' && '📝'}
                    {capture.type === 'voice' && '🎤'}
                    {capture.type === 'image' && '📷'}
                    <span>{formatTime(capture.createdAt)}</span>
                  </span>
                  <motion.button
                    style={{ ...styles.iconBtn, width: '28px', height: '28px', fontSize: '12px' }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(capture.id)}
                    title="Supprimer"
                  >
                    ✕
                  </motion.button>
                </div>
                <p style={styles.captureContent}>{capture.content}</p>
                <div style={styles.captureActions}>
                  <motion.button
                    style={styles.promoteBtn}
                    whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                    onClick={() => handlePromote(capture, 'thread')}
                  >
                    💬 → Thread
                  </motion.button>
                  <motion.button
                    style={styles.promoteBtn}
                    whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                    onClick={() => handlePromote(capture, 'datafile')}
                  >
                    📁 → Fichier
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <span style={{ fontSize: '32px' }}>⚡</span>
              <p>Aucune capture récente</p>
              <p style={{ fontSize: '12px' }}>
                Utilisez ⌘+Enter pour capturer rapidement
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickCaptureSection;
