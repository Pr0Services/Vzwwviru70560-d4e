/**
 * CHE·NU V26 - MODULE XR IMMERSIVE
 * Portail d'entrée vers l'univers XR immersif
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
  { id: 'lobby', label: 'Lobby', icon: '🏛️', path: '/xr/lobby' },
  { id: 'universe', label: 'Mon Univers', icon: '🌌', path: '/xr/univers' },
  { id: 'meetings', label: 'Salles Réunion', icon: '🤝', path: '/xr/reunions' },
  { id: 'avatar', label: 'Mon Avatar', icon: '👤', path: '/xr/avatar' },
  { id: 'worlds', label: 'Mondes', icon: '🌍', path: '/xr/mondes' },
  { id: 'portals', label: 'Portails', icon: '🚪', path: '/xr/portails' },
  { id: 'replay', label: 'Replay', icon: '⏮️', path: '/xr/replay' },
  { id: 'settings', label: 'Paramètres XR', icon: '⚙️', path: '/xr/parametres' },
];

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function XRImmersivePage() {
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
          🌌 XR Immersive
        </h1>
        <p style={{ fontSize: 14, color: '#6b6560', margin: '8px 0 0' }}>
          Votre portail vers l'univers immersif CHE·NU
        </p>
      </div>

      {/* XR Status Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #292524 100%)',
        borderRadius: 16,
        padding: 32,
        marginBottom: 24,
        border: '1px solid #3EB4A2',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, #3EB4A220 0%, transparent 50%), radial-gradient(circle at 70% 50%, #D8B26A20 0%, transparent 50%)',
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                marginBottom: 12
              }}>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 10px #4ade80',
                  animation: 'pulse 2s infinite',
                }} />
                <span style={{ color: '#4ade80', fontSize: 14, fontWeight: 600 }}>XR Ready</span>
              </div>
              <h2 style={{ color: '#e8e4dc', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>
                Bienvenue dans votre Univers
              </h2>
              <p style={{ color: '#a8a29e', fontSize: 14, margin: 0 }}>
                Explorez vos espaces, rencontrez vos agents, et naviguez en immersion
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #3EB4A2 0%, #2F4C39 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                🥽 Entrer en VR
              </button>
              <button style={{
                padding: '14px 28px',
                background: 'transparent',
                color: '#D8B26A',
                border: '2px solid #D8B26A',
                borderRadius: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                🖥️ Mode Desktop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick XR Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <XRStatCard icon="🌍" label="Mondes visités" value="12" />
        <XRStatCard icon="⏱️" label="Heures en XR" value="47h" />
        <XRStatCard icon="🤝" label="Réunions XR" value="23" />
        <XRStatCard icon="👤" label="Avatars créés" value="3" />
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
          <Route index element={<XRLobby />} />
          <Route path="/lobby" element={<XRLobby />} />
          <Route path="/univers" element={<UniversView />} />
          <Route path="/reunions" element={<MeetingsView />} />
          <Route path="/avatar" element={<AvatarView />} />
          <Route path="/mondes" element={<WorldsView />} />
          <Route path="/portails" element={<PortalsView />} />
          <Route path="/replay" element={<ReplayView />} />
          <Route path="/parametres" element={<SettingsView />} />
        </Routes>
      </div>
    </div>
  );
}

/* =====================================================
   STAT CARD COMPONENT
   ===================================================== */

function XRStatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      background: '#1e2420',
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{
        width: 50,
        height: 50,
        borderRadius: 12,
        background: '#3EB4A220',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#e8e4dc' }}>{value}</div>
        <div style={{ fontSize: 13, color: '#6b6560' }}>{label}</div>
      </div>
    </div>
  );
}

/* =====================================================
   XR LOBBY
   ===================================================== */

