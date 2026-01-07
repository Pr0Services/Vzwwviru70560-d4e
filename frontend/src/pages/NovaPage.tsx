// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — NOVA PAGE
// Central Intelligence Interface
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NOVA, SPHERES_LIST, CHENU_COLORS } from '../types/sphere.types';

const NovaPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleBack = () => {
    navigate('/map');
  };

  const handleSphereClick = (sphereId: string) => {
    navigate(`/sphere/${sphereId}`);
  };

  return (
    <div style={styles.container}>
      {/* Background Glow */}
      <div style={styles.backgroundGlow} />

      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={handleBack}>
          ← Campus
        </button>
        <div style={styles.titleContainer}>
          <span style={styles.novaIcon}>{NOVA.icon}</span>
          <div>
            <h1 style={styles.title}>{NOVA.name}</h1>
            <span style={styles.subtitle}>{NOVA.nameEn}</span>
          </div>
        </div>
        <div style={{ width: 80 }} />
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Nova Avatar */}
        <div style={styles.novaAvatar}>
          <div style={styles.novaGlow} />
          <span style={styles.novaAvatarIcon}>🌳</span>
          <div style={styles.pulseRing} />
        </div>

        {/* Greeting */}
        <h2 style={styles.greeting}>Bonjour, comment puis-je vous aider?</h2>
        <p style={styles.description}>{NOVA.description}</p>

        {/* Query Input */}
        <div style={styles.queryContainer}>
          <input
            type="text"
            placeholder="Posez une question à Nova..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.queryInput}
          />
          <button style={styles.queryBtn}>
            Demander
          </button>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}>Actions rapides</h3>
          <div style={styles.actionsGrid}>
            {[
              { icon: '📊', label: 'Rapport quotidien', action: 'report' },
              { icon: '🎯', label: 'Mes priorités', action: 'priorities' },
              { icon: '📅', label: 'Planning', action: 'schedule' },
              { icon: '💡', label: 'Suggestions', action: 'suggestions' },
            ].map((action) => (
              <button key={action.action} style={styles.actionCard}>
                <span style={styles.actionIcon}>{action.icon}</span>
                <span style={styles.actionLabel}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Spheres Overview */}
        <div style={styles.spheresOverview}>
          <h3 style={styles.sectionTitle}>Vos Sphères</h3>
          <div style={styles.spheresGrid}>
            {SPHERES_LIST.map((sphere) => (
              <button
                key={sphere.id}
                style={styles.sphereCard}
                onClick={() => handleSphereClick(sphere.id)}
              >
                <div 
                  style={{
                    ...styles.sphereIcon,
                    background: `${sphere.color}22`,
                    borderColor: sphere.color
                  }}
                >
                  {sphere.icon}
                </div>
                <span style={styles.sphereName}>{sphere.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={styles.features}>
          {NOVA.features.map((feature, index) => (
            <span key={index} style={styles.featureTag}>
              {feature}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0a1520 0%, #030508 100%)',
    color: '#E9E4D6',
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '60%',
    background: 'radial-gradient(ellipse, rgba(216, 178, 106, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 25px',
    background: 'rgba(10, 21, 32, 0.9)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    position: 'relative',
    zIndex: 10,
  },
  backBtn: {
    padding: '10px 16px',
    background: 'rgba(30, 35, 45, 0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#8D8371',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  novaIcon: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 0 20px rgba(216, 178, 106, 0.5))',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#D8B26A',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.7rem',
    color: '#8D8371',
    letterSpacing: '0.1em',
  },

  // Main
  main: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '40px 25px',
    position: 'relative',
    zIndex: 5,
  },

  // Nova Avatar
  novaAvatar: {
    position: 'relative',
    width: 100,
    height: 100,
    margin: '0 auto 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  novaGlow: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    background: 'radial-gradient(circle, rgba(216, 178, 106, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  novaAvatarIcon: {
    fontSize: '3.5rem',
    zIndex: 2,
    filter: 'drop-shadow(0 0 20px rgba(216, 178, 106, 0.6))',
  },
  pulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '2px solid rgba(216, 178, 106, 0.4)',
    borderRadius: '50%',
    animation: 'pulse 2s ease-out infinite',
  },

  // Greeting
  greeting: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 500,
    margin: '0 0 10px',
    color: '#E9E4D6',
  },
  description: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#8D8371',
    marginBottom: 30,
    lineHeight: 1.6,
  },

  // Query
  queryContainer: {
    display: 'flex',
    gap: 10,
    marginBottom: 40,
  },
  queryInput: {
    flex: 1,
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(216, 178, 106, 0.3)',
    borderRadius: 14,
    color: '#E9E4D6',
    fontSize: '0.95rem',
  },
  queryBtn: {
    padding: '14px 24px',
    background: 'rgba(216, 178, 106, 0.2)',
    border: '1px solid rgba(216, 178, 106, 0.4)',
    borderRadius: 14,
    color: '#D8B26A',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
  },

  // Quick Actions
  quickActions: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionIcon: {
    fontSize: '1.5rem',
  },
  actionLabel: {
    fontSize: '0.75rem',
    color: '#888',
  },

  // Spheres Overview
  spheresOverview: {
    marginBottom: 40,
  },
  spheresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 12,
  },
  sphereCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  sphereIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    transition: 'all 0.2s ease',
  },
  sphereName: {
    fontSize: '0.7rem',
    color: '#888',
  },

  // Features
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  featureTag: {
    padding: '6px 14px',
    background: 'rgba(216, 178, 106, 0.1)',
    border: '1px solid rgba(216, 178, 106, 0.2)',
    borderRadius: 20,
    fontSize: '0.75rem',
    color: '#D8B26A',
  },
};

export default NovaPage;
