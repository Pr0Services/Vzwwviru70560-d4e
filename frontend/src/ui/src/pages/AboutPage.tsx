/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — ABOUT PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.logoSection}>
          <span style={styles.logo}>◈</span>
          <h1 style={styles.title}>CHE·NU</h1>
          <span style={styles.tagline}>Chez Nous — Your Digital Universe</span>
        </div>
        <div style={styles.badges}>
          <span style={styles.badge}>🔒 SAFE</span>
          <span style={styles.badge}>🛡️ NON-AUTONOMOUS</span>
          <span style={styles.badge}>📖 READ-ONLY</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Philosophy Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🌟</span>
            Philosophy
          </h2>
          <p style={styles.text}>
            CHE·NU ("Chez Nous" — Our Place) is a representational architecture framework 
            designed to organize, visualize, and navigate complex personal and professional ecosystems. 
            It operates strictly in SAFE, NON-AUTONOMOUS mode, serving as a blueprint rather than 
            an active system.
          </p>
          <p style={styles.text}>
            The framework emphasizes human agency and control. All data is representational, 
            read-only, and requires explicit human action for any changes. There is no autonomous 
            decision-making, no persistent AI memory, and no unsupervised processes.
          </p>
        </div>

        {/* Architecture Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🏗️</span>
            Architecture
          </h2>
          <div style={styles.architectureGrid}>
            <ArchitectureCard 
              icon="🌐"
              title="UniverseOS"
              description="Root container for all spheres and systems"
            />
            <ArchitectureCard 
              icon="🔮"
              title="10 Spheres"
              description="Personal, Creative, Business, Education, Construction, Real Estate, Government, Social, Production, Systems"
            />
            <ArchitectureCard 
              icon="⚙️"
              title="Engines"
              description="HyperFabric, Cartography, Depth & Lens, Projection Engine"
            />
            <ArchitectureCard 
              icon="🧠"
              title="Memory System"
              description="External-only, documentary memory with explicit commands"
            />
            <ArchitectureCard 
              icon="🎮"
              title="XR Suite"
              description="Scene schemas, builders, and immersive representations"
            />
            <ArchitectureCard 
              icon="🔄"
              title="Orchestrator"
              description="Routing-only orchestration, no autonomous actions"
            />
          </div>
        </div>

        {/* Safety Principles */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🛡️</span>
            Safety Principles
          </h2>
          <div style={styles.principlesGrid}>
            <PrincipleCard 
              number="01"
              title="No Autonomous Actions"
              description="All actions require explicit human initiation and approval"
            />
            <PrincipleCard 
              number="02"
              title="Read-Only by Default"
              description="Data is visualized but never modified without explicit commands"
            />
            <PrincipleCard 
              number="03"
              title="External Memory Only"
              description="No internal AI memory or learning; all memory is documentary"
            />
            <PrincipleCard 
              number="04"
              title="Representational Architecture"
              description="Serves as blueprints and schemas, not active processes"
            />
            <PrincipleCard 
              number="05"
              title="Human Agency"
              description="Users maintain complete control over all system behaviors"
            />
            <PrincipleCard 
              number="06"
              title="Transparent Operations"
              description="All processes and states are visible and auditable"
            />
          </div>
        </div>

        {/* Brand Colors */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🎨</span>
            Brand Palette
          </h2>
          <div style={styles.colorsGrid}>
            <ColorCard name="Sacred Gold" hex="#D8B26A" />
            <ColorCard name="Ancient Stone" hex="#8D8371" />
            <ColorCard name="Jungle Emerald" hex="#3F7249" />
            <ColorCard name="Cenote Turquoise" hex="#3EB4A2" />
            <ColorCard name="Shadow Moss" hex="#2F4C39" />
            <ColorCard name="Earth Ember" hex="#7A593A" />
            <ColorCard name="UI Slate" hex="#1E1F22" />
            <ColorCard name="Soft Sand" hex="#E9E4D6" />
          </div>
        </div>

        {/* Version Info */}
        <div style={styles.versionSection}>
          <div style={styles.versionCard}>
            <span style={styles.versionLabel}>Current Version</span>
            <span style={styles.versionNumber}>CHE·NU OS v3.0</span>
            <span style={styles.versionDate}>Framework Release</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          CHE·NU — SAFE · NON-AUTONOMOUS · REPRESENTATIONAL
        </p>
        <p style={styles.footerSubtext}>
          A framework for human-centric digital organization
        </p>
      </div>
    </div>
  );
};

