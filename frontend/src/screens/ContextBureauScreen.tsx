/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — CONTEXT BUREAU SCREEN                                 ║
 * ║              FLOW-FIRST: État vide → Sélection progressive                   ║
 * ║              "Sur quoi je travaille?"                                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  ENTRY STATE:                                                                ║
 * ║    - Aucune sélection active                                                 ║
 * ║    - Identités disponibles (depuis API/store)                                ║
 * ║    - Sphères verrouillées jusqu'à sélection identité                        ║
 * ║                                                                              ║
 * ║  USER INTENT:                                                                ║
 * ║    - DOIT sélectionner une Identité                                          ║
 * ║    - DOIT sélectionner une Sphère                                            ║
 * ║    - PEUT sélectionner un Projet (optionnel)                                 ║
 * ║                                                                              ║
 * ║  EXIT CONDITIONS:                                                            ║
 * ║    - Identité ✓ + Sphère ✓ → "Aller travailler" actif                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// 9 SPHÈRES OFFICIELLES (structure)
// ═══════════════════════════════════════════════════════════════════════════════

const SPHERES = [
  { id: 'personal', label: 'Personal', icon: '🏠', color: '#D8B26A' },
  { id: 'business', label: 'Business', icon: '💼', color: '#3F7249' },
  { id: 'government', label: 'Government', icon: '🏛️', color: '#9B59B6' },
  { id: 'design_studio', label: 'Studio', icon: '🎨', color: '#E74C3C' },
  { id: 'community', label: 'Community', icon: '👥', color: '#F39C12' },
  { id: 'social', label: 'Social', icon: '📱', color: '#1ABC9C' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#E91E63' },
  { id: 'my_team', label: 'My Team', icon: '🤝', color: '#00BCD4' },
  { id: 'scholars', label: 'Scholars', icon: '📚', color: '#8D6E63' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════════════════════════════════════════

interface ContextBureauScreenProps {
  ctx?: unknown; // Pour compatibilité
  onSelectIdentity?: (id: string) => void;
  onSelectSphere?: (id: string) => void;
  onSelectProject?: (id: string | null) => void;
  onClearProject?: () => void;
  onConfirm: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function ContextBureauScreen({
  onSelectIdentity,
  onSelectSphere,
  onSelectProject,
  onConfirm,
}: ContextBureauScreenProps) {
  
  // Local state
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [sphereId, setSphereId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Flow logic
  const isSphereUnlocked = !!identityId;
  const isProjectUnlocked = !!sphereId;
  const canProceed = !!identityId && !!sphereId;

  // Handlers
  const handleIdentity = (id: string) => {
    setIdentityId(id);
    setSphereId(null);
    setProjectId(null);
    onSelectIdentity?.(id);
  };

  const handleSphere = (id: string) => {
    if (!isSphereUnlocked) return;
    setSphereId(id);
    setProjectId(null);
    onSelectSphere?.(id);
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          <span>📍</span> Context Bureau
        </h1>
        <p style={styles.subtitle}>Sur quoi je travaille?</p>
      </header>

      {/* MAIN - 3 COLONNES PLEINE LARGEUR */}
      <div style={styles.content}>
        
        {/* COLONNE 1: IDENTITÉ */}
        <section style={styles.column}>
          <div style={styles.colHeader}>
            <span style={styles.step}>1</span>
            <h2 style={styles.colTitle}>Identité</h2>
            {identityId && <span style={styles.check}>✓</span>}
          </div>
          
          <div style={styles.options}>
            {/* ÉTAT VIDE - Structure seulement */}
            <div style={styles.empty}>
              <span style={styles.emptyIcon}>👤</span>
              <p>Aucune identité</p>
              <button style={styles.createBtn}>+ Créer</button>
            </div>
          </div>
        </section>

        {/* COLONNE 2: SPHÈRE */}
        <section style={{
          ...styles.column,
          ...(!isSphereUnlocked ? styles.locked : {}),
        }}>
          <div style={styles.colHeader}>
            <span style={styles.step}>2</span>
            <h2 style={styles.colTitle}>Sphère</h2>
            {sphereId && <span style={styles.check}>✓</span>}
            {!isSphereUnlocked && <span style={styles.lock}>🔒</span>}
          </div>
          
          {!isSphereUnlocked ? (
            <div style={styles.lockedMsg}>
              <p>Sélectionnez d'abord une identité</p>
            </div>
          ) : (
            <div style={styles.spheresGrid}>
              {SPHERES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSphere(s.id)}
                  style={{
                    ...styles.sphereBtn,
                    borderColor: sphereId === s.id ? s.color : 'transparent',
                    background: sphereId === s.id ? `${s.color}20` : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <span style={styles.sphereIcon}>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* COLONNE 3: PROJET (optionnel) */}
        <section style={{
          ...styles.column,
          ...(!isProjectUnlocked ? styles.locked : {}),
        }}>
          <div style={styles.colHeader}>
            <span style={styles.step}>3</span>
            <h2 style={styles.colTitle}>Projet</h2>
            <span style={styles.optional}>optionnel</span>
          </div>
          
          {!isProjectUnlocked ? (
            <div style={styles.lockedMsg}>
              <p>Sélectionnez d'abord une sphère</p>
            </div>
          ) : (
            <div style={styles.empty}>
              <span style={styles.emptyIcon}>📁</span>
              <p>Aucun projet</p>
              <button style={styles.createBtn}>+ Créer</button>
            </div>
          )}
        </section>
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.status}>
          <span style={identityId ? styles.done : styles.pending}>
            {identityId ? '✓' : '○'} Identité
          </span>
          <span style={styles.arrow}>→</span>
          <span style={sphereId ? styles.done : styles.pending}>
            {sphereId ? '✓' : '○'} Sphère
          </span>
        </div>
        
        <button
          onClick={onConfirm}
          disabled={!canProceed}
          style={{
            ...styles.confirmBtn,
            ...(canProceed ? styles.confirmActive : styles.confirmDisabled),
          }}
        >
          {canProceed ? 'Aller travailler →' : 'Sélectionnez identité et sphère'}
        </button>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES - PLEINE LARGEUR
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%', // PLEINE LARGEUR
  },
  
  header: {
    padding: '24px 32px',
    borderBottom: '1px solid rgba(216, 178, 106, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#8D8371',
    marginTop: 4,
  },
  
  // CONTENT - GRILLE 3 COLONNES PLEINE LARGEUR
  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr', // Sphères au centre plus large
    gap: 24,
    padding: 32,
    overflow: 'auto',
  },
  
  column: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  locked: {
    opacity: 0.4,
    pointerEvents: 'none' as const,
  },
  
  colHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  step: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(216, 178, 106, 0.2)',
    color: '#D8B26A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
  },
  colTitle: {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    flex: 1,
  },
  check: { color: '#3EB4A2' },
  lock: { opacity: 0.5, fontSize: 14 },
  optional: {
    fontSize: 11,
    color: '#8D8371',
    background: 'rgba(141, 131, 113, 0.2)',
    padding: '2px 8px',
    borderRadius: 4,
  },
  
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center' as const,
    color: '#8D8371',
  },
  emptyIcon: {
    fontSize: 40,
    opacity: 0.3,
    marginBottom: 12,
  },
  createBtn: {
    marginTop: 16,
    padding: '10px 20px',
    background: 'rgba(216, 178, 106, 0.1)',
    border: '1px solid rgba(216, 178, 106, 0.3)',
    borderRadius: 8,
    color: '#D8B26A',
    cursor: 'pointer',
  },
  
  lockedMsg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    color: '#8D8371',
  },
  
  // SPHÈRES GRID
  spheresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    flex: 1,
  },
  sphereBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    border: '2px solid transparent',
    cursor: 'pointer',
    color: '#E9E4D6',
    background: 'rgba(255,255,255,0.03)',
  },
  sphereIcon: { fontSize: 28 },
  
  // FOOTER
  footer: {
    padding: '20px 32px',
    borderTop: '1px solid rgba(216, 178, 106, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 13,
  },
  done: { color: '#3EB4A2' },
  pending: { color: '#8D8371' },
  arrow: { color: '#8D8371', opacity: 0.5 },
  
  confirmBtn: {
    padding: '14px 32px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
  },
  confirmActive: {
    background: 'linear-gradient(135deg, #3EB4A2 0%, #2F9A8A 100%)',
    color: '#0D1117',
  },
  confirmDisabled: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#8D8371',
    cursor: 'not-allowed',
  },
};

export default ContextBureauScreen;
