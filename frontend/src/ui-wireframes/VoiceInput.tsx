// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — VOICE INPUT (PUSH-TO-TALK)
// Canonical Implementation of UI Wireframe
// 
// RULES:
// - Hold to Speak (Push-to-talk only)
// - After release: Transcription preview
// - User confirms / edits
// - Message created ONLY after confirmation
// 
// NEVER:
// - Auto-send
// - Continuous listening
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useCallback, useEffect } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface VoiceInputProps {
  onTranscriptionComplete: (transcription: string, audioBlob: Blob) => void;
  onConfirm: (finalText: string) => void;
  onCancel: () => void;
  disabled?: boolean;
  maxDuration?: number;
}

type VoiceState = 'idle' | 'recording' | 'transcribing' | 'preview';

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
  },
  
  // Recording button
  recordButton: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    transition: 'all 200ms ease',
    userSelect: 'none' as const,
  },
  
  idleButton: {
    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
  },
  
  recordingButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    boxShadow: '0 0 0 8px rgba(239, 68, 68, 0.2)',
    transform: 'scale(1.1)',
  },
  
  disabledButton: {
    background: '#e8e8e8',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  
  // Status text
  statusText: {
    fontSize: '0.875rem',
    color: '#737373',
    textAlign: 'center' as const,
  },
  
  recordingStatus: {
    color: '#ef4444',
    fontWeight: 500,
  },
  
  // Duration
  duration: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#ef4444',
    fontFamily: 'monospace',
  },
  
  // Preview container
  previewContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: '1rem',
    background: '#fafafa',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
  },
  
  previewLabel: {
    fontSize: '0.75rem',
    color: '#737373',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '0.5rem',
  },
  
  previewText: {
    width: '100%',
    minHeight: '100px',
    padding: '0.75rem',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    lineHeight: 1.5,
  },
  
  // Actions
  previewActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  
  confirmButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  
  cancelButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: 'white',
    color: '#525252',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  
  // Waveform animation
  waveform: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    height: '24px',
  },
  
  waveBar: {
    width: '4px',
    background: '#ef4444',
    borderRadius: '2px',
    animation: 'waveAnimation 0.5s ease-in-out infinite',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscriptionComplete,
  onConfirm,
  onCancel,
  disabled = false,
  maxDuration = 120,
}) => {
  const [state, setState] = useState<VoiceState>('idle');
  const [duration, setDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [editedText, setEditedText] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = useCallback(async () => {
    if (disabled || state !== 'idle') return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setState('recording');
      setDuration(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setDuration(d => {
          if (d >= maxDuration) {
            stopRecording();
            return d;
          }
          return d + 1;
        });
      }, 1000);
      
    } catch (error) {
      logger.error('Error starting recording:', error);
    }
  }, [disabled, state, maxDuration]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || state !== 'recording') return;
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioBlobRef.current = audioBlob;
      
      // Stop all tracks
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
      
      // Move to transcribing state
      setState('transcribing');
      
      // Simulate transcription (in real app, send to API)
      setTimeout(() => {
        // Mock transcription - in real implementation, this would be from API
        const mockTranscription = "This is a transcription preview. In the real implementation, this would be the actual transcribed text from the voice recording.";
        setTranscription(mockTranscription);
        setEditedText(mockTranscription);
        setState('preview');
        onTranscriptionComplete(mockTranscription, audioBlob);
      }, 1500);
    };
    
    mediaRecorderRef.current.stop();
  }, [state, onTranscriptionComplete]);

  // Handle confirm
  const handleConfirm = () => {
    if (editedText.trim()) {
      onConfirm(editedText.trim());
      resetState();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    onCancel();
    resetState();
  };

  // Reset state
  const resetState = () => {
    setState('idle');
    setDuration(0);
    setTranscription('');
    setEditedText('');
    audioBlobRef.current = null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Render based on state
  return (
    <div style={styles.container}>
      {/* IDLE & RECORDING STATE */}
      {(state === 'idle' || state === 'recording') && (
        <>
          {/* Record Button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={state === 'recording' ? stopRecording : undefined}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={disabled}
            style={{
              ...styles.recordButton,
              ...(disabled
                ? styles.disabledButton
                : state === 'recording'
                  ? styles.recordingButton
                  : styles.idleButton),
            }}
          >
            {state === 'recording' ? '⏹️' : '🎙️'}
          </button>
          
          {/* Duration (when recording) */}
          {state === 'recording' && (
            <span style={styles.duration}>{formatDuration(duration)}</span>
          )}
          
          {/* Waveform animation (when recording) */}
          {state === 'recording' && (
            <div style={styles.waveform}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.waveBar,
                    height: `${10 + Math.random() * 14}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Status Text */}
          <span style={{
            ...styles.statusText,
            ...(state === 'recording' ? styles.recordingStatus : {}),
          }}>
            {state === 'recording'
              ? 'Release to stop recording'
              : '🎙️ Hold to Speak'}
          </span>
        </>
      )}

      {/* TRANSCRIBING STATE */}
      {state === 'transcribing' && (
        <>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e8e8e8',
            borderTop: '3px solid #0066cc',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <span style={styles.statusText}>Transcribing...</span>
        </>
      )}

      {/* PREVIEW STATE */}
      {state === 'preview' && (
        <div style={styles.previewContainer}>
          <div style={styles.previewLabel}>Transcription Preview</div>
          
          {/* Editable transcription */}
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            style={styles.previewText}
          />
          
          {/* Actions */}
          <div style={styles.previewActions}>
            <button onClick={handleCancel} style={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleConfirm} style={styles.confirmButton}>
              <span>✓</span>
              <span>Confirm & Send</span>
            </button>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes waveAnimation {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.5); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// SIMPLE VOICE BUTTON (for embedding in other components)
// =============================================================================

interface VoiceButtonProps {
  onPress: () => void;
  onRelease: () => void;
  isRecording: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onPress,
  onRelease,
  isRecording,
  disabled = false,
  size = 'medium',
}) => {
  const sizes = {
    small: 40,
    medium: 56,
    large: 80,
  };
  
  const buttonSize = sizes[size];
  
  return (
    <button
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={isRecording ? onRelease : undefined}
      onTouchStart={onPress}
      onTouchEnd={onRelease}
      disabled={disabled}
      style={{
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        borderRadius: '50%',
        border: 'none',
        background: disabled
          ? '#e8e8e8'
          : isRecording
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
        color: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size === 'small' ? '1rem' : size === 'medium' ? '1.25rem' : '1.5rem',
        boxShadow: isRecording
          ? '0 0 0 4px rgba(239, 68, 68, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
        transform: isRecording ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 200ms ease',
      }}
    >
      {isRecording ? '⏹️' : '🎙️'}
    </button>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default VoiceInput;
