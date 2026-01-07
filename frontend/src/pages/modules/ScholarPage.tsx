/**
 * CHE·NU V26 - MODULE SCHOLAR
 * Apprentissage, Recherche et Gestion des Connaissances
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
  { id: 'dashboard', label: 'Tableau de bord', icon: '📊', path: '/scholar/dashboard' },
  { id: 'courses', label: 'Formations', icon: '📚', path: '/scholar/formations' },
  { id: 'research', label: 'Recherche', icon: '🔬', path: '/scholar/recherche' },
  { id: 'library', label: 'Bibliothèque', icon: '📖', path: '/scholar/bibliotheque' },
  { id: 'notes', label: 'Notes', icon: '📝', path: '/scholar/notes' },
  { id: 'certifications', label: 'Certifications', icon: '🏆', path: '/scholar/certifications' },
  { id: 'mentors', label: 'Mentorat', icon: '👨‍🏫', path: '/scholar/mentorat' },
  { id: 'progress', label: 'Progression', icon: '📈', path: '/scholar/progression' },
];

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function ScholarPage() {
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
          📚 Scholar - Apprentissage
        </h1>
        <p style={{ fontSize: 14, color: '#6b6560', margin: '8px 0 0' }}>
          Votre espace de connaissance, recherche et développement personnel
        </p>
      </div>

      {/* Learning Progress Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        border: '1px solid #6366f1'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%', 
              background: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24
            }}>
              🎓
            </div>
            <div>
              <div style={{ color: '#e8e4dc', fontWeight: 600, fontSize: 18 }}>Niveau: Explorateur</div>
              <div style={{ color: '#a5b4fc', fontSize: 13 }}>2,450 XP • 15 cours complétés</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#e8e4dc', fontSize: 24, fontWeight: 700 }}>72%</div>
            <div style={{ color: '#a5b4fc', fontSize: 12 }}>Progression hebdomadaire</div>
          </div>
        </div>
        <div style={{ marginTop: 16, background: '#1e1b4b', borderRadius: 4, height: 8, overflow: 'hidden' }}>
          <div style={{
            width: '72%',
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            borderRadius: 4,
          }} />
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
              background: isActive ? '#6366f1' : '#1e2420',
              color: isActive ? '#fff' : '#a8a29e',
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
          <Route index element={<ScholarDashboard />} />
          <Route path="/dashboard" element={<ScholarDashboard />} />
          <Route path="/formations" element={<FormationsView />} />
          <Route path="/recherche" element={<RechercheView />} />
          <Route path="/bibliotheque" element={<BibliothequeView />} />
          <Route path="/notes" element={<NotesView />} />
          <Route path="/certifications" element={<CertificationsView />} />
          <Route path="/mentorat" element={<MentoratView />} />
          <Route path="/progression" element={<ProgressionView />} />
        </Routes>
      </div>
    </div>
  );
}

/* =====================================================
   DASHBOARD
   ===================================================== */

