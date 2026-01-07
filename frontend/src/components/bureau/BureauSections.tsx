/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — BUREAU SECTIONS                                 ║
 * ║                    6 Sections (ARCHITECTURE GELÉE)                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Les 6 sections du Bureau sont identiques pour toutes les sphères.
 * Seul le CONTENU varie selon la sphère active.
 */

import React from 'react';
import { useParams } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════════
// COULEURS CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  cenoteTurquoise: '#3EB4A2',
  uiSlate: '#1E1F22',
  uiDark: '#141416',
  softSand: '#E9E4D6',
  ancientStone: '#8D8371',
  border: '#2A2A2E',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED SECTION CONTAINER
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionContainerProps {
  title: string;
  icon: string;
  description: string;
  children?: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ 
  title, 
  icon, 
  description,
  children 
}) => {
  const params = useParams();
  const sphereId = window.location.pathname.split('/')[1] || 'personal';
  
  return (
    <div style={{ 
      padding: 24, 
      color: COLORS.softSand,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>{title}</h2>
      </div>
      
      <p style={{ 
        color: COLORS.ancientStone, 
        marginBottom: 24,
        fontSize: 14,
      }}>
        {description}
      </p>
      
      {/* Placeholder Content */}
      <div style={{
        flex: 1,
        backgroundColor: COLORS.uiDark,
        borderRadius: 12,
        border: `1px dashed ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        {children || (
          <>
            <span style={{ fontSize: 48, opacity: 0.3 }}>{icon}</span>
            <p style={{ color: COLORS.ancientStone, fontSize: 14 }}>
              Contenu de {title} — Sphère: {sphereId}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. DASHBOARD SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export const DashboardSection: React.FC = () => (
  <SectionContainer
    title="Dashboard"
    icon="📊"
    description="Vue d'ensemble, métriques et accès rapide à vos données"
  >
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
      padding: 24,
      width: '100%',
      maxWidth: 800,
    }}>
      {[
        { label: 'Tâches', value: '12', color: COLORS.sacredGold },
        { label: 'Projets', value: '5', color: COLORS.cenoteTurquoise },
        { label: 'Réunions', value: '3', color: '#E07B53' },
      ].map(stat => (
        <div
          key={stat.label}
          style={{
            padding: 20,
            backgroundColor: `${stat.color}10`,
            border: `1px solid ${stat.color}40`,
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 32, fontWeight: 700, color: stat.color, margin: 0 }}>
            {stat.value}
          </p>
          <p style={{ fontSize: 12, color: COLORS.ancientStone, marginTop: 4 }}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </SectionContainer>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 2. NOTES SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export const NotesSection: React.FC = () => (
  <SectionContainer
    title="Notes"
    icon="📝"
    description="Vos pensées, références et documentation personnelle"
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// 3. TASKS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export const TasksSection: React.FC = () => (
  <SectionContainer
    title="Tâches"
    icon="✅"
    description="Vos tâches à accomplir, organisées par priorité"
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// 4. PROJECTS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export const ProjectsSection: React.FC = () => (
  <SectionContainer
    title="Projets"
    icon="📁"
    description="Vos projets organisés avec milestones et suivi"
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// 5. THREADS SECTION (.chenu)
// ═══════════════════════════════════════════════════════════════════════════════

export const ThreadsSection: React.FC = () => (
  <SectionContainer
    title="Threads (.chenu)"
    icon="💬"
    description="Vos fils de discussion persistants et conversations avec IA"
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MEETINGS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export const MeetingsSection: React.FC = () => (
  <SectionContainer
    title="Réunions"
    icon="📅"
    description="Vos réunions, rendez-vous et calendrier"
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORTS (for lazy loading)
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  DashboardSection,
  NotesSection,
  TasksSection,
  ProjectsSection,
  ThreadsSection,
  MeetingsSection,
};
