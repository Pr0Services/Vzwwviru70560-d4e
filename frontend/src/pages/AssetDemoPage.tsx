/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — ASSET DEMO PAGE                              ║
 * ║                       Test du Switch Placeholder ↔ Midjourney                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Page de démonstration pour visualiser tous les assets
 * et tester le switch entre modes placeholder et Midjourney
 * 
 * Usage: Importer dans l'app pour visualiser les assets
 */

import React, { useState } from 'react';
import {
  NovaIcon,
  SphereIcon,
  CheckpointIcon,
  SectionIcon,
  AgentAvatar,
  Logo,
  ASSET_MODE,
  isMidjourneyMode,
  AssetAnimationsCSS,
} from '../components/assets';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type SphereId = 'personal' | 'business' | 'government' | 'design_studio' | 'community' | 'social' | 'entertainment' | 'my_team' | 'scholars';
type NovaState = 'idle' | 'thinking' | 'active' | 'speaking';
type CheckpointState = 'pending' | 'approved' | 'rejected';
type SectionId = 'dashboard' | 'notes' | 'tasks' | 'projects' | 'threads' | 'meetings';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  bgDark: '#0d0d0f',
  bgCard: '#151A18',
  border: '#2A3530',
  gold: '#D8B26A',
  turquoise: '#3EB4A2',
  textPrimary: '#E8E4DD',
  textSecondary: '#888888',
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.bgDark,
    padding: 40,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    marginBottom: 40,
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  modeIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: isMidjourneyMode() ? `${COLORS.turquoise}22` : `${COLORS.gold}22`,
    border: `1px solid ${isMidjourneyMode() ? COLORS.turquoise : COLORS.gold}`,
    borderRadius: 8,
    marginTop: 16,
  },
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: COLORS.gold,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: 20,
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
  },
  row: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: `${COLORS.bgCard}`,
    padding: '2px 8px',
    borderRadius: 4,
    color: COLORS.turquoise,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT DEMO
// ═══════════════════════════════════════════════════════════════════════════════

export const AssetDemoPage: React.FC = () => {
  const sphereIds: SphereId[] = ['personal', 'business', 'government', 'design_studio', 'community', 'social', 'entertainment', 'my_team', 'scholar'];
  const novaStates: NovaState[] = ['idle', 'thinking', 'active', 'speaking'];
  const checkpointStates: CheckpointState[] = ['pending', 'approved', 'rejected'];
  const sectionIds: SectionId[] = ['dashboard', 'notes', 'tasks', 'projects', 'threads', 'meetings'];
  const agentIds = ['nova', 'director-personal', 'director-business', 'director-construction', 'manager-accounting'];

  return (
    <div style={styles.container}>
      {/* CSS Animations */}
      <style>{AssetAnimationsCSS}</style>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          <Logo variant="icon" size={36} /> CHE·NU Asset Gallery
        </h1>
        <p style={styles.subtitle}>
          Démonstration du système de switch Placeholder ↔ Midjourney
        </p>
        
        <div style={styles.modeIndicator}>
          <span style={{ 
            width: 10, 
            height: 10, 
            borderRadius: '50%', 
            backgroundColor: isMidjourneyMode() ? COLORS.turquoise : COLORS.gold 
          }} />
          <span style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 600 }}>
            Mode: {ASSET_MODE.toUpperCase()}
          </span>
        </div>
        
        <p style={{ ...styles.subtitle, marginTop: 12 }}>
          Pour switcher, modifier <code style={styles.code}>ASSET_MODE</code> dans{' '}
          <code style={styles.code}>assets.config.ts</code>
        </p>
      </header>

      {/* Nova Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          ✨ Nova — États
        </h2>
        <div style={styles.row}>
          {novaStates.map((state) => (
            <div key={state} style={styles.card}>
              <NovaIcon state={state} size={56} animated />
              <span style={styles.label}>{state}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Spheres Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          🌐 9 Sphères
        </h2>
        <div style={styles.grid}>
          {sphereIds.map((id) => (
            <div key={id} style={styles.card}>
              <SphereIcon sphereId={id} size={48} showGlow />
              <span style={styles.label}>{id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Checkpoints Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          🛡️ Checkpoints
        </h2>
        <div style={styles.row}>
          {checkpointStates.map((state) => (
            <div key={state} style={styles.card}>
              <CheckpointIcon state={state} size={40} />
              <span style={styles.label}>{state}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bureau Sections */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          📋 Sections Bureau
        </h2>
        <div style={styles.row}>
          {sectionIds.map((id) => (
            <div key={id} style={styles.card}>
              <SectionIcon sectionId={id} size={36} />
              <span style={styles.label}>{id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Agents Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          🤖 Agents
        </h2>
        <div style={styles.row}>
          {agentIds.map((id) => (
            <div key={id} style={styles.card}>
              <AgentAvatar agentId={id} size={48} showLevel />
              <span style={styles.label}>{id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          💻 Exemples d'utilisation
        </h2>
        <div style={{
          backgroundColor: COLORS.bgCard,
          padding: 24,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
        }}>
          <pre style={{ 
            margin: 0, 
            fontSize: 13, 
            color: COLORS.textPrimary,
            lineHeight: 1.6,
            overflow: 'auto',
          }}>
{`// Import des composants
import { 
  NovaIcon, 
  SphereIcon, 
  CheckpointIcon,
  AgentAvatar 
} from '@/components/assets';

// Utilisation simple
<NovaIcon state="thinking" size={48} />

<SphereIcon sphereId="business" size={40} showGlow />

<CheckpointIcon state="pending" size={24} />

<AgentAvatar agentId="director-finance" size={40} showLevel />

// Le switch est automatique!
// Modifier ASSET_MODE dans assets.config.ts:
// - 'placeholder' → Emojis
// - 'midjourney' → Images générées`}
          </pre>
        </div>
      </section>

      {/* Checklist */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          ✅ Checklist Midjourney
        </h2>
        <div style={{
          backgroundColor: COLORS.bgCard,
          padding: 24,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
        }}>
          <ul style={{ 
            margin: 0, 
            paddingLeft: 20, 
            color: COLORS.textSecondary,
            lineHeight: 2,
          }}>
            <li>[ ] Nova - 4 états (idle, thinking, active, speaking)</li>
            <li>[ ] Sphères - 9 icônes</li>
            <li>[ ] Checkpoints - 3 états</li>
            <li>[ ] Sections Bureau - 6 icônes</li>
            <li>[ ] Agents Directors - 9 avatars</li>
            <li>[ ] Agents Managers - 20+ avatars</li>
            <li>[ ] UI - Logo, App Icon</li>
            <li>[ ] Backgrounds - Universe, Bureau, Map, Landing</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AssetDemoPage;
