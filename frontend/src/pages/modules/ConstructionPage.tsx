/**
 * CHE·NU V26 - MODULE CONSTRUCTION
 * Spécifique Québec: RBQ, CCQ, CNESST
 * Status: SAFE • NON-AUTONOMOUS • REPRESENTATIONAL
 * 
 * ❤️ With love, for humanity.
 */

import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

/* =====================================================
   SECTIONS NAVIGATION
   ===================================================== */

const sections = [
  { id: 'dashboard', label: 'Tableau de bord', icon: '📊', path: '/construction/dashboard' },
  { id: 'projets', label: 'Chantiers', icon: '🏗️', path: '/construction/chantiers' },
  { id: 'soumissions', label: 'Soumissions', icon: '📝', path: '/construction/soumissions' },
  { id: 'materiaux', label: 'Matériaux', icon: '🧱', path: '/construction/materiaux' },
  { id: 'equipement', label: 'Équipement', icon: '🚜', path: '/construction/equipement' },
  { id: 'equipe', label: 'Main d\'œuvre', icon: '👷', path: '/construction/equipe' },
  { id: 'securite', label: 'Sécurité', icon: '🦺', path: '/construction/securite' },
  { id: 'conformite', label: 'Conformité QC', icon: '🍁', path: '/construction/conformite' },
  { id: 'inspections', label: 'Inspections', icon: '🔍', path: '/construction/inspections' },
];

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function ConstructionPage() {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          color: '#e8e4dc', 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12 
        }}>
          🏗️ Construction Québec
        </h1>
        <p style={{ fontSize: 14, color: '#6b6560', margin: '8px 0 0' }}>
          Gestion de chantiers avec conformité RBQ, CCQ et CNESST
        </p>
      </div>

      {/* Quebec Compliance Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f4c75 100%)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        border: '1px solid #3b82f6'
      }}>
        <span style={{ fontSize: 32 }}>🍁</span>
        <div>
          <div style={{ color: '#e8e4dc', fontWeight: 600 }}>Conformité Québec Active</div>
          <div style={{ color: '#94a3b8', fontSize: 13 }}>
            Intégration RBQ • CCQ • CNESST • Code de construction
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <StatusBadge label="RBQ" status="valid" />
          <StatusBadge label="CCQ" status="valid" />
          <StatusBadge label="CNESST" status="warning" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {sections.map((section) => (
          <NavLink
            key={section.id}
            to={section.path}
            style={({ isActive }) => ({
              padding: '10px 16px',
              background: isActive ? '#f59e0b' : '#1e2420',
              color: isActive ? '#000' : '#a8a29e',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
            })}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ 
        background: '#121614', 
        border: '1px solid #2a2a2a', 
        borderRadius: 16, 
        padding: 24 
      }}>
        <Routes>
          <Route index element={<ConstructionDashboard />} />
          <Route path="/dashboard" element={<ConstructionDashboard />} />
          <Route path="/chantiers" element={<ChantiersView />} />
          <Route path="/soumissions" element={<SoumissionsView />} />
          <Route path="/materiaux" element={<MateriauxView />} />
          <Route path="/equipement" element={<EquipementView />} />
          <Route path="/equipe" element={<MainOeuvreView />} />
          <Route path="/securite" element={<SecuriteView />} />
          <Route path="/conformite" element={<ConformiteView />} />
          <Route path="/inspections" element={<InspectionsView />} />
        </Routes>
      </div>
    </div>
  );
}

/* =====================================================
   STATUS BADGE COMPONENT
   ===================================================== */

function StatusBadge({ label, status }: { label: string; status: 'valid' | 'warning' | 'expired' }) {
  const colors = {
    valid: { bg: '#4ade8020', color: '#4ade80' },
    warning: { bg: '#f59e0b20', color: '#f59e0b' },
    expired: { bg: '#ef444420', color: '#ef4444' },
  };

  return (
    <span style={{
      padding: '4px 10px',
      background: colors[status].bg,
      color: colors[status].color,
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
    }}>
      {label}
    </span>
  );
}

/* =====================================================
   DASHBOARD
   ===================================================== */

function ConstructionDashboard() {
  const kpis = [
    { label: 'Chantiers actifs', value: '5', icon: '🏗️', trend: '+1' },
    { label: 'Soumissions en cours', value: '12', icon: '📝', trend: '+3' },
    { label: 'Valeur projets', value: '2.4M$', icon: '💰', trend: '+15%' },
    { label: 'Heures CCQ', value: '1,240h', icon: '⏱️', trend: '+8%' },
  ];

  const upcomingInspections = [
    { project: 'Résidence Laval', type: 'Fondation', date: '2025-12-15', inspector: 'RBQ' },
    { project: 'Commercial Longueuil', type: 'Électrique', date: '2025-12-18', inspector: 'CMEQ' },
    { project: 'Réno Montréal', type: 'Plomberie', date: '2025-12-20', inspector: 'CMMTQ' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        Tableau de bord Construction
      </h2>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: '#1e2420', padding: 20, borderRadius: 12 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{kpi.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc' }}>{kpi.value}</div>
            <div style={{ fontSize: 13, color: '#6b6560' }}>{kpi.label}</div>
            <div style={{ 
              fontSize: 12, 
              color: kpi.trend.startsWith('+') ? '#4ade80' : '#ef4444', 
              marginTop: 4 
            }}>
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Inspections */}
      <div style={{ background: '#1e2420', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc', margin: '0 0 16px' }}>
          🔍 Inspections à venir
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {upcomingInspections.map((insp, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
              background: '#121614',
              borderRadius: 8,
            }}>
              <div>
                <div style={{ color: '#e8e4dc', fontWeight: 500 }}>{insp.project}</div>
                <div style={{ color: '#6b6560', fontSize: 13 }}>{insp.type}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#f59e0b', fontSize: 13 }}>{insp.date}</div>
                <div style={{ color: '#6b6560', fontSize: 12 }}>{insp.inspector}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   CHANTIERS VIEW
   ===================================================== */

function ChantiersView() {
  const chantiers = [
    { 
      name: 'Résidence Laval', 
      client: 'Famille Tremblay',
      status: 'En cours',
      phase: 'Fondation',
      progress: 25,
      budget: '450,000$'
    },
    { 
      name: 'Commercial Longueuil', 
      client: 'Groupe ABC Inc.',
      status: 'En cours',
      phase: 'Structure',
      progress: 60,
      budget: '1,200,000$'
    },
    { 
      name: 'Rénovation Montréal', 
      client: 'M. Gagnon',
      status: 'En cours',
      phase: 'Finition',
      progress: 85,
      budget: '180,000$'
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: 0 }}>
          🏗️ Chantiers actifs
        </h2>
        <button style={{
          padding: '10px 20px',
          background: '#f59e0b',
          color: '#000',
          border: 'none',
          borderRadius: 8,
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          + Nouveau chantier
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {chantiers.map((chantier, i) => (
          <div key={i} style={{
            background: '#1e2420',
            borderRadius: 12,
            padding: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ color: '#e8e4dc', fontWeight: 600, fontSize: 16 }}>{chantier.name}</div>
                <div style={{ color: '#6b6560', fontSize: 13 }}>{chantier.client}</div>
              </div>
              <StatusBadge label={chantier.status} status="valid" />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ color: '#6b6560', fontSize: 12 }}>Phase</div>
                <div style={{ color: '#e8e4dc', fontWeight: 500 }}>{chantier.phase}</div>
              </div>
              <div>
                <div style={{ color: '#6b6560', fontSize: 12 }}>Budget</div>
                <div style={{ color: '#e8e4dc', fontWeight: 500 }}>{chantier.budget}</div>
              </div>
              <div>
                <div style={{ color: '#6b6560', fontSize: 12 }}>Progression</div>
                <div style={{ color: '#4ade80', fontWeight: 500 }}>{chantier.progress}%</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: '#121614', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{
                width: `${chantier.progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #4ade80)',
                borderRadius: 4,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   PLACEHOLDER VIEWS
   ===================================================== */

function SoumissionsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📝 Gestion des soumissions
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Créez et gérez vos soumissions de construction</p>
        <ul style={{ marginTop: 16 }}>
          <li>Calcul automatique des coûts</li>
          <li>Intégration prix matériaux</li>
          <li>Taux horaires CCQ</li>
          <li>Marges et contingences</li>
        </ul>
      </div>
    </div>
  );
}

function MateriauxView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🧱 Gestion des matériaux
      </h2>
      <div style={{ color: '#6b6560' }}>Suivi des inventaires et commandes de matériaux</div>
    </div>
  );
}

function EquipementView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🚜 Gestion de l'équipement
      </h2>
      <div style={{ color: '#6b6560' }}>Suivi des équipements, maintenance et location</div>
    </div>
  );
}

function MainOeuvreView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        👷 Main d'œuvre CCQ
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Gestion des heures et conformité CCQ</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
          {['Charpentier-menuisier', 'Électricien', 'Plombier'].map((metier, i) => (
            <div key={i} style={{ background: '#1e2420', padding: 16, borderRadius: 8 }}>
              <div style={{ color: '#e8e4dc', fontWeight: 500 }}>{metier}</div>
              <div style={{ color: '#4ade80', fontSize: 13 }}>Taux: Variable CCQ</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuriteView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🦺 Santé et Sécurité CNESST
      </h2>
      <div style={{ 
        background: '#7f1d1d20', 
        border: '1px solid #ef4444', 
        borderRadius: 8, 
        padding: 16, 
        marginBottom: 20 
      }}>
        <div style={{ color: '#ef4444', fontWeight: 600 }}>⚠️ Sécurité prioritaire</div>
        <div style={{ color: '#fca5a5', fontSize: 13 }}>
          Toutes les normes CNESST doivent être respectées sur les chantiers
        </div>
      </div>
      <div style={{ color: '#6b6560' }}>
        Gestion des rapports de sécurité, incidents et conformité CNESST
      </div>
    </div>
  );
}

function ConformiteView() {
  const regulations = [
    { 
      name: 'RBQ - Régie du bâtiment', 
      status: 'Conforme', 
      expiry: '2026-03-15',
      license: '8374-2847-38'
    },
    { 
      name: 'CCQ - Commission construction', 
      status: 'Conforme', 
      expiry: '2025-12-31',
      license: 'CCQ-2024-1847'
    },
    { 
      name: 'CNESST - Santé sécurité', 
      status: 'À vérifier', 
      expiry: '2025-12-20',
      license: 'CNESST-QC-3847'
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🍁 Conformité Québec
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {regulations.map((reg, i) => (
          <div key={i} style={{
            background: '#1e2420',
            borderRadius: 12,
            padding: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ color: '#e8e4dc', fontWeight: 600 }}>{reg.name}</div>
              <div style={{ color: '#6b6560', fontSize: 13 }}>Licence: {reg.license}</div>
              <div style={{ color: '#6b6560', fontSize: 13 }}>Expiration: {reg.expiry}</div>
            </div>
            <StatusBadge 
              label={reg.status} 
              status={reg.status === 'Conforme' ? 'valid' : 'warning'} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function InspectionsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🔍 Inspections
      </h2>
      <div style={{ color: '#6b6560' }}>
        Planification et suivi des inspections obligatoires
      </div>
    </div>
  );
}
