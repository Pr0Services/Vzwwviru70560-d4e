/**
 * ============================================================
 * CHE·NU — DEMO CALLOUTS
 * Callouts showing demo features and what to expect
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from 'react';

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
// TYPES
// ============================================================

type DemoVariant = 'architecture' | 'architecture_universe' | 'business_architecture' | 'suite';

interface DemoCalloutsProps {
  variant: DemoVariant;
  compact?: boolean;
}

// ============================================================
// CALLOUT DATA
// ============================================================

interface CalloutData {
  title: string;
  icon: string;
  color: string;
  features: string[];
  highlights: { label: string; value: string }[];
}

const CALLOUT_DATA: Record<DemoVariant, CalloutData> = {
  architecture: {
    title: 'Architecture Workspace Demo v1',
    icon: '🏛️',
    color: COLORS.cenoteTurquoise,
    features: [
      'Project Workspace with Architecture domain',
      '3 DataSpaces (Notes, Resources, Archive)',
      'Architecture WorkSurface Profile',
      'Single XR Scene with 4 sectors',
      'Assisted input processing mode',
    ],
    highlights: [
      { label: 'Sphere', value: 'Creative' },
      { label: 'Domain', value: 'Architecture' },
      { label: 'XR Scenes', value: '1' },
    ],
  },
  architecture_universe: {
    title: 'Architecture XR Universe Demo v2',
    icon: '🌀',
    color: COLORS.cenoteTurquoise,
    features: [
      'Multi-room XR universe for architecture',
      'Concept → Blueprint → Zoning → Structure → XR Layout',
      'Portal navigation between rooms (8 portals)',
      'Workspace + DataSpaces + WorkSurface',
      'Architecture profile with assisted mode',
    ],
    highlights: [
      { label: 'Sphere', value: 'Creative' },
      { label: 'XR Rooms', value: '5' },
      { label: 'Portals', value: '8' },
    ],
  },
  business_architecture: {
    title: 'Business + Architecture Demo',
    icon: '🏗️',
    color: COLORS.sacredGold,
    features: [
      'Business + Architecture & Construction domain',
      'Conceptual construction workflow (phases & resources)',
      'Industrial & overview XR rooms',
      '5 Business processes + 6 Project tools',
      'Enterprise DataSpaces (Notes, Resources, Archive, Budget)',
    ],
    highlights: [
      { label: 'Sphere', value: 'Business' },
      { label: 'XR Rooms', value: '3' },
      { label: 'Processes', value: '5' },
    ],
  },
  suite: {
    title: 'CHE·NU Architecture Suite',
    icon: '🚀',
    color: COLORS.sacredGold,
    features: [
      'Complete demo suite for CHE·NU architecture',
      'Architecture XR Universe (5 rooms)',
      'Business + Architecture (construction)',
      'Multi-sphere, multi-domain validation',
      'Full XR Universe navigation',
    ],
    highlights: [
      { label: 'Demos', value: '3' },
      { label: 'Total Rooms', value: '9' },
      { label: 'Domains', value: '2' },
    ],
  },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
    marginBottom: '20px',
  },
  header: {
    padding: '16px 20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  icon: {
    fontSize: '28px',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: '2px',
  },
  subtitle: {
    fontSize: '11px',
    color: COLORS.textMuted,
  },
  highlights: {
    display: 'flex',
    gap: '12px',
  },
  highlight: {
    textAlign: 'center',
    padding: '8px 14px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
  },
  highlightValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: COLORS.textPrimary,
  },
  highlightLabel: {
    fontSize: '9px',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  body: {
    padding: '16px 20px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.textSecondary,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '12px',
    color: COLORS.textSecondary,
    lineHeight: 1.4,
  },
  featureIcon: {
    fontSize: '10px',
    marginTop: '3px',
  },
  footer: {
    padding: '10px 20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTop: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  safetyBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: `${COLORS.jungleEmerald}20`,
    border: `1px solid ${COLORS.jungleEmerald}`,
    borderRadius: '6px',
    fontSize: '10px',
    color: COLORS.jungleEmerald,
    fontWeight: 500,
  },
  compactContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '10px',
    border: `1px solid ${COLORS.borderColor}`,
    padding: '14px 16px',
    marginBottom: '16px',
  },
  compactHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  compactIcon: {
    fontSize: '20px',
  },
  compactTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    flex: 1,
  },
  compactFeatures: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  compactFeature: {
    padding: '4px 10px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '4px',
    fontSize: '10px',
    color: COLORS.textMuted,
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const DemoCallouts: React.FC<DemoCalloutsProps> = ({
  variant,
  compact = false,
}) => {
  const data = CALLOUT_DATA[variant];

  if (!data) {
    return null;
  }

  // Compact version
  if (compact) {
    return (
      <div style={styles.compactContainer}>
        <div style={styles.compactHeader}>
          <span style={styles.compactIcon}>{data.icon}</span>
          <span style={styles.compactTitle}>{data.title}</span>
          <span style={styles.safetyBadge}>
            <span>🛡️</span>
            <span>SAFE</span>
          </span>
        </div>
        <div style={styles.compactFeatures}>
          {data.highlights.map(h => (
            <span key={h.label} style={styles.compactFeature}>
              {h.label}: <strong>{h.value}</strong>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.icon}>{data.icon}</span>
        <div style={styles.headerInfo}>
          <div style={styles.title}>{data.title}</div>
          <div style={styles.subtitle}>What this demo shows</div>
        </div>
        <div style={styles.highlights}>
          {data.highlights.map(h => (
            <div key={h.label} style={styles.highlight}>
              <div style={{ ...styles.highlightValue, color: data.color }}>
                {h.value}
              </div>
              <div style={styles.highlightLabel}>{h.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.sectionTitle}>
          <span>✨</span>
          <span>Features</span>
        </div>
        <div style={styles.featureList}>
          {data.features.map((feature, i) => (
            <div key={i} style={styles.featureItem}>
              <span style={{ ...styles.featureIcon, color: data.color }}>●</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.safetyBadge}>
          <span>🛡️</span>
          <span>SAFE · READ-ONLY · REPRESENTATIONAL</span>
        </span>
      </div>
    </div>
  );
};

export default DemoCallouts;
