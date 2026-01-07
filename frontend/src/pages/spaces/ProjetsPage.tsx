/**
 * CHE·NU V26 - ESPACE PROJETS
 * Gestion de projets personnels et professionnels
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
  { id: 'dashboard', label: 'Tableau de bord', icon: '📊', path: '/projets/dashboard' },
  { id: 'liste', label: 'Mes projets', icon: '📋', path: '/projets/liste' },
  { id: 'kanban', label: 'Kanban', icon: '📌', path: '/projets/kanban' },
  { id: 'timeline', label: 'Timeline', icon: '📅', path: '/projets/timeline' },
  { id: 'equipes', label: 'Équipes', icon: '👥', path: '/projets/equipes' },
  { id: 'ressources', label: 'Ressources', icon: '📦', path: '/projets/ressources' },
  { id: 'budget', label: 'Budget', icon: '💰', path: '/projets/budget' },
  { id: 'rapports', label: 'Rapports', icon: '📈', path: '/projets/rapports' },
];

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function ProjetsPage() {
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
          📋 Mes Projets
        </h1>
        <p style={{ fontSize: 14, color: '#6b6560', margin: '8px 0 0' }}>
          Gérez vos projets personnels et professionnels
        </p>
      </div>

      {/* Quick Stats Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 24,
      }}>
        <QuickStatCard 
          icon="🚀" 
          label="Projets actifs" 
          value="8" 
          color="#3EB4A2" 
        />
        <QuickStatCard 
          icon="✅" 
          label="Tâches complétées" 
          value="42" 
          trend="+12 cette semaine"
          color="#4ade80" 
        />
        <QuickStatCard 
          icon="⏳" 
          label="En attente" 
          value="15" 
          color="#f59e0b" 
        />
        <QuickStatCard 
          icon="📅" 
          label="Échéances proches" 
          value="3" 
          color="#ef4444" 
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {sections.map((section) => (
          <NavLink
            key={section.id}
            to={section.path}
            style={({ isActive }) => ({
              padding: '10px 16px',
              background: isActive ? '#3EB4A2' : '#1e2420',
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
          <Route index element={<ProjetsDashboard />} />
          <Route path="/dashboard" element={<ProjetsDashboard />} />
          <Route path="/liste" element={<ProjetsListe />} />
          <Route path="/kanban" element={<KanbanView />} />
          <Route path="/timeline" element={<TimelineView />} />
          <Route path="/equipes" element={<EquipesView />} />
          <Route path="/ressources" element={<RessourcesView />} />
          <Route path="/budget" element={<BudgetView />} />
          <Route path="/rapports" element={<RapportsView />} />
        </Routes>
      </div>
    </div>
  );
}

/* =====================================================
   QUICK STAT CARD
   ===================================================== */