// Architecture Card Component
const ArchitectureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div style={styles.archCard}>
    <span style={styles.archIcon}>{icon}</span>
    <h3 style={styles.archTitle}>{title}</h3>
    <p style={styles.archDesc}>{description}</p>
  </div>
);

// Principle Card Component
const PrincipleCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div style={styles.principleCard}>
    <span style={styles.principleNumber}>{number}</span>
    <div>
      <h3 style={styles.principleTitle}>{title}</h3>
      <p style={styles.principleDesc}>{description}</p>
    </div>
  </div>
);

// Color Card Component
const ColorCard: React.FC<{ name: string; hex: string }> = ({ name, hex }) => (
  <div style={styles.colorCard}>
    <div style={{
      ...styles.colorSwatch,
      backgroundColor: hex
    }} />
    <span style={styles.colorName}>{name}</span>
    <span style={styles.colorHex}>{hex}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1000px"
  },
  header: {
    marginBottom: "24px"
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#8D8371",
    cursor: "pointer",
    fontSize: "13px",
    padding: "0"
  },
  hero: {
    textAlign: "center" as const,
    padding: "48px 0",
    marginBottom: "32px",
    borderBottom: "1px solid #E5E5E5"
  },
  logoSection: {
    marginBottom: "24px"
  },
  logo: {
    fontSize: "64px",
    color: "#D8B26A",
    display: "block",
    marginBottom: "16px"
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "42px",
    fontWeight: 700,
    color: "#1E1F22",
    letterSpacing: "2px"
  },
  tagline: {
    fontSize: "16px",
    color: "#8D8371"
  },
  badges: {
    display: "flex",
    justifyContent: "center",
    gap: "12px"
  },
  badge: {
    padding: "8px 16px",
    backgroundColor: "#3F724915",
    color: "#3F7249",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600
  },
  content: {},
  section: {
    marginBottom: "40px"
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    fontSize: "20px",
    fontWeight: 600,
    color: "#1E1F22",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  sectionIcon: {
    fontSize: "24px"
  },
  text: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    color: "#444",
    lineHeight: 1.7
  },
  architectureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px"
  },
  archCard: {
    padding: "20px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5",
    textAlign: "center" as const
  },
  archIcon: {
    fontSize: "28px",
    display: "block",
    marginBottom: "12px"
  },
  archTitle: {
    margin: "0 0 8px 0",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  archDesc: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
    lineHeight: 1.5
  },
  principlesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px"
  },
  principleCard: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  principleNumber: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#D8B26A"
  },
  principleTitle: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  principleDesc: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
    lineHeight: 1.5
  },
  colorsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px"
  },
  colorCard: {
    textAlign: "center" as const
  },
  colorSwatch: {
    width: "100%",
    height: "60px",
    borderRadius: "10px",
    marginBottom: "8px"
  },
  colorName: {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#1E1F22",
    marginBottom: "2px"
  },
  colorHex: {
    display: "block",
    fontSize: "11px",
    color: "#8D8371"
  },
  versionSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px"
  },
  versionCard: {
    textAlign: "center" as const,
    padding: "24px 48px",
    backgroundColor: "#1E1F22",
    borderRadius: "12px"
  },
  versionLabel: {
    display: "block",
    fontSize: "11px",
    color: "#8D8371",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px"
  },
  versionNumber: {
    display: "block",
    fontSize: "24px",
    fontWeight: 700,
    color: "#D8B26A",
    marginBottom: "4px"
  },
  versionDate: {
    display: "block",
    fontSize: "12px",
    color: "#666"
  },
  footer: {
    textAlign: "center" as const,
    padding: "32px 0",
    borderTop: "1px solid #E5E5E5"
  },
  footerText: {
    margin: "0 0 4px 0",
    fontSize: "13px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  footerSubtext: {
    margin: 0,
    fontSize: "12px",
    color: "#8D8371"
  }
};

export default AboutPage;
