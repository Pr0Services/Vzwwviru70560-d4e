/**
 * CHE·NU™ — Web Entry Screen
 */

import React, { useEffect, useState } from 'react';

// CHE·NU Colors
const colors = {
  bgPrimary: '#0D1117',
  bgSurface: '#1E1F22',
  sacredGold: '#D8B26A',
  cenoteTurquoise: '#3EB4A2',
  textPrimary: '#E9E4D6',
  textSecondary: '#8D8371',
};

interface EntryScreenProps {
  onEnter?: () => void;
}

export function EntryScreen({ onEnter }: EntryScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleEnter = () => {
    onEnter?.();
  };

  return (
    <div style={{
      ...styles.container,
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 0.6s ease-out',
    }}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <span style={styles.diamond}>◆</span>
        <h1 style={styles.title}>CHE·NU™</h1>
        <p style={styles.tagline}>Governed Intelligence Operating System</p>
      </div>

      {/* Nova Message */}
      <div style={styles.novaContainer}>
        <span style={styles.novaAvatar}>✦</span>
        <div>
          <p style={styles.novaText}>Bonjour! Je suis Nova.</p>
          <p style={styles.novaText}>Prêt à commencer?</p>
        </div>
      </div>

      {/* Enter Button */}
      <button style={styles.enterButton} onClick={handleEnter}>
        Entrer dans mon contexte
      </button>

      {/* Sphere Indicators */}
      <div style={styles.sphereIndicators}>
        {['🏠', '💼', '🏛️', '🎨', '👥', '📱', '🎬', '🤝', '📚'].map((emoji, i) => (
          <span key={i} style={styles.sphereDot}>{emoji}</span>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: colors.bgPrimary,
    padding: 24,
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: 48,
  },
  diamond: {
    fontSize: 80,
    color: colors.sacredGold,
    display: 'block',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    color: colors.sacredGold,
    margin: 0,
    marginBottom: 8,
    letterSpacing: '0.1em',
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    margin: 0,
    letterSpacing: '0.05em',
  },
  novaContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 48,
    gap: 12,
  },
  novaAvatar: {
    fontSize: 24,
    color: colors.cenoteTurquoise,
  },
  novaText: {
    color: colors.textSecondary,
    fontSize: 14,
    margin: 0,
    marginBottom: 4,
  },
  enterButton: {
    backgroundColor: colors.cenoteTurquoise,
    padding: '16px 32px',
    borderRadius: 12,
    border: 'none',
    color: '#000',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 48,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  sphereIndicators: {
    display: 'flex',
    gap: 8,
  },
  sphereDot: {
    fontSize: 20,
    opacity: 0.5,
  },
};

export default EntryScreen;