function QuickStatCard({ 
  icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: string; 
  label: string; 
  value: string; 
  trend?: string;
  color: string;
}) {
  return (
    <div style={{
      background: '#1e2420',
      borderRadius: 12,
      padding: 20,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc' }}>{value}</div>
          <div style={{ fontSize: 13, color: '#6b6560', marginTop: 4 }}>{label}</div>
          {trend && (
            <div style={{ fontSize: 11, color: color, marginTop: 4 }}>{trend}</div>
          )}
        </div>
        <span style={{ fontSize: 28 }}>{icon}</span>
      </div>
    </div>
  );
}

/* =====================================================
   DASHBOARD
   ===================================================== */

function ProjetsDashboard() {
  const recentProjects = [
    { 
      name: 'Refonte Site Web', 
      status: 'En cours', 
      progress: 65, 
      deadline: '2025-12-20',
      team: 4 
    },
    { 
      name: 'Application Mobile V2', 
      status: 'En cours', 
      progress: 40, 
      deadline: '2025-01-15',
      team: 6 
    },
    { 
      name: 'Migration Cloud', 
      status: 'Planifié', 
      progress: 10, 
      deadline: '2025-02-01',
      team: 3 
    },
  ];

  const upcomingDeadlines = [
    { task: 'Review design mockups', project: 'Refonte Site Web', date: 'Demain' },
    { task: 'Sprint planning', project: 'Application Mobile', date: 'Lun. 16 déc' },
    { task: 'Client presentation', project: 'Migration Cloud', date: 'Mar. 17 déc' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: 0 }}>
          Vue d'ensemble
        </h2>
        <button style={{
          padding: '10px 20px',
          background: '#3EB4A2',
          color: '#000',
          border: 'none',
          borderRadius: 8,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          + Nouveau projet
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Recent Projects */}
        <div style={{ background: '#1e2420', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#6b6560', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 1 }}>
            Projets récents
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recentProjects.map((project, i) => (
              <div key={i} style={{
                background: '#121614',
                borderRadius: 8,
                padding: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ color: '#e8e4dc', fontWeight: 600 }}>{project.name}</div>
                    <div style={{ color: '#6b6560', fontSize: 12, marginTop: 4 }}>
                      👥 {project.team} membres • 📅 {project.deadline}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    background: project.status === 'En cours' ? '#3EB4A220' : '#6b656020',
                    color: project.status === 'En cours' ? '#3EB4A2' : '#6b6560',
                    borderRadius: 6,
                    fontSize: 12,
                    height: 'fit-content',
                  }}>
                    {project.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    flex: 1, 
                    background: '#2a2a2a', 
                    borderRadius: 4, 
                    height: 6, 
                    overflow: 'hidden' 
                  }}>
                    <div style={{
                      width: `${project.progress}%`,
                      height: '100%',
                      background: project.progress > 50 ? '#4ade80' : '#3EB4A2',
                      borderRadius: 4,
                    }} />
                  </div>
                  <span style={{ color: '#e8e4dc', fontSize: 12, fontWeight: 600 }}>
                    {project.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div style={{ background: '#1e2420', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#6b6560', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 1 }}>
            Échéances à venir
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcomingDeadlines.map((item, i) => (
              <div key={i} style={{
                background: '#121614',
                borderRadius: 8,
                padding: 12,
                borderLeft: '3px solid #f59e0b',
              }}>
                <div style={{ color: '#e8e4dc', fontWeight: 500, fontSize: 14 }}>{item.task}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: '#6b6560', fontSize: 12 }}>{item.project}</span>
                  <span style={{ color: '#f59e0b', fontSize: 12 }}>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   PROJETS LISTE
   ===================================================== */

function ProjetsListe() {
  const projects = [
    { id: 1, name: 'Refonte Site Web', status: 'active', progress: 65, priority: 'high' },
    { id: 2, name: 'Application Mobile V2', status: 'active', progress: 40, priority: 'medium' },
    { id: 3, name: 'Migration Cloud', status: 'planned', progress: 10, priority: 'high' },
    { id: 4, name: 'Documentation API', status: 'active', progress: 80, priority: 'low' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: 0 }}>
          📋 Liste des projets
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input 
            type="search"
            placeholder="Rechercher..."
            style={{
              padding: '8px 16px',
              background: '#1e2420',
              border: '1px solid #2a2a2a',
              borderRadius: 6,
              color: '#e8e4dc',
              width: 200,
            }}
          />
          <select style={{
            padding: '8px 16px',
            background: '#1e2420',
            border: '1px solid #2a2a2a',
            borderRadius: 6,
            color: '#e8e4dc',
          }}>
            <option>Tous les statuts</option>
            <option>En cours</option>
            <option>Planifié</option>
            <option>Terminé</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {projects.map((project) => (
          <div key={project.id} style={{
            background: '#1e2420',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#e8e4dc', fontWeight: 600 }}>{project.name}</div>
            </div>
            <div style={{ width: 100 }}>
              <div style={{ background: '#2a2a2a', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{
                  width: `${project.progress}%`,
                  height: '100%',
                  background: '#3EB4A2',
                  borderRadius: 4,
                }} />
              </div>
              <div style={{ color: '#6b6560', fontSize: 11, marginTop: 4, textAlign: 'center' }}>
                {project.progress}%
              </div>
            </div>
            <span style={{
              padding: '4px 10px',
              background: project.priority === 'high' ? '#ef444420' : project.priority === 'medium' ? '#f59e0b20' : '#4ade8020',
              color: project.priority === 'high' ? '#ef4444' : project.priority === 'medium' ? '#f59e0b' : '#4ade80',
              borderRadius: 6,
              fontSize: 11,
              textTransform: 'uppercase',
            }}>
              {project.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   KANBAN VIEW
   ===================================================== */

function KanbanView() {
  const columns = [
    { id: 'todo', title: 'À faire', color: '#6b6560', tasks: ['Tâche 1', 'Tâche 2'] },
    { id: 'progress', title: 'En cours', color: '#3EB4A2', tasks: ['Tâche 3', 'Tâche 4', 'Tâche 5'] },
    { id: 'review', title: 'En revue', color: '#f59e0b', tasks: ['Tâche 6'] },
    { id: 'done', title: 'Terminé', color: '#4ade80', tasks: ['Tâche 7', 'Tâche 8'] },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📌 Vue Kanban
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {columns.map((column) => (
          <div key={column.id} style={{ background: '#1e2420', borderRadius: 12, padding: 16 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: `2px solid ${column.color}`,
            }}>
              <div style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: column.color 
              }} />
              <span style={{ color: '#e8e4dc', fontWeight: 600, fontSize: 14 }}>
                {column.title}
              </span>
              <span style={{ 
                marginLeft: 'auto', 
                background: '#2a2a2a', 
                padding: '2px 8px', 
                borderRadius: 10, 
                fontSize: 12, 
                color: '#6b6560' 
              }}>
                {column.tasks.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {column.tasks.map((task, i) => (
                <div key={i} style={{
                  background: '#121614',
                  padding: 12,
                  borderRadius: 8,
                  color: '#e8e4dc',
                  fontSize: 14,
                  cursor: 'grab',
                }}>
                  {task}
                </div>
              ))}
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

function TimelineView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📅 Timeline / Gantt
      </h2>
      <div style={{ color: '#6b6560' }}>
        Vue chronologique des projets et jalons
      </div>
    </div>
  );
}

function EquipesView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        👥 Équipes
      </h2>
      <div style={{ color: '#6b6560' }}>
        Gestion des équipes et allocation des ressources
      </div>
    </div>
  );
}

function RessourcesView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📦 Ressources
      </h2>
      <div style={{ color: '#6b6560' }}>
        Documents, fichiers et assets des projets
      </div>
    </div>
  );
}

function BudgetView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        💰 Budget
      </h2>
      <div style={{ color: '#6b6560' }}>
        Suivi budgétaire et dépenses par projet
      </div>
    </div>
  );
}

function RapportsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📈 Rapports
      </h2>
      <div style={{ color: '#6b6560' }}>
        Rapports de performance et analytics des projets
      </div>
    </div>
  );
}
