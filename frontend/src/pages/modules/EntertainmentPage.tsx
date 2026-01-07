/**
 * CHE·NU V26 - MODULE ENTERTAINMENT
 * Streaming, Gaming et Divertissement
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
  { id: 'dashboard', label: 'Accueil', icon: '🏠', path: '/entertainment/dashboard' },
  { id: 'streaming', label: 'Streaming', icon: '📺', path: '/entertainment/streaming' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', path: '/entertainment/gaming' },
  { id: 'music', label: 'Musique', icon: '🎵', path: '/entertainment/musique' },
  { id: 'podcasts', label: 'Podcasts', icon: '🎙️', path: '/entertainment/podcasts' },
  { id: 'events', label: 'Événements', icon: '🎪', path: '/entertainment/evenements' },
  { id: 'social', label: 'Social', icon: '💬', path: '/entertainment/social' },
  { id: 'collections', label: 'Collections', icon: '📚', path: '/entertainment/collections' },
];

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function EntertainmentPage() {
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
          🎬 Entertainment Hub
        </h1>
        <p style={{ fontSize: 14, color: '#6b6560', margin: '8px 0 0' }}>
          Streaming, gaming, musique et plus encore
        </p>
      </div>

      {/* Featured Content Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)',
        borderRadius: 16,
        padding: 32,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            background: '#fff20', 
            padding: '4px 12px', 
            borderRadius: 4, 
            fontSize: 11,
            display: 'inline-block',
            marginBottom: 12,
            color: '#fef3c7',
            fontWeight: 600
          }}>
            🔥 TENDANCE
          </div>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>
            Live Stream: Tech Talk CHE·NU
          </h2>
          <p style={{ color: '#fed7aa', fontSize: 14, margin: '0 0 16px' }}>
            Rejoignez-nous pour une discussion sur l'avenir de l'IA
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#7c2d12',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer',
            }}>
              ▶ Regarder
            </button>
            <button style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              + Ajouter à la liste
            </button>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          right: 40,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 120,
          opacity: 0.3,
        }}>
          📺
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
              background: isActive ? '#ea580c' : '#1e2420',
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
          <Route index element={<EntertainmentDashboard />} />
          <Route path="/dashboard" element={<EntertainmentDashboard />} />
          <Route path="/streaming" element={<StreamingView />} />
          <Route path="/gaming" element={<GamingView />} />
          <Route path="/musique" element={<MusiqueView />} />
          <Route path="/podcasts" element={<PodcastsView />} />
          <Route path="/evenements" element={<EvenementsView />} />
          <Route path="/social" element={<SocialView />} />
          <Route path="/collections" element={<CollectionsView />} />
        </Routes>
      </div>
    </div>
  );
}

/* =====================================================
   DASHBOARD
   ===================================================== */