function XRLobby() {
  const quickActions = [
    { icon: '🏠', label: 'Ma Maison', description: 'Votre espace personnel XR' },
    { icon: '💼', label: 'Bureau XR', description: 'Espace de travail immersif' },
    { icon: '🤝', label: 'Salle de réunion', description: 'Rencontrer des collaborateurs' },
    { icon: '🌌', label: 'Explorer', description: 'Découvrir de nouveaux mondes' },
  ];

  const recentSessions = [
    { name: 'Réunion équipe projet', date: 'Hier, 14:00', duration: '45min', participants: 5 },
    { name: 'Présentation client', date: '12 déc, 10:00', duration: '1h20', participants: 8 },
    { name: 'Formation XR', date: '10 déc, 15:30', duration: '2h', participants: 12 },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🏛️ Lobby XR
      </h2>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {quickActions.map((action, i) => (
          <div key={i} style={{
            background: '#1e2420',
            borderRadius: 16,
            padding: 24,
            cursor: 'pointer',
            transition: 'all 0.3s',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3EB4A2';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>{action.icon}</div>
            <div style={{ color: '#e8e4dc', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
              {action.label}
            </div>
            <div style={{ color: '#6b6560', fontSize: 13 }}>{action.description}</div>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div style={{ background: '#1e2420', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc', margin: '0 0 16px' }}>
          ⏱️ Sessions récentes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recentSessions.map((session, i) => (
            <div key={i} style={{
              background: '#121614',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ color: '#e8e4dc', fontWeight: 500 }}>{session.name}</div>
                <div style={{ color: '#6b6560', fontSize: 12 }}>{session.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ color: '#3EB4A2', fontSize: 13 }}>👥 {session.participants}</span>
                <span style={{ color: '#6b6560', fontSize: 13 }}>{session.duration}</span>
                <button style={{
                  padding: '6px 12px',
                  background: '#3EB4A220',
                  color: '#3EB4A2',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: 'pointer',
                }}>
                  ⏮️ Replay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   UNIVERSE VIEW
   ===================================================== */

function UniversView() {
  const spheres = [
    { name: 'Maison', emoji: '🏠', color: '#3F7249', active: true },
    { name: 'Entreprise', emoji: '🏢', color: '#3EB4A2', active: true },
    { name: 'Projets', emoji: '📋', color: '#D8B26A', active: true },
    { name: 'Creative', emoji: '🎨', color: '#a855f7', active: true },
    { name: 'Gouvernement', emoji: '🏛️', color: '#8D8371', active: false },
    { name: 'Immobilier', emoji: '🏠', color: '#7A593A', active: false },
    { name: 'Associations', emoji: '🤝', color: '#3F7249', active: true },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🌌 Mon Univers XR
      </h2>
      <p style={{ color: '#6b6560', marginBottom: 24 }}>
        Visualisez et naviguez entre vos sphères de vie en 3D
      </p>
      
      {/* Universe visualization placeholder */}
      <div style={{
        background: 'radial-gradient(ellipse at center, #1e2420 0%, #0c0a09 100%)',
        borderRadius: 16,
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 24,
        border: '1px solid #2a2a2a',
      }}>
        {/* Center - Nova */}
        <div style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D8B26A 0%, #8D8371 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          boxShadow: '0 0 40px #D8B26A40',
        }}>
          ✨
        </div>
        
        {/* Orbiting spheres representation */}
        {spheres.map((sphere, i) => {
          const angle = (i / spheres.length) * 2 * Math.PI;
          const radius = 150;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `calc(50% + ${x}px - 30px)`,
              top: `calc(50% + ${y}px - 30px)`,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: sphere.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              opacity: sphere.active ? 1 : 0.4,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: sphere.active ? `0 0 20px ${sphere.color}40` : 'none',
            }}>
              {sphere.emoji}
            </div>
          );
        })}
        
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          color: '#6b6560',
          fontSize: 12,
        }}>
          🎮 Cliquez sur une sphère pour y entrer
        </div>
      </div>

      {/* Sphere list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {spheres.map((sphere, i) => (
          <div key={i} style={{
            background: '#1e2420',
            borderRadius: 8,
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: sphere.active ? 1 : 0.5,
          }}>
            <span style={{ fontSize: 20 }}>{sphere.emoji}</span>
            <span style={{ color: '#e8e4dc', fontSize: 14 }}>{sphere.name}</span>
            {sphere.active && (
              <span style={{
                marginLeft: 'auto',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#4ade80',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   PLACEHOLDER VIEWS
   ===================================================== */

function MeetingsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🤝 Salles de Réunion XR
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Créez et rejoignez des réunions immersives</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
          {['Salle Boardroom', 'Espace Créatif', 'Salle Formation'].map((room, i) => (
            <div key={i} style={{ background: '#1e2420', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚪</div>
              <div style={{ color: '#e8e4dc', fontWeight: 500 }}>{room}</div>
              <button style={{
                marginTop: 12,
                padding: '8px 16px',
                background: '#3EB4A2',
                color: '#000',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}>
                Rejoindre
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AvatarView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        👤 Mon Avatar XR
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Personnalisez votre représentation dans l'univers XR</p>
      </div>
    </div>
  );
}

function WorldsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🌍 Explorer les Mondes
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Découvrez de nouveaux espaces XR créés par la communauté</p>
      </div>
    </div>
  );
}

function PortalsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🚪 Portails
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Gérez vos portails de navigation rapide entre espaces</p>
      </div>
    </div>
  );
}

function ReplayView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        ⏮️ Replay Sessions
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Revivez vos sessions XR passées en mode replay</p>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        ⚙️ Paramètres XR
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Configurez votre expérience XR</p>
        <ul style={{ marginTop: 16 }}>
          <li>Qualité graphique</li>
          <li>Confort de mouvement</li>
          <li>Audio spatial</li>
          <li>Accessibilité</li>
        </ul>
      </div>
    </div>
  );
}
