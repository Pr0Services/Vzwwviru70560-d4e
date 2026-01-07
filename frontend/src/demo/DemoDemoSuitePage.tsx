/**
 * ============================================================
 * CHE·NU — DEMO SUITE PAGE
 * Landing page for Architecture Suite Demos
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from 'react';
import { DEMO_REGISTRY, DemoRegistryItem } from './demoAdapter';

// ============================================================
// COLORS
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
  cardBg: '#2A2B2E',
  borderColor: '#3A3B3E',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#707070',
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: COLORS.uiSlate,
    minHeight: '100vh',
    padding: '32px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: COLORS.textPrimary,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  logoIcon: {
    fontSize: '48px',
  },
  logoText: {
    fontSize: '36px',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${COLORS.sacredGold}, ${COLORS.cenoteTurquoise})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.textMuted,
    marginBottom: '24px',
  },
  badges: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  badgeSafe: {
    backgroundColor: `${COLORS.jungleEmerald}30`,
    color: COLORS.jungleEmerald,
  },
  badgeV2: {
    backgroundColor: `${COLORS.cenoteTurquoise}30`,
    color: COLORS.cenoteTurquoise,
  },
  badgeMega: {
    backgroundColor: `${COLORS.sacredGold}30`,
    color: COLORS.sacredGold,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '48px',
  },
  statCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    padding: '20px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  demoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '16px',
    border: `2px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  demoCardHover: {
    borderColor: COLORS.cenoteTurquoise,
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
  },
  demoCardHeader: {
    padding: '24px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  demoIcon: {
    fontSize: '48px',
    lineHeight: 1,
  },
  demoInfo: {
    flex: 1,
  },
  demoName: {
    fontSize: '20px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  demoVersion: {
    fontSize: '12px',
    color: COLORS.textMuted,
  },
  demoSphere: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  sphereCreative: {
    backgroundColor: `${COLORS.cenoteTurquoise}30`,
    color: COLORS.cenoteTurquoise,
  },
  sphereBusiness: {
    backgroundColor: `${COLORS.sacredGold}30`,
    color: COLORS.sacredGold,
  },
  demoBody: {
    padding: '24px',
  },
  demoDesc: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    marginBottom: '20px',
    lineHeight: 1.5,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: COLORS.textMuted,
  },
  featureIcon: {
    fontSize: '12px',
    color: COLORS.jungleEmerald,
  },
  demoAction: {
    display: 'block',
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    textDecoration: 'none',
  },
  actionPrimary: {
    backgroundColor: COLORS.cenoteTurquoise,
    color: COLORS.uiSlate,
  },
  actionSecondary: {
    backgroundColor: COLORS.sacredGold,
    color: COLORS.uiSlate,
  },
  footer: {
    padding: '24px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: COLORS.textMuted,
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  safetyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: `${COLORS.jungleEmerald}20`,
    border: `1px solid ${COLORS.jungleEmerald}`,
    borderRadius: '8px',
    color: COLORS.jungleEmerald,
    fontSize: '12px',
    fontWeight: 600,
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const DemoDemoSuitePage: React.FC = () => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  // Calculate stats
  const totalRooms = DEMO_REGISTRY.reduce((sum, demo) => {
    if (demo.id === 'architecture_v1') return sum + 1;
    if (demo.id === 'architecture_universe_v2') return sum + 5;
    if (demo.id === 'business_architecture') return sum + 3;
    return sum;
  }, 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🚀</span>
            <span style={styles.logoText}>CHE·NU Architecture Suite</span>
          </div>
          <p style={styles.subtitle}>
            Explore the complete demo suite for CHE·NU architecture and business workspaces
          </p>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, ...styles.badgeSafe }}>🛡️ Safe</span>
            <span style={{ ...styles.badge, ...styles.badgeV2 }}>v2.0</span>
            <span style={{ ...styles.badge, ...styles.badgeMega }}>Mega Pack</span>
          </div>
        </header>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: COLORS.cenoteTurquoise }}>
              {DEMO_REGISTRY.length}
            </div>
            <div style={styles.statLabel}>Demos</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: COLORS.sacredGold }}>
              {totalRooms}
            </div>
            <div style={styles.statLabel}>XR Rooms</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: COLORS.jungleEmerald }}>2</div>
            <div style={styles.statLabel}>Spheres</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: COLORS.earthEmber }}>3</div>
            <div style={styles.statLabel}>Domains</div>
          </div>
        </div>

        {/* Demo Grid */}
        <div style={styles.demoGrid}>
          {DEMO_REGISTRY.map(demo => {
            const isHovered = hoveredId === demo.id;
            const isCreative = demo.sphere === 'Creative';

            return (
              <div
                key={demo.id}
                style={{
                  ...styles.demoCard,
                  ...(isHovered ? styles.demoCardHover : {}),
                }}
                onMouseEnter={() => setHoveredId(demo.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Header */}
                <div style={styles.demoCardHeader}>
                  <span style={styles.demoIcon}>{demo.icon}</span>
                  <div style={styles.demoInfo}>
                    <div style={styles.demoName}>{demo.name}</div>
                    <div style={styles.demoVersion}>v{demo.version}</div>
                  </div>
                  <span
                    style={{
                      ...styles.demoSphere,
                      ...(isCreative ? styles.sphereCreative : styles.sphereBusiness),
                    }}
                  >
                    {demo.sphere}
                  </span>
                </div>

                {/* Body */}
                <div style={styles.demoBody}>
                  <div style={styles.demoDesc}>{demo.description}</div>
                  
                  <div style={styles.featureList}>
                    {demo.features.map((feature, i) => (
                      <div key={i} style={styles.featureItem}>
                        <span style={styles.featureIcon}>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={demo.route}
                    style={{
                      ...styles.demoAction,
                      ...(isCreative ? styles.actionPrimary : styles.actionSecondary),
                    }}
                  >
                    View Demo →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerText}>
            ⚠️ All demos are CONCEPTUAL REPRESENTATIONS ONLY.<br />
            Not intended for real construction, engineering, or financial decisions.<br />
            Consult licensed professionals for actual work.
          </div>
          <div style={styles.safetyBadge}>
            <span>🛡️</span>
            <span>SAFE · READ-ONLY · REPRESENTATIONAL</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DemoDemoSuitePage;