function EntertainmentDashboard() {
  const quickAccess = [
    { title: 'Continuer à regarder', icon: '▶️', count: 5 },
    { title: 'Playlist en cours', icon: '🎵', count: 23 },
    { title: 'Parties en attente', icon: '🎮', count: 2 },
    { title: 'Événements à venir', icon: '📅', count: 3 },
  ];

  const recentContent = [
    { 
      title: 'The Great AI Documentary',
      type: 'Film',
      progress: 65,
      duration: '2h 15min',
      poster: '🎬'
    },
    { 
      title: 'Tech Weekly Podcast',
      type: 'Podcast',
      progress: 100,
      duration: '45min',
      poster: '🎙️'
    },
    { 
      title: 'Cyber Racing 2077',
      type: 'Jeu',
      progress: 40,
      duration: '12h jouées',
      poster: '🎮'
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        Bienvenue dans Entertainment Hub
      </h2>

      {/* Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {quickAccess.map((item, i) => (
          <div key={i} style={{ 
            background: '#1e2420', 
            padding: 20, 
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 14, color: '#e8e4dc', fontWeight: 500 }}>{item.title}</div>
            <div style={{ fontSize: 24, color: '#ea580c', fontWeight: 700, marginTop: 4 }}>{item.count}</div>
          </div>
        ))}
      </div>

      {/* Continue Watching */}
      <div style={{ background: '#1e2420', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e8e4dc', margin: '0 0 16px' }}>
          🕐 Reprendre
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {recentContent.map((content, i) => (
            <div key={i} style={{
              background: '#121614',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
            }}>
              <div style={{
                height: 120,
                background: 'linear-gradient(135deg, #1e2420 0%, #2a2a2a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
              }}>
                {content.poster}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ color: '#ea580c', fontSize: 11, marginBottom: 4 }}>{content.type}</div>
                <div style={{ color: '#e8e4dc', fontWeight: 600, marginBottom: 8 }}>{content.title}</div>
                
                {/* Progress bar */}
                <div style={{ background: '#2a2a2a', borderRadius: 4, height: 4, marginBottom: 8, overflow: 'hidden' }}>
                  <div style={{
                    width: `${content.progress}%`,
                    height: '100%',
                    background: content.progress === 100 ? '#4ade80' : '#ea580c',
                    borderRadius: 4,
                  }} />
                </div>
                
                <div style={{ fontSize: 12, color: '#6b6560' }}>{content.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   STREAMING VIEW
   ===================================================== */

function StreamingView() {
  const categories = ['Tous', 'Films', 'Séries', 'Documentaires', 'Live', 'Sports'];
  const [activeCategory, setActiveCategory] = useState('Tous');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: 0 }}>
          📺 Streaming
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px',
                background: activeCategory === cat ? '#ea580c' : 'transparent',
                color: activeCategory === cat ? '#fff' : '#6b6560',
                border: activeCategory === cat ? 'none' : '1px solid #2a2a2a',
                borderRadius: 6,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ color: '#6b6560' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {['Film 1', 'Série A', 'Doc B', 'Live C'].map((item, i) => (
            <div key={i} style={{
              background: '#1e2420',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎬</div>
              <div style={{ color: '#e8e4dc' }}>{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   GAMING VIEW
   ===================================================== */

function GamingView() {
  const games = [
    { name: 'Cyber Quest', platform: 'PC', lastPlayed: 'Hier', hours: 45 },
    { name: 'Space Explorer', platform: 'Console', lastPlayed: '3 jours', hours: 120 },
    { name: 'Puzzle Master', platform: 'Mobile', lastPlayed: 'Aujourd\'hui', hours: 8 },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🎮 Ma bibliothèque de jeux
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {games.map((game, i) => (
          <div key={i} style={{
            background: '#1e2420',
            borderRadius: 12,
            padding: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎮</div>
            <div style={{ color: '#e8e4dc', fontWeight: 600, fontSize: 16 }}>{game.name}</div>
            <div style={{ color: '#6b6560', fontSize: 13, marginTop: 4 }}>{game.platform}</div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: 12,
              padding: '8px 0',
              borderTop: '1px solid #2a2a2a',
            }}>
              <span style={{ color: '#6b6560', fontSize: 12 }}>Dernière partie: {game.lastPlayed}</span>
              <span style={{ color: '#ea580c', fontSize: 12 }}>{game.hours}h</span>
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

function MusiqueView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🎵 Musique
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Vos playlists, artistes favoris et découvertes musicales</p>
      </div>
    </div>
  );
}

function PodcastsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🎙️ Podcasts
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Vos podcasts favoris et recommandations</p>
      </div>
    </div>
  );
}

function EvenementsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        🎪 Événements
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Concerts, festivals, événements live à venir</p>
      </div>
    </div>
  );
}

function SocialView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        💬 Social Entertainment
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Partagez vos découvertes avec vos amis</p>
      </div>
    </div>
  );
}

function CollectionsView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e8e4dc', margin: '0 0 20px' }}>
        📚 Mes Collections
      </h2>
      <div style={{ color: '#6b6560' }}>
        <p>Organisez votre contenu en collections personnalisées</p>
      </div>
    </div>
  );
}