function ScholarDashboard() {
  const stats = [
    { label: 'Heures d\'apprentissage', value: '142h', icon: '⏱️', trend: '+12h' },
    { label: 'Cours en cours', value: '3', icon: '📖', trend: 'actifs' },
    { label: 'Certifications', value: '5', icon: '🏆', trend: '+1' },
    { label: 'Notes prises', value: '247', icon: '📝', trend: '+23' },
  ];

  const currentCourses = [
    { 
      title: 'TypeScript Avancé', 
      provider: 'CHE·NU Learn',
      progress: 65, 
      nextLesson: 'Generics avancés',
      timeLeft: '4h restantes'
    },
    { 
      title: 'Architecture Logicielle', 
      provider: 'Udemy',
      progress: 30, 
      nextLesson: 'Microservices',
      timeLeft: '12h restantes'
    },
    { 
      title: 'Gestion de Projet Agile', 
      provider: 'LinkedIn Learning',
      progress: 90, 
      nextLesson: 'Examen final',
      timeLeft: '1h restante'
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        Tableau de bord Apprentissage
      </h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: '#1e2420', padding: 20, borderRadius: 12 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#e8e4dc' }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: '#6b6560' }}>{stat.label}</div>
            <div style={{ fontSize: 12, color: '#6366f1', marginTop: 4 }}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Current Courses */}
      <div style={{ background: '#1e2420', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc', margin: '0 0 16px' }}>
          📚 Formations en cours
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {currentCourses.map((course, i) => (
            <div key={i} style={{
              background: '#121614',
              borderRadius: 8,
              padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ color: '#e8e4dc', fontWeight: 600 }}>{course.title}</div>
                  <div style={{ color: '#6b6560', fontSize: 12 }}>{course.provider}</div>
                </div>
                <div style={{ color: '#6366f1', fontWeight: 600 }}>{course.progress}%</div>
              </div>
              
              <div style={{ background: '#2a2a2a', borderRadius: 4, height: 6, marginBottom: 8, overflow: 'hidden' }}>
                <div style={{
                  width: `${course.progress}%`,
                  height: '100%',
                  background: course.progress > 80 ? '#4ade80' : '#6366f1',
                  borderRadius: 4,
                }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#a5b4fc' }}>Prochaine: {course.nextLesson}</span>
                <span style={{ color: '#6b6560' }}>{course.timeLeft}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   FORMATIONS VIEW
   ===================================================== */

function FormationsView() {
  const formations = [
    { 
      title: 'Intelligence Artificielle Fondamentale',
      category: 'IA & ML',
      duration: '20h',
      level: 'Intermédiaire',
      rating: 4.8
    },
    { 
      title: 'React & TypeScript Mastery',
      category: 'Développement',
      duration: '15h',
      level: 'Avancé',
      rating: 4.9
    },
    { 
      title: 'Leadership & Management',
      category: 'Business',
      duration: '8h',
      level: 'Tous niveaux',
      rating: 4.6
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: 0 }}>
          📚 Catalogue de formations
        </h2>
        <input 
          type="search" 
          placeholder="Rechercher une formation..."
          style={{
            padding: '10px 16px',
            background: '#1e2420',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            color: '#e8e4dc',
            width: 300,
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {formations.map((formation, i) => (
          <div key={i} style={{
            background: '#1e2420',
            borderRadius: 12,
            padding: 20,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <div style={{ 
              background: '#6366f120', 
              color: '#a5b4fc', 
              padding: '4px 8px', 
              borderRadius: 4, 
              fontSize: 11,
              display: 'inline-block',
              marginBottom: 12
            }}>
              {formation.category}
            </div>
            <div style={{ color: '#e8e4dc', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
              {formation.title}
            </div>
            <div style={{ display: 'flex', gap: 16, color: '#6b6560', fontSize: 13 }}>
              <span>⏱️ {formation.duration}</span>
              <span>📊 {formation.level}</span>
            </div>
            <div style={{ marginTop: 12, color: '#f59e0b' }}>
              ⭐ {formation.rating}
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

function RechercheView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🔬 Recherche & Documentation
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Outils de recherche et gestion de documentation académique</p>
        <ul style={{ marginTop: 16 }}>
          <li>Recherche dans les bases de données</li>
          <li>Gestion des références</li>
          <li>Export citations (APA, MLA, Chicago)</li>
          <li>Intégration Zotero</li>
        </ul>
      </div>
    </div>
  );
}

function BibliothequeView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📖 Bibliothèque personnelle
      </h2>
      <div style={{ color: '#6b6560' }}>
        Votre collection de ressources d'apprentissage
      </div>
    </div>
  );
}

function NotesView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📝 Notes de cours
      </h2>
      <div style={{ color: '#6b6560' }}>
        Prenez et organisez vos notes d'apprentissage
      </div>
    </div>
  );
}

function CertificationsView() {
  const certifications = [
    { name: 'AWS Solutions Architect', status: 'Obtenue', date: '2024-06-15', badge: '🏅' },
    { name: 'Google Cloud Professional', status: 'En cours', date: 'Examen: 2025-01-10', badge: '📜' },
    { name: 'Scrum Master (CSM)', status: 'Obtenue', date: '2024-03-20', badge: '🏅' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🏆 Mes certifications
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {certifications.map((cert, i) => (
          <div key={i} style={{
            background: '#1e2420',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <span style={{ fontSize: 32 }}>{cert.badge}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#e8e4dc', fontWeight: 600 }}>{cert.name}</div>
              <div style={{ color: '#6b6560', fontSize: 12 }}>{cert.date}</div>
            </div>
            <span style={{
              padding: '4px 10px',
              background: cert.status === 'Obtenue' ? '#4ade8020' : '#6366f120',
              color: cert.status === 'Obtenue' ? '#4ade80' : '#a5b4fc',
              borderRadius: 6,
              fontSize: 12,
            }}>
              {cert.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentoratView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        👨‍🏫 Programme de mentorat
      </h2>
      <div style={{ color: '#6b6560' }}>
        Connectez-vous avec des mentors et apprenez de leur expérience
      </div>
    </div>
  );
}

function ProgressionView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📈 Ma progression
      </h2>
      <div style={{ color: '#6b6560' }}>
        Visualisez votre parcours d'apprentissage et vos accomplissements
      </div>
    </div>
  );
}
